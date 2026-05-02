import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AgeGroup } from '../domain/types';

const STORAGE_KEY = 'leafer_age_group';

export function useAgeGroup() {
  const [ageGroup, setAgeGroupState] = useState<AgeGroup>('adults');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === 'adults' || value === 'children') {
        setAgeGroupState(value);
      }
      setIsLoaded(true);
    });
  }, []);

  const setAgeGroup = useCallback((value: AgeGroup) => {
    setAgeGroupState(value);
    AsyncStorage.setItem(STORAGE_KEY, value);
  }, []);

  return { ageGroup, setAgeGroup, isLoaded };
}
