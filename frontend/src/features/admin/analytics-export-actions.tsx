'use client';

import { useState } from 'react';
import { downloadDashboardExport } from '@/api/dashboard-client';
import { Button } from '@/components/ui/button';
import { env } from '@/lib/env';

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AnalyticsExportActions() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const runExport = async (path: string, label: string) => {
    try {
      setLoading(label);
      setError(null);
      setSuccess(null);
      const { blob, filename } = await downloadDashboardExport(`${env.apiBaseUrl}${path}`);
      saveBlob(blob, filename);
      setSuccess(`${label} export downloaded`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Unable to export ${label.toLowerCase()}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" disabled={loading !== null} onClick={() => runExport('/api/v1/dashboard/export/production', 'Production')}>
          {loading === 'Production' ? 'Downloading...' : 'Export Production'}
        </Button>
        <Button type="button" variant="secondary" disabled={loading !== null} onClick={() => runExport('/api/v1/dashboard/export/users', 'Users')}>
          {loading === 'Users' ? 'Downloading...' : 'Export Users'}
        </Button>
        <Button type="button" variant="secondary" disabled={loading !== null} onClick={() => runExport('/api/v1/dashboard/export/market', 'Market')}>
          {loading === 'Market' ? 'Downloading...' : 'Export Market'}
        </Button>
      </div>
      {success ? <p className="text-xs text-leaf">{success}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
