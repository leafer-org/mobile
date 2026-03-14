import { View } from 'react-native';

import { Button } from '@/kernel/ui/button';

export function ProfileSetupActions({
  onSubmit,
  submitDisabled,
  loading,
}: {
  onSubmit: () => void;
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
    </View>
  );
}
