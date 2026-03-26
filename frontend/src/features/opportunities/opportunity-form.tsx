'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCrops, fetchRegions, type MetadataOption } from '@/api/metadata-client';
import { createOpportunity, updateOpportunity } from '@/api/opportunities-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const OPPORTUNITY_TYPES = ['TRAINING', 'FUNDING', 'GRANT', 'MARKET_ACCESS', 'PARTNERSHIP', 'EVENT'];

export function OpportunityForm({
  locale,
  opportunityId,
  initialValues
}: {
  locale: string;
  opportunityId?: string;
  initialValues?: Record<string, any>;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<MetadataOption[]>([]);
  const [crops, setCrops] = useState<MetadataOption[]>([]);
  const [form, setForm] = useState({
    title: initialValues?.title ?? '',
    summary: initialValues?.summary ?? '',
    opportunityType: initialValues?.opportunityType ?? 'TRAINING',
    regionId: String(initialValues?.regionId ?? ''),
    cropId: String(initialValues?.cropId ?? ''),
    externalApplicationLink: initialValues?.externalApplicationLink ?? '',
    contactDetails: initialValues?.contactDetails ?? '',
    deadline: initialValues?.deadline ? String(initialValues.deadline).slice(0, 16) : ''
  });

  useEffect(() => {
    Promise.all([fetchRegions(), fetchCrops()])
      .then(([regionList, cropList]) => {
        setRegions(regionList);
        setCrops(cropList);
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load opportunity metadata'));
  }, []);

  async function submit() {
    try {
      setError(null);
      const payload = {
        title: form.title,
        summary: form.summary,
        opportunityType: form.opportunityType,
        regionId: form.regionId ? Number(form.regionId) : null,
        cropId: form.cropId ? Number(form.cropId) : null,
        externalApplicationLink: form.externalApplicationLink || null,
        contactDetails: form.contactDetails || null,
        deadline: new Date(form.deadline).toISOString()
      };
      opportunityId ? await updateOpportunity(opportunityId, payload) : await createOpportunity(payload);
      router.push(`/${locale}/opportunities`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save opportunity');
    }
  }

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">Opportunity hub</p>
        <h1 className="text-2xl font-bold">{opportunityId ? 'Update opportunity' : 'Create opportunity'}</h1>
        <p className="text-sm text-ink/70">Post a time-bound opportunity with valid contact or external application details.</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          <span>Title</span>
          <Input placeholder="Example: Youth sunflower aggregation training" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          <span>Summary</span>
          <Textarea placeholder="Explain who qualifies, what is offered, and the key deadline." value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Opportunity type</span>
          <Select value={form.opportunityType} onChange={(e) => setForm({ ...form, opportunityType: e.target.value })}>
            {OPPORTUNITY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Deadline</span>
          <Input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Region</span>
          <Select value={form.regionId} onChange={(e) => setForm({ ...form, regionId: e.target.value })}>
            <option value="">All regions / not specified</option>
            {regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Crop focus</span>
          <Select value={form.cropId} onChange={(e) => setForm({ ...form, cropId: e.target.value })}>
            <option value="">All crops / not specified</option>
            {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>External application link</span>
          <Input placeholder="https://..." value={form.externalApplicationLink} onChange={(e) => setForm({ ...form, externalApplicationLink: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Contact details</span>
          <Input placeholder="Phone, email, or office contact" value={form.contactDetails} onChange={(e) => setForm({ ...form, contactDetails: e.target.value })} />
        </label>
      </div>
      <Button className="w-full" onClick={submit}>{opportunityId ? 'Update Opportunity' : 'Create Opportunity'}</Button>
    </Card>
  );
}
