import React from 'react';

interface NotificationStatusProps {
  permission: NotificationPermission;
}

export function NotificationStatus({ permission }: NotificationStatusProps) {
  if (permission === 'default') {
    return (
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          Activez les notifications pour recevoir les alertes en cas d'incendie 
          ou d'évacuation, même lorsque le site est en arrière-plan.
        </p>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="text-sm text-red-800">
          <p className="mb-2">Les notifications sont bloquées. Pour les activer :</p>
          <ol className="list-decimal ml-4">
            <li>Cliquez sur l'icône de cadenas dans la barre d'adresse</li>
            <li>Trouvez "Notifications" dans les paramètres</li>
            <li>Changez le paramètre sur "Autoriser"</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <p className="text-sm text-green-800">
        Les notifications sont activées. Vous recevrez les alertes même si 
        le site est en arrière-plan.
      </p>
    </div>
  );
}