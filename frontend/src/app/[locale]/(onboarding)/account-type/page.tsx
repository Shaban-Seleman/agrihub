import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/card';

export default async function AccountTypePage() {
  const t = await getTranslations('auth');

  return (
    <div className="mx-auto max-w-lg py-10">
      <Card>
        <h1 className="text-2xl font-bold">{t('accountTypeTitle')}</h1>
        <p className="mt-3 text-sm text-black/70">
          Frontend core is ready for role-based onboarding routing. Feature-specific onboarding forms will be added in Phase 5.
        </p>
      </Card>
    </div>
  );
}
