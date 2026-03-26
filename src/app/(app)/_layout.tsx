import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Suspense } from 'react';
import { useColorScheme, View } from 'react-native';

import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';

function SuspenseFallback() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900 px-6 gap-4">
      <Spinner size="large" />
      <Text variant="body">Загрузка...</Text>
    </View>
  );
}

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0d9488',
          tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8',
          tabBarStyle: {
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderTopWidth: 0.5,
            borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Главная',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="catalog"
          options={{
            title: 'Каталог',
            tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Избранное',
            tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: 'Чаты',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
      </Tabs>
    </Suspense>
  );
}
