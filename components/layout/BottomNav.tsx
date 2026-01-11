'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/create', label: 'Create', icon: Plus },
    { href: '/bets', label: 'My Bets', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
      <div className="container flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              {item.href === '/create' ? (
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg -mt-2">
                    <Icon className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full flex flex-col items-center gap-1 h-auto py-2',
                    isActive && 'text-yellow-600'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
