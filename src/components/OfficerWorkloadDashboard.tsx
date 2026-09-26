import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRightLeft, 
  ShieldCheck, 
  UserCheck,
  Search,
  Filter
} from 'lucide-react';
import { OfficerWorkloadItem } from '../types/scholarship';
import { Avatar } from './Avatar';

interface OfficerWorkloadDashboardProps {
  // Optional props
}

const INITIAL_OFFICERS: OfficerWorkloadItem[] = [
  {
    id: 'off_1',
    name: 'Dr. Rajeshwar Soren, IES',
    designation: 'Senior Scrutiny Officer',
    desk: 'Desk-IV (Telangana & Andhra)',
    assignedCount: 68,
    completedCount: 42,
    pendingCount: 22,
    overdueCount: 4,
    slaCompliance: 91.2,
    avatarType: 'officer_senior',
  },
  {
    id: 'off_2',
    name: 'Smt. Ananya Toppo',
    designation: 'Document Authenticator',
    desk: 'Desk-II (Jharkhand & Bihar)',
    assignedCount: 54,
    completedCount: 44,
    pendingCount: 9,
    overdueCount: 1,
    slaCompliance: 96.5,
    avatarType: 'officer_field',
  },
  {
    id: 'off_3',
    name: 'Shri Manoj Marandi',
    designation: 'Field Verification Officer',
    desk: 'Desk-III (Odisha & Bengal)',
    assignedCount: 61,
    completedCount: 38,
    pendingCount: 18,
    overdueCount: 5,
    slaCompliance: 86.8,
    avatarType: 'officer_senior',
  },
  {
    id: 'off_4',
    name: 'Deepa Lakra, Director',
    designation: 'Director of Scrutiny',
    desk: 'National Apex Desk',
    assignedCount: 30,
    completedCount: 28,
    pendingCount: 2,
    overdueCount: 0,
    slaCompliance: 100.0,
    avatarType: 'officer_director',
  },
];

export const OfficerWorkloadDashboard: React.FC<OfficerWorkloadDashboardProps> = () => {
  const [officers, setOfficers] = useState<OfficerWorkloadItem[]>(INITIAL_OFFICERS);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedFromOfficer, setSelectedFromOfficer] = useState<string>('off_1');
  const [selectedToOfficer, setSelectedToOfficer] = useState<string>('off_2');
  const [reassignCount, setReassignCount] = useState<number>(5);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const handleReassign = () => {
    setOfficers((prev) =>
      prev.map((off) => {
        if (off.id === selectedFromOfficer) {
          return {
            ...off,
            assignedCount: off.assignedCount - reassignCount,
            pendingCount: Math.max(0, off.pendingCount - reassignCount),
          };
        }
        if (off.id === selectedToOfficer) {
          return {
            ...off,
            assignedCount: off.assignedCount + reassignCount,
            pendingCount: off.pendingCount + reassignCount,
          };
        }
        return off;
      })
    );
    setReassignModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Capacity & Workload Balancing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Officer Workload Capacity
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setReassignModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Rebalance Caseload</span>
        </button>
      </div>

      {showSuccessToast && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Successfully transferred {reassignCount} applications to balance pending scrutiny pipeline.</span>
        </div>
      )}

      {/* Officer Workload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {officers.map((officer) => {
          const completionRate = Math.round((officer.completedCount / officer.assignedCount) * 100);
          return (
            <div
              key={officer.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    type={officer.avatarType}
                    name={officer.name}
                    role="officer"
                    size="md"
                  />
                  <div>
                    <h3 className="text-base font-bold font-roman text-slate-900">
                      {officer.name}
                    </h3>
                    <div className="text-xs text-slate-500">{officer.designation} • {officer.desk}</div>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  officer.slaCompliance >= 95 ? 'bg-emerald-100 text-emerald-800' :
                  officer.slaCompliance >= 90 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {officer.slaCompliance}% SLA
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>Completion Rate ({completionRate}%)</span>
                  <span>{officer.completedCount} / {officer.assignedCount} files</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {/* Workload Metric Chips */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Assigned</span>
                  <span className="text-sm font-bold text-slate-800">{officer.assignedCount}</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <span className="text-[10px] text-emerald-700 block">Cleared</span>
                  <span className="text-sm font-bold text-emerald-800">{officer.completedCount}</span>
                </div>
                <div className="p-2 bg-amber-50 rounded-xl">
                  <span className="text-[10px] text-amber-700 block">Pending</span>
                  <span className="text-sm font-bold text-amber-800">{officer.pendingCount}</span>
                </div>
                <div className="p-2 bg-rose-50 rounded-xl">
                  <span className="text-[10px] text-rose-700 block">Overdue</span>
                  <span className="text-sm font-bold text-rose-800">{officer.overdueCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reassign Modal */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold font-roman text-slate-900">
              Reassign Application Caseload
            </h3>
            <p className="text-xs text-slate-500">
              Shift pending scrutiny files between desk officers to prevent SLA breaches and balance scrutiny throughput.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Transfer From (Overburdened)</label>
                <select
                  value={selectedFromOfficer}
                  onChange={(e) => setSelectedFromOfficer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 outline-none"
                >
                  {officers.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.pendingCount} pending)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Transfer To (Available Capacity)</label>
                <select
                  value={selectedToOfficer}
                  onChange={(e) => setSelectedToOfficer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 outline-none"
                >
                  {officers.filter((o) => o.id !== selectedFromOfficer).map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.pendingCount} pending)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Number of Files to Transfer</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={reassignCount}
                  onChange={(e) => setReassignCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 outline-none"
                >
                </input>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReassignModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReassign}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                Execute Caseload Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
