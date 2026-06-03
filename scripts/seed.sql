-- Construction CRM Seed Data
-- Paste this into Supabase SQL Editor and run

-- Disable RLS temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE bids DISABLE ROW LEVEL SECURITY;
ALTER TABLE bid_items DISABLE ROW LEVEL SECURITY;

-- Clear existing data
DELETE FROM bid_items;
DELETE FROM bids;
DELETE FROM activities;
DELETE FROM tasks;
DELETE FROM leads;
DELETE FROM companies;
DELETE FROM contacts;
DELETE FROM users;

-- Reset bid_items sequence
ALTER SEQUENCE bid_items_id_seq RESTART WITH 1;

-- Users
INSERT INTO users (id, name, email, role, status, last_active) VALUES
  ('u1', 'John Sterling', 'john@royaleconstruction.com', 'admin', 'active', now()),
  ('u2', 'Sarah Chen', 'sarah@royaleconstruction.com', 'sales', 'active', now() - interval '1 hour'),
  ('u3', 'Mike Rodriguez', 'mike@royaleconstruction.com', 'estimator', 'active', now() - interval '2 hours'),
  ('u4', 'Emily Watson', 'emily@royaleconstruction.com', 'manager', 'active', now() - interval '1 day'),
  ('u5', 'David Kim', 'david@royaleconstruction.com', 'sales', 'active', now() - interval '2 days');

-- Contacts
INSERT INTO contacts (id, name, email, phone, company, role, created_at) VALUES
  ('c1', 'James Mitchell', 'james@mitchelldev.com', '+1 (555) 234-5678', 'Mitchell Development Corp', 'CEO', now() - interval '200 days'),
  ('c2', 'Lisa Park', 'lisa@skylineproperties.com', '+1 (555) 345-6789', 'Skyline Properties', 'Director of Operations', now() - interval '185 days'),
  ('c3', 'Robert Garcia', 'robert@garciaarchitecture.com', '+1 (555) 456-7890', 'Garcia Architecture', 'Principal Architect', now() - interval '175 days'),
  ('c4', 'Amanda Foster', 'amanda@citygov.gov', '+1 (555) 567-8901', 'City Government', 'Project Manager', now() - interval '150 days'),
  ('c5', 'Thomas Lee', 'thomas@buildrightinc.com', '+1 (555) 678-9012', 'BuildRight Inc', 'VP Construction', now() - interval '130 days'),
  ('c6', 'Jennifer Adams', 'jennifer@techcorp.com', '+1 (555) 789-0123', 'TechCorp Industries', 'Facilities Director', now() - interval '120 days'),
  ('c7', 'Marcus Brown', 'marcus@greenfield.com', '+1 (555) 890-1234', 'Greenfield Holdings', 'Managing Partner', now() - interval '110 days'),
  ('c8', 'Rachel Taylor', 'rachel@urbanliving.com', '+1 (555) 901-2345', 'Urban Living LLC', 'Development Manager', now() - interval '100 days'),
  ('c9', 'Daniel White', 'daniel@westcoastbuild.com', '+1 (555) 012-3456', 'West Coast Builders', 'Operations Director', now() - interval '90 days'),
  ('c10', 'Sophia Martinez', 'sophia@premierconstruct.com', '+1 (555) 123-4567', 'Premier Construction Group', 'Business Development', now() - interval '85 days');

