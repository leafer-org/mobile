import { useRouter } from 'expo-router';

import { ProfileEditScreen } from '@/features/profile';
import { useMeSuspense } from '@/support/user';

export default function ProfileScreenRoute() {
  const router = useRouter();
  const me = useMeSuspense();

  return (
    <ProfileEditScreen
      currentFullName={me.fullName}
      currentAvatar={me.avatar}
      onSuccess={() => {
        router.back();
      }}
    />
  );
}
