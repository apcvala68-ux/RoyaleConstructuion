import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function generateId(prefix: string, num: number): string {
  return `${prefix}-${String(num).padStart(3, '0')}`;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export const GRADIENTS = [
  'from-indigo-500 to-blue-500',
  'from-violet-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-sky-500',
  'from-fuchsia-500 to-pink-500',
  'from-lime-500 to-emerald-500',
] as const;

export function getGradient(id: string): string {
  return GRADIENTS[hashString(id) % GRADIENTS.length];
}

export const INLINE_GRADIENTS = [
  'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
  'linear-gradient(135deg, #f472b6 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
  'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
  'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)',
  'linear-gradient(135deg, #f472b6 0%, #a855f7 100%)',
  'linear-gradient(135deg, #34d399 0%, #059669 100%)',
] as const;

export function getInlineGradient(id: string): string {
  return INLINE_GRADIENTS[hashString(id) % INLINE_GRADIENTS.length];
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    'New Lead': 'var(--deal-newlead)',
    'Contacted': 'var(--deal-contacted)',
    'Site Visit': 'var(--deal-sitevisit)',
    'Estimating': 'var(--deal-estimating)',
    'Bid Submitted': 'var(--deal-bidsubmitted)',
    'Negotiating': 'var(--deal-negotiating)',
    'Won': 'var(--deal-won)',
    'Lost': 'var(--deal-lost)',
    'On Hold': 'var(--deal-onhold)',
  };
  return colors[stage] || 'var(--muted-foreground)';
}

export function getStageBadgeClass(stage: string): string {
  const classes: Record<string, string> = {
    'New Lead': 'bg-deal-newlead/10 text-deal-newlead',
    'Contacted': 'bg-deal-contacted/10 text-deal-contacted',
    'Site Visit': 'bg-deal-sitevisit/10 text-deal-sitevisit',
    'Estimating': 'bg-deal-estimating/10 text-deal-estimating',
    'Bid Submitted': 'bg-deal-bidsubmitted/10 text-deal-bidsubmitted',
    'Negotiating': 'bg-deal-negotiating/10 text-deal-negotiating',
    'Won': 'bg-deal-won/10 text-deal-won',
    'Lost': 'bg-deal-lost/10 text-deal-lost',
    'On Hold': 'bg-deal-onhold/10 text-deal-onhold',
  };
  return classes[stage] || 'bg-muted text-muted-foreground';
}

export function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    call: 'Phone',
    email: 'Mail',
    meeting: 'Users',
    'site-visit': 'MapPin',
    note: 'FileText',
    task: 'CheckSquare',
    document: 'Upload',
  };
  return icons[type] || 'Activity';
}

export function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    call: 'text-success bg-success/10',
    email: 'text-info bg-info/10',
    meeting: 'text-deal-negotiating bg-deal-negotiating/10',
    'site-visit': 'text-deal-sitevisit bg-deal-sitevisit/10',
    note: 'text-muted-foreground bg-muted',
    task: 'text-deal-estimating bg-deal-estimating/10',
    document: 'text-deal-bidsubmitted bg-deal-bidsubmitted/10',
  };
  return colors[type] || 'text-muted-foreground bg-muted';
}
