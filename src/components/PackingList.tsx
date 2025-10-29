import { useState } from 'react';
import { Package, Loader2, AlertCircle, Search } from 'lucide-react';
import { supabase, Letter } from '../lib/supabase';

export default function PackingList() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchCode, setSearchCode] = useState('');
  const [searchResults, setSearchResults] = useState<{ letters: Letter[]; participantName: string } | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa un código de participante' });
      return;
    }

    setSearching(true);
    setMessage(null);
    setSearchResults(null);

    try {
      const { data: letters, error: letterError } = await supabase
        .from('letters')
        .select('*')
        .eq('codigo_participante', searchCode.trim())
        .order('created_at', { ascending: false });

      if (letterError) throw letterError;

      if (!letters || letters.length === 0) {
        setMessage({ type: 'error', text: 'No se encontró información para este código' });
        setSearching(false);
        return;
      }

      const { data: beneficiaries, error: beneficiaryError } = await supabase
        .from('beneficiaries')
        .select('nombre_cuenta')
        .eq('id_local_beneficiario', searchCode.trim())
        .limit(1);

      if (beneficiaryError) throw beneficiaryError;

      setSearchResults({
        letters,
        participantName: beneficiaries && beneficiaries.length > 0 ? beneficiaries[0].nombre_cuenta : 'No encontrado'
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: `Error al buscar: ${error.message}`
      });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Packing List - Buscar Información de Carta</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Ingresa el código del participante (ej: CO066000982)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            {searching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Buscar
              </>
            )}
          </button>
        </div>

        {message && !searchResults && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 text-red-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {searchResults && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">
                <span className="font-bold">Participante:</span> {searchResults.participantName} ({searchCode})
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Se encontraron {searchResults.letters.length} carta(s)
              </p>
            </div>

            {searchResults.letters.map((letter, index) => (
              <div key={letter.id} className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 text-lg mb-4">
                  Carta #{index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tipo de Comunicación</p>
                    <p className="text-gray-900">{letter.tipo_comunicacion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">ID de Comunicación</p>
                    <p className="text-gray-900">{letter.id_comunicacion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">ID de Plantilla</p>
                    <p className="text-gray-900">{letter.id_plantilla}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fecha de Impresión</p>
                    <p className="text-gray-900">{letter.fecha_impresion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fecha de Entrega</p>
                    <p className="text-gray-900">{letter.fecha_entrega}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Edad</p>
                    <p className="text-gray-900">{letter.edad}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nombre del Tutor</p>
                    <p className="text-gray-900">{letter.nombre_tutor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Preguntas de Patrocinadores</p>
                    <p className="text-gray-900">{letter.preguntas_patrocinadores}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-600">Problemas de Contenido</p>
                    <p className="text-gray-900">{letter.problemas_contenido}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-600">Comentarios</p>
                    <p className="text-gray-900">{letter.comentarios}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
