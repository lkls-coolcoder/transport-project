export interface CityLocation {
  id: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  timezone: string;
  transitAgency: string;
  defaultOrigin: string;
  defaultDestination: string;
  popularRoutes: {
    origin: string;
    destination: string;
    distanceKm: number;
    description: string;
  }[];
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  precipitation: number;
  precipitationProbability: number;
  weatherCode: number;
  weatherDescription: string;
  weatherIcon: string;
  visibilityKm: number;
  uvIndex: number;
  roadHazardLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  roadHazardNote: string;
  hourly: {
    time: string;
    temp: number;
    precipProb: number;
    code: number;
    trafficCongestion: number;
  }[];
  lastUpdated: string;
}

export interface TrafficIncident {
  id: string;
  title: string;
  type: 'Accident' | 'Construction' | 'Congestion' | 'Weather Hazard' | 'Closure';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  location: string;
  coords: [number, number]; // [x, y] in percentage or relative map coordinate
  delayMinutes: number;
  reportedAt: string;
  verifiedSource: string;
  description: string;
}

export interface TransitLineStatus {
  id: string;
  lineName: string;
  type: 'subway' | 'bus' | 'train' | 'ferry' | 'tram';
  status: 'Good Service' | 'Minor Delays' | 'Major Delays' | 'Planned Work' | 'Suspended';
  statusColor: 'green' | 'amber' | 'red' | 'purple';
  delayText?: string;
  headwayMinutes: number;
  crowdingLevel: 'Low' | 'Moderate' | 'High' | 'Full';
}

export type TransportMode = 'driving' | 'subway' | 'bus' | 'cycling' | 'walking' | 'ridehail';

export interface RouteOption {
  mode: TransportMode;
  modeName: string;
  durationMinutes: number;
  baseDurationMinutes: number;
  delayMinutes: number;
  distanceKm: number;
  costFormatted: string;
  costValue: number;
  carbonGrams: number;
  weatherSuitabilityScore: number; // 0-100
  safetyReliabilityScore: number; // 0-100
  overallScore: number; // 0-100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  isBestChoice: boolean;
  bestChoiceReason?: string;
  cons: string[];
  pros: string[];
  steps: {
    instruction: string;
    durationMins: number;
    icon: string;
    distance?: string;
  }[];
}

export interface BestTransportAnalysis {
  summary: string;
  recommendedMode: TransportMode;
  bestWindowDeparture: string;
  confidenceScore: number;
  weatherImpactSummary: string;
  trafficImpactSummary: string;
  routes: RouteOption[];
  groundedFacts: {
    source: string;
    metric: string;
    value: string;
  }[];
  generatedAt: string;
}

export interface DepartureWindow {
  timeOffset: string; // "+0m (Now)", "+30m", "+1h", etc.
  formattedTime: string;
  estimatedMinutes: number;
  trafficLevel: 'Low' | 'Moderate' | 'Heavy' | 'Gridlock';
  weatherCondition: string;
  precipitationRisk: number; // %
  recommendationRank: number; // 1 = best
  tag?: string;
}

export interface SystemTelemetry {
  uptimeSeconds: number;
  uptimePercentage: number;
  apiLatencyMs: number;
  activeDataFeeds: {
    name: string;
    status: 'Operational' | 'Degraded' | 'Offline';
    lastSync: string;
    pingMs: number;
  }[];
  totalTelemetryPackets: number;
  cacheHitRate: number;
  memoryUsageMb: number;
}

export interface FeedbackReport {
  id: string;
  type: 'broken_link' | 'incorrect_traffic' | 'transit_delay' | 'weather_hazard' | 'general_feedback';
  urlOrLocation: string;
  details: string;
  userEmail?: string;
  status: 'Received' | 'Investigating' | 'Resolved';
  timestamp: string;
}

// Singapore LTA DataMall Interfaces
export interface LTANextBusInfo {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string; // SEA = Seats Available, SDA = Standing Available, LSD = Limited Standing
  Feature?: 'WAB' | string; // Wheelchair Accessible Bus
  Type?: 'SD' | 'DD' | 'BD' | string; // Single Deck, Double Deck, Bendy
}

export interface LTABusService {
  ServiceNo: string;
  Operator: string;
  NextBus: LTANextBusInfo;
  NextBus2?: LTANextBusInfo;
  NextBus3?: LTANextBusInfo;
}

export interface LTABusArrivalData {
  BusStopCode: string;
  Services: LTABusService[];
}

export interface LTACarparkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string;
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y' | string; // C = Cars, H = Heavy vehicles, Y = Motorcycles
  Agency: 'LTA' | 'HDB' | 'URA' | string;
}

export interface LTATrafficIncidentItem {
  Type: string;
  Latitude: number;
  Longitude: number;
  Message: string;
}

export interface LTATrainAlertData {
  Status: number; // 1 = Normal, 2 = Disrupted
  Message?: {
    Content: string;
    CreatedDate: string;
  }[];
}
