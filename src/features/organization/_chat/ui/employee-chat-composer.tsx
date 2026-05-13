import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';
import { useImagePreview, useUploadImage } from '@/support/media';

type Props = {
  needsClaim: boolean;
  disabled?: boolean;
  isSending?: boolean;
  onSend: (args: { text: string; mediaIds: string[]; claim: boolean }) => void;
};

export function EmployeeChatComposer({ needsClaim, disabled, isSending, onSend }: Props) {
  const [text, setText] = useState('');
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  const insets = useSafeAreaInsets();
  const upload = useUploadImage({ name: 'chat-message', maxSizeMb: 20 });

  const handlePickImage = async () => {
    try {
      const id = await upload.pickAndUpload();
      if (id) setMediaIds((prev) => [...prev, id]);
      upload.reset();
    } catch {
      // upload.error
    }
  };

  const handleRemoveMedia = (id: string) => {
    setMediaIds((prev) => prev.filter((x) => x !== id));
  };

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 || mediaIds.length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend({ text: trimmed, mediaIds, claim: needsClaim });
    setText('');
    setMediaIds([]);
  };

  return (
    <View
      className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3 pt-2"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      {needsClaim ? (
        <Text variant="caption" className="px-1 mb-1">
          Сообщение возьмёт чат на вас
        </Text>
      ) : null}
      {mediaIds.length > 0 || upload.isUploading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pb-2">
          {mediaIds.map((id) => (
            <ComposerMediaPreview key={id} mediaId={id} onRemove={() => handleRemoveMedia(id)} />
          ))}
          {upload.isUploading ? <ComposerUploadingTile progress={upload.progress} /> : null}
        </ScrollView>
      ) : null}
      {upload.error ? (
        <Text className="text-xs text-red-500 mb-1 px-1">{upload.error.message}</Text>
      ) : null}
      <View className="flex-row items-end gap-2">
        <Pressable
          onPress={handlePickImage}
          disabled={disabled || upload.isUploading}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 active:opacity-70"
        >
          <Ionicons name="image-outline" size={20} color="#57534e" />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Ответ клиенту"
          placeholderTextColor="#a8a29e"
          multiline
          editable={!disabled}
          className="flex-1 max-h-32 px-3 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white text-base"
        />
        <Button
          variant="primary"
          size="md"
          disabled={disabled || !canSend}
          loading={isSending}
          onPress={handleSend}
        >
          {needsClaim ? 'Взять и отпр.' : 'Отпр.'}
        </Button>
      </View>
    </View>
  );
}

function ComposerMediaPreview({ mediaId, onRemove }: { mediaId: string; onRemove: () => void }) {
  const preview = useImagePreview({ fileId: mediaId, queryKeyPrefix: 'chat-media' });
  const url = 'previewUrl' in preview ? preview.previewUrl : null;

  return (
    <View className="relative">
      <View className="rounded-md overflow-hidden bg-stone-200 dark:bg-stone-700" style={{ width: 64, height: 64 }}>
        {url ? <Image source={{ uri: url }} style={{ width: 64, height: 64 }} contentFit="cover" /> : null}
      </View>
      <Pressable
        onPress={onRemove}
        hitSlop={6}
        className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-black/70"
      >
        <Ionicons name="close" size={12} color="white" />
      </Pressable>
    </View>
  );
}

function ComposerUploadingTile({ progress }: { progress: number }) {
  return (
    <View
      className="items-center justify-center rounded-md bg-stone-200 dark:bg-stone-700"
      style={{ width: 64, height: 64 }}
    >
      <ActivityIndicator />
      <Text className="mt-1 text-[10px] text-stone-600 dark:text-stone-300">{Math.round(progress)}%</Text>
    </View>
  );
}
