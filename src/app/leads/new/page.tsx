'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { LeadForm } from '@/components/leads/lead-form';

export default function NewLeadPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <LeadForm />
      </div>
    </AppLayout>
  );
}
