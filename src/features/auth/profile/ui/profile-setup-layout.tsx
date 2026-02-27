import type { ReactNode } from 'react';
import { View } from 'react-native';

export function ProfileSetupLayout({
  header,
  avatarSection,
  input,
  actions,
}: {
  header: ReactNode;
  avatarSection: ReactNode;
  input: ReactNode;
  actions: ReactNode;
}) {
  return (
    <View className="gap-6 w-full">
      {header}
      {avatarSection}
      {input}
      {actions}
    </View>
  );
}
