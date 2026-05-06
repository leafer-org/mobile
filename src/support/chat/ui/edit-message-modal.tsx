import { useEffect, useState } from 'react';
import { Modal, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';

type Props = {
  visible: boolean;
  initialText: string;
  isSaving?: boolean;
  onCancel: () => void;
  onSave: (text: string) => void;
};

export function EditMessageModal({ visible, initialText, isSaving, onCancel, onSave }: Props) {
  const [text, setText] = useState(initialText);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) setText(initialText);
  }, [visible, initialText]);

  const trimmed = text.trim();
  const canSave = trimmed.length > 0 && trimmed !== initialText.trim();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View className="flex-1 justify-end bg-black/40">
        <View
          className="bg-white dark:bg-stone-900 rounded-t-2xl px-4 pt-4 gap-3"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <Text variant="h3">Редактирование</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            autoFocus
            placeholderTextColor="#a8a29e"
            className="min-h-20 max-h-48 px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white text-base"
          />
          <View className="flex-row gap-2 justify-end">
            <Button variant="ghost" onPress={onCancel}>
              Отмена
            </Button>
            <Button
              variant="primary"
              disabled={!canSave}
              loading={isSaving}
              onPress={() => onSave(trimmed)}
            >
              Сохранить
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
