import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface PolicySimulatorProps {
  applications: Application[];
  onApplyPolicyUpdate?: (params: {
    incomeCeiling: number;
    marksThreshold: number;
    totalSlots: number;
    femaleQuota: number;
  }) => void;
}

export const PolicySimulator: React.FC<PolicySimulatorProps> = ({
  applications,
  onApplyPolicyUpdate,
}) => {
  // Policy Parameters State
  const [incomeCeiling, setIncomeCeiling] = useState<number>(800000); // 8 Lakhs baseline
  const [marksThreshold, setMarksThreshold] = useState<number>(55); // 55% statutory baseline
  const [totalSlots, setTotalSlots] = useState<number>(750); // 750 NFST baseline
  const [femaleQuota, setFemaleQuota] = useState<number>(30); // 30% baseline
  const [ageLimit, setAgeLimit] = useState<number>(35); // 35 years baseline
  const [autoApplyLive, setAutoApplyLive] = useState<boolean>(true);

  // Trigger update across all system features
  const handleApplyUpdate = (override?: {
    incomeCeiling?: number;
    marksThreshold?: number;
    totalSlots?: number;
    femaleQuota?: number;
  }) => {
    if (onApplyPolicyUpdate) {
      onApplyPolicyUpdate({
        incomeCeiling: override?.incomeCeiling ?? incomeCeiling,
        marksThreshold: override?.marksThreshold ?? marksThreshold,
        totalSlots: override?.totalSlots ?? totalSlots,
        femaleQuota: override?.femaleQuota ?? femaleQuota,
      });
    }
  };

  // Baseline Comparison
  const baselineEligibleCount = useMemo(() => {
    return applications.filter(
      (app) => (app.academic?.qualifyingPercentage || 60) >= 55 && (app.applicant?.annualFamilyIncome || 300000) <= 800000
    ).length;
  }, [applications]);

  // Recalculate dynamically under current simulator parameters
  const simulatedStats = useMemo(() => {
    const currentlyEligible = applications.filter((app) => {
      const marks = app.academic?.qualifyingPercentage || 60;
      const income = app.applicant?.annualFamilyIncome || 300000;
      return marks >= marksThreshold && income <= incomeCeiling;
    });

    const eligibleCount = currentlyEligible.length;
    const delta = eligibleCount - baselineEligibleCount;
    
    // Financial Impact Simulation: Base ₹42,000/mo fellowship + ₹25,000 contingency per slot
    const costPerScholarPerYear = 42000 * 12 + 25000; // ~₹5.29 Lakhs/year
    const totalExpenditureCrores = ((eligibleCount * costPerScholarPerYear) / 10000000).toFixed(2);
    const deltaCrores = ((delta * costPerScholarPerYear) / 10000000).toFixed(2);

    return {
      eligibleCount,
      delta,
      totalExpenditureCrores,
      deltaCrores,
    };
  }, [applications, marksThreshold, incomeCeiling, baselineEligibleCount]);

  // Reset to Statutory Baseline
  const handleReset = () => {
    setIncomeCeiling(800000);
    setMarksThreshold(55);
    setTotalSlots(750);
    setFemaleQuota(30);
    setAgeLimit(35);
    handleApplyUpdate({ incomeCeiling: 800000, marksThreshold: 55, totalSlots: 750, femaleQuota: 30 });
  };

  // Pre-configured Scenarios
  const applyPreset = (preset: 'relaxed' | 'strict' | 'pvtg_boost') => {
    let inc = incomeCeiling;
    let marks = marksThreshold;
    let slots = totalSlots;
    let fQuota = femaleQuota;
    if (preset === 'relaxed') {
      inc = 1000000;
      marks = 50;
      slots = 1000;
    } else if (preset === 'strict') {
      inc = 600000;
      marks = 65;
      slots = 500;
    } else if (preset === 'pvtg_boost') {
      inc = 1200000;
      marks = 48;
      fQuota = 35;
    }
    setIncomeCeiling(inc);
    setMarksThreshold(marks);
    setTotalSlots(slots);
    setFemaleQuota(fQuota);
    handleApplyUpdate({ incomeCeiling: inc, marksThreshold: marks, totalSlots: slots, femaleQuota: fQuota });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Colorful Gradient, Zero Black */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-700 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>Interactive Policy Modeling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Policy Impact Simulator
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleApplyUpdate()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black transition cursor-pointer shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Update All Features Live</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black transition cursor-pointer border border-white/30"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Preset Strategy Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-black text-indigo-700 uppercase">1-Click Presets:</span>
        <button
          type="button"
          onClick={() => applyPreset('relaxed')}
          className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-black transition cursor-pointer"
        >
          Expansion Drive (₹10L Cap, 50% Cutoff, 1000 Slots)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('strict')}
          className="px-3.5 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300 text-xs font-black transition cursor-pointer"
        >
          High-Merit Fiscal Consolidation (65% Cutoff)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('pvtg_boost')}
          className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-black transition cursor-pointer"
        >
          Remote & PVTG Affirmative Action (48% Cutoff)
        </button>
      </div>

      {/* Dynamic Recalculation Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Eligible Candidates Impact */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl p-5 border-2 border-indigo-200 shadow-sm">
          <div className="text-xs text-indigo-700 font-black uppercase mb-1">Simulated Eligible Cohort</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-800">
              {simulatedStats.eligibleCount}
            </span>
            <span className="text-xs text-indigo-500 font-bold">applicants</span>
          </div>

          <div className="mt-2 text-xs font-black flex items-center gap-1">
            {simulatedStats.delta >= 0 ? (
              <span className="text-emerald-700 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +{simulatedStats.delta} Newly Eligible ({((simulatedStats.delta / Math.max(1, baselineEligibleCount)) * 100).toFixed(1)}%)
              </span>
            ) : (
              <span className="text-rose-700 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                {simulatedStats.delta} Disqualified ({((simulatedStats.delta / Math.max(1, baselineEligibleCount)) * 100).toFixed(1)}%)
              </span>
            )}
          </div>
        </div>

        {/* Projected Financial Outlay */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl p-5 border-2 border-emerald-200 shadow-sm">
          <div className="text-xs text-emerald-700 font-black uppercase mb-1">Projected Annual Outlay</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-800">
              ₹{simulatedStats.totalExpenditureCrores}
            </span>
            <span className="text-xs text-emerald-600 font-bold">Cr</span>
          </div>

          <div className="mt-2 text-xs font-semibold text-slate-600 flex items-center gap-1">
            <span>Variance: </span>
            <strong className={parseFloat(simulatedStats.deltaCrores) >= 0 ? 'text-emerald-700' : 'text-slate-800'}>
              {parseFloat(simulatedStats.deltaCrores) >= 0 ? `+₹${simulatedStats.deltaCrores} Cr` : `₹${simulatedStats.deltaCrores} Cr`}
            </strong>
          </div>
        </div>

        {/* Slot Fulfillment Rate */}
        <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 rounded-2xl p-5 border-2 border-violet-200 shadow-sm">
          <div className="text-xs text-violet-700 font-black uppercase mb-1">Slot Saturation Index</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-violet-800">
              {Math.min(100, Math.round((simulatedStats.eligibleCount / totalSlots) * 100))}%
            </span>
            <span className="text-xs text-violet-500 font-bold">of {totalSlots} slots</span>
          </div>

          <div className="mt-2 text-xs font-black text-violet-700">
            {simulatedStats.eligibleCount >= totalSlots
              ? 'Over-subscribed (Competitive Merit Filtering)'
              : `${totalSlots - simulatedStats.eligibleCount} Unfilled Slots Available`}
          </div>
        </div>
      </div>

      {/* Interactive Sliders Panel */}
      <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-indigo-50 pb-3">
          <h3 className="text-lg font-black text-indigo-900 tracking-tight">
            Live Policy Parameter Sliders
          </h3>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
            Auto-Updates All System Features Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1: Annual Family Income Ceiling */}
          <div className="space-y-2 bg-gradient-to-br from-indigo-50/60 to-white p-4 rounded-2xl border border-indigo-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-indigo-900">
                Annual Family Income Ceiling
              </label>
              <span className="text-xs font-black font-mono text-indigo-800 bg-white px-2.5 py-1 rounded-lg border border-indigo-300 shadow-xs">
                ₹{(incomeCeiling / 100000).toFixed(1)} Lakhs
              </span>
            </div>
            <input
              type="range"
              min="400000"
              max="1500000"
              step="50000"
              value={incomeCeiling}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setIncomeCeiling(val);
                handleApplyUpdate({ incomeCeiling: val });
              }}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-indigo-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-bold text-indigo-600">
              <span>₹4L (Strict)</span>
              <span>₹8L (Statutory)</span>
              <span>₹15L (Universal)</span>
            </div>
          </div>

          {/* Slider 2: Qualifying Marks Threshold */}
          <div className="space-y-2 bg-gradient-to-br from-emerald-50/60 to-white p-4 rounded-2xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-emerald-900">
                Qualifying Degree Minimum Marks
              </label>
              <span className="text-xs font-black font-mono text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs">
                {marksThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="45"
              max="75"
              step="1"
              value={marksThreshold}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setMarksThreshold(val);
                handleApplyUpdate({ marksThreshold: val });
              }}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-bold text-emerald-600">
              <span>45% (Relaxed)</span>
              <span>55% (Mandatory MoTA Cutoff)</span>
              <span>75% (Distinction)</span>
            </div>
          </div>

          {/* Slider 3: Total Scheme Fellowship Slots */}
          <div className="space-y-2 bg-gradient-to-br from-violet-50/60 to-white p-4 rounded-2xl border border-violet-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-violet-900">
                Total Annual Fellowship Slots
              </label>
              <span className="text-xs font-black font-mono text-violet-800 bg-white px-2.5 py-1 rounded-lg border border-violet-300 shadow-xs">
                {totalSlots} Slots
              </span>
            </div>
            <input
              type="range"
              min="400"
              max="1500"
              step="50"
              value={totalSlots}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setTotalSlots(val);
                handleApplyUpdate({ totalSlots: val });
              }}
              className="w-full accent-violet-600 cursor-pointer h-2 bg-violet-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-bold text-violet-600">
              <span>500 (Baseline)</span>
              <span>750 (Cabinet Sanctioned)</span>
              <span>1500 (Expanded)</span>
            </div>
          </div>

          {/* Slider 4: Female ST Reservation Quota */}
          <div className="space-y-2 bg-gradient-to-br from-rose-50/60 to-white p-4 rounded-2xl border border-rose-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-rose-900">
                ST Female Reservation Quota
              </label>
              <span className="text-xs font-black font-mono text-rose-800 bg-white px-2.5 py-1 rounded-lg border border-rose-300 shadow-xs">
                {femaleQuota}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="50"
              step="1"
              value={femaleQuota}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setFemaleQuota(val);
                handleApplyUpdate({ femaleQuota: val });
              }}
              className="w-full accent-rose-600 cursor-pointer h-2 bg-rose-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-bold text-rose-600">
              <span>20%</span>
              <span>30% (Mandatory Statutory)</span>
              <span>50% (Parity)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
