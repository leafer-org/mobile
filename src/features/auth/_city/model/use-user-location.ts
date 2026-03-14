import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

interface UserLocationState {
  lat?: number;
  lng?: number;
  isLoading: boolean;
  permissionDenied: boolean;
}

export function useUserLocation(): UserLocationState {
  const [state, setState] = useState<UserLocationState>({
    isLoading: true,
    permissionDenied: false,
  });

  useEffect(() => {
    let cancelled = false;

    const requestLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        if (!cancelled) {
          setState({ isLoading: false, permissionDenied: true });
        }
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });

      if (!cancelled) {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isLoading: false,
          permissionDenied: false,
        });
      }
    };

    void requestLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
