import { useEffect, useRef } from 'react';
import { Animated, ScrollView, View } from 'react-native';

const PLACEHOLDER_WIDTHS = [56, 84, 72, 96, 64, 80];

export function SubcategoriesRowSkeleton() {
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
    <View>
      <ScrollView
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 4, gap: 6 }}
      >
        {PLACEHOLDER_WIDTHS.map((w, i) => (
          <Animated.View
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder
            key={i}
            className="bg-stone-200 dark:bg-stone-800 rounded-md"
            style={{ width: w, height: 26, opacity }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
