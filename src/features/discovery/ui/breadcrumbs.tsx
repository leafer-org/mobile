import { Fragment } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

import type { BreadcrumbItem } from '../domain/breadcrumb';

type Props = {
  rootLabel?: string;
  items: BreadcrumbItem[];
  onRootPress?: () => void;
  onItemPress?: (index: number) => void;
};

export function Breadcrumbs({
  rootLabel = 'Каталог',
  items,
  onRootPress,
  onItemPress,
}: Props) {
  const lastIndex = items.length - 1;

  return (
    <View className="flex-row items-center flex-wrap" style={{ rowGap: 2 }}>
      {onRootPress ? (
        <TouchableOpacity onPress={onRootPress} hitSlop={4}>
          <Text className="text-xs text-stone-900 dark:text-white">{rootLabel}</Text>
        </TouchableOpacity>
      ) : (
        <Text className="text-xs text-stone-500 dark:text-stone-400">{rootLabel}</Text>
      )}
      {items.map((item, i) => {
        const isLast = i === lastIndex;
        const tappable = !isLast && onItemPress;
        return (
          <Fragment key={item.id}>
            <Text className="text-xs text-stone-400 dark:text-stone-500 px-1">/</Text>
            {tappable ? (
              <TouchableOpacity onPress={() => onItemPress(i)} hitSlop={4}>
                <Text className="text-xs text-stone-900 dark:text-white">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-xs text-stone-500 dark:text-stone-400">
                {item.name}
              </Text>
            )}
          </Fragment>
        );
      })}
    </View>
  );
}
