import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Layers, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  Users, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Compass, 
  Building2, 
  GraduationCap, 
  IndianRupee, 
  ArrowUpRight,
  Sparkles,
  Grid3X3,
  List
} from 'lucide-react';
import { Application } from '../types/scholarship';
import { MASTER_36_INDIAN_STATES, StateRecord } from '../data/indianStates';

interface GISScholarshipMapProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
  onOpenPresetModal?: () => void;
}

export interface StateAggregatedData extends StateRecord {
  applicants: number;
  pending: number;
  approved: number;
  highRisk: number;
  candidates: Application[];
  districtCounts: Record<string, number>;
}

export const GISScholarshipMap: React.FC<GISScholarshipMapProps> = ({
  applications,
  onSelectApplication,
  onOpenPresetModal,
}) => {
  const [selectedStateName, setSelectedStateName] = useState<string>('Telangana');
  const [layer, setLayer] = useState<'density' | 'pending' | 'risk' | 'approved'>('density');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('cards');

  // Compute live dynamic statistics for all 36 States and UTs from current applications
  const stateAggregatedData: StateAggregatedData[] = useMemo(() => {
    return MASTER_36_INDIAN_STATES.map((state) => {
      const stateNorm = state.name.toLowerCase();
      const codeNorm = state.code.toLowerCase();

      // Find matching applications for this state
      const matchingApps = applications.filter((app) => {
        const appState = (app.applicant?.state || '').toLowerCase();
        const appDomicile = (app.applicant?.domicileState || '').toLowerCase();
        return (
          appState === stateNorm ||
          appDomicile === stateNorm ||
          appState.includes(stateNorm) ||
          stateNorm.includes(appState) ||
          appState === codeNorm
        );
      });

      const applicants = matchingApps.length;
      const pending = matchingApps.filter(
        (a) => a.status === 'submitted' || a.status === 'in_scrutiny' || a.status === 'flagged_deficiency'
      ).length;
      const approved = matchingApps.filter(
        (a) => a.status === 'approved' || a.status === 'merit_listed' || a.status === 'dbt_active'
      ).length;
      const highRisk = matchingApps.filter(
        (a) => a.aiAnalysis?.riskScore === 'High' || (a.aiAnalysis?.flags && a.aiAnalysis.flags.length >= 2)
      ).length;

      // Group by district
      const districtCounts: Record<string, number> = {};
      matchingApps.forEach((a) => {
        const dist = a.applicant?.district || 'General ITDA';
        districtCounts[dist] = (districtCounts[dist] || 0) + 1;
      });

      return {
        ...state,
        applicants,
        pending,
        approved,
        highRisk,
        candidates: matchingApps,
        districtCounts,
      };
    });
  }, [applications]);

  // Filter states by zone and search query
  const filteredStates = useMemo(() => {
    return stateAggregatedData.filter((s) => {
      const matchesZone = selectedZone === 'ALL' || s.zone === selectedZone;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.primaryTribes.some((t) => t.toLowerCase().includes(q)) ||
        s.districts.some((d) => d.toLowerCase().includes(q));

      return matchesZone && matchesSearch;
    });
  }, [stateAggregatedData, selectedZone, searchQuery]);

  // Currently selected state record
  const selectedState = useMemo(() => {
    return (
      stateAggregatedData.find((s) => s.name === selectedStateName) ||
      stateAggregatedData[0]
    );
  }, [stateAggregatedData, selectedStateName]);

  // Grand totals across all 36 states
  const grandTotals = useMemo(() => {
    const totalApplied = applications.length;
    const statesWithApplicants = stateAggregatedData.filter((s) => s.applicants > 0).length;
    const totalPending = stateAggregatedData.reduce((acc, s) => acc + s.pending, 0);
    const totalApproved = stateAggregatedData.reduce((acc, s) => acc + s.approved, 0);
    const totalRisk = stateAggregatedData.reduce((acc, s) => acc + s.highRisk, 0);

    return { totalApplied, statesWithApplicants, totalPending, totalApproved, totalRisk };
  }, [applications, stateAggregatedData]);

  const zones = [
    { id: 'ALL', label: 'All India (36)', count: 36 },
    { id: 'Central', label: 'Central', count: 2 },
    { id: 'East', label: 'East', count: 4 },
    { id: 'North-East', label: 'North-East', count: 8 },
    { id: 'South', label: 'South', count: 5 },
    { id: 'West', label: 'West', count: 3 },
    { id: 'North', label: 'North', count: 6 },
    { id: 'Union Territory', label: 'UTs', count: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner with Total Statistics */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>MINISTRY OF TRIBAL AFFAIRS • NATIONAL GEOSPATIAL REGISTRY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            GIS Scholarship Map (All 36 States & UTs)
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            Dynamic Article 342 tribal territory intelligence tracking NFST fellowships and NOS overseas admissions across all 28 States and 8 Union Territories.
          </p>
        </div>

        {/* Global Stats Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto shrink-0">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
            <div className="text-[10px] text-emerald-200 font-bold uppercase">Total Ingested</div>
            <div className="text-xl font-black text-white">{grandTotals.totalApplied}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
            <div className="text-[10px] text-emerald-200 font-bold uppercase">Active States</div>
            <div className="text-xl font-black text-amber-300">{grandTotals.statesWithApplicants} / 36</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
            <div className="text-[10px] text-emerald-200 font-bold uppercase">In Scrutiny</div>
            <div className="text-xl font-black text-amber-400">{grandTotals.totalPending}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
            <div className="text-[10px] text-emerald-200 font-bold uppercase">Sanctioned</div>
            <div className="text-xl font-black text-emerald-300">{grandTotals.totalApproved}</div>
          </div>
        </div>
      </div>

      {/* Zero/Blank State Notice when no applications are loaded */}
      {applications.length === 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="font-black text-sm">Geospatial Registry: 0 Applications Currently Ingested</div>
              <p className="text-xs text-amber-800">
                All 36 States and Union Territories are primed for intake. Add a preset to ingest candidate dossiers into state clusters.
              </p>
            </div>
          </div>
          {onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-black text-xs hover:from-amber-700 hover:to-emerald-700 transition cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>➕ Add Preset to Populate Map</span>
            </button>
          )}
        </div>
      )}

      {/* Control Bar: Zone Filter Pills, Heatmap Layer Toggles, Search Box, View Toggle */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Heatmap Layer Selectors */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <Layers className="w-4 h-4 text-slate-500 ml-2" />
            <button
              type="button"
              onClick={() => setLayer('density')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                layer === 'density'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Applicant Density
            </button>
            <button
              type="button"
              onClick={() => setLayer('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                layer === 'pending'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Scrutiny
            </button>
            <button
              type="button"
              onClick={() => setLayer('approved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                layer === 'approved'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DBT Sanctioned
            </button>
            <button
              type="button"
              onClick={() => setLayer('risk')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                layer === 'risk'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High-Risk Sentinel
            </button>
          </div>

          {/* Search Box & Grid/Table Toggle */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search state, tribe (e.g. Gond, Ao), district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setDisplayMode('cards')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  displayMode === 'cards' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Geospatial Cards View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('table')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  displayMode === 'table' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Matrix Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Zone Filter Tabs (All 36 States/UTs categorised cleanly) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <span className="text-[11px] font-black uppercase text-slate-400 mr-1 shrink-0">Zone:</span>
          {zones.map((zone) => {
            const isSelected = selectedZone === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZone(zone.id)}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {zone.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Map / Grid on Left, Selected State Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 36 State Grid / Matrix (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {displayMode === 'cards' ? (
            <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 border border-emerald-950/40 shadow-inner relative overflow-hidden">
              {/* Watermark grid effect */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between mb-3 text-xs text-white">
                <div className="font-black text-amber-300 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Showing {filteredStates.length} of 36 States & Union Territories</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Click any state card to inspect candidate dossiers
                </div>
              </div>

              {/* 36 States Responsive Cluster Grid */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredStates.map((state) => {
                  const isSelected = selectedState.name === state.name;
                  const hasData = state.applicants > 0;

                  return (
                    <button
                      key={state.code}
                      type="button"
                      onClick={() => setSelectedStateName(state.name)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[92px] ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold scale-[1.02] ring-2 ring-amber-400/50 shadow-lg'
                          : hasData
                          ? layer === 'density'
                            ? 'bg-emerald-900/80 hover:bg-emerald-800 text-white border-emerald-700/60'
                            : layer === 'pending'
                            ? 'bg-amber-900/80 hover:bg-amber-800 text-white border-amber-700/60'
                            : layer === 'approved'
                            ? 'bg-indigo-900/80 hover:bg-indigo-800 text-white border-indigo-700/60'
                            : 'bg-rose-950/80 hover:bg-rose-900 text-white border-rose-700/60'
                          : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="leading-tight">
                          <div className="text-xs font-black truncate max-w-[120px]">
                            {state.name}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-slate-800' : 'text-slate-400'} truncate`}>
                            {state.zone}
                          </div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-black ${
                          isSelected ? 'bg-slate-950 text-white' : 'bg-black/40 text-emerald-300'
                        }`}>
                          {state.code}
                        </span>
                      </div>

                      {/* Counts */}
                      <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                        <span className="font-bold">
                          {hasData ? (
                            <span className={isSelected ? 'text-slate-950 font-black' : 'text-emerald-300'}>
                              {state.applicants} Applied
                            </span>
                          ) : (
                            <span className="text-slate-500 font-normal">0 Ingested</span>
                          )}
                        </span>
                        {hasData && (
                          <span className={isSelected ? 'text-slate-900 font-black' : 'text-amber-300 text-[10px]'}>
                            {layer === 'pending'
                              ? `${state.pending} Pending`
                              : layer === 'approved'
                              ? `${state.approved} Approved`
                              : layer === 'risk'
                              ? `${state.highRisk} Risk`
                              : `${state.approved} DBT`}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Table Matrix View of All 36 States */
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-black sticky top-0">
                    <tr>
                      <th className="p-2.5">Code</th>
                      <th className="p-2.5">State / UT</th>
                      <th className="p-2.5">Zone</th>
                      <th className="p-2.5 text-center">Applied</th>
                      <th className="p-2.5 text-center">Pending</th>
                      <th className="p-2.5 text-center">Approved</th>
                      <th className="p-2.5 text-center">Risk</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredStates.map((s) => {
                      const isSelected = selectedState.name === s.name;
                      return (
                        <tr
                          key={s.code}
                          className={`transition ${
                            isSelected ? 'bg-amber-100/70 font-bold' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="p-2.5 font-mono font-black text-indigo-900">{s.code}</td>
                          <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                          <td className="p-2.5 text-slate-500">{s.zone}</td>
                          <td className="p-2.5 text-center font-bold text-emerald-800">{s.applicants}</td>
                          <td className="p-2.5 text-center font-bold text-amber-700">{s.pending}</td>
                          <td className="p-2.5 text-center font-bold text-indigo-700">{s.approved}</td>
                          <td className="p-2.5 text-center font-bold text-rose-700">{s.highRisk}</td>
                          <td className="p-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedStateName(s.name)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: State Dossier Inspector (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
          {/* Header of Inspector */}
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                STATE DOSSIER INSPECTOR
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-mono font-black text-xs">
                {selectedState.code} • {selectedState.zone}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {selectedState.name}
            </h3>
            <div className="text-xs text-slate-500 mt-0.5">
              Capital: <strong className="text-slate-800">{selectedState.capital}</strong>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                <span>Total Applied</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-emerald-950 mt-1">
                {selectedState.applicants}
              </div>
              <div className="text-[10px] text-emerald-700">Active Dossiers</div>
            </div>

            <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200">
              <div className="flex items-center justify-between text-xs text-indigo-800 font-bold">
                <span>DBT Sanctioned</span>
                <IndianRupee className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-indigo-950 mt-1">
                {selectedState.approved}
              </div>
              <div className="text-[10px] text-indigo-700">Direct Benefit Sanctioned</div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
                <span>In Scrutiny</span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-amber-950 mt-1">
                {selectedState.pending}
              </div>
              <div className="text-[10px] text-amber-700">Verification Underway</div>
            </div>

            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200">
              <div className="flex items-center justify-between text-xs text-rose-800 font-bold">
                <span>Flagged Sentinel</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-rose-950 mt-1">
                {selectedState.highRisk}
              </div>
              <div className="text-[10px] text-rose-700">Requires Field Audit</div>
            </div>
          </div>

          {/* Primary Tribal Communities Notified in State */}
          <div className="space-y-2">
            <div className="text-xs font-black text-slate-800 uppercase tracking-wide">
              Official Article 342 Tribal Communities:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedState.primaryTribes.map((tribe, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                    tribe.includes('(PVTG)')
                      ? 'bg-violet-100 text-violet-900 border border-violet-300'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {tribe}
                </span>
              ))}
            </div>
          </div>

          {/* Key Tribal Districts */}
          <div className="space-y-1.5">
            <div className="text-xs font-black text-slate-800 uppercase tracking-wide">
              Key ITDA Headquarters & Districts:
            </div>
            <div className="text-xs text-slate-600 flex flex-wrap gap-2">
              {selectedState.districts.map((d, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  {d}
                  {selectedState.districtCounts[d] ? (
                    <strong className="text-emerald-800 font-bold">({selectedState.districtCounts[d]})</strong>
                  ) : null}
                </span>
              ))}
            </div>
          </div>

          {/* Real Candidates List for Selected State */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wide">
              <span>Candidate Dossiers ({selectedState.candidates.length}):</span>
              {selectedState.candidates.length === 0 && (
                <span className="text-slate-400 font-normal">Awaiting Preset Intake</span>
              )}
            </div>

            {selectedState.candidates.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-2">
                <div>No candidates currently ingested for {selectedState.name}.</div>
                {onOpenPresetModal && (
                  <button
                    type="button"
                    onClick={onOpenPresetModal}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ingest Presets or Create Custom Preset</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedState.candidates.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-black text-slate-900 flex items-center gap-1.5">
                        <span>{app.applicant?.fullName}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          app.scheme === 'NFST' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {app.scheme}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {app.applicant?.stCommunity} • {app.academic?.qualifyingPercentage}% • ₹{(app.applicant?.annualFamilyIncome / 100000).toFixed(1)}L
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectApplication?.(app.id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-slate-300 hover:border-emerald-600 text-emerald-800 font-bold transition cursor-pointer shrink-0 shadow-2xs flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
