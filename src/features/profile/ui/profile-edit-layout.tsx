import type { ReactNode } from 'react';
import { View } from 'react-native';

export function ProfileEditLayout({
  avatarSection,
  input,
  citySection,
  actions,
}: {
  avatarSection: ReactNode;
  input: ReactNode;
  citySection?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <View className="gap-6 w-full">
      {avatarSection}
      {input}
      {citySection}
      {actions}
    </View>
  );
}
