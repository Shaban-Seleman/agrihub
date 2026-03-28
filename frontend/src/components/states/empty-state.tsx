import { Card } from '@/components/ui/card';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="cream-panel border-dashed border-line/60 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-card">
        <span className="material-symbols-outlined text-leaf">eco</span>
      </div>
      <h3 className="mt-4 font-headline text-2xl font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </Card>
  );
}
