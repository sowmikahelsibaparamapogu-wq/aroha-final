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
  ArrowLeft,
  Compass
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface GISScholarshipMapProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
}

interface StateData {
  name: string;
  code: string;
  applicants: number;
  pending: number;
  highRisk: number;
  primaryTribes: string[];
  districts: Array<{
    name: string;
    applicants: number;
    pending: number;
    highRisk: number;
    riskLevel: 'Low' | 'Medium' | 'High';
  }>;
}

const INDIAN_STATES_DATA: StateData[] = [
  {
    name: 'Telangana',
    code: 'TG',
    applicants: 312,
    pending: 42,
    highRisk: 4,
    primaryTribes: ['Gond', 'Koya', 'Chenchu', 'Lambada'],
    districts: [
      { name: 'Adilabad', applicants: 145, pending: 22, highRisk: 2, riskLevel: 'Low' },
      { name: 'Kumuram Bheem Asifabad', applicants: 89, pending: 12, highRisk: 1, riskLevel: 'Low' },
      { name: 'Bhadradri Kothagudem', applicants: 54, pending: 6, highRisk: 1, riskLevel: 'Low' },
      { name: 'Nagarkurnool (Nallamala)', applicants: 24, pending: 2, highRisk: 0, riskLevel: 'Low' },
    ],
  },
  {
    name: 'Jharkhand',
    code: 'JH',
    applicants: 428,
    pending: 68,
    highRisk: 11,
    primaryTribes: ['Santhal', 'Munda', 'Oraon', 'Ho', 'Birhor'],
    districts: [
      { name: 'Ranchi', applicants: 156, pending: 19, highRisk: 2, riskLevel: 'Low' },
      { name: 'Khunti (Birsa Munda Land)', applicants: 112, pending: 24, highRisk: 4, riskLevel: 'Medium' },
      { name: 'Dumka', applicants: 92, pending: 15, highRisk: 3, riskLevel: 'Medium' },
      { name: 'West Singhbhum', applicants: 68, pending: 10, highRisk: 2, riskLevel: 'High' },
    ],
  },
  {
    name: 'Odisha',
    code: 'OD',
    applicants: 365,
    pending: 54,
    highRisk: 6,
    primaryTribes: ['Kandha', 'Santhal', 'Saura', 'Bonda', 'Dongria Kondh'],
    districts: [
      { name: 'Mayurbhanj', applicants: 138, pending: 21, highRisk: 2, riskLevel: 'Low' },
      { name: 'Koraput', applicants: 104, pending: 18, highRisk: 2, riskLevel: 'Medium' },
      { name: 'Rayagada', applicants: 72, pending: 9, highRisk: 1, riskLevel: 'Low' },
      { name: 'Malkangiri', applicants: 51, pending: 6, highRisk: 1, riskLevel: 'High' },
    ],
  },
  {
    name: 'Chhattisgarh',
    code: 'CG',
    applicants: 284,
    pending: 48,
    highRisk: 8,
    primaryTribes: ['Gond', 'Maria Gond', 'Halba', 'Bhatra', 'Abujhmarhia'],
    districts: [
      { name: 'Bastar (Jagdalpur)', applicants: 120, pending: 24, highRisk: 4, riskLevel: 'High' },
      { name: 'Dantewada', applicants: 74, pending: 12, highRisk: 2, riskLevel: 'Medium' },
      { name: 'Kanker', applicants: 56, pending: 8, highRisk: 1, riskLevel: 'Low' },
      { name: 'Narayanpur', applicants: 34, pending: 4, highRisk: 1, riskLevel: 'Medium' },
    ],
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    applicants: 395,
    pending: 62,
    highRisk: 9,
    primaryTribes: ['Bhil', 'Gond', 'Baiga', 'Sahariya', 'Korku'],
    districts: [
      { name: 'Jhabua', applicants: 130, pending: 22, highRisk: 3, riskLevel: 'Medium' },
      { name: 'Mandla', applicants: 110, pending: 18, highRisk: 2, riskLevel: 'Low' },
      { name: 'Dindori (Baiga Belt)', applicants: 85, pending: 14, highRisk: 2, riskLevel: 'Low' },
      { name: 'Barwani', applicants: 70, pending: 8, highRisk: 2, riskLevel: 'Low' },
    ],
  },
  {
    name: 'Meghalaya',
    code: 'ML',
    applicants: 186,
    pending: 22,
    highRisk: 2,
    primaryTribes: ['Khasi', 'Garo', 'Jaintia'],
    districts: [
      { name: 'East Khasi Hills (Shillong)', applicants: 98, pending: 12, highRisk: 1, riskLevel: 'Low' },
      { name: 'West Garo Hills (Tura)', applicants: 54, pending: 6, highRisk: 1, riskLevel: 'Low' },
      { name: 'West Jaintia Hills (Jowai)', applicants: 34, pending: 4, highRisk: 0, riskLevel: 'Low' },
    ],
  },
  {
    name: 'Assam',
    code: 'AS',
    applicants: 194,
    pending: 28,
    highRisk: 4,
    primaryTribes: ['Bodo', 'Mishing', 'Karbi', 'Dimasa'],
    districts: [
      { name: 'Kokrajhar (BTR)', applicants: 88, pending: 14, highRisk: 2, riskLevel: 'Low' },
      { name: 'Karbi Anglong', applicants: 62, pending: 9, highRisk: 1, riskLevel: 'Low' },
      { name: 'Dima Hasao', applicants: 44, pending: 5, highRisk: 1, riskLevel: 'Low' },
    ],
  },
];

