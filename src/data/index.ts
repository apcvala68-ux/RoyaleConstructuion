import {
  Lead, Contact, Company, Activity, Task, Bid, User,
  PipelineStage, ActivityType, TaskStatus, TaskPriority,
} from '@/types';

export const USERS: User[] = [
  { id: 'u1', name: 'John Sterling', email: 'john@royaleconstruction.com', role: 'admin', status: 'active', lastActive: new Date().toISOString() },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@royaleconstruction.com', role: 'sales', status: 'active', lastActive: new Date(Date.now() - 3600000).toISOString() },
  { id: 'u3', name: 'Mike Rodriguez', email: 'mike@royaleconstruction.com', role: 'estimator', status: 'active', lastActive: new Date(Date.now() - 7200000).toISOString() },
  { id: 'u4', name: 'Emily Watson', email: 'emily@royaleconstruction.com', role: 'manager', status: 'active', lastActive: new Date(Date.now() - 86400000).toISOString() },
  { id: 'u5', name: 'David Kim', email: 'david@royaleconstruction.com', role: 'sales', status: 'active', lastActive: new Date(Date.now() - 172800000).toISOString() },
];

export const CONTACTS: Contact[] = [
  { id: 'c1', name: 'James Mitchell', email: 'james@mitchelldev.com', phone: '+1 (555) 234-5678', company: 'Mitchell Development Corp', role: 'CEO', createdAt: '2025-11-15T10:00:00Z' },
  { id: 'c2', name: 'Lisa Park', email: 'lisa@skylineproperties.com', phone: '+1 (555) 345-6789', company: 'Skyline Properties', role: 'Director of Operations', createdAt: '2025-12-01T14:30:00Z' },
  { id: 'c3', name: 'Robert Garcia', email: 'robert@garciaarchitecture.com', phone: '+1 (555) 456-7890', company: 'Garcia Architecture', role: 'Principal Architect', createdAt: '2025-12-10T09:15:00Z' },
  { id: 'c4', name: 'Amanda Foster', email: 'amanda@citygov.gov', phone: '+1 (555) 567-8901', company: 'City Government', role: 'Project Manager', createdAt: '2026-01-05T11:00:00Z' },
  { id: 'c5', name: 'Thomas Lee', email: 'thomas@buildrightinc.com', phone: '+1 (555) 678-9012', company: 'BuildRight Inc', role: 'VP Construction', createdAt: '2026-01-20T16:00:00Z' },
  { id: 'c6', name: 'Jennifer Adams', email: 'jennifer@techcorp.com', phone: '+1 (555) 789-0123', company: 'TechCorp Industries', role: 'Facilities Director', createdAt: '2026-02-01T08:45:00Z' },
  { id: 'c7', name: 'Marcus Brown', email: 'marcus@greenfield.com', phone: '+1 (555) 890-1234', company: 'Greenfield Holdings', role: 'Managing Partner', createdAt: '2026-02-10T13:20:00Z' },
  { id: 'c8', name: 'Rachel Taylor', email: 'rachel@urbanliving.com', phone: '+1 (555) 901-2345', company: 'Urban Living LLC', role: 'Development Manager', createdAt: '2026-02-15T10:30:00Z' },
  { id: 'c9', name: 'Daniel White', email: 'daniel@westcoastbuild.com', phone: '+1 (555) 012-3456', company: 'West Coast Builders', role: 'Operations Director', createdAt: '2026-03-01T15:00:00Z' },
  { id: 'c10', name: 'Sophia Martinez', email: 'sophia@premierconstruct.com', phone: '+1 (555) 123-4567', company: 'Premier Construction Group', role: 'Business Development', createdAt: '2026-03-05T09:00:00Z' },
];

