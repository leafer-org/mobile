import { useColorScheme } from 'react-native';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // NativeWind автоматически применяет dark: классы на основе системной темы
  // Этот провайдер можно расширить для ручного переключения темы
  return <>{children}</>;
}

export function useTheme() {
  const colorScheme = useColorScheme();
  return {
    colorScheme: colorScheme ?? 'light',
    isDark: colorScheme === 'dark',
  };
}
