import { apiFetch } from './client';
import { serverApiFetch } from './server';

export const getProfileBundle = () => serverApiFetch<any>('/api/v1/me/profile');
export const getProfileCompletion = () => serverApiFetch<any>('/api/v1/me/profile-completion');
export const getMetadataRegions = () => serverApiFetch<any>('/api/v1/metadata/regions');
export const getMetadataCrops = () => serverApiFetch<any>('/api/v1/metadata/crops');
export const updateSharedProfile = (payload: unknown) => apiFetch('/api/v1/me/profile', { method: 'PUT', body: JSON.stringify(payload) });
export const updateFarmerProfile = (payload: unknown) => apiFetch('/api/v1/me/farmer-profile', { method: 'PUT', body: JSON.stringify(payload) });
