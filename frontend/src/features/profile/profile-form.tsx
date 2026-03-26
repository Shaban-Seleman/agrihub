'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCrops, fetchDistricts, fetchRegions, fetchWards, type MetadataOption } from '@/api/metadata-client';
import { updateFarmerProfile, updateSharedProfile } from '@/api/profile-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const GENDERS = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
const AGE_RANGES = ['AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_54', 'AGE_55_PLUS'];

export function ProfileForms({
  locale,
  profileBundle
}: {
  locale: string;
  profileBundle: any;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<MetadataOption[]>([]);
  const [districts, setDistricts] = useState<MetadataOption[]>([]);
  const [wards, setWards] = useState<MetadataOption[]>([]);
  const [crops, setCrops] = useState<MetadataOption[]>([]);
  const shared = profileBundle.sharedProfile ?? {};
  const farmer = profileBundle.roleProfile ?? {};
  const [sharedForm, setSharedForm] = useState({
    fullName: shared.fullName ?? '',
    email: shared.email ?? '',
    regionId: String(shared.regionId ?? ''),
    districtId: String(shared.districtId ?? ''),
    wardId: String(shared.wardId ?? ''),
    gender: shared.gender ?? '',
    ageRange: shared.ageRange ?? ''
  });
  const [farmerForm, setFarmerForm] = useState({
    gender: farmer.gender ?? '',
    ageRange: farmer.ageRange ?? '',
    primaryCropId: String(farmer.primaryCropId ?? ''),
    secondaryCropId: String(farmer.secondaryCropId ?? '')
  });

  useEffect(() => {
    Promise.all([fetchRegions(), fetchCrops()])
      .then(([regionList, cropList]) => {
        setRegions(regionList);
        setCrops(cropList);
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load profile metadata'));
  }, []);

  useEffect(() => {
    if (!sharedForm.regionId) {
      setDistricts([]);
      return;
    }

    fetchDistricts(sharedForm.regionId)
      .then(setDistricts)
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load districts'));
  }, [sharedForm.regionId]);

  useEffect(() => {
    if (!sharedForm.districtId) {
      setWards([]);
      return;
    }

    fetchWards(sharedForm.districtId)
      .then(setWards)
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load wards'));
  }, [sharedForm.districtId]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="space-y-4">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <h2 className="text-lg font-semibold">Shared Profile</h2>
        <Input placeholder="Full name" value={sharedForm.fullName} onChange={(e) => setSharedForm({ ...sharedForm, fullName: e.target.value })} />
        <Input placeholder="Email" value={sharedForm.email} onChange={(e) => setSharedForm({ ...sharedForm, email: e.target.value })} />
        <Select value={sharedForm.regionId} onChange={(e) => setSharedForm({ ...sharedForm, regionId: e.target.value, districtId: '', wardId: '' })}>
          <option value="">Select region</option>
          {regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
        </Select>
        <Select value={sharedForm.districtId} onChange={(e) => setSharedForm({ ...sharedForm, districtId: e.target.value, wardId: '' })} disabled={!sharedForm.regionId}>
          <option value="">Select district</option>
          {districts.map((district) => <option key={district.id} value={district.id}>{district.name}</option>)}
        </Select>
        <Select value={sharedForm.wardId} onChange={(e) => setSharedForm({ ...sharedForm, wardId: e.target.value })} disabled={!sharedForm.districtId}>
          <option value="">Select ward</option>
          {wards.map((ward) => <option key={ward.id} value={ward.id}>{ward.name}</option>)}
        </Select>
        <Select value={sharedForm.gender} onChange={(e) => setSharedForm({ ...sharedForm, gender: e.target.value })}>
          <option value="">Select gender</option>
          {GENDERS.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
        </Select>
        <Select value={sharedForm.ageRange} onChange={(e) => setSharedForm({ ...sharedForm, ageRange: e.target.value })}>
          <option value="">Select age range</option>
          {AGE_RANGES.map((ageRange) => <option key={ageRange} value={ageRange}>{ageRange}</option>)}
        </Select>
        <Button
          onClick={async () => {
            try {
              setError(null);
              await updateSharedProfile({
                fullName: sharedForm.fullName,
                email: sharedForm.email || null,
                regionId: sharedForm.regionId ? Number(sharedForm.regionId) : null,
                districtId: sharedForm.districtId ? Number(sharedForm.districtId) : null,
                wardId: sharedForm.wardId ? Number(sharedForm.wardId) : null,
                gender: sharedForm.gender || null,
                ageRange: sharedForm.ageRange || null
              });
              router.push(`/${locale}/profile`);
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update profile');
            }
          }}
          className="w-full"
        >
          Save Shared Profile
        </Button>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Farmer Profile</h2>
        <Select value={farmerForm.gender} onChange={(e) => setFarmerForm({ ...farmerForm, gender: e.target.value })}>
          <option value="">Select gender</option>
          {GENDERS.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
        </Select>
        <Select value={farmerForm.ageRange} onChange={(e) => setFarmerForm({ ...farmerForm, ageRange: e.target.value })}>
          <option value="">Select age range</option>
          {AGE_RANGES.map((ageRange) => <option key={ageRange} value={ageRange}>{ageRange}</option>)}
        </Select>
        <Select value={farmerForm.primaryCropId} onChange={(e) => setFarmerForm({ ...farmerForm, primaryCropId: e.target.value })}>
          <option value="">Select primary crop</option>
          {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
        </Select>
        <Select value={farmerForm.secondaryCropId} onChange={(e) => setFarmerForm({ ...farmerForm, secondaryCropId: e.target.value })}>
          <option value="">Select secondary crop</option>
          {crops.filter((crop) => String(crop.id) !== farmerForm.primaryCropId).map((crop) => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
        </Select>
        <Button
          onClick={async () => {
            try {
              setError(null);
              await updateFarmerProfile({
                gender: farmerForm.gender,
                ageRange: farmerForm.ageRange,
                primaryCropId: Number(farmerForm.primaryCropId),
                secondaryCropId: farmerForm.secondaryCropId ? Number(farmerForm.secondaryCropId) : null
              });
              router.push(`/${locale}/profile`);
              router.refresh();
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : 'Unable to update farmer profile');
            }
          }}
          className="w-full"
        >
          Save Farmer Profile
        </Button>
      </Card>
    </div>
  );
}
