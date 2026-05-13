export type InboxTab = 'all' | 'unassigned' | 'mine';

export type InboxFilters = {
  organizationId: string;
  assignedToMe: boolean | undefined;
  unassigned: boolean | undefined;
};

export function buildInboxFilters(tab: InboxTab, organizationId: string): InboxFilters {
  return {
    organizationId,
    assignedToMe: tab === 'mine' || undefined,
    unassigned: tab === 'unassigned' || undefined,
  };
}
