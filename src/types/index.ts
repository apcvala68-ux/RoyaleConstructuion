export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  projectType: ProjectType;
  projectDescription: string;
  estimatedValue: number;
  stage: PipelineStage;
  source: LeadSource;
  assignedTo: string;
  location: string;
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  contactCount: number;
  dealCount: number;
  totalValue: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  leadName: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface Task {
  id: string;
  leadId: string;
  leadName: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  leadId: string;
  leadName: string;
  amount: number;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  submittedDate?: string;
  validUntil: string;
  items: BidItem[];
  notes?: string;
  createdAt: string;
}

export interface BidItem {
  id: number;
  bidId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export type NotificationType = 'lead' | 'task' | 'bid' | 'activity' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface KPIData {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  gradient: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export type PipelineStage =
  | 'New Lead'
  | 'Contacted'
  | 'Site Visit'
  | 'Estimating'
  | 'Bid Submitted'
  | 'Negotiating'
  | 'Won'
  | 'Lost'
  | 'On Hold';

export type ProjectType =
  | 'Commercial'
  | 'Residential'
  | 'Industrial'
  | 'Infrastructure'
  | 'Renovation'
  | 'Government';

export type LeadSource =
  | 'Google Ads'
  | 'Referral'
  | 'Website'
  | 'Direct'
  | 'Social Media'
  | 'Event'
  | 'Partner';

export type ActivityType =
  | 'call'
  | 'email'
  | 'meeting'
  | 'site-visit'
  | 'note'
  | 'task'
  | 'document';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type UserRole = 'admin' | 'manager' | 'sales' | 'estimator' | 'viewer';

export const PIPELINE_STAGES: PipelineStage[] = [
  'New Lead',
  'Contacted',
  'Site Visit',
  'Estimating',
  'Bid Submitted',
  'Negotiating',
  'Won',
  'Lost',
  'On Hold',
];

export const PROJECT_TYPES: ProjectType[] = [
  'Commercial',
  'Residential',
  'Industrial',
  'Infrastructure',
  'Renovation',
  'Government',
];

export const LEAD_SOURCES: LeadSource[] = [
  'Google Ads',
  'Referral',
  'Website',
  'Direct',
  'Social Media',
  'Event',
  'Partner',
];

export const USER_ROLES: UserRole[] = ['admin', 'manager', 'sales', 'estimator', 'viewer'];

export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

export const STAGE_PROBABILITIES: Record<PipelineStage, number> = {
  'New Lead': 10,
  'Contacted': 20,
  'Site Visit': 35,
  'Estimating': 50,
  'Bid Submitted': 65,
  'Negotiating': 75,
  'Won': 100,
  'Lost': 0,
  'On Hold': 15,
};
