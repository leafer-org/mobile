import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  name: string;
  iconUrl: string;
  width: number;
  height: number;
  testID?: string;
  onPress: () => void;
};

export function CategoryTile({ name, iconUrl, width, height, testID, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';
  const [iconFailed, setIconFailed] = useState(false);

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.85}
      onPress={onPress}
      style={{ width, height }}
      className="rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800"
    >
      {iconFailed ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons
            name="folder-outline"
            size={32}
            color={isDark ? '#ffffff' : '#1c1917'}
          />
        </View>
      ) : (
        <Image
          source={{ uri: iconUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onError={() => setIconFailed(true)}
        />
      )}

      <View
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        className="bg-black/30"
      />

      <View className="absolute inset-x-0 bottom-0 px-2 py-2">
        <Text
          numberOfLines={2}
          className="text-white text-xs leading-tight"
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
