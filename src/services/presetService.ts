import { Application, SchemeType, SchemeRuleConfig } from '../types/scholarship';
import { SEEDED_APPLICATIONS } from './mockData';
import { evaluateApplication } from './ruleEngine';

export interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  category: string;
  description: string;
  parameters: {
    incomeCeiling: number;
    marksThreshold: number;
    totalSlots: number;
    femaleQuota: number;
  };
  additionalApplications: Application[];
  keyHighlights: string[];
}

// 1. Initial Baseline Applications (Intake state BEFORE preset upload: un-evaluated / pending)
export const BASELINE_APPLICATIONS: Application[] = [
  {
    ...SEEDED_APPLICATIONS[0],
    id: 'app_nfst_001',
    status: 'submitted',
    aiAnalysis: {
      ...SEEDED_APPLICATIONS[0].aiAnalysis,
      eligibilityPassed: false,
      requiresHumanReview: true,
      flags: ['Intake Stage: Awaiting Preset Upload & Statutory Rule Execution'],
      riskScore: 'Low',
      meritScore: 0,
      summary: 'Dossier in baseline intake queue. Awaiting preset upload to execute statutory evaluation and scoring.',
    },
    scrutiny: undefined,
    dbtDisbursements: [],
  },
  {
    ...SEEDED_APPLICATIONS[1],
    id: 'app_nos_002',
    status: 'submitted',
    aiAnalysis: {
      ...SEEDED_APPLICATIONS[1].aiAnalysis,
      eligibilityPassed: false,
      requiresHumanReview: true,
      flags: ['Intake Stage: Awaiting Preset Upload & Statutory Rule Execution'],
      riskScore: 'Low',
      meritScore: 0,
      summary: 'Dossier in baseline intake queue. Awaiting preset upload to execute statutory evaluation and scoring.',
    },
    scrutiny: undefined,
  },
];

// 2. Pending Ingestion Applications (NOT added before preset upload, added upon preset upload!)
export const PENDING_INGESTION_APPLICATIONS: Application[] = SEEDED_APPLICATIONS.slice(2);

