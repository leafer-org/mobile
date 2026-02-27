import { Text } from './text';

export function FormFieldError({ children }: { children: string }) {
  return (
    <Text variant="caption" color="error" className="mt-1">
      {children}
    </Text>
  );
}
