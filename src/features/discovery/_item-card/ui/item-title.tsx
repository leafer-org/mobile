import { LinearGradient } from 'expo-linear-gradient';
import { View, useColorScheme } from 'react-native';

import { Text } from '@/kernel/ui/text';

const FADE_WIDTH = 24;

export function ItemTitle({ title }: { title: string }) {
  const isDark = useColorScheme() === 'dark';
  const bgColor = isDark ? '#1c1917' : '#fafaf9';

  return (
    <View className="overflow-hidden">
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        className="text-sm text-stone-700 dark:text-stone-300"
      >
        {title}
      </Text>
      <LinearGradient
        pointerEvents="none"
        colors={[`${bgColor}00`, bgColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: FADE_WIDTH,
        }}
      />
    </View>
  );
}
