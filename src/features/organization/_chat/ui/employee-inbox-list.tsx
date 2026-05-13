import type { ReactElement } from 'react';
import { FlatList } from 'react-native';

import type { ChatListItem } from '@/support/chat';

type Props = {
  items: ChatListItem[];
  renderItem: (item: ChatListItem) => ReactElement;
};

export function EmployeeInboxList({ items, renderItem }: Props) {
  return (
    <FlatList
      data={items}
      keyExtractor={(c) => c.chatId}
      renderItem={({ item }) => renderItem(item)}
    />
  );
}
