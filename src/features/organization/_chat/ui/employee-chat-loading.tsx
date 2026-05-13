import { ActivityIndicator, View } from 'react-native';

export function EmployeeChatLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-stone-900">
      <ActivityIndicator size="large" color="#a8a29e" />
    </View>
  );
}
