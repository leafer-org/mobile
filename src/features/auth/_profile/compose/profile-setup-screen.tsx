import { useRegistrationState } from '../../model/registration-store';
import { useAvatarPreview } from '../model/use-avatar-preview';
import { useCompleteProfileForm } from '../model/use-complete-profile';
import { useProfileFullName } from '../model/use-profile-full-name';
import { useUploadAvatar } from '../model/use-upload-avatar';
import { AvatarUploadSection } from '../ui/avatar-upload-section';
import { FullNameInput } from '../ui/full-name-input';
import { ProfileSetupActions } from '../ui/profile-setup-actions';
import { ProfileSetupHeader } from '../ui/profile-setup-header';
import { ProfileSetupLayout } from '../ui/profile-setup-layout';
import { ScreenLayout } from '@/kernel/ui/screen-layout';

export function ProfileSetupScreen({ onSuccess }: { onSuccess: () => void }) {
  const { registrationSessionId, cityId, lat, lng } = useRegistrationState();

  const uploadAvatar = useUploadAvatar({ onSuccess: () => {} });
  const avatarPreview = useAvatarPreview({ fileId: uploadAvatar.uploadedFileId });

  const fullNameField = useProfileFullName();

  const profileSubmit = useCompleteProfileForm({
    registrationSessionId: registrationSessionId ?? '',
    cityId: cityId ?? '',
    lat,
    lng,
    fullName: fullNameField.fullName,
    avatarId: uploadAvatar.uploadedFileId,
    onSuccess,
  });

  const loading = profileSubmit.isSubmitting || uploadAvatar.isUploading;

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <ProfileSetupLayout
        header={<ProfileSetupHeader />}
        avatarSection={
          <AvatarUploadSection
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
            onSubmitEditing={profileSubmit.submit}
            error={profileSubmit.error?.message}
            disabled={loading}
          />
        }
        actions={
          <ProfileSetupActions
            onSubmit={profileSubmit.submit}
            submitDisabled={!fullNameField.isValid}
            loading={loading}
          />
        }
      />
    </ScreenLayout>
  );
}
