import type { PropsWithChildren } from 'react';
import Link from 'next/link';

export function PublicShell({ children, locale }: PropsWithChildren<{ locale: string }>) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fbf8ef_0%,#f2e7c9_100%)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-leaf">
          SamiAgriHub
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href={`/${locale}/login`} className="rounded-full px-3 py-2 hover:bg-white/70">
            Ingia
          </Link>
          <Link href={`/${locale}/register`} className="rounded-full bg-leaf px-4 py-2 font-semibold text-white">
            Jisajili
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">{children}</main>
    </div>
  );
}
