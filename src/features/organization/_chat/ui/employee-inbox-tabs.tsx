import { Fragment } from 'react';
import { Pressable } from 'react-native';

import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

type TabItem<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  items: ReadonlyArray<TabItem<T>>;
  active: T;
  onChange: (key: T) => void;
};

export function EmployeeInboxTabs<T extends string>({ items, active, onChange }: Props<T>) {
  return (
    <Fragment>
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            className={cn(
              'px-3 py-1.5 rounded-full',
              isActive ? 'bg-stone-900 dark:bg-white' : 'bg-stone-100 dark:bg-stone-800',
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                isActive
                  ? 'text-white dark:text-stone-900'
                  : 'text-stone-700 dark:text-stone-300',
              )}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </Fragment>
  );
}
