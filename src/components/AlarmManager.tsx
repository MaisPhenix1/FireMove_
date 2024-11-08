import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { useEvacuationStore } from '../store/evacuationStore';

export function AlarmManager() {
  const { isAdmin, alarms, fetchAlarms, createAlarm, updateAlarmStatus } = useEvacuationStore();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  const handleCreateAlarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await createAlarm(description, location);
      setDescription('');
      setLocation('');
      setIsCreating(false);
    } catch (err) {
      setError('Failed to create alarm. Please try again.');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Gestion des Alarmes</h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle Alarme</span>
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreateAlarm} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Emplacement
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg 
              hover:bg-blue-700 transition-colors duration-200"
            >
              Créer l'Alarme
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg 
              hover:bg-gray-300 transition-colors duration-200"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className={`p-4 rounded-lg border ${
              alarm.status === 'active' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {alarm.status === 'active' ? (
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{alarm.description}</p>
                  <p className="text-sm text-gray-600">{alarm.location}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alarm.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {alarm.status === 'active' && (
                <button
                  onClick={() => updateAlarmStatus(alarm.id, 'resolved')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg 
                  hover:bg-green-700 transition-colors duration-200"
                >
                  Résoudre
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}