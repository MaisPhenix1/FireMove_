import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useEvacuationStore } from '../store/evacuationStore';
import 'mapbox-gl/dist/mapbox-gl.css';

// Use environment variable for Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export function EvacuationMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { houses } = useEvacuationStore();

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.3522, 48.8566], // Paris coordinates
      zoom: 13
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    houses.forEach(house => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = house.evacuated ? '#10B981' : '#6B7280';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(house.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${house.address}</h3>
                <p class="text-sm ${house.evacuated ? 'text-green-600' : 'text-gray-600'}">
                  ${house.evacuated ? 'Évacué' : 'Non évacué'}
                </p>
                ${house.evacuationTime ? 
                  `<p class="text-xs text-gray-500">
                    Évacué le ${new Date(house.evacuationTime).toLocaleString()}
                  </p>` 
                  : ''
                }
              </div>
            `)
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [houses]);

  if (!mapboxgl.accessToken) {
    return (
      <div className="w-full h-[500px] rounded-lg shadow-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Carte non disponible - Clé API manquante</p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-lg" />
  );
}