-- Companies
INSERT INTO companies (id, name, industry, website, phone, email, address, contact_count, deal_count, total_value, created_at) VALUES
  ('co1', 'Mitchell Development Corp', 'Real Estate Development', 'mitchelldev.com', '+1 (555) 234-5678', 'info@mitchelldev.com', '100 Park Ave, New York, NY', 3, 4, 8500000, now() - interval '200 days'),
  ('co2', 'Skyline Properties', 'Commercial Real Estate', 'skylineproperties.com', '+1 (555) 345-6789', 'info@skylineproperties.com', '250 Broadway, New York, NY', 2, 3, 12300000, now() - interval '185 days'),
  ('co3', 'Garcia Architecture', 'Architecture', 'garciaarchitecture.com', '+1 (555) 456-7890', 'hello@garciaarchitecture.com', '75 5th Ave, New York, NY', 1, 2, 3200000, now() - interval '175 days'),
  ('co4', 'City Government', 'Government', 'citygov.gov', '+1 (555) 567-8901', 'projects@citygov.gov', '1 City Hall Plaza, New York, NY', 2, 2, 15000000, now() - interval '150 days'),
  ('co5', 'BuildRight Inc', 'Construction', 'buildrightinc.com', '+1 (555) 678-9012', 'info@buildrightinc.com', '450 Industrial Blvd, Brooklyn, NY', 2, 3, 6700000, now() - interval '130 days'),
  ('co6', 'TechCorp Industries', 'Technology', 'techcorp.com', '+1 (555) 789-0123', 'facilities@techcorp.com', '1 Tech Park, Silicon Valley, CA', 1, 2, 9800000, now() - interval '120 days'),
  ('co7', 'Greenfield Holdings', 'Investment', 'greenfield.com', '+1 (555) 890-1234', 'investments@greenfield.com', '200 Sand Hill Rd, Menlo Park, CA', 1, 1, 4500000, now() - interval '110 days'),
  ('co8', 'Urban Living LLC', 'Residential Development', 'urbanliving.com', '+1 (555) 901-2345', 'dev@urbanliving.com', '888 Brannan St, San Francisco, CA', 1, 2, 7200000, now() - interval '100 days');

