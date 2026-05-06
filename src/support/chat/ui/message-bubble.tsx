import { Pressable, View } from 'react-native';

import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

import type { ChatMessage } from '../domain/types';
import { isDeletedMessage } from '../domain/helpers';
import { MessageMediaGrid } from './message-media-grid';

type Props = {
  message: ChatMessage;
  isMine: boolean;
  onLongPress?: () => void;
};

export function MessageBubble({ message, isMine, onLongPress }: Props) {
  const deleted = isDeletedMessage(message);
  const time = new Date(message.createdAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View className={cn('w-full flex-row mb-2 px-3', isMine ? 'justify-end' : 'justify-start')}>
      <Pressable
        onLongPress={onLongPress}
        delayLongPress={350}
        disabled={!onLongPress || deleted}
        className={cn(
          'max-w-[80%] rounded-2xl px-3 py-2',
          isMine
            ? 'bg-stone-900 dark:bg-stone-700 rounded-br-sm'
            : 'bg-stone-100 dark:bg-stone-800 rounded-bl-sm',
        )}
      >
        {deleted ? (
          <Text
            className={cn(
              'italic text-sm',
              isMine ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400',
            )}
          >
            Сообщение удалено
          </Text>
        ) : (
          <>
            {message.text ? (
              <Text className={cn('text-base', isMine ? 'text-white' : 'text-stone-900 dark:text-white')}>
                {message.text}
              </Text>
            ) : null}
            <MessageMediaGrid mediaIds={message.mediaIds} />
          </>
        )}
        <View className="flex-row items-center gap-1 mt-1">
          <Text
            className={cn('text-[10px]', isMine ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400')}
          >
            {time}
          </Text>
          {message.editedAt && !deleted ? (
            <Text
              className={cn('text-[10px]', isMine ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400')}
            >
              · изменено
            </Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}
