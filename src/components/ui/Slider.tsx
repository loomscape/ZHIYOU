import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Slider({ label, className, ...props }: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary">{label}</label>
      )}
      <input
        type="range"
        className={clsx(
          'w-full h-2 bg-soft-linen rounded-full appearance-none cursor-pointer',
          'accent-sky-thread',
          className
        )}
        {...props}
      />
    </div>
  );
}
