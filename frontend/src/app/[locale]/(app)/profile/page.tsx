import { getProfileBundle, getProfileCompletion } from '@/api/profile';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ProfileForms } from '@/features/profile/profile-form';

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [profileBundle, completion] = await Promise.all([getProfileBundle(), getProfileCompletion()]);

  return (
    <div className="space-y-4">
      <Card>
        <Badge>Profile completion</Badge>
        <h1 className="mt-2 text-3xl font-bold">Profile</h1>
        <p className="mt-3 text-sm text-ink/70">Keep location and crop details current so advisory, directory, and inclusion reporting stay accurate.</p>
        <ProgressBar className="mt-4" value={Number(completion.percentage ?? 0)} />
        <p className="mt-2 text-sm font-medium">{completion.percentage ?? 0}% complete</p>
      </Card>
      <ProfileForms locale={locale} profileBundle={profileBundle} />
    </div>
  );
}
