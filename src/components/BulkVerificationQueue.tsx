import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Filter,
  FileCheck
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface BulkVerificationQueueProps {
  applications: Application[];
  onBatchApprove?: (ids: string[]) => void;
  onBatchReject?: (ids: string[]) => void;
  onSelectApplication?: (id: string) => void;
}

export const BulkVerificationQueue: React.FC<BulkVerificationQueueProps> = ({
  applications,
  onBatchApprove,
  onBatchReject,
  onSelectApplication,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const pendingApps = applications.filter(
    (a) => a.status === 'in_scrutiny' || a.status === 'submitted' || a.status === 'flagged_deficiency'
  );

  const isAllSelected = pendingApps.length > 0 && selectedIds.length === pendingApps.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingApps.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    onBatchApprove?.(selectedIds);
    setActionNotice(`Batch of ${selectedIds.length} application(s) approved and advanced to National Merit Board.`);
    setSelectedIds([]);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleBulkFlag = () => {
    if (selectedIds.length === 0) return;
    setActionNotice(`Flagged ${selectedIds.length} application(s) for Revenue Inspector field scrutiny.`);
    setSelectedIds([]);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4 text-emerald-700" />
            <span>High-Throughput Processing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Batch Verification Desk
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {selectedIds.length} of {pendingApps.length} Selected
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Floating Bulk Action Bar when items selected */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border border-slate-700 animate-in slide-in-from-top">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>{selectedIds.length} dossiers queued for batch action</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkApprove}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bulk Approve & Advance</span>
            </button>
            <button
              type="button"
              onClick={handleBulkFlag}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Bulk Field Flag</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl border border-white/20 text-slate-300 hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="p-3 w-10">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="cursor-pointer text-slate-600 hover:text-slate-900"
                  >
                    {isAllSelected ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="p-3">Applicant & ID</th>
                <th className="p-3">Scheme</th>
                <th className="p-3">Tribe / Domicile</th>
                <th className="p-3">AI Confidence</th>
                <th className="p-3">Deficiencies</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingApps.map((app) => {
                const isChecked = selectedIds.includes(app.id);
                return (
                  <tr
                    key={app.id}
                    className={`transition ${isChecked ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(app.id)}
                        className="cursor-pointer text-slate-600 hover:text-slate-900"
                      >
                        {isChecked ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{app.applicant?.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{app.applicationNumber}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.scheme === 'NFST' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {app.scheme}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800">{app.applicant?.stCommunity}</div>
                      <div className="text-[10px] text-slate-400">{app.applicant?.district}, {app.applicant?.state}</div>
                    </td>
                    <td className="p-3 font-bold text-emerald-700">
                      {app.aiAnalysis?.overallConfidence || 95}%
                    </td>
                    <td className="p-3">
                      {app.deficiencies && app.deficiencies.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {app.deficiencies.length} Notice Active
                        </span>
                      ) : (
                        <span className="text-slate-400">Zero Flags</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectApplication?.(app.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition cursor-pointer"
                      >
                        View Dossier →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
