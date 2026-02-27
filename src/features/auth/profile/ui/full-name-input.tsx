import { FormField } from '@/kernel/ui/form-field';
import { FormFieldError } from '@/kernel/ui/form-field-error';
import { FormFieldLabel } from '@/kernel/ui/form-field-label';
import { TextInput } from '@/kernel/ui/text-input';

export function FullNameInput({
  value,
  onChangeText,
  onSubmitEditing,
  error,
  disabled,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <FormField>
      <FormFieldLabel>Полное имя</FormFieldLabel>
      <TextInput
        placeholder="Иван Иванов"
        value={value}
        onChangeText={onChangeText}
        autoFocus
        editable={!disabled}
        error={Boolean(error)}
        returnKeyType="done"
        onSubmitEditing={onSubmitEditing}
      />
      {error && <FormFieldError>{error}</FormFieldError>}
    </FormField>
  );
}
