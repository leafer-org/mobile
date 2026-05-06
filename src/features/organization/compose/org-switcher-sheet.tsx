import { ScrollView, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/features/discovery/ui/bottom-sheet';
import { Text } from '@/kernel/ui/text';

import { useMyOrganizations } from '../model/use-my-organizations';
import { OrgSwitcherCreateRow } from '../ui/org-switcher-create-row';
import { OrgSwitcherRow } from '../ui/org-switcher-row';

type Props = {
  visible: boolean;
  activeOrgId: string;
  onClose: () => void;
  onSelect: (orgId: string) => void;
  onCreateNew: () => void;
};

export function OrgSwitcherSheet({ visible, activeOrgId, onClose, onSelect, onCreateNew }: Props) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const { data } = useMyOrganizations();
  const organizations = data?.organizations ?? [];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View
        className="bg-white dark:bg-stone-900 rounded-t-2xl"
        style={{ paddingBottom: insets.bottom + 12, maxHeight: '80%' }}
      >
        <View className="items-center pt-3 pb-2">
          <View
            className="w-9 h-1 rounded-full"
            style={{ backgroundColor: isDark ? '#44403c' : '#d6d3d1' }}
          />
        </View>
        <Text className="px-4 pb-2 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Мои организации
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {organizations.map((o) => (
            <OrgSwitcherRow
              key={o.id}
              name={o.name}
              avatarUrl={o.avatarUrl}
              isActive={o.id === activeOrgId}
              onPress={() => onSelect(o.id)}
            />
          ))}
          <OrgSwitcherCreateRow onPress={onCreateNew} />
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
