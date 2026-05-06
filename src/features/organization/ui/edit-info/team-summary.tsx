import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export function TeamSummaryRow({
  title,
  membersCount,
  onPress,
  disabled,
}: {
  title: string;
  membersCount: number;
  onPress: () => void;
  disabled?: boolean;
}) {
  const isDark = useColorScheme() === 'dark';

  const subtitle =
    membersCount === 0
      ? 'Не настроена'
      : `${title.trim() || 'Без названия'} · ${membersCount} ${pluralMembers(membersCount)}`;

  return (
    <View className="gap-1.5">
      <Text variant="label">Команда</Text>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        className="flex-row items-center gap-3 rounded-xl border border-stone-200 dark:border-stone-700 px-4 py-3"
      >
        <View className="flex-1">
          <Text variant="body" numberOfLines={1}>
            Состав и описание
          </Text>
          <Text variant="caption" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={isDark ? '#a8a29e' : '#78716c'} />
      </TouchableOpacity>
    </View>
  );
}

function pluralMembers(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'участников';
  if (mod10 === 1) return 'участник';
  if (mod10 >= 2 && mod10 <= 4) return 'участника';
  return 'участников';
}
