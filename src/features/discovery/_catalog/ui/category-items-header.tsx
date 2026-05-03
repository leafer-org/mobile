import { ChevronLeft, Search, Upload } from 'lucide-react-native';
import { TouchableOpacity, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/kernel/ui/text';

const STROKE = 1.4;

type Props = {
  title: string;
  subtitle?: string;
  onBackPress: () => void;
  onSearchPress?: () => void;
  onSharePress?: () => void;
};

export function CategoryItemsHeader({
  title,
  subtitle,
  onBackPress,
  onSearchPress,
  onSharePress,
}: Props) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#ffffff' : '#1c1917';

  return (
    <View
      className="bg-white dark:bg-stone-900 px-2 pb-2"
      style={{ paddingTop: insets.top + 4 }}
    >
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 items-center justify-center"
        style={{ top: insets.top + 4, bottom: 8 }}
      >
        <Text
          className="text-base font-semibold text-stone-900 dark:text-white"
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          testID="category-back"
          onPress={onBackPress}
          hitSlop={8}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={24} color={iconColor} strokeWidth={STROKE} />
        </TouchableOpacity>

        <View className="flex-row">
          {onSearchPress ? (
            <TouchableOpacity
              testID="category-search"
              onPress={onSearchPress}
              hitSlop={8}
              className="w-10 h-10 items-center justify-center"
            >
              <Search size={20} color={iconColor} strokeWidth={STROKE} />
            </TouchableOpacity>
          ) : null}
          {onSharePress ? (
            <TouchableOpacity
              testID="category-share"
              onPress={onSharePress}
              hitSlop={8}
              className="w-10 h-10 items-center justify-center"
            >
              <Upload size={20} color={iconColor} strokeWidth={STROKE} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}
