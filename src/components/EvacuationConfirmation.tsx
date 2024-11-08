import React from 'react';
import { LogOut, CheckCircle } from 'lucide-react';
import { useEvacuationStore } from '../store/evacuationStore';

export function EvacuationConfirmation() {
  const { houses, alertActive, confirmEvacuation } = useEvacuationStore();
  const userHouse = houses.find(h => h.userId === 'user1'); // Demo user

  if (!alertActive || !userHouse) return null;

  if (userHouse.evacuated) {
    return (
      <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
        <CheckCircle className="h-6 w-6 text-green-600" />
        <div>
          <h3 className="font-medium text-green-800">Évacuation Confirmée</h3>
          <p className="text-sm text-green-600">
            Votre évacuation a été enregistrée. Restez en sécurité.
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => confirmEvacuation(userHouse.id)}
      className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg 
      hover:bg-amber-700 transition-colors duration-200 flex items-center 
      justify-center gap-2"
    >
      <LogOut className="h-5 w-5" />
      <span>Confirmer mon évacuation</span>
    </button>
  );
}