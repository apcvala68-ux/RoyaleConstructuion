'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, timeAgo, getInitials, getGradient, getStageBadgeClass, getActivityColor } from '@/lib/utils';
import {
  LEADS, ACTIVITIES, TASKS,
  getTotalPipelineValue, getWinRate, getAverageDealValue,
} from '@/data';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Target,
  BarChart3, Clock, ArrowRight, Phone, Mail, MapPin,
  FileText, CheckSquare, Calendar, Plus,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 2400, target: 3000 },
  { month: 'Feb', revenue: 3200, target: 3200 },
  { month: 'Mar', revenue: 2800, target: 3400 },
  { month: 'Apr', revenue: 4100, target: 3600 },
  { month: 'May', revenue: 3800, target: 3800 },
  { month: 'Jun', revenue: 5200, target: 4000 },
];

const PIPELINE_CHART = [
  { stage: 'New', count: 3, value: 24700000 },
  { stage: 'Contact', count: 2, value: 43800000 },
  { stage: 'Visit', count: 2, value: 46500000 },
  { stage: 'Estimate', count: 2, value: 87000000 },
  { stage: 'Bid', count: 2, value: 50000000 },
  { stage: 'Negotiate', count: 1, value: 18500000 },
];

const SOURCE_DATA = [
  { name: 'Referral', value: 4, color: '#2563EB' },
  { name: 'Direct', value: 3, color: '#059669' },
  { name: 'Website', value: 2, color: '#F59E0B' },
  { name: 'Google Ads', value: 1, color: '#8B5CF6' },
  { name: 'Partner', value: 2, color: '#EC4899' },
  { name: 'Event', value: 1, color: '#0EA5E9' },
];

export default function DashboardPage() {
  const router = useRouter();
  const totalPipeline = getTotalPipelineValue();
  const winRate = getWinRate();
  const avgDeal = getAverageDealValue();
  const activeTasks = TASKS.filter(t => t.status !== 'completed').length;

  const kpis = [
    {
      label: 'Pipeline Value',
      value: formatCurrency(totalPipeline),
      change: 12.5,
      changeLabel: 'vs last month',
      icon: DollarSign,
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      accentColor: 'border-l-primary',
      href: '/pipeline',
    },
    {
      label: 'Win Rate',
      value: `${winRate}%`,
      change: 5.2,
      changeLabel: 'vs last quarter',
      icon: Target,
      gradient: 'from-success/20 to-success/5',
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      accentColor: 'border-l-success',
      href: '/reports',
    },
    {
      label: 'Avg Deal Size',
      value: formatCurrency(avgDeal),
      change: -2.1,
      changeLabel: 'vs last quarter',
      icon: BarChart3,
      gradient: 'from-warning/20 to-warning/5',
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      accentColor: 'border-l-warning',
      href: '/pipeline',
    },
    {
      label: 'Active Tasks',
      value: String(activeTasks),
      change: 0,
      changeLabel: 'pending items',
      icon: CheckSquare,
      gradient: 'from-deal-negotiating/20 to-deal-negotiating/5',
      iconBg: 'bg-deal-negotiating/10',
      iconColor: 'text-deal-negotiating',
      accentColor: 'border-l-deal-negotiating',
      href: '/tasks',
    },
  ];

  const upcomingTasks = TASKS.filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const recentActivities = [...ACTIVITIES]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Users;
      case 'site-visit': return MapPin;
      case 'document': return FileText;
      case 'task': return CheckSquare;
      default: return FileText;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        {/* Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Good morning, John
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening with your pipeline today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/reports')}>
              <Calendar className="h-4 w-4" />
              Last 30 days
            </Button>
            <Button size="sm" onClick={() => router.push('/leads')}>
              <Plus className="h-4 w-4" />
              New Lead
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Link key={kpi.label} href={kpi.href}>
              <Card className={`card-hover p-5 border-l-4 ${kpi.accentColor} cursor-pointer`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">{kpi.value}</p>
                    {kpi.change !== 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {kpi.change > 0 ? (
                          <TrendingUp className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                        )}
                        <span className={`text-xs font-semibold ${kpi.change > 0 ? 'text-success' : 'text-destructive'}`}>
                          {kpi.change > 0 ? '+' : ''}{kpi.change}%
                        </span>
                        <span className="text-xs text-muted-foreground">{kpi.changeLabel}</span>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${kpi.iconBg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Trend */}
          <Card className="lg:col-span-2 card-hover">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}K`, '']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} fill="url(#revenueGrad)" />
                    <Area type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={1} strokeDasharray="5 5" fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lead Sources */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SOURCE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {SOURCE_DATA.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {SOURCE_DATA.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-muted-foreground truncate">{s.name}</span>
                    <span className="font-semibold ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline by Stage */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PIPELINE_CHART} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`} />
                  <YAxis dataKey="stage" type="category" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                  />
                  <Bar dataKey="value" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row: Tasks + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Tasks */}
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push('/tasks')}>
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${
                      task.status === 'overdue' ? 'bg-destructive/10' :
                      task.priority === 'urgent' ? 'bg-warning/10' : 'bg-primary/10'
                    }`}>
                      <CheckSquare className={`h-4 w-4 ${
                        task.status === 'overdue' ? 'text-destructive' :
                        task.priority === 'urgent' ? 'text-warning' : 'text-primary'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.leadName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge
                        variant={task.status === 'overdue' ? 'destructive' : task.priority === 'urgent' ? 'warning' : 'default'}
                        className="text-[10px]"
                      >
                        {task.status === 'overdue' ? 'Overdue' : task.priority}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push('/activity')}>
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-muted-foreground">{activity.userName}</span>
                          <span className="text-[11px] text-muted-foreground">·</span>
                          <span className="text-[11px] text-muted-foreground">{timeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
