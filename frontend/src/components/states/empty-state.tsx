import { Card } from '@/components/ui/card';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border border-dashed border-black/10 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-black/65">{description}</p>
    </Card>
  );
}
