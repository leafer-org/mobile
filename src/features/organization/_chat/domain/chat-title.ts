import type { ChatParticipant } from '@/support/chat';

export function formatChatTitle(participants: ChatParticipant[] | undefined): string {
  const userParticipant = participants?.find((p) => p.kind === 'user');
  if (!userParticipant?.subjectId) return 'Чат';
  return `Клиент ${(userParticipant.subjectId as string).slice(0, 6)}`;
}

export function formatChatSubtitle(contextItemId: string | null | undefined): string | null {
  if (!contextItemId) return null;
  return `Контекст: товар ${contextItemId.slice(0, 8)}`;
}
