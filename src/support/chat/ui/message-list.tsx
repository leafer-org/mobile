import { useCallback, useRef } from 'react';
import { FlatList, View, type ViewToken } from 'react-native';

import { Spinner } from '@/kernel/ui/spinner';

import type { ChatMessage } from '../domain/types';
import { isSystemMessage, isMessageMine } from '../domain/helpers';
import { MessageBubble } from './message-bubble';
import { SystemMessage } from './system-message';

type Props = {
  messages: ChatMessage[];
  myParticipantId: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onReachStart?: (lastVisibleMessageId: string) => void;
  onLongPressMessage?: (message: ChatMessage, isMine: boolean) => void;
};

export function MessageList({
  messages,
  myParticipantId,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onReachStart,
  onLongPressMessage,
}: Props) {
  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      if (isSystemMessage(item)) return <SystemMessage message={item} />;
      const isMine = isMessageMine(item, myParticipantId);
      return (
        <MessageBubble
          message={item}
          isMine={isMine}
          onLongPress={onLongPressMessage ? () => onLongPressMessage(item, isMine) : undefined}
        />
      );
    },
    [myParticipantId, onLongPressMessage],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.messageId, []);

  const onReachStartRef = useRef(onReachStart);
  onReachStartRef.current = onReachStart;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const cb = onReachStartRef.current;
    if (!cb || viewableItems.length === 0) return;
    const first = viewableItems[0]?.item as ChatMessage | undefined;
    if (first) cb(first.messageId);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  return (
    <FlatList
      inverted
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ paddingVertical: 12 }}
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingMore ? (
          <View className="py-4 items-center">
            <Spinner size="small" />
          </View>
        ) : null
      }
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}