export const COMPANIES: Company[] = [
  { id: 'co1', name: 'Mitchell Development Corp', industry: 'Real Estate Development', website: 'mitchelldev.com', phone: '+1 (555) 234-5678', email: 'info@mitchelldev.com', address: '100 Park Ave, New York, NY', contactCount: 3, dealCount: 4, totalValue: 8500000, createdAt: '2025-11-15T10:00:00Z' },
  { id: 'co2', name: 'Skyline Properties', industry: 'Commercial Real Estate', website: 'skylineproperties.com', phone: '+1 (555) 345-6789', email: 'info@skylineproperties.com', address: '250 Broadway, New York, NY', contactCount: 2, dealCount: 3, totalValue: 12300000, createdAt: '2025-12-01T14:30:00Z' },
  { id: 'co3', name: 'Garcia Architecture', industry: 'Architecture', website: 'garciaarchitecture.com', phone: '+1 (555) 456-7890', email: 'hello@garciaarchitecture.com', address: '75 5th Ave, New York, NY', contactCount: 1, dealCount: 2, totalValue: 3200000, createdAt: '2025-12-10T09:15:00Z' },
  { id: 'co4', name: 'City Government', industry: 'Government', website: 'citygov.gov', phone: '+1 (555) 567-8901', email: 'projects@citygov.gov', address: '1 City Hall Plaza, New York, NY', contactCount: 2, dealCount: 2, totalValue: 15000000, createdAt: '2026-01-05T11:00:00Z' },
  { id: 'co5', name: 'BuildRight Inc', industry: 'Construction', website: 'buildrightinc.com', phone: '+1 (555) 678-9012', email: 'info@buildrightinc.com', address: '450 Industrial Blvd, Brooklyn, NY', contactCount: 2, dealCount: 3, totalValue: 6700000, createdAt: '2026-01-20T16:00:00Z' },
  { id: 'co6', name: 'TechCorp Industries', industry: 'Technology', website: 'techcorp.com', phone: '+1 (555) 789-0123', email: 'facilities@techcorp.com', address: '1 Tech Park, Silicon Valley, CA', contactCount: 1, dealCount: 2, totalValue: 9800000, createdAt: '2026-02-01T08:45:00Z' },
  { id: 'co7', name: 'Greenfield Holdings', industry: 'Investment', website: 'greenfield.com', phone: '+1 (555) 890-1234', email: 'investments@greenfield.com', address: '200 Sand Hill Rd, Menlo Park, CA', contactCount: 1, dealCount: 1, totalValue: 4500000, createdAt: '2026-02-10T13:20:00Z' },
  { id: 'co8', name: 'Urban Living LLC', industry: 'Residential Development', website: 'urbanliving.com', phone: '+1 (555) 901-2345', email: 'dev@urbanliving.com', address: '888 Brannan St, San Francisco, CA', contactCount: 1, dealCount: 2, totalValue: 7200000, createdAt: '2026-02-15T10:30:00Z' },
];

const now = Date.now();
const day = 86400000;

