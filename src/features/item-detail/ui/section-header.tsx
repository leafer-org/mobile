import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  title: string;
};

export function SectionHeader({ title }: Props) {
  return (
    <View className="border-b border-stone-200 dark:border-stone-800 pb-2 mb-1">
      <Text className="text-base font-semibold text-stone-900 dark:text-white">
        {title}
      </Text>
    </View>
  );
}
