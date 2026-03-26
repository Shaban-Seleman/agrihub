export type AccountType = 'FARMER_YOUTH' | 'AGRI_SME' | 'PARTNER' | 'ADMIN' | 'DONOR_VIEWER';

export type SessionUser = {
  userId: number;
  phoneNumber: string;
  accountType: AccountType;
  status: string;
};
