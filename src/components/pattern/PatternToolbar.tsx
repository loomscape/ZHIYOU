'use client';

import {
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Undo,
  Redo,
} from 'lucide-react';
import { clsx } from 'clsx';
import { usePatternStore } from '@/stores/patternStore';
import type { ToolType } from '@/types';

const TOOLS: { type: ToolType; icon: typeof Pencil; label: string }[] = [
  { type: 'pencil', icon: Pencil, label: 'Pencil' },
  { type: 'eraser', icon: Eraser, label: 'Eraser' },
  { type: 'fill', icon: PaintBucket, label: 'Fill' },
  { type: 'eyedropper', icon: Pipette, label: 'Eyedropper' },
];

interface PatternToolbarProps {
  orientation?: 'horizontal' | 'vertical';
}

export function PatternToolbar({ orientation = 'vertical' }: PatternToolbarProps) {
  const { selectedTool, setSelectedTool, undo, redo, history, future } = usePatternStore();

  return (
    <div className={clsx(
      'flex items-center gap-1',
      orientation === 'vertical' ? 'flex-col' : 'flex-row'
    )}>
      <div className={clsx(
        'flex gap-1',
        orientation === 'vertical' ? 'flex-col' : 'flex-row'
      )}>
        {TOOLS.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setSelectedTool(type)}
            title={label}
            className={clsx(
              'w-9 h-9 flex items-center justify-center rounded-[12px] transition-all',
              selectedTool === type
                ? 'bg-gradient-to-br from-sky-thread to-mint-yarn text-white shadow-md'
                : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/50'
            )}
          >
            <Icon className="w-4.5 h-4.5" />
          </button>
        ))}
      </div>

      <div className={clsx(
        'bg-soft-linen/50',
        orientation === 'vertical' ? 'w-6 h-px' : 'h-6 w-px'
      )} />

      <div className={clsx(
        'flex gap-1',
        orientation === 'vertical' ? 'flex-col' : 'flex-row'
      )}>
        <button
          onClick={undo}
          disabled={history.length === 0}
          className={clsx(
            'w-9 h-9 flex items-center justify-center rounded-[12px] transition-all',
            history.length === 0
              ? 'text-soft-linen cursor-not-allowed'
              : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/50'
          )}
          title="Undo"
        >
          <Undo className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          className={clsx(
            'w-9 h-9 flex items-center justify-center rounded-[12px] transition-all',
            future.length === 0
              ? 'text-soft-linen cursor-not-allowed'
              : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/50'
          )}
          title="Redo"
        >
          <Redo className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
