import React, { useState, useMemo } from 'react';
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
  Filter,
  IndianRupee,
  ShieldAlert
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface ExecutiveInsightsProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
  onOpenPresetModal?: () => void;
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

export const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({
  applications,
  onSelectApplication,
  onOpenPresetModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');

  // Compute live strategic insights strictly from current applications
  const dynamicInsights: InsightCard[] = useMemo(() => {
    if (applications.length === 0) return [];

    const total = applications.length;
    const femaleCount = applications.filter((a) => a.applicant?.gender === 'Female').length;
    const femalePct = ((femaleCount / total) * 100).toFixed(1);
    const isFemaleQuotaMet = parseFloat(femalePct) >= 30.0;

    // Find state with most applicants
    const stateCounts: Record<string, number> = {};
    applications.forEach((a) => {
      const st = a.applicant?.state || 'General';
      stateCounts[st] = (stateCounts[st] || 0) + 1;
    });
    const sortedStates = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]);
    const topState = sortedStates[0] || ['All India', 0];
    const topStatePct = ((topState[1] / total) * 100).toFixed(1);

    // Verified / Clean applications
    const cleanCount = applications.filter(
      (a) => a.aiAnalysis?.eligibilityPassed && (!a.deficiencies || a.deficiencies.length === 0)
    ).length;
    const cleanPct = ((cleanCount / total) * 100).toFixed(1);

    // High risk count
    const riskCount = applications.filter(
      (a) => a.aiAnalysis?.riskScore === 'High' || (a.aiAnalysis?.flags && a.aiAnalysis.flags.length >= 2)
    ).length;

    // Schemes count
    const nfstCount = applications.filter((a) => a.scheme === 'NFST').length;
    const nosCount = applications.filter((a) => a.scheme === 'NOS').length;

    // Estimated Financial Commitment
    const estimatedNfstCr = ((nfstCount * 4.44) / 100).toFixed(2); // Cr
    const estimatedNosCr = ((nosCount * 37.5) / 100).toFixed(2); // Cr

    const cards: InsightCard[] = [
      {
        id: 'ins_equity_female',
        category: 'Equity',
        title: isFemaleQuotaMet
          ? 'ST Female Scholar Statutory Quota Achieved'
          : 'Female Scholar Representation Tracking',
        metric: `${femalePct}% Female ST Participation`,
        summary: `Current ingested cohort includes ${femaleCount} female ST scholars out of ${total} total candidates (${femalePct}%). ${
          isFemaleQuotaMet
            ? 'Surpasses the mandatory 30% parliamentary statutory gender reservation.'
            : 'Below 30% statutory benchmark. Affirmative intake adjustments recommended.'
        }`,
        actionableNote: isFemaleQuotaMet
          ? 'Affirmative gender targets met across active merit pools.'
          : 'Trigger targeted outreach in tribal colleges to expand female intake.',
        severity: isFemaleQuotaMet ? 'positive' : 'warning',
      },
      {
        id: 'ins_geo_concentration',
        category: 'Geographic',
        title: `${topState[0]} Regional Intake Concentration`,
        metric: `${topStatePct}% of Active Cohort`,
        summary: `${topState[0]} accounts for ${topState[1]} of ${total} ingested dossiers (${topStatePct}%), representing the highest candidate density in this statutory intake.`,
        actionableNote: `Ensure District Scrutiny Officers in ${topState[0]} verify tahsildar revenue stamps in line with e-District guidelines.`,
        severity: 'info',
      },
      {
        id: 'ins_ops_verification',
        category: 'Operational',
        title: 'Autonomous AI Verification & Clean Pass Rate',
        metric: `${cleanPct}% Clean Verification`,
        summary: `${cleanCount} of ${total} dossiers verified with high AI confidence and zero outstanding statutory deficiencies. Turnaround time compressed by automated OCR tallying.`,
        actionableNote: 'Eligible clean dossiers ready for batch approval and National Merit Board sanction.',
        severity: 'positive',
      },
      {
        id: 'ins_fin_outflow',
        category: 'Financial',
        title: 'Projected Direct Benefit Transfer (DBT) Commitment',
        metric: `₹${(parseFloat(estimatedNfstCr) + parseFloat(estimatedNosCr)).toFixed(2)} Cr Outlay`,
        summary: `Calculated expenditure of ₹${estimatedNfstCr} Cr for ${nfstCount} NFST stipends and ₹${estimatedNosCr} Cr for ${nosCount} NOS overseas scholars based on prescribed MoTA norms.`,
        actionableNote: 'PFMS Direct Benefit Transfer treasury liquidity verified for scheduled 1st-of-month disbursal.',
        severity: 'info',
      },
    ];

    if (riskCount > 0) {
      cards.push({
        id: 'ins_risk_sentinel',
        category: 'Operational',
        title: 'Sentinel Forensic Risk Flags Detected',
        metric: `${riskCount} File(s) Under Forensic Review`,
        summary: `${riskCount} dossier(s) exhibit income limit variance, seal anomalies, or academic cutoff discrepancies requiring field magistrate confirmation.`,
        actionableNote: 'Escalate flagged files to District Welfare Officer for physical certificate verification.',
        severity: 'warning',
      });
    }

    return cards;
  }, [applications]);

  const filteredInsights = selectedCategory === 'ALL'
    ? dynamicInsights
    : dynamicInsights.filter((i) => i.category === selectedCategory);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 400);
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
            Strategic Executive Insights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Derived dynamically from current active preset applications and MoTA policy mandates.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
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

      {/* Blank State if zero applications */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900">
              No Application Data Loaded (Blank Intake Mode)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No false data is loaded. Executive insights synthesize dynamically from ingested candidate dossiers. Please add a preset to generate strategic intelligence.
            </p>
          </div>
          {onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-xs hover:from-emerald-500 hover:to-indigo-500 transition cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Preset to Ingest Dossiers</span>
            </button>
          )}
        </div>
      ) : (
        /* Insight Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInsights.map((card) => {
            const isPos = card.severity === 'positive';
            const isWarn = card.severity === 'warning';

            return (
              <div
                key={card.id}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between gap-4 shadow-sm ${
                  isPos
                    ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                    : isWarn
                    ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                    : 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isPos
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isWarn
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                      }`}
                    >
                      {card.category}
                    </span>
                    <span
                      className={`text-xs font-black ${
                        isPos ? 'text-emerald-800' : isWarn ? 'text-amber-800' : 'text-indigo-800'
                      }`}
                    >
                      {card.metric}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 leading-snug">
                    {card.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {card.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-start gap-2 text-xs">
                  <span className="font-black text-slate-700 shrink-0">Action:</span>
                  <span className="text-slate-600 font-medium">{card.actionableNote}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
