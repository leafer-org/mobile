import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { forwardRef, useState } from 'react';
import { Pressable, TextInput, useColorScheme, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: () => void;
  onBackPress?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
};

export const SearchInput = forwardRef<TextInput, Props>(function SearchInput(
  { value, onChangeText, onSubmit, onBackPress, autoFocus, placeholder = 'Поиск' },
  ref,
) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';
  const [focused, setFocused] = useState(false);

  return (
    <View className="flex-row items-center gap-2">
      {onBackPress && (
        <Pressable
          onPress={onBackPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        >
          <Ionicons name="arrow-back" size={22} color={iconColor} />
        </Pressable>
      )}
      <View
        className={clsx(
          'flex-1 flex-row items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-xl px-3 py-2 border',
          focused
            ? 'border-stone-400 dark:border-stone-500'
            : 'border-transparent',
        )}
      >
        <Ionicons name="search-outline" size={16} color={iconColor} />
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          placeholder={placeholder}
          placeholderTextColor={iconColor}
          className="flex-1 text-sm text-stone-900 dark:text-white p-0"
          // @ts-expect-error — react-native-web only: убираем дефолтный браузерный outline,
          // фокус показываем через border на обёртке (см. View выше).
          style={{ outlineStyle: 'none' }}
          testID="search-input"
        />
        {value.length > 0 && (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Очистить"
          >
            <Ionicons name="close-circle" size={18} color={iconColor} />
          </Pressable>
        )}
      </View>
    </View>
  );
});
