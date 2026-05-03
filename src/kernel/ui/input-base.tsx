import { cn } from './utils/cn';

export function useInputStyles({
  isFocused,
  error,
  editable,
}: {
  isFocused: boolean;
  error?: string;
  editable?: boolean;
}) {
  const inputClasses = cn(
    'px-4 py-2.5 rounded-lg border',
    'bg-white dark:bg-stone-800',
    'text-stone-900 dark:text-white',
    isFocused && !error && 'border-stone-900 dark:border-white',
    !isFocused && !error && 'border-stone-300 dark:border-stone-600',
    error && 'border-red-600 dark:border-red-400',
    editable === false && 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400',
  );

  return { inputClasses };
}
