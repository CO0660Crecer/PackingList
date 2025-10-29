/*
  # Update RLS Policies for Public Access

  ## Purpose
  Allow public access to beneficiaries table without requiring authentication

  ## Changes
  - Drop existing authenticated-only policies
  - Create new policies that allow public access for all operations

  ## Security Note
  This configuration allows anyone to read, insert, update, and delete records.
  If you need to restrict access, authentication should be implemented.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can read beneficiaries" ON beneficiaries;
DROP POLICY IF EXISTS "Authenticated users can insert beneficiaries" ON beneficiaries;
DROP POLICY IF EXISTS "Authenticated users can update beneficiaries" ON beneficiaries;
DROP POLICY IF EXISTS "Authenticated users can delete beneficiaries" ON beneficiaries;

-- Create new public access policies
CREATE POLICY "Public users can read beneficiaries"
  ON beneficiaries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public users can insert beneficiaries"
  ON beneficiaries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public users can update beneficiaries"
  ON beneficiaries FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can delete beneficiaries"
  ON beneficiaries FOR DELETE
  TO public
  USING (true);