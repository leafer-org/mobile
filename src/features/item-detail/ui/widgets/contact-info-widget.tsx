import { Linking, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/kernel/ui/text';

type Contact = { type: string; value: string; label?: string };

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  phone: 'call-outline',
  email: 'mail-outline',
  link: 'link-outline',
};

export function ContactInfoWidget({ contacts }: { contacts: Contact[] }) {
  if (contacts.length === 0) return null;

  const handlePress = (contact: Contact) => {
    if (contact.type === 'phone') Linking.openURL(`tel:${contact.value}`);
    else if (contact.type === 'email') Linking.openURL(`mailto:${contact.value}`);
    else Linking.openURL(contact.value);
  };

  return (
    <View className="px-4 gap-2">
      <Text variant="label">Контакты</Text>
      {contacts.map((c, i) => (
        <TouchableOpacity key={i} onPress={() => handlePress(c)} className="flex-row items-center gap-2">
          <Ionicons name={ICON_MAP[c.type] ?? 'link-outline'} size={16} color="#0d9488" />
          <Text className="text-teal-600 dark:text-teal-400">{c.label || c.value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
