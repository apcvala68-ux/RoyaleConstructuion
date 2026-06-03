'use client';

import { create } from 'zustand';
import type { Lead, Contact, Company, Task, Activity } from '@/types';
import { LEADS, CONTACTS, COMPANIES, TASKS, ACTIVITIES } from '@/data';

function generateId(prefix: string): string {
  const n = Math.floor(Math.random() * 900) + 100;
  return `${prefix}-${n}`;
}

interface AppState {
  leads: Lead[];
  contacts: Contact[];
  companies: Company[];
  tasks: Task[];
  activities: Activity[];

  addLead: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, data: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  addContact: (data: Omit<Contact, 'id' | 'createdAt'>) => Contact;
  addCompany: (data: Omit<Company, 'id' | 'createdAt'>) => Company;

  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTaskStatus: (id: string, status: Task['status']) => void;

  addActivity: (data: Omit<Activity, 'id' | 'timestamp'>) => Activity;
}

export const useAppStore = create<AppState>((set, get) => ({
  leads: [...LEADS],
  contacts: [...CONTACTS],
  companies: [...COMPANIES],
  tasks: [...TASKS],
  activities: [...ACTIVITIES],

  addLead: (data) => {
    const now = new Date().toISOString();
    const lead: Lead = { id: generateId('LC'), ...data, createdAt: now, updatedAt: now };
    set((s) => ({ leads: [lead, ...s.leads] }));
    return lead;
  },

  updateLead: (id, data) => {
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l)),
    }));
  },

  deleteLead: (id) => {
    set((s) => ({
      leads: s.leads.filter((l) => l.id !== id),
      activities: s.activities.filter((a) => a.leadId !== id),
      tasks: s.tasks.filter((t) => t.leadId !== id),
    }));
  },

  addContact: (data) => {
    const contact: Contact = { id: generateId('CT'), ...data, createdAt: new Date().toISOString() };
    set((s) => ({ contacts: [contact, ...s.contacts] }));
    return contact;
  },

  addCompany: (data) => {
    const company: Company = { id: generateId('CM'), ...data, createdAt: new Date().toISOString() };
    set((s) => ({ companies: [company, ...s.companies] }));
    return company;
  },

  addTask: (data) => {
    const task: Task = { id: generateId('TK'), ...data, createdAt: new Date().toISOString() };
    set((s) => ({ tasks: [task, ...s.tasks] }));
    return task;
  },

  updateTaskStatus: (id, status) => {
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }));
  },

  addActivity: (data) => {
    const activity: Activity = { id: generateId('ACT'), ...data, timestamp: new Date().toISOString() };
    set((s) => ({ activities: [activity, ...s.activities] }));
    return activity;
  },
}));
