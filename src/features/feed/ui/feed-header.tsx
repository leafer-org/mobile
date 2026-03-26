import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AgeGroup } from '../domain/types';
import { AgeGroupToggle } from './age-group-toggle';
import { CitySelector } from './city-selector';

type Props = {
  cityName: string;
  ageGroup: AgeGroup;
  onCityPress: () => void;
  onAgeGroupChange: (value: AgeGroup) => void;
};

export function FeedHeader({ cityName, ageGroup, onCityPress, onAgeGroupChange }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 pb-3"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center justify-between">
        <CitySelector cityName={cityName} onPress={onCityPress} />
        <AgeGroupToggle value={ageGroup} onChange={onAgeGroupChange} />
      </View>
    </View>
  );
}
