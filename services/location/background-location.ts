import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import * as TaskManager from 'expo-task-manager';
import { AppState, Platform } from 'react-native';

import { BASE_URL } from '@/config/base-api';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import {
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '@/utils/token-storage';

export const BACKGROUND_LOCATION_TASK = 'c-ride-background-location';

const LOCATION_ENDPOINT = `${BASE_URL}/driver/location`;

const CONTEXT_KEY = 'backgroundTrackingContext';
const CONTEXT_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

type TrackingContext = {
  accessToken: string;
  refreshToken: string | null;
  driverId: string;
  orderId: string | null;
};

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

async function readContext(): Promise<TrackingContext | null> {
  try {
    const raw = await SecureStore.getItemAsync(CONTEXT_KEY, CONTEXT_OPTIONS);
    return raw ? (JSON.parse(raw) as TrackingContext) : null;
  } catch {
    return null;
  }
}

async function writeContext(context: TrackingContext) {
  await SecureStore.setItemAsync(
    CONTEXT_KEY,
    JSON.stringify(context),
    CONTEXT_OPTIONS,
  );
}

export async function updateTrackingContext(
  patch: Partial<TrackingContext>,
): Promise<void> {
  if (!isNative) return;

  const current = await readContext();
  const next = { ...current, ...patch } as TrackingContext;

  if (!next.accessToken || !next.driverId) return;

  try {
    await writeContext(next);
  } catch {}
}

async function refreshAccessToken(
  context: TrackingContext,
): Promise<string | null> {
  let mainRefreshToken: string | null;

  try {
    mainRefreshToken = await getRefreshToken();
  } catch {
    return null;
  }

  const refreshToken = mainRefreshToken ?? context.refreshToken;

  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const json = await response.json();
    const { accessToken, refreshToken: newRefreshToken } = json.data;

    await saveAccessToken(accessToken);
    await saveRefreshToken(newRefreshToken);
    await writeContext({
      ...context,
      accessToken,
      refreshToken: newRefreshToken,
    });

    return accessToken;
  } catch {
    return null;
  }
}

async function postLocation(
  context: TrackingContext,
  body: Record<string, unknown>,
) {
  const send = (token: string) =>
    fetch(LOCATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

  let response = await send(context.accessToken);

  if (response.status === 401) {
    const newToken = await refreshAccessToken(context);

    if (newToken) response = await send(newToken);
  }
}

TaskManager.defineTask<{ locations: Location.LocationObject[] }>(
  BACKGROUND_LOCATION_TASK,
  async ({ data, error }) => {
    if (error) {
      return;
    }

    if (AppState.currentState === 'active') return;

    const latest = data?.locations?.at(-1);

    if (!latest) return;

    const context = await readContext();

    if (!context) return;

    const payload = {
      driverId: context.driverId,
      orderId: context.orderId,
      lat: latest.coords.latitude,
      lng: latest.coords.longitude,
      heading: latest.coords.heading ?? 0,
      speed: latest.coords.speed,
      accuracy: latest.coords.accuracy,
      timestamp: latest.timestamp,
    };

    try {
      const socket = useDriverJobsStore.getState().socket;

      if (socket?.connected) {
        socket.emit('driver-location', payload);
        return;
      }

      await postLocation(context, payload);
    } catch {}
  },
);

export type BackgroundPermissionResult = 'granted' | 'foreground-only' | 'denied';

export async function getBackgroundPermissionStatus(): Promise<BackgroundPermissionResult> {
  if (!isNative) return 'denied';

  const foreground = await Location.getForegroundPermissionsAsync();

  if (foreground.status !== 'granted') return 'denied';

  const background = await Location.getBackgroundPermissionsAsync();

  return background.status === 'granted' ? 'granted' : 'foreground-only';
}

export async function requestBackgroundPermission(): Promise<BackgroundPermissionResult> {
  if (!isNative) return 'denied';

  const foreground = await Location.requestForegroundPermissionsAsync();

  if (foreground.status !== 'granted') return 'denied';

  const background = await Location.requestBackgroundPermissionsAsync();

  return background.status === 'granted' ? 'granted' : 'foreground-only';
}

export async function startBackgroundLocation(): Promise<boolean> {
  if (!isNative) return false;

  if ((await getBackgroundPermissionStatus()) !== 'granted') return false;

  const running = await Location.hasStartedLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
  ).catch(() => false);

  if (running) return true;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: 10_000,
    distanceInterval: 20,
    deferredUpdatesInterval: 10_000,
    pausesUpdatesAutomatically: false,
    activityType: Location.ActivityType.AutomotiveNavigation,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'C-Ride Driver is online',
      notificationBody:
        'Sharing your location so you can receive and complete deliveries.',
      notificationColor: '#D4AF37',
      killServiceOnDestroy: false,
    },
  });

  return true;
}

export async function stopBackgroundLocation(): Promise<void> {
  if (!isNative) return;

  const running = await Location.hasStartedLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
  ).catch(() => false);

  if (running) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
}

export async function clearBackgroundLocation(): Promise<void> {
  if (!isNative) return;

  await stopBackgroundLocation().catch(() => {});
  await SecureStore.deleteItemAsync(CONTEXT_KEY, CONTEXT_OPTIONS).catch(
    () => {},
  );
}
