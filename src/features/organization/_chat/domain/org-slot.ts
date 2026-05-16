import type { ChatParticipant } from '@/support/chat';

export function findOrgSlot(
  participants: ChatParticipant[] | undefined,
  organizationId: string,
): ChatParticipant | null {
  if (!participants) return null;
  return (
    participants.find(
      (p) => p.subject?.kind === 'organization' && p.subject.id === organizationId,
    ) ?? null
  );
}

export function getMyParticipantId(
  orgSlot: ChatParticipant | null,
  myUserId: string | null,
): string | null {
  if (!orgSlot || !myUserId) return null;
  return orgSlot.assignedUser?.id === myUserId ? orgSlot.id : null;
}
