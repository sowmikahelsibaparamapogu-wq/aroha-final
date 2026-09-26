import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  CartesianGrid 
} from 'recharts';
import { 
  IndianRupee, 
  AlertTriangle, 
  TrendingUp, 
  PiggyBank, 
  CheckCircle, 
  ArrowUpRight,
  PieChart as PieIcon,
  Sparkles
} from 'lucide-react';

interface BudgetForecastingProps {
  isPresetUploaded?: boolean;
  onOpenPresetModal?: () => void;
}

const SCHEME_BUDGET_DATA = [
  {
    category: 'NFST JRF/SRF Stipends',
    allocation: 38.5, // Crores
    projected: 44.2,
    disbursed: 28.1,
    unit: '₹ Cr',
  },
  {
    category: 'NFST Contingency Grants',
    allocation: 4.8,
    projected: 5.6,
    disbursed: 3.2,
    unit: '₹ Cr',
  },
  {
    category: 'NOS Overseas Tuition Fees',
    allocation: 24.0,
    projected: 29.5,
    disbursed: 18.4,
    unit: '₹ Cr',
  },
  {
    category: 'NOS Foreign Living Allowance',
    allocation: 14.5,
    projected: 17.2,
    disbursed: 11.0,
    unit: '₹ Cr',
  },
  {
    category: 'Emergency & Research Travel',
    allocation: 2.2,
    projected: 2.9,
    disbursed: 1.4,
    unit: '₹ Cr',
  },
];

export const BudgetForecasting: React.FC<BudgetForecastingProps> = ({
  isPresetUploaded = true,
  onOpenPresetModal,
}) => {
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2025-2026');

  const totalAllocation = SCHEME_BUDGET_DATA.reduce((acc, curr) => acc + curr.allocation, 0);
  const totalProjected = SCHEME_BUDGET_DATA.reduce((acc, curr) => acc + curr.projected, 0);
  const totalDisbursed = SCHEME_BUDGET_DATA.reduce((acc, curr) => acc + curr.disbursed, 0);
  const deficitGap = (totalProjected - totalAllocation).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Intake / Pending Preset Notification Banner */}
      {!isPresetUploaded && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider">
                BUDGET ALLOCATIONS PENDING
              </span>
              <span className="text-xs font-bold text-amber-800">
                Awaiting Preset Upload & Cohort Ingestion
              </span>
            </div>
            <p className="text-xs text-amber-900 max-w-xl">
              Financial allocations and multi-crore disbursement models require full applicant ingestion and statutory slot evaluation. Upload a preset scenario to compute budget projections.
            </p>
          </div>

          {onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>⚡ Upload Preset & Compute Budget</span>
            </button>
          )}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <IndianRupee className="w-4 h-4 text-emerald-700" />
            <span>Fiscal Intelligence & PFMS Disbursals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Budget Allocation Radar
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedFiscalYear}
            onChange={(e) => setSelectedFiscalYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 outline-none"
          >
            <option value="2025-2026">FY 2025-2026 (Active)</option>
            <option value="2026-2027">FY 2026-2027 (Projected)</option>
          </select>
        </div>
      </div>

      {/* Top Metrics Cards with Gap Highlighting */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Allocated */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Sanctioned Budget</div>
          <div className="text-2xl font-bold font-roman text-slate-900">
            ₹{totalAllocation.toFixed(1)} <span className="text-xs font-sans text-slate-500">Cr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Ministry BE 2025-26</div>
        </div>

        {/* Projected Requirement */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Projected Demand</div>
          <div className="text-2xl font-bold font-roman text-blue-700">
            ₹{totalProjected.toFixed(1)} <span className="text-xs font-sans text-blue-500">Cr</span>
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">Based on Intake Volume</div>
        </div>

        {/* Disbursed to Date */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">Disbursed (PFMS)</div>
          <div className="text-2xl font-bold font-roman text-emerald-700">
            ₹{totalDisbursed.toFixed(1)} <span className="text-xs font-sans text-emerald-500">Cr</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {((totalDisbursed / totalAllocation) * 100).toFixed(1)}% of Budget Released
          </div>
        </div>

        {/* Budget Deficit Gap Highlighted */}
        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 shadow-sm">
          <div className="text-xs text-rose-800 font-semibold mb-1 flex items-center justify-between">
            <span>Projected Gap</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-roman text-rose-800">
            -₹{deficitGap} <span className="text-xs font-sans text-rose-600">Cr</span>
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1">
            Supplementary Grants Required
          </div>
        </div>
      </div>

      {/* Visual Chart: Allocation vs Projected Requirement per Scheme Head */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-roman text-slate-900">
            Allocation vs. Projected Requirement (in ₹ Crores)
          </h3>
          <span className="text-xs text-slate-500">Categorical scheme breakdown</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SCHEME_BUDGET_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} interval={0} angle={-8} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: any) => [`₹${value} Cr`, '']} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="allocation" name="Current Allocation (₹ Cr)" fill="#047857" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projected" name="Projected Demand (₹ Cr)" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="disbursed" name="Already Disbursed (₹ Cr)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplementary Allocation Request Advice Card */}
      <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <div className="font-bold text-sm">
            Ministry Financial Advisory: Supplementary Grant of ₹15.5 Cr Recommended
          </div>
          <p>
            Due to an influx of ST scholars securing admission to QS Top 50 global universities (Oxford, Melbourne, UBC) under the National Overseas Scholarship (NOS), foreign tuition obligations will exceed initial Budget Estimates by Q3. Automated requisition dossier prepared for the Ministry of Finance.
          </p>
        </div>
      </div>
    </div>
  );
};
