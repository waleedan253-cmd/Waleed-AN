-- ============================================================
-- WALEED AN Portfolio — Supabase Database Schema
-- Run this entire file in Supabase SQL Editor (one time only)
-- ============================================================


-- ------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------
create extension if not exists "uuid-ossp";   -- For gen_random_uuid()
create extension if not exists "pgcrypto";    -- Extra crypto helpers


-- ------------------------------------------------------------
-- PROJECTS TABLE
-- ------------------------------------------------------------
create table if not exists public.projects (
  id                 uuid          primary key default gen_random_uuid(),
  title              text          not null,
  description        text          not null,
  short_description  text          not null check (char_length(short_description) <= 160),
  image_url          text          not null default '',
  live_demo_url      text,
  github_url         text,
  tech_stack         text[]        not null default '{}',
  category           text          not null default 'fullstack'
                       check (category in (
                         'ai-saas',
                         'fullstack',
                         'frontend',
                         'erp-pos',
                         'api-integration'
                       )),
  published          boolean       not null default false,
  featured           boolean       not null default false,
  published_date     date          not null default current_date,
  created_at         timestamptz   not null default now(),
  updated_at         timestamptz   not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();


-- ------------------------------------------------------------
-- CONTACT MESSAGES TABLE
-- Stores every message from your contact form
-- ------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null,
  subject     text        not null,
  message     text        not null,
  budget      text,
  read        boolean     not null default false,
  created_at  timestamptz not null default now()
);


-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- Controls who can read/write each table
-- ------------------------------------------------------------

-- Enable RLS on both tables
alter table public.projects          enable row level security;
alter table public.contact_messages  enable row level security;


-- PROJECTS policies:
-- Public visitors → can only read published projects
create policy "Public can read published projects"
  on public.projects
  for select
  using (published = true);

-- Authenticated admin → full access (select, insert, update, delete)
create policy "Admin has full access to projects"
  on public.projects
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- CONTACT MESSAGES policies:
-- Anyone can insert (submit the form)
create policy "Anyone can submit contact form"
  on public.contact_messages
  for insert
  with check (true);

-- Only authenticated admin can read messages
create policy "Admin can read contact messages"
  on public.contact_messages
  for select
  using (auth.role() = 'authenticated');

-- Admin can mark messages as read
create policy "Admin can update contact messages"
  on public.contact_messages
  for update
  using (auth.role() = 'authenticated');


-- ------------------------------------------------------------
-- STORAGE BUCKET — Project Images
-- ------------------------------------------------------------

-- Create the bucket (run in SQL editor)
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Anyone can view images (public bucket)
create policy "Public can view project images"
  on storage.objects
  for select
  using (bucket_id = 'project-images');

-- Only authenticated admin can upload images
create policy "Admin can upload project images"
  on storage.objects
  for insert
  with check (
    bucket_id = 'project-images'
    and auth.role() = 'authenticated'
  );

-- Only authenticated admin can update images
create policy "Admin can update project images"
  on storage.objects
  for update
  using (
    bucket_id = 'project-images'
    and auth.role() = 'authenticated'
  );

-- Only authenticated admin can delete images
create policy "Admin can delete project images"
  on storage.objects
  for delete
  using (
    bucket_id = 'project-images'
    and auth.role() = 'authenticated'
  );


-- ------------------------------------------------------------
-- SEED DATA — Your real projects to start with
-- ------------------------------------------------------------
insert into public.projects (
  title,
  description,
  short_description,
  image_url,
  live_demo_url,
  github_url,
  tech_stack,
  category,
  published,
  featured,
  published_date
) values
(
  'SahiScreen — AI CV Screening Platform',
  'Architected an AI-powered CV screening platform for Pakistani HR teams. Uses Anthropic Claude API with structured prompt engineering to score candidates, detect red flags, and identify AI-generated content. Features schema-validated output, real-time scoring dashboard, and bulk CV processing.',
  'AI-powered CV screening for Pakistani HR teams using Anthropic Claude API.',
  '',
  'https://sahihrx.com/',
  null,
  array['Next.js', 'TypeScript', 'Anthropic Claude API', 'Supabase', 'Node.js', 'React', 'Tailwind CSS'],
  'ai-saas',
  true,
  true,
  '2025-11-01'
),
(
  'PromptMinds AI',
  'AI-powered SaaS platform for education and tutoring. Helps students learn faster with intelligent explanations, quiz generation, and personalized study plans powered by large language models.',
  'AI-powered education and tutoring SaaS platform with LLM integration.',
  '',
  null,
  null,
  array['Next.js', 'TypeScript', 'OpenAI API', 'Supabase', 'React', 'Tailwind CSS'],
  'ai-saas',
  true,
  false,
  '2025-12-01'
),
(
  'PakMentor AI',
  'AI-powered mentoring and tutoring platform tailored for Pakistani students. Provides career guidance, skill roadmaps, and AI-driven learning recommendations.',
  'AI mentoring platform for Pakistani students with career guidance features.',
  '',
  null,
  null,
  array['Next.js', 'TypeScript', 'Grok API', 'Supabase', 'React'],
  'ai-saas',
  true,
  false,
  '2025-12-15'
);


-- ------------------------------------------------------------
-- USEFUL QUERIES (for reference — do not run as setup)
-- ------------------------------------------------------------

-- Get all published projects newest first:
-- select * from projects where published = true order by published_date desc;

-- Get featured projects for homepage:
-- select * from projects where published = true and featured = true;

-- Get unread contact messages:
-- select * from contact_messages where read = false order by created_at desc;

-- Mark message as read:
-- update contact_messages set read = true where id = 'your-uuid-here';

-- Run in Supabase SQL Editor
ALTER TABLE projects 
RENAME COLUMN live_demo_url TO live_url;-- Check bucket was created
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'project-images';

-- Check policies were created
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%project images%';
-- Run in Supabase SQL Editor
ALTER TABLE projects 
RENAME COLUMN live_demo_url TO live_url;

-- OR if column doesn't exist yet:
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS live_url TEXT;-- Set user as admin in auth.users metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'),
  '{role}',
  '"admin"'
)
WHERE id = '2131d651-d368-44e0-abc1-eb51b4db7526';