import { Stack } from 'expo-router';

export default function SearchStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="results"
        options={{ animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
