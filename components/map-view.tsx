'use client';

import { useEffect, useRef } from 'react';

interface MapLocation {
  latitude: number;
  longitude: number;
  label: string;
  type?: 'technician' | 'client' | 'order';
}

interface MapViewProps {
  locations: MapLocation[];
  apiKey: string;
  zoom?: number;
  center?: { lat: number; lng: number };
}

export function MapView({
  locations,
  apiKey,
  zoom = 12,
  center,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) {
      // Note: Google Maps API needs to be loaded in the layout
      console.warn('Google Maps API not loaded');
      return;
    }

    // Calculate center if not provided
    const mapCenter = center || {
      lat: locations[0]?.latitude || 19.4326,
      lng: locations[0]?.longitude || -99.1332,
    };

    // Initialize map
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom,
      center: mapCenter,
      mapTypeId: 'roadmap',
    });

    // Add markers
    locations.forEach((location) => {
      const color = {
        technician: 'FF5733',
        client: '3366FF',
        order: '33FF57',
      }[location.type || 'order'];

      new window.google.maps.Marker({
        position: {
          lat: location.latitude,
          lng: location.longitude,
        },
        map: mapInstanceRef.current,
        title: location.label,
        icon: `http://maps.google.com/mapfiles/ms/micons/${color === 'FF5733' ? 'red' : color === '3366FF' ? 'blue' : 'green'}.png`,
      });
    });
  }, [locations, apiKey, zoom, center]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg border border-border"
      style={{ minHeight: '400px' }}
    />
  );
}
