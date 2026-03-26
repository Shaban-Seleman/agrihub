import { env } from '@/lib/env';
import type { ApiResponse } from '@/types/api';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    credentials: 'include',
    cache: options.cache ?? 'no-store'
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.success ? 'Unexpected API error' : payload.error.message);
  }

  return payload.data;
}
