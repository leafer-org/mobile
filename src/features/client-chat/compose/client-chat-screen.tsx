import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMe } from '@/support/user';
import { Text } from '@/kernel/ui/text';
import {
  ContextItemCard,
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

import { useResolveOrgChat } from '../model/use-resolve-org-chat';
import { useSendAsUser } from '../model/use-send-as-user';
import { ClientChatComposer } from '../ui/client-chat-composer';

type Props = {
  organizationId: string;
  contextItemId?: string | null;
  contextItemTitle?: string | null;
  organizationName?: string | null;
  onBack?: () => void;
};

export function ClientChatScreen({
  organizationId,
  contextItemId,
  contextItemTitle,
  organizationName,
  onBack,
}: Props) {
  const me = useMe();
  const myUserId = me.data?.id ?? null;

  const resolved = useResolveOrgChat(organizationId);
  const chatId = resolved.chat?.chatId ?? null;

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

  const counterpartLabel = useMemo(() => {
    if (organizationName) return organizationName;
    if (!detail.data) return 'Организация';
    const cp = findCounterpartParticipant(detail.data.participants, myUserId ?? '');
    return cp?.subjectId ?? 'Организация';
  }, [detail.data, myUserId, organizationName]);

  const flatMessages = useMemo(
    () => messages.data?.pages.flatMap((p) => p.messages) ?? [],
    [messages.data],
  );

  const status = detail.data?.status ?? 'open';
  const isBlocked = status === 'blocked';

  const handleSend = ({ text, mediaIds }: { text: string; mediaIds: string[] }) => {
    const body = { text: text.length > 0 ? text : null, mediaIds };
    if (chatId) {
      sendMutation.mutate({ mode: 'existing', chatId, body });
    } else {
      sendMutation.mutate({
        mode: 'open-with-organization',
        organizationId,
        contextItemId: contextItemId ?? null,
        body,
      });
    }
  };

  const handleLongPress = (message: ChatMessage, isMine: boolean) => {
    if (!isMine || !chatId) return;
    if (!isInEditWindow(message)) return;
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
    if (!editing || !chatId) return;
    editMutation.mutate(
      {
        chatId,
        messageId: editing.messageId,
        body: { text, mediaIds: editing.mediaIds },
      },
      { onSuccess: () => setEditing(null) },
    );
  };

  if (resolved.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-stone-900">
        <ActivityIndicator size="large" color="#a8a29e" />
      </View>
    );
  }

  return (
    <>
      <ChatLayout
        title={counterpartLabel}
        contextTitle={contextItemTitle ?? null}
        isBlocked={isBlocked}
        isClosed={status === 'closed'}
        isEmpty={!chatId}
        messages={flatMessages}
        myParticipantId={myParticipantId}
        hasMore={messages.hasNextPage ?? false}
        isLoadingMore={messages.isFetchingNextPage}
        onLoadMore={() => messages.fetchNextPage()}
        onReachStart={(messageId) => markRead(messageId)}
        onSend={handleSend}
        onLongPressMessage={handleLongPress}
        isSending={sendMutation.isPending}
        onBack={onBack}
      />
      <EditMessageModal
        visible={editing !== null}
        initialText={editing?.text ?? ''}
        isSaving={editMutation.isPending}
        onCancel={() => setEditing(null)}
        onSave={handleEditSave}
      />
    </>
  );
}

type LayoutProps = {
  title: string;
  contextTitle: string | null;
  isBlocked: boolean;
  isClosed: boolean;
  isEmpty: boolean;
  messages: ChatMessage[];
  myParticipantId: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onReachStart: (messageId: string) => void;
  onSend: (args: { text: string; mediaIds: string[] }) => void;
  onLongPressMessage: (message: ChatMessage, isMine: boolean) => void;
  isSending: boolean;
  onBack?: () => void;
};

function ChatLayout({
  title,
  contextTitle,
  isBlocked,
  isClosed,
  isEmpty,
  messages,
  myParticipantId,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onReachStart,
  onSend,
  onLongPressMessage,
  isSending,
  onBack,
}: LayoutProps) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';

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
      {contextTitle ? <ContextItemCard title={contextTitle} /> : null}
      <View className="flex-1">
        {isEmpty ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text variant="body" color="secondary" className="text-center">
              Это начало вашего диалога. Напишите сообщение, чтобы открыть чат.
            </Text>
          </View>
        ) : (
          <MessageList
            messages={messages}
            myParticipantId={myParticipantId}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={onLoadMore}
            onReachStart={onReachStart}
            onLongPressMessage={onLongPressMessage}
          />
        )}
      </View>
      <ClientChatComposer
        disabled={isBlocked}
        isSending={isSending}
        onSend={onSend}
        placeholder={isClosed ? 'Сообщение откроет чат снова' : undefined}
      />
    </View>
  );
}
