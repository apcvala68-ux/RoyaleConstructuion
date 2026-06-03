'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, User, GitMerge, FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app';
import { PIPELINE_STAGES, PROJECT_TYPES, LEAD_SOURCES } from '@/types';
import type { Lead, PipelineStage, ProjectType, LeadSource } from '@/types';

function generateId(prefix: string): string {
  const n = Math.floor(Math.random() * 900) + 100;
  return `${prefix}-${n}`;
}

interface LeadFormProps {
  lead?: Lead;
}

const inputClass = "input w-full pl-3";
const selectClass = "select w-full pl-3";
const labelClass = "label";

export function LeadForm({ lead }: LeadFormProps) {
  const router = useRouter();
  const addLead = useAppStore((s) => s.addLead);
  const updateLead = useAppStore((s) => s.updateLead);
  const USERS = useAppStore((s) => s.users);
  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    companyName: lead?.companyName || '',
    contactName: lead?.contactName || '',
    contactEmail: lead?.contactEmail || '',
    contactPhone: lead?.contactPhone || '',
    projectType: (lead?.projectType || 'Commercial') as ProjectType,
    projectDescription: lead?.projectDescription || '',
    estimatedValue: lead?.estimatedValue ?? 1000000,
    stage: (lead?.stage || 'New Lead') as PipelineStage,
    source: (lead?.source || 'Direct') as LeadSource,
    assignedTo: lead?.assignedTo || USERS[0]?.id || 'u1',
    location: lead?.location || '',
    probability: lead?.probability ?? 10,
    expectedCloseDate: lead?.expectedCloseDate ? lead.expectedCloseDate.split('T')[0] : '',
    notes: lead?.notes || '',
    tags: lead?.tags || [],
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const closeDate = form.expectedCloseDate
      ? new Date(form.expectedCloseDate).toISOString()
      : new Date().toISOString();

    await new Promise((r) => setTimeout(r, 400));

    if (lead) {
      updateLead(lead.id, {
        ...form,
        estimatedValue: Number(form.estimatedValue),
        probability: Number(form.probability),
        expectedCloseDate: closeDate,
      });
    } else {
      addLead({
        ...form,
        estimatedValue: Number(form.estimatedValue),
        probability: Number(form.probability),
        expectedCloseDate: closeDate,
      });
    }
    router.push('/leads');
  };

  return (
    <div className="page-enter space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="page-title">{lead ? 'Edit Lead' : 'New Lead'}</h1>
          <p className="page-subtitle">{lead ? 'Update lead details' : 'Add a new lead to your pipeline'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-5">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-border">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Contact Information</h2>
              <p className="text-xs text-muted-foreground">Who is this lead and how to reach them</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company Name <span className="text-destructive">*</span></label>
              <input required value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} className={inputClass} placeholder="e.g. Mitchell Development" />
            </div>
            <div>
              <label className={labelClass}>Contact Name <span className="text-destructive">*</span></label>
              <input required value={form.contactName} onChange={(e) => handleChange('contactName', e.target.value)} className={inputClass} placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className={inputClass} placeholder="john@example.com" />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input value={form.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} className={inputClass} placeholder="+1 (555) 000-0000" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-border">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 text-accent">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Project Details</h2>
              <p className="text-xs text-muted-foreground">Scope, type, and estimated value</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Project Type</label>
              <select value={form.projectType} onChange={(e) => handleChange('projectType', e.target.value)} className={selectClass}>
                {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Estimated Value ($)</label>
              <input type="number" value={form.estimatedValue} onChange={(e) => handleChange('estimatedValue', Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input value={form.location} onChange={(e) => handleChange('location', e.target.value)} className={inputClass} placeholder="City, State" />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Project Description</label>
            <textarea rows={3} value={form.projectDescription} onChange={(e) => handleChange('projectDescription', e.target.value)} className="input w-full h-auto py-2.5 resize-none pl-3" placeholder="Describe the scope and requirements..." />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-border">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-warning/10 text-warning">
              <GitMerge className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Pipeline &amp; Assignment</h2>
              <p className="text-xs text-muted-foreground">Stage, source, and team assignment</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Stage</label>
              <select value={form.stage} onChange={(e) => handleChange('stage', e.target.value)} className={selectClass}>
                {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Source</label>
              <select value={form.source} onChange={(e) => handleChange('source', e.target.value)} className={selectClass}>
                {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Assigned To</label>
              <select value={form.assignedTo} onChange={(e) => handleChange('assignedTo', e.target.value)} className={selectClass}>
                {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Probability (%)</label>
              <div className="relative">
                <input type="number" min={0} max={100} value={form.probability} onChange={(e) => handleChange('probability', Number(e.target.value))} className="input w-full pr-8 pl-3" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">%</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Expected Close Date</label>
            <input type="date" value={form.expectedCloseDate} onChange={(e) => handleChange('expectedCloseDate', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-border">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-info/10 text-info">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Notes</h2>
              <p className="text-xs text-muted-foreground">Internal notes and remarks</p>
            </div>
          </div>
          <textarea rows={3} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} className="input w-full h-auto py-2.5 resize-none pl-3" placeholder="Add internal notes about this lead..." />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={loading}>
            <Save className="h-4 w-4" />
            {lead ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </div>
  );
}
