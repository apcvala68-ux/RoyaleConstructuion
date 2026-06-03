'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PIPELINE_STAGES, PROJECT_TYPES, LEAD_SOURCES } from '@/types';
import { Settings, Palette, Bell, Shield, Database, Save, Plus, GripVertical, Trash2, Pencil } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'general' | 'pipeline' | 'sources' | 'types' | 'users'>('pipeline');

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your CRM configuration</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Sidebar */}
          <div className="lg:w-56 shrink-0">
            <nav className="space-y-1">
              {[
                { id: 'general' as const, label: 'General', icon: Settings },
                { id: 'pipeline' as const, label: 'Pipeline Stages', icon: Palette },
                { id: 'sources' as const, label: 'Lead Sources', icon: Database },
                { id: 'types' as const, label: 'Project Types', icon: Database },
                { id: 'users' as const, label: 'Users & Roles', icon: Shield },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === 'pipeline' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Pipeline Stages</CardTitle>
                  <Button size="sm"><Plus className="h-4 w-4" /> Add Stage</Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Drag to reorder. These stages appear in your Pipeline Kanban board.</p>
                  <div className="space-y-2">
                    {PIPELINE_STAGES.map((stage, i) => (
                      <div key={stage} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--deal-${stage.toLowerCase().replace(/\s+/g, '')})` }} />
                        <span className="text-sm font-medium flex-1">{stage}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {['Won', 'Lost'].includes(stage) ? 'Terminal' : 'Active'}
                        </Badge>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon-sm"><Pencil className="h-3.5 w-3.5" /></Button>
                          {!['Won', 'Lost', 'New Lead'].includes(stage) && (
                            <Button variant="ghost" size="icon-sm"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'sources' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Lead Sources</CardTitle>
                  <Button size="sm"><Plus className="h-4 w-4" /> Add Source</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {LEAD_SOURCES.map((source) => (
                      <div key={source} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                        <span className="text-sm font-medium flex-1">{source}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon-sm"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon-sm"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'types' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Types</CardTitle>
                  <Button size="sm"><Plus className="h-4 w-4" /> Add Type</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {PROJECT_TYPES.map((type) => (
                      <div key={type} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                        <span className="text-sm font-medium flex-1">{type}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon-sm"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon-sm"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'general' && (
              <Card>
                <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="label">Company Name</label>
                    <input type="text" defaultValue="Royale Construction" className="input mt-2" />
                  </div>
                  <div>
                    <label className="label">Default Currency</label>
                    <select defaultValue="USD" className="select mt-2">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Fiscal Year Start</label>
                    <select defaultValue="jan" className="select mt-2">
                      <option value="jan">January</option>
                      <option value="apr">April</option>
                      <option value="jul">July</option>
                      <option value="oct">October</option>
                    </select>
                  </div>
                  <Button><Save className="h-4 w-4" /> Save Changes</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Team Members</h3>
                  <Button size="sm"><Plus className="h-4 w-4" /> Invite User</Button>
                </div>
                <Card>
                  <CardContent className="p-0">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Last Active</th>
                          <th className="w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'John Sterling', email: 'john@royaleconstruction.com', role: 'admin', status: 'active', lastActive: 'Just now' },
                          { name: 'Sarah Chen', email: 'sarah@royaleconstruction.com', role: 'sales', status: 'active', lastActive: '1 hour ago' },
                          { name: 'Mike Rodriguez', email: 'mike@royaleconstruction.com', role: 'estimator', status: 'active', lastActive: '3 hours ago' },
                          { name: 'Emily Watson', email: 'emily@royaleconstruction.com', role: 'manager', status: 'active', lastActive: '1 day ago' },
                          { name: 'David Kim', email: 'david@royaleconstruction.com', role: 'sales', status: 'active', lastActive: '2 days ago' },
                        ].map((user) => (
                          <tr key={user.email}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td><Badge variant="outline" className="capitalize">{user.role}</Badge></td>
                            <td><Badge variant="success" className="text-[10px]">Active</Badge></td>
                            <td className="text-sm text-muted-foreground">{user.lastActive}</td>
                            <td>
                              <Button variant="ghost" size="icon-sm"><Pencil className="h-4 w-4" /></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Role Permissions</CardTitle></CardHeader>
                  <CardContent>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Permission</th>
                          <th className="text-center">Admin</th>
                          <th className="text-center">Manager</th>
                          <th className="text-center">Sales</th>
                          <th className="text-center">Estimator</th>
                          <th className="text-center">Viewer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { perm: 'View Pipeline', admin: true, manager: true, sales: true, estimator: true, viewer: true },
                          { perm: 'Edit Leads', admin: true, manager: true, sales: true, estimator: false, viewer: false },
                          { perm: 'Delete Leads', admin: true, manager: false, sales: false, estimator: false, viewer: false },
                          { perm: 'Manage Users', admin: true, manager: false, sales: false, estimator: false, viewer: false },
                          { perm: 'View Reports', admin: true, manager: true, sales: true, estimator: true, viewer: true },
                          { perm: 'Export Data', admin: true, manager: true, sales: false, estimator: false, viewer: false },
                        ].map((row) => (
                          <tr key={row.perm}>
                            <td className="font-medium">{row.perm}</td>
                            {['admin', 'manager', 'sales', 'estimator', 'viewer'].map((role) => (
                              <td key={role} className="text-center">
                                {row[role as keyof typeof row] ? (
                                  <span className="text-success">✓</span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
