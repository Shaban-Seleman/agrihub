import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SamiAgriHub',
  description: 'Inclusive agricultural transformation platform for Tanzania.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
