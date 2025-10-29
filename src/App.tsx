import { useState } from 'react';
import { Database, Search, Upload, Package } from 'lucide-react';
import SearchBeneficiary from './components/SearchBeneficiary';
import DataUpload from './components/DataUpload';
import PackingList from './components/PackingList';
import LetterUpload from './components/LetterUpload';

function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'upload' | 'packing' | 'letterUpload'>('search');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Database className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Sistema de Gestión de Beneficiarios
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Busca y administra información de beneficiarios de forma eficiente
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-2 mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline">Buscar</span> Beneficiario
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-5 h-5" />
              Carga <span className="hidden md:inline">Masiva</span>
            </button>
            <button
              onClick={() => setActiveTab('packing')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'packing'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Package className="w-5 h-5" />
              Packing List
            </button>
            <button
              onClick={() => setActiveTab('letterUpload')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'letterUpload'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-5 h-5" />
              Carga Cartas
            </button>
          </div>

          <div className="transition-all">
            {activeTab === 'search' && <SearchBeneficiary />}
            {activeTab === 'upload' && <DataUpload />}
            {activeTab === 'packing' && <PackingList />}
            {activeTab === 'letterUpload' && <LetterUpload />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
