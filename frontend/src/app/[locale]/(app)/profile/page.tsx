import { getBusinessCommodities, getCropInterests, getProfileBundle, getProfileCompletion } from '@/api/profile';
import { HeroPanel, SectionHeader } from '@/components/app/layout';
import { StatCard } from '@/components/app/cards';
import { AccountSecuritySection } from '@/features/auth/account-security';
import { ProfileForms } from '@/features/profile/profile-form';
import { getFriendlyRoleLabel, getPreferredDisplayName } from '@/lib/auth/navigation';
import { requireSession } from '@/lib/auth/session';

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await requireSession();
  const [profileBundle, completion, cropInterests, businessCommodities] = await Promise.all([
    getProfileBundle(),
    getProfileCompletion(),
    session.accountType === 'FARMER_YOUTH' ? getCropInterests() : Promise.resolve([]),
    session.accountType === 'AGRI_SME' ? getBusinessCommodities() : Promise.resolve([])
  ]);
  const displayName = getPreferredDisplayName(session, profileBundle);
  const roleLabel = getFriendlyRoleLabel(session.accountType);

  return (
    <div className="space-y-8">
      <HeroPanel
        eyebrow="Profile"
        title={displayName}
        subtitle={`Maintain accurate ${roleLabel} details so advisory, matching, directory visibility, and inclusion reporting stay reliable.`}
        accent={<StatCard label="Completion" value={`${completion.percentage ?? 0}%`} hint="Shared profile, role profile, and crop selections all contribute." icon="task_alt" />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Shared profile" value={completion.sharedProfileComplete ? 'Complete' : 'Pending'} hint="Name and location details." icon="person" />
        <StatCard label="Role profile" value={completion.roleProfileComplete ? 'Complete' : 'Pending'} hint="Farmer, SME, or partner role details." icon="badge" />
        <StatCard label="Selections" value={completion.cropSelectionsComplete ? 'Complete' : 'Pending'} hint="Crop interests or business commodities." icon="eco" tone="gold" />
      </div>
      <SectionHeader eyebrow="Editable sections" title="Profile details" subtitle="All editable profile sections reuse the same metadata-driven and mobile-first form system." />
      <ProfileForms
        locale={locale}
        profileBundle={profileBundle}
        accountType={session.accountType}
        cropSelections={cropInterests}
        commoditySelections={businessCommodities}
      />
      <SectionHeader eyebrow="Account settings" title="Security" subtitle="Manage the credentials and session controls available in the current MVP." />
      <AccountSecuritySection locale={locale} roleLabel={roleLabel} />
    </div>
  );
}
