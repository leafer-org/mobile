import { ActivityIndicator, View } from 'react-native';

export function EmployeeInboxLoading() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#a8a29e" />
    </View>
  );
}
