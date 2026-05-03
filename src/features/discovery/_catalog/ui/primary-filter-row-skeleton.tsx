import { useEffect, useRef } from 'react';
import { Animated, ScrollView, View } from 'react-native';

const PILL_WIDTHS = [64, 80, 56, 72];

export function PrimaryFilterRowSkeleton() {
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
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 4,
          gap: 6,
          alignItems: 'center',
        }}
      >
        <Animated.View
          className="bg-stone-200 dark:bg-stone-800 rounded-md"
          style={{ width: 40, height: 28, opacity }}
        />
        {PILL_WIDTHS.map((w, i) => (
          <Animated.View
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder
            key={i}
            className="bg-stone-200 dark:bg-stone-800 rounded-md"
            style={{ width: w, height: 28, opacity }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
