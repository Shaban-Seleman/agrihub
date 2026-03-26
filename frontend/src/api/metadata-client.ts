import { apiFetch } from './client';

export type MetadataOption = {
  id: number;
  name: string;
};

export const fetchRegions = () => apiFetch<MetadataOption[]>('/api/v1/metadata/regions');
export const fetchCrops = () => apiFetch<MetadataOption[]>('/api/v1/metadata/crops');
export const fetchDistricts = (regionId: string | number) =>
  apiFetch<MetadataOption[]>(`/api/v1/metadata/districts?regionId=${regionId}`);
export const fetchWards = (districtId: string | number) =>
  apiFetch<MetadataOption[]>(`/api/v1/metadata/wards?districtId=${districtId}`);
