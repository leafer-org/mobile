import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

export function BackBar({ onBack }: { onBack: () => void }) {
  const isDark = useColorScheme() === 'dark';
  return (
    <View className="pb-2">
      <TouchableOpacity
        onPress={onBack}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Назад"
        className="w-9 h-9 items-center justify-center"
      >
        <Ionicons name="arrow-back" size={22} color={isDark ? '#e7e5e4' : '#1c1917'} />
      </TouchableOpacity>
    </View>
  );
}
