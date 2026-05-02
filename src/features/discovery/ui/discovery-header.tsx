import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  leading?: ReactNode;
  ageGroupSlot?: ReactNode;
  trailing?: ReactNode;
  searchSlot: ReactNode;
  breadcrumbsSlot?: ReactNode;
};

export function DiscoveryHeader({
  leading,
  ageGroupSlot,
  trailing,
  searchSlot,
  breadcrumbsSlot,
}: Props) {
  const insets = useSafeAreaInsets();
  const hasBreadcrumbs = breadcrumbsSlot != null;
  const hasTopRow = leading != null || ageGroupSlot != null || trailing != null;

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
      {!hasBreadcrumbs && hasTopRow && (
        <View className="flex-row items-center gap-2">
          {leading}
          {ageGroupSlot && <View className="flex-1">{ageGroupSlot}</View>}
          {trailing}
        </View>
      )}
    </View>
  );
}
