import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  UserCheck, 
  ShieldAlert, 
  FileCheck,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  Calendar,
  Zap,
  Check,
  Shield,
  Layers
} from 'lucide-react';
import { Application, UserRole } from '../types/scholarship';

interface SLAEscalationPipelineProps {
  applications: Application[];
  onSelectApplication?: (id: string) => void;
  onOpenPresetModal?: () => void;
  onUpdateApplication?: (updatedApp: Application) => void;
}

interface StageConfig {
  id: string;
  name: string;
  slaMaxDays: number;
  description: string;
  matchingStatuses: string[];
}

const STAGES_CONFIG: StageConfig[] = [
  {
    id: 'stage_1',
    name: 'Intake & AI OCR Scan',
    slaMaxDays: 1,
    description: 'Document extraction, barcode validation, and DigiLocker repository cross-matching',
    matchingStatuses: ['submitted'],
  },
  {
    id: 'stage_2',
    name: 'Officer Desk Scrutiny',
    slaMaxDays: 7,
    description: 'Senior Scrutiny Officer manual evaluation, certificate forensics, and eligibility sign-off',
    matchingStatuses: ['in_scrutiny', 'ocr_verified'],
  },
  {
    id: 'stage_3',
    name: 'Deficiency Clarification Desk',
    slaMaxDays: 15,
    description: 'Statutory 15-day window for candidate to re-upload deficient/discrepant certificates',
    matchingStatuses: ['flagged_deficiency'],
  },
  {
    id: 'stage_4',
    name: 'National Merit Board',
    slaMaxDays: 5,
    description: 'Joint Secretary quota preservation, PVTG affirmative ranking, and final sanction listing',
    matchingStatuses: ['approved', 'merit_listed'],
  },
  {
    id: 'stage_5',
    name: 'PFMS DBT Disbursal',
    slaMaxDays: 3,
    description: 'Public Financial Management System direct fund transfer to Aadhaar-seeded accounts',
    matchingStatuses: ['dbt_active'],
  },
];

