import { useState } from 'react';
import { View } from 'react-native';

import { useCreateOrganization } from '../model/use-create-organization';
import { OnboardingStep } from '../ui/onboarding-step';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

const TOTAL_STEPS = 3;

type StepNumber = 1 | 2 | 3;

function NameStep({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (next: string) => void;
  onNext: () => void;
}) {
  const canProceed = value.trim().length > 0;
  return (
    <OnboardingStep
      step={1}
      total={TOTAL_STEPS}
      title="Как назовём организацию?"
      subtitle="Это имя будут видеть клиенты в каталоге."
      actions={
        <Button variant="primary" disabled={!canProceed} onPress={onNext}>
          Далее
        </Button>
      }
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Например, «Студия Север»"
        autoFocus
        returnKeyType="next"
        onSubmitEditing={() => canProceed && onNext()}
      />
    </OnboardingStep>
  );
}

function DescriptionStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  onChange: (next: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <OnboardingStep
      step={2}
      total={TOTAL_STEPS}
      title="Расскажите о себе"
      subtitle="Короткое описание: чем занимаетесь, для кого, что особенного."
      actions={
        <View className="gap-2">
          <Button variant="primary" disabled={value.trim().length === 0} onPress={onNext}>
            Далее
          </Button>
          <Button variant="ghost" onPress={onBack}>
            Назад
          </Button>
        </View>
      }
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Например, школа танцев для взрослых..."
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        style={{ minHeight: 120 }}
      />
    </OnboardingStep>
  );
}

function ReviewStep({
  name,
  description,
  isSubmitting,
  errorMessage,
  onSubmit,
  onBack,
}: {
  name: string;
  description: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <OnboardingStep
      step={3}
      total={TOTAL_STEPS}
      title="Проверьте данные"
      subtitle="После создания вы сможете добавить фото, контакты и услуги."
      actions={
        <View className="gap-2">
          <Button
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={onSubmit}
          >
            Создать организацию
          </Button>
          <Button variant="ghost" disabled={isSubmitting} onPress={onBack}>
            Назад
          </Button>
        </View>
      }
    >
      <View className="gap-4">
        <View className="gap-1">
          <Text variant="label">Название</Text>
          <Text variant="body">{name}</Text>
        </View>
        <View className="gap-1">
          <Text variant="label">Описание</Text>
          <Text variant="body">{description}</Text>
        </View>
        {errorMessage && (
          <Text variant="caption" color="error">
            {errorMessage}
          </Text>
        )}
      </View>
    </OnboardingStep>
  );
}

export function CreateOrganizationScreen({
  onCreated,
}: {
  onCreated: (organizationId: string) => void;
}) {
  const [step, setStep] = useState<StepNumber>(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createOrg = useCreateOrganization({ onSuccess: onCreated });

  const errorMessage = createOrg.error
    ? ((createOrg.error as { message?: string }).message ?? 'Ошибка при создании')
    : null;

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      {step === 1 && <NameStep value={name} onChange={setName} onNext={() => setStep(2)} />}
      {step === 2 && (
        <DescriptionStep
          value={description}
          onChange={setDescription}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ReviewStep
          name={name}
          description={description}
          isSubmitting={createOrg.isPending}
          errorMessage={errorMessage}
          onSubmit={() => createOrg.mutate({ name: name.trim(), description: description.trim() })}
          onBack={() => setStep(2)}
        />
      )}
    </ScreenLayout>
  );
}
