import { clsx } from 'clsx';
import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export function Select({ label, options, className, onChange, value, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx(
          'px-3 py-2.5 bg-pure-white border border-soft-linen rounded-[14px]',
          'text-sm text-graphite cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-sky-thread focus:border-transparent',
          'appearance-none bg-no-repeat bg-right-center pr-8',
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236F6F6F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundPosition: 'right 10px center',
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
