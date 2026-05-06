import type { PublicApiComponents } from '@/kernel/api';

export type ChatStatus = 'open' | 'closed' | 'blocked';
export type ParticipantKind = 'user' | 'organization' | 'support';
export type MessageKind = 'text' | 'media' | 'system';

export type ChatListItem = PublicApiComponents['schemas']['ChatListItem'];
export type ChatList = PublicApiComponents['schemas']['ChatList'];
export type ChatDetail = PublicApiComponents['schemas']['ChatListItem'];
export type ChatMessage = PublicApiComponents['schemas']['ChatMessage'];
export type ChatParticipant = ChatListItem['participants'][number];

export type SendMessageBody = {
  text: string | null;
  mediaIds: string[];
};

export type SystemEvent = NonNullable<ChatMessage['systemEvent']>;
