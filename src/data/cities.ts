import { CityLocation } from '../types';

export const POPULAR_CITIES: CityLocation[] = [
  {
    id: 'nyc',
    name: 'New York City',
    country: 'USA',
    region: 'North America',
    lat: 40.7128,
    lng: -74.0060,
    timezone: 'America/New_York',
    transitAgency: 'MTA / NYC Transit',
    defaultOrigin: 'Times Square, Manhattan',
    defaultDestination: 'Financial District / Wall St',
    popularRoutes: [
      {
        origin: 'Times Square, Manhattan',
        destination: 'Financial District / Wall St',
        distanceKm: 6.8,
        description: 'Midtown to Lower Manhattan commuter corridor'
      },
      {
        origin: 'Williamsburg, Brooklyn',
        destination: 'Grand Central Terminal',
        distanceKm: 7.5,
        description: 'Interborough commute via L-train or Williamsburg Bridge'
      },
      {
        origin: 'JFK Airport',
        destination: 'Penn Station, Manhattan',
        distanceKm: 26.2,
        description: 'Airport express corridor via AirTrain & LIRR'
      }
    ]
  },
  {
    id: 'lon',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    lat: 51.5074,
    lng: -0.1278,
    timezone: 'Europe/London',
    transitAgency: 'Transport for London (TfL)',
    defaultOrigin: 'King\'s Cross St. Pancras',
    defaultDestination: 'Canary Wharf',
    popularRoutes: [
      {
        origin: 'King\'s Cross St. Pancras',
        destination: 'Canary Wharf',
        distanceKm: 8.9,
        description: 'Northern/Jubilee Line & A1203 corridor'
      },
      {
        origin: 'Victoria Station',
        destination: 'London Bridge',
        distanceKm: 5.4,
        description: 'South Bank commuter link'
      },
      {
        origin: 'Paddington',
        destination: 'Liverpool Street',
        distanceKm: 7.2,
        description: 'Elizabeth Line core cross-city spine'
      }
    ]
  },
  {
    id: 'tyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia Pacific',
    lat: 35.6762,
    lng: 139.6503,
    timezone: 'Asia/Tokyo',
    transitAgency: 'Tokyo Metro / JR East',
    defaultOrigin: 'Shinjuku Station',
    defaultDestination: 'Tokyo Station / Marunouchi',
    popularRoutes: [
      {
        origin: 'Shinjuku Station',
        destination: 'Tokyo Station / Marunouchi',
        distanceKm: 7.8,
        description: 'JR Chuo Line Rapid & Shuto Expressway'
      },
      {
        origin: 'Shibuya',
        destination: 'Roppongi Hills',
        distanceKm: 3.6,
        description: 'Hibiya / Hanzomon urban link'
      },
      {
        origin: 'Yokohama Station',
        destination: 'Shinagawa',
        distanceKm: 24.1,
        description: 'Tokaido Main Line suburban artery'
      }
    ]
  },
  {
    id: 'sfo',
    name: 'San Francisco',
    country: 'USA',
    region: 'North America',
    lat: 37.7749,
    lng: -122.4194,
    timezone: 'America/Los_Angeles',
    transitAgency: 'BART / SFMTA Muni',
    defaultOrigin: 'Mission District',
    defaultDestination: 'Salesforce Transit Center / SoMa',
    popularRoutes: [
      {
        origin: 'Mission District',
        destination: 'Salesforce Transit Center / SoMa',
        distanceKm: 4.8,
        description: 'Mission St & BART trunk route'
      },
      {
        origin: 'Oakland City Center',
        destination: 'Financial District SF',
        distanceKm: 14.5,
        description: 'Bay Bridge & Transbay Tube connector'
      },
      {
        origin: 'Marina District',
        destination: 'Silicon Valley Caltrain Station',
        distanceKm: 6.2,
        description: 'Van Ness corridor & 4th/King St terminal'
      }
    ]
  },
  {
    id: 'par',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    lat: 48.8566,
    lng: 2.3522,
    timezone: 'Europe/Paris',
    transitAgency: 'RATP / Île-de-France Mobilités',
    defaultOrigin: 'Gare du Nord',
    defaultDestination: 'La Défense Business Center',
    popularRoutes: [
      {
        origin: 'Gare du Nord',
        destination: 'La Défense Business Center',
        distanceKm: 10.4,
        description: 'RER A / Metro Line 1 west-east artery'
      },
      {
        origin: 'Montparnasse',
        destination: 'Châtelet - Les Halles',
        distanceKm: 4.2,
        description: 'Left Bank to Central Paris connection'
      }
    ]
  },
  {
    id: 'sin',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia Pacific',
    lat: 1.3521,
    lng: 103.8198,
    timezone: 'Asia/Singapore',
    transitAgency: 'LTA / SMRT & SBS Transit',
    defaultOrigin: 'Jurong East Hub',
    defaultDestination: 'Marina Bay Financial Centre',
    popularRoutes: [
      {
        origin: 'Jurong East Hub',
        destination: 'Marina Bay Financial Centre',
        distanceKm: 16.8,
        description: 'East-West Line & AYE expressway'
      },
      {
        origin: 'Orchard Road',
        destination: 'Changi Airport T3',
        distanceKm: 22.0,
        description: 'PIE Expressway & Downtown / EW Line'
      }
    ]
  },
  {
    id: 'chi',
    name: 'Chicago',
    country: 'USA',
    region: 'North America',
    lat: 41.8781,
    lng: -87.6298,
    timezone: 'America/Chicago',
    transitAgency: 'CTA / Metra',
    defaultOrigin: 'Lincoln Park',
    defaultDestination: 'The Loop / Willis Tower',
    popularRoutes: [
      {
        origin: 'Lincoln Park',
        destination: 'The Loop / Willis Tower',
        distanceKm: 5.9,
        description: 'Clark St / Red & Brown CTA Lines'
      },
      {
        origin: 'O\'Hare Terminal 1',
        destination: 'Millennium Station',
        distanceKm: 28.5,
        description: 'CTA Blue Line & I-90 Kennedy Expressway'
      }
    ]
  },
  {
    id: 'syd',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    lat: -33.8688,
    lng: 151.2093,
    timezone: 'Australia/Sydney',
    transitAgency: 'Transport for NSW',
    defaultOrigin: 'Parramatta CBD',
    defaultDestination: 'Sydney CBD / Circular Quay',
    popularRoutes: [
      {
        origin: 'Parramatta CBD',
        destination: 'Sydney CBD / Circular Quay',
        distanceKm: 23.4,
        description: 'T1 Western Line & M4 Western Motorway'
      },
      {
        origin: 'Bondi Beach',
        destination: 'Town Hall Station',
        distanceKm: 7.9,
        description: '333 Bus Rapid & Eastern Suburbs Line'
      }
    ]
  },
  {
    id: 'tor',
    name: 'Toronto',
    country: 'Canada',
    region: 'North America',
    lat: 43.6532,
    lng: -79.3832,
    timezone: 'America/Toronto',
    transitAgency: 'TTC / Metrolinx GO Transit',
    defaultOrigin: 'Yonge and Eglinton',
    defaultDestination: 'Union Station / Bay St',
    popularRoutes: [
      {
        origin: 'Yonge and Eglinton',
        destination: 'Union Station / Bay St',
        distanceKm: 7.1,
        description: 'Line 1 Yonge Subway & DVP arterial'
      },
      {
        origin: 'Mississauga City Centre',
        destination: 'Financial District Toronto',
        distanceKm: 27.8,
        description: 'GO Milton Line & Gardiner Expressway'
      }
    ]
  },
  {
    id: 'ams',
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    lat: 52.3676,
    lng: 4.9041,
    timezone: 'Europe/Amsterdam',
    transitAgency: 'GVB / NS Dutch Railways',
    defaultOrigin: 'Amsterdam Zuid',
    defaultDestination: 'Amsterdam Centraal',
    popularRoutes: [
      {
        origin: 'Amsterdam Zuid',
        destination: 'Amsterdam Centraal',
        distanceKm: 5.2,
        description: 'North-South Metro Line 52 & cycle superhighway'
      },
      {
        origin: 'Schiphol Airport',
        destination: 'Dam Square',
        distanceKm: 15.6,
        description: 'Sprinter Train & A4 Motorway'
      }
    ]
  }
];
