import { View } from 'react-native';

import { Spinner } from '@/kernel/ui/spinner';

export function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center">
      <Spinner size="small" />
    </View>
  );
}
