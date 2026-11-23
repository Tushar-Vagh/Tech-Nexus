-- Run this in Supabase SQL Editor to grant permissions to anon and service_role:

-- 1. Grant usage on schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Grant table permissions
GRANT ALL ON TABLE public."Post" TO anon, authenticated, service_role;
GRANT ALL ON TABLE public."Category" TO anon, authenticated, service_role;
GRANT ALL ON TABLE public."User" TO anon, authenticated, service_role;

-- 3. Grant sequence permissions (for auto-increment IDs)
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 4. Enable Row Level Security (RLS) with permissive read policies
ALTER TABLE public."Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Allow everyone (anon and authenticated) to read published posts and categories
CREATE POLICY "Allow public read on Post" ON public."Post"
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on Category" ON public."Category"
  FOR SELECT USING (true);

-- Allow service_role and authenticated full access for admin CRUD operations
CREATE POLICY "Allow full access on Post for all" ON public."Post"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access on Category for all" ON public."Category"
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access on User for all" ON public."User"
  FOR ALL USING (true) WITH CHECK (true);
