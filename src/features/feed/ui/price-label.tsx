import type { ItemListView } from '../domain/types';
import { Text } from '@/kernel/ui/text';

export function PriceLabel({ price }: { price: ItemListView['price'] }) {
  if (!price?.options?.length) return null;

  const options = price.options;
  const freeOption = options.find((o) => o.strategy === 'free');

  if (options.length === 1 && freeOption) {
    return <Text className="text-teal-600 dark:text-teal-400 font-semibold text-xs">Бесплатно</Text>;
  }

  const pricesWithValue = options.filter((o) => o.price != null && o.price > 0);
  if (pricesWithValue.length === 0) return null;

  const minPrice = Math.min(...pricesWithValue.map((o) => o.price!));
  const hasSub = options.some((o) => o.strategy === 'subscription');

  if (options.length === 1) {
    const opt = options[0]!;
    if (opt.strategy === 'subscription') {
      return <Text className="font-semibold text-xs text-slate-900 dark:text-white">{formatPrice(opt.price!)} / мес</Text>;
    }
    return <Text className="font-semibold text-xs text-slate-900 dark:text-white">{formatPrice(opt.price!)}</Text>;
  }

  const suffix = hasSub ? ' / мес' : '';
  return <Text className="font-semibold text-xs text-slate-900 dark:text-white">от {formatPrice(minPrice)}{suffix}</Text>;
}

function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} \u20BD`;
}
