import { useEffect, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';

import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';
import { cn } from '@/kernel/ui/utils/cn';
import type {
  AttributeFilter,
  CategoryItemsFilters,
  PanelFilters,
} from '../model/use-category-filters';

export type AttributeFilterDef = {
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
  onApply: (filters: PanelFilters) => void;
  currentFilters: CategoryItemsFilters;
  attributeFilters: AttributeFilterDef[];
  commonFilters: CommonFilters;
  userLocation?: { lat: number; lng: number } | null;
};

const DAY_OF_WEEK = [
  { value: 1, label: 'Пн' },
  { value: 2, label: 'Вт' },
  { value: 3, label: 'Ср' },
  { value: 4, label: 'Чт' },
  { value: 5, label: 'Пт' },
  { value: 6, label: 'Сб' },
  { value: 0, label: 'Вс' },
];

function indexAttrFilters(arr: AttributeFilter[]): Record<string, AttributeFilter> {
  const map: Record<string, AttributeFilter> = {};
  for (const f of arr) map[f.attributeId] = f;
  return map;
}

function dateToISORange(from?: string, to?: string): { dateFrom?: string; dateTo?: string } {
  const result: { dateFrom?: string; dateTo?: string } = {};
  if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) {
    result.dateFrom = `${from}T00:00:00.000Z`;
  }
  if (to && /^\d{4}-\d{2}-\d{2}$/.test(to)) {
    result.dateTo = `${to}T23:59:59.999Z`;
  }
  return result;
}

function isoToDateInput(iso?: string): string {
  if (!iso) return '';
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(iso);
  return m ? (m[1] ?? '') : '';
}

