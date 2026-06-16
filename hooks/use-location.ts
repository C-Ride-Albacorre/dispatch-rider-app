import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

type Coordinates = {
  latitude: number;
  longitude: number;
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

  async function fetchLocation() {
    setLoading(true);
    try {
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    } catch (error) {
      console.log('Location error', error);
    } finally {
      setLoading(false);
    }
  }

  // On mount: check existing permission status without triggering the system prompt
  useEffect(() => {
    async function checkPermission() {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          setPermissionStatus('granted');
          fetchLocation();
        } else if (status === 'denied') {
          setPermissionStatus('denied');
          setLoading(false);
        } else {
          // undetermined — show in-app explanation modal first
          setPermissionStatus('undetermined');
          setShowPermissionModal(true);
          setLoading(false);
        }
      } catch (error) {
        console.log('Permission check error', error);
        setPermissionStatus('undetermined');
        setShowPermissionModal(true);
        setLoading(false);
      }
    }

    checkPermission();
  }, []);

  // Called when user taps "Allow" in the in-app modal
  const requestPermission = useCallback(async () => {
    setShowPermissionModal(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionStatus('granted');
      fetchLocation();
    } else {
      setPermissionStatus('denied');
      setLoading(false);
    }
  }, []);

  // Called when user taps "Not Now" in the in-app modal
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
