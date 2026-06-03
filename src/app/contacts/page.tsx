'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/ui/toast';
import { useAppStore } from '@/stores/app';
import { formatCurrency, getInitials, getGradient } from '@/lib/utils';
import { COMPANIES } from '@/data';
import { Plus, Search, Phone, Mail, Building2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function ContactsPage() {
  const contacts = useAppStore((s) => s.contacts);
  const addContact = useAppStore((s) => s.addContact);
  const [search, setSearch] = React.useState('');
  const [sortField, setSortField] = React.useState<'name' | 'company'>('name');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', company: '', role: '' });

  const handleSort = (field: 'name' | 'company') => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-primary" /> : <ArrowDown className="h-3.5 w-3.5 text-primary" />;
  };

  const filtered = contacts
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addContact({ name: form.name, email: form.email, phone: form.phone, company: form.company, role: form.role });
    setForm({ name: '', email: '', phone: '', company: '', role: '' });
    setShowModal(false);
    toast('Contact added');
  };

  const inputClass = "w-full h-10 px-3 text-sm rounded-xl border border-border bg-muted text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all";

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <div className="page-header">
          <div>
            <h1 className="page-title">Contacts</h1>
            <p className="page-subtitle">{filtered.length} contacts across {COMPANIES.length} companies</p>
          </div>
          <Button onClick={() => { setForm({ name: '', email: '', phone: '', company: '', role: '' }); setShowModal(true); }}><Plus className="h-4 w-4" /> Add Contact</Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((contact) => {
            const company = COMPANIES.find(c => c.name === contact.company);
            return (
              <Card key={contact.id} className="card-hover p-5">
                <div className="flex items-start gap-3">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br text-white text-sm font-bold shrink-0 ${getGradient(contact.id)}`}>
                    {getInitials(contact.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">{contact.company}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {contact.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> {contact.email}
                  </div>
                </div>
                {company && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Total Deal Value</span>
                      <span className="font-semibold text-foreground">{formatCurrency(company.totalValue)}</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Add Contact Modal */}
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Contact">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
              <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} className={inputClass} placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} className={inputClass} placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Company</label>
              <input value={form.company} onChange={(e) => setForm(p => ({ ...p, company: e.target.value }))} className={inputClass} placeholder="Company name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
              <input value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))} className={inputClass} placeholder="e.g. Project Manager" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Button onClick={handleAdd}>Add Contact</Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
