import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMe } from '@/support/user';
import { Text } from '@/kernel/ui/text';
import {
  EditMessageModal,
  MessageList,
  isInEditWindow,
  useChatDetail,
  useChatMessages,
  useChatRealtime,
  useDeleteMessage,
  useEditMessage,
  useMarkRead,
} from '@/support/chat';
import type { ChatMessage } from '@/support/chat';

import { useBlockChat, useUnblockChat } from '../model/use-block-chat';
import { useCloseChat } from '../model/use-close-chat';
import { useReleaseSlot } from '../model/use-release-slot';
import { useSendAsEmployee } from '../model/use-send-as-employee';
import { EmployeeActionsBar } from '../ui/employee-actions-bar';
import { EmployeeChatComposer } from '../ui/employee-chat-composer';

type Props = {
  chatId: string;
  organizationId: string;
  onBack?: () => void;
};

export function EmployeeChatScreen({ chatId, organizationId, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const me = useMe();
  const myUserId = me.data?.id ?? null;

  const detail = useChatDetail(chatId);
  const messages = useChatMessages(chatId);
  const { markRead } = useMarkRead(chatId);

  useChatRealtime(chatId);

  const sendMutation = useSendAsEmployee();
  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();
  const releaseMutation = useReleaseSlot(chatId);
  const blockMutation = useBlockChat(chatId);
  const unblockMutation = useUnblockChat(chatId);
  const closeMutation = useCloseChat(chatId);

  const [editing, setEditing] = useState<ChatMessage | null>(null);

  const orgSlot = useMemo(
    () =>
      detail.data?.participants.find(
        (p) => p.kind === 'organization' && p.subjectId === organizationId,
      ) ?? null,
    [detail.data, organizationId],
  );

  const isMyClaim = orgSlot?.assignedUserId === myUserId;
  const needsClaim = orgSlot?.assignedUserId === null;
  const myParticipantId = isMyClaim ? orgSlot?.id ?? null : null;

  const userParticipant = detail.data?.participants.find((p) => p.kind === 'user');
  const title = userParticipant?.subjectId
    ? `Клиент ${(userParticipant.subjectId as string).slice(0, 6)}`
    : 'Чат';

  const flatMessages = useMemo(
    () => messages.data?.pages.flatMap((p) => p.messages) ?? [],
    [messages.data],
  );

  const status = detail.data?.status ?? 'open';

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
          {detail.data?.contextItemId ? (
            <Text variant="caption" className="mt-0.5">
              Контекст: товар {detail.data.contextItemId.slice(0, 8)}
            </Text>
          ) : null}
        </View>
      </View>
      <EmployeeActionsBar
        status={status}
        isMyClaim={!!isMyClaim}
        onRelease={() => myParticipantId && releaseMutation.mutate(myParticipantId)}
        onBlock={() => blockMutation.mutate(null)}
        onUnblock={() => unblockMutation.mutate()}
        onClose={() => closeMutation.mutate(null)}
        isBusy={
          releaseMutation.isPending ||
          blockMutation.isPending ||
          unblockMutation.isPending ||
          closeMutation.isPending
        }
      />
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
      <EmployeeChatComposer
        needsClaim={!!needsClaim}
        disabled={status === 'closed'}
        isSending={sendMutation.isPending}
        onSend={({ text, mediaIds, claim }) =>
          sendMutation.mutate({
            chatId,
            body: { text: text.length > 0 ? text : null, mediaIds },
            claim,
          })
        }
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
