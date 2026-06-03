'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, getInitials, getGradient } from '@/lib/utils';
import { COMPANIES, LEADS } from '@/data';
import { Plus, Search, Building2, Globe, Phone, Mail, MapPin, Users, DollarSign } from 'lucide-react';

export default function CompaniesPage() {
  const [search, setSearch] = React.useState('');

  const filtered = COMPANIES.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <div className="page-header">
          <div>
            <h1 className="page-title">Companies</h1>
            <p className="page-subtitle">{filtered.length} companies in your portfolio</p>
          </div>
          <Button><Plus className="h-4 w-4" /> Add Company</Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((company) => {
            const companyDeals = LEADS.filter(l => l.companyName === company.name);
            const activeDeals = companyDeals.filter(l => !['Won', 'Lost'].includes(l.stage));
            return (
              <Card key={company.id} className="card-hover p-5">
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
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
