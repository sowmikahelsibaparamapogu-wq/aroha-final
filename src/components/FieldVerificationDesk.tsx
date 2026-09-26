import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileCheck, 
  UserCheck, 
  Calendar,
  AlertCircle,
  ArrowUpDown,
  Filter,
  User,
  Compass,
  CheckSquare,
  XSquare,
  Sparkles,
  Navigation
} from 'lucide-react';
import { Application } from '../types/scholarship';
import { Avatar } from './Avatar';
import { INDIAN_ADMINISTRATIVE_DIVISIONS } from '../data/indianStates';

export interface FieldInspectionRecord {
  id: string;
  appId: string;
  applicationNumber: string;
  candidateName: string;
  community: string;
  district: string;
  state: string;
  scheme: string;
  riskScore: 'Low' | 'Medium' | 'High';
  dispatchReason: string;
  assignedAuthority: string;
  status: 'dispatched' | 'under_investigation' | 'verified_genuine' | 'flagged_adverse';
  dispatchedAt: string;
  reportDate?: string;
  inspectorName?: string;
  inspectorRemarks?: string;
  gpsCoordinates?: string;
  checklist?: {
    sarpanchConfirmed: boolean;
    revenueRegistryMatched: boolean;
    incomeLandholdingVerified: boolean;
    bonafideEnrollmentValid: boolean;
  };
}

interface FieldVerificationDeskProps {
  applications: Application[];
  onOpenApplication?: (app: Application) => void;
  onToast: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
}

