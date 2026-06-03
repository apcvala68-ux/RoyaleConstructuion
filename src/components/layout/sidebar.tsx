'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import {
  LayoutDashboard, Kanban, Users, Building2, Contact,
  CheckSquare, Activity, BarChart3, FileText, Settings,
  ChevronLeft, ChevronRight, ExternalLink, LogOut,
  Lock, FileSignature, HardHat, Handshake, Tractor,
  ShoppingCart, DollarSign, Clock, Wallet, GitCompare,
  Shield, CalendarDays, ClipboardCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  locked?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Pipeline', href: '/pipeline', icon: Kanban },
  { label: 'Leads', href: '/leads', icon: Users },
  { label: 'Companies', href: '/companies', icon: Building2 },
  { label: 'Contacts', href: '/contacts', icon: Contact },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare, badge: 3 },
  { label: 'Activity', href: '/activity', icon: Activity },
  { label: 'Reports', href: '/reports', icon: BarChart3 },

  { label: 'Settings', href: '/settings', icon: Settings },
];

const LOCKED_MODULES: NavItem[] = [
  { label: 'Documents', href: '/documents', icon: FileText, locked: true },
  { label: 'Estimates & Proposals', href: '/estimates', icon: FileSignature, locked: true },
  { label: 'Projects', href: '/projects', icon: HardHat, locked: true },
  { label: 'Subcontractors', href: '/subcontractors', icon: Handshake, locked: true },
  { label: 'Equipment & Inventory', href: '/equipment', icon: Tractor, locked: true },
  { label: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart, locked: true },
  { label: 'Invoicing & Payments', href: '/invoicing', icon: DollarSign, locked: true },
  { label: 'Time Tracking', href: '/time-tracking', icon: Clock, locked: true },
  { label: 'Payroll', href: '/payroll', icon: Wallet, locked: true },
  { label: 'Change Orders', href: '/change-orders', icon: GitCompare, locked: true },
  { label: 'Safety & Compliance', href: '/safety', icon: Shield, locked: true },
  { label: 'Scheduling', href: '/scheduling', icon: CalendarDays, locked: true },
  { label: 'Permits & Inspections', href: '/permits', icon: ClipboardCheck, locked: true },
];

const LOCKED_MSG = 'This module is locked. Contact Axiora Digital for full access.';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const renderLink = (item: NavItem) => {
    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
        title={collapsed ? item.label : undefined}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  const renderLocked = (item: NavItem) => (
    <button
      key={item.href}
      onClick={() => toast(LOCKED_MSG, 'info')}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground opacity-50 cursor-pointer w-full transition-all duration-200"
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <span className="flex-1 truncate text-left flex items-center gap-1.5">
          {item.label}
          <Lock className="h-3 w-3 shrink-0 text-muted-foreground/40" />
        </span>
      )}
    </button>
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border flex flex-col transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-border shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground font-bold text-sm shrink-0 shadow-sm">
          RC
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-foreground truncate">Royale Construction</span>
            <span className="text-[11px] text-muted-foreground">CRM Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
        <div className="space-y-0.5 mb-3">
          {NAV_ITEMS.map(renderLink)}
        </div>

        {!collapsed && (
          <div className="px-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Premium</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
          </div>
        )}

        <div className="space-y-0.5">
          {LOCKED_MODULES.map(renderLocked)}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2 space-y-0.5 shrink-0">
        <Link
          href="/portal"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
            'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title={collapsed ? 'Client Portal' : undefined}
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Client Portal</span>}
        </Link>
        <button
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-card border border-border shadow-sm hover:bg-muted transition-colors z-50"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
