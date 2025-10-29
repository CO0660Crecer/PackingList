/*
  # Create Letters Table for Packing List

  ## Purpose
  Store letter information for the Packing List report

  ## New Tables
  - `letters`
    - `id` (uuid, primary key) - Auto-generated unique identifier
    - `codigo_participante` (text) - Participant code, indexed for fast lookups
    - `tipo_comunicacion` (text) - Type of communication (e.g., "Carta de Respuesta")
    - `preguntas_patrocinadores` (text) - Sponsor questions
    - `id_comunicacion` (text, unique) - Communication ID, unique identifier
    - `id_plantilla` (text) - Template ID
    - `fecha_impresion` (text) - Print date
    - `fecha_entrega` (text) - Delivery date to National Office
    - `problemas_contenido` (text) - Content issues found
    - `comentarios` (text) - Comments
    - `edad` (text) - Age
    - `nombre_tutor` (text) - Guardian/Implementer name
    - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on `letters` table
  - Add policies for public access (read, insert, update, delete)

  ## Indexes
  - Index on `codigo_participante` for fast participant lookups
  - Unique index on `id_comunicacion` to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_participante text NOT NULL,
  tipo_comunicacion text DEFAULT '',
  preguntas_patrocinadores text DEFAULT '',
  id_comunicacion text UNIQUE NOT NULL,
  id_plantilla text DEFAULT '',
  fecha_impresion text DEFAULT '',
  fecha_entrega text DEFAULT '',
  problemas_contenido text DEFAULT '',
  comentarios text DEFAULT '',
  edad text DEFAULT '',
  nombre_tutor text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_letters_codigo_participante ON letters(codigo_participante);

ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can read letters"
  ON letters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public users can insert letters"
  ON letters FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public users can update letters"
  ON letters FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can delete letters"
  ON letters FOR DELETE
  TO public
  USING (true);