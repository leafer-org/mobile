import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, useColorScheme, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

import type { OrganizationContact } from '../model/use-organization-detail';

const ICON_BY_TYPE: Record<OrganizationContact['type'], keyof typeof Ionicons.glyphMap> = {
  phone: 'call-outline',
  email: 'mail-outline',
  link: 'link-outline',
};

function buildHref(c: OrganizationContact): string {
  if (c.type === 'phone') return `tel:${c.value.replace(/\s/g, '')}`;
  if (c.type === 'email') return `mailto:${c.value}`;
  return c.value.startsWith('http') ? c.value : `https://${c.value}`;
}

export function OrganizationContacts({ contacts }: { contacts: OrganizationContact[] }) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  if (contacts.length === 0) return null;

  return (
    <View className="px-4 pt-4 gap-2">
      <Text className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
        Контакты
      </Text>
      {contacts.map((c, idx) => (
        <Pressable
          key={`${c.type}-${idx}`}
          onPress={() => Linking.openURL(buildHref(c)).catch(() => undefined)}
          android_ripple={{ color: isDark ? '#27272a' : '#f5f5f4' }}
          className="flex-row items-center gap-3 py-2"
        >
          <Ionicons name={ICON_BY_TYPE[c.type]} size={18} color={iconColor} />
          <View className="flex-1">
            <Text className="text-sm text-stone-900 dark:text-white">{c.value}</Text>
            {c.label && (
              <Text className="text-xs text-stone-500 dark:text-stone-400">{c.label}</Text>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
}
