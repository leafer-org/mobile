import type { ReactNode } from 'react';
import { View } from 'react-native';

export function FormField({ children }: { children: ReactNode }) {
  return <View className="w-full">{children}</View>;
}
