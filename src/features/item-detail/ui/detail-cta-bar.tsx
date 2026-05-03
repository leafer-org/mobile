import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';

type Props = {
  priceLabel: string | null;
  priceCaption?: string | null;
  ctaLabel: string;
  onCtaPress: () => void;
};

export function DetailCtaBar({ priceLabel, priceCaption, ctaLabel, onCtaPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-0 right-0 bottom-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 px-4 pt-3 flex-row items-center gap-3"
      style={{ paddingBottom: insets.bottom + 12 }}
    >
      {priceLabel ? (
        <View className="flex-1">
          <Text className="text-lg font-bold text-stone-900 dark:text-white">
            {priceLabel}
          </Text>
          {priceCaption ? (
            <Text className="text-xs text-stone-500 dark:text-stone-400">
              {priceCaption}
            </Text>
          ) : null}
        </View>
      ) : (
        <View className="flex-1" />
      )}
      <View className="flex-shrink-0">
        <Button variant="primary" onPress={onCtaPress}>
          {ctaLabel}
        </Button>
      </View>
    </View>
  );
}
