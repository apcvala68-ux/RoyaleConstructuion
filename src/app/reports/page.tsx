'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatCurrencyFull } from '@/lib/utils';
import { useAppStore } from '@/stores/app';
import { PIPELINE_STAGES } from '@/types';
import {
  BarChart3, TrendingUp, Download, Calendar,
  DollarSign, Target, Users, Building2, Award, AlertTriangle,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';

const WIN_LOSS_DATA = [
  { month: 'Jan', won: 2, lost: 3 },
  { month: 'Feb', won: 3, lost: 2 },
  { month: 'Mar', won: 1, lost: 4 },
  { month: 'Apr', won: 4, lost: 1 },
  { month: 'May', won: 2, lost: 2 },
  { month: 'Jun', won: 3, lost: 1 },
];

const REVENUE_BY_TYPE = [
  { type: 'Commercial', value: 73000000, color: '#2563EB' },
  { type: 'Residential', value: 64000000, color: '#059669' },
  { type: 'Infrastructure', value: 103500000, color: '#F59E0B' },
  { type: 'Industrial', value: 32000000, color: '#8B5CF6' },
  { type: 'Renovation', value: 27800000, color: '#EC4899' },
];

const FORECAST_DATA = [
  { quarter: 'Q1', actual: 8200, forecast: 8500 },
  { quarter: 'Q2', actual: 9800, forecast: 10200 },
  { quarter: 'Q3', actual: 0, forecast: 12400 },
  { quarter: 'Q4', actual: 0, forecast: 15600 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'winloss' | 'forecast'>('overview');
  const storeLeads = useAppStore((s) => s.leads);

  const wonLeads = storeLeads.filter(l => l.stage === 'Won');
  const lostLeads = storeLeads.filter(l => l.stage === 'Lost');
  const activeDeals = storeLeads.filter(l => !['Won', 'Lost'].includes(l.stage));
  const totalPipelineValue = activeDeals.reduce((s, l) => s + l.estimatedValue, 0);
  const closedDeals = storeLeads.filter(l => ['Won', 'Lost'].includes(l.stage));
  const wonDeals = storeLeads.filter(l => l.stage === 'Won');
  const winRate = closedDeals.length > 0 ? Math.round((wonDeals.length / closedDeals.length) * 100) : 0;

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <div className="page-header">
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">Business intelligence and performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Calendar className="h-4 w-4" /> This Quarter</Button>
            <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export CSV</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border -mb-px">
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'winloss' as const, label: 'Win/Loss' },
            { id: 'forecast' as const, label: 'Forecast' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Win Rate', value: `${winRate}%`, change: '+5%', icon: Award, color: 'text-success' },
                { label: 'Total Revenue', value: formatCurrency(wonLeads.reduce((s, l) => s + l.estimatedValue, 0)), change: '+12%', icon: DollarSign, color: 'text-primary' },
                { label: 'Active Deals', value: String(activeDeals.length), change: `${activeDeals.length} in pipeline`, icon: Target, color: 'text-info' },
                { label: 'Lost Deals', value: String(lostLeads.length), change: 'Review pricing', icon: AlertTriangle, color: 'text-destructive' },
              ].map((kpi) => (
                <Card key={kpi.label} className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className={`text-2xl font-bold ${kpi.color} mt-1`}>{kpi.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
                    </div>
                    <div className="kpi-icon bg-muted">
                      <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle>Win/Loss Trend</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={WIN_LOSS_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                        <Bar dataKey="won" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar dataKey="lost" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Revenue by Project Type</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={REVENUE_BY_TYPE} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                          {REVENUE_BY_TYPE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => formatCurrency(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {REVENUE_BY_TYPE.map((r) => (
                      <div key={r.type} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="text-muted-foreground">{r.type}</span>
                        <span className="font-semibold ml-auto">{formatCurrency(r.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Deals Table */}
            <Card>
              <CardHeader><CardTitle>Top Deals by Value</CardTitle></CardHeader>
              <CardContent>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Project Type</th>
                      <th>Stage</th>
                      <th className="text-right">Value</th>
                      <th className="text-right">Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...storeLeads].sort((a, b) => b.estimatedValue - a.estimatedValue).slice(0, 8).map((lead) => (
                      <tr key={lead.id}>
                        <td className="font-medium">{lead.companyName}</td>
                        <td><Badge variant="outline" className="text-[10px]">{lead.projectType}</Badge></td>
                        <td><Badge className={`text-[10px] ${getStageBadgeClass(lead.stage)}`}>{lead.stage}</Badge></td>
                        <td className="text-right font-semibold">{formatCurrency(lead.estimatedValue)}</td>
                        <td className="text-right">{lead.probability}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Revenue Forecast</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={FORECAST_DATA}>
                      <defs>
                        <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [`$${v.toLocaleString()}K`, '']} />
                      <Area type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2} fill="#2563EB" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" fill="url(#forecastGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-5">
                <p className="text-sm text-muted-foreground">Projected Q3 Revenue</p>
                <p className="text-3xl font-bold text-primary mt-1">$12.4M</p>
                <p className="text-xs text-success mt-2">Based on 61 deals × weighted probability</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-muted-foreground">Weighted Pipeline</p>
                <p className="text-3xl font-bold text-accent mt-1">$18.7M</p>
                <p className="text-xs text-muted-foreground mt-2">Total pipeline × avg probability</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-muted-foreground">Best Case Scenario</p>
                <p className="text-3xl font-bold text-success mt-1">$45.2M</p>
                <p className="text-xs text-muted-foreground mt-2">If all active deals close at 100%</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function getStageBadgeClass(stage: string): string {
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
