import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMe } from '@/support/user';
import { Text } from '@/kernel/ui/text';
import { findCounterpartParticipant, useInboxRealtime } from '@/support/chat';

import { useMyChats } from '../model/use-my-chats';
import { ClientChatListItem } from '../ui/client-chat-list-item';

export function MyChatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const myUserId = me.data?.id ?? null;

  const myChats = useMyChats();
  useInboxRealtime(myUserId ? `inbox:user:${myUserId}` : null);

  const items = useMemo(() => myChats.data?.chats ?? [], [myChats.data]);

  if (myChats.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-stone-900">
        <ActivityIndicator size="large" color="#a8a29e" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-stone-900">
      <View
        className="px-4 pb-3 border-b border-stone-200 dark:border-stone-800"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text variant="h2">Сообщения</Text>
      </View>
      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text variant="body" color="secondary" className="text-center">
            У вас пока нет диалогов. Напишите организации с экрана товара.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(c) => c.chatId}
          renderItem={({ item }) => {
            const cp = findCounterpartParticipant(item.participants, myUserId ?? '');
            const subject = cp?.subject;
            let counterpartLabel: string;
            let counterpartAvatarUrl: string | null = null;
            if (!subject) {
              counterpartLabel = cp ? 'Поддержка' : 'Чат';
            } else if (subject.kind === 'organization') {
              counterpartLabel = subject.name ?? 'Организация';
              counterpartAvatarUrl = subject.logoUrl ?? null;
            } else {
              counterpartLabel = subject.fullName ?? subject.id.slice(0, 6);
              counterpartAvatarUrl = subject.avatarUrl ?? null;
            }
            return (
              <ClientChatListItem
                item={item}
                counterpartLabel={counterpartLabel}
                counterpartAvatarUrl={counterpartAvatarUrl}
                onPress={() => router.push(`/chats/${item.chatId}`)}
              />
            );
          }}
        />
      )}
    </View>
  );
}
