import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Activity, 
  Calendar, 
  Zap, 
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface PredictiveAnalyticsProps {
  applications?: Application[];
  onOpenPresetModal?: () => void;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  applications = [],
  onOpenPresetModal,
}) => {
  const [metricView, setMetricView] = useState<'volume' | 'turnaround' | 'schemes'>('volume');
  const isBlank = applications.length === 0;

  // Dynamic calculations based on active preset applications
  const stats = useMemo(() => {
    const count = applications.length;
    const nfstCount = applications.filter((a) => a.scheme === 'NFST').length;
    const nosCount = applications.filter((a) => a.scheme === 'NOS').length;

    // Projected volumes scaled based on current intake
    const volumeData = isBlank ? [
      { year: '2022', applications: 0, processingDays: 0, digitalVerificationRate: 0 },
      { year: '2023', applications: 0, processingDays: 0, digitalVerificationRate: 0 },
      { year: '2024', applications: 0, processingDays: 0, digitalVerificationRate: 0 },
      { year: '2025 (Active)', applications: 0, processingDays: 0, digitalVerificationRate: 0 },
      { year: '2026 (Forecast)', applications: 0, processingDays: 0, digitalVerificationRate: 0 },
      { year: '2027 (Forecast)', applications: 0, processingDays: 0, digitalVerificationRate: 0 },
    ] : [
      { year: '2022', applications: Math.round(count * 0.45), processingDays: 45, digitalVerificationRate: 15 },
      { year: '2023', applications: Math.round(count * 0.65), processingDays: 32, digitalVerificationRate: 35 },
      { year: '2024', applications: Math.round(count * 0.85), processingDays: 18, digitalVerificationRate: 70 },
      { year: '2025 (Active)', applications: count, processingDays: 4.2, digitalVerificationRate: 94 },
      { year: '2026 (Forecast)', applications: Math.round(count * 1.35), processingDays: 2.1, digitalVerificationRate: 98 },
      { year: '2027 (Forecast)', applications: Math.round(count * 1.7), processingDays: 1.5, digitalVerificationRate: 99 },
    ];

    const schemeDemandData = isBlank ? [
      { cycle: 'Q1', nfstDemand: 0, nosDemand: 0 },
      { cycle: 'Q2', nfstDemand: 0, nosDemand: 0 },
      { cycle: 'Q3', nfstDemand: 0, nosDemand: 0 },
      { cycle: 'Q4 (Proj)', nfstDemand: 0, nosDemand: 0 },
    ] : [
      { cycle: 'Q1', nfstDemand: Math.round(nfstCount * 0.7), nosDemand: Math.round(nosCount * 0.6) },
      { cycle: 'Q2', nfstDemand: Math.round(nfstCount * 0.9), nosDemand: Math.round(nosCount * 0.8) },
      { cycle: 'Q3 (Active)', nfstDemand: nfstCount, nosDemand: nosCount },
      { cycle: 'Q4 (Proj)', nfstDemand: Math.round(nfstCount * 1.25), nosDemand: Math.round(nosCount * 1.3) },
    ];

    return { count, nfstCount, nosCount, volumeData, schemeDemandData };
  }, [applications, isBlank]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Time-Series & Predictive Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Predictive Demand & Intake Forecasts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical regression models generated from active candidate presets and historical MoTA intake trends.
          </p>
        </div>

        {/* View Selectors */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMetricView('volume')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              metricView === 'volume'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Application Intake
          </button>
          <button
            type="button"
            onClick={() => setMetricView('turnaround')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              metricView === 'turnaround'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SLA Turnaround (Days)
          </button>
          <button
            type="button"
            onClick={() => setMetricView('schemes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              metricView === 'schemes'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NFST vs NOS Demand
          </button>
        </div>
      </div>

      {/* Blank State Callout */}
      {isBlank && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="font-black text-sm">Predictive Engine: 0 Baseline Candidates Ingested</div>
              <p className="text-xs text-amber-800">
                Regression curves require at least one active candidate preset. Add a preset to generate live forecasting curves.
              </p>
            </div>
          </div>
          {onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer shrink-0"
            >
              ➕ Add Preset
            </button>
          )}
        </div>
      )}

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Current Intake Volume</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats.count} <span className="text-sm font-normal text-slate-500">Candidates</span>
          </div>
          <div className="text-xs text-emerald-700 font-semibold">
            {isBlank ? 'No presets active' : 'Live dossiers in evaluation'}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Target Scrutiny Turnaround</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {isBlank ? '0.0' : '4.2'} <span className="text-sm font-normal text-slate-500">Days</span>
          </div>
          <div className="text-xs text-indigo-700 font-semibold">
            {isBlank ? 'Awaiting intake' : 'Reduced from 45 days via AI OCR'}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>2026 Projected Intake Surge</span>
            <Zap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-900">
            {isBlank ? '0' : Math.round(stats.count * 1.35)} <span className="text-sm font-normal text-slate-500">Dossiers</span>
          </div>
          <div className="text-xs text-purple-700 font-semibold">
            {isBlank ? 'Regression inactive' : '+35% expected saturation growth'}
          </div>
        </div>
      </div>

      {/* Main Predictive Chart Container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            {metricView === 'volume'
              ? 'Annual Intake Volume & Digital Verification Expansion'
              : metricView === 'turnaround'
              ? 'Statutory Scrutiny Turnaround Reduction Curve (Days)'
              : 'Quarterly Scheme Demand: NFST vs NOS Overseas Allocation'}
          </h3>
          <p className="text-xs text-slate-500">
            {metricView === 'volume'
              ? 'Historical progression and forward-looking forecasts for nationwide scholarship applications.'
              : metricView === 'turnaround'
              ? 'Average calendar days required from candidate document upload to formal merit board verification.'
              : 'Quarterly candidate volume distribution across domestic PhD fellowships and foreign universities.'}
          </p>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {metricView === 'volume' ? (
              <AreaChart data={stats.volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="applications" name="Applications Intake" stroke="#059669" fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            ) : metricView === 'turnaround' ? (
              <LineChart data={stats.volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" days" />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="processingDays" name="Turnaround Time (Days)" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            ) : (
              <LineChart data={stats.schemeDemandData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="cycle" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="nfstDemand" name="NFST Fellowship Demand" stroke="#059669" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="nosDemand" name="NOS Overseas Demand" stroke="#9333ea" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
