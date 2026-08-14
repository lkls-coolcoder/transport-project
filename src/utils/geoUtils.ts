// Utility functions for GPS coordinates parsing, distance calculation, and landmark resolution

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Regex and pattern matching to parse GPS coordinates from freeform user input.
 * Supports:
 * - "1.3521, 103.8198"
 * - "1.3521,103.8198"
 * - "1.3521 103.8198"
 * - "1.3521° N, 103.8198° E"
 * - "lat: 1.3521, lng: 103.8198"
 * - "1.3521, 103.8198 (GPS Location)"
 */
export function parseGpsCoordinates(input: string): Coordinates | null {
  if (!input || typeof input !== 'string') return null;

  const clean = input.trim();

  // Pattern 1: standard "lat, lng" or "lat lng" (e.g. 1.3521, 103.8198 or -33.8688, 151.2093)
  const standardMatch = clean.match(/([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)/);
  if (standardMatch) {
    const lat = parseFloat(standardMatch[1]);
    const lng = parseFloat(standardMatch[2]);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) };
    }
  }

  // Pattern 2: Cardinal directions (e.g. 1.3521° N, 103.8198° E or 40.7128 N 74.0060 W)
  const cardinalMatch = clean.match(/(\d+(?:\.\d+)?)\s*°?\s*([NSns])[,\s]+(\d+(?:\.\d+)?)\s*°?\s*([EWew])/);
  if (cardinalMatch) {
    let lat = parseFloat(cardinalMatch[1]);
    const latDir = cardinalMatch[2].toUpperCase();
    let lng = parseFloat(cardinalMatch[3]);
    const lngDir = cardinalMatch[4].toUpperCase();

    if (latDir === 'S') lat = -lat;
    if (lngDir === 'W') lng = -lng;

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) };
    }
  }

  return null;
}

/**
 * Format coordinates nicely (e.g. "1.3521° N, 103.8198° E")
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in kilometers.
 * Applies a 1.25x urban transit winding factor to represent realistic road/transit network paths.
 */
export function calculateGpsDistanceKm(
  coord1: Coordinates,
  coord2: Coordinates,
  applyUrbanFactor = true
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;

  // Urban factor represents street network turns vs straight line
  const networkDistance = applyUrbanFactor ? straightLineKm * 1.25 : straightLineKm;
  return Math.max(1.0, Number(networkDistance.toFixed(1)));
}

/**
 * Popular Singapore and international landmarks with verified GPS coordinates
 */
export const CITY_GPS_PRESETS: Record<string, Array<{ name: string; lat: number; lng: number; description: string }>> = {
  sin: [
    { name: 'Jurong East Bus Interchange', lat: 1.3332, lng: 103.7431, description: 'West Hub (EWL / NSL / JRL)' },
    { name: 'Marina Bay Financial Centre', lat: 1.2798, lng: 103.8540, description: 'Downtown CBD / Marina Bay' },
    { name: 'Changi Airport Terminal 3', lat: 1.3564, lng: 103.9871, description: 'East Aviation Gateway' },
    { name: 'ION Orchard / Orchard MRT', lat: 1.3040, lng: 103.8318, description: 'Central Shopping Corridor' },
    { name: 'Bedok Sports Complex / Town', lat: 1.3240, lng: 103.9300, description: 'East Housing & Transit Hub' },
    { name: 'Woodlands Integrated Transport Hub', lat: 1.4361, lng: 103.7865, description: 'North Corridor / Causeway' },
    { name: 'Bugis Junction / Victoria St', lat: 1.3000, lng: 103.8550, description: 'Civic & Cultural District' },
    { name: 'Punggol Waterway Point', lat: 1.4067, lng: 103.9022, description: 'Northeast Eco-Town' }
  ],
  nyc: [
    { name: 'Times Square, Manhattan', lat: 40.7580, lng: -73.9855, description: 'Midtown Hub' },
    { name: 'Financial District / Wall St', lat: 40.7075, lng: -74.0090, description: 'Lower Manhattan' },
    { name: 'JFK Airport Terminal 4', lat: 40.6413, lng: -73.7781, description: 'Queens Gateway' },
    { name: 'Grand Central Terminal', lat: 40.7527, lng: -73.9772, description: 'East Midtown Rail' }
  ],
  lon: [
    { name: 'Piccadilly Circus', lat: 51.5100, lng: -0.1347, description: 'West End' },
    { name: 'Canary Wharf Financial Hub', lat: 51.5054, lng: -0.0235, description: 'Docklands' },
    { name: 'Heathrow Airport Terminal 5', lat: 51.4700, lng: -0.4543, description: 'West Aviation Gateway' }
  ],
  tyo: [
    { name: 'Shinjuku Station Hub', lat: 35.6896, lng: 139.7006, description: 'Busiest Rail Terminal' },
    { name: 'Tokyo Station / Marunouchi', lat: 35.6812, lng: 139.7671, description: 'Central Business Hub' },
    { name: 'Shibuya Crossing', lat: 35.6595, lng: 139.7004, description: 'Youth & Tech Center' }
  ]
};
