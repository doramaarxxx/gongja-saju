/*
  # Create debug logs table

  1. New Tables
    - `debug_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for anonymous logs)
      - `log_type` (text, type of log entry)
      - `message` (text, log message)
      - `data` (jsonb, additional data)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `debug_logs` table
    - Add policy for authenticated users to insert and read their own logs
    - Add policy for anonymous users to insert logs for debugging
*/

CREATE TABLE IF NOT EXISTS debug_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  log_type text NOT NULL,
  message text NOT NULL,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE debug_logs ENABLE ROW LEVEL SECURITY;

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