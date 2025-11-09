/*
  # Create saju_results table for storing fortune readings

  1. New Tables
    - `saju_results`
      - `id` (uuid, primary key) - Unique identifier for each fortune reading
      - `gender` (text) - User's gender
      - `birth_year` (integer) - Birth year
      - `birth_month` (integer) - Birth month (1-12)
      - `birth_day` (integer) - Birth day (1-31)
      - `birth_time` (text) - Birth time as string
      - `lunar_calendar` (boolean) - Whether using lunar calendar, defaults to false
      - `fortune_result` (jsonb) - The generated fortune result as JSON
      - `created_at` (timestamptz) - When the reading was created

  2. Security
    - Enable RLS on `saju_results` table
    - Add policy to allow anyone to insert fortune results (public access)
    - Add policy to allow anyone to read fortune results (public access)
*/

CREATE TABLE IF NOT EXISTS saju_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gender text NOT NULL,
  birth_year integer NOT NULL,
  birth_month integer NOT NULL,
  birth_day integer NOT NULL,
  birth_time text NOT NULL,
  lunar_calendar boolean DEFAULT false,
  fortune_result jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saju_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert fortune results (public access for fortune telling app)
CREATE POLICY "Anyone can insert fortune results"
  ON saju_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read fortune results (public access)
CREATE POLICY "Anyone can read fortune results"
  ON saju_results
  FOR SELECT
  TO anon, authenticated
  USING (true);