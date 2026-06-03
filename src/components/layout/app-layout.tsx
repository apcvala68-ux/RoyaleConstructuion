'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn('lg:block', mobileOpen ? 'block' : 'hidden')}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'
        )}
      >
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <main className="p-4 lg:p-6 max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
