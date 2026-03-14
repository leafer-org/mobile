import { useMemo, useState } from 'react';

import { sortCitiesByProximity } from '../domain/sort-cities';
import type { City } from '../domain/types';

export function useCitySelection({
  cities,
  lat,
  lng,
  onProceed,
}: {
  cities: City[];
  lat?: number;
  lng?: number;
  onProceed: (cityId: string, lat?: number, lng?: number) => void;
}) {
  const [selectedCity, setSelectedCity] = useState<City>();
  const [search, setSearch] = useState('');

  const sortedCities = useMemo(() => sortCitiesByProximity(cities, lat, lng), [cities, lat, lng]);

  const filteredCities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query.length === 0) return sortedCities;
    return sortedCities.filter((city) => city.name.toLowerCase().includes(query));
  }, [sortedCities, search]);

  const handleProceed = () => {
    if (!selectedCity) return;
    onProceed(selectedCity.id, lat, lng);
  };

  return {
    search,
    setSearch,
    filteredCities,
    selectedCity,
    setSelectedCity,
    handleProceed,
  };
}
