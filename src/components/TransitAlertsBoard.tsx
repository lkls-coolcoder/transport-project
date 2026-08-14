import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Train, 
  Bus, 
  Ship, 
  Clock, 
  Users, 
  Filter, 
  CheckCircle2, 
  AlertOctagon,
  Wrench,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { CityLocation, TrafficIncident, TransitLineStatus } from '../types';

interface TransitAlertsBoardProps {
  city: CityLocation;
  transitLines: TransitLineStatus[];
  incidents: TrafficIncident[];
}

export const TransitAlertsBoard: React.FC<TransitAlertsBoardProps> = ({
  city,
  transitLines,
  incidents
}) => {
  const [transitFilter, setTransitFilter] = useState<'all' | 'subway' | 'bus' | 'train' | 'ferry'>('all');
  const [incidentSeverityFilter, setIncidentSeverityFilter] = useState<'all' | 'critical' | 'high' | 'moderate' | 'low'>('all');

  const filteredTransit = transitLines.filter(line => 
    transitFilter === 'all' ? true : line.type === transitFilter
  );

  const filteredIncidents = incidents.filter(inc =>
    incidentSeverityFilter === 'all' ? true : inc.severity === incidentSeverityFilter
  );

  return (
    <div id="transit-alerts-board-section" className="space-y-6">
      
      {/* Transit Lines Status Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Public Transit Matrix</h3>
              <span className="text-xs text-indigo-600 font-semibold font-mono">({city.transitAgency})</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Live Line Status & Headways</h2>
          </div>

          {/* Type filter tabs */}
          <div className="flex items-center space-x-1.5 text-xs">
            {(['all', 'subway', 'train', 'bus', 'ferry'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTransitFilter(type)}
                className={`px-3 py-1 rounded-xl capitalize transition-colors font-medium ${
                  transitFilter === type 
                    ? 'bg-indigo-600 text-white font-bold shadow-xs' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Lines Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {filteredTransit.map(line => (
            <div
              key={line.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                      {line.type === 'subway' ? <Train className="w-4 h-4 text-indigo-600" /> :
                       line.type === 'train' ? <Train className="w-4 h-4 text-blue-600" /> :
                       line.type === 'bus' ? <Bus className="w-4 h-4 text-emerald-600" /> :
                       <Ship className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 leading-tight block">{line.lineName}</span>
                      <span className="text-[10px] text-slate-400 font-mono capitalize">{line.type}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono whitespace-nowrap ${
                    line.status === 'Good Service' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    line.status === 'Minor Delays' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {line.status}
                  </span>
                </div>

                {line.delayText && (
                  <p className="text-[11px] text-amber-800 mt-2 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    {line.delayText}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-200">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Every {line.headwayMinutes} mins</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>Crowding: <strong className="text-slate-700">{line.crowdingLevel}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Traffic Incidents & Road Disruptions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Incident Telemetry</h3>
              <span className="text-xs text-amber-600 font-bold font-mono">({filteredIncidents.length} Active)</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">Active Roadway Incidents & Bottlenecks</h2>
          </div>

          {/* Severity filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 mr-1 hidden sm:inline font-medium">Severity:</span>
            {(['all', 'high', 'moderate', 'low'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setIncidentSeverityFilter(sev)}
                className={`px-3 py-1 rounded-xl capitalize transition-colors font-medium ${
                  incidentSeverityFilter === sev 
                    ? 'bg-indigo-600 text-white font-bold shadow-xs' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {filteredIncidents.map(inc => (
            <div
              key={inc.id}
              className={`bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-xs ${
                inc.severity === 'high' ? 'border-l-4 border-l-red-500' :
                inc.severity === 'moderate' ? 'border-l-4 border-l-amber-500' :
                'border-l-4 border-l-indigo-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl border mt-0.5 ${
                  inc.severity === 'high' ? 'bg-red-50 text-red-600 border-red-200' :
                  inc.severity === 'moderate' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                  'bg-indigo-50 text-indigo-600 border-indigo-200'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{inc.title}</span>
                    <span className="text-xs text-slate-500 font-mono">@ {inc.location}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      inc.severity === 'high' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inc.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{inc.description}</p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                    <span>Reported {inc.reportedAt}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-mono font-medium">Source: {inc.verifiedSource}</span>
                  </div>
                </div>
              </div>

              {/* Delay badge */}
              <div className="sm:text-right flex-shrink-0">
                <div className="inline-block bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold font-mono">
                  +{inc.delayMinutes} mins delay
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
