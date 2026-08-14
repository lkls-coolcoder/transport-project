import React from 'react';
import { Clock, TrendingDown, CloudRain, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { DepartureWindow } from '../types';

interface DepartureWindowHeatmapProps {
  windows: DepartureWindow[];
}

export const DepartureWindowHeatmap: React.FC<DepartureWindowHeatmapProps> = ({ windows }) => {
  return (
    <div id="departure-window-section" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800 flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Departure Forecast</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Next 3 Hours
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">Optimal Departure Heatmap</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3 flex-1">
        {windows.map((win, idx) => {
          const isTopRank = win.recommendationRank === 1;

          return (
            <div
              key={idx}
              className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                isTopRank
                  ? 'bg-indigo-50/70 border-indigo-200 border-l-4 border-l-indigo-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-slate-500">{win.timeOffset}</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">({win.formattedTime})</span>
                  </div>
                  <div className="text-xl font-bold italic text-slate-900 mt-1">
                    ~{win.estimatedMinutes} <span className="text-xs font-normal not-italic text-slate-500">mins total</span>
                  </div>
                </div>

                <div className="text-right">
                  {isTopRank ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white shadow-xs">
                      ★ BEST WINDOW
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-600">
                      #{win.recommendationRank}
                    </span>
                  )}
                </div>
              </div>

              {/* Status details */}
              <div className="space-y-1.5 mt-3 pt-2.5 border-t border-slate-200/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Congestion:</span>
                  <span className={`font-semibold text-xs ${
                    win.trafficLevel === 'Heavy' ? 'text-red-600' :
                    win.trafficLevel === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {win.trafficLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Rain Risk:</span>
                  <span className="font-mono text-slate-700 text-xs font-medium">{win.precipitationRisk}%</span>
                </div>

                {win.tag && (
                  <div className="text-[10px] text-indigo-700 font-medium bg-indigo-100/70 px-2 py-0.5 rounded border border-indigo-200 mt-1 truncate">
                    {win.tag}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
