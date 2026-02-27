import { useEffect, useState } from 'react';
import { Text as RNText } from 'react-native';

import { cn } from './utils/cn';

export function Timer({
  seconds: initialSeconds,
  onComplete,
  format = 'ss',
  className,
}: {
  seconds: number;
  onComplete?: () => void;
  format?: 'ss' | 'mm:ss';
  className?: string;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  const formatTime = (totalSeconds: number): string => {
    if (format === 'ss') {
      return totalSeconds.toString().padStart(2, '0');
    }

    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <RNText className={cn('text-teal-600 dark:text-teal-400 font-mono font-semibold', className)}>
      {formatTime(seconds)}
    </RNText>
  );
}
