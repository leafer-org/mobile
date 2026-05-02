import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { cn } from './utils/cn';

export function ScreenLayout({
  children,
  className,
  contentClassName,
  centered = false,
  keyboardAvoiding = false,
  scrollable = false,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  centered?: boolean;
  keyboardAvoiding?: boolean;
  scrollable?: boolean;
}) {
  const Container = keyboardAvoiding ? KeyboardAvoidingView : View;
  const Content = scrollable ? ScrollView : View;

  return (
    <Container
      className={cn('flex-1 bg-white dark:bg-stone-900', className)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Content
        className={cn('flex-1', contentClassName)}
        contentContainerStyle={scrollable ? { flexGrow: 1 } : undefined}
        keyboardShouldPersistTaps={scrollable ? 'handled' : undefined}
        showsVerticalScrollIndicator={false}
      >
        <View className={cn('flex-1 px-6 pt-20', centered && 'justify-center')}>{children}</View>
      </Content>
    </Container>
  );
}
