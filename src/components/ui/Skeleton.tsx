import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  rows?: number;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton rounded', className)}
      aria-hidden="true"
    />
  );
}

export function SignalCardSkeleton() {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden">
      <div className="flex items-stretch min-h-[100px]">
        <Skeleton className="w-20 rounded-none" />
        <div className="flex-1 px-4 py-3 flex flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
          <Skeleton className="h-5 w-56 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="h-7 w-32 rounded" />
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="h-7 w-32 rounded" />
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end justify-center border-l border-border-subtle px-4 py-3 gap-2 min-w-[100px]">
          <Skeleton className="h-7 w-16 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
      </div>
      <Skeleton className="h-8 rounded-none border-t border-border-subtle" />
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-4">
      <Skeleton className="h-3 w-24 rounded mb-3" />
      <Skeleton className="h-7 w-20 rounded mb-2" />
      <Skeleton className="h-8 w-full rounded" />
    </div>
  );
}
