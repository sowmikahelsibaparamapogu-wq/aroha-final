import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  BookOpen, 
  HelpCircle,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface CrossSchemeRecommenderProps {
  application?: Application;
  onApplyAlternative?: (schemeName: string) => void;
}

interface SchemeRecommendation {
  id: string;
  schemeName: string;
  matchScore: number;
  eligibilityVerdict: 'Highly Compatible' | 'Probable Match' | 'Conditional';
  keyBenefits: string[];
  whyRecommended: string;
  stQuotaStatus: string;
}

const STATIC_RECOMMENDATIONS: SchemeRecommendation[] = [
  {
    id: 'rec_nfst',
    schemeName: 'National Fellowship for Higher Education of ST Students (NFST)',
    matchScore: 98,
    eligibilityVerdict: 'Highly Compatible',
    keyBenefits: ['₹37,000/mo JRF + ₹42,000/mo SRF', '₹25,000/yr Contingency Grant', 'Zero Income Ceiling'],
    whyRecommended: 'Applicant possesses 74.5% in M.Sc. Biotechnology with valid ST Gond community certificate and UGC-NET qualification.',
    stQuotaStatus: 'Qualifies for 30% Women ST Parliamentary Quota',
  },
  {
    id: 'rec_nos',
    schemeName: 'National Overseas Scholarship for ST Candidates (NOS)',
    matchScore: 84,
    eligibilityVerdict: 'Probable Match',
    keyBenefits: ['100% Overseas Tuition Paid', '£9,900 / $15,400 Annual Maintenance', 'Return Airfare'],
    whyRecommended: 'Target university (Melbourne/Oxford) is in QS Top 500; requires un-conditional offer letter upload to finalize.',
    stQuotaStatus: 'Requires Family Income < ₹8,00,000 (Candidate is ₹3.4L - Eligible)',
  },
  {
    id: 'rec_icssr',
    schemeName: 'ICSSR Centrally Administered Doctoral Tribal Fellowship',
    matchScore: 91,
    eligibilityVerdict: 'Highly Compatible',
    keyBenefits: ['₹31,000/mo Fellowship for 2 Years', 'Contingency ₹20,000/yr', 'Special Ethnography Grants'],
    whyRecommended: 'Research on indigenous medicine and sacred grove botany aligns 100% with tribal ethnopharmacology priorities.',
    stQuotaStatus: 'Full Institutional ST Category Exemption',
  },
  {
    id: 'rec_state',
    schemeName: 'State Higher Education Tribal Research Fellowship (TG-TRF)',
    matchScore: 78,
    eligibilityVerdict: 'Conditional',
    keyBenefits: ['₹25,000/mo State Stipend', 'Local Tribal Museum Access', 'Immediate Direct Sanction'],
    whyRecommended: 'Candidate holds domicile certificate from Adilabad, Telangana, qualifying for state-level tribal development grants.',
    stQuotaStatus: 'State ST Reservation Category A',
  },
];

export const CrossSchemeRecommender: React.FC<CrossSchemeRecommenderProps> = ({
  application,
  onApplyAlternative,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Opportunity Matcher</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cross-Scheme Navigator
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            4 Tailored Pathways Found
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STATIC_RECOMMENDATIONS.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  rec.eligibilityVerdict === 'Highly Compatible'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {rec.eligibilityVerdict}
                </span>

                <div className="flex items-center gap-1 text-sm font-bold font-roman text-emerald-800">
                  <Percent className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{rec.matchScore}% Match Score</span>
                </div>
              </div>

              <h3 className="text-base font-bold font-roman text-slate-900 mb-2">
                {rec.schemeName}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
                {rec.whyRecommended}
              </p>

              {/* Key Benefits */}
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Entitlements & Stipends:
                </div>
                {rec.keyBenefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-800">
                {rec.stQuotaStatus}
              </span>
              <button
                type="button"
                onClick={() => onApplyAlternative?.(rec.schemeName)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Switch Scheme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
