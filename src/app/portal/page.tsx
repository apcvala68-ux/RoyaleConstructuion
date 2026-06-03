'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency, getInitials, getGradient } from '@/lib/utils';
import { Building2, Phone, Mail, MapPin, FileText, MessageSquare, CheckCircle, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Portal Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm">RC</div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Royale Construction</h1>
              <p className="text-[11px] text-muted-foreground">Client Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Phone className="h-4 w-4" /> Contact Us</Button>
            <Link href="/">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Back to CRM</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome, Mitchell Development Corp</h2>
          <p className="text-sm text-muted-foreground mt-1">Track your projects, review documents, and communicate with our team.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="kpi-icon gradient-primary"><Building2 className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="kpi-icon gradient-accent"><FileText className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="kpi-icon gradient-warning"><MessageSquare className="h-5 w-5 text-warning" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Projects */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Your Projects</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                name: '40-Story Mixed-Use Tower',
                location: 'Midtown Manhattan, NY',
                status: 'Estimating',
                progress: 25,
                phase: 'Pre-Construction',
                nextMilestone: 'Final estimates due June 15',
                value: 45000000,
              },
              {
                name: 'Bronx Affordable Housing',
                location: 'Bronx, NY',
                status: 'Site Visit',
                progress: 15,
                phase: 'Site Assessment',
                nextMilestone: 'Community board review June 20',
                value: 28000000,
              },
            ].map((project) => (
              <Card key={project.name} className="overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {project.location}
                      </p>
                    </div>
                    <Badge className="text-[10px]">{project.status}</Badge>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Phase</span>
                      <span className="font-medium text-foreground">{project.phase}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Next Milestone</span>
                      <span className="font-medium text-foreground">{project.nextMilestone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Contract Value</span>
                      <span className="font-bold text-primary">{formatCurrency(project.value)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Documents</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Project Proposal - Mixed-Use Tower.pdf', date: 'Jun 1, 2026', size: '2.4 MB' },
                { name: 'Site Visit Report - Bronx.pdf', date: 'May 28, 2026', size: '1.8 MB' },
                { name: 'Insurance Certificate.pdf', date: 'May 20, 2026', size: '540 KB' },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.date} • {doc.size}</p>
                  </div>
                  <Button variant="ghost" size="icon-sm"><ExternalLink className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Messages</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { from: 'Sarah Chen', subject: 'Updated proposal for Mixed-Use Tower', time: '2 hours ago', unread: true },
                { from: 'Emily Watson', subject: 'Site visit schedule confirmation', time: '1 day ago', unread: true },
                { from: 'Mike Rodriguez', subject: 'Structural engineering estimates', time: '3 days ago', unread: false },
              ].map((msg) => (
                <div key={msg.subject} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${msg.unread ? 'bg-primary/5' : 'bg-muted/50 hover:bg-muted'}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {msg.from.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{msg.from}</p>
                      <span className="text-[11px] text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                  </div>
                  {msg.unread && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
