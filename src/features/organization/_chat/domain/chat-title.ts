import type { ChatParticipant } from '@/support/chat';

export function formatChatTitle(participants: ChatParticipant[] | undefined): string {
  const userParticipant = participants?.find((p) => p.subject?.kind === 'user');
  const subject = userParticipant?.subject;
  if (!subject || subject.kind !== 'user') return 'Чат';
  if (subject.fullName) return subject.fullName;
  return `Клиент ${subject.id.slice(0, 6)}`;
}

export function formatChatSubtitle(contextItemId: string | null | undefined): string | null {
  if (!contextItemId) return null;
  return `Контекст: товар ${contextItemId.slice(0, 8)}`;
}
