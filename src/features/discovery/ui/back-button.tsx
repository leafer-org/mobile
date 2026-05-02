import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, useColorScheme } from 'react-native';

type Props = {
  onPress: () => void;
};

export function BackButton({ onPress }: Props) {
  const isDark = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      testID="back-button"
      hitSlop={8}
      className="w-9 h-9 items-center justify-center"
    >
      <Ionicons
        name="arrow-back"
        size={22}
        color={isDark ? '#e7e5e4' : '#1c1917'}
      />
    </TouchableOpacity>
  );
}
