'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCrops, fetchDistricts, fetchRegions, fetchWards, type MetadataOption } from '@/api/metadata-client';
import {
  saveBusinessCommodities,
  saveCropInterests,
  updateBusinessProfile,
  updateFarmerProfile,
  updatePartnerProfile,
  updateSharedProfile
} from '@/api/profile-client';
import { CTAButtonRow, FieldGroup, FormField, StepWizardHeader } from '@/components/app/forms';
import { DetailSection } from '@/components/app/primitives';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AccountType } from '@/types/auth';

const GENDERS = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
const AGE_RANGES = ['AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_54', 'AGE_55_PLUS'];
const BUSINESS_TYPES = ['AGGREGATOR', 'PROCESSOR', 'INPUT_SUPPLIER', 'SERVICE_PROVIDER', 'BUYER', 'TRADER'];
const PARTNER_TYPES = ['NGO', 'GOVERNMENT_INSTITUTION', 'ACADEMIC_INSTITUTION', 'DEVELOPMENT_PARTNER', 'PRIVATE_COMPANY', 'OTHER'];

type BaseProps = {
  locale: string;
  profileBundle: any;
  accountType?: AccountType;
  cropSelections?: Array<{ id: number; name: string }>;
  commoditySelections?: Array<{ id: number; name: string }>;
};

export function ProfileForms(props: BaseProps) {
  const role = props.accountType ?? 'FARMER_YOUTH';

  return (
    <div className="space-y-6">
      <SharedProfileSection {...props} />
      {role === 'FARMER_YOUTH' ? (
        <>
          <FarmerProfileSection {...props} />
          <CropInterestSection {...props} />
        </>
      ) : null}
      {role === 'AGRI_SME' ? (
        <>
          <BusinessProfileSection {...props} />
          <BusinessCommoditiesSection {...props} />
        </>
      ) : null}
      {role === 'PARTNER' ? <PartnerProfileSection {...props} /> : null}
    </div>
  );
}

