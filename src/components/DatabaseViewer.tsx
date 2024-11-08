import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, AlertCircle } from 'lucide-react';
import { useEvacuationStore } from '../store/evacuationStore';

export function DatabaseViewer() {
  const { alarms, fetchAlarms } = useEvacuationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchAlarms();
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error fetching alarms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
        <AlertCircle className="h-6 w-6 text-red-600" />
        <div>
          <h3 className="font-medium text-red-800">Erreur de Base de Données</h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Base de Données FireMove</h2>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all 
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emplacement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alarms.map((alarm) => (
                <tr key={alarm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alarm.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alarm.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alarm.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alarm.status === 'active'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {alarm.status === 'active' ? 'Active' : 'Résolue'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(alarm.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!loading && alarms.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune alarme dans la base de données
                  </td>
                </tr>
              )}
              {loading && alarms.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Chargement des données...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}