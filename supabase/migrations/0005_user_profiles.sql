-- Migration 0005: User Profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL,
  work_email text NOT NULL,
  company_name text NOT NULL,
  company_website text,
  team_size text,
  website_platform text,
  industry text,
  monthly_visitors text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS and add permissive policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select on user_profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow all insert on user_profiles" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on user_profiles" ON user_profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on user_profiles" ON user_profiles FOR DELETE USING (true);
