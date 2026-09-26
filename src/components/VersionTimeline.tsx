import React, { useState } from 'react';
import { 
  History, 
  GitCommit, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  User,
  Clock
} from 'lucide-react';
import { ApplicationVersion } from '../types/scholarship';

interface VersionTimelineProps {
  applicationId?: string;
  applicantName?: string;
}

const STATIC_VERSIONS: ApplicationVersion[] = [
  {
    version: 'V1.0',
    timestamp: '2025-08-10T11:20:00Z',
    author: 'Applicant (Sowmika Helsiba Paramapogu)',
    summary: 'Initial fellowship application submission via portal with uncertified caste affidavit.',
    changedFields: [
      { field: 'Annual Income', oldVal: '—', newVal: '₹3,40,000' },
      { field: 'ST Caste Certificate', oldVal: '—', newVal: 'Temporary_Affidavit.pdf' },
      { field: 'Status', oldVal: 'Draft', newVal: 'Submitted' },
    ],
  },
  {
    version: 'V2.0',
    timestamp: '2025-08-12T16:45:00Z',
    author: 'Applicant (Deficiency Rectification)',
    summary: 'Replaced temporary affidavit with digital e-Pramaan Sub-Divisional Magistrate certificate in response to Desk-IV deficiency notice.',
    changedFields: [
      { field: 'ST Caste Certificate', oldVal: 'Temporary_Affidavit.pdf', newVal: 'ST_Caste_Certificate_Adilabad_SDM.pdf' },
      { field: 'Barcode Verification', oldVal: 'Unverified', newVal: 'Cryptographic Validated (TG/ST/2023/009182)' },
      { field: 'Status', oldVal: 'Flagged Deficiency', newVal: 'In Scrutiny' },
    ],
  },
  {
    version: 'V3.0',
    timestamp: '2025-08-14T10:15:00Z',
    author: 'Desk-IV Scrutiny Officer (Dr. Soren, IES)',
    summary: 'Attestation confirmed, marksheets verified with University of Hyderabad controller of examinations, recommended for sanction.',
    changedFields: [
      { field: 'Scrutiny Remarks', oldVal: 'Pending Revenue Stamp', newVal: 'All documents verified against state repository' },
      { field: 'Merit Score', oldVal: 'Pending', newVal: '98.42 Percentile (Rank #14)' },
      { field: 'Status', oldVal: 'In Scrutiny', newVal: 'Merit Listed' },
    ],
  },
  {
    version: 'V4.0 (Current)',
    timestamp: '2025-08-15T15:30:00Z',
    author: 'PFMS Direct Benefit Transfer Comptroller',
    summary: 'Aadhaar Payment Bridge seeded and monthly DBT stipend activated.',
    changedFields: [
      { field: 'DBT Status', oldVal: 'Inactive', newVal: 'Active PFMS Mandate' },
      { field: 'Status', oldVal: 'Merit Listed', newVal: 'DBT Active' },
    ],
  },
];

export const VersionTimeline: React.FC<VersionTimelineProps> = ({
  applicationId = 'NFST/2025/0812',
  applicantName = 'Sowmika Helsiba Paramapogu',
}) => {
  const [selectedVersion, setSelectedVersion] = useState<ApplicationVersion>(STATIC_VERSIONS[1]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <History className="w-4 h-4 text-emerald-700" />
            <span>Immutable Audit Trail & Version Control</span>
          </div>
          <h2 className="text-2xl font-bold font-roman text-slate-900">
            Application Version Timeline & Diff Inspector
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare historical revisions across document re-uploads, deficiency resolutions, and officer annotations.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold font-mono text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {applicationId}
          </span>
        </div>
      </div>

      {/* Visual Timeline Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {STATIC_VERSIONS.map((ver) => {
          const isSelected = selectedVersion.version === ver.version;
          return (
            <button
              key={ver.version}
              type="button"
              onClick={() => setSelectedVersion(ver)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500/40'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-roman font-bold text-base">{ver.version}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(ver.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className={`text-xs font-semibold truncate ${isSelected ? 'text-amber-300' : 'text-emerald-800'}`}>
                {ver.author.split('(')[0]}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-1">
                {ver.changedFields.length} Modified Fields
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Version Field Diff Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold font-roman text-slate-900 flex items-center gap-2">
              <span>Revision Details: {selectedVersion.version}</span>
              <span className="text-xs font-sans font-medium text-slate-500">
                ({new Date(selectedVersion.timestamp).toLocaleString()})
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">{selectedVersion.summary}</p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Author: <strong className="text-slate-800">{selectedVersion.author}</strong>
          </span>
        </div>

        {/* Diff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="p-3">Attribute / Document</th>
                <th className="p-3">Previous State (Before)</th>
                <th className="p-3">Updated State (After)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedVersion.changedFields.map((field, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-800">{field.field}</td>
                  <td className="p-3 text-rose-700 bg-rose-50/40 font-mono">
                    {field.oldVal}
                  </td>
                  <td className="p-3 text-emerald-800 bg-emerald-50/40 font-bold font-mono">
                    {field.newVal}
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