export const LEADS: Lead[] = [
  {
    id: 'LC-001', companyName: 'Mitchell Development Corp', contactName: 'James Mitchell',
    contactEmail: 'james@mitchelldev.com', contactPhone: '+1 (555) 234-5678',
    projectType: 'Commercial', projectDescription: '40-story mixed-use tower in Midtown Manhattan. Ground floor retail, 2-20 offices, 21-40 luxury condos.',
    estimatedValue: 45000000, stage: 'Estimating', source: 'Referral', assignedTo: 'u2',
    location: 'Midtown Manhattan, NY', probability: 50, expectedCloseDate: new Date(now + 45 * day).toISOString(),
    createdAt: new Date(now - 30 * day).toISOString(), updatedAt: new Date(now - 2 * day).toISOString(),
    tags: ['high-value', 'mixed-use', 'priority'], notes: 'Met James at RE Conference. Very interested in our commercial experience.',
  },
  {
    id: 'LC-002', companyName: 'Skyline Properties', contactName: 'Lisa Park',
    contactEmail: 'lisa@skylineproperties.com', contactPhone: '+1 (555) 345-6789',
    projectType: 'Commercial', projectDescription: 'Class A office building with sustainable design. LEED Gold certification required.',
    estimatedValue: 28000000, stage: 'Bid Submitted', source: 'Website', assignedTo: 'u2',
    location: 'Hudson Yards, NY', probability: 65, expectedCloseDate: new Date(now + 30 * day).toISOString(),
    createdAt: new Date(now - 45 * day).toISOString(), updatedAt: new Date(now - 5 * day).toISOString(),
    tags: ['sustainable', 'LEED', 'class-a'], notes: 'Strong relationship with PM. Bid submitted on June 1.',
  },
  {
    id: 'LC-003', companyName: 'City Government', contactName: 'Amanda Foster',
    contactEmail: 'amanda@citygov.gov', contactPhone: '+1 (555) 567-8901',
    projectType: 'Infrastructure', projectDescription: 'Bridge rehabilitation and widening. Historic structure requiring careful restoration.',
    estimatedValue: 18500000, stage: 'Negotiating', source: 'Direct', assignedTo: 'u4',
    location: 'East River Bridge, NY', probability: 75, expectedCloseDate: new Date(now + 20 * day).toISOString(),
    createdAt: new Date(now - 60 * day).toISOString(), updatedAt: new Date(now - 1 * day).toISOString(),
    tags: ['government', 'infrastructure', 'historic'], notes: 'Government contract. Final negotiations on pricing.',
  },
  {
    id: 'LC-004', companyName: 'TechCorp Industries', contactName: 'Jennifer Adams',
    contactEmail: 'jennifer@techcorp.com', contactPhone: '+1 (555) 789-0123',
    projectType: 'Industrial', projectDescription: 'Data center expansion. 50,000 sq ft with redundant power and cooling systems.',
    estimatedValue: 32000000, stage: 'Site Visit', source: 'Partner', assignedTo: 'u5',
    location: 'San Jose, CA', probability: 35, expectedCloseDate: new Date(now + 90 * day).toISOString(),
    createdAt: new Date(now - 15 * day).toISOString(), updatedAt: new Date(now - 3 * day).toISOString(),
    tags: ['data-center', 'tech', 'west-coast'], notes: 'Site visit scheduled for next week. Need to fly team out.',
  },
  {
    id: 'LC-005', companyName: 'Urban Living LLC', contactName: 'Rachel Taylor',
    contactEmail: 'rachel@urbanliving.com', contactPhone: '+1 (555) 901-2345',
    projectType: 'Residential', projectDescription: 'Luxury condo development. 120 units across 3 buildings with rooftop amenities.',
    estimatedValue: 52000000, stage: 'New Lead', source: 'Google Ads', assignedTo: 'u2',
    location: 'Brooklyn, NY', probability: 10, expectedCloseDate: new Date(now + 120 * day).toISOString(),
    createdAt: new Date(now - 2 * day).toISOString(), updatedAt: new Date(now - 2 * day).toISOString(),
    tags: ['luxury', 'residential', 'large-scale'], notes: 'Inbound from Google Ads campaign. High estimated value.',
  },
  {
    id: 'LC-006', companyName: 'BuildRight Inc', contactName: 'Thomas Lee',
    contactEmail: 'thomas@buildrightinc.com', contactPhone: '+1 (555) 678-9012',
    projectType: 'Renovation', projectDescription: 'Historic hotel renovation. 200 rooms, lobby, restaurant, and conference center.',
    estimatedValue: 15800000, stage: 'Contacted', source: 'Referral', assignedTo: 'u5',
    location: 'Upper East Side, NY', probability: 20, expectedCloseDate: new Date(now + 75 * day).toISOString(),
    createdAt: new Date(now - 10 * day).toISOString(), updatedAt: new Date(now - 4 * day).toISOString(),
    tags: ['renovation', 'hospitality', 'historic'], notes: 'Referred by Garcia Architecture. Initial call scheduled.',
  },
  {
    id: 'LC-007', companyName: 'Greenfield Holdings', contactName: 'Marcus Brown',
    contactEmail: 'marcus@greenfield.com', contactPhone: '+1 (555) 890-1234',
    projectType: 'Commercial', projectDescription: 'Office park development. 3 buildings, 200,000 sq ft total with parking structure.',
    estimatedValue: 42000000, stage: 'Estimating', source: 'Event', assignedTo: 'u4',
    location: 'Stamford, CT', probability: 50, expectedCloseDate: new Date(now + 60 * day).toISOString(),
    createdAt: new Date(now - 25 * day).toISOString(), updatedAt: new Date(now - 6 * day).toISOString(),
    tags: ['office-park', 'suburban', 'large-scale'], notes: 'Met at Construction Expo. Very detailed RFP received.',
  },
  {
    id: 'LC-008', companyName: 'Mitchell Development Corp', contactName: 'James Mitchell',
    contactEmail: 'james@mitchelldev.com', contactPhone: '+1 (555) 234-5678',
    projectType: 'Residential', projectDescription: 'Affordable housing complex. 300 units with community center and green spaces.',
    estimatedValue: 28000000, stage: 'Site Visit', source: 'Referral', assignedTo: 'u2',
    location: 'Bronx, NY', probability: 35, expectedCloseDate: new Date(now + 50 * day).toISOString(),
    createdAt: new Date(now - 20 * day).toISOString(), updatedAt: new Date(now - 7 * day).toISOString(),
    tags: ['affordable-housing', 'community', 'government-grant'], notes: 'Second project with Mitchell. Site visit completed.',
  },
  {
    id: 'LC-009', companyName: 'West Coast Builders', contactName: 'Daniel White',
    contactEmail: 'daniel@westcoastbuild.com', contactPhone: '+1 (555) 012-3456',
    projectType: 'Infrastructure', projectDescription: 'Highway interchange reconstruction. Complex phasing required.',
    estimatedValue: 85000000, stage: 'New Lead', source: 'Direct', assignedTo: 'u4',
    location: 'Los Angeles, CA', probability: 10, expectedCloseDate: new Date(now + 180 * day).toISOString(),
    createdAt: new Date(now - 1 * day).toISOString(), updatedAt: new Date(now - 1 * day).toISOString(),
    tags: ['highway', 'mega-project', 'west-coast'], notes: 'Cold outreach from CEO. Huge opportunity if we can handle West Coast logistics.',
  },
  {
    id: 'LC-010', companyName: 'Premier Construction Group', contactName: 'Sophia Martinez',
    contactEmail: 'sophia@premierconstruct.com', contactPhone: '+1 (555) 123-4567',
    projectType: 'Commercial', projectDescription: 'Shopping center renovation and expansion. 150,000 sq ft expansion with parking.',
    estimatedValue: 22000000, stage: 'Bid Submitted', source: 'Partner', assignedTo: 'u5',
    location: 'Edison, NJ', probability: 65, expectedCloseDate: new Date(now + 35 * day).toISOString(),
    createdAt: new Date(now - 40 * day).toISOString(), updatedAt: new Date(now - 8 * day).toISOString(),
    tags: ['retail', 'renovation', 'expansion'], notes: 'Joint venture opportunity. Bid submitted with partner.',
  },
  {
    id: 'LC-011', companyName: 'Skyline Properties', contactName: 'Lisa Park',
    contactEmail: 'lisa@skylineproperties.com', contactPhone: '+1 (555) 345-6789',
    projectType: 'Residential', projectDescription: 'Waterfront luxury condos. 80 units with marina and infinity pool.',
    estimatedValue: 65000000, stage: 'Contacted', source: 'Referral', assignedTo: 'u2',
    location: 'Long Island City, NY', probability: 20, expectedCloseDate: new Date(now + 100 * day).toISOString(),
    createdAt: new Date(now - 8 * day).toISOString(), updatedAt: new Date(now - 3 * day).toISOString(),
    tags: ['waterfront', 'luxury', 'amenities'], notes: 'Follow-up from LC-002. Lisa wants us for this too.',
  },
  {
    id: 'LC-012', companyName: 'City Government', contactName: 'Amanda Foster',
    contactEmail: 'amanda@citygov.gov', contactPhone: '+1 (555) 567-8901',
    projectType: 'Infrastructure', projectDescription: 'School modernization program. 15 schools across 5 boroughs.',
    estimatedValue: 120000000, stage: 'New Lead', source: 'Direct', assignedTo: 'u4',
    location: 'New York, NY', probability: 10, expectedCloseDate: new Date(now + 200 * day).toISOString(),
    createdAt: new Date(now - 3 * day).toISOString(), updatedAt: new Date(now - 3 * day).toISOString(),
    tags: ['education', 'mega-project', 'government', 'multi-site'], notes: 'Massive RFP from DOE. Would be our largest project ever.',
  },
  {
    id: 'LC-013', companyName: 'BuildRight Inc', contactName: 'Thomas Lee',
    contactEmail: 'thomas@buildrightinc.com', contactPhone: '+1 (555) 678-9012',
    projectType: 'Commercial', projectDescription: 'Corporate headquarters buildout. 80,000 sq ft tech-enabled office.',
    estimatedValue: 18000000, stage: 'Won', source: 'Referral', assignedTo: 'u5',
    location: 'Jersey City, NJ', probability: 100, expectedCloseDate: new Date(now - 10 * day).toISOString(),
    createdAt: new Date(now - 90 * day).toISOString(), updatedAt: new Date(now - 10 * day).toISOString(),
    tags: ['corporate', 'tech-enabled', 'won'], notes: 'Deal closed! Contract signed. Mobilization starts July 1.',
  },
  {
    id: 'LC-014', companyName: 'TechCorp Industries', contactName: 'Jennifer Adams',
    contactEmail: 'jennifer@techcorp.com', contactPhone: '+1 (555) 789-0123',
    projectType: 'Commercial', projectDescription: 'Innovation campus. 3 buildings with labs, offices, and maker spaces.',
    estimatedValue: 75000000, stage: 'On Hold', source: 'Partner', assignedTo: 'u4',
    location: 'Austin, TX', probability: 15, expectedCloseDate: new Date(now + 150 * day).toISOString(),
    createdAt: new Date(now - 50 * day).toISOString(), updatedAt: new Date(now - 12 * day).toISOString(),
    tags: ['innovation', 'labs', 'campus', 'on-hold'], notes: 'Client delayed due to funding round. Revisit in Q4.',
  },
  {
    id: 'LC-015', companyName: 'Urban Living LLC', contactName: 'Rachel Taylor',
    contactEmail: 'rachel@urbanliving.com', contactPhone: '+1 (555) 901-2345',
    projectType: 'Renovation', projectDescription: 'Boutique hotel conversion from historic warehouse. 60 rooms.',
    estimatedValue: 12000000, stage: 'Lost', source: 'Website', assignedTo: 'u2',
    location: 'SoHo, NY', probability: 0, expectedCloseDate: new Date(now - 20 * day).toISOString(),
    createdAt: new Date(now - 70 * day).toISOString(), updatedAt: new Date(now - 20 * day).toISOString(),
    tags: ['hospitality', 'historic', 'lost'], notes: 'Lost to competitor. They undercut by 15%. Need to review pricing.',
  },
];

