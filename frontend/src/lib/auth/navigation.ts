import type { AccountType } from '@/types/auth';

export function canAccessDashboard(accountType: AccountType) {
  return accountType === 'FARMER_YOUTH';
}

export function canAccessFarming(accountType: AccountType) {
  return accountType === 'FARMER_YOUTH';
}

export function getRoleHomeSegment(accountType: AccountType) {
  switch (accountType) {
    case 'FARMER_YOUTH':
      return '/dashboard';
    case 'AGRI_SME':
    case 'PARTNER':
      return '/profile';
    case 'ADMIN':
      return '/admin';
    case 'DONOR_VIEWER':
      return '/donor/dashboard';
    default:
      return '/profile';
  }
}

export function getRoleHomePath(locale: string, accountType: AccountType) {
  return `/${locale}${getRoleHomeSegment(accountType)}`;
}

export function getFriendlyRoleLabel(accountType: AccountType) {
  switch (accountType) {
    case 'FARMER_YOUTH':
      return 'Farmer / Youth';
    case 'AGRI_SME':
      return 'Agri-SME';
    case 'PARTNER':
      return 'Partner / Institution';
    case 'ADMIN':
      return 'Admin';
    case 'DONOR_VIEWER':
      return 'Donor Viewer';
    default:
      return 'User';
  }
}

export function getPreferredDisplayName(
  user: { phoneNumber: string },
  profileBundle?: {
    sharedProfile?: { fullName?: string | null } | null;
    roleProfile?:
      | { businessName?: string | null; organizationName?: string | null }
      | null;
  } | null
) {
  return (
    profileBundle?.sharedProfile?.fullName?.trim() ||
    profileBundle?.roleProfile?.businessName?.trim() ||
    profileBundle?.roleProfile?.organizationName?.trim() ||
    user.phoneNumber
  );
}