-- Leads
INSERT INTO leads (id, company_name, contact_name, contact_email, contact_phone, project_type, project_description, estimated_value, stage, source, assigned_to, location, probability, expected_close_date, tags, notes, created_at, updated_at) VALUES
  ('LC-001', 'Mitchell Development Corp', 'James Mitchell', 'james@mitchelldev.com', '+1 (555) 234-5678', 'Commercial', '40-story mixed-use tower in Midtown Manhattan. Ground floor retail, 2-20 offices, 21-40 luxury condos.', 45000000, 'Estimating', 'Referral', 'u2', 'Midtown Manhattan, NY', 50, now() + interval '45 days', '{high-value,mixed-use,priority}', 'Met James at RE Conference. Very interested in our commercial experience.', now() - interval '30 days', now() - interval '2 days'),
  ('LC-002', 'Skyline Properties', 'Lisa Park', 'lisa@skylineproperties.com', '+1 (555) 345-6789', 'Commercial', 'Class A office building with sustainable design. LEED Gold certification required.', 28000000, 'Bid Submitted', 'Website', 'u2', 'Hudson Yards, NY', 65, now() + interval '30 days', '{sustainable,LEED,class-a}', 'Strong relationship with PM. Bid submitted on June 1.', now() - interval '45 days', now() - interval '5 days'),
  ('LC-003', 'City Government', 'Amanda Foster', 'amanda@citygov.gov', '+1 (555) 567-8901', 'Infrastructure', 'Bridge rehabilitation and widening. Historic structure requiring careful restoration.', 18500000, 'Negotiating', 'Direct', 'u4', 'East River Bridge, NY', 75, now() + interval '20 days', '{government,infrastructure,historic}', 'Government contract. Final negotiations on pricing.', now() - interval '60 days', now() - interval '1 day'),
  ('LC-004', 'TechCorp Industries', 'Jennifer Adams', 'jennifer@techcorp.com', '+1 (555) 789-0123', 'Industrial', 'Data center expansion. 50,000 sq ft with redundant power and cooling systems.', 32000000, 'Site Visit', 'Partner', 'u5', 'San Jose, CA', 35, now() + interval '90 days', '{data-center,tech,west-coast}', 'Site visit scheduled for next week. Need to fly team out.', now() - interval '15 days', now() - interval '3 days'),
  ('LC-005', 'Urban Living LLC', 'Rachel Taylor', 'rachel@urbanliving.com', '+1 (555) 901-2345', 'Residential', 'Luxury condo development. 120 units across 3 buildings with rooftop amenities.', 52000000, 'New Lead', 'Google Ads', 'u2', 'Brooklyn, NY', 10, now() + interval '120 days', '{luxury,residential,large-scale}', 'Inbound from Google Ads campaign. High estimated value.', now() - interval '2 days', now() - interval '2 days'),
  ('LC-006', 'BuildRight Inc', 'Thomas Lee', 'thomas@buildrightinc.com', '+1 (555) 678-9012', 'Renovation', 'Historic hotel renovation. 200 rooms, lobby, restaurant, and conference center.', 15800000, 'Contacted', 'Referral', 'u5', 'Upper East Side, NY', 20, now() + interval '75 days', '{renovation,hospitality,historic}', 'Referred by Garcia Architecture. Initial call scheduled.', now() - interval '10 days', now() - interval '4 days'),
  ('LC-007', 'Greenfield Holdings', 'Marcus Brown', 'marcus@greenfield.com', '+1 (555) 890-1234', 'Commercial', 'Office park development. 3 buildings, 200,000 sq ft total with parking structure.', 42000000, 'Estimating', 'Event', 'u4', 'Stamford, CT', 50, now() + interval '60 days', '{office-park,suburban,large-scale}', 'Met at Construction Expo. Very detailed RFP received.', now() - interval '25 days', now() - interval '6 days'),
  ('LC-008', 'Mitchell Development Corp', 'James Mitchell', 'james@mitchelldev.com', '+1 (555) 234-5678', 'Residential', 'Affordable housing complex. 300 units with community center and green spaces.', 28000000, 'Site Visit', 'Referral', 'u2', 'Bronx, NY', 35, now() + interval '50 days', '{affordable-housing,community,government-grant}', 'Second project with Mitchell. Site visit completed.', now() - interval '20 days', now() - interval '7 days'),
  ('LC-009', 'West Coast Builders', 'Daniel White', 'daniel@westcoastbuild.com', '+1 (555) 012-3456', 'Infrastructure', 'Highway interchange reconstruction. Complex phasing required.', 85000000, 'New Lead', 'Direct', 'u4', 'Los Angeles, CA', 10, now() + interval '180 days', '{highway,mega-project,west-coast}', 'Cold outreach from CEO. Huge opportunity if we can handle West Coast logistics.', now() - interval '1 day', now() - interval '1 day'),
  ('LC-010', 'Premier Construction Group', 'Sophia Martinez', 'sophia@premierconstruct.com', '+1 (555) 123-4567', 'Commercial', 'Shopping center renovation and expansion. 150,000 sq ft expansion with parking.', 22000000, 'Bid Submitted', 'Partner', 'u5', 'Edison, NJ', 65, now() + interval '35 days', '{retail,renovation,expansion}', 'Joint venture opportunity. Bid submitted with partner.', now() - interval '40 days', now() - interval '8 days'),
  ('LC-011', 'Skyline Properties', 'Lisa Park', 'lisa@skylineproperties.com', '+1 (555) 345-6789', 'Residential', 'Waterfront luxury condos. 80 units with marina and infinity pool.', 65000000, 'Contacted', 'Referral', 'u2', 'Long Island City, NY', 20, now() + interval '100 days', '{waterfront,luxury,amenities}', 'Follow-up from LC-002. Lisa wants us for this too.', now() - interval '8 days', now() - interval '3 days'),
  ('LC-012', 'City Government', 'Amanda Foster', 'amanda@citygov.gov', '+1 (555) 567-8901', 'Infrastructure', 'School modernization program. 15 schools across 5 boroughs.', 120000000, 'New Lead', 'Direct', 'u4', 'New York, NY', 10, now() + interval '200 days', '{education,mega-project,government,multi-site}', 'Massive RFP from DOE. Would be our largest project ever.', now() - interval '3 days', now() - interval '3 days'),
  ('LC-013', 'BuildRight Inc', 'Thomas Lee', 'thomas@buildrightinc.com', '+1 (555) 678-9012', 'Commercial', 'Corporate headquarters buildout. 80,000 sq ft tech-enabled office.', 18000000, 'Won', 'Referral', 'u5', 'Jersey City, NJ', 100, now() - interval '10 days', '{corporate,tech-enabled,won}', 'Deal closed! Contract signed. Mobilization starts July 1.', now() - interval '90 days', now() - interval '10 days'),
  ('LC-014', 'TechCorp Industries', 'Jennifer Adams', 'jennifer@techcorp.com', '+1 (555) 789-0123', 'Commercial', 'Innovation campus. 3 buildings with labs, offices, and maker spaces.', 75000000, 'On Hold', 'Partner', 'u4', 'Austin, TX', 15, now() + interval '150 days', '{innovation,labs,campus,on-hold}', 'Client delayed due to funding round. Revisit in Q4.', now() - interval '50 days', now() - interval '12 days'),
  ('LC-015', 'Urban Living LLC', 'Rachel Taylor', 'rachel@urbanliving.com', '+1 (555) 901-2345', 'Renovation', 'Boutique hotel conversion from historic warehouse. 60 rooms.', 12000000, 'Lost', 'Website', 'u2', 'SoHo, NY', 0, now() - interval '20 days', '{hospitality,historic,lost}', 'Lost to competitor. They undercut by 15%. Need to review pricing.', now() - interval '70 days', now() - interval '20 days');

