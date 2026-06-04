'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Users, Building2, Briefcase, ClipboardCheck, Activity } from 'lucide-react';
import { useAppStore } from '@/stores/app';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  type: 'lead' | 'contact' | 'company' | 'task' | 'activity';
  title: string;
  subtitle: string;
  href: string;
}

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  lead: Briefcase,
  contact: Users,
  company: Building2,
  task: ClipboardCheck,
  activity: Activity,
};

const TYPE_LABEL: Record<string, string> = {
  lead: 'Leads',
  contact: 'Contacts',
  company: 'Companies',
  task: 'Tasks',
  activity: 'Activities',
};

const TYPE_COLOR: Record<string, string> = {
  lead: 'bg-blue-500/20 text-blue-400',
  contact: 'bg-emerald-500/20 text-emerald-400',
  company: 'bg-purple-500/20 text-purple-400',
  task: 'bg-orange-500/20 text-orange-400',
  activity: 'bg-gray-500/20 text-gray-400',
};

export function SearchModal({ externalOpen, onOpenChange }: { externalOpen?: boolean; onOpenChange?: (open: boolean) => void } = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };

  const leads = useAppStore((s) => s.leads);
  const contacts = useAppStore((s) => s.contacts);
  const companies = useAppStore((s) => s.companies);
  const tasks = useAppStore((s) => s.tasks);
  const activities = useAppStore((s) => s.activities);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items: SearchResult[] = [];

    leads.forEach((l) => {
      if (
        l.companyName.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.projectType.toLowerCase().includes(q) ||
        l.stage.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      ) {
        items.push({
          id: l.id,
          type: 'lead',
          title: l.companyName,
          subtitle: `${l.contactName} · ${l.stage} · $${l.estimatedValue.toLocaleString()}`,
          href: `/leads/${l.id}`,
        });
      }
    });

    contacts.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
      ) {
        items.push({
          id: c.id,
          type: 'contact',
          title: c.name,
          subtitle: `${c.role} at ${c.company}`,
          href: `/contacts/${c.id}`,
        });
      }
    });

    companies.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      ) {
        items.push({
          id: c.id,
          type: 'company',
          title: c.name,
          subtitle: `${c.industry} · ${c.contactCount} contacts`,
          href: `/companies/${c.id}`,
        });
      }
    });

    tasks.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.leadName.toLowerCase().includes(q)
      ) {
        items.push({
          id: t.id,
          type: 'task',
          title: t.title,
          subtitle: `${t.status} · ${t.leadName}`,
          href: '/tasks',
        });
      }
    });

    activities.forEach((a) => {
      if (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.leadName.toLowerCase().includes(q)
      ) {
        items.push({
          id: a.id,
          type: 'activity',
          title: a.title,
          subtitle: `${a.leadName} · ${new Date(a.timestamp).toLocaleDateString()}`,
          href: '/activity',
        });
      }
    });

    return items.slice(0, 20);
  }, [query, leads, contacts, companies, tasks, activities]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });
    return groups;
  }, [results]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault();
        handleOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const navigate = (href: string) => {
    handleOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      navigate(results[selectedIdx].href);
    } else if (e.key === 'Escape') {
      handleOpen(false);
    }
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => handleOpen(true)}
        className="relative w-full h-9 pl-10 pr-20 text-sm text-left cursor-pointer flex items-center rounded-lg border border-border bg-muted/50 hover:bg-muted/80 transition-colors"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <span className="text-muted-foreground">Search leads, companies...</span>
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[9px] font-medium text-muted-foreground/80">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {/* Modal overlay — portaled to body to escape header stacking context */}
      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px]" onClick={() => handleOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search everything..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              {query && (
                <button onClick={() => handleOpen(false)} className="p-0.5 rounded hover:bg-muted">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[9px] font-medium text-muted-foreground/80">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-80 overflow-y-auto">
              {query.trim() && results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}

              {Object.entries(grouped).map(([type, items]) => {
                const Icon = TYPE_ICON[type];
                return (
                  <div key={type}>
                    <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
                      {TYPE_LABEL[type]}
                    </div>
                    {items.map((item) => {
                      const globalIdx = results.indexOf(item);
                      return (
                        <button
                          key={`${item.type}-${item.id}`}
                          onClick={() => navigate(item.href)}
                          onMouseEnter={() => setSelectedIdx(globalIdx)}
                          className={cn(
                            'flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors border-l-2',
                            globalIdx === selectedIdx
                              ? 'bg-primary/15 border-l-primary text-foreground'
                              : 'border-l-transparent hover:bg-muted/30'
                          )}
                        >
                          <div className={cn('flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0', TYPE_COLOR[type])}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Footer hint */}
            {query.trim() && results.length > 0 && (
              <div className="px-4 py-2 border-t border-border text-[11px] text-muted-foreground flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-border bg-muted/50 font-mono text-[9px]">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-border bg-muted/50 font-mono text-[9px]">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-border bg-muted/50 font-mono text-[9px]">esc</kbd> close</span>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
