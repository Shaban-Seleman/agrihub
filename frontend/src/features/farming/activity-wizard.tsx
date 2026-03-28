'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createActivity, updateActivity } from '@/api/farming-client';
import { fetchCrops, type MetadataOption } from '@/api/metadata-client';
import { CTAButtonRow, FieldGroup, FormField, StepWizardHeader } from '@/components/app/forms';
import { Icon, MediaPanel, StatusPill } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const LAND_UNITS = ['ACRE', 'HECTARE'];
const YIELD_UNITS = ['KG', 'TONNE', 'BAG'];
const FARMING_METHODS = ['Rain-fed', 'Irrigated', 'Conservation agriculture', 'Greenhouse', 'Mixed farming'];

type Props = {
  locale: string;
  mode: 'create' | 'edit';
  activityId?: string;
  initialValues?: Record<string, any>;
};

export function ActivityWizard({ locale, mode, activityId, initialValues }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [crops, setCrops] = useState<MetadataOption[]>([]);
  const [form, setForm] = useState({
    cropId: String(initialValues?.cropId ?? ''),
    seasonCode: initialValues?.seasonCode ?? '',
    landSize: String(initialValues?.landSize ?? ''),
    landUnit: initialValues?.landUnit ?? 'ACRE',
    plantingDate: initialValues?.plantingDate ?? '',
    harvestDate: initialValues?.harvestDate ?? '',
    actualYield: String(initialValues?.actualYield ?? ''),
    yieldUnit: initialValues?.yieldUnit ?? '',
    farmingMethod: initialValues?.farmingMethod ?? '',
    notes: initialValues?.notes ?? ''
  });

  useEffect(() => {
    fetchCrops()
      .then(setCrops)
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load crops'));
  }, []);

  const cropName = useMemo(
    () => crops.find((crop) => String(crop.id) === form.cropId)?.name ?? 'Selected crop',
    [crops, form.cropId]
  );

  function canAdvance() {
    if (step === 1) {
      return Boolean(form.cropId && form.seasonCode);
    }

    if (step === 2) {
      return Boolean(form.landSize && form.landUnit && form.plantingDate && form.farmingMethod);
    }

    return true;
  }

  async function submit() {
    try {
      setSubmitting(true);
      setError(null);
      const payload = {
        cropId: Number(form.cropId),
        seasonCode: form.seasonCode,
        landSize: Number(form.landSize),
        landUnit: form.landUnit,
        plantingDate: form.plantingDate,
        harvestDate: form.harvestDate || null,
        actualYield: form.actualYield ? Number(form.actualYield) : null,
        yieldUnit: form.yieldUnit || null,
        farmingMethod: form.farmingMethod,
        notes: form.notes || null
      };

      if (mode === 'create') {
        await createActivity(payload);
      } else if (activityId) {
        await updateActivity(activityId, payload);
      }

      router.push(`/${locale}/farming-activities`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save farming activity');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {step === 1 ? (
        <StepWizardHeader
          current={1}
          total={3}
          title="Crop & Season Selection"
          description="Accurate seasonal data helps SamiAgriHub match the activity to localized advisory, progress tracking, and yield reporting."
        />
      ) : null}
      {step === 2 ? (
        <StepWizardHeader
          current={2}
          total={3}
          title="Plot & Planting Details"
          description="Record the land use and production method so the activity can support farm-level planning and donor-safe production insights."
        />
      ) : null}
      {step === 3 ? (
        <StepWizardHeader
          current={3}
          total={3}
          title="Harvest & Review"
          description="Add harvest information when available and confirm the activity details before saving to your production record."
        />
      ) : null}

      {error ? (
        <div className="rounded-[1.6rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-8">
          <FieldGroup className="grid-cols-1">
            <FormField label="Select crop">
              <Select value={form.cropId} onChange={(event) => setForm({ ...form, cropId: event.target.value })}>
                <option value="">Search or select a crop...</option>
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Season code" hint="Example: 2026-MASIKA">
              <Input value={form.seasonCode} onChange={(event) => setForm({ ...form, seasonCode: event.target.value })} />
            </FormField>
          </FieldGroup>

          <MediaPanel
            title={cropName}
            subtitle="The secret of a good harvest is the choice of the seed and the timing of the rain."
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAFO04b-v13IW4gX21_6blB5q8v2tE4F1yr7XEavt2p1NA2vR9N2nfQPUuG-srR5bwo3LEL_7gpYYod9BDBzsRsjUnrbUx1Uw9QaqrdHbVMdEghdLvX37HnaZih-P6UW3PCIAC_SNASyEBkjxmVg9AP-Nfje0kfciTxsDsTj66wniGza0Ua_Zlc1IB9xfmsUt3Q35CqujNNi6jVZH9QI7_i5vcmENrRdg2jOdfg4eoifzmZ7Xhgoj__j0ajIsVvUrc6NoGEIw54tjw"
            badge={<StatusPill tone="gold">Step One</StatusPill>}
          />

          <CTAButtonRow
            primary={
              <Button className="w-full" disabled={!canAdvance()} onClick={() => setStep(2)}>
                Continue to Plot Details
                <Icon name="arrow_forward" className="ml-2 text-[18px]" />
              </Button>
            }
            secondary={
              <Link href={`/${locale}/farming-activities`} className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss">
                Cancel and return to activities
              </Link>
            }
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-8">
          <FieldGroup>
            <FormField label="Land size">
              <Input value={form.landSize} onChange={(event) => setForm({ ...form, landSize: event.target.value })} placeholder="2.5" />
            </FormField>
            <FormField label="Land unit">
              <Select value={form.landUnit} onChange={(event) => setForm({ ...form, landUnit: event.target.value })}>
                {LAND_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Planting date">
              <Input type="date" value={form.plantingDate} onChange={(event) => setForm({ ...form, plantingDate: event.target.value })} />
            </FormField>
            <FormField label="Farming method">
              <Select value={form.farmingMethod} onChange={(event) => setForm({ ...form, farmingMethod: event.target.value })}>
                <option value="">Select farming method</option>
                {FARMING_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </Select>
            </FormField>
          </FieldGroup>

          <div className="rounded-[2rem] bg-sand p-6">
            <h2 className="font-headline text-3xl font-bold text-leaf">Plot snapshot</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.4rem] bg-white p-4">
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Crop</p>
                <p className="mt-2 text-lg font-semibold text-ink">{cropName}</p>
              </div>
              <div className="rounded-[1.4rem] bg-white p-4">
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Season</p>
                <p className="mt-2 text-lg font-semibold text-ink">{form.seasonCode || 'Not set'}</p>
              </div>
              <div className="rounded-[1.4rem] bg-white p-4">
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Land use</p>
                <p className="mt-2 text-lg font-semibold text-ink">
                  {form.landSize || '0'} {form.landUnit}
                </p>
              </div>
            </div>
          </div>

          <CTAButtonRow
            primary={
              <Button className="w-full" disabled={!canAdvance()} onClick={() => setStep(3)}>
                Continue to Harvest Review
                <Icon name="arrow_forward" className="ml-2 text-[18px]" />
              </Button>
            }
            secondary={
              <button
                type="button"
                className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss"
                onClick={() => setStep(1)}
              >
                Back to crop selection
              </button>
            }
          />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-8">
          <FieldGroup>
            <FormField label="Harvest date" hint="Optional until the crop is harvested">
              <Input type="date" value={form.harvestDate} onChange={(event) => setForm({ ...form, harvestDate: event.target.value })} />
            </FormField>
            <FormField label="Actual yield">
              <Input value={form.actualYield} onChange={(event) => setForm({ ...form, actualYield: event.target.value })} placeholder="Optional" />
            </FormField>
            <FormField label="Yield unit">
              <Select value={form.yieldUnit} onChange={(event) => setForm({ ...form, yieldUnit: event.target.value })}>
                <option value="">Select yield unit</option>
                {YIELD_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select>
            </FormField>
          </FieldGroup>

          <FormField label="Field notes" hint="Capture pests, irrigation, extension support, or harvest observations.">
            <Textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </FormField>

          <div className="rounded-[2rem] bg-white p-6 shadow-card">
            <h2 className="font-headline text-3xl font-bold text-ink">{mode === 'create' ? 'Ready to save' : 'Ready to update'}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.4rem] bg-sand p-4">
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Selected crop</p>
                <p className="mt-2 text-lg font-semibold text-ink">{cropName}</p>
              </div>
              <div className="rounded-[1.4rem] bg-sand p-4">
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Farming method</p>
                <p className="mt-2 text-lg font-semibold text-ink">{form.farmingMethod || 'Not set'}</p>
              </div>
              <div className="rounded-[1.4rem] bg-sand p-4">
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Planting date</p>
                <p className="mt-2 text-lg font-semibold text-ink">{form.plantingDate || 'Not set'}</p>
              </div>
              <div className="rounded-[1.4rem] bg-sand p-4">
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Yield record</p>
                <p className="mt-2 text-lg font-semibold text-ink">
                  {form.actualYield ? `${form.actualYield} ${form.yieldUnit || ''}`.trim() : 'Pending harvest'}
                </p>
              </div>
            </div>
          </div>

          <CTAButtonRow
            primary={
              <Button className="w-full" disabled={submitting} onClick={submit}>
                {submitting ? 'Saving activity...' : mode === 'create' ? 'Save farming activity' : 'Update farming activity'}
              </Button>
            }
            secondary={
              <button
                type="button"
                className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-moss"
                onClick={() => setStep(2)}
              >
                Back to plot details
              </button>
            }
          />
        </div>
      ) : null}
    </div>
  );
}
