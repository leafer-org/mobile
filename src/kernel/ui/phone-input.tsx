import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { View } from 'react-native';
import MaskInput from 'react-native-mask-input';

import { useInputStyles } from './input-base';

export function PhoneInput({
  error,
  value,
  onChangeText,
  ...props
}: Omit<TextInputProps, 'onChangeText'> & {
  error?: boolean;
  onChangeText?: (formatted: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);

  const { containerClasses, textClasses } = useInputStyles({
    isFocused,
    error: error ? 'error' : undefined,
    editable: props.editable,
  });

  const handleMaskedChangeText = (masked: string) => {
    onChangeText?.(masked);
  };

  return (
    <View className={containerClasses}>
      <MaskInput
        value={value}
        onChangeText={handleMaskedChangeText}
        mask={[
          '+',
          '7',
          ' ',
          '(',
          /\d/,
          /\d/,
          /\d/,
          ')',
          ' ',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
        ]}
        keyboardType="phone-pad"
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
