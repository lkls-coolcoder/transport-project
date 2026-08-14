import { CityLocation, TrafficIncident, TransitLineStatus, DepartureWindow, WeatherData } from '../types';

export function generateCityIncidents(city: CityLocation): TrafficIncident[] {
  const baseSeed = city.name.length;
  const incidents: TrafficIncident[] = [
    {
      id: `${city.id}-inc-1`,
      title: 'Lane Restriction / Resurfacing',
      type: 'Construction',
      severity: 'moderate',
      location: `Main Arterial Expressway (Northbound)`,
      coords: [35, 42],
      delayMinutes: 12,
      reportedAt: '18 mins ago',
      verifiedSource: `${city.transitAgency} DOT Incident Feed`,
      description: 'Right two lanes closed for emergency asphalt repairs. Rubbernecking delays extending 2.4 km.'
    },
    {
      id: `${city.id}-inc-2`,
      title: 'Multi-Vehicle Minor Collision',
      type: 'Accident',
      severity: 'high',
      location: `Central Ring Road / Junction 4`,
      coords: [62, 58],
      delayMinutes: 24,
      reportedAt: '7 mins ago',
      verifiedSource: 'Highway Patrol Telemetry',
      description: 'Vehicle recovery in progress. Traffic moving at 12 km/h. Recommend alternate transit bypass.'
    },
    {
      id: `${city.id}-inc-3`,
      title: 'Signal Optimization & Heavy Influx',
      type: 'Congestion',
      severity: 'low',
      location: 'Downtown Commercial Corridor',
      coords: [48, 48],
      delayMinutes: 8,
      reportedAt: '25 mins ago',
      verifiedSource: 'Municipal Traffic Management Center',
      description: 'High pedestrian crossings and delivery vehicle loading. Bus priority lanes operating normally.'
    }
  ];

  if (baseSeed % 2 === 0) {
    incidents.push({
      id: `${city.id}-inc-4`,
      title: 'Bridge Expansion Joint Inspection',
      type: 'Weather Hazard',
      severity: 'moderate',
      location: 'Harbor Bridge / Transbay Crossing',
      coords: [78, 30],
      delayMinutes: 15,
      reportedAt: '34 mins ago',
      verifiedSource: 'Regional Transit Safety Board',
      description: 'Crosswind advisory active. Speed limit reduced to 45 km/h for high-sided vehicles.'
    });
  }

  return incidents;
}

export function generateTransitLines(city: CityLocation): TransitLineStatus[] {
  switch (city.id) {
    case 'nyc':
      return [
        { id: 'nyc-1', lineName: 'Subway Line 1/2/3 (Broadway - 7th Ave)', type: 'subway', status: 'Good Service', statusColor: 'green', headwayMinutes: 3, crowdingLevel: 'Moderate' },
        { id: 'nyc-2', lineName: 'Subway Line 4/5/6 (Lexington Ave)', type: 'subway', status: 'Minor Delays', statusColor: 'amber', delayText: '+5 min signal backlog at 59th St', headwayMinutes: 5, crowdingLevel: 'High' },
        { id: 'nyc-3', lineName: 'Subway Line N/Q/R/W (Broadway Express)', type: 'subway', status: 'Good Service', statusColor: 'green', headwayMinutes: 4, crowdingLevel: 'Moderate' },
        { id: 'nyc-4', lineName: 'LIRR Commuter Rail (Penn / Grand Central)', type: 'train', status: 'Good Service', statusColor: 'green', headwayMinutes: 12, crowdingLevel: 'Low' },
        { id: 'nyc-5', lineName: 'M15 Select Bus Service (1st & 2nd Ave)', type: 'bus', status: 'Good Service', statusColor: 'green', headwayMinutes: 6, crowdingLevel: 'Moderate' },
        { id: 'nyc-6', lineName: 'NYC Ferry (East River Route)', type: 'ferry', status: 'Good Service', statusColor: 'green', headwayMinutes: 20, crowdingLevel: 'Low' }
      ];
    case 'lon':
      return [
        { id: 'lon-1', lineName: 'Elizabeth Line', type: 'train', status: 'Good Service', statusColor: 'green', headwayMinutes: 3, crowdingLevel: 'Moderate' },
        { id: 'lon-2', lineName: 'Central Line', type: 'subway', status: 'Minor Delays', statusColor: 'amber', delayText: '+6 min train maintenance at Holborn', headwayMinutes: 4, crowdingLevel: 'High' },
        { id: 'lon-3', lineName: 'Jubilee Line', type: 'subway', status: 'Good Service', statusColor: 'green', headwayMinutes: 2, crowdingLevel: 'Moderate' },
        { id: 'lon-4', lineName: 'Northern Line (Bank / Charing X branches)', type: 'subway', status: 'Good Service', statusColor: 'green', headwayMinutes: 3, crowdingLevel: 'High' },
        { id: 'lon-5', lineName: 'Route 24 Double-Decker 24h Bus', type: 'bus', status: 'Good Service', statusColor: 'green', headwayMinutes: 8, crowdingLevel: 'Low' },
        { id: 'lon-6', lineName: 'Thames Clippers Uber Boat', type: 'ferry', status: 'Good Service', statusColor: 'green', headwayMinutes: 15, crowdingLevel: 'Low' }
      ];
    case 'tyo':
      return [
        { id: 'tyo-1', lineName: 'JR Yamanote Line (Loop)', type: 'train', status: 'Good Service', statusColor: 'green', headwayMinutes: 2, crowdingLevel: 'High' },
        { id: 'tyo-2', lineName: 'Tokyo Metro Marunouchi Line', type: 'subway', status: 'Good Service', statusColor: 'green', headwayMinutes: 2, crowdingLevel: 'Moderate' },
        { id: 'tyo-3', lineName: 'Tokyo Metro Ginza Line', type: 'subway', status: 'Good Service', statusColor: 'green', headwayMinutes: 3, crowdingLevel: 'Moderate' },
        { id: 'tyo-4', lineName: 'JR Chuo Rapid Line', type: 'train', status: 'Minor Delays', statusColor: 'amber', delayText: '+4 min track inspection at Ochanomizu', headwayMinutes: 4, crowdingLevel: 'High' },
        { id: 'tyo-5', lineName: 'Toei Oedo Line (Sub-surface loop)', type: 'subway', status: 'Good Service', statusColor: 'green', headwayMinutes: 3, crowdingLevel: 'Moderate' }
      ];
    default:
      return [
        { id: `${city.id}-1`, lineName: `Metro Rapid Transit Line A`, type: 'subway', status: 'Good Service', statusColor: 'green', headwayMinutes: 4, crowdingLevel: 'Moderate' },
        { id: `${city.id}-2`, lineName: `Regional Commuter Express`, type: 'train', status: 'Good Service', statusColor: 'green', headwayMinutes: 10, crowdingLevel: 'Low' },
        { id: `${city.id}-3`, lineName: `Bus Rapid Transit (BRT Line 1)`, type: 'bus', status: 'Minor Delays', statusColor: 'amber', delayText: '+5 min traffic at central interchange', headwayMinutes: 6, crowdingLevel: 'Moderate' },
        { id: `${city.id}-4`, lineName: `City Tramway Core Line`, type: 'tram', status: 'Good Service', statusColor: 'green', headwayMinutes: 7, crowdingLevel: 'Low' }
      ];
  }
}

