import { ScrollView, TouchableOpacity, View } from 'react-native';

import { useCreateItem } from '../model/use-create-item';
import { useItemTypes } from '../model/use-item-types';
import { type ItemWizardState, useItemWizardState } from '../model/use-item-wizard-state';
import { OnboardingStep } from '../ui/onboarding-step';
import { AgeGroupForm, type AgeGroupValue } from '../ui/widget-forms/age-group-form';
import { BaseInfoForm, type BaseInfoValue } from '../ui/widget-forms/base-info-form';
import { CategoryForm, type CategoryValue } from '../ui/widget-forms/category-form';
import {
  PaymentForm,
  type PaymentStrategy,
  type PaymentValue,
} from '../ui/widget-forms/payment-form';
import type { PublicApiComponents } from '@/kernel/api';
import {
  ItemWidgetInputType,
  ItemWidgetInputValue,
  PaymentOptionStrategy,
} from '@/kernel/api/schema';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';

type ItemType = PublicApiComponents['schemas']['ItemTypeListItem'];
type WidgetInput = PublicApiComponents['schemas']['ItemWidgetInput'];

const STRATEGY_TO_ENUM: Record<PaymentStrategy, PaymentOptionStrategy> = {
  free: PaymentOptionStrategy.free,
  'one-time': PaymentOptionStrategy.one_time,
  subscription: PaymentOptionStrategy.subscription,
};

const AGE_GROUP_TO_ENUM: Record<AgeGroupValue, ItemWidgetInputValue> = {
  children: ItemWidgetInputValue.children,
  adults: ItemWidgetInputValue.adults,
  all: ItemWidgetInputValue.all,
};

function buildWidgetsPayload(state: ItemWizardState): WidgetInput[] {
  const widgets: WidgetInput[] = [
    {
      type: ItemWidgetInputType.base_info,
      title: state.baseInfo.title.trim(),
      description: state.baseInfo.description.trim(),
      media: [],
    },
  ];

  if (state.category.selectedId) {
    widgets.push({
      type: ItemWidgetInputType.category,
      categoryIds: [state.category.selectedId],
    });
  }

  widgets.push({
    type: ItemWidgetInputType.payment,
    options: [
      {
        name: state.payment.name.trim() || 'Стандартный',
        strategy: STRATEGY_TO_ENUM[state.payment.strategy],
        price: state.payment.strategy === 'free' ? null : Number(state.payment.price) || 0,
      },
    ],
  });

  if (state.ageGroup) {
    widgets.push({
      type: ItemWidgetInputType.age_group,
      value: AGE_GROUP_TO_ENUM[state.ageGroup],
    });
  }

  return widgets;
}

