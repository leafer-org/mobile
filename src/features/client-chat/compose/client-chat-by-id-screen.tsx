import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMe } from '@/support/user';
import { Text } from '@/kernel/ui/text';
import {
  EditMessageModal,
  MessageList,
  findCounterpartParticipant,
  findMyParticipant,
  isInEditWindow,
  useChatDetail,
  useChatMessages,
  useChatRealtime,
  useDeleteMessage,
  useEditMessage,
  useMarkRead,
} from '@/support/chat';
import type { ChatMessage } from '@/support/chat';

import { useSendAsUser } from '../model/use-send-as-user';
import { ClientChatComposer } from '../ui/client-chat-composer';

type Props = { chatId: string; onBack?: () => void };

export function ClientChatByIdScreen({ chatId, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const me = useMe();
  const myUserId = me.data?.id ?? null;

  const detail = useChatDetail(chatId);
  const messages = useChatMessages(chatId);
  const sendMutation = useSendAsUser();
  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();
  const { markRead } = useMarkRead(chatId);

  useChatRealtime(chatId);

  const [editing, setEditing] = useState<ChatMessage | null>(null);

  const myParticipantId = useMemo(() => {
    if (!detail.data || !myUserId) return null;
    return findMyParticipant(detail.data.participants, myUserId)?.id ?? null;
  }, [detail.data, myUserId]);

  const title = useMemo(() => {
    if (!detail.data) return 'Чат';
    const cp = findCounterpartParticipant(detail.data.participants, myUserId ?? '');
    if (cp?.kind === 'support') return 'Поддержка';
    return cp?.subjectId ?? 'Чат';
  }, [detail.data, myUserId]);

  const flatMessages = useMemo(
    () => messages.data?.pages.flatMap((p) => p.messages) ?? [],
    [messages.data],
  );

  const status = detail.data?.status ?? 'open';
  const isBlocked = status === 'blocked';

  const handleLongPress = (message: ChatMessage, isMine: boolean) => {
    if (!isMine || !isInEditWindow(message)) return;
    Alert.alert('Сообщение', undefined, [
      { text: 'Редактировать', onPress: () => setEditing(message) },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Удалить сообщение?', undefined, [
            { text: 'Отмена', style: 'cancel' },
            {
              text: 'Удалить',
              style: 'destructive',
              onPress: () => deleteMutation.mutate({ chatId, messageId: message.messageId }),
            },
          ]),
      },
      { text: 'Отмена', style: 'cancel' },
    ]);
  };

  const handleEditSave = (text: string) => {
    if (!editing) return;
    editMutation.mutate(
      {
        chatId,
        messageId: editing.messageId,
        body: { text, mediaIds: editing.mediaIds },
      },
      { onSuccess: () => setEditing(null) },
    );
  };

  if (detail.isLoading || messages.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-stone-900">
        <ActivityIndicator size="large" color="#a8a29e" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-stone-900">
      <View
        className="px-2 pb-3 border-b border-stone-200 dark:border-stone-800 flex-row items-start gap-1"
        style={{ paddingTop: insets.top + 8 }}
      >
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Назад"
            className="w-9 h-9 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color={isDark ? '#e7e5e4' : '#1c1917'} />
          </Pressable>
        ) : null}
        <View className="flex-1 pt-1.5">
          <Text variant="h3" numberOfLines={1}>
            {title}
          </Text>
          {isBlocked ? (
            <Text variant="caption" color="error" className="mt-1">
              Чат заблокирован организацией
            </Text>
          ) : null}
        </View>
      </View>
      <View className="flex-1">
        <MessageList
          messages={flatMessages}
          myParticipantId={myParticipantId}
          hasMore={messages.hasNextPage ?? false}
          isLoadingMore={messages.isFetchingNextPage}
          onLoadMore={() => messages.fetchNextPage()}
          onReachStart={(messageId) => markRead(messageId)}
          onLongPressMessage={handleLongPress}
        />
      </View>
      <ClientChatComposer
        disabled={isBlocked}
        isSending={sendMutation.isPending}
        onSend={({ text, mediaIds }) =>
          sendMutation.mutate({
            mode: 'existing',
            chatId,
            body: { text: text.length > 0 ? text : null, mediaIds },
          })
        }
        placeholder={status === 'closed' ? 'Сообщение откроет чат снова' : undefined}
      />
      <EditMessageModal
        visible={editing !== null}
        initialText={editing?.text ?? ''}
        isSaving={editMutation.isPending}
        onCancel={() => setEditing(null)}
        onSave={handleEditSave}
      />
    </View>
  );
}
