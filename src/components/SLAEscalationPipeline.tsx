import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Send, 
  UserCheck, 
  ShieldAlert, 
  FileCheck,
  Sparkles
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface SLAEscalationPipelineProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
  onOpenPresetModal?: () => void;
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
  onOpenPresetModal,
}) => {
  const [activeStageId, setActiveStageId] = useState<string>('stage_1');
  const [escalationSent, setEscalationSent] = useState<Record<string, boolean>>({});

  const isBlank = applications.length === 0;

  // Dynamic pipeline calculation
  const stages: PipelineStage[] = useMemo(() => {
    if (applications.length === 0) {
      return [
        {
          id: 'stage_1',
          name: 'Intake & AI OCR',
          slaMaxDays: 1,
          description: 'Document extraction, e-Pramaan barcode scan, DigiLocker tallying',
          totalCount: 0,
          breachedCount: 0,
          warningCount: 0,
          onTrackCount: 0,
        },
        {
          id: 'stage_2',
          name: 'Officer Desk Scrutiny',
          slaMaxDays: 7,
          description: 'Senior Scrutiny Officer manual review & statutory checklist verification',
          totalCount: 0,
          breachedCount: 0,
          warningCount: 0,
          onTrackCount: 0,
        },
        {
          id: 'stage_3',
          name: 'Deficiency Clarification Desk',
          slaMaxDays: 15,
          description: 'Student replacement upload window under 15-day statutory citizen charter',
          totalCount: 0,
          breachedCount: 0,
          warningCount: 0,
          onTrackCount: 0,
        },
        {
          id: 'stage_4',
          name: 'National Merit Board',
          slaMaxDays: 5,
          description: 'Joint Secretary quota preservation & merit publication',
          totalCount: 0,
          breachedCount: 0,
          warningCount: 0,
          onTrackCount: 0,
        },
        {
          id: 'stage_5',
          name: 'PFMS DBT Disbursal',
          slaMaxDays: 3,
          description: 'Direct Benefit Transfer release to Aadhaar-seeded bank accounts',
          totalCount: 0,
          breachedCount: 0,
          warningCount: 0,
          onTrackCount: 0,
        },
      ];
    }

    const s1 = applications.filter((a) => a.status === 'submitted' || a.status === 'in_scrutiny').length;
    const s2 = applications.filter((a) => a.status === 'in_scrutiny').length;
    const s3 = applications.filter((a) => a.deficiencies && a.deficiencies.length > 0).length;
    const s4 = applications.filter((a) => a.status === 'merit_listed' || a.status === 'approved').length;
    const s5 = applications.filter((a) => a.status === 'dbt_active').length;

    const riskCount = applications.filter((a) => a.aiAnalysis?.riskScore === 'High').length;

    return [
      {
        id: 'stage_1',
        name: 'Intake & AI OCR',
        slaMaxDays: 1,
        description: 'Document extraction, e-Pramaan barcode scan, DigiLocker tallying',
        totalCount: s1,
        breachedCount: 0,
        warningCount: Math.min(s1, riskCount),
        onTrackCount: Math.max(0, s1 - riskCount),
      },
      {
        id: 'stage_2',
        name: 'Officer Desk Scrutiny',
        slaMaxDays: 7,
        description: 'Senior Scrutiny Officer manual review & statutory checklist verification',
        totalCount: s2,
        breachedCount: Math.min(s2, Math.floor(riskCount / 2)),
        warningCount: Math.min(s2, riskCount),
        onTrackCount: Math.max(0, s2 - riskCount),
      },
      {
        id: 'stage_3',
        name: 'Deficiency Clarification Desk',
        slaMaxDays: 15,
        description: 'Student replacement upload window under 15-day statutory citizen charter',
        totalCount: s3,
        breachedCount: 0,
        warningCount: s3,
        onTrackCount: 0,
      },
      {
        id: 'stage_4',
        name: 'National Merit Board',
        slaMaxDays: 5,
        description: 'Joint Secretary quota preservation & merit publication',
        totalCount: s4,
        breachedCount: 0,
        warningCount: 0,
        onTrackCount: s4,
      },
      {
        id: 'stage_5',
        name: 'PFMS DBT Disbursal',
        slaMaxDays: 3,
        description: 'Direct Benefit Transfer release to Aadhaar-seeded bank accounts',
        totalCount: s5,
        breachedCount: 0,
        warningCount: 0,
        onTrackCount: s5,
      },
    ];
  }, [applications]);

  const activeStage = stages.find((s) => s.id === activeStageId) || stages[0];

  const handleSendEscalation = (id: string) => {
    setEscalationSent((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setEscalationSent((prev) => ({ ...prev, [id]: false }));
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Statutory Citizen Charter Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            SLA Escalation Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5-stage statutory lifecycle tracking real-time pendency against Government of India citizen charter deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
            {applications.length} Active Dossiers
          </span>
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
              <div className="font-black text-sm">Pipeline Idle (0 Applications Loaded)</div>
              <p className="text-xs text-amber-800">
                SLA clocks are stopped. Add candidate presets to track real-time 15-day statutory escalation timelines.
              </p>
            </div>
          </div>
          {onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer shrink-0"
            >
              ➕ Ingest Preset
            </button>
          )}
        </div>
      )}

      {/* 5-Stage Stepper Track */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {stages.map((stage, idx) => {
          const isSelected = activeStageId === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStageId(stage.id)}
              className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between min-h-[110px] ${
                isSelected
                  ? 'bg-emerald-50/80 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Stage {idx + 1}</span>
                  <span className="text-emerald-700">{stage.slaMaxDays}d SLA</span>
                </div>
                <div className="text-xs font-black text-slate-900 leading-snug">
                  {stage.name}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-black text-slate-900">{stage.totalCount} Files</span>
                {stage.breachedCount > 0 ? (
                  <span className="text-rose-600 font-bold text-[10px]">
                    {stage.breachedCount} Breached
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold text-[10px]">On Track</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Inspector Detail */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
              Selected Lifecycle Stage:
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              {activeStage.name} (Max {activeStage.slaMaxDays} Days SLA)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {activeStage.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSendEscalation(activeStage.id)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{escalationSent[activeStage.id] ? 'Escalation Notice Dispatched ✓' : 'Dispatch Officer Reminder'}</span>
            </button>
          </div>
        </div>

        {/* Counts breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-xs text-emerald-800 font-bold">On-Track Within SLA</div>
            <div className="text-2xl font-black text-emerald-950 mt-1">{activeStage.onTrackCount}</div>
            <div className="text-[10px] text-emerald-700">Operating under statutory turnaround</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="text-xs text-amber-800 font-bold">Warning Approaching Limit</div>
            <div className="text-2xl font-black text-amber-950 mt-1">{activeStage.warningCount}</div>
            <div className="text-[10px] text-amber-700">Requires officer clearance within 48h</div>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
            <div className="text-xs text-rose-800 font-bold">Statutory SLA Breached</div>
            <div className="text-2xl font-black text-rose-950 mt-1">{activeStage.breachedCount}</div>
            <div className="text-[10px] text-rose-700">Auto-escalated to Monitoring Queue</div>
          </div>
        </div>
      </div>
    </div>
  );
};
