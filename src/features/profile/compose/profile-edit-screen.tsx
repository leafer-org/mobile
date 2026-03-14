import { useAvatarPreview } from '../model/use-avatar-preview';
import { useProfileFullName } from '../model/use-profile-full-name';
import { useUpdateProfile } from '../model/use-update-profile';
import { useUploadAvatar } from '../model/use-upload-avatar';
import { AvatarEditSection } from '../ui/avatar-edit-section';
import { FullNameInput } from '../ui/full-name-input';
import { ProfileEditLayout } from '../ui/profile-edit-layout';
import type { Avatar } from '@/kernel/ui/avatar';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';

export function ProfileEditScreen({
  currentFullName,
  currentAvatar,
  onSuccess,
}: {
  currentFullName?: string;
  currentAvatar?: Avatar;
  onSuccess: () => void;
}) {
  const fullNameField = useProfileFullName(currentFullName ?? '');
  const uploadAvatar = useUploadAvatar();
  const avatarPreview = useAvatarPreview({ fileId: uploadAvatar.uploadedFileId });

  const updateProfile = useUpdateProfile({ onSuccess });

  const loading = updateProfile.isPending || uploadAvatar.isUploading;

  const handleSubmit = () => {
    updateProfile.submit({
      fullName: fullNameField.trimmedFullName,
      avatarId: uploadAvatar.uploadedFileId,
    });
  };

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <ProfileEditLayout
        avatarSection={
          <AvatarEditSection
            currentAvatar={currentAvatar}
            previewUrl={avatarPreview.previewUrl}
            initials={fullNameField.initials}
            onPress={uploadAvatar.pickAndUpload}
            isUploading={uploadAvatar.isUploading || Boolean(avatarPreview.isPending)}
            hasUploaded={Boolean(uploadAvatar.uploadedFileId)}
            error={uploadAvatar.error || undefined}
            disabled={loading}
          />
        }
        input={
          <FullNameInput
            value={fullNameField.fullName}
            onChangeText={fullNameField.setFullName}
            onSubmitEditing={handleSubmit}
            error={updateProfile.error?.message}
            disabled={loading}
          />
        }
        actions={
          <Button
            variant="primary"
            onPress={handleSubmit}
            disabled={!fullNameField.isValid || loading}
            loading={loading}
          >
            Сохранить
          </Button>
        }
      />
    </ScreenLayout>
  );
}
