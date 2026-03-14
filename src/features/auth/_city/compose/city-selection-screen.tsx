import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { useRegistrationDispatch } from '../../model/registration-store';
import { sortCitiesByProximity } from '../domain/sort-cities';
import type { City } from '../domain/types';
import { useCities } from '../model/use-cities';
import { useUserLocation } from '../model/use-user-location';
import { CityList } from '../ui/city-list';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

export function CitySelectionScreen({ onCitySelected }: { onCitySelected: () => void }) {
  const [selectedCity, setSelectedCity] = useState<City>();
  const [search, setSearch] = useState('');
  const citiesQuery = useCities();
  const location = useUserLocation();
  const registrationDispatch = useRegistrationDispatch();

  const sortedCities = useMemo(
    () => sortCitiesByProximity(citiesQuery.data ?? [], location.lat, location.lng),
    [citiesQuery.data, location.lat, location.lng],
  );

  const filteredCities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query.length === 0) return sortedCities;
    return sortedCities.filter((city) => city.name.toLowerCase().includes(query));
  }, [sortedCities, search]);

  const handleProceed = () => {
    if (!selectedCity) return;

    registrationDispatch({
      type: 'citySelected',
      cityId: selectedCity.id,
      lat: location.lat,
      lng: location.lng,
    });

    onCitySelected();
  };

  return (
    <ScreenLayout>
      <View className="flex-1">
        <Text variant="h2" className="mb-2">
          Выберите город
        </Text>
        <Text variant="caption" className="mb-4">
          Мы покажем актуальные предложения рядом с вами
        </Text>

        <View className="mb-3">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Поиск города..."
            autoCorrect={false}
          />
        </View>

        <View className="flex-1">
          <CityList
            cities={filteredCities}
            selectedCityId={selectedCity?.id}
            onSelect={setSelectedCity}
            isLoading={citiesQuery.isPending}
          />
        </View>

        <View className="pb-6 pt-3">
          <Button onPress={handleProceed} disabled={!selectedCity}>
            Продолжить
          </Button>
        </View>
      </View>
    </ScreenLayout>
  );
}
