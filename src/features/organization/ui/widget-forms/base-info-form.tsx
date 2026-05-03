import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

export type BaseInfoValue = {
  title: string;
  description: string;
};

export function BaseInfoForm({
  value,
  onChange,
}: {
  value: BaseInfoValue;
  onChange: (next: BaseInfoValue) => void;
}) {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text variant="label">Название услуги</Text>
        <TextInput
          value={value.title}
          onChangeText={(title) => onChange({ ...value, title })}
          placeholder="Например, «Урок йоги для начинающих»"
        />
      </View>
      <View className="gap-2">
        <Text variant="label">Описание</Text>
        <TextInput
          value={value.description}
          onChangeText={(description) => onChange({ ...value, description })}
          placeholder="Что входит, как проходит, для кого..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ minHeight: 100 }}
        />
      </View>
    </View>
  );
}
