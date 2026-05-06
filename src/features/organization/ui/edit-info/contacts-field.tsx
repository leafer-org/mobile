import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import type { ContactLink } from '../../model/edit-info-form';
import { ContactLinkType } from '@/kernel/api/schema';
import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

const TYPE_OPTIONS: { label: string; value: ContactLinkType }[] = [
  { label: 'Телефон', value: ContactLinkType.phone },
  { label: 'Email', value: ContactLinkType.email },
  { label: 'Ссылка', value: ContactLinkType.link },
];

const placeholderByType: Record<ContactLinkType, string> = {
  [ContactLinkType.phone]: '+7 999 000 00 00',
  [ContactLinkType.email]: 'name@example.com',
  [ContactLinkType.link]: 'https://example.com',
};

export function ContactsField({
  value,
  onChange,
  onAdd,
  disabled,
}: {
  value: ContactLink[];
  onChange: (v: ContactLink[]) => void;
  onAdd: () => void;
  disabled?: boolean;
}) {
  const isDark = useColorScheme() === 'dark';

  const update = (index: number, patch: Partial<ContactLink>) => {
    const next = value.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <View className="gap-3">
      <Text variant="label">Контакты</Text>

      {value.map((contact, index) => (
        <View
          key={contact._localId}
          className="gap-2 rounded-xl border border-stone-200 dark:border-stone-700 p-3"
        >
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <Dropdown
                data={TYPE_OPTIONS}
                labelField="label"
                valueField="value"
                value={contact.type}
                onChange={(item: { label: string; value: ContactLinkType }) =>
                  update(index, { type: item.value })
                }
                disable={disabled}
                style={{
                  height: 44,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isDark ? '#57534e' : '#d6d3d1',
                  backgroundColor: isDark ? '#292524' : '#ffffff',
                }}
                selectedTextStyle={{
                  color: isDark ? '#ffffff' : '#1c1917',
                  fontSize: 14,
                }}
                itemTextStyle={{ color: isDark ? '#ffffff' : '#1c1917', fontSize: 14 }}
                containerStyle={{
                  borderRadius: 8,
                  backgroundColor: isDark ? '#292524' : '#ffffff',
                  borderColor: isDark ? '#57534e' : '#d6d3d1',
                }}
                activeColor={isDark ? '#44403c' : '#f5f5f4'}
              />
            </View>
            <TouchableOpacity
              onPress={() => remove(index)}
              disabled={disabled}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Удалить контакт"
              className="h-11 w-11 items-center justify-center"
            >
              <Ionicons name="trash-outline" size={20} color={isDark ? '#a8a29e' : '#78716c'} />
            </TouchableOpacity>
          </View>

          <TextInput
            value={contact.value}
            onChangeText={(v) => update(index, { value: v })}
            placeholder={placeholderByType[contact.type]}
            keyboardType={
              contact.type === ContactLinkType.email
                ? 'email-address'
                : contact.type === ContactLinkType.phone
                  ? 'phone-pad'
                  : 'url'
            }
            autoCapitalize="none"
            editable={!disabled}
          />

          <TextInput
            value={contact.label ?? ''}
            onChangeText={(v) => update(index, { label: v })}
            placeholder="Подпись (необязательно)"
            editable={!disabled}
          />
        </View>
      ))}

      <Button variant="outline" size="sm" onPress={onAdd} disabled={disabled}>
        Добавить контакт
      </Button>
    </View>
  );
}
