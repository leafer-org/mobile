import { ActivityIndicator, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import { Text } from './text';
import { cn } from './utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-teal-600 active:bg-teal-700 dark:bg-teal-500 dark:active:bg-teal-600',
  secondary: 'bg-slate-200 active:bg-slate-300 dark:bg-slate-700 dark:active:bg-slate-600',
  outline:
    'bg-transparent border-2 border-teal-600 active:bg-teal-50 dark:border-teal-400 dark:active:bg-teal-950',
  ghost: 'bg-transparent active:bg-slate-100 dark:active:bg-slate-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 rounded-lg',
  md: 'px-4 py-3 rounded-xl',
  lg: 'px-6 py-4 rounded-xl',
};

const textVariantClasses: Record<ButtonVariant, string> = {
  primary: 'text-white font-semibold',
  secondary: 'text-slate-900 dark:text-white font-semibold',
  outline: 'text-teal-600 dark:text-teal-400 font-semibold',
  ghost: 'text-teal-600 dark:text-teal-400 font-medium',
};

const textSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: Omit<TouchableOpacityProps, 'children'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: string;
}) {
  const isDisabled = disabled || loading;

  const buttonClasses = cn(
    variantClasses[variant],
    sizeClasses[size],
    'items-center justify-center',
    isDisabled && 'opacity-50',
    className,
  );

  const textClasses = cn(textVariantClasses[variant], textSizeClasses[size]);

  return (
    <TouchableOpacity
      className={buttonClasses}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#0d9488'} />
      ) : (
        <Text className={textClasses}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}
