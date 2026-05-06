import { View } from 'react-native';

export function ManagementMenuList({ children }: { children: React.ReactNode }) {
  return <View className="bg-white dark:bg-stone-900">{children}</View>;
}
