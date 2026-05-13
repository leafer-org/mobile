import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/kernel/ui/text';

type Props = {
  title: string;
  subtitle?: string | null;
  backButton?: ReactNode;
};

export function EmployeeChatHeader({ title, subtitle, backButton }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="px-2 pb-3 border-b border-stone-200 dark:border-stone-800 flex-row items-start gap-1"
      style={{ paddingTop: insets.top + 8 }}
    >
      {backButton}
      <View className="flex-1 pt-1.5">
        <Text variant="h3" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" className="mt-0.5">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
