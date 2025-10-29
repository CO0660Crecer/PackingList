import { useState } from 'react';
import { Search, Loader2, User, FileText, Package } from 'lucide-react';
import { supabase, Beneficiary } from '../lib/supabase';

export default function SearchBeneficiary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Beneficiary[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .ilike('communication_id_global', `%${searchTerm.trim()}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setResults(data || []);
    } catch (error: any) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Buscar Beneficiario</h2>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa Communication ID (ej: C0081641431)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !searchTerm.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Buscar
        </button>
      </div>

      {searched && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No se encontraron resultados</p>
              <p className="text-gray-500 text-sm mt-1">
                Intenta con otro Communication ID
              </p>
            </div>
          ) : (
            results.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          ID Local del Beneficiario
                        </label>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {beneficiary.id_local_beneficiario}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Nombre de la Cuenta
                        </label>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {beneficiary.nombre_cuenta}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Communication ID Global
                        </label>
                      </div>
                      <p className="text-base text-gray-700">
                        {beneficiary.communication_id_global}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Notas Oficina de Campo (Uso Interno)
                        </label>
                      </div>
                      <p className="text-base text-gray-900 bg-yellow-50 p-3 rounded border border-yellow-200">
                        {beneficiary.notas_oficina_campo || 'Sin notas'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Regalo Gift ID
                        </label>
                      </div>
                      <p className="text-base text-gray-700">
                        {beneficiary.regalo_gift_id || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Preguntas del Patrocinador
                        </label>
                      </div>
                      <p className="text-base text-gray-700">
                        {beneficiary.communication_preguntas || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
