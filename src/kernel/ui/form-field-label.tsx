import { Text } from './text';

export function FormFieldLabel({ children }: { children: string }) {
  return (
    <Text variant="label" className="mb-2">
      {children}
    </Text>
  );
}
