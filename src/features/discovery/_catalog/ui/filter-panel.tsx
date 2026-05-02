import { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';

import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';
import { cn } from '@/kernel/ui/utils/cn';
import type { CategoryItemsFilters } from '../model/use-category-filters';

type AttributeFilter = {
  attributeId: string;
  name: string;
  schema:
    | { type: 'text' }
    | { type: 'boolean' }
    | { type: 'enum'; options: string[] }
    | { type: 'number'; min?: number; max?: number };
};
type CommonFilters = {
  hasPriceRange: boolean;
  hasRating: boolean;
  hasLocation: boolean;
  hasSchedule: boolean;
  hasEventDateTime: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Omit<CategoryItemsFilters, 'cityId' | 'ageGroup' | 'typeIds'>) => void;
  currentFilters: CategoryItemsFilters;
  attributeFilters: AttributeFilter[];
  commonFilters: CommonFilters;
  userLocation?: { lat: number; lng: number } | null;
};

export function FilterPanel({
  visible,
  onClose,
  onApply,
  currentFilters,
  attributeFilters,
  commonFilters,
  userLocation,
}: Props) {
  const [priceMin, setPriceMin] = useState(currentFilters.priceMin);
  const [priceMax, setPriceMax] = useState(currentFilters.priceMax);
  const [minRating, setMinRating] = useState(currentFilters.minRating);
  const [radiusKm, setRadiusKm] = useState(currentFilters.radiusKm);
  const [attrValues, setAttrValues] = useState<Record<string, string>>(() => {
    if (!currentFilters.attributeValues) return {};
    try {
      const parsed = JSON.parse(currentFilters.attributeValues) as { attributeId: string; value: string }[];
      const map: Record<string, string> = {};
      for (const item of parsed) map[item.attributeId] = item.value;
      return map;
    } catch {
      return {};
    }
  });

  // Sync state when panel opens with new currentFilters
  useEffect(() => {
    if (!visible) return;
    setPriceMin(currentFilters.priceMin);
    setPriceMax(currentFilters.priceMax);
    setMinRating(currentFilters.minRating);
    setRadiusKm(currentFilters.radiusKm);
  }, [visible]);

  const setAttrValue = useCallback((attributeId: string, value: string | undefined) => {
    setAttrValues((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[attributeId];
      else next[attributeId] = value;
      return next;
    });
  }, []);

  const buildAttributeValues = (): string | undefined => {
    const entries = Object.entries(attrValues).filter(([, v]) => v !== '');
    if (entries.length === 0) return undefined;
    return JSON.stringify(entries.map(([attributeId, value]) => ({ attributeId, value })));
  };

  const handleApply = () => {
    onApply({
      priceMin,
      priceMax,
      minRating,
      attributeValues: buildAttributeValues(),
      lat: radiusKm && userLocation ? userLocation.lat : undefined,
      lng: radiusKm && userLocation ? userLocation.lng : undefined,
      radiusKm,
    });
    onClose();
  };

  const handleReset = () => {
    setPriceMin(undefined);
    setPriceMax(undefined);
    setMinRating(undefined);
    setRadiusKm(undefined);
    setAttrValues({});
    onApply({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white dark:bg-stone-900">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-700">
          <TouchableOpacity onPress={onClose} testID="filter-close">
            <Text color="primary" className="text-base">Отмена</Text>
          </TouchableOpacity>
          <Text variant="h3">Фильтры</Text>
          <TouchableOpacity onPress={handleReset} testID="filter-reset">
            <Text color="primary" className="text-base">Сбросить</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ gap: 24 }}>
          {/* Цена */}
          {commonFilters.hasPriceRange && (
            <View>
              <Text variant="label" className="mb-2">Цена</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <TextInput
                    testID="filter-price-min"
                    placeholder="от"
                    keyboardType="numeric"
                    value={priceMin?.toString() ?? ''}
                    onChangeText={(v) => setPriceMin(v ? Number(v) : undefined)}
                  />
                </View>
                <View className="flex-1">
                  <TextInput
                    testID="filter-price-max"
                    placeholder="до"
                    keyboardType="numeric"
                    value={priceMax?.toString() ?? ''}
                    onChangeText={(v) => setPriceMax(v ? Number(v) : undefined)}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Рейтинг */}
          {commonFilters.hasRating && (
            <View>
              <Text variant="label" className="mb-2">Минимальный рейтинг</Text>
              <View className="flex-row gap-2">
                {[3, 4, 4.5].map((r) => (
                  <ChipToggle
                    key={r}
                    testID={`filter-rating-${r}`}
                    label={`${r}+`}
                    active={minRating === r}
                    onPress={() => setMinRating(minRating === r ? undefined : r)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Расстояние */}
          {commonFilters.hasLocation && userLocation && (
            <View>
              <Text variant="label" className="mb-2">Расстояние</Text>
              <View className="flex-row gap-2">
                {[1, 3, 5, 10, 25].map((km) => (
                  <ChipToggle
                    key={km}
                    testID={`filter-radius-${km}`}
                    label={`${km} км`}
                    active={radiusKm === km}
                    onPress={() => setRadiusKm(radiusKm === km ? undefined : km)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Атрибуты категории (динамические) */}
          {attributeFilters.map((attr) => (
            <View key={attr.attributeId}>
              <Text variant="label" className="mb-2">{attr.name}</Text>
              {attr.schema.type === 'enum' && (
                <View className="flex-row flex-wrap gap-2">
                  {attr.schema.options.map((opt) => (
                    <ChipToggle
                      key={opt}
                      testID={`filter-attr-${attr.attributeId}-${opt}`}
                      label={opt}
                      active={attrValues[attr.attributeId] === opt}
                      onPress={() =>
                        setAttrValue(
                          attr.attributeId,
                          attrValues[attr.attributeId] === opt ? undefined : opt,
                        )
                      }
                    />
                  ))}
                </View>
              )}
              {attr.schema.type === 'boolean' && (
                <ChipToggle
                  testID={`filter-attr-${attr.attributeId}`}
                  label="Да"
                  active={attrValues[attr.attributeId] === 'true'}
                  onPress={() =>
                    setAttrValue(
                      attr.attributeId,
                      attrValues[attr.attributeId] === 'true' ? undefined : 'true',
                    )
                  }
                />
              )}
              {attr.schema.type === 'text' && (
                <TextInput
                  testID={`filter-attr-${attr.attributeId}`}
                  placeholder={attr.name}
                  value={attrValues[attr.attributeId] ?? ''}
                  onChangeText={(v) => setAttrValue(attr.attributeId, v || undefined)}
                />
              )}
              {attr.schema.type === 'number' && (
                <TextInput
                  testID={`filter-attr-${attr.attributeId}`}
                  placeholder={[
                    attr.schema.min != null ? `от ${attr.schema.min}` : null,
                    attr.schema.max != null ? `до ${attr.schema.max}` : null,
                  ].filter(Boolean).join(' ') || attr.name}
                  keyboardType="numeric"
                  value={attrValues[attr.attributeId] ?? ''}
                  onChangeText={(v) => setAttrValue(attr.attributeId, v || undefined)}
                />
              )}
            </View>
          ))}
        </ScrollView>

        <View className="px-4 py-4 border-t border-stone-200 dark:border-stone-700">
          <Button testID="filter-apply" onPress={handleApply}>Применить</Button>
        </View>
      </View>
    </Modal>
  );
}

function ChipToggle({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      className={cn(
        'px-4 py-2 rounded-lg border',
        active
          ? 'border-stone-900 bg-stone-100 dark:bg-stone-800 dark:border-white'
          : 'border-stone-200 dark:border-stone-700',
      )}
    >
      <Text
        className={cn(
          'text-sm',
          active ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-300',
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
