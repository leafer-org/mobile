import type { ChatParticipant } from '@/support/chat';

export function findOrgSlot(
  participants: ChatParticipant[] | undefined,
  organizationId: string,
): ChatParticipant | null {
  if (!participants) return null;
  return (
    participants.find(
      (p) => p.kind === 'organization' && p.subjectId === organizationId,
    ) ?? null
  );
}

export function getMyParticipantId(
  orgSlot: ChatParticipant | null,
  myUserId: string | null,
): string | null {
  if (!orgSlot || !myUserId) return null;
  return orgSlot.assignedUserId === myUserId ? orgSlot.id : null;
}
