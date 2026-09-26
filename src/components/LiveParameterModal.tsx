import React, { useState } from 'react';
import { Sliders, Sparkles, X, RotateCcw, CheckCircle2, TrendingUp, IndianRupee, Users } from 'lucide-react';
import { Application } from '../types/scholarship';

interface LiveParameterModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: Application[];
  onApplyUpdate: (params: {
    incomeCeiling?: number;
    marksThreshold?: number;
    totalSlots?: number;
    femaleQuota?: number;
  }) => void;
}

export const LiveParameterModal: React.FC<LiveParameterModalProps> = ({
  isOpen,
  onClose,
  applications,
  onApplyUpdate,
}) => {
  const [incomeCeiling, setIncomeCeiling] = useState<number>(800000);
  const [marksThreshold, setMarksThreshold] = useState<number>(55);
  const [totalSlots, setTotalSlots] = useState<number>(750);
  const [femaleQuota, setFemaleQuota] = useState<number>(30);

  if (!isOpen) return null;

  // Live preview calculation based on input
  const previewEligibleCount = applications.filter((app) => {
    const marks = app.academic?.qualifyingPercentage || 60;
    const income = app.applicant?.annualFamilyIncome || 300000;
    return marks >= marksThreshold && income <= incomeCeiling;
  }).length;

  const costPerScholar = 42000 * 12 + 25000;
  const projectedOutlayCrores = ((previewEligibleCount * costPerScholar) / 10000000).toFixed(2);

  const handleApply = (params?: {
    incomeCeiling?: number;
    marksThreshold?: number;
    totalSlots?: number;
    femaleQuota?: number;
  }) => {
    const appliedIncome = params?.incomeCeiling ?? incomeCeiling;
    const appliedMarks = params?.marksThreshold ?? marksThreshold;
    const appliedSlots = params?.totalSlots ?? totalSlots;
    const appliedQuota = params?.femaleQuota ?? femaleQuota;

    onApplyUpdate({
      incomeCeiling: appliedIncome,
      marksThreshold: appliedMarks,
      totalSlots: appliedSlots,
      femaleQuota: appliedQuota,
    });
    onClose();
  };

  const applyPreset = (preset: 'baseline' | 'expansion' | 'merit' | 'universal') => {
    let inc = 800000;
    let marks = 55;
    let slots = 750;
    let fQuota = 30;

    if (preset === 'expansion') {
      inc = 1200000;
      marks = 48;
      slots = 1000;
      fQuota = 35;
    } else if (preset === 'merit') {
      inc = 600000;
      marks = 65;
      slots = 500;
      fQuota = 30;
    } else if (preset === 'universal') {
      inc = 1500000;
      marks = 45;
      slots = 1500;
      fQuota = 50;
    }

    setIncomeCeiling(inc);
    setMarksThreshold(marks);
    setTotalSlots(slots);
    setFemaleQuota(fQuota);
    handleApply({ incomeCeiling: inc, marksThreshold: marks, totalSlots: slots, femaleQuota: fQuota });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-emerald-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header - Jewel Gradient */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-700 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-amber-300 tracking-wider">
                Real-Time Policy Tuner
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Live Parameter & Feature Update Hub
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Live Preview Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-200">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-700 uppercase mb-1">
                <Users className="w-4 h-4" />
                <span>Simulated Eligible Cohort</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-800">
                {previewEligibleCount} <span className="text-xs font-bold text-indigo-500">applicants</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 uppercase mb-1">
                <IndianRupee className="w-4 h-4" />
                <span>Projected Outlay</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                ₹{projectedOutlayCrores} <span className="text-xs font-bold text-emerald-600">Crores</span>
              </div>
            </div>
          </div>

          {/* 1-Click Quick Presets */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-xs font-black text-indigo-900 uppercase mb-2.5">
              1-Click Instant Presets:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyPreset('baseline')}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 transition cursor-pointer text-left shadow-xs"
              >
                <div className="font-black text-emerald-900">MoTA Baseline</div>
                <div className="text-[10px] text-emerald-600">₹8L Cap · 55% Cutoff · 750 Slots</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('expansion')}
                className="p-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 font-bold border border-amber-200 transition cursor-pointer text-left shadow-xs"
              >
                <div className="font-black text-amber-900">PVTG Expansion</div>
                <div className="text-[10px] text-amber-600">₹12L Cap · 48% Cutoff · 1000 Slots</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('merit')}
                className="p-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 font-bold border border-indigo-200 transition cursor-pointer text-left shadow-xs"
              >
                <div className="font-black text-indigo-900">Merit Fast-Track</div>
                <div className="text-[10px] text-indigo-600">₹6L Cap · 65% Cutoff · 500 Slots</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('universal')}
                className="p-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-900 font-bold border border-purple-200 transition cursor-pointer text-left shadow-xs"
              >
                <div className="font-black text-purple-900">Universal Access</div>
                <div className="text-[10px] text-purple-600">₹15L Cap · 45% Cutoff · 1500 Slots</div>
              </button>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Income Ceiling */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <div className="flex justify-between text-xs font-black text-indigo-900">
                <span>Annual Family Income</span>
                <span className="text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  ₹{(incomeCeiling / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min="400000"
                max="1500000"
                step="50000"
                value={incomeCeiling}
                onChange={(e) => setIncomeCeiling(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-indigo-200 rounded-lg"
              />
            </div>

            {/* Qualifying Cutoff % */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex justify-between text-xs font-black text-emerald-900">
                <span>Minimum Qualifying Marks</span>
                <span className="text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {marksThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="75"
                step="1"
                value={marksThreshold}
                onChange={(e) => setMarksThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-emerald-200 rounded-lg"
              />
            </div>

            {/* Total Slots */}
            <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-200 space-y-2">
              <div className="flex justify-between text-xs font-black text-violet-900">
                <span>Total Fellowship Slots</span>
                <span className="text-violet-700 bg-white px-2 py-0.5 rounded border border-violet-200">
                  {totalSlots} Slots
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="1500"
                step="50"
                value={totalSlots}
                onChange={(e) => setTotalSlots(parseInt(e.target.value, 10))}
                className="w-full accent-violet-600 cursor-pointer h-2 bg-violet-200 rounded-lg"
              />
            </div>

            {/* Female Quota */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex justify-between text-xs font-black text-rose-900">
                <span>ST Female Quota</span>
                <span className="text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                  {femaleQuota}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                step="1"
                value={femaleQuota}
                onChange={(e) => setFemaleQuota(parseInt(e.target.value, 10))}
                className="w-full accent-rose-600 cursor-pointer h-2 bg-rose-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setIncomeCeiling(800000);
              setMarksThreshold(55);
              setTotalSlots(750);
              setFemaleQuota(30);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Inputs</span>
          </button>

          <button
            type="button"
            onClick={() => handleApply()}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-emerald-700/20 transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Update All Features Live</span>
          </button>
        </div>
      </div>
    </div>
  );
};
