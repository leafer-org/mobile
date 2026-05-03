import { useMemo, useState } from 'react';

import type { AgeGroupValue } from '../ui/widget-forms/age-group-form';
import type { BaseInfoValue } from '../ui/widget-forms/base-info-form';
import type { CategoryValue } from '../ui/widget-forms/category-form';
import type { PaymentStrategy, PaymentValue } from '../ui/widget-forms/payment-form';
import type { PublicApiComponents } from '@/kernel/api';

type ItemType = PublicApiComponents['schemas']['ItemTypeListItem'];
type WidgetSettings = PublicApiComponents['schemas']['WidgetSettings'];

export type StepKey = 'type' | 'base-info' | 'category' | 'payment' | 'age-group' | 'review';

const SUPPORTED_REQUIRED = new Set<string>([
  'base-info',
  'category',
  'payment',
  'age-group',
  'owner',
]);

function getRequiredTypes(settings: readonly WidgetSettings[]): string[] {
  return settings.filter((s) => s.required).map((s) => String(s.type));
}

function buildSteps(settings: readonly WidgetSettings[] | null): StepKey[] {
  if (!settings) return ['type'];
  const required = new Set(getRequiredTypes(settings));
  const steps: StepKey[] = ['type'];
  if (required.has('base-info')) steps.push('base-info');
  if (required.has('category')) steps.push('category');
  if (required.has('payment')) steps.push('payment');
  if (required.has('age-group')) steps.push('age-group');
  steps.push('review');
  return steps;
}

function getAllowedStrategies(settings: readonly WidgetSettings[]): readonly PaymentStrategy[] {
  const payment = settings.find((s) => String(s.type) === 'payment');
  if (payment && 'allowedStrategies' in payment) {
    return payment.allowedStrategies as readonly PaymentStrategy[];
  }
  return ['free', 'one-time', 'subscription'];
}

export function useItemWizardState() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);
  const [baseInfo, setBaseInfo] = useState<BaseInfoValue>({ title: '', description: '' });
  const [category, setCategory] = useState<CategoryValue>({
    selectedId: null,
    selectedName: null,
  });
  const [payment, setPayment] = useState<PaymentValue>({
    strategy: 'free',
    name: '',
    price: '',
  });
  const [ageGroup, setAgeGroup] = useState<AgeGroupValue | null>(null);

  const settings = selectedType?.widgetSettings ?? null;
  const steps = useMemo(() => buildSteps(settings), [settings]);
  const currentStep = steps[stepIndex];
  const total = steps.length;

  const unsupported = settings
    ? getRequiredTypes(settings).filter((t) => !SUPPORTED_REQUIRED.has(t))
    : [];
  const unsupportedMessage =
    unsupported.length > 0
      ? `Тип требует ${unsupported.join(', ')} — пока создаётся через веб-версию.`
      : null;

  const allowedStrategies = settings ? getAllowedStrategies(settings) : (['free'] as const);

  return {
    currentStep,
    stepIndex,
    total,
    selectedType,
    baseInfo,
    category,
    payment,
    ageGroup,
    unsupportedMessage,
    allowedStrategies,
    selectType: (type: ItemType) => {
      setSelectedType(type);
      setStepIndex(0);
    },
    setBaseInfo,
    setCategory,
    setPayment,
    setAgeGroup,
    next: () => setStepIndex((i) => Math.min(i + 1, steps.length - 1)),
    back: () => setStepIndex((i) => Math.max(i - 1, 0)),
  };
}

export type ItemWizardState = ReturnType<typeof useItemWizardState>;
