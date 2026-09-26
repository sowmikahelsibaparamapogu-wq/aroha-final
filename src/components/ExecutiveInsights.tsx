import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  MapPin, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface ExecutiveInsightsProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
}

interface InsightCard {
  id: string;
  category: 'Geographic' | 'Equity' | 'Operational' | 'Financial';
  title: string;
  metric: string;
  summary: string;
  actionableNote: string;
  severity: 'info' | 'positive' | 'warning';
}

const STATIC_LIVE_INSIGHTS: InsightCard[] = [
  {
    id: 'ins_geo_1',
    category: 'Geographic',
    title: 'Adilabad & Khunti Pending Concentration',
    metric: '34.2% of Backlog',
    summary: 'Two tribal districts (Adilabad, TG and Khunti, JH) account for 34.2% of all pending desk scrutiny files, primarily caused by local Tahsildar caste certificate seal variations.',
    actionableNote: 'Dispatch mobile AI-verification tablet units to Adilabad & Khunti District Magistrate offices.',
    severity: 'warning',
  },
  {
    id: 'ins_equity_2',
    category: 'Equity',
    title: 'ST Female Scholar Quota Exceeded',
    metric: '34.8% Participation',
    summary: 'Female ST applicants represent 34.8% of verified candidates this cycle, comfortably surpassing the statutory 30% parliamentary mandate by 4.8 percentage points.',
    actionableNote: 'Highlight gender parity milestone in MoTA Annual Parliamentary Report.',
    severity: 'positive',
  },
  {
    id: 'ins_ops_3',
    category: 'Operational',
    title: 'AI OCR Processing Turnaround Gain',
    metric: 'Reduced from 45d → 4.2d',
    summary: 'Automated entity tallying between DigiLocker / e-Pramaan and application records has compressed median scrutiny turnaround time by 90.6%.',
    actionableNote: '124 applications auto-verified without requiring manual secondary review.',
    severity: 'positive',
  },
  {
    id: 'ins_fin_4',
    category: 'Financial',
    title: 'NOS Overseas Foreign Exchange Exposure',
    metric: '£9,900 / $15,400 FX Outflow',
    summary: '8 ST scholars confirmed unconditional admission in UK institutions (Oxford, Cambridge, Edinburgh). Sterling pound appreciation increases foreign living allowance burden by 6.2%.',
    actionableNote: 'Recommend dynamic currency hedging via Reserve Bank of India MoTA window.',
    severity: 'info',
  },
  {
    id: 'ins_risk_5',
    category: 'Operational',
    title: 'SLA Breach Risk Alert in Desk-IV',
    metric: '18 Files Approaching 15-day SLA',
    summary: '18 applicant deficiency responses in Desk-IV have reached day 12 of the statutory 15-day SLA timeline and require priority signing.',
    actionableNote: 'Auto-escalate files to Joint Secretary Monitoring Queue.',
    severity: 'warning',
  },
];

export const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = () => {
  const [insights, setInsights] = useState<InsightCard[]>(STATIC_LIVE_INSIGHTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');

  const filteredInsights = selectedCategory === 'ALL'
    ? insights
    : insights.filter((i) => i.category === selectedCategory);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Autonomous Intelligence Synthesis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Strategic AI Insights
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
            {['ALL', 'Geographic', 'Equity', 'Operational', 'Financial'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{lastRefreshedTime}</span>
          </button>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((card) => (
          <div
            key={card.id}
            className={`rounded-2xl p-5 border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
              card.severity === 'positive'
                ? 'bg-white border-emerald-200'
                : card.severity === 'warning'
                ? 'bg-white border-amber-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  card.category === 'Geographic' ? 'bg-blue-100 text-blue-800' :
                  card.category === 'Equity' ? 'bg-purple-100 text-purple-800' :
                  card.category === 'Operational' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {card.category}
                </span>

                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  card.severity === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                  card.severity === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {card.metric}
                </span>
              </div>

              <h3 className="text-base font-bold font-roman text-slate-900 mb-1">
                {card.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {card.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="font-bold text-emerald-800">Action:</span>
                <span className="text-[11px] truncate max-w-xs">{card.actionableNote}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
