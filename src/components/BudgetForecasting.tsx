import React, { useMemo } from 'react';
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
import { Application } from '../types/scholarship';

interface BudgetForecastingProps {
  applications?: Application[];
  isPresetUploaded?: boolean;
  onOpenPresetModal?: () => void;
}

export const BudgetForecasting: React.FC<BudgetForecastingProps> = ({
  applications = [],
  isPresetUploaded = false,
  onOpenPresetModal,
}) => {
  const isBlank = applications.length === 0;

  // Dynamic budget calculations based on real applications count
  const budgetStats = useMemo(() => {
    const totalCount = applications.length;
    const nfstCount = applications.filter((a) => a.scheme === 'NFST').length;
    const nosCount = applications.filter((a) => a.scheme === 'NOS').length;

    const dbtActiveCount = applications.filter((a) => a.status === 'dbt_active' || a.status === 'approved').length;
    const meritListedCount = applications.filter((a) => a.status === 'merit_listed').length;

    // NFST: JRF ₹37,000/mo * 12 = ₹4.44L/yr + ₹0.22L contingency = ₹4.66L/yr
    // NOS: ₹25L tuition + ₹12.5L living allowance = ₹37.5L/yr
    const nfstStipendAlloc = Number(((nfstCount * 4.44) / 100).toFixed(2));
    const nfstStipendProj = Number(((nfstCount * 4.8) / 100).toFixed(2));
    const nfstStipendDisbursed = Number((((dbtActiveCount > 0 ? dbtActiveCount : 0) * 4.44 * 0.7) / 100).toFixed(2));

    const nfstContingencyAlloc = Number(((nfstCount * 0.22) / 100).toFixed(2));
    const nfstContingencyProj = Number(((nfstCount * 0.25) / 100).toFixed(2));
    const nfstContingencyDisbursed = Number((((dbtActiveCount > 0 ? dbtActiveCount : 0) * 0.22 * 0.6) / 100).toFixed(2));

    const nosTuitionAlloc = Number(((nosCount * 25.0) / 100).toFixed(2));
    const nosTuitionProj = Number(((nosCount * 27.5) / 100).toFixed(2));
    const nosTuitionDisbursed = Number(((nosCount > 0 ? nosCount * 25.0 * 0.5 : 0) / 100).toFixed(2));

    const nosLivingAlloc = Number(((nosCount * 12.5) / 100).toFixed(2));
    const nosLivingProj = Number(((nosCount * 14.0) / 100).toFixed(2));
    const nosLivingDisbursed = Number(((nosCount > 0 ? nosCount * 12.5 * 0.5 : 0) / 100).toFixed(2));

    const chartData = isBlank ? [
      { category: 'NFST JRF/SRF Stipends', allocation: 0, projected: 0, disbursed: 0, unit: '₹ Cr' },
      { category: 'NFST Contingency Grants', allocation: 0, projected: 0, disbursed: 0, unit: '₹ Cr' },
      { category: 'NOS Overseas Tuition Fees', allocation: 0, projected: 0, disbursed: 0, unit: '₹ Cr' },
      { category: 'NOS Foreign Living Allowance', allocation: 0, projected: 0, disbursed: 0, unit: '₹ Cr' },
    ] : [
      { category: 'NFST Stipends', allocation: nfstStipendAlloc, projected: nfstStipendProj, disbursed: nfstStipendDisbursed, unit: '₹ Cr' },
      { category: 'NFST Contingency', allocation: nfstContingencyAlloc, projected: nfstContingencyProj, disbursed: nfstContingencyDisbursed, unit: '₹ Cr' },
      { category: 'NOS Tuition', allocation: nosTuitionAlloc, projected: nosTuitionProj, disbursed: nosTuitionDisbursed, unit: '₹ Cr' },
      { category: 'NOS Living Allow.', allocation: nosLivingAlloc, projected: nosLivingProj, disbursed: nosLivingDisbursed, unit: '₹ Cr' },
    ];

    const totalAlloc = (nfstStipendAlloc + nfstContingencyAlloc + nosTuitionAlloc + nosLivingAlloc).toFixed(2);
    const totalProj = (nfstStipendProj + nfstContingencyProj + nosTuitionProj + nosLivingProj).toFixed(2);
    const totalDisbursed = (nfstStipendDisbursed + nfstContingencyDisbursed + nosTuitionDisbursed + nosLivingDisbursed).toFixed(2);

    return {
      totalCount,
      nfstCount,
      nosCount,
      chartData,
      totalAlloc: isBlank ? '0.00' : totalAlloc,
      totalProj: isBlank ? '0.00' : totalProj,
      totalDisbursed: isBlank ? '0.00' : totalDisbursed,
    };
  }, [applications, isBlank]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <PiggyBank className="w-4 h-4 text-emerald-700" />
            <span>PFMS & DBT Treasury Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Budget Forecasting & Fiscal Outlay
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculated from active scholar dossiers for NFST and NOS overseas academic cycles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isBlank && onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-xs hover:from-emerald-500 hover:to-indigo-500 transition cursor-pointer shadow-md inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Presets to Simulate Outlay</span>
            </button>
          )}
        </div>
      </div>

      {/* Blank State Callout */}
      {isBlank && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="font-black text-sm">Fiscal Outflow Ledger: 0 Active Scholars Loaded</div>
              <p className="text-xs text-amber-800">
                Current financial ledger is at ₹0.00 Cr (Blank mode). Add presets to ingest scholar cohorts and calculate accurate DBT commitments.
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

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Budget Estimate (BE)</span>
            <PiggyBank className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{budgetStats.totalAlloc} <span className="text-base font-normal text-slate-500">Cr</span>
          </div>
          <div className="text-xs text-emerald-700 font-semibold">
            {isBlank ? 'Awaiting preset intake' : `Approved for ${budgetStats.totalCount} active scholars`}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Projected Annual Outlay</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{budgetStats.totalProj} <span className="text-base font-normal text-slate-500">Cr</span>
          </div>
          <div className="text-xs text-indigo-700 font-semibold">
            {isBlank ? '₹0.00 Cr commitment' : 'Includes revised stipends & UK/USA forex rates'}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Direct Benefit Transferred</span>
            <CheckCircle className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-emerald-800">
            ₹{budgetStats.totalDisbursed} <span className="text-base font-normal text-emerald-700">Cr</span>
          </div>
          <div className="text-xs text-teal-700 font-semibold">
            {isBlank ? 'No transfers executed' : 'Disbursed directly via PFMS e-payment gateway'}
          </div>
        </div>
      </div>

      {/* Main Chart: Allocation vs Projected vs Disbursed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Statutory Head-Wise Financial Execution
            </h3>
            <p className="text-xs text-slate-500">
              Comparing allocation budget against projected commitments and actual DBT outflow (₹ Crores).
            </p>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={budgetStats.chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" Cr" />
              <Tooltip
                formatter={(val: any) => [`₹${val} Cr`, '']}
                contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="allocation" name="Budget Allocation" fill="#059669" radius={[6, 6, 0, 0]} />
              <Bar dataKey="projected" name="Projected Outlay" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="disbursed" name="Actual Disbursed" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