function TypePickStep({
  types,
  selectedTypeId,
  onSelect,
  onNext,
  unsupportedMessage,
}: {
  types: ItemType[];
  selectedTypeId: string | null;
  onSelect: (type: ItemType) => void;
  onNext: () => void;
  unsupportedMessage: string | null;
}) {
  return (
    <OnboardingStep
      step={1}
      total={2}
      title="Что вы предлагаете?"
      subtitle="Выберите тип услуги"
      actions={
        <Button
          variant="primary"
          disabled={!selectedTypeId || unsupportedMessage !== null}
          onPress={onNext}
        >
          Далее
        </Button>
      }
    >
      <ScrollView contentContainerStyle={{ gap: 8 }}>
        {types.map((type) => {
          const isSelected = selectedTypeId === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => onSelect(type)}
              activeOpacity={0.7}
              className={`rounded-xl border p-4 ${
                isSelected
                  ? 'border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800'
                  : 'border-stone-200 dark:border-stone-700'
              }`}
            >
              <Text variant="body" className="font-medium">
                {type.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {unsupportedMessage && (
        <Text variant="caption" color="error" className="mt-2">
          {unsupportedMessage}
        </Text>
      )}
    </OnboardingStep>
  );
}

function StepShell({
  index,
  total,
  title,
  children,
  isLast,
  canProceed,
  onNext,
  onBack,
}: {
  index: number;
  total: number;
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <OnboardingStep
      step={index}
      total={total}
      title={title}
      actions={
        <View className="gap-2">
          <Button variant="primary" disabled={!canProceed} onPress={onNext}>
            {isLast ? 'К проверке' : 'Далее'}
          </Button>
          <Button variant="ghost" onPress={onBack}>
            Назад
          </Button>
        </View>
      }
    >
      {children}
    </OnboardingStep>
  );
}

function ReviewSummary({
  typeName,
  baseInfo,
  category,
  payment,
  ageGroup,
}: {
  typeName: string;
  baseInfo: BaseInfoValue;
  category: CategoryValue | null;
  payment: PaymentValue | null;
  ageGroup: AgeGroupValue | null;
}) {
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text variant="label">Тип</Text>
        <Text variant="body">{typeName}</Text>
      </View>
      <View className="gap-1">
        <Text variant="label">Название</Text>
        <Text variant="body">{baseInfo.title}</Text>
      </View>
      {category?.selectedName && (
        <View className="gap-1">
          <Text variant="label">Категория</Text>
          <Text variant="body">{category.selectedName}</Text>
        </View>
      )}
      {payment && (
        <View className="gap-1">
          <Text variant="label">Оплата</Text>
          <Text variant="body">
            {payment.strategy === 'free' ? 'Бесплатно' : `${payment.name} — ${payment.price} ₽`}
          </Text>
        </View>
      )}
      {ageGroup && (
        <View className="gap-1">
          <Text variant="label">Возраст</Text>
          <Text variant="body">
            {ageGroup === 'children' ? 'Дети' : ageGroup === 'adults' ? 'Взрослые' : 'Любой'}
          </Text>
        </View>
      )}
    </View>
  );
}

function ReviewStep({
  state,
  isSubmitting,
  error,
  onSubmit,
}: {
  state: ItemWizardState;
  isSubmitting: boolean;
  error: unknown;
  onSubmit: () => void;
}) {
  const errorMessage = error
    ? ((error as { message?: string }).message ?? 'Ошибка при создании')
    : null;

  return (
    <OnboardingStep
      step={state.total}
      total={state.total}
      title="Проверьте данные"
      actions={
        <View className="gap-2">
          <Button
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={onSubmit}
          >
            Создать услугу
          </Button>
          <Button variant="ghost" disabled={isSubmitting} onPress={state.back}>
            Назад
          </Button>
        </View>
      }
    >
      <ReviewSummary
        typeName={state.selectedType?.name ?? ''}
        baseInfo={state.baseInfo}
        category={state.category.selectedId ? state.category : null}
        payment={state.payment}
        ageGroup={state.ageGroup}
      />
      {errorMessage && (
        <Text variant="caption" color="error" className="mt-2">
          {errorMessage}
        </Text>
      )}
    </OnboardingStep>
  );
}

function renderTypeStep(state: ItemWizardState, types: ItemType[]) {
  return (
    <TypePickStep
      types={types}
      selectedTypeId={state.selectedType?.id ?? null}
      onSelect={state.selectType}
      onNext={state.next}
      unsupportedMessage={state.unsupportedMessage}
    />
  );
}

function renderBaseInfoStep(state: ItemWizardState) {
  const v = state.baseInfo;
  return (
    <StepShell
      index={state.stepIndex + 1}
      total={state.total}
      title="Основное"
      canProceed={v.title.trim().length > 0 && v.description.trim().length > 0}
      onNext={state.next}
      onBack={state.back}
    >
      <BaseInfoForm value={v} onChange={state.setBaseInfo} />
    </StepShell>
  );
}

function renderCategoryStep(state: ItemWizardState) {
  return (
    <StepShell
      index={state.stepIndex + 1}
      total={state.total}
      title="Категория"
      canProceed={Boolean(state.category.selectedId)}
      onNext={state.next}
      onBack={state.back}
    >
      <CategoryForm value={state.category} onChange={state.setCategory} />
    </StepShell>
  );
}

function renderPaymentStep(state: ItemWizardState) {
  const p = state.payment;
  const canProceed = p.name.trim().length > 0 && (p.strategy === 'free' || Number(p.price) > 0);
  return (
    <StepShell
      index={state.stepIndex + 1}
      total={state.total}
      title="Оплата"
      canProceed={canProceed}
      onNext={state.next}
      onBack={state.back}
    >
      <PaymentForm
        value={p}
        onChange={state.setPayment}
        allowedStrategies={state.allowedStrategies}
      />
    </StepShell>
  );
}

function renderAgeGroupStep(state: ItemWizardState) {
  return (
    <StepShell
      index={state.stepIndex + 1}
      total={state.total}
      title="Возраст"
      canProceed={state.ageGroup !== null}
      isLast
      onNext={state.next}
      onBack={state.back}
    >
      <AgeGroupForm value={state.ageGroup} onChange={state.setAgeGroup} />
    </StepShell>
  );
}

export function CreateItemScreen({
  orgId,
  onCreated,
}: {
  orgId: string;
  onCreated: (itemId: string) => void;
}) {
  const { data: types, isPending: typesLoading } = useItemTypes();
  const createItem = useCreateItem({ orgId, onSuccess: onCreated });
  const state = useItemWizardState();

  if (typesLoading) {
    return (
      <ScreenLayout>
        <View className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </View>
      </ScreenLayout>
    );
  }

  if (!types || types.length === 0) {
    return (
      <ScreenLayout>
        <View className="flex-1 items-center justify-center">
          <Text variant="body" color="secondary">
            Типы услуг недоступны
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  const submit = () => {
    if (!state.selectedType) return;
    createItem.mutate({
      typeId: state.selectedType.id,
      widgets: buildWidgetsPayload(state),
    });
  };

  let body: React.ReactNode;
  switch (state.currentStep) {
    case 'type':
      body = renderTypeStep(state, types);
      break;
    case 'base-info':
      body = renderBaseInfoStep(state);
      break;
    case 'category':
      body = renderCategoryStep(state);
      break;
    case 'payment':
      body = renderPaymentStep(state);
      break;
    case 'age-group':
      body = renderAgeGroupStep(state);
      break;
    default:
      body = (
        <ReviewStep
          state={state}
          isSubmitting={createItem.isPending}
          error={createItem.error}
          onSubmit={submit}
        />
      );
  }

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      {body}
    </ScreenLayout>
  );
}
