import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const links = ['businesses', 'courses', 'advisory', 'market', 'opportunities', 'analytics'];

export default async function AdminHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <Card>
      <h1 className="text-2xl font-bold">Admin Home</h1>
      <p className="mt-2 text-sm text-ink/70">Moderate public-facing records, verify SMEs, and manage published content from the approved MVP control surface.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <Link key={link} href={`/${locale}/admin/${link}`}>
            <Button className="w-full capitalize">{link}</Button>
          </Link>
        ))}
      </div>
    </Card>
  );
}
