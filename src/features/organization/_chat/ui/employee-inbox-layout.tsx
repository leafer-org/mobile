import type { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  header: ReactNode;
  content: ReactNode;
};

export function EmployeeInboxLayout({ header, content }: Props) {
  return (
    <View className="flex-1 bg-white dark:bg-stone-900">
      {header}
      {content}
    </View>
  );
}
