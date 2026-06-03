'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores/theme';
import { Sun, Moon, Search, Bell, Menu, ChevronDown, X, User, Settings, LogOut } from 'lucide-react';
import { getInitials, getGradient } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchQuery('');
        setMenuOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/50 bg-card/90 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile Menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer mr-1"
        title="Toggle menu"
      >
        <Menu className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Search */}
      <div className="relative flex-1 lg:max-w-sm hidden lg:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search leads, companies..."
          className="input w-full h-9 pl-10 pr-20 text-sm"
        />
        {searchQuery ? (
          <button
            onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/50 text-muted-foreground/60 hover:text-foreground transition-colors"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[9px] font-medium text-muted-foreground/80">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </div>

      {/* Mobile Search */}
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-2.5 hover:bg-muted transition-colors"
        title="Search"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2.5 hover:bg-muted transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2.5 hover:bg-muted transition-colors cursor-pointer">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* User Dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 rounded-lg p-2.5 lg:pr-3 hover:bg-muted transition-colors cursor-pointer"
          >
            <div className={cn('flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br text-white text-xs font-bold ring-1 ring-primary/20', getGradient('u1'))}>
              {getInitials('John Sterling')}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-foreground leading-tight">John Sterling</span>
              <span className="text-[11px] capitalize text-muted-foreground leading-tight">Admin</span>
            </div>
            <ChevronDown className={cn('hidden md:block h-3.5 w-3.5 text-muted-foreground transition-transform', menuOpen && 'rotate-180')} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-border bg-popover shadow-lg z-50">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">John Sterling</p>
                <p className="text-xs text-muted-foreground">john@royaleconstruction.com</p>
                <p className="text-xs capitalize text-muted-foreground mt-0.5">Admin</p>
              </div>
              <div className="p-1">
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>
              <div className="border-t border-border p-1">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
