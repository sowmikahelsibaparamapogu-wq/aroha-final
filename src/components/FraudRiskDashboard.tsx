import React, { useState, useMemo } from 'react';
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
  FileCheck
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface FraudRiskDashboardProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
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

const SEEDED_ANOMALIES: FraudAnomaly[] = [
  {
    id: 'anom_1',
    applicationId: 'app_nfst_005',
    applicantName: 'Rameshwar Naik',
    scheme: 'NFST',
    riskLevel: 'High',
    anomalyType: 'Duplicate Identity',
    description: 'Bank account number (SBIN0048192) matches an active scholarship awarded in Telangana State Tribal Portal in 2024.',
    flaggedField: 'Bank Account & IFSC',
    aiConfidence: 98,
    status: 'Frozen',
  },
  {
    id: 'anom_2',
    applicationId: 'app_nos_003',
    applicantName: 'Kunal Marandi',
    scheme: 'NOS',
    riskLevel: 'High',
    anomalyType: 'Font Tampering',
    description: 'Marksheet OCR detected non-matching pixel grid & modified font bounding box around Master aggregate percentage (68.4% overlaid on 51.2%).',
    flaggedField: 'Academic Marksheet',
    aiConfidence: 96,
    status: 'Under Investigation',
  },
  {
    id: 'anom_3',
    applicationId: 'app_nfst_007',
    applicantName: 'Pooja Birhor',
    scheme: 'NFST',
    riskLevel: 'Medium',
    anomalyType: 'Revenue Seal Invalid',
    description: 'Tahsildar round seal barcode missing crypto signature from Jharkhand JharSewa e-District server.',
    flaggedField: 'Caste Certificate',
    aiConfidence: 82,
    status: 'Under Investigation',
  },
  {
    id: 'anom_4',
    applicationId: 'app_nos_004',
    applicantName: 'Vikram Soren',
    scheme: 'NOS',
    riskLevel: 'Medium',
    anomalyType: 'Income Under-declaration',
    description: 'Income certificate lists ₹4.2 Lakhs while IT Department PAN link indicates Form 16 TDS exceeding ₹11.5 Lakhs.',
    flaggedField: 'Income Certificate',
    aiConfidence: 89,
    status: 'Under Investigation',
  },
];

export const FraudRiskDashboard: React.FC<FraudRiskDashboardProps> = ({
  applications,
  onSelectApplication,
}) => {
  const [anomalies, setAnomalies] = useState<FraudAnomaly[]>(SEEDED_ANOMALIES);
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

      {/* Summary Risk Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm bg-rose-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-800 uppercase">High Risk Severity</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-bold font-roman text-rose-900">{highCount}</div>
          <div className="text-xs text-rose-700 mt-1">Requires SDM Physical Verification</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm bg-amber-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase">Medium Risk Anomaly</span>
            <FileWarning className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold font-roman text-amber-900">{medCount}</div>
          <div className="text-xs text-amber-700 mt-1">Deficiency Notice Issued</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm bg-emerald-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase">Integrity Score</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-roman text-emerald-900">98.4%</div>
          <div className="text-xs text-emerald-700 mt-1">Beneficiary Authenticity Clean Rate</div>
        </div>
      </div>

      {/* Filter and Anomalies List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            {(['ALL', 'High', 'Medium', 'Low'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFilterRisk(r)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterRisk === r
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r === 'ALL' ? 'All Risks' : `${r} Risk`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search candidate, field, anomaly..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Flagged Cases Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Applicant & ID</th>
                <th className="py-2.5 px-3">Flag Type</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Detection Evidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{item.applicantName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.applicationId}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {item.anomalyType}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.riskLevel === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-xs text-slate-600">
                    <div className="truncate">{item.description}</div>
                    <div className="text-[10px] text-slate-400">Confidence: {item.aiConfidence}%</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'Frozen' ? 'bg-rose-600 text-white' :
                      item.status === 'Cleared' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status !== 'Frozen' && (
                        <button
                          type="button"
                          onClick={() => handleAction(item.id, 'Frozen')}
                          className="px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold transition cursor-pointer"
                        >
                          Freeze DBT
                        </button>
                      )}
                      {item.status !== 'Cleared' && (
                        <button
                          type="button"
                          onClick={() => handleAction(item.id, 'Cleared')}
                          className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition cursor-pointer"
                        >
                          Clear Anomaly
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
