import { useRouter } from 'expo-router';

import { CitySelectionScreen } from '@/features/auth/_city';

export default function CityScreenRoute() {
  const router = useRouter();

  return (
    <CitySelectionScreen
      onComplete={() => {
        router.replace('/(app)');
      }}
    />
  );
}
