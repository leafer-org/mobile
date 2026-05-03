import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  title: string;
  action?: { label: string; onPress: () => void };
  children: ReactNode;
};

export function SuggestionSection({ title, action, children }: Props) {
  return (
    <View className="gap-1 pb-2">
      <View className="flex-row items-center justify-between px-4 pt-3 pb-1">
        <Text className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
          {title}
        </Text>
        {action && (
          <Pressable onPress={action.onPress} hitSlop={6}>
            <Text className="text-xs text-stone-500 dark:text-stone-400">{action.label}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}
