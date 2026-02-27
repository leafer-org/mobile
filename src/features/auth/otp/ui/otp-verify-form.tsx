import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/kernel/ui/button';
import { OtpInput } from '@/kernel/ui/otp-input';
import { Text } from '@/kernel/ui/text';
import { Timer } from '@/kernel/ui/timer';

export function OtpVerifyForm({
  phoneNumber,
  onSubmit,
  onResend,
  onBack,
  loading,
  error,
  retryAfterSec,
  codeLength = 4,
}: {
  phoneNumber: string;
  onSubmit: (code: string) => void;
  onResend: () => void;
  onBack?: () => void;
  loading?: boolean;
  error?: string;
  retryAfterSec?: number;
  codeLength?: number;
}) {
  const [code, setCode] = useState('');

  const handleCodeChange = (value: string) => {
    setCode(value);
    // Автоматическая отправка при заполнении
    if (value.length === codeLength) {
      onSubmit(value);
    }
  };

  const handleResend = () => {
    setCode('');
    onResend();
  };

  return (
    <View className="gap-6 w-full">
      <View className="gap-2">
        <View className="flex-row items-center gap-3">
          {onBack && (
            <Button variant="ghost" onPress={onBack} className="p-0 min-w-0">
              ←
            </Button>
          )}
          <Text variant="h1">Подтверждение</Text>
        </View>
        <Text variant="body">Введите код из SMS, отправленный на номер</Text>
        <Text variant="body" className="font-medium">
          {phoneNumber}
        </Text>
      </View>

      <View className="gap-2">
        <OtpInput
          length={codeLength}
          value={code}
          onChangeText={handleCodeChange}
          error={Boolean(error)}
          autoFocus
        />
        {error && (
          <Text variant="caption" color="error">
            {error}
          </Text>
        )}
      </View>

      {code.length === codeLength && (
        <Button variant="primary" onPress={() => onSubmit(code)} loading={loading}>
          Подтвердить
        </Button>
      )}

      <View className="items-center">
        {retryAfterSec ? (
          <View className="flex-row gap-2 items-center">
            <Text variant="caption">Отправить код повторно через</Text>
            <Timer seconds={retryAfterSec} format="ss" />
            <Text variant="caption">сек</Text>
          </View>
        ) : (
          <Button variant="ghost" onPress={handleResend}>
            Отправить код повторно
          </Button>
        )}
      </View>
    </View>
  );
}
