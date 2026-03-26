'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createActivity, updateActivity } from '@/api/farming-client';
import { fetchCrops, type MetadataOption } from '@/api/metadata-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

export function FarmingForm({ locale, mode, activityId, initialValues }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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

  async function submit() {
    try {
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
    }
  }

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">Production log</p>
        <h1 className="text-2xl font-bold text-ink">{mode === 'create' ? 'Add farming activity' : 'Update farming activity'}</h1>
        <p className="text-sm text-ink/70">Capture season, land use, and harvest outcomes with structured fields for reporting.</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          <span>Crop</span>
          <Select value={form.cropId} onChange={(e) => setForm({ ...form, cropId: e.target.value })}>
            <option value="">Select crop</option>
            {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Season code</span>
          <Input placeholder="Example: 2026-MASIKA" value={form.seasonCode} onChange={(e) => setForm({ ...form, seasonCode: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Land size</span>
          <Input placeholder="2.5" value={form.landSize} onChange={(e) => setForm({ ...form, landSize: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Land unit</span>
          <Select value={form.landUnit} onChange={(e) => setForm({ ...form, landUnit: e.target.value })}>
            {LAND_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Planting date</span>
          <Input type="date" value={form.plantingDate} onChange={(e) => setForm({ ...form, plantingDate: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Harvest date</span>
          <Input type="date" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Actual yield</span>
          <Input placeholder="Optional" value={form.actualYield} onChange={(e) => setForm({ ...form, actualYield: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Yield unit</span>
          <Select value={form.yieldUnit} onChange={(e) => setForm({ ...form, yieldUnit: e.target.value })}>
            <option value="">Select yield unit</option>
            {YIELD_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
          </Select>
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium">
        <span>Farming method</span>
        <Select value={form.farmingMethod} onChange={(e) => setForm({ ...form, farmingMethod: e.target.value })}>
          <option value="">Select farming method</option>
          {FARMING_METHODS.map((method) => <option key={method} value={method}>{method}</option>)}
        </Select>
      </label>
      <label className="space-y-2 text-sm font-medium">
        <span>Notes</span>
        <Textarea placeholder="Capture pests, irrigation, extension support, or harvest observations" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </label>
      <Button className="w-full" onClick={submit}>{mode === 'create' ? 'Create Activity' : 'Update Activity'}</Button>
    </Card>
  );
}
