import { env } from '@/lib/env';

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function readCookie(name: string) {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const match = cookies.find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

export function isUnsafeMethod(method?: string) {
  return UNSAFE_METHODS.has((method ?? 'GET').toUpperCase());
}

export function getCsrfTokenFromDocument() {
  return readCookie(CSRF_COOKIE_NAME);
}

export async function ensureCsrfToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const existing = getCsrfTokenFromDocument();
  if (existing) {
    return existing;
  }

  const response = await fetch(`${env.apiBaseUrl}/api/v1/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Unable to initialize CSRF protection (${response.status})`);
  }

  const token = getCsrfTokenFromDocument();
  if (!token) {
    throw new Error('Unable to read CSRF cookie after initialization');
  }

  return token;
}

export function getCsrfHeaderName() {
  return CSRF_HEADER_NAME;
}
