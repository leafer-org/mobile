import { useMemo, useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SelectedCity } from '../model/use-city';
import { useCities } from '@/features/auth/_city/model/use-cities';
import { useUserLocation } from '@/features/auth/_city/model/use-user-location';
import { CityList } from '@/features/auth/_city/ui/city-list';
import { CitySearchInput } from '@/features/auth/_city/ui/city-search-input';
import { sortCitiesByProximity } from '@/features/auth/_city/domain/sort-cities';
import type { City } from '@/features/auth/_city/domain/types';
import { Text } from '@/kernel/ui/text';

type Props = {
  visible: boolean;
  currentCityId: string;
  onSelect: (city: SelectedCity) => void;
  onClose: () => void;
};

export function CityPickerModal({ visible, currentCityId, onSelect, onClose }: Props) {
  const citiesQuery = useCities();
  const location = useUserLocation();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');

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
    onClose();
    setSearch('');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View
        className="flex-1 bg-white dark:bg-slate-900"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Text variant="h3">Выберите город</Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <View className="px-4 py-3">
          <CitySearchInput value={search} onChangeText={setSearch} />
        </View>

        <View className="flex-1 px-4">
          <CityList
            cities={filteredCities}
            selectedCityId={currentCityId}
            onSelect={handleSelect}
            isLoading={citiesQuery.isPending}
          />
        </View>
      </View>
    </Modal>
  );
}
