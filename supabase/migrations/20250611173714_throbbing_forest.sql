/*
  # Add phone field to user_profiles table

  1. Changes
    - Add `phone` column to `user_profiles` table for storing phone numbers
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN phone text;
  END IF;
END $$;