// Additional high-impact candidates for presets
export const EXTRA_PVTG_APPLICATIONS: Application[] = [
  {
    id: 'app_nfst_007',
    applicationNumber: 'NFST/2025/1492',
    scheme: 'NFST',
    submittedAt: '2025-08-16T10:00:00Z',
    updatedAt: '2025-08-16T10:00:00Z',
    status: 'submitted',
    applicant: {
      fullName: 'Lingamaiah Chenchu',
      fatherName: 'Guruvaiah Chenchu',
      motherName: 'Venkatamma Chenchu',
      gender: 'Male',
      dob: '1997-05-14',
      aadhaarNumber: 'XXXX-XXXX-7123',
      mobile: '+91 94401 23456',
      email: 'lingamaiah.chenchu@anu.edu.in',
      stCommunity: 'Chenchu (PVTG)',
      state: 'Andhra Pradesh',
      district: 'Prakasam',
      pincode: '523315',
      domicileState: 'Andhra Pradesh',
      annualFamilyIncome: 180000,
      parentOccupation: 'Minor Forest Produce Gatherer',
    },
    academic: {
      qualifyingDegree: 'M.Sc. in Botany',
      qualifyingPercentage: 73.2,
      passingYear: 2024,
      institutionName: 'Acharya Nagarjuna University, Guntur',
      targetProgram: 'Ph.D',
      specialization: 'Medicinal Flora of Nallamala Forest (PVTG Habitat)',
      researchTopic: 'Ethnobotanical documentation of rare medicinal plants used by Chenchu PVTG elders',
      ugcNetRollNo: 'AP01004921',
      ugcNetScore: 92.5,
      ugcNetYear: '2024',
      isJrfQualified: true,
    },
    bankDetails: {
      accountHolderName: 'Lingamaiah Chenchu',
      accountNumber: '49102910492',
      ifscCode: 'SBIN0002781',
      bankName: 'State Bank of India',
      branchName: 'Dornala Tribal Branch',
      isAadhaarSeeded: true,
    },
    documents: [
      {
        id: 'doc_chenchu_caste',
        type: 'caste_certificate',
        name: 'Chenchu_PVTG_Certificate.pdf',
        size: 780000,
        uploadedAt: '2025-08-16T10:02:00Z',
        ocrStatus: 'verified',
        ocrConfidence: 98,
        extractedFields: {
          'Name': 'Lingamaiah Chenchu',
          'Community': 'Chenchu (Particularly Vulnerable Tribal Group)',
          'Authority': 'Sub-Collector Markapur',
        },
      },
    ],
    aiAnalysis: {
      overallConfidence: 96,
      eligibilityPassed: true,
      requiresHumanReview: false,
      flags: ['Affirmative Priority: Particularly Vulnerable Tribal Group (PVTG)'],
      riskScore: 'Low',
      meritScore: 94,
      verifiedFieldsCount: 16,
      totalFieldsCount: 16,
      summary: 'Verified PVTG candidate with high research relevance to indigenous botanical conservation.',
    },
    deficiencies: [],
  },
  {
    id: 'app_nfst_008',
    applicationNumber: 'NFST/2025/1830',
    scheme: 'NFST',
    submittedAt: '2025-08-16T11:30:00Z',
    updatedAt: '2025-08-16T11:30:00Z',
    status: 'submitted',
    applicant: {
      fullName: 'Devika Gond',
      fatherName: 'Shambhu Gond',
      motherName: 'Kamla Gond',
      gender: 'Female',
      dob: '1998-10-21',
      aadhaarNumber: 'XXXX-XXXX-9932',
      mobile: '+91 97551 88412',
      email: 'devika.gond@bhu.ac.in',
      stCommunity: 'Gond',
      state: 'Madhya Pradesh',
      district: 'Dindori',
      pincode: '481880',
      domicileState: 'Madhya Pradesh',
      annualFamilyIncome: 240000,
      parentOccupation: 'Gond Art Artisan & Agriculture',
    },
    academic: {
      qualifyingDegree: 'M.A. in Indigenous History',
      qualifyingPercentage: 76.8,
      passingYear: 2024,
      institutionName: 'Banaras Hindu University (BHU)',
      targetProgram: 'Ph.D',
      specialization: 'Central Indian Tribal Rebellions & Oral Epics',
      researchTopic: 'Preservation of oral narrative traditions among Gond tribal bards (Pradhans)',
      ugcNetRollNo: 'MP03001844',
      ugcNetScore: 96.2,
      ugcNetYear: '2024',
      isJrfQualified: true,
    },
    bankDetails: {
      accountHolderName: 'Devika Gond',
      accountNumber: '58192019482',
      ifscCode: 'UBIN0531201',
      bankName: 'Union Bank of India',
      branchName: 'Dindori Branch',
      isAadhaarSeeded: true,
    },
    documents: [],
    aiAnalysis: {
      overallConfidence: 97,
      eligibilityPassed: true,
      requiresHumanReview: false,
      flags: ['Affirmative Priority: Female ST Researcher in Humanities'],
      riskScore: 'Low',
      meritScore: 95,
      verifiedFieldsCount: 16,
      totalFieldsCount: 16,
      summary: 'Distinguished female researcher in indigenous oral history. High UGC-NET score (96.2%).',
    },
    deficiencies: [],
  },
];

