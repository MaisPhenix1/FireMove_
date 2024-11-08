import React, { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

export function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Ce navigateur ne supporte pas les notifications push');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        new Notification('FireMove - Notifications Activées', {
          body: 'Vous recevrez désormais les alertes en cas d\'incendie.',
          icon: '/notification-icon.png'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
    }
  };

  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('⚠️ Alerte incendie', {
        body: 'Un incendie a été détecté dans votre zone. Veuillez suivre les consignes d\'évacuation.',
        icon: '/notification-icon.png',
        tag: 'fire-alert',
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Notifications d'Urgence</h2>
        {permission === 'granted' ? (
          <Bell className="h-6 w-6 text-green-500" />
        ) : (
          <BellOff className="h-6 w-6 text-red-500" />
        )}
      </div>

      <div className="space-y-4">
        {permission === 'default' && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Activez les notifications pour recevoir les alertes en cas d'incendie 
              ou d'évacuation, même lorsque le site est en arrière-plan.
            </p>
          </div>
        )}

        {permission === 'denied' && (
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
        )}

        {permission !== 'granted' && (
          <button
            onClick={requestPermission}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 
            transition-colors duration-200"
          >
            Activer les notifications
          </button>
        )}

        {permission === 'granted' && (
          <>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                Les notifications sont activées. Vous recevrez les alertes même si 
                le site est en arrière-plan.
              </p>
            </div>
            <button
              onClick={sendTestNotification}
              className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg 
              hover:bg-amber-700 transition-colors duration-200"
            >
              Tester l'alerte incendie
            </button>
          </>
        )}
      </div>
    </div>
  );
}