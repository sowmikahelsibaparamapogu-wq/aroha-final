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
  List,
  Map as MapIcon,
  Flame,
  Globe2,
  PieChart
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
  concentrationLevel: 'very_high' | 'high' | 'moderate' | 'emerging' | 'zero';
}

// Geometric coordinates for Indian states / UTs on the interactive visual map
interface StateSvgNode {
  code: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  zone: string;
}

const INDIA_GEO_NODES: StateSvgNode[] = [
  // North
  { code: 'JK', name: 'Jammu & Kashmir', x: 190, y: 35, w: 105, h: 48, zone: 'North' },
  { code: 'LA', name: 'Ladakh', x: 275, y: 20, w: 85, h: 48, zone: 'North' },
  { code: 'HP', name: 'Himachal Pradesh', x: 230, y: 92, w: 80, h: 42, zone: 'North' },
  { code: 'PB', name: 'Punjab', x: 165, y: 95, w: 60, h: 42, zone: 'North' },
  { code: 'UK', name: 'Uttarakhand', x: 285, y: 125, w: 75, h: 42, zone: 'North' },
  { code: 'HR', name: 'Haryana', x: 205, y: 142, w: 62, h: 42, zone: 'North' },
  { code: 'DL', name: 'Delhi', x: 250, y: 162, w: 38, h: 28, zone: 'North' },

  // West
  { code: 'RJ', name: 'Rajasthan', x: 110, y: 175, w: 110, h: 72, zone: 'West' },
  { code: 'GJ', name: 'Gujarat', x: 80, y: 260, w: 105, h: 68, zone: 'West' },
  { code: 'MH', name: 'Maharashtra', x: 195, y: 340, w: 120, h: 78, zone: 'West' },
  { code: 'GA', name: 'Goa', x: 175, y: 440, w: 42, h: 28, zone: 'West' },

  // Central
  { code: 'MP', name: 'Madhya Pradesh', x: 235, y: 235, w: 128, h: 75, zone: 'Central' },
  { code: 'CG', name: 'Chhattisgarh', x: 345, y: 300, w: 82, h: 75, zone: 'Central' },

  // East
  { code: 'UP', name: 'Uttar Pradesh', x: 295, y: 175, w: 115, h: 65, zone: 'East' },
  { code: 'BR', name: 'Bihar', x: 420, y: 195, w: 85, h: 52, zone: 'East' },
  { code: 'JH', name: 'Jharkhand', x: 415, y: 260, w: 82, h: 54, zone: 'East' },
  { code: 'OD', name: 'Odisha', x: 395, y: 335, w: 90, h: 65, zone: 'East' },
  { code: 'WB', name: 'West Bengal', x: 490, y: 260, w: 75, h: 65, zone: 'East' },

  // South
  { code: 'TG', name: 'Telangana', x: 275, y: 380, w: 95, h: 62, zone: 'South' },
  { code: 'AP', name: 'Andhra Pradesh', x: 285, y: 445, w: 105, h: 65, zone: 'South' },
  { code: 'KA', name: 'Karnataka', x: 195, y: 428, w: 85, h: 80, zone: 'South' },
  { code: 'KL', name: 'Kerala', x: 215, y: 520, w: 55, h: 75, zone: 'South' },
  { code: 'TN', name: 'Tamil Nadu', x: 275, y: 518, w: 85, h: 78, zone: 'South' },

  // North-East
  { code: 'SK', name: 'Sikkim', x: 495, y: 170, w: 46, h: 32, zone: 'North-East' },
  { code: 'AS', name: 'Assam', x: 575, y: 185, w: 85, h: 48, zone: 'North-East' },
  { code: 'AR', name: 'Arunachal Pradesh', x: 625, y: 140, w: 90, h: 44, zone: 'North-East' },
  { code: 'ML', name: 'Meghalaya', x: 570, y: 236, w: 68, h: 32, zone: 'North-East' },
  { code: 'NL', name: 'Nagaland', x: 670, y: 200, w: 52, h: 34, zone: 'North-East' },
  { code: 'MN', name: 'Manipur', x: 660, y: 238, w: 52, h: 34, zone: 'North-East' },
  { code: 'MZ', name: 'Mizoram', x: 630, y: 275, w: 48, h: 40, zone: 'North-East' },
  { code: 'TR', name: 'Tripura', x: 580, y: 272, w: 46, h: 34, zone: 'North-East' },

  // Union Territories Islands
  { code: 'AN', name: 'Andaman & Nicobar', x: 655, y: 460, w: 72, h: 60, zone: 'Union Territory' },
  { code: 'LD', name: 'Lakshadweep', x: 135, y: 515, w: 62, h: 45, zone: 'Union Territory' },
  { code: 'PY', name: 'Puducherry', x: 365, y: 535, w: 55, h: 28, zone: 'Union Territory' },
  { code: 'CH', name: 'Chandigarh', x: 195, y: 130, w: 32, h: 20, zone: 'Union Territory' },
  { code: 'DH', name: 'Dadra & Nagar Haveli and Daman & Diu', x: 95, y: 328, w: 85, h: 28, zone: 'Union Territory' },
];

