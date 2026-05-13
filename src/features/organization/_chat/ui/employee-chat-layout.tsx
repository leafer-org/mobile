import type { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  header: ReactNode;
  actions: ReactNode;
  messages: ReactNode;
  composer: ReactNode;
  modal?: ReactNode;
};

export function EmployeeChatLayout({ header, actions, messages, composer, modal }: Props) {
  return (
    <View className="flex-1 bg-white dark:bg-stone-900">
      {header}
      {actions}
      <View className="flex-1">{messages}</View>
      {composer}
      {modal}
    </View>
  );
}
