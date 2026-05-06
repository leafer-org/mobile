import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMe } from '@/support/user';
import { Text } from '@/kernel/ui/text';
import { useInboxRealtime } from '@/support/chat';
import { cn } from '@/kernel/ui/utils/cn';

import { useEmployeeInbox } from '../model/use-employee-inbox';
import { EmployeeChatListItem } from '../ui/employee-chat-list-item';

type Tab = 'all' | 'unassigned' | 'mine';

type Props = {
  organizationId: string;
  onChatPress?: (chatId: string) => void;
};

export function EmployeeInboxScreen({ organizationId, onChatPress }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const myUserId = me.data?.id ?? null;
  const [tab, setTab] = useState<Tab>('all');

  const filters = useMemo(
    () => ({
      organizationId,
      assignedToMe: tab === 'mine' || undefined,
      unassigned: tab === 'unassigned' || undefined,
    }),
    [organizationId, tab],
  );

  const inbox = useEmployeeInbox(filters);
  useInboxRealtime(`inbox:org:${organizationId}`);

  const items = inbox.data?.chats ?? [];

  return (
    <View className="flex-1 bg-white dark:bg-stone-900">
      <View
        className="px-4 pb-3 border-b border-stone-200 dark:border-stone-800"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text variant="h2">Входящие</Text>
        <View className="flex-row gap-2 mt-3">
          <TabButton active={tab === 'all'} onPress={() => setTab('all')}>
            Все
          </TabButton>
          <TabButton active={tab === 'unassigned'} onPress={() => setTab('unassigned')}>
            Свободные
          </TabButton>
          <TabButton active={tab === 'mine'} onPress={() => setTab('mine')}>
            Мои
          </TabButton>
        </View>
      </View>
      {inbox.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#a8a29e" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text variant="body" color="secondary" className="text-center">
            Здесь будут диалоги клиентов с организацией.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(c) => c.chatId}
          renderItem={({ item }) => (
            <EmployeeChatListItem
              item={item}
              myUserId={myUserId}
              organizationId={organizationId}
              onPress={() =>
                onChatPress
                  ? onChatPress(item.chatId)
                  : router.push(`/organizations/${organizationId}/inbox/${item.chatId}`)
              }
            />
          )}
        />
      )}
    </View>
  );
}

function TabButton({
  active,
  onPress,
  children,
}: {
  active: boolean;
  onPress: () => void;
  children: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'px-3 py-1.5 rounded-full',
        active
          ? 'bg-stone-900 dark:bg-white'
          : 'bg-stone-100 dark:bg-stone-800',
      )}
    >
      <Text
        className={cn(
          'text-sm font-medium',
          active ? 'text-white dark:text-stone-900' : 'text-stone-700 dark:text-stone-300',
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}
