import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useCities } from '@/features/auth/_city/model/use-cities';
import { useMe } from '@/support/user';

export type SelectedCity = {
  cityId: string;
  cityName: string;
};

const STORAGE_KEY = 'leafer_selected_city';

export function useCity() {
  const me = useMe();
  const citiesQuery = useCities();
  const [city, setCityState] = useState<SelectedCity>({ cityId: '', cityName: '' });
  const initialized = useRef(false);

  const citiesMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of citiesQuery.data ?? []) {
      map.set(c.id, c.name);
    }
    return map;
  }, [citiesQuery.data]);

  // Инициализация: сначала из AsyncStorage, потом из /me
  useEffect(() => {
    if (initialized.current) return;
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (initialized.current) return;
      if (stored) {
        initialized.current = true;
        const parsed = JSON.parse(stored) as SelectedCity;
        setCityState(parsed);
      } else if (me.data?.cityId) {
        initialized.current = true;
        const name = citiesMap.get(me.data.cityId) ?? '';
        setCityState({ cityId: me.data.cityId, cityName: name });
      }
    });
  }, [me.data?.cityId, citiesMap]);

  // Дорезолвить имя, если города загрузились позже
  useEffect(() => {
    if (city.cityId && !city.cityName) {
      const name = citiesMap.get(city.cityId);
      if (name) {
        const updated = { ...city, cityName: name };
        setCityState(updated);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    }
  }, [city.cityId, city.cityName, citiesMap]);

  const setCity = useCallback((next: SelectedCity) => {
    initialized.current = true;
    setCityState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  return { ...city, setCity };
}
