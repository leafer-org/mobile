import { View } from 'react-native';

import { Button } from '@/kernel/ui/button';

type Props = {
  status: 'open' | 'closed' | 'blocked';
  isMyClaim: boolean;
  onRelease: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onClose: () => void;
  isBusy?: boolean;
};

export function EmployeeActionsBar({
  status,
  isMyClaim,
  onRelease,
  onBlock,
  onUnblock,
  onClose,
  isBusy,
}: Props) {
  return (
    <View className="flex-row gap-2 px-3 py-2 border-b border-stone-200 dark:border-stone-800">
      {isMyClaim ? (
        <Button variant="ghost" size="sm" onPress={onRelease} loading={isBusy}>
          Освободить
        </Button>
      ) : null}
      {status === 'blocked' ? (
        <Button variant="ghost" size="sm" onPress={onUnblock} loading={isBusy}>
          Разблок.
        </Button>
      ) : status === 'open' ? (
        <Button variant="ghost" size="sm" onPress={onBlock} loading={isBusy}>
          Блок
        </Button>
      ) : null}
      {status === 'open' ? (
        <Button variant="ghost" size="sm" onPress={onClose} loading={isBusy}>
          Закрыть
        </Button>
      ) : null}
    </View>
  );
}
