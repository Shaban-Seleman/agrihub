'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { fetchMyActivities } from '@/api/farming-client';
import { fetchCrops, fetchDistricts, fetchRegions, type MetadataOption } from '@/api/metadata-client';
import { createDemand, createProduce, updateDemand, updateProduce } from '@/api/market-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type CommonProps = { locale: string; listingId?: string; initialValues?: Record<string, any> };
const UNITS = ['KG', 'TONNE', 'BAG', 'CRATE', 'LITRE'];

export function ProduceForm({ locale, listingId, initialValues }: CommonProps) {
  return <ListingForm kind="produce" locale={locale} listingId={listingId} initialValues={initialValues} />;
}

export function DemandForm({ locale, listingId, initialValues }: CommonProps) {
  return <ListingForm kind="demand" locale={locale} listingId={listingId} initialValues={initialValues} />;
}

function ListingForm({ kind, locale, listingId, initialValues }: CommonProps & { kind: 'produce' | 'demand' }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [crops, setCrops] = useState<MetadataOption[]>([]);
  const [regions, setRegions] = useState<MetadataOption[]>([]);
  const [districts, setDistricts] = useState<MetadataOption[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [form, setForm] = useState({
    cropId: String(initialValues?.cropId ?? ''),
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    quantity: String(initialValues?.quantity ?? ''),
    unit: initialValues?.unit ?? '',
    price: String(initialValues?.pricePerUnit ?? initialValues?.offeredPricePerUnit ?? ''),
    regionId: String(initialValues?.regionId ?? ''),
    districtId: String(initialValues?.districtId ?? ''),
    contactName: initialValues?.contactName ?? '',
    contactPhone: initialValues?.contactPhone ?? '',
    expiresAt: initialValues?.expiresAt ? String(initialValues.expiresAt).slice(0, 16) : '',
    farmingActivityId: String(initialValues?.farmingActivityId ?? '')
  });

  useEffect(() => {
    Promise.all([fetchCrops(), fetchRegions(), fetchMyActivities()])
      .then(([cropList, regionList, activityList]) => {
        setCrops(cropList);
        setRegions(regionList);
        setActivities(activityList.items ?? []);
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load listing metadata'));
  }, []);

  useEffect(() => {
    if (!form.regionId) {
      setDistricts([]);
      return;
    }

    fetchDistricts(form.regionId)
      .then(setDistricts)
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load districts'));
  }, [form.regionId]);

  const filteredActivities = useMemo(() => {
    if (!form.cropId) {
      return activities;
    }

    return activities.filter((activity) => String(activity.cropId) === form.cropId);
  }, [activities, form.cropId]);

  async function submit() {
    try {
      setError(null);
      const payload: Record<string, unknown> = {
        cropId: Number(form.cropId),
        title: form.title,
        description: form.description || null,
        quantity: Number(form.quantity),
        unit: form.unit,
        regionId: form.regionId ? Number(form.regionId) : null,
        districtId: form.districtId ? Number(form.districtId) : null,
        contactName: form.contactName || null,
        contactPhone: form.contactPhone,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null
      };
      if (kind === 'produce') {
        payload.pricePerUnit = form.price ? Number(form.price) : null;
        payload.farmingActivityId = form.farmingActivityId ? Number(form.farmingActivityId) : null;
        listingId ? await updateProduce(listingId, payload) : await createProduce(payload);
      } else {
        payload.offeredPricePerUnit = form.price ? Number(form.price) : null;
        listingId ? await updateDemand(listingId, payload) : await createDemand(payload);
      }
      router.push(`/${locale}/market`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save listing');
    }
  }

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">{kind === 'produce' ? 'Supply listing' : 'Buyer demand'}</p>
        <h1 className="text-2xl font-bold">{listingId ? 'Update listing' : `Create ${kind} listing`}</h1>
        <p className="text-sm text-ink/70">Use structured market fields so filtering, moderation, and expiry rules work reliably.</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {kind === 'produce' ? (
          <label className="space-y-2 text-sm font-medium md:col-span-2">
            <span>Related farming activity</span>
            <Select value={form.farmingActivityId} onChange={(e) => setForm({ ...form, farmingActivityId: e.target.value })}>
              <option value="">Optional: link to your activity</option>
              {filteredActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.cropName} · {activity.seasonCode}
                </option>
              ))}
            </Select>
          </label>
        ) : null}
        <label className="space-y-2 text-sm font-medium">
          <span>Crop</span>
          <Select value={form.cropId} onChange={(e) => setForm({ ...form, cropId: e.target.value })}>
            <option value="">Select crop</option>
            {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Unit</span>
          <Select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
            <option value="">Select unit</option>
            {UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          <span>Title</span>
          <Input placeholder="Example: Fresh maize available in Chamwino" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          <span>Description</span>
          <Textarea placeholder="State grade, packaging, collection terms, and timing" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Quantity</span>
          <Input placeholder="100" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>{kind === 'produce' ? 'Price per unit' : 'Offered price per unit'}</span>
          <Input placeholder="Optional" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Region</span>
          <Select value={form.regionId} onChange={(e) => setForm({ ...form, regionId: e.target.value, districtId: '' })}>
            <option value="">Select region</option>
            {regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>District</span>
          <Select value={form.districtId} onChange={(e) => setForm({ ...form, districtId: e.target.value })} disabled={!form.regionId}>
            <option value="">Select district</option>
            {districts.map((district) => <option key={district.id} value={district.id}>{district.name}</option>)}
          </Select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Contact name</span>
          <Input placeholder="Optional" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Contact phone</span>
          <Input placeholder="+2557..." value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
        </label>
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          <span>Expiry date and time</span>
          <Input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        </label>
      </div>
      <Button className="w-full" onClick={submit}>{listingId ? 'Update Listing' : 'Create Listing'}</Button>
    </Card>
  );
}
