import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  FileText,
  ThumbsUp,
  Sparkles
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface DecisionSupportCenterProps {
  applications?: Application[];
  onOpenPresetModal?: () => void;
}

interface StrategicRecommendation {
  id: string;
  domain: 'Budget' | 'Risk' | 'SLA' | 'Demand';
  priority: 'Immediate Action' | 'High Strategic' | 'Medium';
  title: string;
  evidence: string;
  actionProposal: string;
  expectedOutcome: string;
  confidenceScore: number;
  approved: boolean;
}

export const DecisionSupportCenter: React.FC<DecisionSupportCenterProps> = ({
  applications = [],
  onOpenPresetModal,
}) => {
  const dynamicRecommendations = useMemo(() => {
    if (applications.length === 0) return [];

    const total = applications.length;
    const femaleCount = applications.filter((a) => a.applicant?.gender === 'Female').length;
    const femalePct = ((femaleCount / total) * 100).toFixed(1);
    const nfstCount = applications.filter((a) => a.scheme === 'NFST').length;
    const nosCount = applications.filter((a) => a.scheme === 'NOS').length;
    const pendingCount = applications.filter((a) => a.status === 'in_scrutiny' || a.status === 'submitted').length;

    const list: StrategicRecommendation[] = [
      {
        id: 'rec_dynamic_1',
        domain: 'Demand',
        priority: 'Immediate Action',
        title: `Optimize Slot Allocation Across Active Schemes (${nfstCount} NFST vs ${nosCount} NOS)`,
        evidence: `Current ingested intake has ${nfstCount} domestic NFST applicants and ${nosCount} overseas NOS scholars across active state clusters.`,
        actionProposal: 'Authorize dynamic slot balancing under MoTA statutory guidelines to maximize scholarship utilization.',
        expectedOutcome: '100% scholarship budget fulfillment before fiscal year deadline.',
        confidenceScore: 96,
        approved: false,
      },
      {
        id: 'rec_dynamic_2',
        domain: 'SLA',
        priority: 'Immediate Action',
        title: `Expedite Scrutiny Pipeline for ${pendingCount} Pending Dossiers`,
        evidence: `${pendingCount} applications are currently in desk verification stage awaiting official signature and validation.`,
        actionProposal: 'Deploy AI batch verification to clear clean documents within 48 hours.',
        expectedOutcome: 'Zero delay in merit board publishing and direct benefit transfer activation.',
        confidenceScore: 95,
        approved: true,
      },
      {
        id: 'rec_dynamic_3',
        domain: 'Budget',
        priority: 'High Strategic',
        title: `Affirmative Quota Allocation Tracking (${femalePct}% Female ST Participation)`,
        evidence: `${femaleCount} of ${total} candidates (${femalePct}%) are female ST researchers in current preset cohort.`,
        actionProposal: 'Ensure minimum 30% quota preservation in first-tranche merit list publication.',
        expectedOutcome: 'Complete adherence to parliamentary gender equity mandates.',
        confidenceScore: 98,
        approved: false,
      },
    ];

    return list;
  }, [applications]);

  const [recommendations, setRecommendations] = useState<StrategicRecommendation[]>(dynamicRecommendations);

  // Sync when applications change
  React.useEffect(() => {
    setRecommendations(dynamicRecommendations);
  }, [dynamicRecommendations]);

  const toggleApproval = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>Policy Simulation & Decision Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Decision Support Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated statutory recommendations synthesized from active applicant cohorts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            {recommendations.filter((r) => r.approved).length} Decisions Ratified
          </span>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-800 flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900">
              Decision Engine Primed (0 Active Applications)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No false data loaded. Strategic proposals generate dynamically from ingested presets. Add a preset to activate decision support.
            </p>
          </div>
          {onOpenPresetModal && (
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-xs hover:from-emerald-500 hover:to-indigo-500 transition cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Presets to Run Decision Analysis</span>
            </button>
          )}
        </div>
      ) : (
        /* Recommendations List */
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-6 rounded-3xl border-2 transition shadow-sm space-y-4 ${
                rec.approved
                  ? 'bg-emerald-50/40 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-black text-[10px] uppercase">
                    {rec.domain}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] uppercase">
                    {rec.priority}
                  </span>
                </div>
                <div className="text-xs font-bold text-emerald-700">
                  AI Confidence: {rec.confidenceScore}%
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  <strong>Evidence:</strong> {rec.evidence}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  <strong>Proposal:</strong> {rec.actionProposal}
                </p>
                <p className="text-xs text-emerald-800 font-medium">
                  <strong>Expected Impact:</strong> {rec.expectedOutcome}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Status: <strong>{rec.approved ? 'Approved by Joint Secretary' : 'Pending Formal Sign-off'}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => toggleApproval(rec.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    rec.approved
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{rec.approved ? 'Revoke Approval' : 'Approve Strategic Proposal'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
