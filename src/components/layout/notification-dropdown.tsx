'use client';

import React, { useRef, useEffect } from 'react';
import { Bell, CheckCheck, AlertTriangle, Plus, FileText, Activity } from 'lucide-react';
import { useAppStore } from '@/stores/app';
import { cn } from '@/lib/utils';
import type { AppNotification, NotificationType } from '@/types';
import Link from 'next/link';

const ICON_MAP: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  lead: Plus,
  task: AlertTriangle,
  bid: FileText,
  activity: Activity,
  system: Bell,
};

const COLOR_MAP: Record<NotificationType, string> = {
  lead: 'text-blue-400',
  task: 'text-red-400',
  bid: 'text-purple-400',
  activity: 'text-emerald-400',
  system: 'text-gray-400',
};

function NotificationItem({ notification }: { notification: AppNotification }) {
  const markRead = useAppStore((s) => s.markNotificationRead);
  const Icon = ICON_MAP[notification.type];

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors cursor-pointer',
        !notification.read && 'bg-blue-900/10'
      )}
      onClick={() => markRead(notification.id)}
    >
      <div className={cn('mt-0.5 flex-shrink-0', COLOR_MAP[notification.type])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm', !notification.read ? 'font-medium text-gray-100' : 'text-gray-400')}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{notification.message}</p>
        <p className="text-[10px] text-gray-600 mt-1">
          {new Date(notification.createdAt).toLocaleDateString()}
        </p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
      )}
    </div>
  );

  if (notification.href) {
    return <Link href={notification.href}>{content}</Link>;
  }
  return content;
}

export function NotificationDropdown() {
  const [open, setOpen] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useAppStore((s) => s.notifications);
  const markAllRead = useAppStore((s) => s.markAllNotificationsRead);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[400px] overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800 shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-100">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-[340px]">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
