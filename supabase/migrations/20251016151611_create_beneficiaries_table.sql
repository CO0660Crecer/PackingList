/*
  # Create Beneficiaries Table

  ## Purpose
  Store beneficiary information with communication and gift tracking

  ## Tables Created
  1. `beneficiaries`
    - `id` (uuid, primary key) - Unique identifier
    - `id_local_beneficiario` (text, indexed) - Local beneficiary ID (e.g., CO066000531)
    - `nombre_cuenta` (text) - Account name / Beneficiary name
    - `communication_preguntas` (text) - Sponsor questions
    - `communication_id_global` (text, indexed) - Global communication ID (e.g., C0081641431)
    - `regalo_gift_id` (text) - Gift ID (e.g., GI-10564439)
    - `notas_oficina_campo` (text) - Internal field office notes
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on beneficiaries table
  - Add policy for authenticated users to read all records
  - Add policy for authenticated users to insert records
  - Add policy for authenticated users to update records
  - Add policy for authenticated users to delete records

  ## Indexes
  - Index on `communication_id_global` for fast search
  - Index on `id_local_beneficiario` for lookups
*/

-- Create beneficiaries table
CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_local_beneficiario text NOT NULL,
  nombre_cuenta text NOT NULL,
  communication_preguntas text DEFAULT '',
  communication_id_global text NOT NULL,
  regalo_gift_id text DEFAULT '',
  notas_oficina_campo text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_communication_id_global ON beneficiaries(communication_id_global);
CREATE INDEX IF NOT EXISTS idx_id_local_beneficiario ON beneficiaries(id_local_beneficiario);

-- Enable Row Level Security
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read beneficiaries"
  ON beneficiaries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert beneficiaries"
  ON beneficiaries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update beneficiaries"
  ON beneficiaries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete beneficiaries"
  ON beneficiaries FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_beneficiaries_updated_at
  BEFORE UPDATE ON beneficiaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();