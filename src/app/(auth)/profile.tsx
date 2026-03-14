import { useRouter } from 'expo-router';

import { ProfileSetupScreen } from '@/features/auth/_profile';

export default function ProfileScreenRoute() {
  const router = useRouter();

  return (
    <ProfileSetupScreen
      onSuccess={() => {
        router.replace('/(app)');
      }}
    />
  );
}
