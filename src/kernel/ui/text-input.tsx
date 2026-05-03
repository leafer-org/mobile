import { useState } from 'react';
import { TextInput as RNTextInput, type TextInputProps } from 'react-native';

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

  const { inputClasses } = useInputStyles({
    isFocused,
    error: error ? 'error' : undefined,
    editable: props.editable,
  });

  return (
    <RNTextInput
      value={value}
      onChangeText={onChangeText}
      className={inputClasses}
      placeholderTextColor="#a8a29e"
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
  );
}
