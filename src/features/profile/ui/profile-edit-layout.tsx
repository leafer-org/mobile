import type { ReactNode } from 'react';
import { View } from 'react-native';

export function ProfileEditLayout({
  avatarSection,
  input,
  citySection,
  extras,
  actions,
}: {
  avatarSection: ReactNode;
  input: ReactNode;
  citySection?: ReactNode;
  extras?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <View className="gap-6 w-full">
      {avatarSection}
      {input}
      {citySection}
      {extras}
      {actions}
    </View>
  );
}