export const GISScholarshipMap: React.FC<GISScholarshipMapProps> = ({
  applications,
  onSelectApplication,
}) => {
  const [selectedState, setSelectedState] = useState<StateData | null>(INDIAN_STATES_DATA[0]);
  const [layer, setLayer] = useState<'density' | 'pending' | 'risk'>('density');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = useMemo(() => {
    return INDIAN_STATES_DATA.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.primaryTribes.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  // Color gradient function based on active layer
  const getStateColor = (state: StateData) => {
    if (layer === 'density') {
      if (state.applicants > 350) return 'fill-emerald-800 hover:fill-emerald-700';
      if (state.applicants > 250) return 'fill-emerald-600 hover:fill-emerald-500';
      return 'fill-emerald-400 hover:fill-emerald-300';
    }
    if (layer === 'pending') {
      if (state.pending > 50) return 'fill-amber-600 hover:fill-amber-500';
      if (state.pending > 30) return 'fill-amber-500 hover:fill-amber-400';
      return 'fill-amber-300 hover:fill-amber-200';
    }
    // High risk layer
    if (state.highRisk > 8) return 'fill-rose-700 hover:fill-rose-600';
    if (state.highRisk > 4) return 'fill-rose-500 hover:fill-rose-400';
    return 'fill-rose-300 hover:fill-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header with Heatmap Layer Selectors */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>GIS Geospatial Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Geographic Intelligence Map
          </h2>
        </div>

        {/* Heatmap Layer Controls */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <Layers className="w-4 h-4 text-slate-500 ml-2" />
          <button
            type="button"
            onClick={() => setLayer('density')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              layer === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Cases
          </button>
          <button
            type="button"
            onClick={() => setLayer('risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              layer === 'risk'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            High-Risk Zones
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map Visual + State/District Drill-down */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Map Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold text-slate-700">
              Interactive Geospatial Territory (Click state to inspect)
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> High Density
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Risk
            </div>
          </div>

          {/* Stylized Interactive India Geography Grid & SVG Nodes */}
          <div className="relative bg-slate-950 rounded-2xl p-6 overflow-hidden border border-emerald-950/40 shadow-inner min-h-[380px] flex flex-col justify-between">
            {/* Background Map Watermark Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

            <div className="relative z-10 flex flex-wrap gap-2.5 justify-center py-4">
              {INDIAN_STATES_DATA.map((state) => {
                const isSelected = selectedState?.code === state.code;
                return (
                  <button
                    key={state.code}
                    type="button"
                    onClick={() => setSelectedState(state)}
                    className={`px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer shadow-md ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold scale-105 ring-2 ring-amber-400/50'
                        : layer === 'density'
                        ? 'bg-emerald-900/80 hover:bg-emerald-800 text-white border-emerald-700/60'
                        : layer === 'pending'
                        ? 'bg-amber-900/80 hover:bg-amber-800 text-white border-amber-700/60'
                        : 'bg-rose-950/80 hover:bg-rose-900 text-white border-rose-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold font-roman uppercase tracking-wide">
                        {state.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-black/25">
                        {state.code}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-[11px]">
                      <span>{state.applicants} Applied</span>
                      <span>•</span>
                      <span className={isSelected ? 'text-slate-900 font-bold' : 'text-amber-300'}>
                        {state.pending} Pending
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected State Overlay Badge */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>
                  Active Region: <strong className="text-amber-300">{selectedState?.name || 'All India'}</strong>
                </span>
              </div>
              <span className="text-slate-400">
                {selectedState?.districts.length || 0} Tribal Districts Mapped
              </span>
            </div>
          </div>
        </div>

        {/* Right: State & District Drill-Down Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          {selectedState ? (
            <div>
              <div className="border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-roman text-slate-900">
                    {selectedState.name} District Intelligence
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {selectedState.applicants} Scholars
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Dominant ST Communities: <strong className="text-slate-700">{selectedState.primaryTribes.join(', ')}</strong>
                </div>
              </div>

              {/* State Summary Stats */}
              <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                  <div className="text-xs text-slate-500">Total</div>
                  <div className="text-lg font-bold text-slate-900 font-roman">{selectedState.applicants}</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200">
                  <div className="text-xs text-amber-800">Pending</div>
                  <div className="text-lg font-bold text-amber-800 font-roman">{selectedState.pending}</div>
                </div>
                <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-200">
                  <div className="text-xs text-rose-800">High Risk</div>
                  <div className="text-lg font-bold text-rose-800 font-roman">{selectedState.highRisk}</div>
                </div>
              </div>

              {/* District Drill-down List */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tribal District Breakdown
                </div>
                {selectedState.districts.map((dist) => (
                  <div
                    key={dist.name}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{dist.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          dist.riskLevel === 'High' ? 'bg-rose-100 text-rose-800' :
                          dist.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {dist.riskLevel} Risk
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {dist.applicants} Applications • {dist.pending} In Verification
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-800">
                        {dist.applicants}
                      </div>
                      <div className="text-[10px] text-slate-400">Cases</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a state on the map to inspect district-level metrics.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
