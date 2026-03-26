import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useCities } from '@/features/auth/_city/model/use-cities';
import { useMe } from '@/support/user';

export type SelectedCity = {
  cityId: string;
  cityName: string;
};

export function useCity() {
  const me = useMe();
  const citiesQuery = useCities();
  const [city, setCityState] = useState<SelectedCity>({ cityId: '', cityName: '' });
  const initializedFromMe = useRef(false);

  const citiesMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of citiesQuery.data ?? []) {
      map.set(c.id, c.name);
    }
    return map;
  }, [citiesQuery.data]);

  useEffect(() => {
    if (initializedFromMe.current) return;
    if (me.data?.cityId) {
      initializedFromMe.current = true;
      const name = citiesMap.get(me.data.cityId) ?? '';
      setCityState({ cityId: me.data.cityId, cityName: name });
    }
  }, [me.data?.cityId, citiesMap]);

  // Дорезолвить имя, если города загрузились позже /me
  useEffect(() => {
    if (city.cityId && !city.cityName) {
      const name = citiesMap.get(city.cityId);
      if (name) {
        setCityState((prev) => ({ ...prev, cityName: name }));
      }
    }
  }, [city.cityId, city.cityName, citiesMap]);

  const setCity = useCallback((next: SelectedCity) => {
    initializedFromMe.current = true;
    setCityState(next);
  }, []);

  return { ...city, setCity };
}
