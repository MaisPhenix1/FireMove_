import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useEvacuationStore } from '../store/evacuationStore';

export function EvacuationAlert() {
  const { alertActive, isAdmin, setAlertActive } = useEvacuationStore();

  if (!alertActive) {
    return isAdmin ? (
      <button
        onClick={() => setAlertActive(true)}
        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 
        transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <AlertTriangle className="h-5 w-5" />
        <span>Déclencher une alerte incendie</span>
      </button>
    ) : null;
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">
            ⚠️ Alerte Incendie en Cours
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p className="mb-2">
              Un incendie a été signalé dans votre zone. Veuillez évacuer 
              immédiatement en suivant ces consignes :
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Fermez le gaz et l'électricité</li>
              <li>Emportez vos papiers d'identité et documents importants</li>
              <li>Suivez les instructions des autorités</li>
              <li>Ne revenez pas sur vos pas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}