import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function SellerOrgChatsStackLayout() {
  const isDark = useColorScheme() === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? '#1c1917' : '#ffffff' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[chatId]" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
