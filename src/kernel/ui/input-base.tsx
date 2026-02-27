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
  const containerClasses = cn(
    'px-4 py-3 rounded-xl border-2',
    'bg-white dark:bg-slate-800',
    isFocused && !error && 'border-teal-600 dark:border-teal-400',
    !isFocused && !error && 'border-slate-300 dark:border-slate-600',
    error && 'border-red-600 dark:border-red-400',
    editable === false && 'bg-slate-100 dark:bg-slate-700',
  );

  const textClasses = cn(
    'text-slate-900 dark:text-white',
    editable === false && 'text-slate-500 dark:text-slate-400',
  );

  return { containerClasses, textClasses };
}
