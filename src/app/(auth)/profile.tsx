import { useRouter } from 'expo-router';

import { ProfileSetupScreen } from '@/features/auth/profile';

export default function ProfileScreenRoute() {
  const router = useRouter();

  const handleSuccess = () => {
    router.replace('/(app)');
  };

  const handleSkip = () => {
    router.replace('/(app)');
  };

  return <ProfileSetupScreen onSuccess={handleSuccess} onSkip={handleSkip} />;
}
