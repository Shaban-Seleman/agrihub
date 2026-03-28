import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ActionCard, StatCard } from '@/components/app/cards';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { StatusPill } from '@/components/app/primitives';
import { PublicShell } from '@/components/layout/public-shell';
import { Button } from '@/components/ui/button';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('common');

  return (
    <PublicShell locale={locale}>
      <div className="space-y-10 py-6 md:py-10">
        <HeroPanel
          eyebrow="Inclusive agricultural transformation"
          title={
            <>
              Learn, track,
              <br />
              <span className="italic text-soil">and unlock markets.</span>
            </>
          }
          subtitle={t('tagline')}
          action={
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/register`}>
                <Button>Open account</Button>
              </Link>
              <Link href={`/${locale}/login`}>
                <Button variant="secondary">Login</Button>
              </Link>
            </div>
          }
          accent={
            <div className="space-y-3 rounded-[2rem] bg-white p-5 shadow-card">
              <StatusPill tone="gold">Pilot-ready MVP</StatusPill>
              <p className="font-headline text-3xl font-bold text-leaf">Tanzania-focused</p>
              <p className="text-sm leading-6 text-muted">Mobile-first, donor-safe, government-friendly, and aligned to inclusive agricultural growth.</p>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="AgriLearn" value="Practical" hint="Action-oriented learning for production and market readiness." icon="school" />
          <StatCard label="Tracking" value="Structured" hint="Field activity and harvest logging for real reporting." icon="bar_chart" />
          <StatCard label="Market linkage" value="Live" hint="Produce visibility and buyer demand in one market hub." icon="storefront" />
          <StatCard label="Impact" value="Safe" hint="Aggregated analytics for admin and donor audiences." icon="insights" tone="gold" />
        </div>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Who it serves"
            title="Role-based entry points"
            subtitle="The same product, aligned to the needs of farmers, SMEs, partners, and institutional stakeholders."
          />
          <div className="grid gap-4 md:grid-cols-3">
            <ActionCard href={`/${locale}/account-type`} title="Farmer / Youth" description="Register, complete onboarding, access learning, and record farming activities." icon="agriculture" cta="Choose farmer role" />
            <ActionCard href={`/${locale}/account-type`} title="Agri-SME" description="Create demand listings, publish opportunities, and appear in the directory." icon="domain" cta="Choose SME role" />
            <ActionCard href={`/${locale}/account-type`} title="Partner / Institution" description="Support the ecosystem through opportunities and knowledge-driven engagement." icon="handshake" cta="Choose partner role" />
          </div>
        </section>

        <section className="rounded-[2rem] editorial-gradient p-6 text-white shadow-float md:p-8">
          <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">Trusted operating model</p>
          <h2 className="mt-3 font-headline text-4xl font-bold">Built as a complementary ecosystem platform.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80">
            SamiAgriHub is positioned to support inclusive agricultural transformation without replacing government systems. It is donor-aligned, private-sector aware, and designed for low-friction field use.
          </p>
        </section>
      </div>
    </PublicShell>
  );
}
