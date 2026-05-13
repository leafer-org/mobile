import { Pressable, View } from 'react-native';

import { Text } from '@/kernel/ui/text';
import type { ChatListItem } from '@/support/chat';

import { formatInboxTimestamp } from '../domain/inbox-timestamp';

type Props = {
  item: ChatListItem;
  myUserId: string | null;
  organizationId: string;
  onPress: () => void;
};

export function EmployeeChatListItem({ item, myUserId, organizationId, onPress }: Props) {
  const userParticipant = item.participants.find((p) => p.kind === 'user');
  const orgSlot = item.participants.find(
    (p) => p.kind === 'organization' && p.subjectId === organizationId,
  );
  const assignedToMe = orgSlot?.assignedUserId === myUserId;
  const isUnassigned = orgSlot && orgSlot.assignedUserId === null;

  const counterpartLabel = userParticipant?.subjectId
    ? `Клиент ${(userParticipant.subjectId as string).slice(0, 6)}`
    : 'Клиент';

  const timestampIso = item.lastMessage?.createdAt ?? item.updatedAt;
  const timestamp = formatInboxTimestamp(timestampIso);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 flex-row items-center gap-3 active:bg-stone-100 dark:active:bg-stone-800 border-b border-stone-100 dark:border-stone-800"
    >
      <View className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-700 items-center justify-center">
        <Text variant="label">К</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text variant="label" numberOfLines={1} className="flex-1">
            {counterpartLabel}
          </Text>
          {isUnassigned ? (
            <View className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900">
              <Text className="text-[10px] text-amber-900 dark:text-amber-100 font-medium">
                Не взят
              </Text>
            </View>
          ) : assignedToMe ? (
            <View className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900">
              <Text className="text-[10px] text-green-900 dark:text-green-100 font-medium">
                Я
              </Text>
            </View>
          ) : null}
          <Text variant="caption">{timestamp}</Text>
        </View>
        <View className="flex-row items-center gap-2 mt-0.5">
          <Text variant="caption" numberOfLines={1} className="flex-1">
            {item.lastMessage?.preview ?? '—'}
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
