import { Image, View, type ViewProps } from 'react-native';

import { Text } from './text';
import { cn } from './utils/cn';

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
};

// Палитра цветов для fallback аватаров
const fallbackColors = [
  'bg-[#FF7F50]',
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-green-500',
  'bg-indigo-500',
  'bg-cyan-500',
];

// Простая хеш-функция для стабильного выбора цвета
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export type Avatar = {
  largeUrl: string;
  mediumUrl: string;
  smallUrl: string;
  thumbUrl: string;
};

export function Avatar({
  size = 'md',
  avatar,
  initials,
  fallbackColor,
  className,
  ...props
}: ViewProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  avatar?: Avatar;
  initials?: string;
  fallbackColor?: string;
}) {
  // Выбираем цвет на основе инициалов
  const colorIndex = initials ? hashString(initials) % fallbackColors.length : 0;
  const bgColor = fallbackColor || fallbackColors[colorIndex];

  return (
    <View
      className={cn(
        'rounded-full items-center justify-center overflow-hidden',
        sizeClasses[size],
        !avatar && bgColor,
        !avatar && !fallbackColor && 'dark:opacity-90',
        className,
      )}
      {...props}
    >
      {avatar?.largeUrl ? (
        <Image
          source={{
            uri: {
              sm: avatar.smallUrl,
              md: avatar.mediumUrl,
              lg: avatar.largeUrl,
              xl: avatar.largeUrl,
            }[size],
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : initials ? (
        <Text className={cn('text-white font-semibold', textSizeClasses[size])}>
          {initials.toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
}
