'use client';

import { create } from 'zustand';
import { db } from '@/lib/supabase/service';
import { toast } from '@/components/ui/toast';
import type { Lead, Contact, Company, Task, Activity, User, Bid } from '@/types';

interface AppState {
  leads: Lead[];
  contacts: Contact[];
  companies: Company[];
  tasks: Task[];
  activities: Activity[];
  users: User[];
  bids: Bid[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  init: () => Promise<void>;

  addLead: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Lead | null>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  updateLeadStage: (id: string, stage: Lead['stage']) => Promise<void>;

  addContact: (data: Omit<Contact, 'id' | 'createdAt'>) => Promise<Contact | null>;
  addCompany: (data: Omit<Company, 'id' | 'createdAt'>) => Promise<Company | null>;

  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => Promise<Task | null>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Task['status']) => Promise<void>;

  addActivity: (data: Omit<Activity, 'id' | 'timestamp'>) => Promise<Activity | null>;
}

export const useAppStore = create<AppState>((set, get) => ({
  leads: [],
  contacts: [],
  companies: [],
  tasks: [],
  activities: [],
  users: [],
  bids: [],
  loading: true,
  error: null,
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });
    try {
      const data = await db.fetchAll();
      set({ ...data, loading: false, initialized: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      set({ error: message, loading: false });
      toast(message, 'error');
    }
  },

  setUsers: (users: User[]) => set({ users }),

  addLead: async (data) => {
    try {
      const lead = await db.createLead(data);
      if (lead) {
        set((s) => ({ leads: [lead, ...s.leads] }));
      }
      return lead;
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create lead', 'error');
      return null;
    }
  },

  updateLead: async (id, data) => {
    const prev = get().leads;
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, ...data } : l)),
    }));
    try {
      await db.updateLead(id, data);
    } catch (err) {
      set({ leads: prev });
      toast(err instanceof Error ? err.message : 'Failed to update lead', 'error');
    }
  },

  deleteLead: async (id) => {
    const prev = get().leads;
    set((s) => ({
      leads: s.leads.filter((l) => l.id !== id),
      activities: s.activities.filter((a) => a.leadId !== id),
      tasks: s.tasks.filter((t) => t.leadId !== id),
    }));
    try {
      await db.deleteLead(id);
    } catch (err) {
      set({ leads: prev });
      toast(err instanceof Error ? err.message : 'Failed to delete lead', 'error');
    }
  },

  updateLeadStage: async (id, stage) => {
    const prev = get().leads;
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, stage } : l)),
    }));
    try {
      await db.updateLeadStage(id, stage);
    } catch (err) {
      set({ leads: prev });
      toast(err instanceof Error ? err.message : 'Failed to update stage', 'error');
    }
  },

  addContact: async (data) => {
    try {
      const contact = await db.createContact(data);
      if (contact) {
        set((s) => ({ contacts: [contact, ...s.contacts] }));
      }
      return contact;
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create contact', 'error');
      return null;
    }
  },

  addCompany: async (data) => {
    try {
      const company = await db.createCompany(data);
      if (company) {
        set((s) => ({ companies: [company, ...s.companies] }));
      }
      return company;
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create company', 'error');
      return null;
    }
  },

  addTask: async (data) => {
    try {
      const task = await db.createTask(data);
      if (task) {
        set((s) => ({ tasks: [task, ...s.tasks] }));
      }
      return task;
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create task', 'error');
      return null;
    }
  },

  updateTask: async (id, data) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) }));
    try {
      await db.updateTask(id, data);
    } catch (err) {
      set({ tasks: prev });
      toast(err instanceof Error ? err.message : 'Failed to update task', 'error');
    }
  },

  deleteTask: async (id) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    try {
      await db.deleteTask(id);
    } catch (err) {
      set({ tasks: prev });
      toast(err instanceof Error ? err.message : 'Failed to delete task', 'error');
    }
  },

  updateTaskStatus: async (id, status) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }));
    try {
      await db.updateTaskStatus(id, status);
    } catch (err) {
      set({ tasks: prev });
    }
  },

  addActivity: async (data) => {
    try {
      const activity = await db.createActivity(data);
      if (activity) {
        set((s) => ({ activities: [activity, ...s.activities] }));
      }
      return activity;
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to log activity', 'error');
      return null;
    }
  },
}));
