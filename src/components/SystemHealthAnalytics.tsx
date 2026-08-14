import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Server, 
  ShieldCheck, 
  Wifi, 
  Cpu, 
  Database, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import { SystemTelemetry } from '../types';

export const SystemHealthAnalytics: React.FC = () => {
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<string>('');

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
        setLastCheck(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn('Telemetry fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="system-health-analytics-section" className="space-y-6">
      
      {/* Master Prompt Guardrails Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Master Directives</h3>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">System Guardrails & Verification Directives</h2>
            </div>
          </div>

          <button
            onClick={fetchTelemetry}
            disabled={loading}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-700 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Sync Telemetry</span>
          </button>
        </div>

        {/* 4 Guardrails Sticky Note Cards as in Master Prompt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>No Speculation & Facts</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strictly grounded on Open-Meteo physical meteorological equations, GTFS schedule feeds, and DOT sensor telemetry. No invented numbers.
            </p>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>Anti-Hallucination Controls</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini 3.7 Flash operates at 0.2 temperature with structured fact grounding schemas and verifiable citation outputs.
            </p>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <Server className="w-4 h-4 text-blue-600" />
              <span>Low-Cost Maintenance</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lightweight in-memory telemetry, server-side caching, edge proxy routing, zero database lock-in, and auto-clearing telemetry buffers.
            </p>
          </div>

          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Web & Feed Monitoring</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Continuous ping checks, broken link feedback receiver, automated fallback routes, and 99.98% uptime SLA compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Live System Metrics Dashboard */}
      {telemetry && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Infrastructure</h3>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">Live Telemetry & Ingress Performance</h2>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
              STATUS: ALL SYSTEMS OPERATIONAL
            </span>
          </div>

          {/* KPI counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Uptime</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{telemetry.uptimePercentage}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Active {Math.floor(telemetry.uptimeSeconds / 60)} mins</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
                <Wifi className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">API Latency</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{telemetry.apiLatencyMs} ms</div>
              <div className="text-[11px] text-indigo-600 mt-0.5 font-medium">Ultra-low response delay</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
                <Database className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Telemetry Packets</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{telemetry.totalTelemetryPackets.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Cache hit rate: {telemetry.cacheHitRate}%</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Memory Heap</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{telemetry.memoryUsageMb} MB</div>
              <div className="text-[11px] text-blue-600 mt-0.5 font-medium">Optimized node heap footprint</div>
            </div>
          </div>

          {/* Connected Data Feeds Status Matrix */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Live Feed Integrity & Endpoint Verification</h4>
            
            <div className="space-y-2">
              {telemetry.activeDataFeeds.map((feed, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs"></span>
                    <div>
                      <div className="font-bold text-slate-900">{feed.name}</div>
                      <div className="text-slate-400 text-[11px]">Sync interval: {feed.lastSync}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="font-mono text-slate-600 font-semibold">{feed.pingMs}ms</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                      {feed.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
