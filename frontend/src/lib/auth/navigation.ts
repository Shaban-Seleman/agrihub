import type { AccountType } from '@/types/auth';

export function canAccessDashboard(accountType: AccountType) {
  return accountType === 'ADMIN' || accountType === 'DONOR_VIEWER';
}

export function canAccessFarming(accountType: AccountType) {
  return accountType === 'FARMER_YOUTH';
}

export function getRoleHomeSegment(accountType: AccountType) {
  switch (accountType) {
    case 'ADMIN':
      return '/dashboard';
    case 'DONOR_VIEWER':
      return '/donor/dashboard';
    case 'FARMER_YOUTH':
    case 'AGRI_SME':
    case 'PARTNER':
    default:
      return '/profile';
  }
}

export function getRoleHomePath(locale: string, accountType: AccountType) {
  return `/${locale}${getRoleHomeSegment(accountType)}`;
}
