import { ScrollView } from 'react-native';

export function ScrollableBody({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 96 }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