export const GISScholarshipMap: React.FC<GISScholarshipMapProps> = ({
  applications,
  onSelectApplication,
  onOpenPresetModal,
}) => {
  const [selectedStateName, setSelectedStateName] = useState<string>('Telangana');
  const [layer, setLayer] = useState<'density' | 'pending' | 'risk' | 'approved'>('density');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayMode, setDisplayMode] = useState<'map' | 'cards' | 'table'>('map');
  const [schemeFilter, setSchemeFilter] = useState<'ALL' | 'NFST' | 'NOS'>('ALL');

  // Compute live dynamic statistics for all 36 States and UTs from current applications
  const stateAggregatedData: StateAggregatedData[] = useMemo(() => {
    return MASTER_36_INDIAN_STATES.map((state) => {
      const stateNorm = state.name.toLowerCase();
      const codeNorm = state.code.toLowerCase();

      // Find matching applications for this state (optionally filtered by scheme)
      const matchingApps = applications.filter((app) => {
        if (schemeFilter !== 'ALL' && app.scheme !== schemeFilter) return false;

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

      // Calculate concentration tier
      let concentrationLevel: StateAggregatedData['concentrationLevel'] = 'zero';
      if (applicants >= 8) concentrationLevel = 'very_high';
      else if (applicants >= 4) concentrationLevel = 'high';
      else if (applicants >= 2) concentrationLevel = 'moderate';
      else if (applicants >= 1) concentrationLevel = 'emerging';

      return {
        ...state,
        applicants,
        pending,
        approved,
        highRisk,
        candidates: matchingApps,
        districtCounts,
        concentrationLevel,
      };
    });
  }, [applications, schemeFilter]);

  // Fast lookup map by code
  const stateByCodeMap = useMemo(() => {
    const map = new Map<string, StateAggregatedData>();
    stateAggregatedData.forEach((s) => map.set(s.code, s));
    return map;
  }, [stateAggregatedData]);

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

  // Helper color function based on concentration level and active layer
  const getNodeColor = (data?: StateAggregatedData, isSelected = false) => {
    if (isSelected) return { bg: '#f59e0b', text: '#020617', stroke: '#fbbf24', border: '#fef08a' }; // Vibrant Golden Amber for selected
    if (!data || data.applicants === 0) {
      return { bg: '#0f172a', text: '#94a3b8', stroke: '#1e293b', border: '#334155' };
    }

    if (layer === 'pending') {
      if (data.pending > 3) return { bg: '#b45309', text: '#ffffff', stroke: '#f59e0b', border: '#fde68a' };
      return { bg: '#78350f', text: '#fef3c7', stroke: '#d97706', border: '#fde68a' };
    }

    if (layer === 'risk') {
      if (data.highRisk > 0) return { bg: '#be123c', text: '#ffffff', stroke: '#fb7185', border: '#fecdd3' };
      return { bg: '#047857', text: '#ecfdf5', stroke: '#10b981', border: '#a7f3d0' };
    }

    if (layer === 'approved') {
      if (data.approved > 3) return { bg: '#4338ca', text: '#ffffff', stroke: '#818cf8', border: '#c7d2fe' };
      return { bg: '#312e81', text: '#e0e7ff', stroke: '#6366f1', border: '#c7d2fe' };
    }

    // Default: Applicant Concentration (Density)
    switch (data.concentrationLevel) {
      case 'very_high': // 8+ applicants
        return { bg: '#047857', text: '#ffffff', stroke: '#34d399', border: '#6ee7b7' }; // Deep glowing emerald
      case 'high': // 4-7 applicants
        return { bg: '#0284c7', text: '#ffffff', stroke: '#38bdf8', border: '#bae6fd' }; // Radiant electric cyan
      case 'moderate': // 2-3 applicants
        return { bg: '#7c3aed', text: '#ffffff', stroke: '#a78bfa', border: '#ddd6fe' }; // Vivid purple jewel
      case 'emerging': // 1 applicant
        return { bg: '#0d9488', text: '#ffffff', stroke: '#2dd4bf', border: '#99f6e4' }; // Teal turquoise
      default:
        return { bg: '#0f172a', text: '#94a3b8', stroke: '#1e293b', border: '#334155' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Total Statistics */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>MINISTRY OF TRIBAL AFFAIRS • GEOSPATIAL INTELLIGENCE REGISTRY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Visual Geospatial Map & Concentration</span>
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            Dynamic Article 342 tribal territory intelligence tracking NFST fellowships and NOS overseas admissions across all 28 States and 8 Union Territories with chromatic density heatmaps.
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
            <div className="text-[10px] text-emerald-200 font-bold uppercase">DBT Sanctioned</div>
            <div className="text-xl font-black text-emerald-300">{grandTotals.totalApproved}</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Layer Selectors, Scheme Filter, View Mode, Search */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Heatmap Layer Selectors */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <Layers className="w-4 h-4 text-slate-500 ml-2" />
            <button
              type="button"
              onClick={() => setLayer('density')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                layer === 'density'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Applicant Concentration</span>
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

          {/* Scheme Filter Toggle (NFST vs NOS) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSchemeFilter('ALL')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                schemeFilter === 'ALL' ? 'bg-white shadow-xs text-emerald-900' : 'text-slate-600'
              }`}
            >
              All Schemes
            </button>
            <button
              type="button"
              onClick={() => setSchemeFilter('NFST')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                schemeFilter === 'NFST' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              NFST Only
            </button>
            <button
              type="button"
              onClick={() => setSchemeFilter('NOS')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                schemeFilter === 'NOS' ? 'bg-purple-800 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              NOS Only
            </button>
          </div>

          {/* Search Box & View Mode Toggle (Map, Cards, Table) */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search state, tribe, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setDisplayMode('map')}
                className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  displayMode === 'map' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Visual India Geospatial Map"
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Visual Map</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('cards')}
                className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  displayMode === 'cards' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Geospatial Cards View"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('table')}
                className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                  displayMode === 'table' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Matrix Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Zone Filter Tabs */}
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
        
        {/* Left: Visual Map or Cards or Table (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {displayMode === 'map' ? (
            /* VISUAL COLORFUL GEOSPATIAL MAP */
            <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 border border-emerald-900/60 shadow-2xl relative overflow-hidden">
              {/* Radial gradient background */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

              {/* Map Title & Concentration Legend */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="font-black text-amber-300 flex items-center gap-2 text-xs">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Applicant Concentration Density Heatmap (All India)</span>
                </div>
                
                {/* Concentration Scale Legend */}
                <div className="flex items-center gap-2 text-[10px] bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-800 text-white">
                  <span className="text-slate-400 font-bold">Density Scale:</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> High (8+)
                  </span>
                  <span className="flex items-center gap-1 font-bold text-sky-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Mid (4-7)
                  </span>
                  <span className="flex items-center gap-1 font-bold text-purple-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Mod (2-3)
                  </span>
                  <span className="flex items-center gap-1 font-bold text-teal-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> 1
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block" /> 0
                  </span>
                </div>
              </div>

              {/* Interactive SVG Geospatial Map of India */}
              <div className="relative z-10 w-full overflow-x-auto pb-2">
                <svg
                  viewBox="0 0 750 600"
                  className="w-full h-auto min-w-[580px] max-h-[520px] select-none"
                  style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))' }}
                >
                  <defs>
                    <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="gradSky" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0369a1" />
                    </linearGradient>
                    <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6b21a8" />
                    </linearGradient>
                    <linearGradient id="gradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>

                  {/* Draw Regional Linkage Contour Guides */}
                  <path
                    d="M 230 60 L 250 160 L 280 240 L 300 380 L 270 520"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 160 260 L 300 240 L 450 260 L 600 220"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Render All Geospatial Nodes */}
                  {INDIA_GEO_NODES.map((node) => {
                    const data = stateByCodeMap.get(node.code);
                    const isSelected = selectedState.code === node.code;
                    const colors = getNodeColor(data, isSelected);
                    const count = data?.applicants || 0;
                    const hasHighConcentration = count >= 4;

                    return (
                      <g
                        key={node.code}
                        onClick={() => setSelectedStateName(node.name)}
                        className="cursor-pointer group"
                      >
                        {/* Pulsing Concentration Ripple for top active states */}
                        {hasHighConcentration && !isSelected && (
                          <rect
                            x={node.x - 4}
                            y={node.y - 4}
                            width={node.w + 8}
                            h={node.h + 8}
                            rx={14}
                            fill="none"
                            stroke="#34d399"
                            strokeWidth="1.5"
                            className="animate-ping opacity-30"
                          />
                        )}

                        {/* Selected Outline Glow */}
                        {isSelected && (
                          <rect
                            x={node.x - 3}
                            y={node.y - 3}
                            width={node.w + 6}
                            height={node.h + 6}
                            rx={14}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                            className="animate-pulse"
                          />
                        )}

                        {/* Node Card Rectangle */}
                        <rect
                          x={node.x}
                          y={node.y}
                          width={node.w}
                          height={node.h}
                          rx={12}
                          fill={colors.bg}
                          stroke={colors.stroke}
                          strokeWidth={isSelected ? 2 : 1.2}
                          className="transition-all duration-200 group-hover:brightness-125"
                        />

                        {/* State Code */}
                        <text
                          x={node.x + 10}
                          y={node.y + 18}
                          fontSize="11"
                          fontWeight="900"
                          fontFamily="Inter, sans-serif"
                          fill={colors.text}
                          className="pointer-events-none"
                        >
                          {node.code}
                        </text>

                        {/* State Name Short Label */}
                        <text
                          x={node.x + 10}
                          y={node.y + 32}
                          fontSize="8.5"
                          fontWeight="600"
                          fontFamily="Inter, sans-serif"
                          fill={isSelected ? '#020617' : '#94a3b8'}
                          className="pointer-events-none"
                        >
                          {node.name.length > 13 ? `${node.name.slice(0, 11)}..` : node.name}
                        </text>

                        {/* Applicant Concentration Badge Bubble */}
                        <circle
                          cx={node.x + node.w - 14}
                          cy={node.y + 14}
                          r={count > 0 ? (count >= 10 ? 11 : 9.5) : 7}
                          fill={count > 0 ? (isSelected ? '#020617' : colors.stroke) : '#1e293b'}
                          className="transition-all"
                        />
                        <text
                          x={node.x + node.w - 14}
                          y={node.y + 17.5}
                          textAnchor="middle"
                          fontSize="8.5"
                          fontWeight="900"
                          fontFamily="Inter, sans-serif"
                          fill={count > 0 ? (isSelected ? '#f59e0b' : '#ffffff') : '#64748b'}
                          className="pointer-events-none"
                        >
                          {count}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Map Footer Info */}
              <div className="relative z-10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Map: Click any state block to immediately inspect candidate dossiers.</span>
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  {grandTotals.statesWithApplicants} Active State Clusters
                </span>
              </div>
            </div>
          ) : displayMode === 'cards' ? (
            /* Cards View */
            <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 border border-emerald-950/40 shadow-inner relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between mb-3 text-xs text-white">
                <div className="font-black text-amber-300 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Showing {filteredStates.length} of 36 States & Union Territories</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Click any state card to inspect candidate dossiers
                </div>
              </div>

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
            /* Table Matrix View */
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

        {/* Right: Selected State Dossier Inspector (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                STATE GEOSPATIAL DOSSIER
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-mono font-black text-xs">
                {selectedState.code} • {selectedState.zone}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {selectedState.name}
            </h3>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>Capital: <strong className="text-slate-800">{selectedState.capital}</strong></span>
              <span>•</span>
              <span className="font-bold text-emerald-800">
                {selectedState.concentrationLevel.replace('_', ' ').toUpperCase()} DENSITY
              </span>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                <span>Concentration</span>
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
              <div className="text-[10px] text-indigo-700">Direct Benefit Remitted</div>
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

          {/* Key Tribal Districts & Concentration */}
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
