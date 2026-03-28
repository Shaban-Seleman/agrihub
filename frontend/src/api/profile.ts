import { apiFetch } from './client';
import { serverApiFetch } from './server';

export const getProfileBundle = () => serverApiFetch<any>('/api/v1/me/profile');
export const getProfileCompletion = () => serverApiFetch<any>('/api/v1/me/profile-completion');
export const getCropInterests = () => serverApiFetch<any>('/api/v1/me/crop-interests');
export const getBusinessCommodities = () => serverApiFetch<any>('/api/v1/me/business-commodities');
export const getMetadataRegions = () => serverApiFetch<any>('/api/v1/metadata/regions');
export const getMetadataCrops = () => serverApiFetch<any>('/api/v1/metadata/crops');
export const updateSharedProfile = (payload: unknown) => apiFetch('/api/v1/me/profile', { method: 'PUT', body: JSON.stringify(payload) });
export const updateFarmerProfile = (payload: unknown) => apiFetch('/api/v1/me/farmer-profile', { method: 'PUT', body: JSON.stringify(payload) });
export const updateBusinessProfile = (payload: unknown) => apiFetch('/api/v1/me/business-profile', { method: 'PUT', body: JSON.stringify(payload) });
export const updatePartnerProfile = (payload: unknown) => apiFetch('/api/v1/me/partner-profile', { method: 'PUT', body: JSON.stringify(payload) });
export const saveCropInterests = (payload: unknown) => apiFetch('/api/v1/me/crop-interests', { method: 'POST', body: JSON.stringify(payload) });
export const saveBusinessCommodities = (payload: unknown) => apiFetch('/api/v1/me/business-commodities', { method: 'POST', body: JSON.stringify(payload) });
export const changePassword = (payload: unknown) => apiFetch('/api/v1/me/password', { method: 'POST', body: JSON.stringify(payload) });
