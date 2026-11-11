import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Coordinates = {
  latitude: number;
  longitude: number;
  heading: number;
};

export type LocationPermissionStatus =
  | 'checking'
  | 'undetermined'
  | 'granted'
  | 'denied';

export function useLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);

  const [loading, setLoading] = useState(true);

  const [permissionStatus, setPermissionStatus] =
    useState<LocationPermissionStatus>('checking');

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const subscription = useRef<Location.LocationSubscription | null>(null);
  const initializeRef = useRef(false);

  const startTracking = useCallback(async () => {
    try {
      if (subscription.current) return;

      subscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 2,
        },
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading ?? 0,
          });
        },
      );

      setLoading(false);
    } catch {
      setLoading(false);
      setPermissionStatus('denied');
    }
  }, []);

  useEffect(() => {
    if (initializeRef.current) return;
    initializeRef.current = true;

    async function initialise() {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status === 'granted') {
          setPermissionStatus('granted');
          setShowPermissionModal(false);
          await startTracking();
          return;
        }

        if (status === 'denied') {
          setPermissionStatus('denied');
          setShowPermissionModal(false);
          setLoading(false);
          return;
        }

        setPermissionStatus('undetermined');
        setShowPermissionModal(true);
        setLoading(false);
      } catch {
        setPermissionStatus('denied');
        setShowPermissionModal(false);
        setLoading(false);
      }
    }

    initialise();

    return () => {
      subscription.current?.remove();
      subscription.current = null;
    };
  }, [startTracking]);

  const requestPermission = useCallback(async () => {
    try {
      setShowPermissionModal(false);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setPermissionStatus('granted');
        await startTracking();
      } else if (status === 'denied') {
        setPermissionStatus('denied');
        setLoading(false);
      }
    } catch {
      setPermissionStatus('denied');
      setLoading(false);
    }
  }, [startTracking]);

  return {
    location,
    loading,
    permissionStatus,
    showPermissionModal,
    requestPermission,
  };
}
