import type { TextInputProps } from 'react-native';

import { FormField } from './form-field';
import { FormFieldDescription } from './form-field-description';
import { FormFieldError } from './form-field-error';
import { FormFieldLabel } from './form-field-label';
import { PhoneInput } from './phone-input';
import { TextInput } from './text-input';

/**
 * @deprecated Используйте FormField + TextInput/PhoneInput + FormFieldLabel/FormFieldError/FormFieldDescription
 */
export function Input({
  mask,
  label,
  error,
  helperText,
  ...props
}: TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  mask?: 'phone';
}) {
  const InputComponent = mask === 'phone' ? PhoneInput : TextInput;

  return (
    <FormField>
      {label && <FormFieldLabel>{label}</FormFieldLabel>}
      <InputComponent error={Boolean(error)} {...props} />
      {error && <FormFieldError>{error}</FormFieldError>}
      {!error && helperText && <FormFieldDescription>{helperText}</FormFieldDescription>}
    </FormField>
  );
}