-- Activities
INSERT INTO activities (id, lead_id, lead_name, type, title, description, timestamp, user_id, user_name, duration) VALUES
  ('a1', 'LC-001', 'Mitchell Development Corp', 'call', 'Discovery call with James Mitchell', 'Discussed project scope, timeline, and budget expectations. Very positive meeting.', now() - interval '2 days', 'u2', 'Sarah Chen', 45),
  ('a2', 'LC-002', 'Skyline Properties', 'email', 'Bid proposal sent', 'Sent detailed bid for Class A office building. Included sustainability premium.', now() - interval '5 days', 'u2', 'Sarah Chen', NULL),
  ('a3', 'LC-003', 'City Government', 'meeting', 'Final pricing review meeting', 'Reviewed final pricing with city officials. Minor adjustments needed.', now() - interval '1 day', 'u4', 'Emily Watson', 120),
  ('a4', 'LC-004', 'TechCorp Industries', 'site-visit', 'Site visit assessment', 'Toured the expansion site. Reviewed technical requirements with facilities team.', now() - interval '3 days', 'u5', 'David Kim', 180),
  ('a5', 'LC-005', 'Urban Living LLC', 'note', 'Google Ads lead captured', 'Inbound inquiry from Google Ads campaign. High estimated value for Brooklyn luxury condos.', now() - interval '2 days', 'u2', 'Sarah Chen', NULL),
  ('a6', 'LC-006', 'BuildRight Inc', 'call', 'Initial outreach call', 'Called Thomas Lee to discuss historic hotel renovation. Scheduled intro meeting.', now() - interval '4 days', 'u5', 'David Kim', 30),
  ('a7', 'LC-007', 'Greenfield Holdings', 'document', 'RFP received from Greenfield', 'Detailed RFP for office park development. 120 pages. Need to review thoroughly.', now() - interval '6 days', 'u4', 'Emily Watson', NULL),
  ('a8', 'LC-001', 'Mitchell Development Corp', 'meeting', 'Estimating kickoff meeting', 'Met with estimating team to review Mitchell tower project. Preliminary numbers look good.', now() - interval '1 day', 'u4', 'Emily Watson', 90),
  ('a9', 'LC-003', 'City Government', 'email', 'Revised proposal submitted', 'Submitted revised pricing incorporating city feedback. Removed contingency items.', now() - interval '1 day', 'u4', 'Emily Watson', NULL),
  ('a10', 'LC-009', 'West Coast Builders', 'call', 'CEO introduction call', 'Spoke with Daniel White about mega highway project. Very interested in our heavy civil experience.', now() - interval '1 day', 'u4', 'Emily Watson', 60),
  ('a11', 'LC-002', 'Skyline Properties', 'call', 'Bid follow-up call', 'Lisa confirmed review committee meets next week. Feeling confident about our chances.', now() - interval '1 day', 'u2', 'Sarah Chen', 20),
  ('a12', 'LC-008', 'Mitchell Development Corp', 'site-visit', 'Bronx affordable housing site visit', 'Toured the site with James and his team. Community board meeting went well.', now() - interval '7 days', 'u2', 'Sarah Chen', 150);