function useProfileMetadata(initialRegionId?: string) {
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<MetadataOption[]>([]);
  const [districts, setDistricts] = useState<MetadataOption[]>([]);
  const [wards, setWards] = useState<MetadataOption[]>([]);
  const [crops, setCrops] = useState<MetadataOption[]>([]);

  useEffect(() => {
    Promise.all([fetchRegions(), fetchCrops()])
      .then(([regionList, cropList]) => {
        setRegions(regionList);
        setCrops(cropList);
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load metadata'));
  }, []);

  useEffect(() => {
    if (!initialRegionId) {
      setDistricts([]);
      return;
    }

    fetchDistricts(initialRegionId)
      .then(setDistricts)
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load districts'));
  }, [initialRegionId]);

  return { error, setError, regions, districts, wards, crops, setDistricts, setWards };
}

export function SharedProfileSection({ locale, profileBundle }: BaseProps) {
  const router = useRouter();
  const shared = profileBundle.sharedProfile ?? {};
  const [form, setForm] = useState({
    fullName: shared.fullName ?? '',
    email: shared.email ?? '',
    regionId: String(shared.regionId ?? ''),
    districtId: String(shared.districtId ?? ''),
    wardId: String(shared.wardId ?? ''),
    gender: shared.gender ?? '',
    ageRange: shared.ageRange ?? '',
    dateOfBirth: shared.dateOfBirth ?? ''
  });
  const { error, setError, regions, districts, wards, setDistricts, setWards } = useProfileMetadata(form.regionId);

  useEffect(() => {
    if (!form.regionId) {
      setDistricts([]);
      return;
    }
    fetchDistricts(form.regionId)
      .then(setDistricts)
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load districts'));
  }, [form.regionId, setDistricts, setError]);

  useEffect(() => {
    if (!form.districtId) {
      setWards([]);
      return;
    }
    fetchWards(form.districtId)
      .then(setWards)
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load wards'));
  }, [form.districtId, setWards, setError]);

  return (
    <DetailSection title="Shared profile" subtitle="Keep your core identity and location details current for accurate matching, advisory, and reporting.">
      <div className="space-y-5">
        {error ? <FormError message={error} /> : null}
        <FieldGroup>
          <FormField label="Full name">
            <Input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          </FormField>
          <FormField label="Email">
            <Input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </FormField>
          <FormField label="Region">
            <Select value={form.regionId} onChange={(event) => setForm({ ...form, regionId: event.target.value, districtId: '', wardId: '' })}>
              <option value="">Select region</option>
              {regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
            </Select>
          </FormField>
          <FormField label="District">
            <Select value={form.districtId} disabled={!form.regionId} onChange={(event) => setForm({ ...form, districtId: event.target.value, wardId: '' })}>
              <option value="">Select district</option>
              {districts.map((district) => <option key={district.id} value={district.id}>{district.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Ward">
            <Select value={form.wardId} disabled={!form.districtId} onChange={(event) => setForm({ ...form, wardId: event.target.value })}>
              <option value="">Select ward</option>
              {wards.map((ward) => <option key={ward.id} value={ward.id}>{ward.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Gender">
            <Select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
              <option value="">Select gender</option>
              {GENDERS.map((gender) => <option key={gender} value={gender}>{formatLabel(gender)}</option>)}
            </Select>
          </FormField>
          <FormField label="Age range">
            <Select value={form.ageRange} onChange={(event) => setForm({ ...form, ageRange: event.target.value })}>
              <option value="">Select age range</option>
              {AGE_RANGES.map((ageRange) => <option key={ageRange} value={ageRange}>{formatLabel(ageRange)}</option>)}
            </Select>
          </FormField>
          <FormField label="Date of birth">
            <Input type="date" value={form.dateOfBirth} onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })} />
          </FormField>
        </FieldGroup>
        <Button
          className="w-full md:w-auto"
          onClick={async () => {
            try {
              setError(null);
              await updateSharedProfile({
                fullName: form.fullName,
                email: form.email || null,
                regionId: form.regionId ? Number(form.regionId) : null,
                districtId: form.districtId ? Number(form.districtId) : null,
                wardId: form.wardId ? Number(form.wardId) : null,
                gender: form.gender || null,
                ageRange: form.ageRange || null,
                dateOfBirth: form.dateOfBirth || null,
                profilePhotoUrl: null
              });
              router.push(`/${locale}/profile`);
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update shared profile');
            }
          }}
        >
          Save shared profile
        </Button>
      </div>
    </DetailSection>
  );
}

export function FarmerProfileSection({ locale, profileBundle }: BaseProps) {
  const router = useRouter();
  const farmer = profileBundle.roleProfile ?? {};
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    gender: farmer.gender ?? '',
    ageRange: farmer.ageRange ?? '',
    primaryCropId: String(farmer.primaryCropId ?? ''),
    secondaryCropId: String(farmer.secondaryCropId ?? ''),
    farmingExperience: farmer.farmingExperience ?? ''
  });
  const { crops } = useProfileMetadata();

  return (
    <DetailSection title="Farmer / youth profile" subtitle="Capture the required farmer demographic and primary crop fields for the MVP.">
      <div className="space-y-5">
        {error ? <FormError message={error} /> : null}
        <FieldGroup>
          <FormField label="Gender">
            <Select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
              <option value="">Select gender</option>
              {GENDERS.map((gender) => <option key={gender} value={gender}>{formatLabel(gender)}</option>)}
            </Select>
          </FormField>
          <FormField label="Age range">
            <Select value={form.ageRange} onChange={(event) => setForm({ ...form, ageRange: event.target.value })}>
              <option value="">Select age range</option>
              {AGE_RANGES.map((ageRange) => <option key={ageRange} value={ageRange}>{formatLabel(ageRange)}</option>)}
            </Select>
          </FormField>
          <FormField label="Primary crop">
            <Select value={form.primaryCropId} onChange={(event) => setForm({ ...form, primaryCropId: event.target.value })}>
              <option value="">Select primary crop</option>
              {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Secondary crop">
            <Select value={form.secondaryCropId} onChange={(event) => setForm({ ...form, secondaryCropId: event.target.value })}>
              <option value="">Optional secondary crop</option>
              {crops.filter((crop) => String(crop.id) !== form.primaryCropId).map((crop) => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
            </Select>
          </FormField>
        </FieldGroup>
        <FormField label="Farming experience" hint="Optional short description of your farming experience.">
          <Textarea value={form.farmingExperience} onChange={(event) => setForm({ ...form, farmingExperience: event.target.value })} />
        </FormField>
        <Button
          className="w-full md:w-auto"
          onClick={async () => {
            try {
              setError(null);
              await updateFarmerProfile({
                gender: form.gender,
                ageRange: form.ageRange,
                primaryCropId: Number(form.primaryCropId),
                secondaryCropId: form.secondaryCropId ? Number(form.secondaryCropId) : null,
                farmingExperience: form.farmingExperience || null
              });
              router.push(`/${locale}/profile`);
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update farmer profile');
            }
          }}
        >
          Save farmer profile
        </Button>
      </div>
    </DetailSection>
  );
}

export function BusinessProfileSection({ locale, profileBundle }: BaseProps) {
  const router = useRouter();
  const business = profileBundle.roleProfile ?? {};
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: business.businessName ?? '',
    businessType: business.businessType ?? '',
    registrationNumber: business.registrationNumber ?? '',
    visibleInDirectory: Boolean(business.visibleInDirectory)
  });

  return (
    <DetailSection title="Business profile" subtitle="Build the SME-facing profile that powers the directory and opportunity visibility.">
      <div className="space-y-5">
        {error ? <FormError message={error} /> : null}
        <FieldGroup>
          <FormField label="Business name">
            <Input value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} />
          </FormField>
          <FormField label="Business type">
            <Select value={form.businessType} onChange={(event) => setForm({ ...form, businessType: event.target.value })}>
              <option value="">Select business type</option>
              {BUSINESS_TYPES.map((type) => <option key={type} value={type}>{formatLabel(type)}</option>)}
            </Select>
          </FormField>
          <FormField label="Registration number">
            <Input value={form.registrationNumber} onChange={(event) => setForm({ ...form, registrationNumber: event.target.value })} />
          </FormField>
          <FormField label="Directory visibility">
            <Select value={String(form.visibleInDirectory)} onChange={(event) => setForm({ ...form, visibleInDirectory: event.target.value === 'true' })}>
              <option value="true">Visible in directory</option>
              <option value="false">Keep private for now</option>
            </Select>
          </FormField>
        </FieldGroup>
        <Button
          className="w-full md:w-auto"
          onClick={async () => {
            try {
              setError(null);
              await updateBusinessProfile(form);
              router.push(`/${locale}/profile`);
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update business profile');
            }
          }}
        >
          Save business profile
        </Button>
      </div>
    </DetailSection>
  );
}

export function PartnerProfileSection({ locale, profileBundle }: BaseProps) {
  const router = useRouter();
  const partner = profileBundle.roleProfile ?? {};
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    organizationName: partner.organizationName ?? '',
    organizationType: partner.organizationType ?? '',
    focusArea: partner.focusArea ?? ''
  });

  return (
    <DetailSection title="Partner profile" subtitle="Capture the organization type and focus area for partner/institution participation.">
      <div className="space-y-5">
        {error ? <FormError message={error} /> : null}
        <FieldGroup>
          <FormField label="Organization name">
            <Input value={form.organizationName} onChange={(event) => setForm({ ...form, organizationName: event.target.value })} />
          </FormField>
          <FormField label="Organization type">
            <Select value={form.organizationType} onChange={(event) => setForm({ ...form, organizationType: event.target.value })}>
              <option value="">Select organization type</option>
              {PARTNER_TYPES.map((type) => <option key={type} value={type}>{formatLabel(type)}</option>)}
            </Select>
          </FormField>
        </FieldGroup>
        <FormField label="Focus area">
          <Textarea value={form.focusArea} onChange={(event) => setForm({ ...form, focusArea: event.target.value })} />
        </FormField>
        <Button
          className="w-full md:w-auto"
          onClick={async () => {
            try {
              setError(null);
              await updatePartnerProfile(form);
              router.push(`/${locale}/profile`);
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update partner profile');
            }
          }}
        >
          Save partner profile
        </Button>
      </div>
    </DetailSection>
  );
}

export function CropInterestSection({ locale, cropSelections = [] }: BaseProps) {
  const router = useRouter();
  const { crops } = useProfileMetadata();
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(cropSelections.map((item) => String(item.id)));

  return (
    <DetailSection title="Crop interests" subtitle="Select crop interests to improve recommendations, advisory relevance, and onboarding completeness.">
      <div className="space-y-5">
        {error ? <FormError message={error} /> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {crops.map((crop) => {
            const active = selectedIds.includes(String(crop.id));
            return (
              <button
                key={crop.id}
                type="button"
                className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${active ? 'border-leaf bg-sand text-leaf' : 'border-line/40 bg-white text-ink'}`}
                onClick={() => setSelectedIds((current) => (
                  current.includes(String(crop.id))
                    ? current.filter((item) => item !== String(crop.id))
                    : [...current, String(crop.id)]
                ))}
              >
                <p className="font-semibold">{crop.name}</p>
              </button>
            );
          })}
        </div>
        <Button
          className="w-full md:w-auto"
          onClick={async () => {
            try {
              setError(null);
              await saveCropInterests({ cropIds: selectedIds.map(Number) });
              router.push(`/${locale}/profile`);
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to save crop interests');
            }
          }}
        >
          Save crop interests
        </Button>
      </div>
    </DetailSection>
  );
}

export function BusinessCommoditiesSection({ locale, commoditySelections = [] }: BaseProps) {
  const router = useRouter();
  const { crops } = useProfileMetadata();
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(commoditySelections.map((item) => String(item.id)));

  return (
    <DetailSection title="Business commodities" subtitle="Select the crop commodities your business works with so directory and market visibility stay accurate.">
      <div className="space-y-5">
        {error ? <FormError message={error} /> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {crops.map((crop) => {
            const active = selectedIds.includes(String(crop.id));
            return (
              <button
                key={crop.id}
                type="button"
                className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${active ? 'border-leaf bg-sand text-leaf' : 'border-line/40 bg-white text-ink'}`}
                onClick={() => setSelectedIds((current) => (
                  current.includes(String(crop.id))
                    ? current.filter((item) => item !== String(crop.id))
                    : [...current, String(crop.id)]
                ))}
              >
                <p className="font-semibold">{crop.name}</p>
              </button>
            );
          })}
        </div>
        <Button
          className="w-full md:w-auto"
          onClick={async () => {
            try {
              setError(null);
              await saveBusinessCommodities({ cropIds: selectedIds.map(Number) });
              router.push(`/${locale}/profile`);
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to save business commodities');
            }
          }}
        >
          Save commodities
        </Button>
      </div>
    </DetailSection>
  );
}

export function OnboardingStepLayout({
  current,
  total,
  title,
  description,
  children
}: {
  current: number;
  total: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <StepWizardHeader current={current} total={total} title={title} description={description} />
      {children}
    </div>
  );
}

export function OnboardingNextActions({
  primary,
  secondary
}: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}) {
  return <CTAButtonRow primary={primary} secondary={secondary} />;
}

function FormError({ message }: { message: string }) {
  return <p className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>;
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
