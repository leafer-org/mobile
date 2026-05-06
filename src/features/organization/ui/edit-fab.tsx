import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, useColorScheme } from 'react-native';

export function EditFab({ onPress }: { onPress: () => void }) {
  const isDark = useColorScheme() === 'dark';
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Редактировать организацию"
      onPress={onPress}
      className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-stone-900 dark:bg-white items-center justify-center shadow-lg"
      activeOpacity={0.85}
    >
      <Ionicons name="pencil" size={22} color={isDark ? '#1c1917' : '#ffffff'} />
    </TouchableOpacity>
  );
}
