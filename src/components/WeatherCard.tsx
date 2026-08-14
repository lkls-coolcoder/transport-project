import React from 'react';
import { 
  CloudSun, 
  Sun, 
  SunMedium, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudRainWind, 
  CloudSnow, 
  Snowflake, 
  CloudLightning, 
  Zap,
  Wind, 
  Droplets, 
  Eye, 
  ShieldAlert, 
  AlertCircle,
  Thermometer,
  Gauge
} from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
  cityName: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, unit, cityName }) => {
  const formatTemp = (celsius: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const getWeatherIcon = (iconName: string, className: string = 'w-8 h-8') => {
    switch (iconName) {
      case 'Sun': return <Sun className={`${className} text-amber-400`} />;
      case 'SunMedium': return <SunMedium className={`${className} text-amber-300`} />;
      case 'CloudSun': return <CloudSun className={`${className} text-amber-200`} />;
      case 'Cloud': return <Cloud className={`${className} text-slate-300`} />;
      case 'CloudFog': return <CloudFog className={`${className} text-slate-400`} />;
      case 'CloudDrizzle': return <CloudDrizzle className={`${className} text-cyan-300`} />;
      case 'CloudRain': return <CloudRain className={`${className} text-cyan-400`} />;
      case 'CloudRainWind': return <CloudRainWind className={`${className} text-cyan-500`} />;
      case 'CloudSnow': return <CloudSnow className={`${className} text-indigo-200`} />;
      case 'Snowflake': return <Snowflake className={`${className} text-indigo-300`} />;
      case 'CloudLightning': return <CloudLightning className={`${className} text-amber-400`} />;
      case 'Zap': return <Zap className={`${className} text-amber-400`} />;
      default: return <CloudSun className={`${className} text-amber-300`} />;
    }
  };

  const getHazardBadge = (level: string) => {
    switch (level) {
      case 'Severe':
        return {
          bg: 'bg-red-50 border-red-200 text-red-800 border-l-4 border-l-red-600',
          dot: 'bg-red-600',
          title: 'Severe Road & Weather Alert'
        };
      case 'High':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800 border-l-4 border-l-amber-500',
          dot: 'bg-amber-500',
          title: 'High Road Hazard Warning'
        };
      case 'Moderate':
        return {
          bg: 'bg-yellow-50 border-yellow-200 text-yellow-800 border-l-4 border-l-yellow-500',
          dot: 'bg-yellow-500',
          title: 'Moderate Commute Caution'
        };
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800 border-l-4 border-l-emerald-600',
          dot: 'bg-emerald-600',
          title: 'Optimal Commuter Conditions'
        };
    }
  };

  const hazard = getHazardBadge(weather.roadHazardLevel);

  return (
    <div id="weather-card-container" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800 flex flex-col justify-between h-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Weather</h3>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">{cityName} • {weather.condition}</div>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
            {getWeatherIcon(weather.weatherIcon, 'w-6 h-6')}
          </div>
        </div>

        {/* Big Temperature Display */}
        <div className="flex items-baseline justify-between my-2">
          <div>
            <div className="text-4xl font-light text-slate-800 tracking-tight">{formatTemp(weather.temperature)}</div>
            <div className="text-xs text-slate-500 font-medium">Feels like {formatTemp(weather.feelsLike)}</div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400">Updated {weather.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Atmospheric Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 my-2 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Wind</div>
          <div className="text-sm font-semibold text-slate-800">{weather.windSpeed} km/h</div>
          <div className="text-[10px] text-slate-400">Gusts {weather.windGusts} km/h</div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Precip</div>
          <div className="text-sm font-semibold text-slate-800">{weather.precipitationProbability}%</div>
          <div className="text-[10px] text-slate-400">{weather.precipitation > 0 ? `${weather.precipitation} mm/h` : 'Dry radar'}</div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Visibility</div>
          <div className="text-sm font-semibold text-slate-800">{weather.visibilityKm} km</div>
          <div className="text-[10px] text-slate-400">{weather.visibilityKm > 8 ? 'Good' : 'Reduced'}</div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Humidity</div>
          <div className="text-sm font-semibold text-slate-800">{weather.humidity}%</div>
          <div className="text-[10px] text-slate-400">UV Index {weather.uvIndex}</div>
        </div>
      </div>

      {/* Road Hazard Banner */}
      <div className={`p-3 rounded-xl border flex items-start space-x-3 my-2 ${hazard.bg}`}>
        <div className="mt-0.5">
          <span className={`w-2 h-2 rounded-full inline-block ${hazard.dot} animate-ping`}></span>
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider">{hazard.title}: {weather.roadHazardLevel}</div>
          <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{weather.roadHazardNote}</div>
        </div>
      </div>

      {/* 12-Hour Forecast Timeline with Traffic Heat Indicator */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          <span>12-Hour Timeline</span>
          <span className="text-[10px] text-slate-500 font-mono lowercase tracking-normal">traffic congestion %</span>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {weather.hourly.map((hour, idx) => (
            <div 
              key={idx}
              className="flex-shrink-0 w-20 bg-slate-50 border border-slate-100 rounded-xl p-2 text-center"
            >
              <div className="text-[11px] font-semibold text-slate-600">{hour.time}</div>
              <div className="my-1 flex justify-center">
                {getWeatherIcon(weather.weatherIcon, 'w-4 h-4')}
              </div>
              <div className="text-xs font-bold text-slate-800">{formatTemp(hour.temp)}</div>
              <div className="text-[10px] text-indigo-600 font-mono">{hour.precipProb}% rain</div>

              {/* Congestion Bar */}
              <div className="mt-1.5 pt-1 border-t border-slate-200">
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      hour.trafficCongestion > 75 ? 'bg-red-500' :
                      hour.trafficCongestion > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${hour.trafficCongestion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
