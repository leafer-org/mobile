export type OrgStatusTone = 'success' | 'info' | 'error' | 'neutral';

export type OrgStatus = {
  label: string;
  tone: OrgStatusTone;
};

export function resolveOrgStatus(args: {
  isPublished: boolean;
  draftStatus: 'draft' | 'moderation-request' | 'rejected';
}): OrgStatus {
  if (args.isPublished) return { label: 'Опубликовано', tone: 'success' };
  switch (args.draftStatus) {
    case 'moderation-request':
      return { label: 'На модерации', tone: 'info' };
    case 'rejected':
      return { label: 'Отклонено', tone: 'error' };
    default:
      return { label: 'Черновик', tone: 'neutral' };
  }
}
