import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { ItemListView } from '../domain/types';
import { MediaCarousel } from './media-carousel';
import { Text } from '@/kernel/ui/text';

export function ItemCard({
  item,
  isVisible = true,
}: {
  item: ItemListView;
  isVisible?: boolean;
}) {
  return (
    <View className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden mx-4 mb-4 shadow-sm">
      <MediaCarousel media={item.media} isVisible={isVisible} />

      <View className="p-3 gap-1.5">
        <Text variant="label" numberOfLines={2}>
          {item.title}
        </Text>

        <PriceLabel price={item.price} />

        <View className="flex-row items-center justify-between">
          <RatingBadge rating={item.rating} reviewCount={item.reviewCount} />
          <OwnerBadge owner={item.owner} />
        </View>
      </View>
    </View>
  );
}

function PriceLabel({ price }: { price: ItemListView['price'] }) {
  if (!price?.options?.length) return null;

  const options = price.options;
  const freeOption = options.find((o) => o.strategy === 'free');

  if (options.length === 1 && freeOption) {
    return <Text className="text-teal-600 dark:text-teal-400 font-semibold text-sm">Бесплатно</Text>;
  }

  const pricesWithValue = options.filter((o) => o.price != null && o.price > 0);
  if (pricesWithValue.length === 0) return null;

  const minPrice = Math.min(...pricesWithValue.map((o) => o.price!));
  const hasSub = options.some((o) => o.strategy === 'subscription');

  if (options.length === 1) {
    const opt = options[0]!;
    if (opt.strategy === 'subscription') {
      return <Text className="font-semibold text-sm text-slate-900 dark:text-white">{formatPrice(opt.price!)} / мес</Text>;
    }
    return <Text className="font-semibold text-sm text-slate-900 dark:text-white">{formatPrice(opt.price!)}</Text>;
  }

  const suffix = hasSub ? ' / мес' : '';
  return <Text className="font-semibold text-sm text-slate-900 dark:text-white">от {formatPrice(minPrice)}{suffix}</Text>;
}

function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} \u20BD`;
}

function RatingBadge({ rating, reviewCount }: { rating: number | null; reviewCount: number }) {
  if (rating == null) return null;

  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name="star" size={14} color="#f59e0b" />
      <Text className="text-xs text-slate-700 dark:text-slate-300">
        {rating.toFixed(1)}
      </Text>
      <Text className="text-xs text-slate-400">({reviewCount})</Text>
    </View>
  );
}

function OwnerBadge({ owner }: { owner: ItemListView['owner'] }) {
  if (!owner) return null;

  return (
    <Text className="text-xs text-slate-500 dark:text-slate-400" numberOfLines={1}>
      {owner.name}
    </Text>
  );
}
