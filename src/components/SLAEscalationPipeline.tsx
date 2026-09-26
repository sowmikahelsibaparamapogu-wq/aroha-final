import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Send, 
  UserCheck, 
  ShieldAlert, 
  FileCheck
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface SLAEscalationPipelineProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
}

interface PipelineStage {
  id: string;
  name: string;
  slaMaxDays: number;
  description: string;
  totalCount: number;
  breachedCount: number;
  warningCount: number;
  onTrackCount: number;
}

export const SLAEscalationPipeline: React.FC<SLAEscalationPipelineProps> = ({
  applications,
  onSelectApplication,
}) => {
  const [activeStageId, setActiveStageId] = useState<string>('stage_2');
  const [escalationSent, setEscalationSent] = useState<Record<string, boolean>>({});

  // 5 Statutory Pipeline Stages
  const stages: PipelineStage[] = [
    {
      id: 'stage_1',
      name: 'Intake & AI OCR',
      slaMaxDays: 1, // 24 Hours
      description: 'Document extraction, e-Pramaan barcode scan, DigiLocker tallying',
      totalCount: 38,
      breachedCount: 0,
      warningCount: 2,
      onTrackCount: 36,
    },
    {
      id: 'stage_2',
      name: 'Officer Desk Scrutiny',
      slaMaxDays: 7, // 7 Days
      description: 'Senior Scrutiny Officer manual review & statutory checklist verification',
      totalCount: 64,
      breachedCount: 14,
      warningCount: 18,
      onTrackCount: 32,
    },
    {
      id: 'stage_3',
      name: 'Field Verification',
      slaMaxDays: 5, // 5 Days
      description: 'Revenue Inspector physical habitat & domicile check for contested certificates',
      totalCount: 19,
      breachedCount: 3,
      warningCount: 4,
      onTrackCount: 12,
    },
    {
      id: 'stage_4',
      name: 'Apex Merit Sanction',
      slaMaxDays: 3, // 3 Days
      description: 'National Screening Board ranking confirmation & 30% Women ST Quota',
      totalCount: 28,
      breachedCount: 1,
      warningCount: 2,
      onTrackCount: 25,
    },
    {
      id: 'stage_5',
      name: 'PFMS DBT Disbursal',
      slaMaxDays: 2, // 48 Hours
      description: 'Aadhaar Payment Bridge generation, RBI escrow credit, bank SMS trigger',
      totalCount: 52,
      breachedCount: 0,
      warningCount: 1,
      onTrackCount: 51,
    },
  ];

  const handleSendEscalation = (appId: string) => {
    setEscalationSent((prev) => ({ ...prev, [appId]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Citizen Charter Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            SLA Escalation Radar
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>18 Critical Breaches Across Desks</span>
          </span>
        </div>
      </div>

      {/* Visual 5-Stage Pipeline Funnel */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {stages.map((stage, idx) => {
          const isSelected = activeStageId === stage.id;
          const hasBreach = stage.breachedCount > 0;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStageId(stage.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative shadow-sm ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500/40 shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  Stage {idx + 1}
                </span>

                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  hasBreach ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  Max {stage.slaMaxDays}d SLA
                </span>
              </div>

              <div className="font-bold font-roman text-sm mb-1 truncate">
                {stage.name}
              </div>

              <div className="text-2xl font-bold font-roman my-1">
                {stage.totalCount}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] mt-2 pt-2 border-t border-slate-200/40">
                {hasBreach ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    {stage.breachedCount} Breached
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    100% On Time
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail & Escalation Action Desk */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold font-roman text-slate-900">
              Files In Active Stage: {stages.find((s) => s.id === activeStageId)?.name}
            </h3>
            <p className="text-xs text-slate-500">
              {stages.find((s) => s.id === activeStageId)?.description}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600">
            Statutory Target: {stages.find((s) => s.id === activeStageId)?.slaMaxDays} business days
          </span>
        </div>

        {/* Priority SLA Cases Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Application ID</th>
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">Assigned Desk</th>
                <th className="py-2.5 px-3">Days In Stage</th>
                <th className="py-2.5 px-3">SLA Status</th>
                <th className="py-2.5 px-3 text-right">Escalation Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((app, idx) => {
                const daysInStage = idx === 0 ? 16 : idx === 1 ? 14 : 4;
                const isBreached = daysInStage > 7;
                const isWarning = daysInStage >= 6 && daysInStage <= 7;
                const isSent = Boolean(escalationSent[app.id]);

                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{app.applicant?.fullName}</div>
                      <div className="text-[10px] text-slate-500">{app.applicant?.stCommunity} • {app.applicant?.state}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      Desk-IV (Dr. Soren, IES)
                    </td>
                    <td className="py-3 px-3 font-bold">
                      <span className={isBreached ? 'text-rose-700' : 'text-slate-800'}>
                        {daysInStage} Days
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {isBreached ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-300">
                          SLA Breached (+{daysInStage - 7}d)
                        </span>
                      ) : isWarning ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-300">
                          Warning (&lt;24h)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                          Within Norms
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isSent ? (
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Escalated to JS
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendEscalation(app.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[11px] transition cursor-pointer border border-rose-200"
                        >
                          Send Priority Escalation
                        </button>
                      )}
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
