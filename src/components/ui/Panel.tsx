import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, children, className }: PanelProps) {
  return (
    <div
      className={clsx(
        'bg-pure-white border border-soft-linen rounded-[20px]',
        'shadow-sm',
        className
      )}
    >
      {title && (
        <div className="px-4 py-3 border-b border-soft-linen">
          <h3 className="text-sm font-semibold text-graphite">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