export const ACTIVITIES: Activity[] = [
  { id: 'a1', leadId: 'LC-001', leadName: 'Mitchell Development Corp', type: 'call', title: 'Discovery call with James Mitchell', description: 'Discussed project scope, timeline, and budget expectations. Very positive meeting.', timestamp: new Date(now - 2 * day).toISOString(), userId: 'u2', userName: 'Sarah Chen', duration: 45 },
  { id: 'a2', leadId: 'LC-002', leadName: 'Skyline Properties', type: 'email', title: 'Bid proposal sent', description: 'Sent detailed bid for Class A office building. Included sustainability premium.', timestamp: new Date(now - 5 * day).toISOString(), userId: 'u2', userName: 'Sarah Chen' },
  { id: 'a3', leadId: 'LC-003', leadName: 'City Government', type: 'meeting', title: 'Final pricing review meeting', description: 'Reviewed final pricing with city officials. Minor adjustments needed.', timestamp: new Date(now - 1 * day).toISOString(), userId: 'u4', userName: 'Emily Watson', duration: 120 },
  { id: 'a4', leadId: 'LC-004', leadName: 'TechCorp Industries', type: 'site-visit', title: 'Site visit assessment', description: 'Toured the expansion site. Reviewed technical requirements with facilities team.', timestamp: new Date(now - 3 * day).toISOString(), userId: 'u5', userName: 'David Kim', duration: 180 },
  { id: 'a5', leadId: 'LC-005', leadName: 'Urban Living LLC', type: 'note', title: 'Google Ads lead captured', description: 'Inbound inquiry from Google Ads campaign. High estimated value for Brooklyn luxury condos.', timestamp: new Date(now - 2 * day).toISOString(), userId: 'u2', userName: 'Sarah Chen' },
  { id: 'a6', leadId: 'LC-006', leadName: 'BuildRight Inc', type: 'call', title: 'Initial outreach call', description: 'Called Thomas Lee to discuss historic hotel renovation. Scheduled intro meeting.', timestamp: new Date(now - 4 * day).toISOString(), userId: 'u5', userName: 'David Kim', duration: 30 },
  { id: 'a7', leadId: 'LC-007', leadName: 'Greenfield Holdings', type: 'document', title: 'RFP received from Greenfield', description: 'Detailed RFP for office park development. 120 pages. Need to review thoroughly.', timestamp: new Date(now - 6 * day).toISOString(), userId: 'u4', userName: 'Emily Watson' },
  { id: 'a8', leadId: 'LC-001', leadName: 'Mitchell Development Corp', type: 'meeting', title: 'Estimating kickoff meeting', description: 'Met with estimating team to review Mitchell tower project. Preliminary numbers look good.', timestamp: new Date(now - 1 * day).toISOString(), userId: 'u4', userName: 'Emily Watson', duration: 90 },
  { id: 'a9', leadId: 'LC-003', leadName: 'City Government', type: 'email', title: 'Revised proposal submitted', description: 'Submitted revised pricing incorporating city feedback. Removed contingency items.', timestamp: new Date(now - 1 * day).toISOString(), userId: 'u4', userName: 'Emily Watson' },
  { id: 'a10', leadId: 'LC-009', leadName: 'West Coast Builders', type: 'call', title: 'CEO introduction call', description: 'Spoke with Daniel White about mega highway project. Very interested in our heavy civil experience.', timestamp: new Date(now - 1 * day).toISOString(), userId: 'u4', userName: 'Emily Watson', duration: 60 },
  { id: 'a11', leadId: 'LC-002', leadName: 'Skyline Properties', type: 'call', title: 'Bid follow-up call', description: 'Lisa confirmed review committee meets next week. Feeling confident about our chances.', timestamp: new Date(now - 1 * day).toISOString(), userId: 'u2', userName: 'Sarah Chen', duration: 20 },
  { id: 'a12', leadId: 'LC-008', leadName: 'Mitchell Development Corp', type: 'site-visit', title: 'Bronx affordable housing site visit', description: 'Toured the site with James and his team. Community board meeting went well.', timestamp: new Date(now - 7 * day).toISOString(), userId: 'u2', userName: 'Sarah Chen', duration: 150 },
];

