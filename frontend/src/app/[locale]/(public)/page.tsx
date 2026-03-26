import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PublicShell } from '@/components/layout/public-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('common');

  return (
    <PublicShell locale={locale}>
      <section className="grid gap-6 py-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-14">
        <div>
          <Badge>Swahili-first MVP</Badge>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {t('appName')} kwa kujifunza, kufuatilia uzalishaji na kufungua masoko.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-black/70">{t('tagline')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/register`}>
              <Button>Fungua Akaunti</Button>
            </Link>
            <Link href={`/${locale}/login`}>
              <Button variant="secondary">Ingia</Button>
            </Link>
          </div>
        </div>
        <Card className="bg-ink text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">MVP Scope</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/85">
            <li>AgriLearn and progress tracking</li>
            <li>Farmer activity and harvest logging</li>
            <li>Produce and buyer demand listings</li>
            <li>Opportunity access and advisory content</li>
            <li>Aggregated donor-safe dashboards</li>
          </ul>
        </Card>
      </section>
    </PublicShell>
  );
}
