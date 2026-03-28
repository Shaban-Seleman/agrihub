import { cn } from '@/lib/utils/cn';

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('h-2.5 overflow-hidden rounded-full bg-mist', className)}>
      <div className="h-full rounded-full bg-gradient-to-r from-sun to-leaf transition-all" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
