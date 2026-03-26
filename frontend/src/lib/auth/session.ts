import { cache } from 'react';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import type { ApiResponse } from '@/types/api';
import type { AccountType, SessionUser } from '@/types/auth';

export const getCurrentSession = cache(async (): Promise<SessionUser | null> => {
  try {
    const cookieHeader = (await cookies()).toString();
    const response = await fetch(`${env.apiBaseUrl}/api/v1/me`, {
      headers: {
        Cookie: cookieHeader
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<SessionUser>;
    return payload.success ? payload.data : null;
  } catch {
    return null;
  }
});

export async function requireSession(allowedRoles?: AccountType[]) {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error('UNAUTHENTICATED');
  }

  if (allowedRoles && !allowedRoles.includes(session.accountType)) {
    throw new Error('FORBIDDEN');
  }

  return session;
}
