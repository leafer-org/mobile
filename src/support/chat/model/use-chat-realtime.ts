import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { ChatListItemStatus } from '@/kernel/api/schema';
import { useChannel } from '@/kernel/realtime';
import type { RealtimeEvent } from '@/kernel/realtime';

import type { ChatDetail, ChatMessage } from '../domain/types';
import { chatQueryKeys } from './query-keys';

type MessagesPage = { messages: ChatMessage[]; nextCursor: string | null };
type MessagesData = { pages: MessagesPage[]; pageParams: unknown[] };

export function useChatRealtime(chatId: string | null) {
  const qc = useQueryClient();

  const handler = useCallback(
    (event: RealtimeEvent) => {
      if (!chatId) return;
      const messagesKey = chatQueryKeys.messages(chatId);
      const detailKey = chatQueryKeys.detail(chatId);

      switch (event.type) {
        case 'message.new': {
          const msg = event.payload as ChatMessage;
          qc.setQueryData<MessagesData>(messagesKey, (data) => {
            if (!data || data.pages.length === 0) return data;
            const exists = data.pages[0].messages.some((m) => m.messageId === msg.messageId);
            if (exists) return data;
            const firstPage = data.pages[0];
            return {
              ...data,
              pages: [
                { messages: [msg, ...firstPage.messages], nextCursor: firstPage.nextCursor },
                ...data.pages.slice(1),
              ],
            };
          });
          qc.invalidateQueries({ queryKey: detailKey });
          qc.invalidateQueries({ queryKey: chatQueryKeys.myChats() });
          qc.invalidateQueries({ queryKey: chatQueryKeys.unreadSummary() });
          break;
        }
        case 'message.edited': {
          const patch = event.payload as { messageId: string; text: string | null; mediaIds: string[]; editedAt: string };
          qc.setQueryData<MessagesData>(messagesKey, (data) => {
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((p) => ({
                ...p,
                messages: p.messages.map((m) =>
                  m.messageId === patch.messageId
                    ? { ...m, text: patch.text, mediaIds: patch.mediaIds, editedAt: patch.editedAt }
                    : m,
                ),
              })),
            };
          });
          break;
        }
        case 'message.deleted': {
          const patch = event.payload as { messageId: string; deletedAt: string };
          qc.setQueryData<MessagesData>(messagesKey, (data) => {
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((p) => ({
                ...p,
                messages: p.messages.map((m) =>
                  m.messageId === patch.messageId
                    ? { ...m, text: null, mediaIds: [], deletedAt: patch.deletedAt }
                    : m,
                ),
              })),
            };
          });
          break;
        }
        case 'chat.read': {
          qc.invalidateQueries({ queryKey: detailKey });
          qc.invalidateQueries({ queryKey: chatQueryKeys.unreadSummary() });
          break;
        }
        case 'chat.blocked':
        case 'chat.unblocked':
        case 'participant.claimed':
        case 'participant.released':
        case 'participant.reassigned': {
          qc.setQueryData<ChatDetail>(detailKey, (prev: ChatDetail | undefined) => {
            if (!prev) return prev;
            if (event.type === 'chat.blocked') return { ...prev, status: ChatListItemStatus.blocked };
            if (event.type === 'chat.unblocked') return { ...prev, status: ChatListItemStatus.open };
            return prev;
          });
          qc.invalidateQueries({ queryKey: detailKey });
          break;
        }
      }
    },
    [chatId, qc],
  );

  useChannel(chatId ? `chat:${chatId}` : null, handler);
}
