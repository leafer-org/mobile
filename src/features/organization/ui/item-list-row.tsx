import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type WidgetUnion = { type: string; [key: string]: unknown };

function extractTitle(widgets: readonly WidgetUnion[]): string {
  const baseInfo = widgets.find(
    (w): w is WidgetUnion & { title: string } =>
      w.type === 'base-info' && typeof (w as { title?: unknown }).title === 'string',
  );
  return baseInfo?.title || 'Без названия';
}

export type ItemListRowProps = {
  widgets: readonly WidgetUnion[];
  draftStatus: 'draft' | 'moderation-request' | 'rejected' | null;
  hasPublication: boolean;
  onPress?: () => void;
};

const STATUS_LABEL: Record<'draft' | 'moderation-request' | 'rejected', string> = {
  draft: 'Черновик',
  'moderation-request': 'На модерации',
  rejected: 'Отклонено',
};

export function ItemListRow({ widgets, draftStatus, hasPublication, onPress }: ItemListRowProps) {
  const title = extractTitle(widgets);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="rounded-xl border border-stone-200 dark:border-stone-700 p-4 gap-1"
    >
      <Text variant="h3" numberOfLines={1}>
        {title}
      </Text>
      <View className="flex-row gap-2">
        {hasPublication ? (
          <Text variant="caption" color="success">
            Опубликована
          </Text>
        ) : (
          <Text variant="caption" color="secondary">
            Не опубликована
          </Text>
        )}
        {draftStatus && draftStatus !== 'draft' && (
          <Text variant="caption" color="secondary">
            · {STATUS_LABEL[draftStatus]}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
