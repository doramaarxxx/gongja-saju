/*
  # Create user profiles and update saju_results for user association

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Table Updates
    - Add `user_id` column to `saju_results` table
    - Add foreign key constraint to link saju results with users

  3. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to manage their own profiles
    - Update `saju_results` policies for user-specific access
    - Add function to automatically create user profile on signup

  4. Functions
    - Create trigger function to auto-create user profile
    - Create trigger on auth.users for profile creation
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add user_id column to saju_results if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saju_results' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE saju_results ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User profiles policies
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

-- Update saju_results policies to include user-specific access
DROP POLICY IF EXISTS "Anyone can insert fortune results" ON saju_results;
DROP POLICY IF EXISTS "Anyone can read fortune results" ON saju_results;

-- Allow authenticated users to insert their own saju results
CREATE POLICY "Users can insert their own saju results"
  ON saju_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow anonymous users to insert saju results (for non-logged in users)
CREATE POLICY "Anonymous users can insert saju results"
  ON saju_results
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Allow users to read their own saju results
CREATE POLICY "Users can read their own saju results"
  ON saju_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anonymous users to read saju results without user_id (for sharing)
CREATE POLICY "Anyone can read anonymous saju results"
  ON saju_results
  FOR SELECT
  TO anon, authenticated
  USING (user_id IS NULL);

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