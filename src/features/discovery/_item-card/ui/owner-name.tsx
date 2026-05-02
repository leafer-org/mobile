import { Text } from '@/kernel/ui/text';

export function OwnerName({ name }: { name: string }) {
  return (
    <Text className="text-xs text-stone-500 dark:text-stone-500" numberOfLines={1}>
      {name}
    </Text>
  );
}
