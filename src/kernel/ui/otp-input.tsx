import { useRef, useState } from 'react';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';

import { Text } from './text';
import { cn } from './utils/cn';

export function OtpInput({
  length = 6,
  value,
  onChangeText,
  error,
  className,
  autoFocus,
  ...props
}: Omit<TextInputProps, 'value' | 'onChangeText'> & {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  error?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const digits = value.split('');
  const filledDigits = [...digits, ...new Array(length - digits.length).fill('')];

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleChange = (text: string) => {
    // Оставляем только цифры
    const numericText = text.replace(/[^0-9]/g, '');
    // Ограничиваем длину
    const limitedText = numericText.slice(0, length);
    onChangeText(limitedText);
  };

  return (
    <View className={cn('w-full', className)}>
      <Pressable onPress={handlePress}>
        <View className="flex-row justify-between gap-3">
          {filledDigits.map((digit, index) => {
            const isActive = isFocused && index === digits.length;
            const isFilled = digit !== '';

            return (
              <View
                // biome-ignore lint/suspicious/noArrayIndexKey: Здесь можно использовать index как ключ
                key={index}
                className={cn(
                  'flex-1 aspect-square items-center justify-center rounded-2xl border-2',
                  'bg-white dark:bg-stone-800',
                  !error && !isActive && !isFilled && 'border-stone-300 dark:border-stone-600',
                  !error &&
                    isActive &&
                    'border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800',
                  !error && isFilled && !isActive && 'border-stone-900 dark:border-white',
                  error && 'border-red-600 dark:border-red-400',
                )}
              >
                {isFilled ? (
                  <Text variant="h1" className="text-stone-900 dark:text-white">
                    {digit}
                  </Text>
                ) : (
                  <Text variant="h1" className="text-stone-300 dark:text-stone-600">
                    •
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </Pressable>

      {/* Скрытый input для ввода */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        className="absolute opacity-0 w-0 h-0"
        {...props}
      />
    </View>
  );
}