export function FilterPanel({
  visible,
  onClose,
  onApply,
  currentFilters,
  attributeFilters,
  commonFilters,
  userLocation,
}: Props) {
  const [priceMin, setPriceMin] = useState<number | undefined>(currentFilters.priceMin);
  const [priceMax, setPriceMax] = useState<number | undefined>(currentFilters.priceMax);
  const [minRating, setMinRating] = useState<number | undefined>(currentFilters.minRating);
  const [radiusKm, setRadiusKm] = useState<number | undefined>(currentFilters.radiusKm);
  const [attrMap, setAttrMap] = useState<Record<string, AttributeFilter>>(() =>
    indexAttrFilters(currentFilters.attributeFilters),
  );
  const [dateFromInput, setDateFromInput] = useState(isoToDateInput(currentFilters.dateFrom));
  const [dateToInput, setDateToInput] = useState(isoToDateInput(currentFilters.dateTo));
  const [scheduleDay, setScheduleDay] = useState<number | undefined>(
    currentFilters.scheduleDayOfWeek,
  );
  const [scheduleTimeFrom, setScheduleTimeFrom] = useState(
    currentFilters.scheduleTimeFrom ?? '',
  );
  const [scheduleTimeTo, setScheduleTimeTo] = useState(currentFilters.scheduleTimeTo ?? '');

  useEffect(() => {
    if (!visible) return;
    setPriceMin(currentFilters.priceMin);
    setPriceMax(currentFilters.priceMax);
    setMinRating(currentFilters.minRating);
    setRadiusKm(currentFilters.radiusKm);
    setAttrMap(indexAttrFilters(currentFilters.attributeFilters));
    setDateFromInput(isoToDateInput(currentFilters.dateFrom));
    setDateToInput(isoToDateInput(currentFilters.dateTo));
    setScheduleDay(currentFilters.scheduleDayOfWeek);
    setScheduleTimeFrom(currentFilters.scheduleTimeFrom ?? '');
    setScheduleTimeTo(currentFilters.scheduleTimeTo ?? '');
  }, [visible]);

  const updateAttr = (attributeId: string, next: AttributeFilter | undefined) => {
    setAttrMap((prev) => {
      const copy = { ...prev };
      if (next === undefined) delete copy[attributeId];
      else copy[attributeId] = next;
      return copy;
    });
  };

  const handleApply = () => {
    const range = dateToISORange(dateFromInput, dateToInput);
    const timeFrom = /^\d{2}:\d{2}$/.test(scheduleTimeFrom) ? scheduleTimeFrom : undefined;
    const timeTo = /^\d{2}:\d{2}$/.test(scheduleTimeTo) ? scheduleTimeTo : undefined;
    onApply({
      priceMin,
      priceMax,
      minRating,
      attributeFilters: Object.values(attrMap),
      lat: radiusKm && userLocation ? userLocation.lat : undefined,
      lng: radiusKm && userLocation ? userLocation.lng : undefined,
      radiusKm,
      dateFrom: range.dateFrom,
      dateTo: range.dateTo,
      scheduleDayOfWeek: scheduleDay,
      scheduleTimeFrom: timeFrom && timeTo ? timeFrom : undefined,
      scheduleTimeTo: timeFrom && timeTo ? timeTo : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setPriceMin(undefined);
    setPriceMax(undefined);
    setMinRating(undefined);
    setRadiusKm(undefined);
    setAttrMap({});
    setDateFromInput('');
    setDateToInput('');
    setScheduleDay(undefined);
    setScheduleTimeFrom('');
    setScheduleTimeTo('');
    onApply({ attributeFilters: [] });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white dark:bg-stone-900">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-700">
          <TouchableOpacity onPress={onClose} testID="filter-close">
            <Text color="primary" className="text-base">
              Отмена
            </Text>
          </TouchableOpacity>
          <Text variant="h3">Фильтры</Text>
          <TouchableOpacity onPress={handleReset} testID="filter-reset">
            <Text color="primary" className="text-base">
              Сбросить
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ gap: 24 }}>
          {commonFilters.hasPriceRange && (
            <View>
              <Text variant="label" className="mb-2">
                Цена
              </Text>
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

          {commonFilters.hasRating && (
            <View>
              <Text variant="label" className="mb-2">
                Минимальный рейтинг
              </Text>
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

          {commonFilters.hasLocation && userLocation && (
            <View>
              <Text variant="label" className="mb-2">
                Расстояние
              </Text>
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

          {commonFilters.hasEventDateTime && (
            <View>
              <Text variant="label" className="mb-2">
                Даты
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <TextInput
                    testID="filter-date-from"
                    placeholder="ГГГГ-ММ-ДД"
                    value={dateFromInput}
                    onChangeText={setDateFromInput}
                  />
                </View>
                <View className="flex-1">
                  <TextInput
                    testID="filter-date-to"
                    placeholder="ГГГГ-ММ-ДД"
                    value={dateToInput}
                    onChangeText={setDateToInput}
                  />
                </View>
              </View>
            </View>
          )}

          {commonFilters.hasSchedule && (
            <View>
              <Text variant="label" className="mb-2">
                День недели
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {DAY_OF_WEEK.map((d) => (
                  <ChipToggle
                    key={d.value}
                    testID={`filter-day-${d.value}`}
                    label={d.label}
                    active={scheduleDay === d.value}
                    onPress={() => setScheduleDay(scheduleDay === d.value ? undefined : d.value)}
                  />
                ))}
              </View>
              <Text variant="label" className="mb-2 mt-3">
                Время
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <TextInput
                    testID="filter-time-from"
                    placeholder="ЧЧ:ММ"
                    value={scheduleTimeFrom}
                    onChangeText={setScheduleTimeFrom}
                  />
                </View>
                <View className="flex-1">
                  <TextInput
                    testID="filter-time-to"
                    placeholder="ЧЧ:ММ"
                    value={scheduleTimeTo}
                    onChangeText={setScheduleTimeTo}
                  />
                </View>
              </View>
            </View>
          )}

          {attributeFilters.map((attr) => (
            <AttributeFilterField
              key={attr.attributeId}
              def={attr}
              value={attrMap[attr.attributeId]}
              onChange={(next) => updateAttr(attr.attributeId, next)}
            />
          ))}
        </ScrollView>

        <View className="px-4 py-4 border-t border-stone-200 dark:border-stone-700">
          <Button testID="filter-apply" onPress={handleApply}>
            Применить
          </Button>
        </View>
      </View>
    </Modal>
  );
}

function AttributeFilterField({
  def,
  value,
  onChange,
}: {
  def: AttributeFilterDef;
  value: AttributeFilter | undefined;
  onChange: (next: AttributeFilter | undefined) => void;
}) {
  return (
    <View>
      <Text variant="label" className="mb-2">
        {def.name}
      </Text>
      {def.schema.type === 'enum' && (
        <EnumField
          attributeId={def.attributeId}
          options={def.schema.options}
          value={value?.type === 'enum' ? value.values : []}
          onChange={(values) =>
            onChange(
              values.length > 0
                ? { attributeId: def.attributeId, type: 'enum', values }
                : undefined,
            )
          }
        />
      )}
      {def.schema.type === 'boolean' && (
        <BooleanField
          attributeId={def.attributeId}
          value={value?.type === 'boolean' ? value.value : undefined}
          onChange={(v) =>
            onChange(
              v === undefined
                ? undefined
                : { attributeId: def.attributeId, type: 'boolean', value: v },
            )
          }
        />
      )}
      {def.schema.type === 'text' && (
        <TextInput
          testID={`filter-attr-${def.attributeId}`}
          placeholder={def.name}
          value={value?.type === 'text' ? value.value : ''}
          onChangeText={(text) =>
            onChange(
              text
                ? { attributeId: def.attributeId, type: 'text', value: text }
                : undefined,
            )
          }
        />
      )}
      {def.schema.type === 'number' && (
        <NumberRangeField
          attributeId={def.attributeId}
          schemaMin={def.schema.min}
          schemaMax={def.schema.max}
          value={value?.type === 'number' ? value : undefined}
          onChange={(min, max) => {
            if (min === undefined && max === undefined) {
              onChange(undefined);
              return;
            }
            onChange({ attributeId: def.attributeId, type: 'number', min, max });
          }}
        />
      )}
    </View>
  );
}

function EnumField({
  attributeId,
  options,
  value,
  onChange,
}: {
  attributeId: string;
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <ChipToggle
            key={opt}
            testID={`filter-attr-${attributeId}-${opt}`}
            label={opt}
            active={active}
            onPress={() =>
              onChange(active ? value.filter((v) => v !== opt) : [...value, opt])
            }
          />
        );
      })}
    </View>
  );
}

function BooleanField({
  attributeId,
  value,
  onChange,
}: {
  attributeId: string;
  value: boolean | undefined;
  onChange: (v: boolean | undefined) => void;
}) {
  return (
    <View className="flex-row gap-2">
      <ChipToggle
        testID={`filter-attr-${attributeId}-true`}
        label="Да"
        active={value === true}
        onPress={() => onChange(value === true ? undefined : true)}
      />
      <ChipToggle
        testID={`filter-attr-${attributeId}-false`}
        label="Нет"
        active={value === false}
        onPress={() => onChange(value === false ? undefined : false)}
      />
    </View>
  );
}

function NumberRangeField({
  attributeId,
  schemaMin,
  schemaMax,
  value,
  onChange,
}: {
  attributeId: string;
  schemaMin?: number;
  schemaMax?: number;
  value: { min?: number; max?: number } | undefined;
  onChange: (min: number | undefined, max: number | undefined) => void;
}) {
  const minPlaceholder = schemaMin != null ? `от ${schemaMin}` : 'от';
  const maxPlaceholder = schemaMax != null ? `до ${schemaMax}` : 'до';
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <TextInput
          testID={`filter-attr-${attributeId}-min`}
          placeholder={minPlaceholder}
          keyboardType="numeric"
          value={value?.min?.toString() ?? ''}
          onChangeText={(v) => onChange(v ? Number(v) : undefined, value?.max)}
        />
      </View>
      <View className="flex-1">
        <TextInput
          testID={`filter-attr-${attributeId}-max`}
          placeholder={maxPlaceholder}
          keyboardType="numeric"
          value={value?.max?.toString() ?? ''}
          onChangeText={(v) => onChange(value?.min, v ? Number(v) : undefined)}
        />
      </View>
    </View>
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
        'px-3 py-1.5 rounded-md border',
        active
          ? 'border-stone-900 bg-stone-100 dark:bg-stone-800 dark:border-white'
          : 'border-stone-300 dark:border-stone-700',
      )}
    >
      <Text
        className={cn(
          'text-xs',
          active ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-300',
        )}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
