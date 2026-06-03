'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { timeAgo, getActivityColor } from '@/lib/utils';
import { useAppStore } from '@/stores/app';
import { ActivityType } from '@/types';
import { Search, Filter, Phone, Mail, Users, MapPin, FileText, CheckSquare, Clock } from 'lucide-react';

const ACTIVITY_TYPES: { value: ActivityType | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All', icon: Filter },
  { value: 'call', label: 'Calls', icon: Phone },
  { value: 'email', label: 'Emails', icon: Mail },
  { value: 'meeting', label: 'Meetings', icon: Users },
  { value: 'site-visit', label: 'Site Visits', icon: MapPin },
  { value: 'note', label: 'Notes', icon: FileText },
  { value: 'task', label: 'Tasks', icon: CheckSquare },
];

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

export default function ActivityPage() {
  const [filterType, setFilterType] = React.useState<ActivityType | 'all'>('all');
  const [search, setSearch] = React.useState('');
  const activities = useAppStore((s) => s.activities);

  const filtered = activities
    .filter(a => filterType === 'all' || a.type === filterType)
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.leadName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Group by date
  const grouped = filtered.reduce((acc, activity) => {
    const date = new Date(activity.timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    let key: string;
    if (diffDays === 0) key = 'Today';
    else if (diffDays === 1) key = 'Yesterday';
    else if (diffDays < 7) key = 'This Week';
    else key = 'Earlier';
    if (!acc[key]) acc[key] = [];
    acc[key].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>);

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <div className="page-header">
          <div>
            <h1 className="page-title">Activity Timeline</h1>
            <p className="page-subtitle">{filtered.length} activities across all leads</p>
          </div>
          <Button><Phone className="h-4 w-4" /> Log Activity</Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {ACTIVITY_TYPES.map((type) => (
            <Button
              key={type.value}
              variant={filterType === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type.value)}
              className="shrink-0"
            >
              <type.icon className="h-4 w-4" />
              {type.label}
            </Button>
          ))}
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search activities..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {Object.entries(grouped).map(([dateGroup, activities]) => (
            <div key={dateGroup}>
              <h3 className="text-sm font-bold text-foreground mb-4">{dateGroup}</h3>
              <div className="space-y-0">
                {activities.map((activity, i) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="timeline-item">
                      <div className={`timeline-dot ${getActivityColor(activity.type)}`} />
                      {i < activities.length - 1 && <div className="timeline-line" />}
                      <div className="card p-4">
                        <div className="flex items-start gap-3">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${getActivityColor(activity.type)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                              <span className="text-xs text-muted-foreground shrink-0">{timeAgo(activity.timestamp)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline" className="text-[10px]">{activity.leadName}</Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br text-white text-[7px] font-bold flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--primary), var(--accent))'}}>
                                  {activity.userName.split(' ').map(n => n[0]).join('')}
                                </div>
                                {activity.userName}
                              </div>
                              {activity.duration && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" /> {activity.duration} min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
