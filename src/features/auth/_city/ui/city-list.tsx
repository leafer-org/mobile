import { FlatList, TouchableOpacity, View } from 'react-native';

import type { City } from '../domain/types';
import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

export function CityList({
  cities,
  selectedCityId,
  onSelect,
  isLoading,
}: {
  cities: City[];
  selectedCityId?: string;
  onSelect: (city: City) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Spinner className="py-10" text="Загрузка городов..." />;
  }

  return (
    <FlatList
      data={cities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CityItem
          city={item}
          selected={item.id === selectedCityId}
          onPress={() => onSelect(item)}
        />
      )}
      contentContainerStyle={{ paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

function CityItem({
  city,
  selected,
  onPress,
}: {
  city: City;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        className={cn(
          'flex-row items-center rounded-xl px-4 py-3',
          selected ? 'bg-stone-100 dark:bg-stone-800' : 'bg-transparent',
        )}
      >
        <View
          className={cn(
            'mr-3 h-5 w-5 items-center justify-center rounded-full border-2',
            selected
              ? 'border-stone-900 dark:border-white'
              : 'border-stone-300 dark:border-stone-600',
          )}
        >
          {selected && <View className="h-2.5 w-2.5 rounded-full bg-stone-900 dark:bg-white" />}
        </View>
        <Text variant="body">{city.name}</Text>
      </View>
    </TouchableOpacity>
  );
}