export const FieldVerificationDesk: React.FC<FieldVerificationDeskProps> = ({
  applications,
  onOpenApplication,
  onToast,
}) => {
  // Sorting options
  const [sortOrder, setSortOrder] = useState<
    'priority' | 'app_no_asc' | 'app_no_desc' | 'name_asc' | 'state' | 'date_desc'
  >('priority');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  
  // Verification Modal State
  const [verifyingApp, setVerifyingApp] = useState<Application | null>(null);
  const [inspectorName, setInspectorName] = useState('Shri R. K. Maravi, DTWO');
  const [assignedAuthority, setAssignedAuthority] = useState('Integrated Tribal Development Agency (ITDA) Project Office');
  const [gpsTag, setGpsTag] = useState('19.6641° N, 78.5320° E (Scheduled Area Tribal Block)');
  const [fieldRemarks, setFieldRemarks] = useState('');
  const [checklist, setChecklist] = useState({
    sarpanchConfirmed: true,
    revenueRegistryMatched: true,
    incomeLandholdingVerified: true,
    bonafideEnrollmentValid: true,
  });

  // Track modified status overrides in memory
  const [statusOverrides, setStatusOverrides] = useState<Record<string, {
    status: FieldInspectionRecord['status'];
    remarks?: string;
    inspector?: string;
    reportDate?: string;
    gps?: string;
  }>>({});

  // 1. ALL APPLICANTS IN ORDER: derive inspection dossiers for EVERY application
  const allOrderedInspections = useMemo<FieldInspectionRecord[]>(() => {
    if (!applications || applications.length === 0) return [];

    // Map every application
    const records = applications.map((app, idx) => {
      const isHighRisk = app.aiAnalysis?.riskScore === 'High' || 
        app.status === 'flagged_deficiency' || 
        (app.aiAnalysis?.flags && app.aiAnalysis.flags.length > 0);

      const override = statusOverrides[app.id];

      const defaultStatus: FieldInspectionRecord['status'] = 
        app.status === 'approved' || app.status === 'dbt_active' 
          ? 'verified_genuine' 
          : isHighRisk 
          ? 'under_investigation' 
          : 'dispatched';

      return {
        id: `insp_${app.id}`,
        appId: app.id,
        applicationNumber: app.applicationNumber,
        candidateName: app.applicant?.fullName || 'Scholar Candidate',
        community: app.applicant?.stCommunity || 'Gond',
        district: app.applicant?.district || 'Scheduled Tribal District',
        state: app.applicant?.state || 'Scheduled State',
        scheme: app.scheme || 'NFST',
        riskScore: (app.aiAnalysis?.riskScore as any) || (isHighRisk ? 'High' : 'Low'),
        dispatchReason:
          app.deficiencies?.[0]?.description ||
          app.aiAnalysis?.flags?.[0] ||
          'Physical cross-verification of ST caste certificate validity, village domicile, and local revenue record.',
        assignedAuthority: override?.inspector 
          ? `District Tribal Welfare Office, ${app.applicant?.district}` 
          : `Integrated Tribal Development Agency (ITDA), ${app.applicant?.district || app.applicant?.state}`,
        status: override?.status || defaultStatus,
        dispatchedAt: app.submittedAt?.split('T')[0] || '2026-01-15',
        reportDate: override?.reportDate,
        inspectorName: override?.inspector || (isHighRisk ? 'DTWO Verification Inspector' : undefined),
        inspectorRemarks: override?.remarks,
        gpsCoordinates: override?.gps,
      };
    });

    // Sort in order based on user selection
    return records.sort((a, b) => {
      if (sortOrder === 'priority') {
        const riskWeight = { High: 3, Medium: 2, Low: 1 };
        const diff = (riskWeight[b.riskScore] || 1) - (riskWeight[a.riskScore] || 1);
        if (diff !== 0) return diff;
        return a.candidateName.localeCompare(b.candidateName);
      }
      if (sortOrder === 'app_no_asc') return a.applicationNumber.localeCompare(b.applicationNumber);
      if (sortOrder === 'app_no_desc') return b.applicationNumber.localeCompare(a.applicationNumber);
      if (sortOrder === 'name_asc') return a.candidateName.localeCompare(b.candidateName);
      if (sortOrder === 'state') return a.state.localeCompare(b.state);
      if (sortOrder === 'date_desc') return b.dispatchedAt.localeCompare(a.dispatchedAt);
      return 0;
    });
  }, [applications, statusOverrides, sortOrder]);

  // Filtered by search & dropdowns
  const filteredInspections = useMemo(() => {
    return allOrderedInspections.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.candidateName.toLowerCase().includes(q) ||
        item.applicationNumber.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.community.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchesState = stateFilter === 'ALL' || item.state.toLowerCase() === stateFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesState;
    });
  }, [allOrderedInspections, searchTerm, statusFilter, stateFilter]);

  // Open Verification Modal for any student
  const handleOpenVerification = (appId: string) => {
    const target = applications.find((a) => a.id === appId);
    if (!target) return;
    setVerifyingApp(target);

    // Prepopulate remarks if already verified
    const existing = statusOverrides[target.id];
    setFieldRemarks(existing?.remarks || 'Physical village visit conducted; family tribal heritage and village revenue ledger verified genuine.');
    setChecklist({
      sarpanchConfirmed: true,
      revenueRegistryMatched: true,
      incomeLandholdingVerified: true,
      bonafideEnrollmentValid: true,
    });
  };

  // Submit Field Verification Decision
  const handleSignOffVerification = (newStatus: 'verified_genuine' | 'flagged_adverse') => {
    if (!verifyingApp) return;

    setStatusOverrides((prev) => ({
      ...prev,
      [verifyingApp.id]: {
        status: newStatus,
        remarks: fieldRemarks.trim() || (newStatus === 'verified_genuine' ? 'Physical visit certified genuine.' : 'Discrepancy confirmed by vigilance inquiry.'),
        inspector: inspectorName,
        reportDate: new Date().toISOString().split('T')[0],
        gps: gpsTag,
      },
    }));

    onToast(
      newStatus === 'verified_genuine' ? 'success' : 'warning',
      newStatus === 'verified_genuine' ? 'Field Verification Cleared' : 'Adverse Field Finding Logged',
      `Candidate ${verifyingApp.applicant?.fullName} verified by ${inspectorName}.`
    );

    setVerifyingApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: District Field Verification Authority */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-800/40 relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>MoTA DISTRICT LIAISON & SCHEDULED AREA ON-GROUND NETWORK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Building2 className="w-7 h-7 text-emerald-400" />
              <span>District Field & Physical Verification Desk</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl leading-relaxed">
              Orderly registry of all {applications.length} candidate files for physical verification through Integrated Tribal Development Agencies (ITDAs) and District Tribal Welfare Officers (DTWOs).
            </p>
          </div>

          {/* Quick "Select Student to Verify" Dropdown */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <div className="flex items-center gap-2 px-2 text-xs text-amber-300 font-bold shrink-0">
              <UserCheck className="w-4 h-4" />
              <span>Select Student to Verify:</span>
            </div>
            <select
              onChange={(e) => {
                if (e.target.value) handleOpenVerification(e.target.value);
              }}
              value=""
              className="bg-emerald-900/90 text-white font-bold text-xs px-3 py-2 rounded-xl border border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer w-full sm:w-64"
            >
              <option value="">-- Choose Candidate to Verify --</option>
              {allOrderedInspections.map((item) => (
                <option key={item.appId} value={item.appId} className="bg-slate-900 text-white">
                  {item.candidateName} ({item.applicationNumber} • {item.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Counters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 text-center">
            <div className="text-[10px] text-emerald-300 font-bold uppercase">All Candidates in Order</div>
            <div className="text-lg font-black text-white">{allOrderedInspections.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 text-center">
            <div className="text-[10px] text-emerald-300 font-bold uppercase">Certified Genuine</div>
            <div className="text-lg font-black text-emerald-400">
              {allOrderedInspections.filter((i) => i.status === 'verified_genuine').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 text-center">
            <div className="text-[10px] text-emerald-300 font-bold uppercase">In Ground Inquiry</div>
            <div className="text-lg font-black text-amber-300">
              {allOrderedInspections.filter((i) => i.status === 'under_investigation' || i.status === 'dispatched').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 text-center">
            <div className="text-[10px] text-emerald-300 font-bold uppercase">Adverse Findings</div>
            <div className="text-lg font-black text-rose-400">
              {allOrderedInspections.filter((i) => i.status === 'flagged_adverse').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter, Ordering & Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, district, tribe..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Ordering Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Order Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-600">Order by:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="priority">Priority & Risk (High to Low)</option>
              <option value="name_asc">Candidate Name (A to Z)</option>
              <option value="app_no_asc">Application # (Ascending)</option>
              <option value="app_no_desc">Application # (Descending)</option>
              <option value="state">State / District</option>
              <option value="date_desc">Submission Date (Newest)</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white cursor-pointer"
          >
            <option value="ALL">All Statuses ({allOrderedInspections.length})</option>
            <option value="under_investigation">In Field Inquiry</option>
            <option value="verified_genuine">Verified Genuine</option>
            <option value="flagged_adverse">Adverse Finding</option>
            <option value="dispatched">Dispatched to District</option>
          </select>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white cursor-pointer"
          >
            <option value="ALL">All States / UTs (36)</option>
            {INDIAN_ADMINISTRATIVE_DIVISIONS.map((div) => (
              <optgroup key={div.group} label={div.group}>
                {div.items.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Field Inspection Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-900">
              District Verification Dossiers (Ordered List)
            </h3>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              {filteredInspections.length} Candidates
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Showing all applicants in order • Click 'Verify Student' to sign off
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-5">Candidate / District</th>
                <th className="py-3 px-4">Scheme & ST Tribe</th>
                <th className="py-3 px-4">Dispatched Authority</th>
                <th className="py-3 px-4">Risk Sentinel</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-5 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    No candidates found matching the active filters.
                  </td>
                </tr>
              ) : (
                filteredInspections.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-slate-900 block text-sm">{item.candidateName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.applicationNumber} • {item.district}, {item.state}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-indigo-900 block text-[11px]">{item.community}</span>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold mt-0.5 ${
                        item.scheme === 'NFST' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.scheme} Fellowship
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-semibold text-slate-800 block text-[11px] truncate">
                        {item.assignedAuthority}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.inspectorName || 'DTWO Inquest Officer Assigned'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.riskScore === 'High' 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : item.riskScore === 'Medium'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.riskScore} Priority
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.status === 'dispatched' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <Clock className="w-3 h-3" /> Dispatched
                        </span>
                      )}
                      {item.status === 'under_investigation' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3" /> In Field Inquiry
                        </span>
                      )}
                      {item.status === 'verified_genuine' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Certified Genuine
                        </span>
                      )}
                      {item.status === 'flagged_adverse' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> Adverse Finding
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenVerification(item.appId)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer shadow-xs inline-flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Verify Student</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* On-Ground Field & Physical Verification Workbench Modal */}
      {verifyingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-black">On-Ground Field & Physical Verification</h3>
                  <p className="text-[11px] text-emerald-200">
                    Candidate: <strong>{verifyingApp.applicant?.fullName}</strong> ({verifyingApp.applicationNumber})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVerifyingApp(null)}
                className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs">
              {/* Candidate Physical Profile Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Community / Tribe:</span>
                  <strong className="text-slate-900">{verifyingApp.applicant?.stCommunity}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Declared Income:</span>
                  <strong className="text-emerald-800">₹{verifyingApp.applicant?.annualFamilyIncome?.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">District & State:</span>
                  <strong className="text-slate-900">{verifyingApp.applicant?.district}, {verifyingApp.applicant?.state}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Scheme Track:</span>
                  <strong className="text-indigo-900">{verifyingApp.scheme} Fellowship</strong>
                </div>
              </div>

              {/* Physical Verification Checklist */}
              <div className="space-y-2">
                <span className="font-black text-slate-800 uppercase tracking-wide block">
                  Mandatory Statutory Field Audit Checklist:
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.sarpanchConfirmed}
                      onChange={(e) => setChecklist({ ...checklist, sarpanchConfirmed: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>1. Gram Panchayat / Village Sarpanch confirms indigenous Scheduled Tribe domicile and ancestral residence.</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.revenueRegistryMatched}
                      onChange={(e) => setChecklist({ ...checklist, revenueRegistryMatched: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>2. Tehsildar & Sub-Divisional Magistrate (SDM) physical caste register ledger verified.</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.incomeLandholdingVerified}
                      onChange={(e) => setChecklist({ ...checklist, incomeLandholdingVerified: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>3. Physical family asset, agricultural landholding, and annual income enquiry confirmed within limits.</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.bonafideEnrollmentValid}
                      onChange={(e) => setChecklist({ ...checklist, bonafideEnrollmentValid: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>4. Bonafide higher-education research enrollment verified with University Dean.</span>
                  </label>
                </div>
              </div>

              {/* Inspector Details Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Verifying Inspector Name & ID:</label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Authority Body:</label>
                  <input
                    type="text"
                    value={assignedAuthority}
                    onChange={(e) => setAssignedAuthority(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              {/* GPS Geolocation Tag */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>GPS Geotag Verification Coordinate:</span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Geotag Captured
                  </span>
                </label>
                <input
                  type="text"
                  value={gpsTag}
                  onChange={(e) => setGpsTag(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono text-[11px]"
                />
              </div>

              {/* Inspector Remarks */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">On-Ground Verification Findings & Remarks:</label>
                <textarea
                  rows={3}
                  value={fieldRemarks}
                  onChange={(e) => setFieldRemarks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs"
                  placeholder="Record summary of physical interview, witness testimony, or document inspection..."
                />
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setVerifyingApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer text-xs"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSignOffVerification('flagged_adverse')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Flag Adverse Discrepancy</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSignOffVerification('verified_genuine')}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Certify Genuine & Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
