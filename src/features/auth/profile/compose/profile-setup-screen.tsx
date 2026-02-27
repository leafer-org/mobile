import { useState } from 'react';

import { useAvatarPreview } from '../model/use-avatar-preview';
import { useCompleteProfileForm } from '../model/use-complete-profile';
import { useProfileFullName } from '../model/use-profile-full-name';
import { useUploadAvatar } from '../model/use-upload-avatar';
import { MediaRecord } from '../model/use-upload-media';
import { AvatarUploadSection } from '../ui/avatar-upload-section';
import { FullNameInput } from '../ui/full-name-input';
import { ProfileSetupActions } from '../ui/profile-setup-actions';
import { ProfileSetupHeader } from '../ui/profile-setup-header';
import { ProfileSetupLayout } from '../ui/profile-setup-layout';
import { ScreenLayout } from '@/kernel/ui/screen-layout';

export function ProfileSetupScreen(props: { onSuccess: () => void; onSkip: () => void }) {
  const [avatarMedia, setAvatarMedia] = useState<MediaRecord>();
  const uploadAvatar = useUploadAvatar({
    onSuccess: setAvatarMedia,
  });
  const avatarPreview = useAvatarPreview({ media: avatarMedia });

  const fullNameField = useProfileFullName();

  const profileSubmit = useCompleteProfileForm({
    fullName: fullNameField.fullName,
    avatar: avatarPreview.validMedia,
    onSuccess: props.onSuccess,
  });

  const loading = profileSubmit.isSubmitting || uploadAvatar.isUploading;

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <ProfileSetupLayout
        header={<ProfileSetupHeader />}
        avatarSection={
          <AvatarUploadSection
            preview={avatarPreview.avatar}
            initials={fullNameField.initials}
            onPress={uploadAvatar.pickAndUpload}
            isUploading={uploadAvatar.isUploading || Boolean(avatarPreview.isPending)}
            hasUploaded={Boolean(uploadAvatar.uploadedMediaId)}
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
            onSkip={props.onSkip}
            submitDisabled={!fullNameField.isValid}
            loading={loading}
          />
        }
      />
    </ScreenLayout>
  );
}
