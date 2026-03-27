import { Text } from '@/kernel/ui/text';

export function OwnerName({ name }: { name: string }) {
  return (
    <Text className="text-[10px] text-slate-500 dark:text-slate-400" numberOfLines={1}>
      {name}
    </Text>
  );
}
