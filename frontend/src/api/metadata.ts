import { apiFetch } from './client';
import { serverApiFetch } from './server';

export type MetadataOption = {
  id: number;
  name: string;
};

export const getRegions = () => serverApiFetch<MetadataOption[]>('/api/v1/metadata/regions');
export const getCrops = () => serverApiFetch<MetadataOption[]>('/api/v1/metadata/crops');

export const fetchRegions = () => apiFetch<MetadataOption[]>('/api/v1/metadata/regions');
export const fetchCrops = () => apiFetch<MetadataOption[]>('/api/v1/metadata/crops');
export const fetchDistricts = (regionId: string | number) =>
  apiFetch<MetadataOption[]>(`/api/v1/metadata/districts?regionId=${regionId}`);
export const fetchWards = (districtId: string | number) =>
  apiFetch<MetadataOption[]>(`/api/v1/metadata/wards?districtId=${districtId}`);
