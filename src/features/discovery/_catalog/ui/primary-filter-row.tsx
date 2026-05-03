import { ChevronDown, SlidersHorizontal } from 'lucide-react-native';
import { ScrollView, TouchableOpacity, View, useColorScheme } from 'react-native';

import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

type TypeFilter = { typeId: string; name: string };

type Props = {
  hasActiveFilters: boolean;
  onFilterPress: () => void;
  typeFilters: TypeFilter[];
  selectedTypeIds: Set<string>;
  onToggleType: (typeId: string) => void;
  hasPriceRange: boolean;
  priceMin?: number;
  priceMax?: number;
  onPricePress: () => void;
  hasRating: boolean;
  minRating?: number;
  onRatingPress: () => void;
};

export function PrimaryFilterRow({
  hasActiveFilters,
  onFilterPress,
  typeFilters,
  selectedTypeIds,
  onToggleType,
  hasPriceRange,
  priceMin,
  priceMax,
  onPricePress,
  hasRating,
  minRating,
  onRatingPress,
}: Props) {
  const isDark = useColorScheme() === 'dark';
  const accent = isDark ? '#ffffff' : '#1c1917';
  const dim = isDark ? '#a8a29e' : '#78716c';

  const priceActive = priceMin != null || priceMax != null;
  const ratingActive = minRating != null;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 4,
          gap: 6,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          testID="filter-button"
          activeOpacity={0.7}
          onPress={onFilterPress}
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-md border border-stone-300 dark:border-stone-700"
        >
          <SlidersHorizontal
            size={14}
            color={hasActiveFilters ? accent : dim}
            strokeWidth={1.5}
          />
          {hasActiveFilters && (
            <View className="w-1.5 h-1.5 rounded-full bg-[#FF7F50]" />
          )}
        </TouchableOpacity>

        {hasPriceRange && (
          <TouchableOpacity
            testID="price-quick"
            activeOpacity={0.7}
            onPress={onPricePress}
            className={cn(
              'flex-row items-center gap-1 px-3 py-1.5 rounded-md border',
              priceActive
                ? 'border-stone-900 dark:border-white'
                : 'border-stone-300 dark:border-stone-700',
            )}
          >
            <Text
              className={cn(
                'text-xs',
                priceActive
                  ? 'text-stone-900 dark:text-white'
                  : 'text-stone-600 dark:text-stone-400',
              )}
              style={{ includeFontPadding: false, transform: [{ translateY: -1 }] }}
            >
              {priceActive ? `${priceMin ?? 0}—${priceMax ?? '∞'} ₽` : 'Цена'}
            </Text>
            <ChevronDown size={14} color={dim} strokeWidth={1.5} />
          </TouchableOpacity>
        )}

        {hasRating && (
          <TouchableOpacity
            testID="rating-quick"
            activeOpacity={0.7}
            onPress={onRatingPress}
            className={cn(
              'flex-row items-center gap-1 px-3 py-1.5 rounded-md border',
              ratingActive
                ? 'border-stone-900 dark:border-white'
                : 'border-stone-300 dark:border-stone-700',
            )}
          >
            <Text
              className={cn(
                'text-xs',
                ratingActive
                  ? 'text-stone-900 dark:text-white'
                  : 'text-stone-600 dark:text-stone-400',
              )}
              style={{ includeFontPadding: false, transform: [{ translateY: -1 }] }}
            >
              {ratingActive ? `${minRating}+` : 'Рейтинг'}
            </Text>
            <ChevronDown size={14} color={dim} strokeWidth={1.5} />
          </TouchableOpacity>
        )}

        {typeFilters.map((t) => {
          const isActive = selectedTypeIds.has(t.typeId);
          return (
            <TouchableOpacity
              key={t.typeId}
              testID={`type-chip-${t.typeId}`}
              activeOpacity={0.7}
              onPress={() => onToggleType(t.typeId)}
              className={cn(
                'px-3 py-1.5 rounded-md border',
                isActive
                  ? 'border-stone-900 bg-stone-100 dark:bg-stone-800 dark:border-white'
                  : 'border-stone-300 dark:border-stone-700',
              )}
            >
              <Text
                className={cn(
                  'text-xs',
                  isActive
                    ? 'text-stone-900 dark:text-white'
                    : 'text-stone-600 dark:text-stone-400',
                )}
                style={{ includeFontPadding: false, transform: [{ translateY: -1 }] }}
              >
                {t.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
