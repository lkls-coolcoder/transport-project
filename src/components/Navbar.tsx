import React, { useState, useEffect } from 'react';
import { 
  Navigation2, 
  MapPin, 
  Search, 
  Activity, 
  MessageSquarePlus, 
  Gauge, 
  ShieldCheck, 
  RefreshCw,
  Compass,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { CityLocation } from '../types';
import { POPULAR_CITIES } from '../data/cities';

interface NavbarProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onUseGeolocation: () => void;
  unit: 'celsius' | 'fahrenheit';
  onToggleUnit: () => void;
  activeTab: 'optimizer' | 'map' | 'alerts' | 'telemetry';
  setActiveTab: (tab: 'optimizer' | 'map' | 'alerts' | 'telemetry') => void;
  onOpenFeedback: () => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  onUseGeolocation,
  unit,
  onToggleUnit,
  activeTab,
  setActiveTab,
  onOpenFeedback,
  isLoading,
  onRefresh
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredCities = POPULAR_CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 text-white">
              <div className="w-4 h-4 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  VECTRA<span className="text-indigo-600">TRANSIT</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Geometric Multi-Modal Commuter Intelligence</p>
            </div>
          </div>

          {/* City Selector Dropdown & Geolocation */}
          <div className="relative">
            <button
              id="city-selector-btn"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors text-slate-700 shadow-sm"
            >
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-900">{currentCity.name}</span>
              <span className="text-xs text-slate-500">({currentCity.country})</span>
            </button>

            {cityDropdownOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95">
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search city or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 text-sm text-slate-900 pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  onClick={() => {
                    onUseGeolocation();
                    setCityDropdownOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 text-left px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors mb-1 border border-dashed border-indigo-200"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Use My Current GPS Coordinates</span>
                </button>

                <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelectCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition-colors ${
                        city.id === currentCity.id 
                          ? 'bg-indigo-50 text-indigo-900 font-semibold' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{city.name}</div>
                        <div className="text-xs text-slate-500">{city.transitAgency}</div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{city.region}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right utility buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Unit Toggle */}
            <button
              id="unit-toggle-btn"
              onClick={onToggleUnit}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-700 transition-colors shadow-sm"
              title="Toggle Celsius / Fahrenheit"
            >
              {unit === 'celsius' ? '°C Metric' : '°F Imperial'}
            </button>

            {/* Refresh Button */}
            <button
              id="refresh-telemetry-btn"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-sm disabled:opacity-50"
              title="Refresh Live Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* Broken Link / Feedback Button */}
            <button
              id="feedback-report-btn"
              onClick={onOpenFeedback}
              className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-700 transition-colors shadow-sm"
              title="Report issue or broken link"
            >
              <MessageSquarePlus className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Feedback / Report</span>
            </button>

            {/* Clock Ticker */}
            <div className="hidden lg:flex items-center text-xs font-mono font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              {currentTime}
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-1 sm:space-x-3 border-t border-slate-100 py-2.5 overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            id="tab-optimizer"
            onClick={() => setActiveTab('optimizer')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'optimizer' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>Best Transport Optimizer</span>
          </button>

          <button
            id="tab-map"
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'map' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Live Traffic & Weather Map</span>
          </button>

          <button
            id="tab-alerts"
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'alerts' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Transit & Incident Alerts</span>
          </button>

          <button
            id="tab-telemetry"
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'telemetry' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Health & Telemetry Analytics</span>
          </button>
        </div>
      </div>
    </header>
  );
};
