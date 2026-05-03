import { ActivityIndicator, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import { Text } from './text';
import { cn } from './utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-stone-900 active:bg-stone-700 dark:bg-white dark:active:bg-stone-200',
  secondary: 'bg-stone-200 active:bg-stone-300 dark:bg-stone-700 dark:active:bg-stone-600',
  outline:
    'bg-transparent border-2 border-stone-900 active:bg-stone-100 dark:border-white dark:active:bg-stone-800',
  ghost: 'bg-transparent active:bg-stone-100 dark:active:bg-stone-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 rounded-md',
  md: 'px-4 py-3 rounded-lg',
  lg: 'px-6 py-4 rounded-lg',
};

const textVariantClasses: Record<ButtonVariant, string> = {
  primary: 'text-white dark:text-stone-900 font-semibold',
  secondary: 'text-stone-900 dark:text-white font-semibold',
  outline: 'text-stone-900 dark:text-white font-semibold',
  ghost: 'text-stone-900 dark:text-white font-medium',
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
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#1c1917'} />
      ) : (
        <Text className={textClasses}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}
