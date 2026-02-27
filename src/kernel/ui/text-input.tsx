import { useState } from 'react';
import { TextInput as RNTextInput, type TextInputProps, View } from 'react-native';

import { useInputStyles } from './input-base';

export function TextInput({
  error,
  value,
  onChangeText,
  ...props
}: TextInputProps & {
  error?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  const { containerClasses, textClasses } = useInputStyles({
    isFocused,
    error: error ? 'error' : undefined,
    editable: props.editable,
  });

  return (
    <View className={containerClasses}>
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        className={textClasses}
        placeholderTextColor="#94a3b8"
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
}
