'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Icon } from './primitives';

export function BottomNav({
  locale,
  items
}: {
  locale: string;
  items: Array<{ href: string; label: string; icon: string }>;
}) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line/20 bg-cream/90 px-3 pb-5 pt-2 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-end justify-around rounded-[2rem] bg-cream/80">
        {items.slice(0, 5).map((item) => {
          const fullHref = `/${locale}${item.href}`;
          const isActive = pathname === fullHref || pathname?.startsWith(`${fullHref}/`);

          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                'flex min-w-[62px] flex-col items-center gap-1 rounded-full px-3 py-2 font-label text-[10px] font-bold uppercase tracking-[0.14em] text-muted',
                isActive && 'bg-leaf text-sun shadow-float'
              )}
            >
              <Icon name={item.icon} className="text-[20px]" filled={isActive} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
