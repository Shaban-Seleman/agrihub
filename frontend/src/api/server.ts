import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import type { ApiResponse } from '@/types/api';

export async function serverApiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookieHeader = (await cookies()).toString();
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Cookie: cookieHeader,
      ...(init.headers ?? {})
    },
    cache: 'no-store'
  });

  const body = await response.text();
  let payload: ApiResponse<T> | null = null;

  if (body) {
    try {
      payload = JSON.parse(body) as ApiResponse<T>;
    } catch {
      throw new Error(`Invalid API response with status ${response.status}`);
    }
  }

  if (!response.ok) {
    throw new Error(payload?.success === false ? payload.error.message : `Request failed with status ${response.status}`);
  }

  if (!payload) {
    throw new Error('Empty API response');
  }

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}
