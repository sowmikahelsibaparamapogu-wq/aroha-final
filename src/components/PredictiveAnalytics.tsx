import React, { useState } from 'react';
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

interface PredictiveAnalyticsProps {
  // Optional props
}

const HISTORICAL_AND_PREDICTIVE_DATA = [
  { year: '2022', applications: 720, processingDays: 48, digitalVerificationRate: 12 },
  { year: '2023', applications: 940, processingDays: 36, digitalVerificationRate: 28 },
  { year: '2024', applications: 1180, processingDays: 22, digitalVerificationRate: 64 },
  { year: '2025 (Active)', applications: 1420, processingDays: 4.2, digitalVerificationRate: 92 },
  { year: '2026 (Forecast)', applications: 1780, processingDays: 2.1, digitalVerificationRate: 98 },
  { year: '2027 (Forecast)', applications: 2150, processingDays: 1.5, digitalVerificationRate: 99 },
];

const SCHEME_DEMAND_FORECAST = [
  { cycle: '2024-Q1', nfstDemand: 680, nosDemand: 180 },
  { cycle: '2024-Q2', nfstDemand: 740, nosDemand: 210 },
  { cycle: '2024-Q3', nfstDemand: 810, nosDemand: 260 },
  { cycle: '2024-Q4', nfstDemand: 890, nosDemand: 310 },
  { cycle: '2025-Q1 (Proj)', nfstDemand: 980, nosDemand: 380 },
  { cycle: '2025-Q2 (Proj)', nfstDemand: 1120, nosDemand: 450 },
];

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = () => {
  const [metricView, setMetricView] = useState<'volume' | 'turnaround' | 'schemes'>('volume');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Time-Series Projections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Predictive Demand Forecasts
          </h2>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setMetricView('volume')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              metricView === 'volume' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Intake Volume
          </button>
          <button
            type="button"
            onClick={() => setMetricView('turnaround')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              metricView === 'turnaround' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Turnaround Speed (Days)
          </button>
          <button
            type="button"
            onClick={() => setMetricView('schemes')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              metricView === 'schemes' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Scheme Demand (NFST vs NOS)
          </button>
        </div>
      </div>

      {/* Highlights Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Forecasted 2026 Volume</div>
          <div className="text-3xl font-bold font-roman text-emerald-800">1,780</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            +25.3% Projected Growth
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Turnaround Compression</div>
          <div className="text-3xl font-bold font-roman text-blue-800">48d → 2.1d</div>
          <div className="text-xs text-blue-700 font-semibold mt-1">
            95.6% Processing Latency Slashed
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Digital Autonomy Rate</div>
          <div className="text-3xl font-bold font-roman text-amber-800">98%</div>
          <div className="text-xs text-amber-800 font-semibold mt-1">
            Zero Paper Office by 2026
          </div>
        </div>
      </div>

      {/* Main Responsive Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold font-roman text-slate-900">
            {metricView === 'volume' && 'Application Pool Growth Trajectory (2022 – 2027)'}
            {metricView === 'turnaround' && 'Median Verification Latency Reduction (Days to Decision)'}
            {metricView === 'schemes' && 'Quarterly Demand Trajectory: NFST Fellowship vs NOS Overseas'}
          </h3>
          <span className="text-xs text-slate-500">MoTA AI Predictive Core</span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {metricView === 'volume' ? (
              <AreaChart data={HISTORICAL_AND_PREDICTIVE_DATA}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#047857" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            ) : metricView === 'turnaround' ? (
              <LineChart data={HISTORICAL_AND_PREDICTIVE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: any) => [`${value} Days`, 'Turnaround Time']} />
                <Line type="monotone" dataKey="processingDays" name="Avg Turnaround (Days)" stroke="#DC2626" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            ) : (
              <AreaChart data={SCHEME_DEMAND_FORECAST}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="cycle" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="nfstDemand" name="NFST Fellowship Demand" stroke="#047857" fill="#047857" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="nosDemand" name="NOS Overseas Demand" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
