import React from 'react';
import { Bell, BellOff } from 'lucide-react';

interface NotificationButtonProps {
  permission: NotificationPermission;
  onRequestPermission: () => Promise<void>;
}

export function NotificationButton({ permission, onRequestPermission }: NotificationButtonProps) {
  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Bell className="h-6 w-6" />
        <span className="text-sm font-medium">Notifications activées</span>
      </div>
    );
  }

  return (
    <button
      onClick={onRequestPermission}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 
      transition-colors duration-200 flex items-center justify-center gap-2"
    >
      <BellOff className="h-5 w-5" />
      <span>Activer les notifications</span>
    </button>
  );
}