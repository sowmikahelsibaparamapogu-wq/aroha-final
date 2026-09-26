import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Award, 
  TrendingUp, 
  Activity,
  RefreshCw,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Application, SchemeType } from '../types/scholarship';

interface CommandCenterProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
  onUpdateParameters?: (params: {
    incomeCeiling?: number;
    marksThreshold?: number;
    totalSlots?: number;
    femaleQuota?: number;
  }) => void;
  isPresetUploaded?: boolean;
  activePresetName?: string | null;
  onOpenPresetModal?: () => void;
  onResetToPreUploadState?: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  applications,
  onSelectApplication,
  onNavigateTab,
  onUpdateParameters,
  isPresetUploaded = true,
  activePresetName,
  onOpenPresetModal,
  onResetToPreUploadState,
}) => {
  const [selectedScheme, setSelectedScheme] = useState<'ALL' | SchemeType>('ALL');
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick Parameter Tuning State
  const [quickIncome, setQuickIncome] = useState<number>(800000);
  const [quickCutoff, setQuickCutoff] = useState<number>(55);
  const [quickSlots, setQuickSlots] = useState<number>(750);
  const [quickFemaleQuota, setQuickFemaleQuota] = useState<number>(30);

  const filteredApps = useMemo(() => {
    if (selectedScheme === 'ALL') return applications;
    return applications.filter((a) => a.scheme === selectedScheme);
  }, [applications, selectedScheme]);

  // Dynamic Live KPIs
  const stats = useMemo(() => {
    const total = filteredApps.length;
    const eligible = filteredApps.filter(
      (a) => a.aiAnalysis?.eligibilityPassed || a.status === 'approved' || a.status === 'merit_listed' || a.status === 'dbt_active'
    ).length;
    const pending = filteredApps.filter(
      (a) => a.status === 'submitted' || a.status === 'in_scrutiny' || a.status === 'flagged_deficiency'
    ).length;
    const rejected = filteredApps.filter((a) => a.status === 'rejected').length;
    const selected = filteredApps.filter(
      (a) => a.status === 'merit_listed' || a.status === 'dbt_active' || a.status === 'approved'
    ).length;
    const highRisk = filteredApps.filter(
      (a) => a.aiAnalysis?.riskScore === 'High' || (a.aiAnalysis?.flags && a.aiAnalysis.flags.length >= 2)
    ).length;

    const femaleCount = filteredApps.filter((a) => a.applicant?.gender === 'Female').length;
    const femalePercent = total > 0 ? ((femaleCount / total) * 100).toFixed(1) : '0.0';

    const pvtgCount = filteredApps.filter(
      (a) =>
        (a.applicant?.stCommunity || '').toLowerCase().includes('pvtg') ||
        (a.aiAnalysis?.flags || []).some((f) => f.toLowerCase().includes('pvtg'))
    ).length;
    const pvtgPercent = total > 0 ? ((pvtgCount / total) * 100).toFixed(1) : '0.0';

    const dbtCount = filteredApps.filter(
      (a) => a.status === 'dbt_active' || a.status === 'approved' || a.status === 'merit_listed'
    ).length;
    const dbtPercent = total > 0 ? ((dbtCount / total) * 100).toFixed(1) : '0.0';

    return { total, eligible, pending, rejected, selected, highRisk, femalePercent, pvtgPercent, dbtPercent };
  }, [filteredApps]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Colorful Gradient, Big Inter Font, Zero Description */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NATIONAL SCHOLARSHIP RADAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            CENTRAL COMMAND CENTER
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white/15 backdrop-blur-md rounded-2xl p-1.5 border border-white/30 shadow-inner">
            {(['ALL', 'NFST', 'NOS'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedScheme(s)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition cursor-pointer ${
                  selectedScheme === s
                    ? 'bg-white text-emerald-900 shadow-md scale-105'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {s === 'ALL' ? 'All Schemes' : s}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-xs font-black text-white transition cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{lastRefreshed}</span>
          </button>
        </div>
      </div>

      {/* Intake vs Preset Upload Status Banner */}
      {!isPresetUploaded || stats.total === 0 ? (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-black text-xs uppercase tracking-wider border border-white/30">
                BLANK INTAKE MODE
              </span>
              <span className="text-xs font-bold text-white/90">
                Zero False Data Loaded (Awaiting Preset Ingestion)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              System Ready for Preset Intake ({stats.total} Ingested)
            </h3>
            <p className="text-xs text-white/90 max-w-2xl leading-relaxed">
              No false or pre-populated mock data is shown. Click "+ New Preset" to configure statutory parameters and ingest candidate dossiers one by one across India's 36 States and Union Territories.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPresetModal}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-emerald-950 font-black text-xs transition cursor-pointer shadow-lg hover:scale-105 shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>➕ Add New Preset</span>
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/30">
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
                LIVE PRESET ACTIVE
              </div>
              <div className="text-sm font-black text-white">
                {activePresetName || 'Custom Preset'} — Results Updated Across All Tabs & Portals
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-xs transition cursor-pointer"
            >
              Change Preset
            </button>
            {onResetToPreUploadState && (
              <button
                type="button"
                onClick={onResetToPreUploadState}
                className="px-3.5 py-2 rounded-xl bg-rose-500/80 hover:bg-rose-500 border border-white/30 text-white font-bold text-xs transition cursor-pointer"
                title="Reset back to intake state before preset upload"
              >
                Reset Intake
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6 Core Live KPI Tiles - COLORFUL, NOT BLACK, BIG FONT, ZERO DESCRIPTION */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Pool */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl p-5 border-2 border-indigo-200 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between text-indigo-700 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Total Pool</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-indigo-700">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-xs font-black text-indigo-600 mt-2 flex items-center gap-1">
            {stats.total === 0 ? (
              <span className="text-amber-700 font-bold">Awaiting preset</span>
            ) : (
              <>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stats.total} Ingested</span>
              </>
            )}
          </div>
        </div>

        {/* Eligible */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-5 border-2 border-emerald-200 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Eligible</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-700">
            {stats.eligible.toLocaleString()}
          </div>
          <div className="text-xs font-black text-emerald-600 mt-2">
            {stats.total > 0
              ? `${((stats.eligible / stats.total) * 100).toFixed(0)}% compliance`
              : 'Awaiting preset'}
          </div>
        </div>

        {/* Pending Scrutiny */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl p-5 border-2 border-amber-200 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-600">
            {stats.pending.toLocaleString()}
          </div>
          <div className="text-xs font-black text-amber-600 mt-2">
            {stats.total === 0 ? 'Intake Staging' : 'In Verification'}
          </div>
        </div>

        {/* Sanctioned */}
        <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 rounded-3xl p-5 border-2 border-violet-200 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between text-violet-700 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Sanctioned</span>
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-violet-700">
            {stats.selected.toLocaleString()}
          </div>
          <div className="text-xs font-black text-violet-600 mt-2">
            {stats.total > 0 ? 'Allocated Slots' : 'Awaiting preset'}
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-gradient-to-br from-cyan-50 via-white to-sky-50 rounded-3xl p-5 border-2 border-cyan-200 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between text-cyan-700 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">Rejected</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-cyan-700">
            {stats.rejected.toLocaleString()}
          </div>
          <div className="text-xs font-black text-cyan-600 mt-2">
            {stats.total > 0 ? 'Audit Preserved' : 'Intake clean'}
          </div>
        </div>

        {/* High Risk Flags */}
        <div className="bg-gradient-to-br from-rose-50 via-white to-red-50 rounded-3xl p-5 border-2 border-rose-200 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-black uppercase tracking-wider">High Risk</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-rose-600">
            {stats.highRisk.toLocaleString()}
          </div>
          <div className="text-xs font-black text-rose-600 mt-2">
            {stats.total > 0 ? 'Human Audit' : 'Scan pending'}
          </div>
        </div>
      </div>

      {/* 3 Colorful Representation Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Women ST 30% Statutory Quota */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black">Women ST 30% Quota</h3>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black border border-white/30">
              {stats.femalePercent}% Achieved
            </span>
          </div>
          <div className="w-full bg-white/25 rounded-full h-3.5 overflow-hidden mb-3">
            <div 
              className="bg-white h-full rounded-full transition-all duration-700 shadow-sm" 
              style={{ width: `${Math.min(100, (parseFloat(stats.femalePercent) / 30) * 100)}%` }} 
            />
          </div>
          <div className="flex justify-between text-xs font-black text-white/90">
            <span>Mandate: 30.0%</span>
            <span>{stats.total > 0 ? `${(parseFloat(stats.femalePercent) - 30).toFixed(1)}%` : 'Awaiting preset'}</span>
          </div>
        </div>

        {/* PVTG Representation */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black">PVTG Enrollment</h3>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black border border-white/30">
              {stats.pvtgPercent}% Active
            </span>
          </div>
          <div className="w-full bg-white/25 rounded-full h-3.5 overflow-hidden mb-3">
            <div
              className="bg-white h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(100, (parseFloat(stats.pvtgPercent) / 20) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-black text-white/90">
            <span>Target: 20.0%</span>
            <span>{stats.total > 0 ? `${stats.pvtgPercent}% enrolled` : 'Awaiting preset'}</span>
          </div>
        </div>

        {/* DBT Direct Benefit Transfer */}
        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black">Direct Benefit Transfer</h3>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black border border-white/30">
              {stats.dbtPercent}% Sanctioned
            </span>
          </div>
          <div className="w-full bg-white/25 rounded-full h-3.5 overflow-hidden mb-3">
            <div
              className="bg-white h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${stats.dbtPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-black text-white/90">
            <span>Cycle: Monthly DBT</span>
            <span>{stats.total > 0 ? 'Active pipeline' : 'Awaiting preset'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Global Parameter Tuning Hub (When given update, update all parameters features based on that input) */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-800 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-white/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dynamic Policy Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              System-Wide Parameter Tuning & Recalculation
            </h3>
          </div>
          <span className="text-xs bg-white/20 px-3.5 py-1.5 rounded-full font-black text-white border border-white/30">
            Updates All Features Live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Income Ceiling */}
          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="flex justify-between text-xs font-black mb-1">
              <span>Income Ceiling</span>
              <span className="text-amber-300">₹{(quickIncome / 100000).toFixed(1)}L</span>
            </div>
            <input
              type="range"
              min="400000"
              max="1500000"
              step="50000"
              value={quickIncome}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuickIncome(val);
                onUpdateParameters?.({ incomeCeiling: val });
              }}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-white/30 rounded-lg"
            />
          </div>

          {/* Qualifying Marks */}
          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="flex justify-between text-xs font-black mb-1">
              <span>Cutoff Marks</span>
              <span className="text-emerald-300">{quickCutoff}%</span>
            </div>
            <input
              type="range"
              min="45"
              max="75"
              step="1"
              value={quickCutoff}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuickCutoff(val);
                onUpdateParameters?.({ marksThreshold: val });
              }}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/30 rounded-lg"
            />
          </div>

          {/* Total Slots */}
          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="flex justify-between text-xs font-black mb-1">
              <span>Fellowship Slots</span>
              <span className="text-sky-300">{quickSlots}</span>
            </div>
            <input
              type="range"
              min="400"
              max="1500"
              step="50"
              value={quickSlots}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuickSlots(val);
                onUpdateParameters?.({ totalSlots: val });
              }}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-white/30 rounded-lg"
            />
          </div>

          {/* Female ST Quota */}
          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="flex justify-between text-xs font-black mb-1">
              <span>Female ST Quota</span>
              <span className="text-pink-300">{quickFemaleQuota}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="50"
              step="1"
              value={quickFemaleQuota}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuickFemaleQuota(val);
                onUpdateParameters?.({ femaleQuota: val });
              }}
              className="w-full accent-pink-400 cursor-pointer h-2 bg-white/30 rounded-lg"
            />
          </div>
        </div>

        {/* 1-Click Update Action Presets */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-white/80">Quick Presets:</span>
            <button
              type="button"
              onClick={() => {
                setQuickIncome(800000);
                setQuickCutoff(55);
                setQuickSlots(750);
                setQuickFemaleQuota(30);
                onUpdateParameters?.({ incomeCeiling: 800000, marksThreshold: 55, totalSlots: 750, femaleQuota: 30 });
              }}
              className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition cursor-pointer"
            >
              MoTA Baseline (₹8L / 55%)
            </button>
            <button
              type="button"
              onClick={() => {
                setQuickIncome(1200000);
                setQuickCutoff(48);
                setQuickSlots(1000);
                setQuickFemaleQuota(35);
                onUpdateParameters?.({ incomeCeiling: 1200000, marksThreshold: 48, totalSlots: 1000, femaleQuota: 35 });
              }}
              className="px-3 py-1 rounded-xl bg-amber-400 text-amber-950 text-xs font-black hover:bg-amber-300 transition cursor-pointer"
            >
              PVTG Boost (₹12L / 48%)
            </button>
            <button
              type="button"
              onClick={() => {
                setQuickIncome(600000);
                setQuickCutoff(65);
                setQuickSlots(500);
                setQuickFemaleQuota(30);
                onUpdateParameters?.({ incomeCeiling: 600000, marksThreshold: 65, totalSlots: 500, femaleQuota: 30 });
              }}
              className="px-3 py-1 rounded-xl bg-indigo-300 text-indigo-950 text-xs font-black hover:bg-indigo-200 transition cursor-pointer"
            >
              Strict Cutoff (₹6L / 65%)
            </button>
          </div>

          <button
            type="button"
            onClick={() => onUpdateParameters?.({
              incomeCeiling: quickIncome,
              marksThreshold: quickCutoff,
              totalSlots: quickSlots,
              femaleQuota: quickFemaleQuota,
            })}
            className="px-4 py-2 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black shadow-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Apply & Recalculate All Parameters</span>
          </button>
        </div>
      </div>

      {/* Live Priority Queue & Verification Stream Table - Colorful, Crisp */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Live Priority Queue & Verification Stream
            </h3>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-black border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Applicant & ID</th>
                <th className="py-3.5 px-4">Scheme</th>
                <th className="py-3.5 px-4">Tribe & State</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">OCR Confidence</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                    No candidate dossiers currently in verification stream. Click "➕ Add New Preset" to populate queue.
                  </td>
                </tr>
              ) : (
                filteredApps.slice(0, 6).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-800 text-sm">{app.applicant?.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono font-bold">{app.applicationNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase ${
                        app.scheme === 'NFST'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        {app.scheme}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{app.applicant?.stCommunity}</div>
                      <div className="text-[11px] text-slate-400">{app.applicant?.state}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        app.status === 'approved' || app.status === 'merit_listed' || app.status === 'dbt_active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${app.aiAnalysis?.overallConfidence || 90}%` }}
                          />
                        </div>
                        <span className="font-black text-slate-700">{app.aiAnalysis?.overallConfidence || 90}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectApplication?.(app.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-black text-xs border border-slate-200 transition cursor-pointer"
                      >
                        <span>Dossier</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
