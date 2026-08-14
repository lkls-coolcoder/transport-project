import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  ArrowRightLeft, 
  Locate, 
  Compass, 
  Search, 
  Sparkles, 
  Crosshair, 
  Check, 
  SlidersHorizontal,
  Info,
  ExternalLink
} from 'lucide-react';
import { CityLocation } from '../types';
import { 
  parseGpsCoordinates, 
  formatCoordinates, 
  calculateGpsDistanceKm, 
  CITY_GPS_PRESETS,
  Coordinates 
} from '../utils/geoUtils';

interface RouteQueryBarProps {
  city: CityLocation;
  origin: string;
  destination: string;
  setOrigin: (val: string) => void;
  setDestination: (val: string) => void;
  distanceKm: number;
  setDistanceKm: (val: number) => void;
  onQuerySubmit?: () => void;
}

export const RouteQueryBar: React.FC<RouteQueryBarProps> = ({
  city,
  origin,
  destination,
  setOrigin,
  setDestination,
  distanceKm,
  setDistanceKm,
  onQuerySubmit
}) => {
  const [gpsMode, setGpsMode] = useState<boolean>(false);
  const [locatingOrigin, setLocatingOrigin] = useState<boolean>(false);
  const [locatingDest, setLocatingDest] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState<boolean>(false);

  // Parse GPS coordinates if present
  const originCoords: Coordinates | null = parseGpsCoordinates(origin);
  const destCoords: Coordinates | null = parseGpsCoordinates(destination);

  // Auto-calculate distance when both are valid GPS coordinates
  useEffect(() => {
    if (originCoords && destCoords) {
      const calculatedKm = calculateGpsDistanceKm(originCoords, destCoords);
      if (calculatedKm > 0 && Math.abs(calculatedKm - distanceKm) > 0.3) {
        setDistanceKm(calculatedKm);
      }
    }
  }, [origin, destination]);

  // Handle GPS Geolocation for Origin or Destination
  const handleGetLocation = (target: 'origin' | 'dest') => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    if (target === 'origin') setLocatingOrigin(true);
    else setLocatingDest(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const formatted = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        
        if (target === 'origin') {
          setOrigin(formatted);
          setLocatingOrigin(false);
        } else {
          setDestination(formatted);
          setLocatingDest(false);
        }
      },
      (err) => {
        console.warn('Geolocation warning:', err.message);
        // Fallback default city center coordinate with slight offset
        const fallbackLat = Number((city.lat + (target === 'origin' ? -0.012 : 0.015)).toFixed(4));
        const fallbackLng = Number((city.lng + (target === 'origin' ? -0.018 : 0.022)).toFixed(4));
        const fallbackStr = `${fallbackLat}, ${fallbackLng}`;
        
        if (target === 'origin') {
          setOrigin(fallbackStr);
          setLocatingOrigin(false);
        } else {
          setDestination(fallbackStr);
          setLocatingDest(false);
        }
        setGeoError('GPS permission was blocked or unavailable. Inserted simulated local coordinate.');
        setTimeout(() => setGeoError(null), 5000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const cityPresets = CITY_GPS_PRESETS[city.id] || CITY_GPS_PRESETS['sin'] || [];

  return (
    <div id="route-query-bar-container" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800 space-y-4">
      
      {/* Top Bar Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Transit Route Finder
            </span>
            <span className="text-xs text-slate-400 font-mono">• Active Region: {city.name}</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1 flex items-center space-x-1.5">
            <span>Find Best Way Between Two Points</span>
          </h2>
        </div>

        {/* Action Toggles: GPS Mode, Presets */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            id="toggle-gps-mode-btn"
            onClick={() => setGpsMode(!gpsMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              gpsMode 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Toggle GPS Coordinate formatting & guidance"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{gpsMode ? 'GPS Coords Mode Active' : 'Enable GPS Coordinates Mode'}</span>
          </button>

          <button
            type="button"
            id="toggle-presets-btn"
            onClick={() => setShowPresets(!showPresets)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
            <span>Landmarks</span>
          </button>
        </div>
      </div>

      {/* Geolocation Notice / Error banner */}
      {geoError && (
        <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-xl px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{geoError}</span>
          </div>
          <button onClick={() => setGeoError(null)} className="text-amber-700 hover:text-amber-900 font-bold ml-2">×</button>
        </div>
      )}

      {/* Main Query Bar Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* ORIGIN INPUT */}
        <div className="md:col-span-5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Origin (Start / GPS)</span>
            </div>
            {originCoords ? (
              <span className="text-[10px] text-emerald-600 font-mono font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                📍 {formatCoordinates(originCoords.lat, originCoords.lng)}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-normal">Name or Lat, Lng</span>
            )}
          </div>

          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 absolute left-3 text-emerald-600 pointer-events-none" />
            <input
              type="text"
              id="origin-query-input"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder={gpsMode ? "e.g. 1.3332, 103.7431" : "Enter origin name, address, or GPS..."}
              className={`w-full text-sm text-slate-900 pl-9 pr-10 py-2.5 rounded-xl border focus:outline-none focus:bg-white font-medium transition-all ${
                originCoords 
                  ? 'bg-emerald-50/50 border-emerald-300 focus:border-emerald-500' 
                  : 'bg-slate-50 border-slate-200 focus:border-indigo-600'
              }`}
            />
            {/* GPS Locate Button */}
            <button
              type="button"
              onClick={() => handleGetLocation('origin')}
              disabled={locatingOrigin}
              className="absolute right-2 p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Use current device GPS location"
            >
              <Locate className={`w-4 h-4 ${locatingOrigin ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* SWAP BUTTON */}
        <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
          <button
            type="button"
            id="swap-route-btn"
            onClick={handleSwap}
            className="p-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-600 rounded-xl border border-slate-200 transition-colors shadow-xs"
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* DESTINATION INPUT */}
        <div className="md:col-span-4 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>Destination (End / GPS)</span>
            </div>
            {destCoords ? (
              <span className="text-[10px] text-indigo-600 font-mono font-semibold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                📍 {formatCoordinates(destCoords.lat, destCoords.lng)}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-normal">Name or Lat, Lng</span>
            )}
          </div>

          <div className="relative flex items-center">
            <Navigation className="w-4 h-4 absolute left-3 text-indigo-600 pointer-events-none" />
            <input
              type="text"
              id="destination-query-input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={gpsMode ? "e.g. 1.2798, 103.8540" : "Enter destination name, address, or GPS..."}
              className={`w-full text-sm text-slate-900 pl-9 pr-10 py-2.5 rounded-xl border focus:outline-none focus:bg-white font-medium transition-all ${
                destCoords 
                  ? 'bg-indigo-50/50 border-indigo-300 focus:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 focus:border-indigo-600'
              }`}
            />
            {/* GPS Locate Button */}
            <button
              type="button"
              onClick={() => handleGetLocation('dest')}
              disabled={locatingDest}
              className="absolute right-2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Use current device GPS location for destination"
            >
              <Locate className={`w-4 h-4 ${locatingDest ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* QUERY ACTION / SUBMIT */}
        <div className="md:col-span-2 pt-2 md:pt-4">
          <button
            type="button"
            id="find-route-action-btn"
            onClick={onQuerySubmit}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Find Route</span>
          </button>
        </div>
      </div>

      {/* Distance Slider & Coordinate Sync Info */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 rounded-xl p-3 border border-slate-200/80">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-700">Estimated Corridor Distance:</span>
          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            {distanceKm} km
          </span>
          {originCoords && destCoords && (
            <span className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Haversine GPS Calculated</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-64">
          <span className="text-slate-400 text-[11px]">Adjust:</span>
          <input
            type="range"
            min={0.5}
            max={35}
            step={0.5}
            value={distanceKm}
            onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-slate-500 font-mono text-[11px] w-12 text-right">{distanceKm}km</span>
        </div>
      </div>

      {/* Landmark & GPS Coordinate Presets Drawer */}
      {(showPresets || gpsMode) && (
        <div className="pt-3 border-t border-slate-100 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quick GPS Coordinates & Landmarks ({city.name})</span>
            </span>
            <span className="text-[11px] text-slate-400">Click to assign as Origin or Destination</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {cityPresets.map((preset, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs hover:border-indigo-300 hover:shadow-xs transition-all space-y-1.5"
              >
                <div className="font-semibold text-slate-800 line-clamp-1">{preset.name}</div>
                <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>{preset.lat}, {preset.lng}</span>
                </div>
                <div className="flex items-center space-x-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setOrigin(`${preset.lat}, ${preset.lng}`)}
                    className="flex-1 py-1 px-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200 transition-colors text-center"
                  >
                    Set Origin
                  </button>
                  <button
                    type="button"
                    onClick={() => setDestination(`${preset.lat}, ${preset.lng}`)}
                    className="flex-1 py-1 px-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-200 transition-colors text-center"
                  >
                    Set Dest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
