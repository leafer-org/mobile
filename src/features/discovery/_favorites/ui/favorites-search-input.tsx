import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
};

export function FavoritesSearchInput({ value, onChangeText }: Props) {
  return (
    <View className="flex-row items-center bg-stone-100 dark:bg-stone-800 rounded-lg px-3 py-2 gap-2">
      <Ionicons name="search-outline" size={16} color="#a8a29e" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Поиск по названию..."
        placeholderTextColor="#a8a29e"
        className="flex-1 text-sm text-stone-900 dark:text-white p-0"
        autoCorrect={false}
      />
    </View>
  );
}
