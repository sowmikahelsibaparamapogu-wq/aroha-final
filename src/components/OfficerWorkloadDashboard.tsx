import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRightLeft, 
  ShieldCheck, 
  UserCheck,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { OfficerWorkloadItem, Application } from '../types/scholarship';
import { Avatar } from './Avatar';

interface OfficerWorkloadDashboardProps {
  applications?: Application[];
  onOpenPresetModal?: () => void;
}

export const OfficerWorkloadDashboard: React.FC<OfficerWorkloadDashboardProps> = ({
  applications = [],
  onOpenPresetModal,
}) => {
  const isBlank = applications.length === 0;

  // Compute live officer workloads by distributing active applications
  const dynamicOfficers: OfficerWorkloadItem[] = useMemo(() => {
    if (applications.length === 0) {
      return [
        {
          id: 'off_1',
          name: 'Dr. Rajeshwar Soren, IES',
          designation: 'Senior Scrutiny Officer',
          desk: 'Desk-IV (Southern & Central Belt)',
          assignedCount: 0,
          completedCount: 0,
          pendingCount: 0,
          overdueCount: 0,
          slaCompliance: 100.0,
          avatarType: 'officer_senior',
        },
        {
          id: 'off_2',
          name: 'Smt. Ananya Toppo',
          designation: 'Document Authenticator',
          desk: 'Desk-II (Eastern Chota Nagpur Belt)',
          assignedCount: 0,
          completedCount: 0,
          pendingCount: 0,
          overdueCount: 0,
          slaCompliance: 100.0,
          avatarType: 'officer_field',
        },
        {
          id: 'off_3',
          name: 'Shri Manoj Marandi',
          designation: 'Field Verification Officer',
          desk: 'Desk-III (Western & Coastal Belt)',
          assignedCount: 0,
          completedCount: 0,
          pendingCount: 0,
          overdueCount: 0,
          slaCompliance: 100.0,
          avatarType: 'officer_senior',
        },
        {
          id: 'off_4',
          name: 'Deepa Lakra, Director',
          designation: 'Director of Scrutiny',
          desk: 'National Apex & Himalayan Desk',
          assignedCount: 0,
          completedCount: 0,
          pendingCount: 0,
          overdueCount: 0,
          slaCompliance: 100.0,
          avatarType: 'officer_director',
        },
      ];
    }

    // Distribute actual applications across the 4 desks
    const desk1Apps = applications.filter((a) => {
      const s = a.applicant?.state || '';
      return s.includes('Telangana') || s.includes('Andhra') || s.includes('Madhya') || s.includes('Chhattisgarh');
    });

    const desk2Apps = applications.filter((a) => {
      const s = a.applicant?.state || '';
      return s.includes('Jharkhand') || s.includes('Odisha') || s.includes('Bihar') || s.includes('Bengal');
    });

    const desk3Apps = applications.filter((a) => {
      const s = a.applicant?.state || '';
      return s.includes('Rajasthan') || s.includes('Gujarat') || s.includes('Maharashtra') || s.includes('Kerala') || s.includes('Tamil');
    });

    const desk4Apps = applications.filter((a) => {
      const s = a.applicant?.state || '';
      return s.includes('Nagaland') || s.includes('Mizoram') || s.includes('Arunachal') || s.includes('Sikkim') || s.includes('Ladakh') || s.includes('Jammu') || s.includes('Himachal') || s.includes('Meghalaya') || s.includes('Assam');
    });

    const calcCounts = (arr: Application[]) => {
      const assigned = arr.length;
      const completed = arr.filter((a) => a.status === 'approved' || a.status === 'merit_listed' || a.status === 'dbt_active').length;
      const pending = arr.filter((a) => a.status === 'in_scrutiny' || a.status === 'submitted' || a.status === 'flagged_deficiency').length;
      const overdue = arr.filter((a) => a.aiAnalysis?.riskScore === 'High' || (a.aiAnalysis?.flags && a.aiAnalysis.flags.length >= 2)).length;
      const sla = assigned > 0 ? Number((((assigned - overdue) / assigned) * 100).toFixed(1)) : 100.0;
      return { assigned, completed, pending, overdue, sla };
    };

    const d1 = calcCounts(desk1Apps);
    const d2 = calcCounts(desk2Apps);
    const d3 = calcCounts(desk3Apps);
    const d4 = calcCounts(desk4Apps);

    return [
      {
        id: 'off_1',
        name: 'Dr. Rajeshwar Soren, IES',
        designation: 'Senior Scrutiny Officer',
        desk: 'Desk-IV (Southern & Central Belt)',
        assignedCount: d1.assigned,
        completedCount: d1.completed,
        pendingCount: d1.pending,
        overdueCount: d1.overdue,
        slaCompliance: d1.sla,
        avatarType: 'officer_senior',
      },
      {
        id: 'off_2',
        name: 'Smt. Ananya Toppo',
        designation: 'Document Authenticator',
        desk: 'Desk-II (Eastern Chota Nagpur Belt)',
        assignedCount: d2.assigned,
        completedCount: d2.completed,
        pendingCount: d2.pending,
        overdueCount: d2.overdue,
        slaCompliance: d2.sla,
        avatarType: 'officer_field',
      },
      {
        id: 'off_3',
        name: 'Shri Manoj Marandi',
        designation: 'Field Verification Officer',
        desk: 'Desk-III (Western & Coastal Belt)',
        assignedCount: d3.assigned,
        completedCount: d3.completed,
        pendingCount: d3.pending,
        overdueCount: d3.overdue,
        slaCompliance: d3.sla,
        avatarType: 'officer_senior',
      },
      {
        id: 'off_4',
        name: 'Deepa Lakra, Director',
        designation: 'Director of Scrutiny',
        desk: 'National Apex & Himalayan Desk',
        assignedCount: d4.assigned,
        completedCount: d4.completed,
        pendingCount: d4.pending,
        overdueCount: d4.overdue,
        slaCompliance: d4.sla,
        avatarType: 'officer_director',
      },
    ];
  }, [applications]);

  const [officers, setOfficers] = useState<OfficerWorkloadItem[]>(dynamicOfficers);
  const [selectedOfficer, setSelectedOfficer] = useState<OfficerWorkloadItem | null>(null);

  React.useEffect(() => {
    setOfficers(dynamicOfficers);
  }, [dynamicOfficers]);

  const totalAssigned = officers.reduce((acc, o) => acc + o.assignedCount, 0);
  const totalCompleted = officers.reduce((acc, o) => acc + o.completedCount, 0);
  const totalPending = officers.reduce((acc, o) => acc + o.pendingCount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Operational Capacity & Workload</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Officer Workload & Desk Scrutiny
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time file distribution across MoTA scrutiny desks based on candidate domicile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isBlank && onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-xs hover:from-emerald-500 hover:to-indigo-500 transition cursor-pointer shadow-md inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Presets to Distribute Workload</span>
            </button>
          )}
        </div>
      </div>

      {/* Blank State Callout */}
      {isBlank && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="font-black text-sm">Workload Queues Primed (0 Files Assigned)</div>
              <p className="text-xs text-amber-800">
                All scrutiny desks are currently idle at 0 files. Add a preset to route dossiers to regional scrutiny desks.
              </p>
            </div>
          </div>
          {onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer shrink-0"
            >
              ➕ Add Preset
            </button>
          )}
        </div>
      )}

      {/* Summary KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Assigned Files</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalAssigned}</div>
          <div className="text-xs text-emerald-700 font-semibold">Active candidate dossiers</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Verified & Cleared</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-teal-900">{totalCompleted}</div>
          <div className="text-xs text-teal-700 font-semibold">Sanctioned & advanced</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Pending Desk Scrutiny</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-900">{totalPending}</div>
          <div className="text-xs text-amber-700 font-semibold">Awaiting officer review</div>
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {officers.map((officer) => (
          <div
            key={officer.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-slate-300 shadow-sm transition space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar type={officer.avatarType} name={officer.name} role="officer" size="md" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">{officer.name}</h3>
                  <div className="text-xs text-slate-500 font-semibold">{officer.designation}</div>
                  <div className="text-[11px] text-emerald-700 font-bold">{officer.desk}</div>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                officer.slaCompliance >= 90
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {officer.slaCompliance}% SLA
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
              <div className="p-2 bg-slate-50 rounded-xl">
                <div className="text-[10px] text-slate-500 font-bold">Assigned</div>
                <div className="text-lg font-black text-slate-900">{officer.assignedCount}</div>
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl">
                <div className="text-[10px] text-emerald-700 font-bold">Cleared</div>
                <div className="text-lg font-black text-emerald-900">{officer.completedCount}</div>
              </div>
              <div className="p-2 bg-amber-50 rounded-xl">
                <div className="text-[10px] text-amber-700 font-bold">Pending</div>
                <div className="text-lg font-black text-amber-900">{officer.pendingCount}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
