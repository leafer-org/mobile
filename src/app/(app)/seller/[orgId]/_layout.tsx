import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function SellerOrgLayout() {
  const isDark = useColorScheme() === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? '#1c1917' : '#ffffff' },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="items/new" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
