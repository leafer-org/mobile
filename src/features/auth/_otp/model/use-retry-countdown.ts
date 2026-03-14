import { useEffect, useState } from 'react';

import { otpStore } from './otp-store';

export function useRetryCountdown() {
  const { sentAt, retryAfterSec } = otpStore.useState();
  const [remainingSeconds, setRemainingSeconds] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!sentAt || !retryAfterSec) {
      setRemainingSeconds(undefined);
      return;
    }

    const updateRemaining = () => {
      const elapsed = Math.floor((Date.now() - sentAt) / 1000);
      const remaining = retryAfterSec - elapsed;

      if (remaining <= 0) {
        setRemainingSeconds(undefined);
        return false;
      }

      setRemainingSeconds(remaining);
      return true;
    };

    // Сразу обновляем
    if (!updateRemaining()) {
      return;
    }

    // Обновляем каждую секунду
    const interval = setInterval(() => {
      if (!updateRemaining()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sentAt, retryAfterSec]);

  return remainingSeconds;
}
