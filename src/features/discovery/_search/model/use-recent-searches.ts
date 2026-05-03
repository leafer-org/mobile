import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'leafer_recent_searches';
const MAX_RECENT = 8;

export function useRecentSearches() {
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as string[];
            if (Array.isArray(parsed)) setRecents(parsed);
          } catch {
            // ignore
          }
        }
      })
      .catch(() => undefined);
  }, []);

  const remember = useCallback((rawQuery: string) => {
    const q = rawQuery.trim();
    if (q.length === 0) return;
    setRecents((prev) => {
      const next = [q, ...prev.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(
        0,
        MAX_RECENT,
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const remove = useCallback((rawQuery: string) => {
    const q = rawQuery.trim().toLowerCase();
    setRecents((prev) => {
      const next = prev.filter((r) => r.toLowerCase() !== q);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecents([]);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => undefined);
  }, []);

  return { recents, remember, remove, clear };
}
