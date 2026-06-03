import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const content = fs.readFileSync(envPath, 'utf-8');
  const env: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const now = new Date();
const day = 86400000;

async function seed() {
  console.log('Seeding Supabase...');

  // Clear existing data
  for (const table of ['bid_items', 'bids', 'activities', 'tasks', 'leads', 'companies', 'contacts', 'users']) {
    const { error } = await supabase.from(table).delete().neq('id', '');
    if (error) console.error(`Error clearing ${table}:`, error.message);
    else console.log(`Cleared ${table}`);
  }

  // Users
  const users = [
    { id: 'u1', name: 'John Sterling', email: 'john@royaleconstruction.com', role: 'admin', status: 'active', last_active: now.toISOString() },
    { id: 'u2', name: 'Sarah Chen', email: 'sarah@royaleconstruction.com', role: 'sales', status: 'active', last_active: new Date(now.getTime() - 3600000).toISOString() },
    { id: 'u3', name: 'Mike Rodriguez', email: 'mike@royaleconstruction.com', role: 'estimator', status: 'active', last_active: new Date(now.getTime() - 7200000).toISOString() },
    { id: 'u4', name: 'Emily Watson', email: 'emily@royaleconstruction.com', role: 'manager', status: 'active', last_active: new Date(now.getTime() - 86400000).toISOString() },
    { id: 'u5', name: 'David Kim', email: 'david@royaleconstruction.com', role: 'sales', status: 'active', last_active: new Date(now.getTime() - 172800000).toISOString() },
  ];
  for (const user of users) {
    const { error } = await supabase.from('users').upsert(user, { onConflict: 'id' });
    if (error) console.error(`Error inserting user ${user.id}:`, error.message);
  }
  console.log(`Inserted ${users.length} users`);

  // Contacts
  const contacts = [
    { id: 'c1', name: 'James Mitchell', email: 'james@mitchelldev.com', phone: '+1 (555) 234-5678', company: 'Mitchell Development Corp', role: 'CEO', created_at: new Date(now.getTime() - 200 * day).toISOString() },
    { id: 'c2', name: 'Lisa Park', email: 'lisa@skylineproperties.com', phone: '+1 (555) 345-6789', company: 'Skyline Properties', role: 'Director of Operations', created_at: new Date(now.getTime() - 185 * day).toISOString() },
    { id: 'c3', name: 'Robert Garcia', email: 'robert@garciaarchitecture.com', phone: '+1 (555) 456-7890', company: 'Garcia Architecture', role: 'Principal Architect', created_at: new Date(now.getTime() - 175 * day).toISOString() },
    { id: 'c4', name: 'Amanda Foster', email: 'amanda@citygov.gov', phone: '+1 (555) 567-8901', company: 'City Government', role: 'Project Manager', created_at: new Date(now.getTime() - 150 * day).toISOString() },
    { id: 'c5', name: 'Thomas Lee', email: 'thomas@buildrightinc.com', phone: '+1 (555) 678-9012', company: 'BuildRight Inc', role: 'VP Construction', created_at: new Date(now.getTime() - 130 * day).toISOString() },
    { id: 'c6', name: 'Jennifer Adams', email: 'jennifer@techcorp.com', phone: '+1 (555) 789-0123', company: 'TechCorp Industries', role: 'Facilities Director', created_at: new Date(now.getTime() - 120 * day).toISOString() },
    { id: 'c7', name: 'Marcus Brown', email: 'marcus@greenfield.com', phone: '+1 (555) 890-1234', company: 'Greenfield Holdings', role: 'Managing Partner', created_at: new Date(now.getTime() - 110 * day).toISOString() },
    { id: 'c8', name: 'Rachel Taylor', email: 'rachel@urbanliving.com', phone: '+1 (555) 901-2345', company: 'Urban Living LLC', role: 'Development Manager', created_at: new Date(now.getTime() - 100 * day).toISOString() },
    { id: 'c9', name: 'Daniel White', email: 'daniel@westcoastbuild.com', phone: '+1 (555) 012-3456', company: 'West Coast Builders', role: 'Operations Director', created_at: new Date(now.getTime() - 90 * day).toISOString() },
    { id: 'c10', name: 'Sophia Martinez', email: 'sophia@premierconstruct.com', phone: '+1 (555) 123-4567', company: 'Premier Construction Group', role: 'Business Development', created_at: new Date(now.getTime() - 85 * day).toISOString() },
  ];
  for (const c of contacts) {
    const { error } = await supabase.from('contacts').upsert(c, { onConflict: 'id' });
    if (error) console.error(`Error inserting contact ${c.id}:`, error.message);
  }
  console.log(`Inserted ${contacts.length} contacts`);

  // Companies
  const companies = [
    { id: 'co1', name: 'Mitchell Development Corp', industry: 'Real Estate Development', website: 'mitchelldev.com', phone: '+1 (555) 234-5678', email: 'info@mitchelldev.com', address: '100 Park Ave, New York, NY', contact_count: 3, deal_count: 4, total_value: 8500000, created_at: new Date(now.getTime() - 200 * day).toISOString() },
    { id: 'co2', name: 'Skyline Properties', industry: 'Commercial Real Estate', website: 'skylineproperties.com', phone: '+1 (555) 345-6789', email: 'info@skylineproperties.com', address: '250 Broadway, New York, NY', contact_count: 2, deal_count: 3, total_value: 12300000, created_at: new Date(now.getTime() - 185 * day).toISOString() },
    { id: 'co3', name: 'Garcia Architecture', industry: 'Architecture', website: 'garciaarchitecture.com', phone: '+1 (555) 456-7890', email: 'hello@garciaarchitecture.com', address: '75 5th Ave, New York, NY', contact_count: 1, deal_count: 2, total_value: 3200000, created_at: new Date(now.getTime() - 175 * day).toISOString() },
    { id: 'co4', name: 'City Government', industry: 'Government', website: 'citygov.gov', phone: '+1 (555) 567-8901', email: 'projects@citygov.gov', address: '1 City Hall Plaza, New York, NY', contact_count: 2, deal_count: 2, total_value: 15000000, created_at: new Date(now.getTime() - 150 * day).toISOString() },
    { id: 'co5', name: 'BuildRight Inc', industry: 'Construction', website: 'buildrightinc.com', phone: '+1 (555) 678-9012', email: 'info@buildrightinc.com', address: '450 Industrial Blvd, Brooklyn, NY', contact_count: 2, deal_count: 3, total_value: 6700000, created_at: new Date(now.getTime() - 130 * day).toISOString() },
    { id: 'co6', name: 'TechCorp Industries', industry: 'Technology', website: 'techcorp.com', phone: '+1 (555) 789-0123', email: 'facilities@techcorp.com', address: '1 Tech Park, Silicon Valley, CA', contact_count: 1, deal_count: 2, total_value: 9800000, created_at: new Date(now.getTime() - 120 * day).toISOString() },
    { id: 'co7', name: 'Greenfield Holdings', industry: 'Investment', website: 'greenfield.com', phone: '+1 (555) 890-1234', email: 'investments@greenfield.com', address: '200 Sand Hill Rd, Menlo Park, CA', contact_count: 1, deal_count: 1, total_value: 4500000, created_at: new Date(now.getTime() - 110 * day).toISOString() },
    { id: 'co8', name: 'Urban Living LLC', industry: 'Residential Development', website: 'urbanliving.com', phone: '+1 (555) 901-2345', email: 'dev@urbanliving.com', address: '888 Brannan St, San Francisco, CA', contact_count: 1, deal_count: 2, total_value: 7200000, created_at: new Date(now.getTime() - 100 * day).toISOString() },
  ];
  for (const co of companies) {
    const { error } = await supabase.from('companies').upsert(co, { onConflict: 'id' });
    if (error) console.error(`Error inserting company ${co.id}:`, error.message);
  }
  console.log(`Inserted ${companies.length} companies`);

  // Leads
  const leads = [
    { id: 'LC-001', company_name: 'Mitchell Development Corp', contact_name: 'James Mitchell', contact_email: 'james@mitchelldev.com', contact_phone: '+1 (555) 234-5678', project_type: 'Commercial', project_description: '40-story mixed-use tower in Midtown Manhattan. Ground floor retail, 2-20 offices, 21-40 luxury condos.', estimated_value: 45000000, stage: 'Estimating', source: 'Referral', assigned_to: 'u2', location: 'Midtown Manhattan, NY', probability: 50, expected_close_date: new Date(now.getTime() + 45 * day).toISOString(), tags: ['high-value', 'mixed-use', 'priority'], notes: 'Met James at RE Conference. Very interested in our commercial experience.', created_at: new Date(now.getTime() - 30 * day).toISOString(), updated_at: new Date(now.getTime() - 2 * day).toISOString() },
    { id: 'LC-002', company_name: 'Skyline Properties', contact_name: 'Lisa Park', contact_email: 'lisa@skylineproperties.com', contact_phone: '+1 (555) 345-6789', project_type: 'Commercial', project_description: 'Class A office building with sustainable design. LEED Gold certification required.', estimated_value: 28000000, stage: 'Bid Submitted', source: 'Website', assigned_to: 'u2', location: 'Hudson Yards, NY', probability: 65, expected_close_date: new Date(now.getTime() + 30 * day).toISOString(), tags: ['sustainable', 'LEED', 'class-a'], notes: 'Strong relationship with PM. Bid submitted on June 1.', created_at: new Date(now.getTime() - 45 * day).toISOString(), updated_at: new Date(now.getTime() - 5 * day).toISOString() },
    { id: 'LC-003', company_name: 'City Government', contact_name: 'Amanda Foster', contact_email: 'amanda@citygov.gov', contact_phone: '+1 (555) 567-8901', project_type: 'Infrastructure', project_description: 'Bridge rehabilitation and widening. Historic structure requiring careful restoration.', estimated_value: 18500000, stage: 'Negotiating', source: 'Direct', assigned_to: 'u4', location: 'East River Bridge, NY', probability: 75, expected_close_date: new Date(now.getTime() + 20 * day).toISOString(), tags: ['government', 'infrastructure', 'historic'], notes: 'Government contract. Final negotiations on pricing.', created_at: new Date(now.getTime() - 60 * day).toISOString(), updated_at: new Date(now.getTime() - 1 * day).toISOString() },
    { id: 'LC-004', company_name: 'TechCorp Industries', contact_name: 'Jennifer Adams', contact_email: 'jennifer@techcorp.com', contact_phone: '+1 (555) 789-0123', project_type: 'Industrial', project_description: 'Data center expansion. 50,000 sq ft with redundant power and cooling systems.', estimated_value: 32000000, stage: 'Site Visit', source: 'Partner', assigned_to: 'u5', location: 'San Jose, CA', probability: 35, expected_close_date: new Date(now.getTime() + 90 * day).toISOString(), tags: ['data-center', 'tech', 'west-coast'], notes: 'Site visit scheduled for next week. Need to fly team out.', created_at: new Date(now.getTime() - 15 * day).toISOString(), updated_at: new Date(now.getTime() - 3 * day).toISOString() },
    { id: 'LC-005', company_name: 'Urban Living LLC', contact_name: 'Rachel Taylor', contact_email: 'rachel@urbanliving.com', contact_phone: '+1 (555) 901-2345', project_type: 'Residential', project_description: 'Luxury condo development. 120 units across 3 buildings with rooftop amenities.', estimated_value: 52000000, stage: 'New Lead', source: 'Google Ads', assigned_to: 'u2', location: 'Brooklyn, NY', probability: 10, expected_close_date: new Date(now.getTime() + 120 * day).toISOString(), tags: ['luxury', 'residential', 'large-scale'], notes: 'Inbound from Google Ads campaign. High estimated value.', created_at: new Date(now.getTime() - 2 * day).toISOString(), updated_at: new Date(now.getTime() - 2 * day).toISOString() },
    { id: 'LC-006', company_name: 'BuildRight Inc', contact_name: 'Thomas Lee', contact_email: 'thomas@buildrightinc.com', contact_phone: '+1 (555) 678-9012', project_type: 'Renovation', project_description: 'Historic hotel renovation. 200 rooms, lobby, restaurant, and conference center.', estimated_value: 15800000, stage: 'Contacted', source: 'Referral', assigned_to: 'u5', location: 'Upper East Side, NY', probability: 20, expected_close_date: new Date(now.getTime() + 75 * day).toISOString(), tags: ['renovation', 'hospitality', 'historic'], notes: 'Referred by Garcia Architecture. Initial call scheduled.', created_at: new Date(now.getTime() - 10 * day).toISOString(), updated_at: new Date(now.getTime() - 4 * day).toISOString() },
    { id: 'LC-007', company_name: 'Greenfield Holdings', contact_name: 'Marcus Brown', contact_email: 'marcus@greenfield.com', contact_phone: '+1 (555) 890-1234', project_type: 'Commercial', project_description: 'Office park development. 3 buildings, 200,000 sq ft total with parking structure.', estimated_value: 42000000, stage: 'Estimating', source: 'Event', assigned_to: 'u4', location: 'Stamford, CT', probability: 50, expected_close_date: new Date(now.getTime() + 60 * day).toISOString(), tags: ['office-park', 'suburban', 'large-scale'], notes: 'Met at Construction Expo. Very detailed RFP received.', created_at: new Date(now.getTime() - 25 * day).toISOString(), updated_at: new Date(now.getTime() - 6 * day).toISOString() },
    { id: 'LC-008', company_name: 'Mitchell Development Corp', contact_name: 'James Mitchell', contact_email: 'james@mitchelldev.com', contact_phone: '+1 (555) 234-5678', project_type: 'Residential', project_description: 'Affordable housing complex. 300 units with community center and green spaces.', estimated_value: 28000000, stage: 'Site Visit', source: 'Referral', assigned_to: 'u2', location: 'Bronx, NY', probability: 35, expected_close_date: new Date(now.getTime() + 50 * day).toISOString(), tags: ['affordable-housing', 'community', 'government-grant'], notes: 'Second project with Mitchell. Site visit completed.', created_at: new Date(now.getTime() - 20 * day).toISOString(), updated_at: new Date(now.getTime() - 7 * day).toISOString() },
    { id: 'LC-009', company_name: 'West Coast Builders', contact_name: 'Daniel White', contact_email: 'daniel@westcoastbuild.com', contact_phone: '+1 (555) 012-3456', project_type: 'Infrastructure', project_description: 'Highway interchange reconstruction. Complex phasing required.', estimated_value: 85000000, stage: 'New Lead', source: 'Direct', assigned_to: 'u4', location: 'Los Angeles, CA', probability: 10, expected_close_date: new Date(now.getTime() + 180 * day).toISOString(), tags: ['highway', 'mega-project', 'west-coast'], notes: 'Cold outreach from CEO. Huge opportunity if we can handle West Coast logistics.', created_at: new Date(now.getTime() - 1 * day).toISOString(), updated_at: new Date(now.getTime() - 1 * day).toISOString() },
    { id: 'LC-010', company_name: 'Premier Construction Group', contact_name: 'Sophia Martinez', contact_email: 'sophia@premierconstruct.com', contact_phone: '+1 (555) 123-4567', project_type: 'Commercial', project_description: 'Shopping center renovation and expansion. 150,000 sq ft expansion with parking.', estimated_value: 22000000, stage: 'Bid Submitted', source: 'Partner', assigned_to: 'u5', location: 'Edison, NJ', probability: 65, expected_close_date: new Date(now.getTime() + 35 * day).toISOString(), tags: ['retail', 'renovation', 'expansion'], notes: 'Joint venture opportunity. Bid submitted with partner.', created_at: new Date(now.getTime() - 40 * day).toISOString(), updated_at: new Date(now.getTime() - 8 * day).toISOString() },
    { id: 'LC-011', company_name: 'Skyline Properties', contact_name: 'Lisa Park', contact_email: 'lisa@skylineproperties.com', contact_phone: '+1 (555) 345-6789', project_type: 'Residential', project_description: 'Waterfront luxury condos. 80 units with marina and infinity pool.', estimated_value: 65000000, stage: 'Contacted', source: 'Referral', assigned_to: 'u2', location: 'Long Island City, NY', probability: 20, expected_close_date: new Date(now.getTime() + 100 * day).toISOString(), tags: ['waterfront', 'luxury', 'amenities'], notes: 'Follow-up from LC-002. Lisa wants us for this too.', created_at: new Date(now.getTime() - 8 * day).toISOString(), updated_at: new Date(now.getTime() - 3 * day).toISOString() },
    { id: 'LC-012', company_name: 'City Government', contact_name: 'Amanda Foster', contact_email: 'amanda@citygov.gov', contact_phone: '+1 (555) 567-8901', project_type: 'Infrastructure', project_description: 'School modernization program. 15 schools across 5 boroughs.', estimated_value: 120000000, stage: 'New Lead', source: 'Direct', assigned_to: 'u4', location: 'New York, NY', probability: 10, expected_close_date: new Date(now.getTime() + 200 * day).toISOString(), tags: ['education', 'mega-project', 'government', 'multi-site'], notes: 'Massive RFP from DOE. Would be our largest project ever.', created_at: new Date(now.getTime() - 3 * day).toISOString(), updated_at: new Date(now.getTime() - 3 * day).toISOString() },
    { id: 'LC-013', company_name: 'BuildRight Inc', contact_name: 'Thomas Lee', contact_email: 'thomas@buildrightinc.com', contact_phone: '+1 (555) 678-9012', project_type: 'Commercial', project_description: 'Corporate headquarters buildout. 80,000 sq ft tech-enabled office.', estimated_value: 18000000, stage: 'Won', source: 'Referral', assigned_to: 'u5', location: 'Jersey City, NJ', probability: 100, expected_close_date: new Date(now.getTime() - 10 * day).toISOString(), tags: ['corporate', 'tech-enabled', 'won'], notes: 'Deal closed! Contract signed. Mobilization starts July 1.', created_at: new Date(now.getTime() - 90 * day).toISOString(), updated_at: new Date(now.getTime() - 10 * day).toISOString() },
    { id: 'LC-014', company_name: 'TechCorp Industries', contact_name: 'Jennifer Adams', contact_email: 'jennifer@techcorp.com', contact_phone: '+1 (555) 789-0123', project_type: 'Commercial', project_description: 'Innovation campus. 3 buildings with labs, offices, and maker spaces.', estimated_value: 75000000, stage: 'On Hold', source: 'Partner', assigned_to: 'u4', location: 'Austin, TX', probability: 15, expected_close_date: new Date(now.getTime() + 150 * day).toISOString(), tags: ['innovation', 'labs', 'campus', 'on-hold'], notes: 'Client delayed due to funding round. Revisit in Q4.', created_at: new Date(now.getTime() - 50 * day).toISOString(), updated_at: new Date(now.getTime() - 12 * day).toISOString() },
    { id: 'LC-015', company_name: 'Urban Living LLC', contact_name: 'Rachel Taylor', contact_email: 'rachel@urbanliving.com', contact_phone: '+1 (555) 901-2345', project_type: 'Renovation', project_description: 'Boutique hotel conversion from historic warehouse. 60 rooms.', estimated_value: 12000000, stage: 'Lost', source: 'Website', assigned_to: 'u2', location: 'SoHo, NY', probability: 0, expected_close_date: new Date(now.getTime() - 20 * day).toISOString(), tags: ['hospitality', 'historic', 'lost'], notes: 'Lost to competitor. They undercut by 15%. Need to review pricing.', created_at: new Date(now.getTime() - 70 * day).toISOString(), updated_at: new Date(now.getTime() - 20 * day).toISOString() },
  ];
  for (const l of leads) {
    const { error } = await supabase.from('leads').upsert(l, { onConflict: 'id' });
    if (error) console.error(`Error inserting lead ${l.id}:`, error.message);
  }
  console.log(`Inserted ${leads.length} leads`);

  // Activities
  const activities: Record<string, unknown>[] = [
    { id: 'a1', lead_id: 'LC-001', lead_name: 'Mitchell Development Corp', type: 'call', title: 'Discovery call with James Mitchell', description: 'Discussed project scope, timeline, and budget expectations. Very positive meeting.', timestamp: new Date(now.getTime() - 2 * day).toISOString(), user_id: 'u2', user_name: 'Sarah Chen', duration: 45 },
    { id: 'a2', lead_id: 'LC-002', lead_name: 'Skyline Properties', type: 'email', title: 'Bid proposal sent', description: 'Sent detailed bid for Class A office building. Included sustainability premium.', timestamp: new Date(now.getTime() - 5 * day).toISOString(), user_id: 'u2', user_name: 'Sarah Chen', duration: null },
    { id: 'a3', lead_id: 'LC-003', lead_name: 'City Government', type: 'meeting', title: 'Final pricing review meeting', description: 'Reviewed final pricing with city officials. Minor adjustments needed.', timestamp: new Date(now.getTime() - 1 * day).toISOString(), user_id: 'u4', user_name: 'Emily Watson', duration: 120 },
    { id: 'a4', lead_id: 'LC-004', lead_name: 'TechCorp Industries', type: 'site-visit', title: 'Site visit assessment', description: 'Toured the expansion site. Reviewed technical requirements with facilities team.', timestamp: new Date(now.getTime() - 3 * day).toISOString(), user_id: 'u5', user_name: 'David Kim', duration: 180 },
    { id: 'a5', lead_id: 'LC-005', lead_name: 'Urban Living LLC', type: 'note', title: 'Google Ads lead captured', description: 'Inbound inquiry from Google Ads campaign. High estimated value for Brooklyn luxury condos.', timestamp: new Date(now.getTime() - 2 * day).toISOString(), user_id: 'u2', user_name: 'Sarah Chen', duration: null },
    { id: 'a6', lead_id: 'LC-006', lead_name: 'BuildRight Inc', type: 'call', title: 'Initial outreach call', description: 'Called Thomas Lee to discuss historic hotel renovation. Scheduled intro meeting.', timestamp: new Date(now.getTime() - 4 * day).toISOString(), user_id: 'u5', user_name: 'David Kim', duration: 30 },
    { id: 'a7', lead_id: 'LC-007', lead_name: 'Greenfield Holdings', type: 'document', title: 'RFP received from Greenfield', description: 'Detailed RFP for office park development. 120 pages. Need to review thoroughly.', timestamp: new Date(now.getTime() - 6 * day).toISOString(), user_id: 'u4', user_name: 'Emily Watson', duration: null },
    { id: 'a8', lead_id: 'LC-001', lead_name: 'Mitchell Development Corp', type: 'meeting', title: 'Estimating kickoff meeting', description: 'Met with estimating team to review Mitchell tower project. Preliminary numbers look good.', timestamp: new Date(now.getTime() - 1 * day).toISOString(), user_id: 'u4', user_name: 'Emily Watson', duration: 90 },
    { id: 'a9', lead_id: 'LC-003', lead_name: 'City Government', type: 'email', title: 'Revised proposal submitted', description: 'Submitted revised pricing incorporating city feedback. Removed contingency items.', timestamp: new Date(now.getTime() - 1 * day).toISOString(), user_id: 'u4', user_name: 'Emily Watson', duration: null },
    { id: 'a10', lead_id: 'LC-009', lead_name: 'West Coast Builders', type: 'call', title: 'CEO introduction call', description: 'Spoke with Daniel White about mega highway project. Very interested in our heavy civil experience.', timestamp: new Date(now.getTime() - 1 * day).toISOString(), user_id: 'u4', user_name: 'Emily Watson', duration: 60 },
    { id: 'a11', lead_id: 'LC-002', lead_name: 'Skyline Properties', type: 'call', title: 'Bid follow-up call', description: 'Lisa confirmed review committee meets next week. Feeling confident about our chances.', timestamp: new Date(now.getTime() - 1 * day).toISOString(), user_id: 'u2', user_name: 'Sarah Chen', duration: 20 },
    { id: 'a12', lead_id: 'LC-008', lead_name: 'Mitchell Development Corp', type: 'site-visit', title: 'Bronx affordable housing site visit', description: 'Toured the site with James and his team. Community board meeting went well.', timestamp: new Date(now.getTime() - 7 * day).toISOString(), user_id: 'u2', user_name: 'Sarah Chen', duration: 150 },
  ];
  for (const a of activities) {
    const { error } = await supabase.from('activities').upsert(a, { onConflict: 'id' });
    if (error) console.error(`Error inserting activity ${a.id}:`, error.message);
  }
  console.log(`Inserted ${activities.length} activities`);

  // Tasks
  const tasks = [
    { id: 't1', lead_id: 'LC-001', lead_name: 'Mitchell Development Corp', title: 'Complete estimating for Mitchell tower', description: 'Finalize cost estimates for 40-story mixed-use tower.', due_date: new Date(now.getTime() + 3 * day).toISOString(), status: 'in-progress', priority: 'high', assigned_to: 'u3', created_at: new Date(now.getTime() - 5 * day).toISOString() },
    { id: 't2', lead_id: 'LC-002', lead_name: 'Skyline Properties', title: 'Follow up on bid submission', description: 'Call Lisa to confirm bid review timeline.', due_date: new Date(now.getTime() + 1 * day).toISOString(), status: 'pending', priority: 'medium', assigned_to: 'u2', created_at: new Date(now.getTime() - 3 * day).toISOString() },
    { id: 't3', lead_id: 'LC-003', lead_name: 'City Government', title: 'Finalize contract terms', description: 'Prepare final contract documents for city bridge project.', due_date: new Date(now.getTime() + 5 * day).toISOString(), status: 'in-progress', priority: 'high', assigned_to: 'u4', created_at: new Date(now.getTime() - 2 * day).toISOString() },
    { id: 't4', lead_id: 'LC-004', lead_name: 'TechCorp Industries', title: 'Schedule data center site visit', description: 'Coordinate with Jennifer for team visit to San Jose.', due_date: new Date(now.getTime() + 7 * day).toISOString(), status: 'pending', priority: 'medium', assigned_to: 'u5', created_at: new Date(now.getTime() - 1 * day).toISOString() },
    { id: 't5', lead_id: 'LC-005', lead_name: 'Urban Living LLC', title: 'Send introductory packet', description: 'Email company portfolio and case studies to Rachel.', due_date: new Date(now.getTime() + 2 * day).toISOString(), status: 'overdue', priority: 'high', assigned_to: 'u2', created_at: new Date(now.getTime() - 4 * day).toISOString() },
    { id: 't6', lead_id: 'LC-007', lead_name: 'Greenfield Holdings', title: 'Review RFP requirements', description: 'Go through 120-page RFP and create response plan.', due_date: new Date(now.getTime() + 4 * day).toISOString(), status: 'in-progress', priority: 'high', assigned_to: 'u4', created_at: new Date(now.getTime() - 6 * day).toISOString() },
    { id: 't7', lead_id: 'LC-010', lead_name: 'Premier Construction Group', title: 'Coordinate JV agreement', description: 'Work with partner on joint venture terms for shopping center.', due_date: new Date(now.getTime() + 6 * day).toISOString(), status: 'pending', priority: 'medium', assigned_to: 'u5', created_at: new Date(now.getTime() - 2 * day).toISOString() },
    { id: 't8', lead_id: 'LC-012', lead_name: 'City Government', title: 'Prepare DOE proposal team', description: 'Assemble team for school modernization mega-RFP.', due_date: new Date(now.getTime() + 10 * day).toISOString(), status: 'pending', priority: 'urgent', assigned_to: 'u4', created_at: new Date(now.getTime() - 1 * day).toISOString() },
    { id: 't9', lead_id: 'LC-011', lead_name: 'Skyline Properties', title: 'Schedule waterfront site tour', description: 'Arrange site visit for Long Island City waterfront project.', due_date: new Date(now.getTime() + 3 * day).toISOString(), status: 'pending', priority: 'medium', assigned_to: 'u2', created_at: new Date(now.getTime() - 1 * day).toISOString() },
    { id: 't10', lead_id: 'LC-013', lead_name: 'BuildRight Inc', title: 'Kick off BuildRight HQ project', description: 'Schedule mobilization meeting for Jersey City project.', due_date: new Date(now.getTime() - 2 * day).toISOString(), status: 'completed', priority: 'high', assigned_to: 'u5', created_at: new Date(now.getTime() - 15 * day).toISOString() },
  ];
  for (const t of tasks) {
    const { error } = await supabase.from('tasks').upsert(t, { onConflict: 'id' });
    if (error) console.error(`Error inserting task ${t.id}:`, error.message);
  }
  console.log(`Inserted ${tasks.length} tasks`);

  // Bids
  const bids = [
    { id: 'B-001', lead_id: 'LC-002', lead_name: 'Skyline Properties', amount: 28000000, status: 'submitted', submitted_date: new Date(now.getTime() - 5 * day).toISOString(), valid_until: new Date(now.getTime() + 25 * day).toISOString(), notes: 'LEED Gold premium included. Valid for 30 days.', created_at: new Date(now.getTime() - 10 * day).toISOString() },
    { id: 'B-002', lead_id: 'LC-010', lead_name: 'Premier Construction Group', amount: 22000000, status: 'submitted', submitted_date: new Date(now.getTime() - 8 * day).toISOString(), valid_until: new Date(now.getTime() + 22 * day).toISOString(), notes: 'JV bid with Premier Construction. 50/50 split.', created_at: new Date(now.getTime() - 12 * day).toISOString() },
    { id: 'B-003', lead_id: 'LC-013', lead_name: 'BuildRight Inc', amount: 18000000, status: 'accepted', submitted_date: new Date(now.getTime() - 60 * day).toISOString(), valid_until: new Date(now.getTime() - 30 * day).toISOString(), notes: 'Won! Contract signed May 15.', created_at: new Date(now.getTime() - 70 * day).toISOString() },
  ];
  for (const b of bids) {
    const { error } = await supabase.from('bids').upsert(b, { onConflict: 'id' });
    if (error) console.error(`Error inserting bid ${b.id}:`, error.message);
  }
  console.log(`Inserted ${bids.length} bids`);

  // Bid Items
  const bidItems = [
    { id: 'bi1', bid_id: 'B-001', description: 'Foundation & Structure', quantity: 1, unit: 'lot', unit_price: 12000000, total: 12000000 },
    { id: 'bi2', bid_id: 'B-001', description: 'MEP Systems', quantity: 1, unit: 'lot', unit_price: 8000000, total: 8000000 },
    { id: 'bi3', bid_id: 'B-001', description: 'Interior Fit-out', quantity: 200000, unit: 'sqft', unit_price: 40, total: 8000000 },
    { id: 'bi4', bid_id: 'B-002', description: 'Demolition & Site Prep', quantity: 1, unit: 'lot', unit_price: 3000000, total: 3000000 },
    { id: 'bi5', bid_id: 'B-002', description: 'Structural Expansion', quantity: 150000, unit: 'sqft', unit_price: 80, total: 12000000 },
    { id: 'bi6', bid_id: 'B-002', description: 'MEP & Systems', quantity: 1, unit: 'lot', unit_price: 7000000, total: 7000000 },
    { id: 'bi7', bid_id: 'B-003', description: 'Corporate Office Buildout', quantity: 80000, unit: 'sqft', unit_price: 150, total: 12000000 },
    { id: 'bi8', bid_id: 'B-003', description: 'Technology Infrastructure', quantity: 1, unit: 'lot', unit_price: 3500000, total: 3500000 },
    { id: 'bi9', bid_id: 'B-003', description: 'Furniture & Fixtures', quantity: 1, unit: 'lot', unit_price: 2500000, total: 2500000 },
  ];
  for (const bi of bidItems) {
    const { error } = await supabase.from('bid_items').upsert(bi, { onConflict: 'id' });
    if (error) console.error(`Error inserting bid_item ${bi.id}:`, error.message);
  }
  console.log(`Inserted ${bidItems.length} bid items`);

  console.log('Seed complete!');
}

seed().catch(console.error);
