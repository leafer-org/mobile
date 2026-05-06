import { Text } from '@/kernel/ui/text';

export function ItemsSectionCaption({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <Text className="px-4 pt-5 pb-2 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
      Товары · {count}
    </Text>
  );
}
