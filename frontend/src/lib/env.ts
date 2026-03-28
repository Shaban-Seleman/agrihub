const explicitApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function getDefaultApiBaseUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8080';
  }

  return `${window.location.protocol}//${window.location.hostname}:8080`;
}

export const env = {
  get apiBaseUrl() {
    return explicitApiBaseUrl ?? getDefaultApiBaseUrl();
  },
  appName: 'SamiAgriHub'
};
