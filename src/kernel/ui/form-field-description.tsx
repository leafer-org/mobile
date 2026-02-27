import { Text } from './text';

export function FormFieldDescription({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="caption" className="mt-1">
      {children}
    </Text>
  );
}
