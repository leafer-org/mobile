import { useState } from 'react';

export function useStaticInitialize<T>(fn: () => T): T {
  return useState(() => fn())[0];
}
