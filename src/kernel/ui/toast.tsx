import { useEffect, useRef } from 'react';
import { Animated, Pressable, View, type ViewProps } from 'react-native';

import { Text } from './text';
import { cn } from './utils/cn';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

const variantClasses: Record<ToastVariant, string> = {
  success: 'bg-green-600 dark:bg-green-500',
  error: 'bg-red-600 dark:bg-red-500',
  info: 'bg-stone-900 dark:bg-white',
  warning: 'bg-orange-600 dark:bg-orange-500',
};

export function Toast({
  variant = 'info',
  message,
  visible,
  onDismiss,
  duration = 3000,
  className,
  ...props
}: ViewProps & {
  variant?: ToastVariant;
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  duration?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;
  const isAnimating = useRef(false);

  useEffect(() => {
    if (visible) {
      isAnimating.current = true;
      // Показываем
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 15,
        }),
      ]).start();

      // Автоматически скрываем
      if (duration > 0) {
        const timer = setTimeout(() => {
          onDismiss?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      // Скрываем
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
      });
    }
  }, [visible, duration, onDismiss, opacity, translateY]);

  if (!visible && !isAnimating.current) {
    return null;
  }

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className={cn('absolute top-12 left-4 right-4 z-50 rounded-xl shadow-lg', className)}
      {...props}
    >
      <Pressable onPress={onDismiss}>
        <View className={cn('px-4 py-3 rounded-xl', variantClasses[variant])}>
          <Text className="text-white font-medium text-center">{message}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
