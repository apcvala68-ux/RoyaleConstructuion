export function downloadCsv(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        const str = val === null || val === undefined ? '' : String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function leadsToCsv(leads: any[]) {
  return leads.map((l) => ({
    ID: l.id,
    Company: l.companyName,
    Contact: l.contactName,
    Email: l.contactEmail,
    Phone: l.contactPhone,
    ProjectType: l.projectType,
    Stage: l.stage,
    Source: l.source,
    Value: l.estimatedValue,
    Location: l.location,
    Probability: l.probability + '%',
    AssignedTo: l.assignedTo,
    CreatedAt: l.createdAt,
    Tags: (l.tags || []).join('; '),
    Notes: l.notes || '',
  }));
}

export function contactsToCsv(contacts: any[]) {
  return contacts.map((c) => ({
    ID: c.id,
    Name: c.name,
    Email: c.email,
    Phone: c.phone,
    Company: c.company,
    Role: c.role,
    CreatedAt: c.createdAt,
  }));
}

export function companiesToCsv(companies: any[]) {
  return companies.map((c) => ({
    ID: c.id,
    Name: c.name,
    Industry: c.industry,
    Website: c.website,
    Phone: c.phone,
    Email: c.email,
    Address: c.address,
    Contacts: c.contactCount,
    Deals: c.dealCount,
    TotalValue: c.totalValue,
    CreatedAt: c.createdAt,
  }));
}