export const TASKS: Task[] = [
  { id: 't1', leadId: 'LC-001', leadName: 'Mitchell Development Corp', title: 'Complete estimating for Mitchell tower', description: 'Finalize cost estimates for 40-story mixed-use tower.', dueDate: new Date(now + 3 * day).toISOString(), status: 'in-progress', priority: 'high', assignedTo: 'u3', createdAt: new Date(now - 5 * day).toISOString() },
  { id: 't2', leadId: 'LC-002', leadName: 'Skyline Properties', title: 'Follow up on bid submission', description: 'Call Lisa to confirm bid review timeline.', dueDate: new Date(now + 1 * day).toISOString(), status: 'pending', priority: 'medium', assignedTo: 'u2', createdAt: new Date(now - 3 * day).toISOString() },
  { id: 't3', leadId: 'LC-003', leadName: 'City Government', title: 'Finalize contract terms', description: 'Prepare final contract documents for city bridge project.', dueDate: new Date(now + 5 * day).toISOString(), status: 'in-progress', priority: 'high', assignedTo: 'u4', createdAt: new Date(now - 2 * day).toISOString() },
  { id: 't4', leadId: 'LC-004', leadName: 'TechCorp Industries', title: 'Schedule data center site visit', description: 'Coordinate with Jennifer for team visit to San Jose.', dueDate: new Date(now + 7 * day).toISOString(), status: 'pending', priority: 'medium', assignedTo: 'u5', createdAt: new Date(now - 1 * day).toISOString() },
  { id: 't5', leadId: 'LC-005', leadName: 'Urban Living LLC', title: 'Send introductory packet', description: 'Email company portfolio and case studies to Rachel.', dueDate: new Date(now + 2 * day).toISOString(), status: 'overdue', priority: 'high', assignedTo: 'u2', createdAt: new Date(now - 4 * day).toISOString() },
  { id: 't6', leadId: 'LC-007', leadName: 'Greenfield Holdings', title: 'Review RFP requirements', description: 'Go through 120-page RFP and create response plan.', dueDate: new Date(now + 4 * day).toISOString(), status: 'in-progress', priority: 'high', assignedTo: 'u4', createdAt: new Date(now - 6 * day).toISOString() },
  { id: 't7', leadId: 'LC-010', leadName: 'Premier Construction Group', title: 'Coordinate JV agreement', description: 'Work with partner on joint venture terms for shopping center.', dueDate: new Date(now + 6 * day).toISOString(), status: 'pending', priority: 'medium', assignedTo: 'u5', createdAt: new Date(now - 2 * day).toISOString() },
  { id: 't8', leadId: 'LC-012', leadName: 'City Government', title: 'Prepare DOE proposal team', description: 'Assemble team for school modernization mega-RFP.', dueDate: new Date(now + 10 * day).toISOString(), status: 'pending', priority: 'urgent', assignedTo: 'u4', createdAt: new Date(now - 1 * day).toISOString() },
  { id: 't9', leadId: 'LC-011', leadName: 'Skyline Properties', title: 'Schedule waterfront site tour', description: 'Arrange site visit for Long Island City waterfront project.', dueDate: new Date(now + 3 * day).toISOString(), status: 'pending', priority: 'medium', assignedTo: 'u2', createdAt: new Date(now - 1 * day).toISOString() },
  { id: 't10', leadId: 'LC-013', leadName: 'BuildRight Inc', title: 'Kick off BuildRight HQ project', description: 'Schedule mobilization meeting for Jersey City project.', dueDate: new Date(now - 2 * day).toISOString(), status: 'completed', priority: 'high', assignedTo: 'u5', createdAt: new Date(now - 15 * day).toISOString() },
];