// Curated Preset Scenarios to upload/apply
export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'preset_national_saturation_2026',
    name: 'MoTA National Saturation Cohort 2026',
    badge: 'National Full Intake',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    category: 'National Cohort Ingestion',
    description: 'Ingests all pending candidate dossiers across Telangana, Jharkhand, Meghalaya, Rajasthan, and Chhattisgarh. Runs statutory rule verification and updates all 4 portals and tabs.',
    parameters: {
      incomeCeiling: 800000,
      marksThreshold: 55,
      totalSlots: 750,
      femaleQuota: 30,
    },
    additionalApplications: PENDING_INGESTION_APPLICATIONS,
    keyHighlights: [
      'Ingests 4+ pending applications into live pipeline',
      'Executes AI OCR discrepancy checks & statutory eligibility',
      'Generates live National Merit Gazette with 30% female quota',
      'Calculates ₹44.2 Cr projected budget allocation radar',
    ],
  },
  {
    id: 'preset_pvtg_affirmative_boost',
    name: 'PVTG Fast-Track & Vulnerable Tribes Quota',
    badge: 'Affirmative Action',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-300',
    category: 'Vulnerable Groups Priority',
    description: 'Ingests Particularly Vulnerable Tribal Group (PVTG) scholars (Chenchu, Birhor, Baiga), increases income ceiling to ₹10 Lakhs, and expands female reservation to 35%.',
    parameters: {
      incomeCeiling: 1000000,
      marksThreshold: 50,
      totalSlots: 850,
      femaleQuota: 35,
    },
    additionalApplications: [...PENDING_INGESTION_APPLICATIONS, ...EXTRA_PVTG_APPLICATIONS],
    keyHighlights: [
      'Ingests 6 new applications including PVTG Chenchu & Gond scholars',
      'Expands statutory income ceiling to ₹10,00,000 for vulnerable forest tribes',
      'Elevates female quota from 30% to 35% in merit selection',
      'Updates all tabs: GIS Map clusters, Scrutiny Queue, and Executive Insights',
    ],
  },
  {
    id: 'preset_strict_merit_integrity',
    name: 'Strict Academic Cutoff & High-Integrity Sentinel',
    badge: 'Merit Excellence',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    category: 'Strict Cutoff & Fraud Audit',
    description: 'Applies rigorous 65% qualifying marks threshold, flags all borderline income declarations, and initiates deep forensic audits across candidate certificates.',
    parameters: {
      incomeCeiling: 600000,
      marksThreshold: 65,
      totalSlots: 500,
      femaleQuota: 30,
    },
    additionalApplications: PENDING_INGESTION_APPLICATIONS,
    keyHighlights: [
      'Ingests pending applications and enforces 65% academic cutoff',
      'Flags document discrepancies into Deficiencies and Rejections Desks',
      'Activates Fraud Sentinel anomaly radar across all state clusters',
      'Recalculates merit leaderboards with heightened competitive standards',
    ],
  },
];

// Helper to evaluate a full dataset with given parameters
export function evaluateAllWithPreset(
  applications: Application[],
  params: {
    incomeCeiling: number;
    marksThreshold: number;
    totalSlots: number;
    femaleQuota: number;
  },
  rules: Record<SchemeType, SchemeRuleConfig>
): {
  updatedRules: Record<SchemeType, SchemeRuleConfig>;
  evaluatedApplications: Application[];
} {
  const updatedRules: Record<SchemeType, SchemeRuleConfig> = {
    ...rules,
    NFST: {
      ...rules.NFST,
      maxSlots: params.totalSlots,
      femaleReservationPercent: params.femaleQuota,
      eligibility: {
        ...rules.NFST.eligibility,
        minQualifyingPercentage: params.marksThreshold,
        maxIncomeLimit: params.incomeCeiling,
      },
    },
    NOS: {
      ...rules.NOS,
      femaleReservationPercent: params.femaleQuota,
      eligibility: {
        ...rules.NOS.eligibility,
        minQualifyingPercentage: params.marksThreshold,
        maxIncomeLimit: params.incomeCeiling,
      },
    },
  };

  const evaluatedApplications = applications.map((app) => {
    const schemeRule = updatedRules[app.scheme || 'NFST'];
    const evalResult = evaluateApplication(app, schemeRule);

    let status = app.status;
    if (app.id === 'app_nfst_001') {
      status = 'dbt_active';
    } else if (app.id === 'app_nos_002') {
      status = 'merit_listed';
    } else if (app.id === 'app_nos_006') {
      status = 'approved';
    } else if (evalResult.passed) {
      status = status === 'submitted' ? 'in_scrutiny' : status;
    } else {
      status = 'flagged_deficiency';
    }

    return {
      ...app,
      status,
      aiAnalysis: {
        ...app.aiAnalysis,
        eligibilityPassed: evalResult.passed,
        flags: evalResult.flags,
        riskScore: evalResult.riskScore,
        meritScore: evalResult.meritScore,
        overallConfidence: evalResult.overallConfidence,
      },
      updatedAt: new Date().toISOString(),
    };
  });

  return { updatedRules, evaluatedApplications };
}
