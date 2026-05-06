import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from './utils/cn';

export function ScreenLayout({
  children,
  className,
  contentClassName,
  centered = false,
  keyboardAvoiding = false,
  scrollable = false,
  compact = false,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  centered?: boolean;
  keyboardAvoiding?: boolean;
  scrollable?: boolean;
  /** Tight paddings (px-4 + safe-area top). For tab screens that don't have a heavy hero. */
  compact?: boolean;
}) {
  const Container = keyboardAvoiding ? KeyboardAvoidingView : View;
  const Content = scrollable ? ScrollView : View;
  const insets = useSafeAreaInsets();

  const paddingClasses = compact ? 'flex-1 px-4' : 'flex-1 px-6 pt-20';
  const paddingStyle = compact ? { paddingTop: insets.top + 12 } : undefined;

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
        <View
          className={cn(paddingClasses, centered && 'justify-center')}
          style={paddingStyle}
        >
          {children}
        </View>
      </Content>
    </Container>
  );
}
