import React, { useState } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  Train, 
  CloudRain, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Navigation, 
  Eye, 
  ShieldCheck,
  Info,
  Car
} from 'lucide-react';
import { CityLocation, TrafficIncident, WeatherData } from '../types';

interface LiveTrafficMapProps {
  city: CityLocation;
  incidents: TrafficIncident[];
  weather: WeatherData;
  origin: string;
  destination: string;
}

export const LiveTrafficMap: React.FC<LiveTrafficMapProps> = ({
  city,
  incidents,
  weather,
  origin,
  destination
}) => {
  const [selectedIncident, setSelectedIncident] = useState<TrafficIncident | null>(null);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showTransitLines, setShowTransitLines] = useState(true);
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div id="live-traffic-map-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800 relative overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interactive Sensor Grid</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              60 FPS Live Feed
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">
            {city.name} Metropolitan Corridor & Network Topology
          </h2>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-colors font-medium ${
              showIncidents 
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs' 
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Incidents ({incidents.length})</span>
          </button>

          <button
            onClick={() => setShowTransitLines(!showTransitLines)}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-colors font-medium ${
              showTransitLines 
                ? 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-xs' 
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <Train className="w-3.5 h-3.5 text-indigo-600" />
            <span>Metro Spine</span>
          </button>

          <button
            onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 transition-colors font-medium ${
              showWeatherOverlay 
                ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-xs' 
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-blue-600" />
            <span>Precipitation</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 pl-1 border-l border-slate-200">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 shadow-xs"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 shadow-xs"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="relative mt-4 h-[380px] sm:h-[450px] bg-slate-900 rounded-2xl border-4 border-slate-100 overflow-hidden select-none shadow-inner">
        
        {/* Ambient Map Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#64748b 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 80px 80px, 80px 80px'
          }}
        ></div>

        {/* SVG Vector Roads & Transit lines */}
        <div 
          className="w-full h-full transition-transform duration-300 origin-center relative"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              {/* Animated dash pattern for live traffic */}
              <linearGradient id="expresswayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="65%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <linearGradient id="metroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Geographical River / Water Body */}
            <path
              d="M 0,220 Q 250,260 480,240 T 800,280 T 1000,230 L 1000,320 Q 800,380 500,330 T 0,310 Z"
              fill="#0b1329"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <text x="750" y="310" fill="#475569" fontSize="12" fontFamily="monospace">WATERWAY ARTERY</text>

            {/* Secondary Road Network */}
            <g stroke="#334155" strokeWidth="2.5" strokeDasharray="6,4">
              <line x1="120" y1="50" x2="120" y2="550" />
              <line x1="280" y1="50" x2="280" y2="550" />
              <line x1="450" y1="50" x2="450" y2="550" />
              <line x1="680" y1="50" x2="680" y2="550" />
              <line x1="860" y1="50" x2="860" y2="550" />

              <line x1="50" y1="120" x2="950" y2="120" />
              <line x1="50" y1="200" x2="950" y2="200" />
              <line x1="50" y1="380" x2="950" y2="380" />
              <line x1="50" y1="480" x2="950" y2="480" />
            </g>

            {/* Major Arterial Expressway 1 */}
            <path
              d="M 50,150 C 250,140 400,280 650,260 S 850,420 950,440"
              fill="none"
              stroke="#047857"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 50,150 C 250,140 400,280 650,260 S 850,420 950,440"
              fill="none"
              stroke="url(#expresswayGrad)"
              strokeWidth="4"
              strokeDasharray="14,8"
              className="animate-pulse"
            />

            {/* Central Orbital Ring Road */}
            <ellipse
              cx="500"
              cy="300"
              rx="280"
              ry="180"
              fill="none"
              stroke="#475569"
              strokeWidth="10"
            />
            <ellipse
              cx="500"
              cy="300"
              rx="280"
              ry="180"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeDasharray="20,10"
            />

            {/* Express Commute Highlight Route */}
            <path
              d="M 280,180 Q 400,230 520,300 T 720,400"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              filter="url(#glow)"
            />

            {/* Metro Rail Transit Lines */}
            {showTransitLines && (
              <g>
                <path
                  d="M 150,520 L 350,380 L 500,300 L 680,210 L 880,90"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="5"
                  strokeDasharray="8,5"
                />
                {/* Metro Stations */}
                {[[150,520], [350,380], [500,300], [680,210], [880,90]].map(([sx, sy], i) => (
                  <circle
                    key={i}
                    cx={sx}
                    cy={sy}
                    r="6"
                    fill="#0f172a"
                    stroke="#a5b4fc"
                    strokeWidth="3"
                  />
                ))}
              </g>
            )}

            {/* Weather Radar Overlay */}
            {showWeatherOverlay && weather.precipitationProbability > 20 && (
              <g opacity="0.35">
                <circle cx="680" cy="220" r="140" fill="#2563eb" filter="url(#glow)" />
                <circle cx="780" cy="260" r="90" fill="#3b82f6" />
                <text x="630" y="210" fill="#bfdbfe" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  RAIN RADAR {weather.precipitationProbability}%
                </text>
              </g>
            )}

            {/* Origin & Destination Pin Markers */}
            <g transform="translate(280, 180)">
              <circle r="14" fill="#10b981" opacity="0.3" className="animate-ping" />
              <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text x="12" y="4" fill="#6ee7b7" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                START: {origin.split(',')[0]}
              </text>
            </g>

            <g transform="translate(720, 400)">
              <circle r="14" fill="#6366f1" opacity="0.3" className="animate-ping" />
              <circle r="8" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
              <text x="12" y="4" fill="#c7d2fe" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                DEST: {destination.split('/')[0]}
              </text>
            </g>
          </svg>

          {/* Interactive Overlay Pins for Incidents */}
          {showIncidents && incidents.map((inc) => {
            const leftPercent = inc.coords[0];
            const topPercent = inc.coords[1];
            const isSelected = selectedIncident?.id === inc.id;

            return (
              <div
                key={inc.id}
                style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                onClick={() => setSelectedIncident(isSelected ? null : inc)}
              >
                <div className={`p-1.5 rounded-full shadow-lg border transition-transform duration-200 group-hover:scale-125 ${
                  inc.severity === 'high' ? 'bg-red-600 border-red-200 text-white animate-bounce' :
                  inc.severity === 'moderate' ? 'bg-amber-500 border-amber-200 text-white' :
                  'bg-indigo-600 border-indigo-200 text-white'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>

                {/* Micro Label */}
                <div className="absolute left-1/2 -translate-x-1/2 top-7 whitespace-nowrap bg-slate-900 text-[10px] text-slate-100 px-2 py-0.5 rounded-lg border border-slate-700 shadow-md pointer-events-none opacity-90 group-hover:opacity-100">
                  +{inc.delayMinutes}m delay
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Incident Detail Callout Drawer */}
        {selectedIncident && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-96 bg-white/95 border border-slate-200 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-30 animate-in slide-in-from-bottom-3 text-slate-900">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedIncident.severity === 'high' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {selectedIncident.type}
                </span>
                <span className="text-xs font-bold text-slate-900">{selectedIncident.title}</span>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-mono px-1.5 py-0.5 bg-slate-100 rounded-md"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedIncident.description}</p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
              <div className="text-amber-600 font-bold">+{selectedIncident.delayMinutes} mins delay</div>
              <div className="font-mono text-[10px] text-slate-400">{selectedIncident.verifiedSource}</div>
            </div>
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute top-3 left-3 bg-white/95 border border-slate-200 rounded-xl p-3 text-[11px] shadow-lg backdrop-blur-md z-10 hidden sm:block text-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Live Traffic Speeds</div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-1.5 bg-emerald-500 rounded-full"></span>
              <span className="text-slate-700 font-medium">Free Flow (&gt;65 km/h)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-1.5 bg-amber-500 rounded-full"></span>
              <span className="text-slate-700 font-medium">Moderate (35-65 km/h)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-1.5 bg-red-500 rounded-full"></span>
              <span className="text-slate-700 font-medium">Congested (&lt;35 km/h)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-1.5 bg-indigo-500 rounded-full"></span>
              <span className="text-slate-700 font-medium">Metro Rail Track</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
