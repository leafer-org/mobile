import { useState } from 'react';
import { View } from 'react-native';

import { useAvatarPreview } from '@/features/profile/model/use-avatar-preview';
import { useUploadAvatar } from '@/features/profile/model/use-upload-avatar';
import { AvatarEditSection } from '@/features/profile/ui/avatar-edit-section';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

import { useCreateOrganization } from '../model/use-create-organization';
import { BackBar } from '../ui/back-bar';

export function CreateOrganizationScreen({
  onBack,
  onCreated,
}: {
  onBack: () => void;
  onCreated: (organizationId: string) => void;
}) {
  const [name, setName] = useState('');

  const uploadAvatar = useUploadAvatar();
  const avatarPreview = useAvatarPreview({ fileId: uploadAvatar.uploadedFileId });

  const createOrg = useCreateOrganization({ onSuccess: onCreated });

  const errorMessage = createOrg.error
    ? ((createOrg.error as { message?: string }).message ?? 'Ошибка при создании')
    : null;

  const canSubmit = name.trim().length > 0 && !uploadAvatar.isUploading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    createOrg.mutate({
      name: name.trim(),
      avatarId: uploadAvatar.uploadedFileId ?? null,
    });
  };

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <BackBar onBack={onBack} />
      <View className="flex-1 gap-6">
        <View className="gap-2">
          <Text variant="h2">Как назовём организацию?</Text>
          <Text variant="body" className="text-stone-600 dark:text-stone-300">
            Это может быть название компании — «Школа танцев "Крик"» — или
            ваше имя и род занятий: «Евгений Паромов | Репетитор по математике».
          </Text>
        </View>

        <AvatarEditSection
          previewUrl={avatarPreview.previewUrl}
          initials={name.trim().charAt(0).toUpperCase() || '?'}
          onPress={() => {
            uploadAvatar.pickAndUpload().catch(() => undefined);
          }}
          isUploading={uploadAvatar.isUploading || Boolean(avatarPreview.isPending)}
          hasUploaded={Boolean(uploadAvatar.uploadedFileId)}
          error={uploadAvatar.error ?? undefined}
        />

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Название организации"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {errorMessage && (
          <Text variant="caption" className="text-red-500">
            {errorMessage}
          </Text>
        )}

        <View className="flex-1" />

        <View className="pb-4">
          <Button
            variant="primary"
            loading={createOrg.isPending}
            disabled={!canSubmit || createOrg.isPending}
            onPress={handleSubmit}
          >
            Создать
          </Button>
        </View>
      </View>
    </ScreenLayout>
  );
}
