import { View } from 'react-native';

import type { OrganizationProfile } from '@/kernel/organization-profile';
import { Text } from '@/kernel/ui/text';

export function OrganizationDescription({ profile }: { profile: OrganizationProfile }) {
  if (!profile.description || profile.description.length === 0) return null;
  return (
    <View className="px-4 pt-1 pb-3">
      <Text className="text-sm text-stone-700 dark:text-stone-200 leading-5">
        {profile.description}
      </Text>
    </View>
  );
}
