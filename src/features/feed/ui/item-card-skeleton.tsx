import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { CARD_WIDTH, GRID_GAP, MEDIA_HEIGHT } from './item-card-layout';

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
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden"
      style={{ width: CARD_WIDTH, marginBottom: GRID_GAP }}
    >
      <Animated.View
        className="bg-slate-200 dark:bg-slate-700"
        style={{ width: CARD_WIDTH, height: MEDIA_HEIGHT, opacity }}
      />
      <View className="p-2 gap-2">
        <Animated.View className="bg-slate-200 dark:bg-slate-700 rounded h-3 w-full" style={{ opacity }} />
        <Animated.View className="bg-slate-200 dark:bg-slate-700 rounded h-3 w-2/3" style={{ opacity }} />
        <Animated.View className="bg-slate-200 dark:bg-slate-700 rounded h-2.5 w-1/3" style={{ opacity }} />
      </View>
    </View>
  );
}

export function ItemListSkeleton() {
  return (
    <View className="flex-row flex-wrap gap-2 px-3 pt-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </View>
  );
}
