import { useState } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';

import { useInputStyles } from '@/kernel/ui/input-base';
import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

export function DescriptionInput({
  value,
  onChangeText,
  disabled,
}: {
  value: string;
  onChangeText: (v: string) => void;
  disabled?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const { inputClasses } = useInputStyles({ isFocused, editable: !disabled });

  return (
    <View className="gap-1.5">
      <Text variant="label">Описание</Text>
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        placeholder="Расскажите об организации"
        placeholderTextColor="#a8a29e"
        multiline
        textAlignVertical="top"
        className={cn(inputClasses, 'min-h-28')}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}
