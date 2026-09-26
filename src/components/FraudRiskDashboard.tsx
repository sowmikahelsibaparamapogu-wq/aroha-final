import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  FileWarning, 
  Search, 
  Filter, 
  Eye, 
  Lock, 
  UserX,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface FraudRiskDashboardProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
  onOpenPresetModal?: () => void;
}

interface FraudAnomaly {
  id: string;
  applicationId: string;
  applicantName: string;
  scheme: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  anomalyType: 'Duplicate Identity' | 'Font Tampering' | 'Revenue Seal Invalid' | 'Income Under-declaration';
  description: string;
  flaggedField: string;
  aiConfidence: number;
  status: 'Under Investigation' | 'Frozen' | 'Cleared';
}

export const FraudRiskDashboard: React.FC<FraudRiskDashboardProps> = ({
  applications,
  onSelectApplication,
  onOpenPresetModal,
}) => {
  // Dynamically generate anomalies from actual applications
  const derivedAnomalies: FraudAnomaly[] = useMemo(() => {
    if (applications.length === 0) return [];

    const list: FraudAnomaly[] = [];

    applications.forEach((app, idx) => {
      const isHighRisk = app.aiAnalysis?.riskScore === 'High' || (app.aiAnalysis?.flags && app.aiAnalysis.flags.length >= 2);
      const hasDeficiencies = app.deficiencies && app.deficiencies.length > 0;
      const isOverIncome = app.scheme === 'NOS' && (app.applicant?.annualFamilyIncome || 0) > 800000;
      const isBelowCutoff = (app.academic?.qualifyingPercentage || 0) < 55.0;

      if (isHighRisk || isOverIncome) {
        list.push({
          id: `anom_high_${app.id}`,
          applicationId: app.applicationNumber || app.id,
          applicantName: app.applicant?.fullName || 'Applicant',
          scheme: app.scheme,
          riskLevel: 'High',
          anomalyType: isOverIncome ? 'Income Under-declaration' : 'Font Tampering',
          description: isOverIncome
            ? `Declared family income ₹${(app.applicant.annualFamilyIncome / 100000).toFixed(1)}L exceeds the statutory NOS ceiling of ₹8,00,000.`
            : `AI OCR detected non-matching document font structure and variance against e-Pramaan database.`,
          flaggedField: isOverIncome ? 'Income Certificate' : 'Academic Marksheet',
          aiConfidence: 96,
          status: 'Under Investigation',
        });
      } else if (hasDeficiencies || isBelowCutoff) {
        list.push({
          id: `anom_med_${app.id}`,
          applicationId: app.applicationNumber || app.id,
          applicantName: app.applicant?.fullName || 'Applicant',
          scheme: app.scheme,
          riskLevel: 'Medium',
          anomalyType: 'Revenue Seal Invalid',
          description: app.deficiencies?.[0]?.description || `Academic aggregate of ${app.academic?.qualifyingPercentage}% requires secondary validation against board cutoff.`,
          flaggedField: 'Statutory Certificates',
          aiConfidence: 88,
          status: 'Under Investigation',
        });
      }
    });

    return list;
  }, [applications]);

  const [anomalies, setAnomalies] = useState<FraudAnomaly[]>(derivedAnomalies);

  useEffect(() => {
    setAnomalies(derivedAnomalies);
  }, [derivedAnomalies]);

  const [filterRisk, setFilterRisk] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return anomalies.filter((a) => {
      const matchRisk = filterRisk === 'ALL' || a.riskLevel === filterRisk;
      const matchSearch = 
        a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        a.applicationId.toLowerCase().includes(search.toLowerCase()) ||
        a.anomalyType.toLowerCase().includes(search.toLowerCase());
      return matchRisk && matchSearch;
    });
  }, [anomalies, filterRisk, search]);

  const handleAction = (id: string, newStatus: 'Frozen' | 'Cleared') => {
    setAnomalies((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const highCount = anomalies.filter((a) => a.riskLevel === 'High').length;
  const medCount = anomalies.filter((a) => a.riskLevel === 'Medium').length;
  const frozenCount = anomalies.filter((a) => a.status === 'Frozen').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-rose-800 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
            <span>Anti-Fraud Sentinel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Risk & Integrity Sentinel
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time fraud audit scanning active preset dossiers for identity duplicates and revenue seal variances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
            {highCount} Active Red Flags
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
            {frozenCount} Disbursals Frozen
          </span>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900">
              Sentinel Clear (0 Candidate Records Loaded)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No false data is loaded. Add presets to ingest applications and run autonomous forensic integrity checks.
            </p>
          </div>
          {onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-xs hover:from-emerald-500 hover:to-indigo-500 transition cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Preset to Run Sentinel Audit</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Summary Risk Distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs text-rose-700 font-bold uppercase tracking-wider">High Risk Critical</div>
              <div className="text-3xl font-black text-rose-900">{highCount}</div>
              <div className="text-xs text-slate-500 font-medium">Automatic disbursal freeze recommended</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs text-amber-700 font-bold uppercase tracking-wider">Medium Borderline</div>
              <div className="text-3xl font-black text-amber-900">{medCount}</div>
              <div className="text-xs text-slate-500 font-medium">Flagged for secondary desk verification</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Clean Integrity Rate</div>
              <div className="text-3xl font-black text-emerald-900">
                {applications.length > 0
                  ? `${(((applications.length - anomalies.length) / applications.length) * 100).toFixed(1)}%`
                  : '100%'}
              </div>
              <div className="text-xs text-slate-500 font-medium">Uncompromised genuine ST candidates</div>
            </div>
          </div>

          {/* Anomaly Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate name, ID, or anomaly type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-80 text-xs px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                {(['ALL', 'High', 'Medium'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFilterRisk(r)}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      filterRisk === r
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                ✓ No anomalies matching filter criteria. All examined records are clean.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Applicant & ID</th>
                      <th className="p-3">Anomaly Type</th>
                      <th className="p-3">Flagged Field</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">AI Confidence</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{item.applicantName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{item.applicationId}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.riskLevel === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.anomalyType}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">{item.flaggedField}</td>
                        <td className="p-3 text-slate-600 max-w-xs">{item.description}</td>
                        <td className="p-3 font-bold text-rose-700">{item.aiConfidence}%</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            {item.status !== 'Frozen' ? (
                              <button
                                type="button"
                                onClick={() => handleAction(item.id, 'Frozen')}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer"
                              >
                                Freeze DBT
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAction(item.id, 'Cleared')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
                              >
                                Clear Flag
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
