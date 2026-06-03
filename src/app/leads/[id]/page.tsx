'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatDateTime, timeAgo, getInitials, getGradient, getStageBadgeClass, getActivityColor } from '@/lib/utils';
import { LEADS, USERS, getActivitiesByLead, getTasksByLead, getBidsByLead } from '@/data';
import { PIPELINE_STAGES, type PipelineStage } from '@/types';
import {
  ArrowLeft, Edit, Pencil, Phone, Mail, MapPin, Calendar,
  DollarSign, Building2, User, Clock, FileText, CheckSquare,
  ExternalLink, Upload, Send, PhoneCall, MessageSquare,
} from 'lucide-react';

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const lead = LEADS.find(l => l.id === id);
  const activities = getActivitiesByLead(id);
  const tasks = getTasksByLead(id);
  const bids = getBidsByLead(id);
  const [activeTab, setActiveTab] = React.useState<'activity' | 'documents' | 'notes' | 'bids' | 'history'>('activity');

  if (!lead) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-bold">Lead not found</h2>
            <Link href="/leads">
              <Button className="mt-4">Back to Leads</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const assignedUser = USERS.find(u => u.id === lead.assignedTo);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return PhoneCall;
      case 'email': return Mail;
      case 'meeting': return Users;
      case 'site-visit': return MapPin;
      case 'document': return FileText;
      case 'task': return CheckSquare;
      default: return FileText;
    }
  };

  const tabs = [
    { id: 'activity' as const, label: 'Activity', count: activities.length },
    { id: 'documents' as const, label: 'Documents', count: 0 },
    { id: 'notes' as const, label: 'Notes', count: 0 },
    { id: 'bids' as const, label: 'Bids', count: bids.length },
    { id: 'history' as const, label: 'History', count: 0 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        {/* Back Button */}
        <Link href="/leads" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>

        {/* Hero Header */}
        <div className="card overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-accent" />
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br text-white text-xl font-bold shrink-0 ${getGradient(lead.id)}`}>
                {getInitials(lead.companyName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl font-bold text-foreground">{lead.companyName}</h1>
                  <Badge className={`text-xs w-fit ${getStageBadgeClass(lead.stage)}`}>{lead.stage}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{lead.id} • {lead.projectType} • {lead.location}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-4 w-4" /> {lead.contactName}</span>
                  <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {lead.contactPhone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {lead.contactEmail}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {lead.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm"><Phone className="h-4 w-4" /> Call</Button>
                <Button variant="outline" size="sm"><Mail className="h-4 w-4" /> Email</Button>
                <Link href={`/leads/${lead.id}/edit`}>
                  <Button size="sm"><Pencil className="h-4 w-4" /> Edit</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Estimated Value', value: formatCurrency(lead.estimatedValue), icon: DollarSign, color: 'text-primary' },
            { label: 'Probability', value: `${lead.probability}%`, icon: Target, color: 'text-success' },
            { label: 'Expected Close', value: formatDate(lead.expectedCloseDate), icon: Calendar, color: 'text-warning' },
            { label: 'Assigned To', value: assignedUser?.name || 'Unassigned', icon: User, color: 'text-deal-negotiating' },
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="kpi-icon bg-muted">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-1 -mb-px overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-muted text-[11px] font-semibold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'activity' && (
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-0">
                      {activities.map((activity, i) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                          <div key={activity.id} className="timeline-item">
                            <div className={`timeline-dot ${getActivityColor(activity.type)}`} />
                            {i < activities.length - 1 && <div className="timeline-line" />}
                            <div className="flex items-start gap-3">
                              <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${getActivityColor(activity.type)}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                                  <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(activity.timestamp)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span>{activity.userName}</span>
                                  {activity.duration && <span>{activity.duration} min</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No activity recorded yet.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'bids' && (
              <Card>
                <CardHeader>
                  <CardTitle>Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  {bids.length > 0 ? (
                    <div className="space-y-4">
                      {bids.map((bid) => (
                        <Card key={bid.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{bid.id}</p>
                              <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(bid.amount)}</p>
                            </div>
                            <Badge variant={bid.status === 'accepted' ? 'success' : bid.status === 'rejected' ? 'destructive' : 'default'}>
                              {bid.status}
                            </Badge>
                          </div>
                          <div className="mt-4 space-y-2">
                            {bid.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{item.description}</span>
                                <span className="font-semibold">{formatCurrency(item.total)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                            <span>Submitted: {bid.submittedDate ? formatDate(bid.submittedDate) : 'Draft'}</span>
                            <span>Valid until: {formatDate(bid.validUntil)}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No bids yet.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'documents' && (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-sm font-medium text-foreground mt-3">Drop files here or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLS, JPG, PNG up to 25MB</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Upload className="h-4 w-4" /> Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notes' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.notes ? (
                    <p className="text-sm text-foreground whitespace-pre-wrap">{lead.notes}</p>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No notes yet.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'history' && (
              <Card>
                <CardHeader>
                  <CardTitle>Change History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">History tracking coming soon.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start"><PhoneCall className="h-4 w-4" /> Log Call</Button>
                <Button variant="outline" className="w-full justify-start"><Mail className="h-4 w-4" /> Send Email</Button>
                <Button variant="outline" className="w-full justify-start"><MapPin className="h-4 w-4" /> Schedule Site Visit</Button>
                <Button variant="outline" className="w-full justify-start"><CheckSquare className="h-4 w-4" /> Create Task</Button>
                <Button variant="outline" className="w-full justify-start"><FileText className="h-4 w-4" /> Add Note</Button>
                <Button variant="outline" className="w-full justify-start"><ExternalLink className="h-4 w-4" /> Share Portal</Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.contactName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.contactPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.companyName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lead.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-6 text-xs">+ Add</Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <CheckSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{task.title}</p>
                          <p className="text-[11px] text-muted-foreground">{formatDate(task.dueDate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Target(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
