import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  message: string;
};

export function EmployeeInboxEmpty({ message }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text variant="body" color="secondary" className="text-center">
        {message}
      </Text>
    </View>
  );
}
