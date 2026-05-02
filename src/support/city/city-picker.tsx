import { useMemo, useState } from 'react';
import { Modal, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCities } from '@/features/auth/_city/model/use-cities';
import { useUserLocation } from '@/features/auth/_city/model/use-user-location';
import { CityList } from '@/features/auth/_city/ui/city-list';
import { CitySearchInput } from '@/features/auth/_city/ui/city-search-input';
import { sortCitiesByProximity } from '@/features/auth/_city/domain/sort-cities';
import type { City } from '@/features/auth/_city/domain/types';
import { Text } from '@/kernel/ui/text';

import type { SelectedCity } from './use-city';

type Props = {
  cityId: string;
  cityName: string;
  onSelect: (city: SelectedCity) => void;
};

export function CityPicker({ cityId, cityName, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const citiesQuery = useCities();
  const location = useUserLocation();

  const sortedCities = useMemo(
    () => sortCitiesByProximity(citiesQuery.data ?? [], location.lat, location.lng),
    [citiesQuery.data, location.lat, location.lng],
  );

  const filteredCities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query.length === 0) return sortedCities;
    return sortedCities.filter((city) => city.name.toLowerCase().includes(query));
  }, [sortedCities, search]);

  const handleSelect = (city: City) => {
    onSelect({ cityId: city.id, cityName: city.name });
    setOpen(false);
    setSearch('');
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        className="flex-row items-center gap-1"
      >
        <Ionicons name="location-outline" size={16} color={isDark ? '#ffffff' : '#1c1917'} />
        <Text className="text-sm text-stone-900 dark:text-white">
          {cityName || 'Выберите город'}
        </Text>
        <Ionicons name="chevron-down" size={14} color="#a8a29e" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View
          className="flex-1 bg-white dark:bg-stone-900"
          style={{ paddingTop: insets.top }}
        >
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-stone-800">
            <Text variant="h3">Выберите город</Text>
            <TouchableOpacity onPress={() => setOpen(false)} hitSlop={8}>
              <Ionicons name="close" size={24} color="#a8a29e" />
            </TouchableOpacity>
          </View>

          <View className="px-4 py-3">
            <CitySearchInput value={search} onChangeText={setSearch} />
          </View>

          <View className="flex-1 px-4">
            <CityList
              cities={filteredCities}
              selectedCityId={cityId}
              onSelect={handleSelect}
              isLoading={citiesQuery.isPending}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
