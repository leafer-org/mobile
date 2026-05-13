import { useState } from 'react';
import { Alert } from 'react-native';

import { isInEditWindow, useDeleteMessage, useEditMessage } from '@/support/chat';
import type { ChatMessage } from '@/support/chat';

type Args = {
  chatId: string;
};

export function useMessageContextMenu({ chatId }: Args) {
  const [editing, setEditing] = useState<ChatMessage | null>(null);
  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();

  const onLongPress = (message: ChatMessage, isMine: boolean) => {
    if (!isMine || !isInEditWindow(message)) return;
    Alert.alert('Сообщение', undefined, [
      { text: 'Редактировать', onPress: () => setEditing(message) },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Удалить сообщение?', undefined, [
            { text: 'Отмена', style: 'cancel' },
            {
              text: 'Удалить',
              style: 'destructive',
              onPress: () => deleteMutation.mutate({ chatId, messageId: message.messageId }),
            },
          ]),
      },
      { text: 'Отмена', style: 'cancel' },
    ]);
  };

  const onEditCancel = () => setEditing(null);

  const onEditSave = (text: string) => {
    if (!editing) return;
    editMutation.mutate(
      {
        chatId,
        messageId: editing.messageId,
        body: { text, mediaIds: editing.mediaIds },
      },
      { onSuccess: () => setEditing(null) },
    );
  };

  return {
    editingText: editing?.text ?? '',
    isEditingOpen: editing !== null,
    isEditSaving: editMutation.isPending,
    onLongPress,
    onEditCancel,
    onEditSave,
  };
}
