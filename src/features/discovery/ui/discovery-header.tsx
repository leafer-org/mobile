import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  leading?: ReactNode;
  trailing?: ReactNode;
  searchSlot: ReactNode;
  breadcrumbsSlot?: ReactNode;
};

export function DiscoveryHeader({
  leading,
  trailing,
  searchSlot,
  breadcrumbsSlot,
}: Props) {
  const insets = useSafeAreaInsets();
  const hasBreadcrumbs = breadcrumbsSlot != null;

  return (
    <View
      className="bg-white dark:bg-stone-900 px-3 pb-2 gap-2"
      style={{ paddingTop: insets.top + 12 }}
    >
      {searchSlot}
      {hasBreadcrumbs && (
        <View className="flex-row items-center justify-between gap-2">
          {leading}
          <View className="flex-1">{breadcrumbsSlot}</View>
          {trailing}
        </View>
      )}
    </View>
  );
}
