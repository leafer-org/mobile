import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

import type { OrgStatus, OrgStatusTone } from '../domain/resolve-org-status';

const TONE_BG: Record<OrgStatusTone, string> = {
  success: 'bg-emerald-100 dark:bg-emerald-900/40',
  info: 'bg-blue-100 dark:bg-blue-900/40',
  error: 'bg-red-100 dark:bg-red-900/40',
  neutral: 'bg-stone-200 dark:bg-stone-700',
};

const TONE_TEXT: Record<OrgStatusTone, string> = {
  success: 'text-emerald-700 dark:text-emerald-300',
  info: 'text-blue-700 dark:text-blue-300',
  error: 'text-red-700 dark:text-red-300',
  neutral: 'text-stone-700 dark:text-stone-200',
};

export function StatusBadge({ status }: { status: OrgStatus }) {
  return (
    <View className="px-4 pb-1">
      <View className={cn('self-start px-3 py-1 rounded-full', TONE_BG[status.tone])}>
        <Text className={cn('text-xs font-medium', TONE_TEXT[status.tone])}>{status.label}</Text>
      </View>
    </View>
  );
}
