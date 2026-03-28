import { env } from '@/lib/env';
import { ensureCsrfToken, getCsrfHeaderName, isUnsafeMethod } from '@/lib/security/csrf';
import type { ApiResponse } from '@/types/api';

async function parseApiPayload<T>(response: Response): Promise<ApiResponse<T> | null> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  const method = options.method ?? 'GET';

  headers.set('Content-Type', 'application/json');

  if (isUnsafeMethod(method)) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      headers.set(getCsrfHeaderName(), csrfToken);
    }
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: options.cache ?? 'no-store'
  });

  const payload = await parseApiPayload<T>(response);

  if (!response.ok) {
    const message =
      payload && !payload.success
        ? payload.error.message
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!payload) {
    throw new Error('Server returned an unexpected response');
  }

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}
