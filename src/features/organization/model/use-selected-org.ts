import { useEffect, useState } from 'react';

import { useMyOrganizations } from './use-my-organizations';
import { storage } from '@/lib/storage';

const STORAGE_KEY = 'seller.selectedOrganizationId';

function readStoredId(): string | null {
  return storage.getItem(STORAGE_KEY);
}

function writeStoredId(id: string | null) {
  if (id === null) {
    void storage.deleteItem(STORAGE_KEY);
  } else {
    storage.setItem(STORAGE_KEY, id);
  }
}

/**
 * Возвращает выбранную организацию (из storage), при условии что она ещё в списке моих.
 * Авто-выбирает единственную, если она одна. Очищает stale-выбор.
 */
export function useSelectedOrg() {
  const orgs = useMyOrganizations();
  const [storedId, setStoredId] = useState<string | null>(() => readStoredId());

  const list = orgs.data?.organizations ?? [];

  // Если список загружен, провалидируем выбор: если orgId нет в списке — очистим.
  // Если орг ровно одна — авто-выберем.
  useEffect(() => {
    if (orgs.isPending) return;

    if (list.length === 0) {
      if (storedId !== null) {
        writeStoredId(null);
        setStoredId(null);
      }
      return;
    }

    if (list.length === 1) {
      const onlyId = list[0].id;
      if (storedId !== onlyId) {
        writeStoredId(onlyId);
        setStoredId(onlyId);
      }
      return;
    }

    if (storedId !== null && !list.some((o) => o.id === storedId)) {
      writeStoredId(null);
      setStoredId(null);
    }
  }, [orgs.isPending, list, storedId]);

  return {
    isLoading: orgs.isPending,
    organizations: list,
    selectedId: storedId,
    select: (id: string) => {
      writeStoredId(id);
      setStoredId(id);
    },
    clear: () => {
      writeStoredId(null);
      setStoredId(null);
    },
  };
}
