import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function SellerOrgTabsLayout() {
  const isDark = useColorScheme() === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#ffffff' : '#1c1917',
        tabBarInactiveTintColor: isDark ? '#78716c' : '#a8a29e',
        tabBarStyle: {
          backgroundColor: isDark ? '#1c1917' : '#ffffff',
          borderTopWidth: 0.5,
          borderTopColor: isDark ? '#292524' : '#e7e5e4',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Услуги',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Заявки',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Орг',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="client-link"
        options={{
          title: 'В клиент',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="arrow-back-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace('/');
          },
        }}
      />
    </Tabs>
  );
}
