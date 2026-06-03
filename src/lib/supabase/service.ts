import { createClient } from './client';
import type { Lead, Contact, Company, Task, Activity, User, Bid } from '@/types';

const supabase = createClient();

function mapLead(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    companyName: row.company_name as string,
    contactName: row.contact_name as string,
    contactEmail: row.contact_email as string,
    contactPhone: row.contact_phone as string,
    projectType: row.project_type as Lead['projectType'],
    projectDescription: row.project_description as string,
    estimatedValue: Number(row.estimated_value),
    stage: row.stage as Lead['stage'],
    source: row.source as Lead['source'],
    assignedTo: row.assigned_to as string,
    location: row.location as string,
    probability: row.probability as number,
    expectedCloseDate: row.expected_close_date as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    tags: row.tags as string[],
    notes: row.notes as string,
  };
}

function toLeadDb(data: Partial<Lead>): Record<string, unknown> {
  const db: Record<string, unknown> = {};
  if (data.companyName !== undefined) db.company_name = data.companyName;
  if (data.contactName !== undefined) db.contact_name = data.contactName;
  if (data.contactEmail !== undefined) db.contact_email = data.contactEmail;
  if (data.contactPhone !== undefined) db.contact_phone = data.contactPhone;
  if (data.projectType !== undefined) db.project_type = data.projectType;
  if (data.projectDescription !== undefined) db.project_description = data.projectDescription;
  if (data.estimatedValue !== undefined) db.estimated_value = Number(data.estimatedValue);
  if (data.stage !== undefined) db.stage = data.stage;
  if (data.source !== undefined) db.source = data.source;
  if (data.assignedTo !== undefined) db.assigned_to = data.assignedTo;
  if (data.location !== undefined) db.location = data.location;
  if (data.probability !== undefined) db.probability = data.probability;
  if (data.expectedCloseDate !== undefined) db.expected_close_date = data.expectedCloseDate;
  if (data.notes !== undefined) db.notes = data.notes;
  if (data.tags !== undefined) db.tags = data.tags;
  return db;
}

function mapContact(row: Record<string, unknown>): Contact {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    company: row.company as string,
    role: row.role as string,
    avatar: row.avatar as string | undefined,
    createdAt: row.created_at as string,
  };
}

function mapCompany(row: Record<string, unknown>): Company {
  return {
    id: row.id as string,
    name: row.name as string,
    industry: row.industry as string,
    website: row.website as string,
    phone: row.phone as string,
    email: row.email as string,
    address: row.address as string,
    contactCount: row.contact_count as number,
    dealCount: row.deal_count as number,
    totalValue: row.total_value as number,
    createdAt: row.created_at as string,
  };
}

function mapTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    leadId: row.lead_id as string,
    leadName: row.lead_name as string,
    title: row.title as string,
    description: row.description as string,
    dueDate: row.due_date as string,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    assignedTo: row.assigned_to as string,
    createdAt: row.created_at as string,
  };
}

function mapActivity(row: Record<string, unknown>): Activity {
  return {
    id: row.id as string,
    leadId: row.lead_id as string,
    leadName: row.lead_name as string,
    type: row.type as Activity['type'],
    title: row.title as string,
    description: row.description as string,
    timestamp: row.timestamp as string,
    userId: row.user_id as string,
    userName: row.user_name as string,
    duration: row.duration as number | undefined,
    metadata: row.metadata as Record<string, unknown> | undefined,
  };
}

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    role: row.role as User['role'],
    status: row.status as User['status'],
    lastActive: row.last_active as string,
  };
}

function mapBid(row: Record<string, unknown>): Bid {
  const rawItems = row.bid_items as Record<string, unknown>[] | undefined;
  const items: Bid['items'] = (rawItems || []).map((item) => ({
    id: item.id as number,
    bidId: item.bid_id as string,
    description: item.description as string,
    quantity: Number(item.quantity),
    unit: item.unit as string,
    unitPrice: Number(item.unit_price),
    total: Number(item.total),
  }));
  return {
    id: row.id as string,
    leadId: row.lead_id as string,
    leadName: row.lead_name as string,
    amount: Number(row.amount),
    status: row.status as Bid['status'],
    submittedDate: row.submitted_date as string,
    validUntil: row.valid_until as string,
    notes: (row.notes as string | undefined),
    createdAt: row.created_at as string,
    items,
  };
}

