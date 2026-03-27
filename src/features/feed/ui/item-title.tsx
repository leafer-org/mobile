import { Text } from '@/kernel/ui/text';

export function ItemTitle({ title }: { title: string }) {
  return (
    <Text className="text-xs font-medium text-slate-900 dark:text-white" numberOfLines={2}>
      {title}
    </Text>
  );
}
