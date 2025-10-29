import { useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { supabase, Letter } from '../lib/supabase';

export default function LetterUpload() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [textData, setTextData] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const parseData = (text: string): Letter[] => {
    const lines = text.trim().split('\n');
    const letters: Letter[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split('\t');

      if (columns.length >= 11 && !line.toLowerCase().includes('código tipo')) {
        letters.push({
          codigo_participante: columns[0]?.trim() || '',
          tipo_comunicacion: columns[1]?.trim() || '',
          preguntas_patrocinadores: columns[2]?.trim() || '',
          id_comunicacion: columns[3]?.trim() || '',
          id_plantilla: columns[4]?.trim() || '',
          fecha_impresion: columns[5]?.trim() || '',
          fecha_entrega: columns[6]?.trim() || '',
          problemas_contenido: columns[7]?.trim() || '',
          comentarios: columns[8]?.trim() || '',
          edad: columns[9]?.trim() || '',
          nombre_tutor: columns[10]?.trim() || '',
        });
      }
    }

    return letters;
  };

  const handleUpload = async () => {
    if (!textData.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa datos para cargar' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const letters = parseData(textData);

      if (letters.length === 0) {
        setMessage({ type: 'error', text: 'No se encontraron datos válidos para cargar' });
        setLoading(false);
        return;
      }

      const communicationIds = letters.map(l => l.id_comunicacion);

      const { data: existing } = await supabase
        .from('letters')
        .select('id_comunicacion')
        .in('id_comunicacion', communicationIds);

      const existingIds = new Set(existing?.map(e => e.id_comunicacion) || []);
      const newLetters = letters.filter(l => !existingIds.has(l.id_comunicacion));

      if (newLetters.length === 0) {
        setMessage({
          type: 'error',
          text: 'Todos los registros ya existen en la base de datos'
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('letters')
        .insert(newLetters);

      if (error) throw error;

      const skipped = letters.length - newLetters.length;
      setMessage({
        type: 'success',
        text: `${newLetters.length} carta(s) cargada(s) exitosamente${skipped > 0 ? `. ${skipped} duplicado(s) omitido(s)` : ''}`
      });
      setTextData('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `Error al cargar datos: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (deletePassword !== 'ELIMINAR2025') {
      setMessage({ type: 'error', text: 'Contraseña incorrecta' });
      return;
    }

    setDeleting(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('letters')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Todos los datos han sido eliminados exitosamente'
      });
      setShowDeleteConfirm(false);
      setDeletePassword('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `Error al eliminar datos: ${error.message}`
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Carga Masiva de Cartas</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pega los datos (formato TSV - separado por tabulaciones)
          </label>
          <textarea
            value={textData}
            onChange={(e) => setTextData(e.target.value)}
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm"
            placeholder="CÓDIGO TIPO DE COMUNICACIÓN	Preguntas de los partrocinadores	ID / Identificación de Comunicación	ID de plantilla	Imprimir fecha	Debe entregarse en la Oficina Nacional antes del	Problemas de contenido encontrados	Comentarios	Edad	Nombre del Tutor / Implementador&#10;CO066000982	Carta de Respuesta	No Questions	C0093716582	CO-D-1S11-2	15/10/2025	4/12/2025	-	-	6	Sandra Milena Galindo Mendez"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Cargando datos...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Cargar Datos
            </>
          )}
        </button>

        {message && (
          <div className={`flex items-start gap-3 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="border-t pt-6 mt-6">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Eliminar Todas las Cartas
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
              <p className="text-gray-600 mb-4">
                Esta acción eliminará TODAS las cartas de la base de datos. Esta acción no se puede deshacer.
              </p>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Ingresa la contraseña para confirmar:
              </p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword('');
                  }}
                  disabled={deleting}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar Todo'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
