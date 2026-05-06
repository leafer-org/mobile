import { Pressable, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  title: string;
  subtitle?: string | null;
  onPress?: () => void;
};

export function ContextItemCard({ title, subtitle, onPress }: Props) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      className="mx-3 my-2 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
    >
      <Text className="text-xs text-stone-500 dark:text-stone-400">Обсуждается</Text>
      <Text className="text-sm font-medium text-stone-900 dark:text-white" numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-xs text-stone-600 dark:text-stone-400" numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </Wrapper>
  );
}
