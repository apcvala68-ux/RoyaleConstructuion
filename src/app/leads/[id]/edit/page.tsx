'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { LeadForm } from '@/components/leads/lead-form';
import { useAppStore } from '@/stores/app';

export default function EditLeadPage() {
  const { id } = useParams<{ id: string }>();
  const lead = useAppStore((s) => s.leads.find((l) => l.id === id));

  if (!lead) {
    return (
      <AppLayout>
      <div className="p-6">
          <p className="text-muted-foreground">Lead not found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6">
        <LeadForm lead={lead} />
      </div>
    </AppLayout>
  );
}
