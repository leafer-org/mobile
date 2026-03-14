import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/kernel/ui/button';
import { FormField } from '@/kernel/ui/form-field';
import { FormFieldDescription } from '@/kernel/ui/form-field-description';
import { FormFieldError } from '@/kernel/ui/form-field-error';
import { FormFieldLabel } from '@/kernel/ui/form-field-label';
import { PhoneInput } from '@/kernel/ui/phone-input';
import { Text } from '@/kernel/ui/text';
import { Timer } from '@/kernel/ui/timer';

export function PhoneInputForm({
  onSubmit,
  loading,
  error,
  retryAfterSec,
}: {
  onSubmit: (phone: string) => void;
  loading?: boolean;
  error?: string;
  retryAfterSec?: number;
}) {
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    // Удаляем все символы кроме цифр
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      onSubmit(cleanPhone);
    }
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
  };

  // Проверяем что введено минимум 10 цифр (после +7)
  const cleanPhone = phone.replace(/\D/g, '');
  const isDisabled = loading || Boolean(retryAfterSec) || cleanPhone.length < 10;

  return (
    <View className="gap-6 w-full">
      <View className="gap-2">
        <Text variant="h1">Вход в приложение</Text>
        <Text variant="body">Введите номер телефона для получения кода подтверждения</Text>
      </View>

      <FormField>
        <FormFieldLabel>Номер телефона</FormFieldLabel>
        <PhoneInput
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChangeText={handlePhoneChange}
          autoFocus
          editable={!loading}
          error={Boolean(error)}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        {error && <FormFieldError>{error}</FormFieldError>}
        {!error && retryAfterSec && (
          <FormFieldDescription>
            Повторите попытку через <Timer seconds={retryAfterSec} format="ss" /> сек
          </FormFieldDescription>
        )}
      </FormField>

      <Button variant="primary" onPress={handleSubmit} disabled={isDisabled} loading={loading}>
        Получить код
      </Button>
    </View>
  );
}
