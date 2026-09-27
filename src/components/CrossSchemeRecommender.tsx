import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  BookOpen, 
  HelpCircle,
  TrendingUp,
  Percent,
  User,
  ShieldCheck,
  AlertTriangle,
  Building,
  GraduationCap
} from 'lucide-react';
import { Application } from '../types/scholarship';
import { Avatar } from './Avatar';

interface CrossSchemeRecommenderProps {
  application?: Application;
  allApplications?: Application[];
  onSelectApplication?: (appId: string) => void;
  onApplyAlternative?: (schemeName: string) => void;
}

export interface DynamicSchemeRecommendation {
  id: string;
  schemeName: string;
  schemeCode: string;
  matchScore: number;
  eligibilityVerdict: 'Highly Compatible' | 'Probable Match' | 'Conditional' | 'Borderline';
  verdictColor: string;
  keyBenefits: string[];
  whyRecommended: string;
  stQuotaStatus: string;
  requirementsSummary: string;
}

export const CrossSchemeRecommender: React.FC<CrossSchemeRecommenderProps> = ({
  application,
  allApplications = [],
  onSelectApplication,
  onApplyAlternative,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(() => {
    return application?.id || allApplications[0]?.id || '';
  });

  // Keep selected candidate in sync when application prop changes
  React.useEffect(() => {
    if (application?.id) {
      setSelectedAppId(application.id);
    }
  }, [application?.id]);

  const activeApp = useMemo(() => {
    return allApplications.find((a) => a.id === selectedAppId) || application || allApplications[0];
  }, [allApplications, selectedAppId, application]);

  // Dynamically compute customized recommendations for this specific candidate
  const recommendations: DynamicSchemeRecommendation[] = useMemo(() => {
    if (!activeApp) return [];

    const name = activeApp.applicant?.fullName || 'Candidate';
    const marks = activeApp.academic?.qualifyingPercentage || 60;
    const degree = activeApp.academic?.qualifyingDegree || "Master's Degree";
    const tribe = activeApp.applicant?.stCommunity || 'Scheduled Tribe';
    const income = activeApp.applicant?.annualFamilyIncome || 350000;
    const state = activeApp.applicant?.state || activeApp.applicant?.domicileState || 'India';
    const isFemale = activeApp.applicant?.gender?.toLowerCase() === 'female';
    const isJrf = !!activeApp.academic?.isJrfQualified;
    const netScore = activeApp.academic?.ugcNetScore || 0;
    const isPvtg = tribe.toLowerCase().includes('pvtg') || 
                   ['chenchu', 'birhor', 'baiga', 'maria gond', 'toda', 'saharia', 'katkari', 'korwa'].some(t => tribe.toLowerCase().includes(t));
    const isStem = /science|biotech|metallurg|engineer|botan|physics|chemist|medic|technol/i.test(degree);
    const isSocialHumanities = /linguistic|history|sociolog|anthropolog|lore|art|tribal|econom/i.test(degree);
    const qsRank = activeApp.academic?.qsWorldRanking;
    const offerType = activeApp.academic?.offerStatus;

    const recs: DynamicSchemeRecommendation[] = [];

    const isCriticallyDeficient = (activeApp.deficiencies || []).some(d => d.severity === 'critical');
    const hasCutoffDeficiency = (activeApp.deficiencies || []).some(d => d.field === 'qualifyingPercentage');

    // 1. National Fellowship for ST Students (NFST - Ph.D in India)
    {
      const minCutoff = 55.0;
      let score = 0;

      // ST Community Credential (25 pts)
      const isST = tribe && !tribe.toLowerCase().includes('obc') && !tribe.toLowerCase().includes('general');
      const hasCasteDiscrepancy = (activeApp.documents || []).some(d => d.type === 'caste_certificate' && (d.ocrStatus === 'mismatch' || (d.mismatches && d.mismatches.length > 0)));
      if (isST && !hasCasteDiscrepancy) score += 25;
      else if (isST) score += 10;
      else score += 0;

      // Academic marks relative to 55% cutoff (up to 45 pts)
      if (marks >= minCutoff) {
        // Scaled from 55% to 95%
        const marksBonus = Math.min(25, Math.round(((marks - minCutoff) / 40) * 25));
        score += (20 + marksBonus);
      } else {
        // Severe deduction for failing statutory cutoff
        const deficit = minCutoff - marks;
        score += Math.max(2, Math.round(15 - deficit * 2));
      }

      // UGC-NET / CSIR-NET / JRF (15 pts)
      if (isJrf) score += 15;
      else if (netScore > 80) score += 10;
      else if (netScore > 50) score += 6;
      else score += 2;

      // Affirmative Quotas: Women ST 30% quota / PVTG priority (10 pts)
      if (isFemale) score += 5;
      if (isPvtg) score += 5;

      // Clean Dossier Bonus (5 pts)
      if (!isCriticallyDeficient && !hasCutoffDeficiency) score += 5;

      score = Math.max(12, Math.min(100, Math.round(score)));

      const verdict = score >= 88 ? 'Highly Compatible' : score >= 70 ? 'Probable Match' : score >= 50 ? 'Conditional' : 'Borderline';
      recs.push({
        id: 'rec_nfst',
        schemeName: 'National Fellowship for Higher Education of ST Students (NFST)',
        schemeCode: 'MoTA-NFST-2025-26',
        matchScore: score,
        eligibilityVerdict: verdict,
        verdictColor: verdict === 'Highly Compatible' ? 'bg-emerald-100 text-emerald-800' : verdict === 'Probable Match' ? 'bg-blue-100 text-blue-800' : verdict === 'Conditional' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800',
        keyBenefits: [
          '₹37,000/mo JRF (Y1-2) + ₹42,000/mo SRF (Y3-5)',
          '₹20,500 to ₹25,000/yr Annual Contingency Grant',
          'Zero Family Income Ceiling (Open to all ST incomes)',
          'Monthly PFMS Direct Benefit Transfer'
        ],
        whyRecommended: `${name} has ${marks}% marks in ${degree} with verified ${tribe} community credential. ${marks < minCutoff ? `Notice: Current ${marks}% is below the statutory 55.0% threshold.` : isJrf ? `Candidate holds valid UGC-NET JRF qualification.` : netScore ? `UGC-NET percentile is ${netScore}.` : 'Candidate qualifies under standard academic criteria.'}`,
        stQuotaStatus: isFemale 
          ? 'Qualifies for 30% Women ST Parliamentary Quota (225 slots reserved)'
          : isPvtg ? 'Affirmative PVTG Priority Candidate (+5 merit bonus)' : 'Open Category ST Fellowship Roster (750 National Slots)',
        requirementsSummary: `Minimum 55% qualifying degree score (Candidate: ${marks}%), valid ST caste certificate, and enrollment in Indian University Ph.D program.`
      });
    }

    // 2. National Overseas Scholarship for ST Candidates (NOS - Top 500 Abroad)
    {
      const incomeCeiling = 800000;
      const incomePass = income <= incomeCeiling;
      let score = 0;

      // Income Check (35 pts)
      if (incomePass) {
        const incomeMargin = (incomeCeiling - income) / incomeCeiling;
        score += Math.round(20 + incomeMargin * 15);
      } else {
        // Exceeding income limit gives 0 pts on income criteria
        score += 0;
      }

      // Foreign University QS Ranking (30 pts)
      if (qsRank && qsRank <= 100) score += 30;
      else if (qsRank && qsRank <= 300) score += 24;
      else if (qsRank && qsRank <= 500) score += 18;
      else if (qsRank) score += 6;
      else score += 5; // Open pool

      // Academic marks (20 pts)
      if (marks >= 60) score += Math.min(20, Math.round(12 + ((marks - 60) / 40) * 8));
      else score += Math.max(2, Math.round(10 - (60 - marks) * 1.5));

      // ST credential (15 pts)
      const hasCasteIssue = (activeApp.documents || []).some(d => d.type === 'caste_certificate' && d.ocrStatus === 'mismatch');
      if (!hasCasteIssue) score += 15;
      else score += 4;

      score = Math.max(10, Math.min(100, Math.round(score)));

      const verdict = (!incomePass) ? 'Conditional' : score >= 85 ? 'Highly Compatible' : score >= 65 ? 'Probable Match' : 'Borderline';
      const formattedIncome = (income / 100000).toFixed(2);
      
      recs.push({
        id: 'rec_nos',
        schemeName: 'National Overseas Scholarship for ST Candidates (NOS)',
        schemeCode: 'MoTA-NOS-2025-26',
        matchScore: score,
        eligibilityVerdict: verdict,
        verdictColor: verdict === 'Highly Compatible' ? 'bg-emerald-100 text-emerald-800' : verdict === 'Probable Match' ? 'bg-blue-100 text-blue-800' : verdict === 'Conditional' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800',
        keyBenefits: [
          '100% Full International University Tuition Paid Directly',
          '£9,900 / year (UK) or $15,400 / year (USA & other countries) Maintenance Allowance',
          'Return International Economy Airfare & Visa Application Fees',
          'Health Insurance & Incidental Travel Allowances'
        ],
        whyRecommended: `${name} (${tribe}) reports annual family income of ₹${formattedIncome} Lakhs ${incomePass ? `(comfortably below the statutory ₹8.00L ceiling)` : `(exceeds the ₹8.00L ceiling; ineligibility flag)`}. ${qsRank ? `Target institution ranked QS #${qsRank}.` : 'Open for Master’s/Ph.D at Top 500 QS institutions worldwide.'}`,
        stQuotaStatus: incomePass 
          ? `Meets Statutory Income Ceiling (₹${formattedIncome}L ≤ ₹8.0L)`
          : `Requires Income Revision (Current ₹${formattedIncome}L > ₹8.0L)`,
        requirementsSummary: 'Top 500 QS foreign university admission, age under 35 years, annual family income below ₹8.00 Lakh.'
      });
    }

    // 3. Specialized Fellowship based on Academic Discipline (STEM vs Humanities)
    if (isStem) {
      const stemScore = Math.max(15, Math.min(98, Math.round(
        35 + (marks >= 70 ? 30 : marks >= 60 ? 20 : 8) + (isJrf ? 15 : 8) + (isFemale ? 5 : 0) + (isPvtg ? 8 : 4)
      )));
      recs.push({
        id: 'rec_stem_tribal',
        schemeName: 'DST-INSPIRE / CSIR Tribal Science & Technology Fellowship',
        schemeCode: 'DST-TRIBAL-STEM-2025',
        matchScore: stemScore,
        eligibilityVerdict: stemScore >= 85 ? 'Highly Compatible' : stemScore >= 65 ? 'Probable Match' : 'Conditional',
        verdictColor: stemScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800',
        keyBenefits: [
          '₹35,000/mo Fellowship + HRA for 5 years',
          '₹20,000/yr Equipment and Consumables Support',
          'Direct Access to CSIR and National Laboratories',
          'Special Innovation Grant for Indigenous Bio-resources'
        ],
        whyRecommended: `${name} is specializing in ${degree}, directly aligning with National Science & Technology indigenous biodiversity documentation priorities.`,
        stQuotaStatus: 'Full Category Exemption & Institutional Science Quota',
        requirementsSummary: 'M.Sc/B.Tech in STEM branch with ≥ 65% aggregate and research proposal on science & technology development.'
      });
    } else {
      const socScore = Math.max(15, Math.min(98, Math.round(
        35 + (marks >= 65 ? 30 : marks >= 55 ? 20 : 8) + (netScore > 80 ? 15 : 8) + (isFemale ? 5 : 0) + (isPvtg ? 8 : 4)
      )));
      recs.push({
        id: 'rec_icssr',
        schemeName: 'ICSSR Centrally Administered Doctoral Tribal Fellowship',
        schemeCode: 'ICSSR-TRIBAL-DOC-2025',
        matchScore: socScore,
        eligibilityVerdict: socScore >= 85 ? 'Highly Compatible' : socScore >= 65 ? 'Probable Match' : 'Conditional',
        verdictColor: socScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800',
        keyBenefits: [
          '₹31,000/mo Doctoral Stipend for 2 Years',
          '₹20,000/yr Fieldwork & Ethnography Contingency Grant',
          'Archival Research Grants at Indira Gandhi National Centre for Arts (IGNCA)',
          'Monograph & Publication Subsidies'
        ],
        whyRecommended: `${name}'s research in ${degree} deeply intersects with tribal folklore, oral literature, and linguistic heritage of the ${tribe} community.`,
        stQuotaStatus: '100% Institutional ST Reservation & Ethnography Priority',
        requirementsSummary: 'Post-graduate degree in Social Sciences, Humanities, or Linguistics with enrolled Ph.D thesis topic.'
      });
    }

    // 4. State-Level Domicile Fellowship (Customized to Candidate's State)
    {
      const stateSchemeName = 
        state.toLowerCase().includes('telangana') ? 'Telangana State Tribal Research & Higher Education Fellowship (TG-TRF)' :
        state.toLowerCase().includes('jharkhand') ? 'Jharkhand Marang Gomke Jaipal Singh Munda Tribal Fellowship' :
        state.toLowerCase().includes('meghalaya') ? 'Meghalaya Tribal Research & Higher Education Grant' :
        state.toLowerCase().includes('odisha') ? 'Odisha ST-SC Development Higher Education Research Fellowship' :
        state.toLowerCase().includes('madhya') ? 'Madhya Pradesh Janjatiya Shodh Evam Vikas Fellowship' :
        `${state} State Higher Education Scheduled Tribe Fellowship`;

      const stateScore = Math.max(15, Math.min(97, Math.round(
        35 + (marks >= 60 ? 35 : marks >= 50 ? 20 : 5) + (income <= 600000 ? 20 : 10) + (isFemale ? 5 : 0)
      )));

      recs.push({
        id: 'rec_state_domicile',
        schemeName: stateSchemeName,
        schemeCode: `STATE-${state.toUpperCase().replace(/\s+/g, '-').slice(0, 10)}-2025`,
        matchScore: stateScore,
        eligibilityVerdict: stateScore >= 85 ? 'Highly Compatible' : stateScore >= 65 ? 'Probable Match' : 'Conditional',
        verdictColor: stateScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800',
        keyBenefits: [
          '₹25,000 to ₹30,000/mo State Direct Benefit Stipend',
          'Local State Tribal Research Institute (TRI) Library & Field Facility',
          'Immediate State DBT Clearance via Integrated Beneficiary Register',
          'Priority Sanction for Native Domicile Scholars'
        ],
        whyRecommended: `${name} holds verified resident domicile in ${state} belonging to ${tribe} tribe, fully meeting State Tribal Welfare Directorate criteria.`,
        stQuotaStatus: `State ST Domicile Category A (${state})`,
        requirementsSummary: `Valid Domicile Certificate of ${state} and recognized ST caste certification.`
      });
    }

    // 5. PVTG Affirmative Priority Track if applicable
    if (isPvtg) {
      recs.push({
        id: 'rec_pvtg_fasttrack',
        schemeName: 'PVTG Mission Accelerated Doctoral & Professional Grant',
        schemeCode: 'PM-JANMAN-PVTG-2025',
        matchScore: 99,
        eligibilityVerdict: 'Highly Compatible',
        verdictColor: 'bg-purple-100 text-purple-800',
        keyBenefits: [
          'Full Fellowship Coverage + Double Contingency Grant',
          'Zero Cutoff Disqualification Margin for Certified PVTG Elders/Scholars',
          'Laptops, Field GPS & Audio-Visual Recording Grants Provided',
          'Guaranteed Research Placement at National Tribal Universities'
        ],
        whyRecommended: `${name} is an active member of the ${tribe} community (Particularly Vulnerable Tribal Group), entitled to non-competitive affirmative saturation funding under PM-JANMAN guidelines.`,
        stQuotaStatus: 'Highest Affirmative Priority: Particularly Vulnerable Tribal Group (PVTG)',
        requirementsSummary: 'Competent Authority PVTG certificate under Article 342.'
      });
    }

    return recs;
  }, [activeApp]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Candidate Indicator */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-indigo-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Multi-Scheme Compatibility Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Cross-Scheme Navigator & Opportunity Matcher
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Evaluates candidate qualifications across Central & State ST schemes to prevent missed entitlements.
          </p>
        </div>

        {/* Candidate Selector for Testing Multiple Students */}
        {allApplications.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <User className="w-4 h-4 text-slate-500 ml-1" />
            <select
              value={selectedAppId}
              onChange={(e) => {
                setSelectedAppId(e.target.value);
                onSelectApplication?.(e.target.value);
              }}
              className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Select candidate to view personalized recommendations"
            >
              {allApplications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.applicant.fullName} ({app.academic.qualifyingPercentage}%, {app.applicant.stCommunity})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Candidate Profile Dossier Strip */}
      {activeApp && (
        <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-emerald-50 rounded-2xl p-4 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Avatar
              type={activeApp.applicant.gender === 'female' ? 'scholar_female' : 'scholar_male'}
              name={activeApp.applicant.fullName}
              role="applicant"
              size="sm"
            />
            <div>
              <div className="font-black text-slate-900 text-sm">{activeApp.applicant.fullName}</div>
              <div className="text-[11px] text-slate-500">
                {activeApp.applicant.stCommunity} Tribe • {activeApp.applicant.state} • Income: ₹{Number(activeApp.applicant.annualFamilyIncome).toLocaleString('en-IN')}/yr
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-xl bg-white border border-indigo-200 font-bold text-indigo-900 shadow-2xs">
              🎓 Qualifying Score: {activeApp.academic.qualifyingPercentage}%
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 font-bold text-emerald-900 shadow-2xs">
              📜 Degree: {activeApp.academic.qualifyingDegree}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-2xs">
              📂 Current Scheme: {activeApp.scheme}
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Recommendation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${rec.verdictColor}`}>
                  {rec.eligibilityVerdict}
                </span>

                <div className="flex items-center gap-1 text-sm font-extrabold text-indigo-900">
                  <Percent className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{rec.matchScore}% Match Score</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {rec.schemeName}
              </h3>
              <div className="text-[10px] font-mono font-bold text-slate-400 mb-2">
                {rec.schemeCode}
              </div>

              {/* Personalized AI Explanation */}
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3 font-medium">
                {rec.whyRecommended}
              </p>

              {/* Requirements & Baseline */}
              <div className="text-[11px] text-slate-500 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/60 mb-3">
                <span className="font-bold text-indigo-950">Statutory Benchmark: </span>
                <span>{rec.requirementsSummary}</span>
              </div>

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

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-indigo-950 truncate max-w-[210px]">
                {rec.stQuotaStatus}
              </span>
              <button
                type="button"
                onClick={() => onApplyAlternative?.(rec.schemeName)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
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
