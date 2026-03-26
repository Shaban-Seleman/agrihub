export function formatEnumLabel(value: string | null | undefined) {
  if (!value) {
    return 'Not set';
  }

  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-TZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-TZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export function formatNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  return new Intl.NumberFormat('en-TZ').format(Number(value));
}

export function entriesOf(data: Record<string, unknown> | null | undefined) {
  return Object.entries(data ?? {});
}
