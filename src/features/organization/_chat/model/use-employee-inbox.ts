import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';
import { PathsAdminChatsGetParametersQuerySlotKind } from '@/kernel/api/schema';
import { chatQueryKeys } from '@/support/chat';
import type { ChatList } from '@/support/chat';

import type { InboxFilters } from '../domain/inbox-tab';

export function useEmployeeInbox(filters: InboxFilters) {
  const fetchClient = useApiFetchClient();

  return useQuery({
    queryKey: chatQueryKeys.adminChats(filters),
    queryFn: async (): Promise<ChatList> => {
      const { data, error } = await fetchClient.GET('/admin/chats', {
        params: {
          query: {
            slotKind: PathsAdminChatsGetParametersQuerySlotKind.organization,
            orgId: filters.organizationId,
            assignedToMe: filters.assignedToMe,
            unassigned: filters.unassigned,
            from: 0,
            size: 100,
          },
        },
      });
      if (error || !data) throw new Error('failed_to_fetch_employee_inbox');
      return data;
    },
  });
}