-- Tasks
INSERT INTO tasks (id, lead_id, lead_name, title, description, due_date, status, priority, assigned_to, created_at) VALUES
  ('t1', 'LC-001', 'Mitchell Development Corp', 'Complete estimating for Mitchell tower', 'Finalize cost estimates for 40-story mixed-use tower.', now() + interval '3 days', 'in-progress', 'high', 'u3', now() - interval '5 days'),
  ('t2', 'LC-002', 'Skyline Properties', 'Follow up on bid submission', 'Call Lisa to confirm bid review timeline.', now() + interval '1 day', 'pending', 'medium', 'u2', now() - interval '3 days'),
  ('t3', 'LC-003', 'City Government', 'Finalize contract terms', 'Prepare final contract documents for city bridge project.', now() + interval '5 days', 'in-progress', 'high', 'u4', now() - interval '2 days'),
  ('t4', 'LC-004', 'TechCorp Industries', 'Schedule data center site visit', 'Coordinate with Jennifer for team visit to San Jose.', now() + interval '7 days', 'pending', 'medium', 'u5', now() - interval '1 day'),
  ('t5', 'LC-005', 'Urban Living LLC', 'Send introductory packet', 'Email company portfolio and case studies to Rachel.', now() + interval '2 days', 'overdue', 'high', 'u2', now() - interval '4 days'),
  ('t6', 'LC-007', 'Greenfield Holdings', 'Review RFP requirements', 'Go through 120-page RFP and create response plan.', now() + interval '4 days', 'in-progress', 'high', 'u4', now() - interval '6 days'),
  ('t7', 'LC-010', 'Premier Construction Group', 'Coordinate JV agreement', 'Work with partner on joint venture terms for shopping center.', now() + interval '6 days', 'pending', 'medium', 'u5', now() - interval '2 days'),
  ('t8', 'LC-012', 'City Government', 'Prepare DOE proposal team', 'Assemble team for school modernization mega-RFP.', now() + interval '10 days', 'pending', 'urgent', 'u4', now() - interval '1 day'),
  ('t9', 'LC-011', 'Skyline Properties', 'Schedule waterfront site tour', 'Arrange site visit for Long Island City waterfront project.', now() + interval '3 days', 'pending', 'medium', 'u2', now() - interval '1 day'),
  ('t10', 'LC-013', 'BuildRight Inc', 'Kick off BuildRight HQ project', 'Schedule mobilization meeting for Jersey City project.', now() - interval '2 days', 'completed', 'high', 'u5', now() - interval '15 days');

-- Bids
INSERT INTO bids (id, lead_id, lead_name, amount, status, submitted_date, valid_until, notes, created_at) VALUES
  ('B-001', 'LC-002', 'Skyline Properties', 28000000, 'submitted', now() - interval '5 days', now() + interval '25 days', 'LEED Gold premium included. Valid for 30 days.', now() - interval '10 days'),
  ('B-002', 'LC-010', 'Premier Construction Group', 22000000, 'submitted', now() - interval '8 days', now() + interval '22 days', 'JV bid with Premier Construction. 50/50 split.', now() - interval '12 days'),
  ('B-003', 'LC-013', 'BuildRight Inc', 18000000, 'accepted', now() - interval '60 days', now() - interval '30 days', 'Won! Contract signed May 15.', now() - interval '70 days');

-- Bid Items (auto-increment id)
INSERT INTO bid_items (bid_id, description, quantity, unit, unit_price, total) VALUES
  ('B-001', 'Foundation & Structure', 1, 'lot', 12000000, 12000000),
  ('B-001', 'MEP Systems', 1, 'lot', 8000000, 8000000),
  ('B-001', 'Interior Fit-out', 200000, 'sqft', 40, 8000000),
  ('B-002', 'Demolition & Site Prep', 1, 'lot', 3000000, 3000000),
  ('B-002', 'Structural Expansion', 150000, 'sqft', 80, 12000000),
  ('B-002', 'MEP & Systems', 1, 'lot', 7000000, 7000000),
  ('B-003', 'Corporate Office Buildout', 80000, 'sqft', 150, 12000000),
  ('B-003', 'Technology Infrastructure', 1, 'lot', 3500000, 3500000),
  ('B-003', 'Furniture & Fixtures', 1, 'lot', 2500000, 2500000);

-- Re-enable RLS with permissive policies for anon key
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe to run multiple times)
DROP POLICY IF EXISTS "anon_all" ON users;
DROP POLICY IF EXISTS "anon_all" ON contacts;
DROP POLICY IF EXISTS "anon_all" ON companies;
DROP POLICY IF EXISTS "anon_all" ON leads;
DROP POLICY IF EXISTS "anon_all" ON activities;
DROP POLICY IF EXISTS "anon_all" ON tasks;
DROP POLICY IF EXISTS "anon_all" ON bids;
DROP POLICY IF EXISTS "anon_all" ON bid_items;

-- Allow anon key full access on all tables (demo app only!)
CREATE POLICY "anon_all" ON users FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON contacts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON companies FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON leads FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON activities FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON tasks FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON bids FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON bid_items FOR ALL TO anon USING (true) WITH CHECK (true);
