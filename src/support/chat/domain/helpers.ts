import type { ChatMessage, ChatParticipant, ParticipantKind } from './types';

export function isSystemMessage(message: ChatMessage): boolean {
  return message.kind === 'system';
}

export function isDeletedMessage(message: ChatMessage): boolean {
  return message.deletedAt !== null && message.deletedAt !== undefined;
}

export function previewFromMessage(message: ChatMessage): string {
  if (isDeletedMessage(message)) return 'Сообщение удалено';
  if (message.kind === 'system') return systemEventLabel(message.systemEvent?.type);
  if (message.text && message.text.trim().length > 0) {
    const trimmed = message.text.trim();
    return trimmed.length > 80 ? `${trimmed.slice(0, 80)}…` : trimmed;
  }
  if (message.mediaIds.length > 0) return `📎 ${message.mediaIds.length} вложен.`;
  return '';
}

export function systemEventLabel(type: string | undefined): string {
  switch (type) {
    case 'chat.opened':
      return 'Чат открыт';
    case 'chat.blocked':
      return 'Чат заблокирован';
    case 'chat.unblocked':
      return 'Чат разблокирован';
    case 'participant.claimed':
      return 'Чат принят';
    case 'participant.released':
      return 'Чат снова в очереди';
    case 'participant.reassigned':
      return 'Чат передан другому сотруднику';
    default:
      return 'Системное событие';
  }
}

export function findParticipantByKind(
  participants: ChatParticipant[],
  kind: ParticipantKind,
): ChatParticipant | undefined {
  return participants.find((p) => p.subject?.kind === kind);
}

export function findMyParticipant(
  participants: ChatParticipant[],
  myUserId: string,
): ChatParticipant | undefined {
  return participants.find(
    (p) =>
      (p.subject?.kind === 'user' && p.subject.id === myUserId) ||
      p.assignedUser?.id === myUserId,
  );
}

export function findCounterpartParticipant(
  participants: ChatParticipant[],
  myUserId: string,
): ChatParticipant | undefined {
  return participants.find(
    (p) =>
      !(p.subject?.kind === 'user' && p.subject.id === myUserId) &&
      p.assignedUser?.id !== myUserId,
  );
}

export function isMessageMine(message: ChatMessage, myParticipantId: string | null): boolean {
  if (!myParticipantId) return false;
  return message.senderParticipantId === myParticipantId;
}

const EDIT_WINDOW_MS = 15 * 60 * 1000;

export function isInEditWindow(message: ChatMessage, now: Date = new Date()): boolean {
  if (isDeletedMessage(message)) return false;
  if (message.kind === 'system') return false;
  const created = new Date(message.createdAt).getTime();
  return now.getTime() - created < EDIT_WINDOW_MS;
}
