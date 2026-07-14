import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cloud-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-sky-thread text-white hover:bg-sky-thread-hover focus:ring-sky-thread shadow-sm': variant === 'primary',
          'bg-pure-white text-graphite border border-soft-linen hover:border-sky-thread hover:text-sky-thread focus:ring-sky-thread shadow-sm': variant === 'secondary',
          'bg-transparent text-text-secondary hover:text-graphite hover:bg-soft-linen/50': variant === 'ghost',
        },
        {
          'px-2.5 py-1.5 text-xs rounded-[12px]': size === 'sm',
          'px-4 py-2.5 text-sm rounded-[16px]': size === 'md',
          'px-6 py-3.5 text-base rounded-[16px]': size === 'lg',
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
