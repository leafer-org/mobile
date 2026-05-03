import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ProfileEditScreen } from '@/features/profile';
import { Button } from '@/kernel/ui/button';
import { useMeSuspense } from '@/support/user';

export default function ProfileScreenRoute() {
  const router = useRouter();
  const me = useMeSuspense();

  return (
    <ProfileEditScreen
      currentFullName={me.fullName}
      currentAvatar={me.avatar}
      extras={
        <View className="gap-2 mt-2">
          <Button variant="outline" onPress={() => router.push('/onboarding/create-organization')}>
            Выложить объявление
          </Button>
        </View>
      }
      onSuccess={() => {
        router.back();
      }}
    />
  );
}
