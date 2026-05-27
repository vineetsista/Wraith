import { Platform } from '@/types';
import { getPlatformLabel, getPlatformColor, getPlatformBg } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export default function PlatformBadge({ platform, size = 'sm', className }: PlatformBadgeProps) {
  const color = getPlatformColor(platform);
  const bg = getPlatformBg(platform);
  const label = getPlatformLabel(platform);

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-semibold rounded tracking-wider border',
        sizeClasses[size],
        className
      )}
      style={{
        color,
        backgroundColor: bg,
        borderColor: color + '33',
      }}
    >
      {label}
    </span>
  );
}
