'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, getInitials, getGradient } from '@/lib/utils';
import { TASKS, USERS } from '@/data';
import { TaskStatus, TaskPriority } from '@/types';
import { Plus, CheckSquare, Clock, AlertTriangle, Calendar, MoreHorizontal, Filter } from 'lucide-react';

const COLUMNS: { status: TaskStatus; label: string; icon: React.ElementType; color: string }[] = [
  { status: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'text-destructive' },
  { status: 'pending', label: 'To Do', icon: Clock, color: 'text-muted-foreground' },
  { status: 'in-progress', label: 'In Progress', icon: CheckSquare, color: 'text-primary' },
  { status: 'completed', label: 'Done', icon: CheckSquare, color: 'text-success' },
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: 'bg-destructive/10 text-destructive border-destructive/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  medium: 'bg-info/10 text-info border-info/20',
  low: 'bg-muted text-muted-foreground border-border',
};

export default function TasksPage() {
  const [filterPriority, setFilterPriority] = React.useState<TaskPriority | 'all'>('all');

  const filteredTasks = TASKS.filter(t => filterPriority === 'all' || t.priority === filterPriority);

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <div className="page-header">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-subtitle">
              {TASKS.filter(t => t.status !== 'completed').length} active tasks •{' '}
              {TASKS.filter(t => t.status === 'overdue').length} overdue
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')} className="select w-auto">
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button><Plus className="h-4 w-4" /> New Task</Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Overdue', value: TASKS.filter(t => t.status === 'overdue').length, color: 'text-destructive', bg: 'bg-destructive/10' },
            { label: 'To Do', value: TASKS.filter(t => t.status === 'pending').length, color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'In Progress', value: TASKS.filter(t => t.status === 'in-progress').length, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Done', value: TASKS.filter(t => t.status === 'completed').length, color: 'text-success', bg: 'bg-success/10' },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-4">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color} mt-1`}>{kpi.value}</p>
            </Card>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {COLUMNS.map((col) => {
            const columnTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div key={col.status} className="kanban-column min-w-[280px] rounded-xl border border-border p-2 bg-muted/30">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <col.icon className={`h-4 w-4 ${col.color}`} />
                    <span className="text-sm font-bold text-foreground">{col.label}</span>
                    <span className="flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {columnTasks.map((task) => {
                    const assignee = USERS.find(u => u.id === task.assignedTo);
                    return (
                      <Card key={task.id} className="p-4 hover:shadow-hover transition-all duration-150">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <Badge className={`text-[10px] border ${PRIORITY_COLORS[task.priority]}`}>
                              {task.priority}
                            </Badge>
                            <Button variant="ghost" size="icon-sm" className="-m-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{task.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{task.leadName}</p>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            {assignee && (
                              <div className="flex items-center gap-1">
                                <div className={`w-6 h-6 rounded-full bg-gradient-to-br text-white text-[9px] font-bold flex items-center justify-center ${getGradient(assignee.id)}`}>
                                  {getInitials(assignee.name)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
