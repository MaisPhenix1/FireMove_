import { create } from 'zustand';

export interface House {
  id: string;
  address: string;
  coordinates: [number, number];
  evacuated: boolean;
  evacuationTime?: Date;
  userId: string;
}

interface Alarm {
  id: number;
  description: string;
  location: string;
  status: 'active' | 'resolved';
  created_at: string;
}

interface EvacuationState {
  houses: House[];
  alarms: Alarm[];
  alertActive: boolean;
  isAdmin: boolean;
  setAlertActive: (active: boolean) => void;
  confirmEvacuation: (houseId: string) => void;
  setHouses: (houses: House[]) => void;
  fetchAlarms: () => Promise<void>;
  createAlarm: (description: string, location: string) => Promise<void>;
  updateAlarmStatus: (id: number, status: 'active' | 'resolved') => Promise<void>;
}

export const useEvacuationStore = create<EvacuationState>((set, get) => ({
  houses: [
    {
      id: '1',
      address: '123 Rue de la Paix',
      coordinates: [2.3522, 48.8566],
      evacuated: false,
      userId: 'user1'
    },
    {
      id: '2',
      address: '456 Avenue des Champs-Élysées',
      coordinates: [2.3508, 48.8567],
      evacuated: false,
      userId: 'user2'
    }
  ],
  alarms: [],
  alertActive: false,
  isAdmin: true,
  
  setAlertActive: (active) => set({ alertActive: active }),
  
  confirmEvacuation: (houseId) => set((state) => ({
    houses: state.houses.map(house =>
      house.id === houseId
        ? { ...house, evacuated: true, evacuationTime: new Date() }
        : house
    )
  })),
  
  setHouses: (houses) => set({ houses }),

  fetchAlarms: async () => {
    try {
      const response = await fetch('http://localhost:3000/api/alarms');
      if (!response.ok) throw new Error('Failed to fetch alarms');
      const alarms = await response.json();
      set({ alarms });
    } catch (error) {
      console.error('Error fetching alarms:', error);
      throw error; // Propager l'erreur pour la gestion dans le composant
    }
  },

  createAlarm: async (description: string, location: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/alarms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, location }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create alarm');
      }
      
      await get().fetchAlarms();
      set({ alertActive: true });
    } catch (error) {
      console.error('Error creating alarm:', error);
      throw error;
    }
  },

  updateAlarmStatus: async (id: number, status: 'active' | 'resolved') => {
    try {
      const response = await fetch(`http://localhost:3000/api/alarms/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update alarm status');
      }
      
      await get().fetchAlarms();
      
      if (status === 'resolved') {
        const activeAlarms = get().alarms.filter(
          alarm => alarm.id !== id && alarm.status === 'active'
        );
        if (activeAlarms.length === 0) {
          set({ alertActive: false });
        }
      }
    } catch (error) {
      console.error('Error updating alarm status:', error);
      throw error;
    }
  },
}));