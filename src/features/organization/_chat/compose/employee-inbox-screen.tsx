import { useMemo } from 'react';

import { useInboxRealtime } from '@/support/chat';
import { useMe } from '@/support/user';

import { buildInboxFilters, type InboxTab } from '../domain/inbox-tab';
import { useEmployeeInbox } from '../model/use-employee-inbox';
import { useInboxNavigation } from '../model/use-inbox-navigation';
import { useInboxTabs } from '../model/use-inbox-tabs';
import { EmployeeChatListItem } from '../ui/employee-chat-list-item';
import { EmployeeInboxEmpty } from '../ui/employee-inbox-empty';
import { EmployeeInboxHeader } from '../ui/employee-inbox-header';
import { EmployeeInboxLayout } from '../ui/employee-inbox-layout';
import { EmployeeInboxList } from '../ui/employee-inbox-list';
import { EmployeeInboxLoading } from '../ui/employee-inbox-loading';
import { EmployeeInboxTabs } from '../ui/employee-inbox-tabs';

type Props = {
  organizationId: string;
  onChatPress?: (chatId: string) => void;
};

const TABS: ReadonlyArray<{ key: InboxTab; label: string }> = [
  { key: 'all', label: 'Все' },
  { key: 'unassigned', label: 'Свободные' },
  { key: 'mine', label: 'Мои' },
];

export function EmployeeInboxScreen({ organizationId, onChatPress }: Props) {

  const me = useMe();
  const myUserId = me.data?.id ?? null;

  const { tab, setTab } = useInboxTabs();
  const filters = useMemo(() => buildInboxFilters(tab, organizationId), [tab, organizationId]);
  const inbox = useEmployeeInbox(filters);
  useInboxRealtime(`inbox:org:${organizationId}`);
  const { goToChat } = useInboxNavigation({ organizationId, onChatPress });

  const items = inbox.data?.chats ?? [];

  return (
    <EmployeeInboxLayout
      header={
        <EmployeeInboxHeader
          title="Входящие"
          tabs={<EmployeeInboxTabs items={TABS} active={tab} onChange={setTab} />}
        />
      }
      content={
        inbox.isLoading ? (
          <EmployeeInboxLoading />
        ) : items.length === 0 ? (
          <EmployeeInboxEmpty message="Здесь будут диалоги клиентов с организацией." />
        ) : (
          <EmployeeInboxList
            items={items}
            renderItem={(item) => (
              <EmployeeChatListItem
                item={item}
                myUserId={myUserId}
                organizationId={organizationId}
                onPress={() => goToChat(item.chatId)}
              />
            )}
          />
        )
      }
    />
  );
}
