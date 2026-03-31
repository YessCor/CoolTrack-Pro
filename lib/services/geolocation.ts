import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: string;
}

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<LocationData | null> {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: new Date(location.timestamp).toISOString(),
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (results.length === 0) return null;
    
    const addr = results[0];
    const parts = [
      addr.streetNumber,
      addr.street,
      addr.district,
      addr.city,
      addr.region,
    ].filter(Boolean);
    
    return parts.join(', ');
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}
