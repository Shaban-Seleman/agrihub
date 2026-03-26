import { apiFetch } from './client';
import { serverApiFetch } from './server';

export const getDashboardOverview = () => serverApiFetch<Record<string, number>>('/api/v1/dashboard/overview');
export const getDashboardInclusion = () => serverApiFetch<Record<string, unknown>>('/api/v1/dashboard/inclusion');
export const getDashboardProduction = () => serverApiFetch<Record<string, number>>('/api/v1/dashboard/production');
export const getDashboardMarket = () => serverApiFetch<Record<string, number>>('/api/v1/dashboard/market');
export const getDashboardOpportunities = () => serverApiFetch<Record<string, number>>('/api/v1/dashboard/opportunities');
export const getDashboardSmes = () => serverApiFetch<Record<string, number>>('/api/v1/dashboard/smes');

export const getDonorOverview = getDashboardOverview;
export const getDonorInclusion = getDashboardInclusion;
export const getDonorProduction = getDashboardProduction;
export const getDonorMarket = getDashboardMarket;
export const getDonorOpportunities = getDashboardOpportunities;
export const getDonorSmes = getDashboardSmes;

export async function fetchCsv(path: string) {
  const response = await fetch(path, { credentials: 'include' });
  return response.text();
}