export const db = {
  async fetchAll() {
    const [leadsRes, contactsRes, companiesRes, tasksRes, activitiesRes, usersRes, bidsRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      supabase.from('companies').select('*').order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('activities').select('*').order('timestamp', { ascending: false }),
      supabase.from('users').select('*').order('name'),
      supabase.from('bids').select('*, bid_items(*)').order('created_at', { ascending: false }),
    ]);

    return {
      leads: (leadsRes.data || []).map(mapLead) as Lead[],
      contacts: (contactsRes.data || []).map(mapContact) as Contact[],
      companies: (companiesRes.data || []).map(mapCompany) as Company[],
      tasks: (tasksRes.data || []).map(mapTask) as Task[],
      activities: (activitiesRes.data || []).map(mapActivity) as Activity[],
      users: (usersRes.data || []).map(mapUser) as User[],
      bids: (bidsRes.data || []).map(mapBid) as Bid[],
    };
  },

  async createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead | null> {
    const dbData = toLeadDb(data as Partial<Lead>);
    const { data: row, error } = await supabase.from('leads').insert(dbData).select('*').single();
    if (error) throw error;
    return row ? mapLead(row) : null;
  },

  async updateLead(id: string, data: Partial<Lead>): Promise<void> {
    const dbData = { ...toLeadDb(data), updated_at: new Date().toISOString() };
    const { error } = await supabase.from('leads').update(dbData).eq('id', id);
    if (error) throw error;
  },

  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
  },

  async updateLeadStage(id: string, stage: Lead['stage']): Promise<void> {
    const { error } = await supabase.from('leads').update({ stage, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },

  async createContact(data: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact | null> {
    const { data: row, error } = await supabase.from('contacts').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      role: data.role,
    }).select('*').single();
    if (error) throw error;
    return row ? mapContact(row) : null;
  },

  async createCompany(data: Omit<Company, 'id' | 'createdAt'>): Promise<Company | null> {
    const { data: row, error } = await supabase.from('companies').insert({
      name: data.name,
      industry: data.industry,
      website: data.website,
      phone: data.phone,
      email: data.email,
      address: data.address,
    }).select('*').single();
    if (error) throw error;
    return row ? mapCompany(row) : null;
  },

  async createTask(data: Omit<Task, 'id' | 'createdAt'>): Promise<Task | null> {
    const { data: row, error } = await supabase.from('tasks').insert({
      lead_id: data.leadId,
      lead_name: data.leadName,
      title: data.title,
      description: data.description,
      due_date: data.dueDate,
      status: data.status,
      priority: data.priority,
      assigned_to: data.assignedTo,
    }).select('*').single();
    if (error) throw error;
    return row ? mapTask(row) : null;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<void> {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.priority !== undefined) dbData.priority = data.priority;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.dueDate !== undefined) dbData.due_date = data.dueDate;
    if (data.assignedTo !== undefined) dbData.assigned_to = data.assignedTo;
    const { error } = await supabase.from('tasks').update(dbData).eq('id', id);
    if (error) throw error;
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },

  async updateTaskStatus(id: string, status: Task['status']): Promise<void> {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
    if (error) throw error;
  },

  async createActivity(data: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity | null> {
    const { data: row, error } = await supabase.from('activities').insert({
      lead_id: data.leadId,
      lead_name: data.leadName,
      type: data.type,
      title: data.title,
      description: data.description,
      user_id: data.userId,
      user_name: data.userName,
      duration: data.duration,
    }).select('*').single();
    if (error) throw error;
    return row ? mapActivity(row) : null;
  },
};
