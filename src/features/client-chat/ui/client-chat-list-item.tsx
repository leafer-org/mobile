import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { Text } from '@/kernel/ui/text';
import type { ChatListItem } from '@/support/chat';

type Props = {
  item: ChatListItem;
  counterpartLabel: string;
  counterpartAvatarUrl?: string | null;
  onPress: () => void;
};

export function ClientChatListItem({ item, counterpartLabel, counterpartAvatarUrl, onPress }: Props) {
  const lastMsg = item.lastMessage;
  const previewText = lastMsg?.preview ?? '';

  const timeLabel = lastMsg
    ? new Date(lastMsg.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    : '';

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 flex-row items-center gap-3 active:bg-stone-100 dark:active:bg-stone-800 border-b border-stone-100 dark:border-stone-800"
    >
      <View className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-700 items-center justify-center overflow-hidden">
        {counterpartAvatarUrl ? (
          <Image source={{ uri: counterpartAvatarUrl }} style={{ width: 48, height: 48 }} contentFit="cover" />
        ) : (
          <Text variant="label">{counterpartLabel.slice(0, 1).toUpperCase()}</Text>
        )}
      </View>
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text variant="label" numberOfLines={1} className="flex-1">
            {counterpartLabel}
          </Text>
          {timeLabel ? (
            <Text variant="caption" className="ml-2">
              {timeLabel}
            </Text>
          ) : null}
        </View>
        <View className="flex-row items-center gap-2 mt-1">
          <Text variant="caption" numberOfLines={1} className="flex-1">
            {previewText || '—'}
          </Text>
          {item.myUnreadCount > 0 ? (
            <View className="bg-stone-900 dark:bg-white rounded-full min-w-5 h-5 items-center justify-center px-1.5">
              <Text className="text-white dark:text-stone-900 text-xs font-semibold">
                {item.myUnreadCount}
              </Text>
            </View>
          ) : null}
        </View>
        {item.status !== 'open' ? (
          <Text variant="caption" color="error" className="mt-0.5">
            {item.status === 'blocked' ? 'Заблокирован' : 'Закрыт'}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
