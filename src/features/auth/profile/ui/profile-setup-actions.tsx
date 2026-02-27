import { View } from 'react-native';

import { Button } from '@/kernel/ui/button';

export function ProfileSetupActions({
  onSubmit,
  onSkip,
  submitDisabled,
  loading,
}: {
  onSubmit: () => void;
  onSkip: () => void;
  submitDisabled: boolean;
  loading?: boolean;
}) {
  return (
    <View className="gap-3">
      <Button
        variant="primary"
        onPress={onSubmit}
        disabled={submitDisabled || loading}
        loading={loading}
      >
        Продолжить
      </Button>
      <Button variant="ghost" onPress={onSkip} disabled={loading}>
        Пропустить
      </Button>
    </View>
  );
}
