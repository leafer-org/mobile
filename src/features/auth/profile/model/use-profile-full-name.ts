import { useMemo, useState } from 'react';

export function useProfileFullName(initialValue = '') {
  const [fullName, setFullName] = useState(initialValue);

  const trimmedFullName = useMemo(() => fullName.trim(), [fullName]);

  const initials = useMemo(() => {
    if (!trimmedFullName) {
      return '';
    }

    return trimmedFullName
      .split(' ')
      .filter(Boolean)
      .map((namePart) => namePart[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [trimmedFullName]);

  const isValid = trimmedFullName.length > 0;

  return {
    fullName,
    setFullName,
    trimmedFullName,
    initials,
    isValid,
  };
}