export const BIDS: Bid[] = [
  { id: 'B-001', leadId: 'LC-002', leadName: 'Skyline Properties', amount: 28000000, status: 'submitted', submittedDate: new Date(now - 5 * day).toISOString(), validUntil: new Date(now + 25 * day).toISOString(), items: [
    { description: 'Foundation & Structure', quantity: 1, unit: 'lot', unitPrice: 12000000, total: 12000000 },
    { description: 'MEP Systems', quantity: 1, unit: 'lot', unitPrice: 8000000, total: 8000000 },
    { description: 'Interior Fit-out', quantity: 200000, unit: 'sqft', unitPrice: 40, total: 8000000 },
  ], notes: 'LEED Gold premium included. Valid for 30 days.', createdAt: new Date(now - 10 * day).toISOString() },
  { id: 'B-002', leadId: 'LC-010', leadName: 'Premier Construction Group', amount: 22000000, status: 'submitted', submittedDate: new Date(now - 8 * day).toISOString(), validUntil: new Date(now + 22 * day).toISOString(), items: [
    { description: 'Demolition & Site Prep', quantity: 1, unit: 'lot', unitPrice: 3000000, total: 3000000 },
    { description: 'Structural Expansion', quantity: 150000, unit: 'sqft', unitPrice: 80, total: 12000000 },
    { description: 'MEP & Systems', quantity: 1, unit: 'lot', unitPrice: 7000000, total: 7000000 },
  ], notes: 'JV bid with Premier Construction. 50/50 split.', createdAt: new Date(now - 12 * day).toISOString() },
  { id: 'B-003', leadId: 'LC-013', leadName: 'BuildRight Inc', amount: 18000000, status: 'accepted', submittedDate: new Date(now - 60 * day).toISOString(), validUntil: new Date(now - 30 * day).toISOString(), items: [
    { description: 'Corporate Office Buildout', quantity: 80000, unit: 'sqft', unitPrice: 150, total: 12000000 },
    { description: 'Technology Infrastructure', quantity: 1, unit: 'lot', unitPrice: 3500000, total: 3500000 },
    { description: 'Furniture & Fixtures', quantity: 1, unit: 'lot', unitPrice: 2500000, total: 2500000 },
  ], notes: 'Won! Contract signed May 15.', createdAt: new Date(now - 70 * day).toISOString() },
];

