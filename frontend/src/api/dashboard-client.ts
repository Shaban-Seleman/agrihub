export async function downloadDashboardExport(path: string) {
  const response = await fetch(path, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Export failed with status ${response.status}`);
  }

  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition') ?? '';
  const filenameMatch = disposition.match(/filename=\"?([^"]+)\"?/i);
  const filename = filenameMatch?.[1] ?? 'export.csv';
  return { blob, filename };
}
