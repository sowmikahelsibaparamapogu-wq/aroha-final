import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  FileText,
  ThumbsUp
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface DecisionSupportCenterProps {
  applications?: Application[];
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

const INITIAL_RECOMMENDATIONS: StrategicRecommendation[] = [
  {
    id: 'rec_1',
    domain: 'Demand',
    priority: 'Immediate Action',
    title: 'Reallocate 12 Vacant NOS Post-Doc Slots to High-Scoring Ph.D. Applicants',
    evidence: 'Current cycle received only 8 Post-Doc applications against 20 reserved slots, while STEM Ph.D. overseas applications exceed capacity by 340%.',
    actionProposal: 'Authorize inter-program slot transfer under Clause 4.2 of NOS Guidelines to ensure 100% budget utilization before fiscal cut-off.',
    expectedOutcome: '12 deserving tribal scholars will receive full tuition funding at QS Top 100 universities.',
    confidenceScore: 96,
    approved: false,
  },
  {
    id: 'rec_2',
    domain: 'Risk',
    priority: 'High Strategic',
    title: 'Deploy Automated Revenue Record Match for 14 Flagged Bastar Certificates',
    evidence: 'AI OCR detected non-standard sub-divisional seals on caste certificates issued during 2021 pandemic period in Bastar district.',
    actionProposal: 'Trigger API batch inquiry to Chhattisgarh e-District state repository to validate serial numbers without placing burden on students.',
    expectedOutcome: 'Zero manual rejection of genuine tribal students living in deep forested zones.',
    confidenceScore: 94,
    approved: true,
  },
  {
    id: 'rec_3',
    domain: 'SLA',
    priority: 'Immediate Action',
    title: 'Rebalance Desk-IV Workload to Desk-II to Prevent Statutory SLA Default',
    evidence: 'Desk-IV officer currently holds 64 pending scrutiny files with 18 approaching the 15-day statutory notification deadline.',
    actionProposal: 'Auto-reassign 25 files to Desk-II which currently operates at 42% workload capacity.',
    expectedOutcome: '100% compliance with Citizens Charter SLA and zero pendency breach.',
    confidenceScore: 98,
    approved: false,
  },
  {
    id: 'rec_4',
    domain: 'Budget',
    priority: 'High Strategic',
    title: 'Pre-Authorize Q4 Contingency Grants Ahead of Annual Research Reviews',
    evidence: 'Laboratory supply costs for experimental science scholars have risen by 12%; delays in contingency disbursal stall bench experiments.',
    actionProposal: 'Release 50% advance tranche directly to scholar PFMS accounts upon supervisor bonafide upload.',
    expectedOutcome: 'Uninterrupted doctoral research across Indian Institutes of Science (IISc, IITs, Central Universities).',
    confidenceScore: 91,
    approved: false,
  },
];

export const DecisionSupportCenter: React.FC<DecisionSupportCenterProps> = () => {
  const [recommendations, setRecommendations] = useState<StrategicRecommendation[]>(INITIAL_RECOMMENDATIONS);

  const toggleApproval = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, approved: !rec.approved } : rec))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>Apex Policy Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Decision Matrix Center
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            {recommendations.filter((r) => r.approved).length} Decisions Ratified
          </span>
        </div>
      </div>

      {/* Decision Recommendations Matrix */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`bg-white rounded-3xl p-6 border transition shadow-sm ${
              rec.approved ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  rec.domain === 'Demand' ? 'bg-purple-100 text-purple-800' :
                  rec.domain === 'Risk' ? 'bg-rose-100 text-rose-800' :
                  rec.domain === 'SLA' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {rec.domain} Domain
                </span>

                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  rec.priority === 'Immediate Action'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {rec.priority}
                </span>

                <span className="text-xs text-slate-500 font-medium">
                  AI Confidence: <strong className="text-slate-800">{rec.confidenceScore}%</strong>
                </span>
              </div>

              {rec.approved ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved for Gazette Order</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleApproval(rec.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Ratify Policy Action</span>
                </button>
              )}
            </div>

            <h3 className="text-base font-bold font-roman text-slate-900 mb-2">
              {rec.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Empirical Evidence</span>
                <p className="text-slate-600">{rec.evidence}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Proposed Intervention</span>
                <p className="text-slate-600">{rec.actionProposal}</p>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">Projected National Impact</span>
                <p className="text-emerald-800">{rec.expectedOutcome}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
