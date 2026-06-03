'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, getInitials, getInlineGradient, getStageBadgeClass } from '@/lib/utils';
import { LEADS, USERS } from '@/data';
import { PIPELINE_STAGES, type Lead, type PipelineStage } from '@/types';
import {
  Plus, Search, Filter, MoreHorizontal, MapPin,
  Calendar, DollarSign, Building2, Phone, Mail, ExternalLink,
} from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function DealCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="p-4 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-hover hover:border-primary/20 border-l-[3px] bg-card border-border/40"
        style={{
          borderLeftColor: `var(--deal-${lead.stage.toLowerCase().replace(/\s+/g, '')})`,
        }}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl text-white text-xs font-bold shrink-0 shadow-md border border-white/10" style={{background: getInlineGradient(lead.id)}}>
                {getInitials(lead.companyName)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate leading-tight">{lead.companyName}</p>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{lead.id}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" className="shrink-0 -m-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Project */}
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{lead.projectDescription}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <Badge className="text-[10px] font-medium" variant="outline">{lead.projectType}</Badge>
            {lead.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} className="text-[10px] font-medium" variant="secondary">{tag}</Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2.5 border-t border-border">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-bold text-foreground tabular-nums">{formatCurrency(lead.estimatedValue)}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-md border border-white/10" style={{background: getInlineGradient(lead.assignedTo)}}>
                {getInitials(lead.assignedTo === 'u2' ? 'Sarah Chen' : lead.assignedTo === 'u4' ? 'Emily Watson' : lead.assignedTo === 'u5' ? 'David Kim' : 'Mike Rodriguez')}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function KanbanColumn({ stage, leads }: { stage: PipelineStage; leads: Lead[] }) {
  const totalValue = leads.reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="kanban-column min-w-[300px] max-w-[340px] rounded-xl border border-border p-2.5 bg-muted/30">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-2 py-2 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--deal-${stage.toLowerCase().replace(/\s+/g, '')})` }} />
          <span className="text-sm font-bold text-foreground tracking-tight">{stage}</span>
          <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-primary/15 text-[11px] font-bold text-primary">
            {leads.length}
          </span>
        </div>
        <span className="text-sm font-bold text-muted-foreground tabular-nums">{formatCurrency(totalValue)}</span>
      </div>

      {/* Cards */}
      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px] pt-1">
          {leads.map((lead) => (
            <DealCard key={lead.id} lead={lead} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function PipelinePage() {
  const [leads, setLeads] = React.useState(LEADS);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [filterStage, setFilterStage] = React.useState<PipelineStage | 'all'>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const filteredLeads = leads.filter((l) => {
    const matchSearch = !search || l.companyName.toLowerCase().includes(search.toLowerCase()) || l.contactName.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'all' || l.stage === filterStage;
    return matchSearch && matchStage;
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeLead = leads.find(l => l.id === active.id);
    if (!activeLead) return;

    const overLead = leads.find(l => l.id === over.id);
    if (overLead && overLead.stage !== activeLead.stage) {
      setLeads(prev => prev.map(l =>
        l.id === active.id ? { ...l, stage: overLead.stage } : l
      ));
    }
  };

  const activeLead = leads.find(l => l.id === activeId);

  return (
    <AppLayout>
      <div className="space-y-5 page-enter">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Pipeline</h1>
            <p className="page-subtitle">
              {leads.filter(l => !['Won', 'Lost'].includes(l.stage)).length} active deals &bull;{' '}
              {formatCurrency(leads.filter(l => !['Won', 'Lost'].includes(l.stage)).reduce((s, l) => s + l.estimatedValue, 0))} total value
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Deal
            </Button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
             
            />
          </div>
          <div className="flex gap-1.5 flex-wrap ml-auto">
            {(['all', ...PIPELINE_STAGES.filter(s => !['Won', 'Lost', 'On Hold'].includes(s)).slice(0, 5)] as const).map((stage) => (
              <Button
                key={stage}
                variant={filterStage === stage ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStage(stage)}
                className="rounded-full text-xs"
              >
                {stage === 'all' ? 'All' : stage}
              </Button>
            ))}
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {PIPELINE_STAGES.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                leads={filteredLeads.filter(l => l.stage === stage)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeLead ? (
              <Card className="p-4 shadow-lg rotate-2 opacity-90">
                <p className="text-sm font-bold">{activeLead.companyName}</p>
                <p className="text-xs text-muted-foreground tabular-nums">{formatCurrency(activeLead.estimatedValue)}</p>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </AppLayout>
  );
}