export const SLAEscalationPipeline: React.FC<SLAEscalationPipelineProps> = ({
  applications,
  onSelectApplication,
  onOpenPresetModal,
  onUpdateApplication,
}) => {
  const [activeStageId, setActiveStageId] = useState<string>('stage_2');
  const [filterMode, setFilterMode] = useState<'ALL' | 'BREACHED' | 'WARNING' | 'ON_TRACK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const isBlank = applications.length === 0;

  // Calculate real days elapsed and SLA status for each application
  const enrichedApplications = useMemo(() => {
    const now = Date.now();

    return applications.map((app, index) => {
      // Compute days elapsed since submission
      let daysElapsed = 1;
      if (app.submittedAt) {
        const subTime = new Date(app.submittedAt).getTime();
        if (!isNaN(subTime)) {
          daysElapsed = Math.max(1, Math.floor((now - subTime) / (1000 * 60 * 60 * 24)));
        }
      } else {
        // Fallback for mock records without date
        daysElapsed = (index % 5) + 2;
      }

      // Check if candidate has an extension
      const hasExtension = (app.aiAnalysis?.flags || []).some(f => f.includes('Statutory 7-day extension') || f.includes('Extension Approved'));

      // Determine matching stage
      let stage = STAGES_CONFIG.find(s => s.matchingStatuses.includes(app.status));
      if (!stage) {
        // Default based on status
        if (app.deficiencies && app.deficiencies.length > 0) stage = STAGES_CONFIG[2];
        else if (app.status === 'submitted') stage = STAGES_CONFIG[0];
        else stage = STAGES_CONFIG[1];
      }

      const effectiveSlaDays = stage.slaMaxDays + (hasExtension ? 7 : 0);
      const isBreached = daysElapsed > effectiveSlaDays;
      const isWarning = !isBreached && daysElapsed >= Math.max(1, effectiveSlaDays - 1);
      const isOnTrack = !isBreached && !isWarning;

      const progressPercent = Math.min(100, Math.round((daysElapsed / effectiveSlaDays) * 100));

      return {
        ...app,
        daysElapsed,
        effectiveSlaDays,
        isBreached,
        isWarning,
        isOnTrack,
        progressPercent,
        hasExtension,
        assignedStageId: stage.id,
      };
    });
  }, [applications]);

  // Aggregate stage summary counts
  const stageStats = useMemo(() => {
    return STAGES_CONFIG.map((stage) => {
      const stageApps = enrichedApplications.filter(a => a.assignedStageId === stage.id);
      const breachedCount = stageApps.filter(a => a.isBreached).length;
      const warningCount = stageApps.filter(a => a.isWarning).length;
      const onTrackCount = stageApps.filter(a => a.isOnTrack).length;

      return {
        ...stage,
        totalCount: stageApps.length,
        breachedCount,
        warningCount,
        onTrackCount,
      };
    });
  }, [enrichedApplications]);

  const activeStage = stageStats.find((s) => s.id === activeStageId) || stageStats[1];

  // Filtered applications for active stage
  const activeStageApps = useMemo(() => {
    return enrichedApplications
      .filter((app) => app.assignedStageId === activeStageId)
      .filter((app) => {
        if (filterMode === 'BREACHED') return app.isBreached;
        if (filterMode === 'WARNING') return app.isWarning;
        if (filterMode === 'ON_TRACK') return app.isOnTrack;
        return true;
      })
      .filter((app) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          app.applicant?.fullName?.toLowerCase().includes(q) ||
          app.applicationNumber?.toLowerCase().includes(q) ||
          app.applicant?.state?.toLowerCase().includes(q) ||
          app.applicant?.stCommunity?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.daysElapsed - a.daysElapsed)); // Most elapsed / urgent first
  }, [enrichedApplications, activeStageId, filterMode, searchQuery]);

  // Total system-wide breaches
  const totalBreaches = useMemo(() => {
    return enrichedApplications.filter(a => a.isBreached).length;
  }, [enrichedApplications]);

  // ACTION 1: Fast-track / advance application status
  const handleFastTrack = (app: typeof enrichedApplications[0]) => {
    let nextStatus: Application['status'] = 'in_scrutiny';
    let message = '';

    if (app.status === 'submitted') {
      nextStatus = 'in_scrutiny';
      message = `Fast-tracked Application #${app.applicationNumber} to Officer Desk Scrutiny.`;
    } else if (app.status === 'in_scrutiny' || app.status === 'ocr_verified') {
      nextStatus = 'approved';
      message = `Fast-tracked Application #${app.applicationNumber} to National Merit Board (Approved).`;
    } else if (app.status === 'flagged_deficiency') {
      nextStatus = 'in_scrutiny';
      message = `Deficiency override applied for #${app.applicationNumber}. Advanced to Desk Scrutiny.`;
    } else if (app.status === 'approved') {
      nextStatus = 'merit_listed';
      message = `Application #${app.applicationNumber} gazetted into National Merit List.`;
    } else {
      nextStatus = 'dbt_active';
      message = `Application #${app.applicationNumber} forwarded for PFMS DBT disbursal.`;
    }

    const updatedApp: Application = {
      ...app,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
      aiAnalysis: {
        ...app.aiAnalysis,
        flags: [
          ...(app.aiAnalysis?.flags || []),
          `Fast-tracked under Statutory SLA Escalation Protocol on ${new Date().toLocaleDateString('en-IN')}`,
        ],
      },
    };

    onUpdateApplication?.(updatedApp);
    setActionNotice(message);
    setTimeout(() => setActionNotice(null), 4500);
  };

  // ACTION 2: Grant 7-Day statutory extension
  const handleGrantExtension = (app: typeof enrichedApplications[0]) => {
    const updatedApp: Application = {
      ...app,
      updatedAt: new Date().toISOString(),
      aiAnalysis: {
        ...app.aiAnalysis,
        flags: [
          ...(app.aiAnalysis?.flags || []),
          `Statutory 7-day extension approved by Ministry Competent Authority (Ref: SLA-SEC-2025/EX) on ${new Date().toLocaleDateString('en-IN')}`,
        ],
      },
    };

    onUpdateApplication?.(updatedApp);
    setActionNotice(`Statutory 7-Day SLA Extension recorded for candidate ${app.applicant?.fullName}.`);
    setTimeout(() => setActionNotice(null), 4500);
  };

  // ACTION 3: Issue priority SLA notice to desk officer
  const handleIssueNotice = (app: typeof enrichedApplications[0]) => {
    const updatedApp: Application = {
      ...app,
      updatedAt: new Date().toISOString(),
      aiAnalysis: {
        ...app.aiAnalysis,
        flags: [
          ...(app.aiAnalysis?.flags || []),
          `URGENT: Formal SLA breach warning notice issued to Desk Officer on ${new Date().toLocaleDateString('en-IN')}`,
        ],
      },
    };

    onUpdateApplication?.(updatedApp);
    setActionNotice(`Priority SLA Compliance Notice issued to Scrutiny Desk for #${app.applicationNumber}.`);
    setTimeout(() => setActionNotice(null), 4500);
  };

  // ACTION 4: Batch dispatch reminders for active stage
  const handleBatchDispatch = () => {
    const breachedInStage = enrichedApplications.filter(a => a.assignedStageId === activeStageId && a.isBreached);
    breachedInStage.forEach((app) => {
      const updated: Application = {
        ...app,
        updatedAt: new Date().toISOString(),
        aiAnalysis: {
          ...app.aiAnalysis,
          flags: [
            ...(app.aiAnalysis?.flags || []),
            `Batch SLA Statutory Reminder Dispatched on ${new Date().toLocaleDateString('en-IN')}`,
          ],
        },
      };
      onUpdateApplication?.(updated);
    });

    setActionNotice(`Statutory compliance reminders dispatched to all ${breachedInStage.length} breached cases in ${activeStage.name}.`);
    setTimeout(() => setActionNotice(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-indigo-700 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Government of India Statutory Citizen Charter Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            SLA Escalation Radar & Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking and automated statutory escalation for all applicant dossiers against citizen charter deadlines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-2xs">
            {applications.length} Total Dossiers
          </div>
          {totalBreaches > 0 ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black shadow-sm flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{totalBreaches} Statutory Breaches</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All On Track</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-xs text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

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
                SLA clocks are stopped. Add candidate presets to track real-time statutory escalation timelines.
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
        {stageStats.map((stage, idx) => {
          const isSelected = activeStageId === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStageId(stage.id)}
              className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between min-h-[115px] ${
                isSelected
                  ? 'bg-indigo-50/80 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Stage {idx + 1}</span>
                  <span className="text-indigo-700 font-bold">{stage.slaMaxDays}d SLA</span>
                </div>
                <div className="text-xs font-black text-slate-900 leading-snug">
                  {stage.name}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-black text-slate-900">{stage.totalCount} Files</span>
                {stage.breachedCount > 0 ? (
                  <span className="text-rose-600 font-black text-[11px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
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

      {/* Active Stage Detail & Filter Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">
                Stage {STAGES_CONFIG.findIndex(s => s.id === activeStage.id) + 1} of 5
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold">
                Max {activeStage.slaMaxDays} Days Charter
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {activeStage.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeStage.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeStage.breachedCount > 0 && (
              <button
                type="button"
                onClick={handleBatchDispatch}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Send statutory notices to officers handling breached files"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch SLA Notices ({activeStage.breachedCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-xs text-emerald-800 font-bold flex items-center justify-between">
              <span>On-Track Within SLA</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-3xl font-black text-emerald-950 mt-1">{activeStage.onTrackCount}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Operating comfortably within deadline</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="text-xs text-amber-800 font-bold flex items-center justify-between">
              <span>Approaching Deadline</span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-3xl font-black text-amber-950 mt-1">{activeStage.warningCount}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Requires officer action within 24-48 hours</div>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
            <div className="text-xs text-rose-800 font-bold flex items-center justify-between">
              <span>Statutory Breached</span>
              <AlertTriangle className="w-4 h-4 text-rose-700" />
            </div>
            <div className="text-3xl font-black text-rose-950 mt-1">{activeStage.breachedCount}</div>
            <div className="text-[11px] text-rose-700 mt-0.5">Exceeded statutory charter limit</div>
          </div>
        </div>

        {/* Controls: Search and Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === 'ALL' ? 'bg-white shadow-xs text-indigo-900' : 'text-slate-600'
              }`}
            >
              All Files ({activeStage.totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('BREACHED')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                filterMode === 'BREACHED' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <span>Breached</span>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-700 text-white text-[10px]">
                {activeStage.breachedCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('WARNING')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === 'WARNING' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Warning ({activeStage.warningCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('ON_TRACK')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterMode === 'ON_TRACK' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              On Track ({activeStage.onTrackCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate, ID, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Real Live Applications List in Active Stage */}
        <div className="space-y-3">
          {activeStageApps.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs space-y-1">
              <div className="font-bold text-slate-700">No Applications in this SLA Category</div>
              <p>All candidates in this stage are compliant or filtered out.</p>
            </div>
          ) : (
            activeStageApps.map((app) => {
              return (
                <div
                  key={app.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    app.isBreached
                      ? 'bg-rose-50/40 border-rose-300 shadow-xs'
                      : app.isWarning
                      ? 'bg-amber-50/40 border-amber-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    
                    {/* Candidate & Application Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-sm text-slate-900">
                          {app.applicant?.fullName || 'ST Candidate'}
                        </span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {app.applicationNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.scheme === 'NFST' ? 'bg-indigo-100 text-indigo-900' : 'bg-purple-100 text-purple-900'
                        }`}>
                          {app.scheme}
                        </span>
                        {app.hasExtension && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            +7d Extension Active
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span>Community: <strong className="text-slate-700">{app.applicant?.stCommunity}</strong></span>
                        <span>•</span>
                        <span>State: <strong className="text-slate-700">{app.applicant?.state}</strong></span>
                        <span>•</span>
                        <span>Score: <strong className="text-slate-700">{app.academic?.qualifyingPercentage}%</strong></span>
                        <span>•</span>
                        <span>Submitted: <strong className="text-slate-700">{app.submittedAt?.split('T')[0] || 'Recently'}</strong></span>
                      </div>

                      {/* Progress Bar of SLA Limit */}
                      <div className="pt-1 max-w-md">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-600 font-semibold">
                            Time Elapsed: <strong className="text-slate-900">{app.daysElapsed} Days</strong>
                          </span>
                          <span className="font-mono font-bold text-slate-500">
                            Charter Max: {app.effectiveSlaDays} Days
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              app.isBreached
                                ? 'bg-rose-600'
                                : app.isWarning
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, (app.daysElapsed / app.effectiveSlaDays) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SLA Status Badge */}
                    <div className="shrink-0 flex flex-col items-start lg:items-end gap-1">
                      {app.isBreached ? (
                        <div className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Breached by {app.daysElapsed - app.effectiveSlaDays} Days</span>
                        </div>
                      ) : app.isWarning ? (
                        <div className="px-3 py-1 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>48h SLA Notice</span>
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>On Track ({app.effectiveSlaDays - app.daysElapsed}d Remaining)</span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        Status: {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Functional Action Buttons: These actually update the application in real-time */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200 w-full lg:w-auto">
                      <button
                        type="button"
                        onClick={() => handleFastTrack(app)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Fast-track to next operational stage"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Advance Stage</span>
                      </button>

                      {!app.hasExtension && (
                        <button
                          type="button"
                          onClick={() => handleGrantExtension(app)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition cursor-pointer"
                          title="Grant 7-day statutory extension"
                        >
                          <span>+7d Extension</span>
                        </button>
                      )}

                      {app.isBreached && (
                        <button
                          type="button"
                          onClick={() => handleIssueNotice(app)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                          title="Issue statutory non-compliance notice to desk officer"
                        >
                          <Send className="w-3 h-3" />
                          <span>SLA Notice</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectApplication?.(app.id)}
                        className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition cursor-pointer"
                        title="Open Candidate Dossier"
                      >
                        <ArrowUpRight className="w-4 h-4 text-slate-700" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
