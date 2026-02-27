import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from './utils/cn';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

const variantClasses: Record<TextVariant, string> = {
  h1: 'text-3xl font-bold text-slate-900 dark:text-white',
  h2: 'text-2xl font-semibold text-slate-900 dark:text-white',
  h3: 'text-xl font-semibold text-slate-900 dark:text-white',
  body: 'text-base text-slate-900 dark:text-slate-100',
  caption: 'text-sm text-slate-600 dark:text-slate-400',
  label: 'text-sm font-medium text-slate-900 dark:text-white',
};

const colorClasses = {
  primary: 'text-teal-600 dark:text-teal-400',
  secondary: 'text-slate-600 dark:text-slate-400',
  error: 'text-red-600 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
  white: 'text-white',
  black: 'text-slate-900 dark:text-white',
} as const;

export function Text({
  variant = 'body',
  color,
  className,
  ...props
}: RNTextProps & {
  variant?: TextVariant;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'white' | 'black';
}) {
  const classes = cn(variantClasses[variant], color && colorClasses[color], className);

  return <RNText className={classes} {...props} />;
}
