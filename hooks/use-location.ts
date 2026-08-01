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

  const startTracking = useCallback(async () => {
    if (subscription.current) return;

    subscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5,
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
  }, []);

  useEffect(() => {
    async function initialise() {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status === 'granted') {
        setPermissionStatus('granted');
        startTracking();
        return;
      }

      if (status === 'denied') {
        setPermissionStatus('denied');
        setLoading(false);
        return;
      }

      setPermissionStatus('undetermined');
      setShowPermissionModal(true);
      setLoading(false);
    }

    initialise();

    return () => {
      subscription.current?.remove();
      subscription.current = null;
    };
  }, [startTracking]);

  const requestPermission = useCallback(async () => {
    setShowPermissionModal(false);

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      setPermissionStatus('granted');
      startTracking();
    } else {
      setPermissionStatus('denied');
    }
  }, [startTracking]);

  const dismissPermissionModal = useCallback(() => {
    setShowPermissionModal(false);
    setPermissionStatus('denied');
  }, []);

  return {
    location,
    loading,
    permissionStatus,
    showPermissionModal,
    requestPermission,
    dismissPermissionModal,
  };
}
