/*
  # Initial Schema Setup for Saju Fortune App

  1. New Tables
    - `saju_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users)
      - `name` (text, user name)
      - `gender` (text, user gender)
      - `birth_year` (integer, birth year)
      - `birth_month` (integer, birth month 1-12)
      - `birth_day` (integer, birth day 1-31)
      - `birth_time` (text, birth time as string)
      - `lunar_calendar` (boolean, lunar calendar flag)
      - `fortune_result` (jsonb, fortune analysis result)
      - `created_at` (timestamptz, creation timestamp)

    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, user email)
      - `full_name` (text, nullable, full name)
      - `phone` (text, nullable, phone number)
      - `avatar_url` (text, nullable, avatar image URL)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)

    - `debug_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, user reference)
      - `log_type` (text, log entry type)
      - `message` (text, log message)
      - `data` (jsonb, additional log data)
      - `created_at` (timestamptz, log timestamp)

  2. Storage
    - Create 'images' bucket for storing character images and assets
    - Set bucket to be public for easy access

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for user data access
    - Allow public read access to images bucket
    - Add user profile auto-creation trigger

  4. Functions
    - Auto-create user profile on signup
    - Update timestamp trigger for user_profiles
*/

-- Create saju_results table
CREATE TABLE IF NOT EXISTS saju_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text DEFAULT '',
  gender text NOT NULL,
  birth_year integer NOT NULL,
  birth_month integer NOT NULL,
  birth_day integer NOT NULL,
  birth_time text NOT NULL,
  lunar_calendar boolean DEFAULT false,
  fortune_result jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create debug_logs table
CREATE TABLE IF NOT EXISTS debug_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  log_type text NOT NULL,
  message text NOT NULL,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE saju_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE debug_logs ENABLE ROW LEVEL SECURITY;

-- Saju Results Policies
CREATE POLICY "Users can insert their own saju results"
  ON saju_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anonymous users can insert saju results"
  ON saju_results
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can read their own saju results"
  ON saju_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read anonymous saju results"
  ON saju_results
  FOR SELECT
  TO anon, authenticated
  USING (user_id IS NULL);

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Debug Logs Policies
CREATE POLICY "Users can insert their own logs"
  ON debug_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can read their own logs"
  ON debug_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anonymous users can insert logs"
  ON debug_logs
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create updated_at trigger function for user_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();