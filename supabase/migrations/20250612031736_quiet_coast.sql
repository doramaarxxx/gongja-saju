/*
  # Add name column to saju_results table

  1. Changes
    - Add `name` column to `saju_results` table
    - Set default value as empty string for existing records
    - Allow null values for backward compatibility

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saju_results' AND column_name = 'name'
  ) THEN
    ALTER TABLE saju_results ADD COLUMN name text DEFAULT '';
  END IF;
END $$;