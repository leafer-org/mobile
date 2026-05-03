import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { CARD_WIDTH, GRID_GAP, HORIZONTAL_PADDING, MEDIA_HEIGHT, ROW_GAP } from './grid';

export function ItemCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View
      style={{ width: CARD_WIDTH, marginBottom: ROW_GAP }}
    >
      <Animated.View
        className="bg-stone-200 dark:bg-stone-700"
        style={{ width: CARD_WIDTH, height: MEDIA_HEIGHT, opacity }}
      />
      <View className="px-2 pt-2 gap-2">
        <Animated.View className="bg-stone-200 dark:bg-stone-700 rounded h-3 w-full" style={{ opacity }} />
        <Animated.View className="bg-stone-200 dark:bg-stone-700 rounded h-3 w-2/3" style={{ opacity }} />
        <Animated.View className="bg-stone-200 dark:bg-stone-700 rounded h-2.5 w-1/3" style={{ opacity }} />
      </View>
    </View>
  );
}

export function ItemListSkeleton() {
  return (
    <View
      className="flex-row flex-wrap"
      style={{
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingTop: 8,
        gap: GRID_GAP,
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </View>
  );
}