export function getLeadsByStage(stage: PipelineStage): Lead[] {
  return LEADS.filter(l => l.stage === stage);
}

export function getLeadById(id: string): Lead | undefined {
  return LEADS.find(l => l.id === id);
}

export function getActivitiesByLead(leadId: string): Activity[] {
  return ACTIVITIES.filter(a => a.leadId === leadId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getTasksByLead(leadId: string): Task[] {
  return TASKS.filter(t => t.leadId === leadId);
}

export function getBidsByLead(leadId: string): Bid[] {
  return BIDS.filter(b => b.leadId === leadId);
}

export function getTotalPipelineValue(): number {
  return LEADS.filter(l => !['Won', 'Lost'].includes(l.stage)).reduce((sum, l) => sum + l.estimatedValue, 0);
}

export function getWinRate(): number {
  const closed = LEADS.filter(l => ['Won', 'Lost'].includes(l.stage));
  const won = LEADS.filter(l => l.stage === 'Won');
  return closed.length > 0 ? Math.round((won.length / closed.length) * 100) : 0;
}

export function getAverageDealValue(): number {
  const won = LEADS.filter(l => l.stage === 'Won');
  return won.length > 0 ? won.reduce((sum, l) => sum + l.estimatedValue, 0) / won.length : 0;
}
