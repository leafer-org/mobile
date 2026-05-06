import { View } from 'react-native';

import {
  clearEditInfoForm,
  type EditInfoFormApi,
  stripLocalIds,
  useEditInfoForm,
} from '../model/edit-info-form';
import { useUpdateInfoDraft } from '../model/use-update-info-draft';
import { BackBar } from '../ui/back-bar';
import { ContactsField } from '../ui/edit-info/contacts-field';
import { DescriptionInput } from '../ui/edit-info/description-input';
import { TeamSummaryRow } from '../ui/edit-info/team-summary';
import { useAvatarPreview } from '@/features/profile/model/use-avatar-preview';
import { useUploadAvatar } from '@/features/profile/model/use-upload-avatar';
import { AvatarEditSection } from '@/features/profile/ui/avatar-edit-section';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

type Props = {
  organizationId: string;
  currentAvatarUrl: string | null;
  onBack: () => void;
  onOpenTeam: () => void;
  onSaved: () => void;
};

export function EditOrganizationInfoScreen({
  organizationId,
  currentAvatarUrl,
  onBack,
  onOpenTeam,
  onSaved,
}: Props) {
  const form = useEditInfoForm(organizationId);
  const uploadAvatar = useUploadAvatar();
  const avatarPreview = useAvatarPreview({ fileId: uploadAvatar.uploadedFileId });

  const update = useUpdateInfoDraft({
    organizationId,
    onSuccess: () => {
      clearEditInfoForm(organizationId);
      onSaved();
    },
  });

  const isPending = update.isPending || uploadAvatar.isUploading;
  const errorMessage = update.error ? (update.error.message ?? 'Не удалось сохранить') : null;

  const handlePickAvatar = async () => {
    const fileId = await uploadAvatar.pickAndUpload().catch(() => null);
    if (fileId) form.setAvatarId(fileId);
  };

  const handleSubmit = () => {
    if (!form.isValid || isPending) return;
    const stripped = stripLocalIds(form.state);
    update.mutate({
      name: form.state.name.trim(),
      description: form.state.description.trim(),
      avatarId: form.state.avatarId,
      media: [],
      contacts: stripped.contacts.map((c) => ({
        type: c.type,
        value: c.value.trim(),
        ...(c.label ? { label: c.label.trim() } : {}),
      })),
      team: {
        title: stripped.team.title.trim(),
        members: stripped.team.members.map((m) => ({
          name: m.name.trim(),
          description: m.description?.trim() ?? '',
          media: [],
          ...(m.employeeUserId ? { employeeUserId: m.employeeUserId } : {}),
        })),
      },
    });
  };

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <BackBar onBack={onBack} />
      <View className="gap-6 pb-8">
        <Text variant="h2">Профиль организации</Text>

        <AvatarBlock
          form={form}
          uploadAvatar={uploadAvatar}
          previewUrl={avatarPreview.previewUrl}
          previewIsPending={Boolean(avatarPreview.isPending)}
          currentAvatarUrl={currentAvatarUrl}
          disabled={isPending}
          onPick={handlePickAvatar}
        />

        <NameInput form={form} disabled={isPending} />
        <DescriptionInput
          value={form.state.description}
          onChangeText={form.setDescription}
          disabled={isPending}
        />
        <ContactsField
          value={form.state.contacts}
          onChange={form.setContacts}
          onAdd={form.addContact}
          disabled={isPending}
        />
        <TeamSummaryRow
          title={form.state.team.title}
          membersCount={form.state.team.members.length}
          onPress={onOpenTeam}
          disabled={isPending}
        />

        {errorMessage && (
          <Text variant="caption" color="error">
            {errorMessage}
          </Text>
        )}

        <Button
          variant="primary"
          onPress={handleSubmit}
          loading={update.isPending}
          disabled={!form.isValid || isPending}
        >
          Сохранить
        </Button>
      </View>
    </ScreenLayout>
  );
}

function NameInput({ form, disabled }: { form: EditInfoFormApi; disabled: boolean }) {
  return (
    <View className="gap-1.5">
      <Text variant="label">Название</Text>
      <TextInput
        value={form.state.name}
        onChangeText={form.setName}
        placeholder="Название организации"
        editable={!disabled}
      />
    </View>
  );
}

type UploadAvatarReturn = ReturnType<typeof useUploadAvatar>;

function AvatarBlock({
  form,
  uploadAvatar,
  previewUrl,
  previewIsPending,
  currentAvatarUrl,
  disabled,
  onPick,
}: {
  form: EditInfoFormApi;
  uploadAvatar: UploadAvatarReturn;
  previewUrl: string | undefined;
  previewIsPending: boolean;
  currentAvatarUrl: string | null;
  disabled: boolean;
  onPick: () => Promise<void>;
}) {
  const currentAvatar = currentAvatarUrl
    ? {
        largeUrl: currentAvatarUrl,
        mediumUrl: currentAvatarUrl,
        smallUrl: currentAvatarUrl,
        thumbUrl: currentAvatarUrl,
      }
    : undefined;

  return (
    <AvatarEditSection
      currentAvatar={currentAvatar}
      previewUrl={previewUrl}
      initials={form.state.name.trim().charAt(0).toUpperCase() || '?'}
      onPress={() => {
        void onPick();
      }}
      isUploading={uploadAvatar.isUploading || previewIsPending}
      hasUploaded={Boolean(uploadAvatar.uploadedFileId)}
      error={uploadAvatar.error ?? undefined}
      disabled={disabled}
    />
  );
}
