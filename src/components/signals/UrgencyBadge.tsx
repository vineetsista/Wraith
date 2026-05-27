'use client';

import { Urgency } from '@/types';
import { getUrgencyConfig } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface UrgencyBadgeProps {
  urgency: Urgency;
  className?: string;
}

export default function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  const config = getUrgencyConfig(urgency);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest px-2 py-0.5 rounded border',
        urgency === 'act_now' && 'act-now-pulse',
        className
      )}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        borderColor: config.color + '40',
      }}
    >
      {urgency === 'act_now' && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse-fast inline-block"
          style={{ backgroundColor: config.color }}
        />
      )}
      {config.label}
    </span>
  );
}
