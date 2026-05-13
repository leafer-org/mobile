import { Ionicons } from '@expo/vector-icons';
import { Pressable, useColorScheme } from 'react-native';

type Props = {
  onPress: () => void;
};

export function EmployeeChatBackButton({ onPress }: Props) {
  const isDark = useColorScheme() === 'dark';
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Назад"
      className="w-9 h-9 items-center justify-center"
    >
      <Ionicons name="arrow-back" size={22} color={isDark ? '#e7e5e4' : '#1c1917'} />
    </Pressable>
  );
}
