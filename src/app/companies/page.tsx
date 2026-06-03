'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/ui/toast';
import { useAppStore } from '@/stores/app';
import { formatCurrency, getInitials, getGradient } from '@/lib/utils';
import { Plus, Search, Building2, Globe, Phone, Mail, MapPin, Users, DollarSign } from 'lucide-react';

export default function CompaniesPage() {
  const companies = useAppStore((s) => s.companies);
  const addCompany = useAppStore((s) => s.addCompany);
  const leads = useAppStore((s) => s.leads);
  const [search, setSearch] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', industry: '', website: '', phone: '', email: '', address: '' });

  const filtered = companies.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addCompany({
      name: form.name, industry: form.industry, website: form.website,
      phone: form.phone, email: form.email, address: form.address,
      contactCount: 0, dealCount: 0, totalValue: 0,
    });
    setForm({ name: '', industry: '', website: '', phone: '', email: '', address: '' });
    setShowModal(false);
    toast('Company added');
  };

  const inputClass = "w-full h-10 px-3 text-sm rounded-xl border border-border bg-muted text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all";

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <div className="page-header">
          <div>
            <h1 className="page-title">Companies</h1>
            <p className="page-subtitle">{filtered.length} companies in your portfolio</p>
          </div>
          <Button onClick={() => { setForm({ name: '', industry: '', website: '', phone: '', email: '', address: '' }); setShowModal(true); }}><Plus className="h-4 w-4" /> Add Company</Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((company) => {
            const companyDeals = leads.filter(l => l.companyName === company.name);
            const activeDeals = companyDeals.filter(l => !['Won', 'Lost'].includes(l.stage));
            return (
              <Link key={company.id} href={`/companies/${company.id}`} className="block">
              <Card className="card-hover p-5">
                <div className="flex items-start gap-3">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br text-white text-sm font-bold shrink-0 ${getGradient(company.id)}`}>
                    {getInitials(company.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{company.name}</p>
                    <Badge variant="outline" className="text-[10px] mt-1">{company.industry}</Badge>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" /> {company.website}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {company.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> {company.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {company.address}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{company.contactCount}</p>
                      <p className="text-[11px] text-muted-foreground">Contacts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{activeDeals.length}</p>
                      <p className="text-[11px] text-muted-foreground">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-success">{formatCurrency(company.totalValue)}</p>
                      <p className="text-[11px] text-muted-foreground">Value</p>
                    </div>
                  </div>
                </div>
              </Card>
              </Link>
            );
          })}
        </div>

        {/* Add Company Modal */}
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Company">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company Name *</label>
              <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Company name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Industry</label>
              <input value={form.industry} onChange={(e) => setForm(p => ({ ...p, industry: e.target.value }))} className={inputClass} placeholder="e.g. Commercial, Residential" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Website</label>
              <input value={form.website} onChange={(e) => setForm(p => ({ ...p, website: e.target.value }))} className={inputClass} placeholder="https://example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} className={inputClass} placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} className={inputClass} placeholder="info@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
              <input value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} className={inputClass} placeholder="City, State" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Button onClick={handleAdd}>Add Company</Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
