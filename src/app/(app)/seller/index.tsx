import { type Href, router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { useSelectedOrg } from '@/features/organization/model/use-selected-org';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Spinner } from '@/kernel/ui/spinner';

export default function SellerEntryRoute() {
  const { isLoading, organizations, selectedId } = useSelectedOrg();

  useEffect(() => {
    if (isLoading) return;

    if (selectedId) {
      router.replace(`/seller/${selectedId}` as Href);
      return;
    }

    if (organizations.length === 1) {
      router.replace(`/seller/${organizations[0].id}` as Href);
      return;
    }

    router.replace('/seller/organizations' as Href);
  }, [isLoading, organizations, selectedId]);

  return (
    <ScreenLayout>
      <View className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </View>
    </ScreenLayout>
  );
}
