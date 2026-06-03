'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/ui/toast';
import { useAppStore } from '@/stores/app';
import { formatCurrency, getInitials, getGradient } from '@/lib/utils';
import { ArrowLeft, Phone, Mail, Building2, MapPin, User, Trash2 } from 'lucide-react';

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const contacts = useAppStore((s) => s.contacts);
  const companies = useAppStore((s) => s.companies);
  const contact = contacts.find((c) => c.id === id);
  const [showDelete, setShowDelete] = React.useState(false);

  if (!contact) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-bold">Contact not found</h2>
            <Link href="/contacts"><Button className="mt-4">Back to Contacts</Button></Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const company = companies.find((c) => c.name === contact.company);

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <Link href="/contacts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Contacts
        </Link>

        <div className="card overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-accent" />
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br text-white text-xl font-bold shrink-0 ${getGradient(contact.id)}`}>
                {getInitials(contact.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl font-bold text-foreground">{contact.name}</h1>
                  <Badge variant="outline" className="text-xs w-fit">{contact.role}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {contact.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {contact.email}</span>
                  {company && (
                    <Link href={`/companies/${company.id}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Building2 className="h-4 w-4" /> {contact.company}
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contact.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contact.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {company ? (
                  <Link href={`/companies/${company.id}`} className="text-sm hover:text-primary transition-colors">{contact.company}</Link>
                ) : (
                  <span className="text-sm">{contact.company}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{company?.address || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {company && (
            <Card>
              <CardHeader><CardTitle>Company Overview</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Industry</span>
                  <span className="text-sm font-medium">{company.industry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="text-sm font-bold text-primary">{formatCurrency(company.totalValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Deals</span>
                  <span className="text-sm font-medium">{company.dealCount}</span>
                </div>
                <Link href={`/companies/${company.id}`} className="block mt-2">
                  <Button variant="outline" size="sm" className="w-full">View Company</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Contact">
          <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete <strong className="text-foreground">{contact.name}</strong>? This cannot be undone.</p>
          <div className="flex items-center gap-3">
            <Button variant="destructive" onClick={() => { setShowDelete(false); toast('Contact deleted'); router.push('/contacts'); }}>Delete</Button>
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