export function computeDepartureWindows(weather: WeatherData): DepartureWindow[] {
  const currentHour = new Date().getHours();
  const currentMin = new Date().getMinutes();
  
  const intervals = [
    { offsetMins: 0, label: 'Now' },
    { offsetMins: 20, label: '+20 mins' },
    { offsetMins: 45, label: '+45 mins' },
    { offsetMins: 75, label: '+1h 15m' },
    { offsetMins: 120, label: '+2 hours' },
    { offsetMins: 180, label: '+3 hours' }
  ];

  return intervals.map((int, index) => {
    const futureDate = new Date(Date.now() + int.offsetMins * 60 * 1000);
    const formattedTime = futureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hr = futureDate.getHours();

    // Check traffic curve
    let trafficLevel: 'Low' | 'Moderate' | 'Heavy' | 'Gridlock' = 'Moderate';
    let estMinFactor = 1.0;
    if ((hr >= 8 && hr <= 9) || (hr >= 17 && hr <= 19)) {
      trafficLevel = 'Heavy';
      estMinFactor = 1.45;
    } else if (hr >= 22 || hr <= 6) {
      trafficLevel = 'Low';
      estMinFactor = 0.85;
    } else if (hr >= 13 && hr <= 15) {
      trafficLevel = 'Moderate';
      estMinFactor = 1.05;
    }

    const hourlyForecast = weather.hourly[Math.min(index, weather.hourly.length - 1)];
    const precipRisk = hourlyForecast ? hourlyForecast.precipProb : weather.precipitationProbability;

    let tag = '';
    let recommendationRank = index + 1;
    if (trafficLevel === 'Low' && precipRisk < 20) {
      tag = 'Optimal Window (Zero Congestion)';
      recommendationRank = 1;
    } else if (trafficLevel === 'Heavy') {
      tag = 'Rush Hour Peak (Transit Preferred)';
      recommendationRank = 5;
    } else if (precipRisk > 50) {
      tag = 'Rain Inbound (Sheltered Transit)';
      recommendationRank = 4;
    } else {
      tag = 'Standard Commute Flow';
      recommendationRank = 2;
    }

    return {
      timeOffset: int.label,
      formattedTime,
      estimatedMinutes: Math.round(28 * estMinFactor),
      trafficLevel,
      weatherCondition: hourlyForecast ? `${hourlyForecast.temp}°C` : `${weather.temperature}°C`,
      precipitationRisk: precipRisk,
      recommendationRank,
      tag
    };
  }).sort((a, b) => a.recommendationRank - b.recommendationRank);
}
