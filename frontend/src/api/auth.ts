import { apiFetch } from './client';
import type { AccountType, SessionUser } from '@/types/auth';

export type RegisterPayload = {
  phoneNumber: string;
  password: string;
  accountType: Exclude<AccountType, 'ADMIN' | 'DONOR_VIEWER'>;
  fullName: string;
};

export type LoginPayload = {
  phoneNumber: string;
  password: string;
};

export type VerifyOtpPayload = {
  phoneNumber: string;
  otpCode: string;
};

export type ResendOtpPayload = {
  phoneNumber: string;
};

export async function register(payload: RegisterPayload) {
  return apiFetch('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  return apiFetch('/api/v1/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function resendOtp(payload: ResendOtpPayload) {
  return apiFetch('/api/v1/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function login(payload: LoginPayload) {
  return apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function getSession() {
  return apiFetch<SessionUser>('/api/v1/me');
}
