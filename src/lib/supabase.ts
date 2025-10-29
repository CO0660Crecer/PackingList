import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Beneficiary {
  id?: string;
  id_local_beneficiario: string;
  nombre_cuenta: string;
  communication_preguntas: string;
  communication_id_global: string;
  regalo_gift_id: string;
  notas_oficina_campo: string;
  created_at?: string;
  updated_at?: string;
}

export interface Letter {
  id?: string;
  codigo_participante: string;
  tipo_comunicacion: string;
  preguntas_patrocinadores: string;
  id_comunicacion: string;
  id_plantilla: string;
  fecha_impresion: string;
  fecha_entrega: string;
  problemas_contenido: string;
  comentarios: string;
  edad: string;
  nombre_tutor: string;
  created_at?: string;
}
