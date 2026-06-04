'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/ui/toast';
import { useAppStore } from '@/stores/app';
import { formatCurrency, formatDate, getInitials, getInlineGradient, getStageBadgeClass } from '@/lib/utils';
import { PIPELINE_STAGES, LEAD_SOURCES, PROJECT_TYPES, type PipelineStage } from '@/types';
import { downloadCsv, leadsToCsv } from '@/lib/csv-export';
import {
  Plus, Search, Eye, Pencil, Trash2, ArrowUpDown,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Copy, Check,
  Download,
} from 'lucide-react';

type SortField = 'companyName' | 'estimatedValue' | 'stage' | 'createdAt' | 'source';
type SortDir = 'asc' | 'desc';

function LeadsListPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get('search') || '');
  const [sortField, setSortField] = React.useState<SortField>('createdAt');
  const [sortDir, setSortDir] = React.useState<SortDir>('desc');
  const [filterStage, setFilterStage] = React.useState<PipelineStage | 'all'>('all');
  const [filterSource, setFilterSource] = React.useState<string>('all');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(15);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const LEADS = useAppStore((s) => s.leads);
  const USERS = useAppStore((s) => s.users);
  const deleteLead = useAppStore((s) => s.deleteLead);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const getSourceTagClass = (source: string) => {
    const map: Record<string, string> = {
      'Direct': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20',
      'Google Ads': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20',
      'Referral': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20',
      'Website': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/20',
      'Partner': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/20',
      'Cold Call': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/20',
      'Trade Show': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/20',
      'Social Media': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/15 dark:text-pink-400 dark:border-pink-500/20',
      'Email Campaign': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/20',
      'Architect': 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/20',
      'Insurance': 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/20',
      'Property Manager': 'bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-500/15 dark:text-lime-400 dark:border-lime-500/20',
    };
    return map[source] || 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-muted/20 dark:text-muted-foreground dark:border-border/10';
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-primary" /> : <ArrowDown className="h-3.5 w-3.5 text-primary" />;
  };

  const filtered = LEADS.filter((l) => {
    const matchSearch = !search ||
      l.companyName.toLowerCase().includes(search.toLowerCase()) ||
      l.contactName.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'all' || l.stage === filterStage;
    const matchSource = filterSource === 'all' || l.source === filterSource;
    return matchSearch && matchStage && matchSource;
  }).sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const totalValue = filtered.reduce((s, l) => s + l.estimatedValue, 0);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getAssignedName = (userId: string) => {
    return USERS.find(u => u.id === userId)?.name || 'Unassigned';
  };

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Leads</h1>
            <p className="page-subtitle">{filtered.length} leads • {formatCurrency(totalValue)} total value</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadCsv(leadsToCsv(filtered), `leads-export-${new Date().toISOString().slice(0,10)}.csv`)}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Link href="/leads/new">
              <Button>
                <Plus className="h-4 w-4" />
                New Lead
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Leads', value: LEADS.length, color: 'text-primary' },
            { label: 'New Leads', value: LEADS.filter(l => l.stage === 'New Lead').length, color: 'text-deal-newlead' },
            { label: 'Active Deals', value: LEADS.filter(l => !['Won', 'Lost', 'On Hold'].includes(l.stage)).length, color: 'text-success' },
            { label: 'Critical', value: LEADS.filter(l => l.probability >= 60 && l.stage !== 'Won').length, color: 'text-destructive' },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-4">
              <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color} mt-1`}>{kpi.value}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, company, or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select
              value={filterStage}
              onChange={(e) => { setFilterStage(e.target.value as PipelineStage | 'all'); setPage(1); }}
              className="select w-auto"
            >
              <option value="all">All Stages</option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={filterSource}
              onChange={(e) => { setFilterSource(e.target.value); setPage(1); }}
              className="select w-auto"
            >
              <option value="all">All Sources</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {(search || filterStage !== 'all' || filterSource !== 'all') && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterStage('all'); setFilterSource('all'); setPage(1); }}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden bg-card border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold cursor-pointer select-none" onClick={() => handleSort('companyName')}>
                    <span className="inline-flex items-center gap-1">Lead <SortIcon field="companyName" /></span>
                  </th>
                  <th className="py-4 px-4 font-semibold hidden md:table-cell">Contact</th>
                  <th className="py-4 px-4 font-semibold hidden lg:table-cell">Source</th>
                  <th className="py-4 px-4 font-semibold cursor-pointer select-none hidden sm:table-cell" onClick={() => handleSort('estimatedValue')}>
                    <span className="inline-flex items-center gap-1">Value <SortIcon field="estimatedValue" /></span>
                  </th>
                  <th className="py-4 px-4 font-semibold cursor-pointer select-none hidden md:table-cell" onClick={() => handleSort('stage')}>
                    <span className="inline-flex items-center gap-1">Stage <SortIcon field="stage" /></span>
                  </th>
                  <th className="py-4 px-4 font-semibold hidden lg:table-cell">Assigned</th>
                  <th className="py-4 px-4 font-semibold cursor-pointer select-none hidden xl:table-cell" onClick={() => handleSort('createdAt')}>
                    <span className="inline-flex items-center gap-1">Created <SortIcon field="createdAt" /></span>
                  </th>
                  <th className="py-4 px-4 font-semibold w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-black text-xs shadow-md border border-white/10" style={{ background: getInlineGradient(lead.id) }}>
                          {getInitials(lead.companyName)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <Link href={`/leads/${lead.id}`} className="font-semibold text-sm hover:text-primary transition-colors truncate">
                            {lead.companyName}
                          </Link>
                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-lg border border-border/60 shadow-sm w-fit mt-0.5">
                            {lead.id}
                            <button
                              onClick={() => handleCopyId(lead.id)}
                              className="text-muted-foreground/60 hover:text-foreground transition-colors p-0.5 rounded cursor-pointer shrink-0"
                              title="Copy Lead ID"
                            >
                              {copiedId === lead.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <p className="text-sm font-medium text-foreground">{lead.contactName}</p>
                      <p className="text-xs text-muted-foreground">{lead.contactEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getSourceTagClass(lead.source)}`}>{lead.source}</span>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="text-sm font-bold tabular-nums">{formatCurrency(lead.estimatedValue)}</span>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <Badge className={`text-[11px] px-2 py-0.5 font-semibold ${getStageBadgeClass(lead.stage)}`}>{lead.stage}</Badge>
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground font-medium">{getAssignedName(lead.assignedTo)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap font-medium hidden xl:table-cell">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground shadow-sm transition-all duration-200 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-[18px] w-[18px]" />
                        </Link>
                        <Link
                          href={`/leads/${lead.id}/edit`}
                          className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground shadow-sm transition-all duration-200 cursor-pointer"
                          title="Edit Lead"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(lead.id)}
                          className="w-9 h-9 rounded-full border border-destructive/30 flex items-center justify-center bg-destructive/5 hover:bg-destructive/15 text-destructive hover:text-destructive shadow-sm transition-all duration-200 cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-border/10 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                className="rounded-xl border border-border/20 bg-muted/15 hover:bg-muted/25 px-2.5 py-1 text-[11px] font-semibold transition-colors outline-none cursor-pointer"
              >
                {[10, 15, 25, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
              <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="icon-sm"
                    onClick={() => setPage(pageNum)}
                    className="w-8 h-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="text-muted-foreground">...</span>}
              <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Delete Confirmation */}
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Lead"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this lead? This action cannot be undone. All associated activities and tasks will also be removed.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget) {
                  deleteLead(deleteTarget);
                  setDeleteTarget(null);
                  toast('Lead deleted successfully');
                }
              }}
            >
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={<AppLayout><div className="p-6 text-muted-foreground">Loading...</div></AppLayout>}>
      <LeadsListPage />
    </React.Suspense>
  );
}
