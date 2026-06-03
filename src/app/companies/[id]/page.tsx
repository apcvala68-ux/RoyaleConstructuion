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
import { formatCurrency, getInitials, getGradient, formatDate } from '@/lib/utils';
import { ArrowLeft, Globe, Phone, Mail, MapPin, Users, DollarSign, Pencil, Trash2, Building2 } from 'lucide-react';

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const companies = useAppStore((s) => s.companies);
  const leads = useAppStore((s) => s.leads);
  const contacts = useAppStore((s) => s.contacts);
  const company = companies.find((c) => c.id === id);
  const [showDelete, setShowDelete] = React.useState(false);

  if (!company) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-bold">Company not found</h2>
            <Link href="/companies"><Button className="mt-4">Back to Companies</Button></Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const companyLeads = leads.filter((l) => l.companyName === company.name);
  const companyContacts = contacts.filter((c) => c.company === company.name);

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <Link href="/companies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Companies
        </Link>

        <div className="card overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-accent" />
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br text-white text-xl font-bold shrink-0 ${getGradient(company.id)}`}>
                {getInitials(company.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
                  <Badge variant="outline" className="text-xs w-fit">{company.industry}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {company.website}</span>
                  <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {company.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {company.email}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {company.address}</span>
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Contacts', value: company.contactCount, icon: Users, color: 'text-primary' },
            { label: 'Active Deals', value: companyLeads.filter(l => !['Won', 'Lost'].includes(l.stage)).length, icon: Building2, color: 'text-success' },
            { label: 'Total Value', value: formatCurrency(company.totalValue), icon: DollarSign, color: 'text-warning' },
            { label: 'Leads', value: companyLeads.length, icon: DollarSign, color: 'text-deal-negotiating' },
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="kpi-icon bg-muted"><stat.icon className={`h-4 w-4 ${stat.color}`} /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Related Leads ({companyLeads.length})</CardTitle></CardHeader>
            <CardContent>
              {companyLeads.length > 0 ? (
                <div className="space-y-2">
                  {companyLeads.map((lead) => (
                    <Link key={lead.id} href={`/leads/${lead.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{lead.projectType} - {formatCurrency(lead.estimatedValue)}</p>
                        <p className="text-xs text-muted-foreground">{lead.stage} &bull; {lead.location}</p>
                      </div>
                      <Badge className={`text-[10px] ${lead.stage === 'Won' ? 'bg-success/10 text-success' : lead.stage === 'Lost' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>{lead.stage}</Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8 text-sm">No leads for this company.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contacts ({companyContacts.length})</CardTitle></CardHeader>
            <CardContent>
              {companyContacts.length > 0 ? (
                <div className="space-y-2">
                  {companyContacts.map((contact) => (
                    <Link key={contact.id} href={`/contacts/${contact.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br text-white text-[10px] font-bold flex items-center justify-center ${getGradient(contact.id)}`}>
                        {getInitials(contact.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.role} &bull; {contact.email}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8 text-sm">No contacts for this company.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Company">
          <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete <strong className="text-foreground">{company.name}</strong>? This cannot be undone.</p>
          <div className="flex items-center gap-3">
            <Button variant="destructive" onClick={() => { setShowDelete(false); toast('Company deleted'); router.push('/companies'); }}>Delete</Button>
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
