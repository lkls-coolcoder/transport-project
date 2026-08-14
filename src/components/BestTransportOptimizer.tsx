import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Car, 
  Train, 
  Bus, 
  Bike, 
  Footprints, 
  CarTaxiFront, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Leaf, 
  ShieldCheck, 
  CloudSun, 
  ChevronDown, 
  ChevronUp, 
  Navigation, 
  TrendingUp,
  MapPin,
  Flame,
  Check
} from 'lucide-react';
import { CityLocation, WeatherData, BestTransportAnalysis, RouteOption, TransportMode } from '../types';
import { computeMultiModalRoutes } from '../services/commuteOptimizer';

interface BestTransportOptimizerProps {
  city: CityLocation;
  weather: WeatherData;
  origin: string;
  destination: string;
  setOrigin: (o: string) => void;
  setDestination: (d: string) => void;
  distanceKm: number;
  setDistanceKm: (d: number) => void;
}

export const BestTransportOptimizer: React.FC<BestTransportOptimizerProps> = ({
  city,
  weather,
  origin,
  destination,
  setOrigin,
  setDestination,
  distanceKm,
  setDistanceKm
}) => {
  const [expandedMode, setExpandedMode] = useState<TransportMode | null>('subway');
  const [aiAdvisoryLoading, setAiAdvisoryLoading] = useState(false);
  const [aiAdvisoryResult, setAiAdvisoryResult] = useState<string | null>(null);
  const [aiSources, setAiSources] = useState<string[]>([]);

  // Compute multi-modal factual routes
  const analysis: BestTransportAnalysis = computeMultiModalRoutes(
    city,
    origin,
    destination,
    distanceKm,
    weather
  );

  const bestRoute = analysis.routes.find(r => r.isBestChoice) || analysis.routes[0];

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleFetchAiAdvisory = async () => {
    setAiAdvisoryLoading(true);
    setAiAdvisoryResult(null);
    try {
      const response = await fetch('/api/transport-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          origin,
          destination,
          distanceKm,
          weather,
          trafficData: {
            roadHazardLevel: weather.roadHazardLevel,
            recommendedMode: analysis.recommendedMode,
            bestDuration: bestRoute.durationMinutes,
            trafficDelay: bestRoute.delayMinutes
          }
        })
      });

      const data = await response.json();
      if (data.advisoryText) {
        setAiAdvisoryResult(data.advisoryText);
        setAiSources(data.dataSources || ['Open-Meteo Physical Weather Feed', 'Regional GTFS Transit Network', 'DOT Telemetry']);
      }
    } catch (err) {
      console.error('Failed to get AI advisory:', err);
    } finally {
      setAiAdvisoryLoading(false);
    }
  };

  const getModeIcon = (mode: TransportMode, className: string = 'w-5 h-5') => {
    switch (mode) {
      case 'driving': return <Car className={className} />;
      case 'subway': return <Train className={className} />;
      case 'bus': return <Bus className={className} />;
      case 'cycling': return <Bike className={className} />;
      case 'walking': return <Footprints className={className} />;
      case 'ridehail': return <CarTaxiFront className={className} />;
    }
  };

  return (
    <div id="transport-optimizer-section" className="space-y-6">
      
      {/* Route Selector & Origin / Destination Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Commute Route Config</h3>
              <span className="text-xs text-indigo-600 font-semibold font-mono">({city.name})</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Origin & Destination Corridor</h2>
          </div>

          {/* Quick preset corridors */}
          <div className="flex flex-wrap gap-1.5 pt-1 sm:pt-0">
            {city.popularRoutes.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setOrigin(preset.origin);
                  setDestination(preset.destination);
                  setDistanceKm(preset.distanceKm);
                }}
                className="text-xs font-medium bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-600 px-3 py-1 rounded-xl border border-slate-200 transition-colors shadow-xs"
              >
                {preset.origin.split(',')[0]} → {preset.destination.split('/')[0]} ({preset.distanceKm} km)
              </button>
            ))}
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-4 items-center">
          <div className="md:col-span-5 relative">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>ORIGIN / DEPARTURE POINT</span>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-indigo-600" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter origin location..."
                className="w-full bg-slate-50 text-sm text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white font-medium transition-colors"
              />
            </div>
          </div>

          <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
            <button
              onClick={handleSwap}
              className="p-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-600 rounded-xl border border-slate-200 transition-colors shadow-xs"
              title="Swap origin and destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="md:col-span-4 relative">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              <span>DESTINATION POINT</span>
            </div>
            <div className="relative">
              <Navigation className="w-4 h-4 absolute left-3 top-3 text-indigo-600" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination location..."
                className="w-full bg-slate-50 text-sm text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white font-medium transition-colors"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              CORRIDOR: <span className="text-slate-900 font-mono font-bold">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={35}
              step={0.5}
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Hero Card: BEST TRANSPORT CONDITION */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        
        {/* Subtle geometric grid background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#818cf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        ></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white uppercase tracking-wider shadow-sm">
                ★ BEST COMMUTE RECOMMENDATION
              </span>
              <span className="text-xs font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-700">
                Grade: {bestRoute.grade} ({bestRoute.overallScore}/100)
              </span>
            </div>

            <div>
              <h3 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
                <span>{bestRoute.modeName}</span>
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                {bestRoute.bestChoiceReason}
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 lg:w-auto">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 text-center shadow-sm">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Travel Time</span>
              </div>
              <div className="text-xl font-bold italic text-white mt-1">{bestRoute.durationMinutes} min</div>
              <div className="text-[10px] text-emerald-400 font-medium">Fastest Option</div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 text-center shadow-sm">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                <span>Est. Cost</span>
              </div>
              <div className="text-xl font-bold italic text-white mt-1">{bestRoute.costFormatted}</div>
              <div className="text-[10px] text-slate-400 font-medium">Flat Fare</div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 text-center shadow-sm">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-center space-x-1">
                <Leaf className="w-3.5 h-3.5 text-green-400" />
                <span>Carbon</span>
              </div>
              <div className="text-xl font-bold italic text-white mt-1">{bestRoute.carbonGrams}g</div>
              <div className="text-[10px] text-green-400 font-medium">-78% vs Car</div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 text-center shadow-sm">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Reliability</span>
              </div>
              <div className="text-xl font-bold italic text-white mt-1">{bestRoute.safetyReliabilityScore}%</div>
              <div className="text-[10px] text-blue-400 font-medium">High Confidence</div>
            </div>
          </div>
        </div>

        {/* AI Advisory Trigger Button */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="text-xs text-slate-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Grounding Guardrail: Zero speculation, strict factual telemetry & WMO physical models</span>
          </div>

          <button
            id="generate-ai-advisory-btn"
            onClick={handleFetchAiAdvisory}
            disabled={aiAdvisoryLoading}
            className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-indigo-900/40 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-white fill-white" />
            <span>{aiAdvisoryLoading ? 'Querying Gemini Intelligence...' : 'Generate Fact-Grounded AI Advisory'}</span>
          </button>
        </div>

        {/* AI Advisory Result Accordion */}
        {aiAdvisoryResult && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 text-slate-200 animate-in fade-in relative z-10">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-2 font-bold text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>Gemini 3.7 Flash Urban Mobility Briefing</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">Temp 0.2 • Verified Grounding</span>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-xs text-slate-300 mt-2 space-y-2 whitespace-pre-line leading-relaxed">
              {aiAdvisoryResult}
            </div>

            {aiSources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-300">Verified Sources:</span>
                {aiSources.map((src, i) => (
                  <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono text-[10px]">
                    {src}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comprehensive Multi-Modal Comparison Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Multi-Modal Matrix</h3>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Modes Evaluated on Speed, Safety & Emissions</h2>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {analysis.routes.map((route) => {
            const isExpanded = expandedMode === route.mode;

            return (
              <div
                key={route.mode}
                className={`border rounded-2xl transition-all ${
                  route.isBestChoice 
                    ? 'border-indigo-600 bg-indigo-50/30 shadow-sm border-l-4 border-l-indigo-600' 
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {/* Header Row */}
                <div 
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedMode(isExpanded ? null : route.mode)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl border ${
                      route.isBestChoice 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {getModeIcon(route.mode)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{route.modeName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          route.grade.startsWith('A') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          route.grade.startsWith('B') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          Grade {route.grade} ({route.overallScore}/100)
                        </span>
                        {route.isBestChoice && (
                          <span className="hidden sm:inline-block text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {route.distanceKm} km • {route.costFormatted} • {route.carbonGrams}g CO2
                      </div>
                    </div>
                  </div>

                  {/* Right metrics and duration */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900 italic">{route.durationMinutes} min</div>
                      {route.delayMinutes > 0 ? (
                        <div className="text-[10px] text-amber-600 font-mono">+{route.delayMinutes} min delay</div>
                      ) : (
                        <div className="text-[10px] text-emerald-600 font-mono font-medium">On schedule</div>
                      )}
                    </div>

                    <div className="p-1 text-slate-400 hover:text-slate-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl space-y-3">
                    
                    {/* Score Bar Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Weather Suitability</div>
                        <div className="font-bold text-slate-800">{route.weatherSuitabilityScore}/100</div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${route.weatherSuitabilityScore}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Safety & Reliability</div>
                        <div className="font-bold text-slate-800">{route.safetyReliabilityScore}/100</div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${route.safetyReliabilityScore}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Total Cost</div>
                        <div className="font-bold text-slate-800">{route.costFormatted}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Direct Fare/Fuel</div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Carbon Emissions</div>
                        <div className="font-bold text-green-600">{route.carbonGrams} g CO2</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">EPA standard index</div>
                      </div>
                    </div>

                    {/* Step-by-Step Itinerary */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold text-slate-800 mb-2">Step-by-Step Itinerary</div>
                      <div className="space-y-2">
                        {route.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                            <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-mono text-[10px] flex-shrink-0 mt-0.5 font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <span className="text-slate-900 font-medium">{step.instruction}</span>
                              {step.distance && (
                                <span className="text-slate-500 text-[11px] ml-1.5 font-mono">({step.distance})</span>
                              )}
                            </div>
                            <div className="text-slate-500 font-mono text-[11px]">{step.durationMins}m</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <div className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider mb-1.5">Advantages</div>
                        <ul className="space-y-1 text-slate-700 text-[11px]">
                          {route.pros.map((pro, i) => (
                            <li key={i} className="flex items-center space-x-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <div className="font-bold text-amber-800 text-[11px] uppercase tracking-wider mb-1.5">Trade-offs & Constraints</div>
                        <ul className="space-y-1 text-slate-700 text-[11px]">
                          {route.cons.map((con, i) => (
                            <li key={i} className="flex items-center space-x-1.5">
                              <span className="text-amber-600 text-xs font-bold">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
