import type { ReactNode } from 'react';
import { View } from 'react-native';

export function ProfileEditLayout({
  avatarSection,
  input,
  actions,
}: {
  avatarSection: ReactNode;
  input: ReactNode;
  actions: ReactNode;
}) {
  return (
    <View className="gap-6 w-full">
      {avatarSection}
      {input}
      {actions}
    </View>
  );
}
