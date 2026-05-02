import type { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  header: ReactNode;
  body: ReactNode;
  overlay?: ReactNode;
};

export function DiscoveryScreenLayout({ header, body, overlay }: Props) {
  return (
    <View className="flex-1 bg-stone-50 dark:bg-stone-900">
      {header}
      {body}
      {overlay}
    </View>
  );
}
