'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app';
import { USERS } from '@/data';
import { PIPELINE_STAGES, PROJECT_TYPES, LEAD_SOURCES } from '@/types';
import type { Lead, PipelineStage, ProjectType, LeadSource } from '@/types';

function generateId(prefix: string): string {
  const n = Math.floor(Math.random() * 900) + 100;
  return `${prefix}-${n}`;
}

interface LeadFormProps {
  lead?: Lead;
}

export function LeadForm({ lead }: LeadFormProps) {
  const router = useRouter();
  const addLead = useAppStore((s) => s.addLead);
  const updateLead = useAppStore((s) => s.updateLead);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const closeDate = form.expectedCloseDate
      ? new Date(form.expectedCloseDate).toISOString()
      : new Date().toISOString();

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

  const inputClass = "w-full h-10 px-3 text-sm rounded-xl border border-border bg-muted text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-6">{lead ? 'Edit Lead' : 'New Lead'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company Name *</label>
            <input
              required
              value={form.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className={inputClass}
              placeholder="e.g. Mitchell Development"
            />
          </div>
          <div>
            <label className={labelClass}>Contact Name *</label>
            <input
              required
              value={form.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              className={inputClass}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className={labelClass}>Contact Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className={inputClass}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className={labelClass}>Contact Phone</label>
            <input
              value={form.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className={inputClass}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className={labelClass}>Project Type</label>
            <select value={form.projectType} onChange={(e) => handleChange('projectType', e.target.value)} className={inputClass}>
              {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Stage</label>
            <select value={form.stage} onChange={(e) => handleChange('stage', e.target.value)} className={inputClass}>
              {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Source</label>
            <select value={form.source} onChange={(e) => handleChange('source', e.target.value)} className={inputClass}>
              {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Assigned To</label>
            <select value={form.assignedTo} onChange={(e) => handleChange('assignedTo', e.target.value)} className={inputClass}>
              {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Estimated Value ($)</label>
            <input
              type="number"
              value={form.estimatedValue}
              onChange={(e) => handleChange('estimatedValue', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Probability (%)</label>
            <input
              type="number"
              min={0} max={100}
              value={form.probability}
              onChange={(e) => handleChange('probability', Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Expected Close Date</label>
            <input
              type="date"
              value={form.expectedCloseDate}
              onChange={(e) => handleChange('expectedCloseDate', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className={inputClass}
              placeholder="City, State"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Project Description</label>
          <textarea
            rows={3}
            value={form.projectDescription}
            onChange={(e) => handleChange('projectDescription', e.target.value)}
            className={`${inputClass} h-auto py-2 resize-none`}
            placeholder="Brief description of the project..."
          />
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className={`${inputClass} h-auto py-2 resize-none`}
            placeholder="Internal notes..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit">{lead ? 'Save Changes' : 'Create Lead'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
