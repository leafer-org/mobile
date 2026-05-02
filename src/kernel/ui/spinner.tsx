import { ActivityIndicator, View, type ViewProps } from 'react-native';

import { Text } from './text';
import { cn } from './utils/cn';

export function Spinner({
  size = 'large',
  color,
  text,
  className,
  ...props
}: ViewProps & {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}) {
  return (
    <View className={cn('items-center justify-center gap-3', className)} {...props}>
      <ActivityIndicator size={size} color={color ?? '#a8a29e'} />
      {text && <Text variant="body">{text}</Text>}
    </View>
  );
}
