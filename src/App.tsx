<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useEvacuationStore } from './store/evacuationStore';
import { NotificationManager } from './components/NotificationManager';
import { EvacuationMap } from './components/EvacuationMap';
import { EvacuationAlert } from './components/EvacuationAlert';
import { EvacuationConfirmation } from './components/EvacuationConfirmation';
import { AlarmManager } from './components/AlarmManager';
import { DatabaseViewer } from './components/DatabaseViewer';

function App() {
  // Récupération des fonctions et états depuis le store
  const { isAdmin, fetchAlarms } = useEvacuationStore();

  // Charger les alarmes au démarrage de l'application
  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FireMove
          </h1>
          <p className="text-gray-600">
            Système de notifications et suivi d'évacuation d'urgence
          </p>
        </div>

        <div className="grid gap-6">
          <NotificationManager />
          <AlarmManager />
          <DatabaseViewer />
          <EvacuationAlert />
          <EvacuationConfirmation />
          {isAdmin && <EvacuationMap />}
        </div>
      </div>
=======
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Start prompting (or editing) to see magic happen :)</p>
>>>>>>> a11e5b7e1ab49f05e67cc399be2ff3ba592d64d7
    </div>
  );
}

export default App;
