'use client';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function TechnicianLocationPage() {
  const { data: session } = useSession();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string>('');
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible en este navegador');
      return;
    }

    setIsTracking(true);
    setError('');

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setAccuracy(accuracy);

        // Send location to server
        fetch('/api/location/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude,
            longitude,
            accuracy,
          }),
        }).catch((err) => console.error('Error sending location:', err));
      },
      (err) => {
        setError(`Error: ${err.message}`);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  useEffect(() => {
    // Get initial location
    if (navigator.geolocation && !location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setAccuracy(accuracy);
        },
        (err) => {
          console.error('Error getting location:', err);
        }
      );
    }
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mi Ubicación</h1>
          <p className="text-muted-foreground">Comparte tu ubicación en tiempo real</p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Estado del GPS</p>
                <p className="text-sm text-muted-foreground">
                  {isTracking ? '✅ Transmitiendo ubicación' : '⏸ No está transmitiendo'}
                </p>
              </div>
              <span
                className={`w-4 h-4 rounded-full ${
                  isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
            </div>

            {/* Current Location */}
            {location && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Ubicación Actual</h3>
                <div className="bg-card border border-border rounded-lg p-4 space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Latitud:</span>{' '}
                    <span className="text-foreground font-mono">{location.lat.toFixed(6)}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Longitud:</span>{' '}
                    <span className="text-foreground font-mono">{location.lng.toFixed(6)}</span>
                  </p>
                  {accuracy !== null && (
                    <p>
                      <span className="text-muted-foreground">Precisión:</span>{' '}
                      <span className="text-foreground">±{accuracy.toFixed(0)}m</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Map Placeholder */}
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border border-border">
              <p className="text-muted-foreground">Mapa (Google Maps - requiere API key)</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={isTracking ? stopTracking : startTracking}
                className={
                  isTracking
                    ? 'flex-1 bg-destructive hover:bg-destructive/90'
                    : 'flex-1 bg-primary hover:bg-primary/90'
                }
              >
                {isTracking ? 'Detener Transmisión' : 'Iniciar Transmisión'}
              </Button>
            </div>

            {/* Info */}
            <div className="bg-info/10 border border-info/30 text-info px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold mb-1">ℹ️ Información Importante</p>
              <p className="text-sm">
                Tu ubicación se actualiza cada 10 segundos mientras la transmisión está activa. 
                Los administradores pueden verla en tiempo real en el panel de control.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
