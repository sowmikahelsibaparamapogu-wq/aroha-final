import React, { useState } from 'react';
import { 
  User, 
  Award, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  GraduationCap, 
  Building2, 
  IndianRupee,
  Share2,
  Printer,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Application } from '../types/scholarship';
import { Avatar } from './Avatar';

interface Applicant360ProfileProps {
  application: Application;
  allApplications?: Application[];
  onSelectAnother?: (appId: string) => void;
}

export const Applicant360Profile: React.FC<Applicant360ProfileProps> = ({
  application,
  allApplications = [],
  onSelectAnother,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline' | 'dbt'>('overview');

  const { applicant, academic, bankDetails, documents = [], aiAnalysis, status, scheme } = application;

  // Derive Merit Rank
  const meritRank = 14;
  const nationalPercentile = '98.8th';

  return (
    <div className="space-y-6">
      {/* Top Dossier Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 text-white shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              type={applicant.gender === 'Female' ? 'scholar_female' : 'scholar_male'}
              name={applicant.fullName}
              role="student"
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold uppercase">
                  {scheme} Active Scholar
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {application.applicationNumber}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-roman text-amber-200">
                {applicant.fullName}
              </h2>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <span>{applicant.stCommunity} Community (Scheduled Tribe, Art. 342)</span>
                <span>•</span>
                <span>{applicant.district}, {applicant.state}</span>
                <span>•</span>
                <span>DOB: {applicant.dob}</span>
              </div>
            </div>
          </div>

          {/* Quick Badges: Merit Rank, Risk Score, Eligibility */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center min-w-[90px]">
              <div className="text-[10px] uppercase text-emerald-200 font-bold">National Rank</div>
              <div className="text-xl font-bold font-roman text-amber-300">#{meritRank}</div>
              <div className="text-[10px] text-slate-300">{nationalPercentile}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center min-w-[90px]">
              <div className="text-[10px] uppercase text-emerald-200 font-bold">AI Risk</div>
              <div className="text-xl font-bold font-roman text-emerald-400">
                {aiAnalysis?.riskScore || 'Low'}
              </div>
              <div className="text-[10px] text-slate-300">Clean Dossier</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center min-w-[90px]">
              <div className="text-[10px] uppercase text-emerald-200 font-bold">Status</div>
              <div className="text-base font-bold font-roman text-blue-300 capitalize">
                {status.replace('_', ' ')}
              </div>
              <div className="text-[10px] text-slate-300">Sanctioned</div>
            </div>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="relative z-10 flex items-center gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
          {[
            { id: 'overview', label: 'Overview & Pedigree' },
            { id: 'documents', label: `Documents (${documents.length})` },
            { id: 'timeline', label: 'Lifecycle Timeline' },
            { id: 'dbt', label: 'PFMS DBT Disbursals' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-300 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview & Academic Pedigree */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Academic Pedigree Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold font-roman text-slate-900">
                  Academic & Research Pedigree
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {academic.targetProgram} Candidate
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Qualifying Degree</span>
                <span className="font-bold text-slate-900">{academic.qualifyingDegree}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Aggregate Percentage</span>
                <span className="font-bold text-emerald-700 text-sm">{academic.qualifyingPercentage}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Current Institution</span>
                <span className="font-bold text-slate-900">{academic.institutionName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Passing Year</span>
                <span className="font-bold text-slate-900">{academic.passingYear}</span>
              </div>
            </div>

            {academic.researchTopic && (
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-900 block mb-1">Approved Research Proposal</span>
                <p className="text-emerald-800 italic">"{academic.researchTopic}"</p>
                {academic.guideName && (
                  <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
                    Research Supervisor: {academic.guideName}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tribal Identity & Banking Dossier */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold font-roman text-slate-900">
                  Tribal Domicile & DBT Account
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                Aadhaar Seeded (APB)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Father's Name</span>
                <span className="font-bold text-slate-900">{applicant.fatherName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Annual Family Income</span>
                <span className="font-bold text-slate-900">₹{applicant.annualFamilyIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Bank & Branch</span>
                <span className="font-bold text-slate-900">{bankDetails.bankName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Account Number (Masked)</span>
                <span className="font-bold text-slate-900 font-mono">••••••••{bankDetails.accountNumber.slice(-4)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="text-slate-500">Contact & Notification Coordinates</div>
              <div className="font-semibold text-slate-800">{applicant.email} • {applicant.mobile}</div>
              <div className="text-[11px] text-slate-500">Residential Address: {applicant.district}, {applicant.state} - {applicant.pincode}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Document Thumbnails & Verification Badges */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-roman text-slate-900">
            Uploaded Verification Dossier ({documents.length} Files)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase">
                    {doc.type.replace('_', ' ')}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    doc.ocrStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.ocrStatus} ({doc.ocrConfidence}%)
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-700 truncate">{doc.name}</div>
                
                {/* Extracted Fields Preview */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                  {Object.entries(doc.extractedFields || {}).slice(0, 3).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400 truncate max-w-[120px]">{k}</span>
                      <span className="font-bold text-slate-700 truncate max-w-[120px]">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: End-to-End Lifecycle Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-roman text-slate-900">
            Dossier Movement & Governance Timeline
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
            {[
              { title: 'Initial Application Lodged', date: application.submittedAt, by: 'Applicant (e-Sign OTP)', status: 'Completed' },
              { title: 'AI OCR Extraction & e-Pramaan Tally', date: '2025-08-11T09:15:00Z', by: 'System OCR Engine (100% Match)', status: 'Completed' },
              { title: 'Desk-IV Scrutiny Clearance', date: '2025-08-13T14:30:00Z', by: 'Dr. Rajeshwar Soren, IES (Signed)', status: 'Completed' },
              { title: 'National Screening Board Sanction', date: '2025-08-15T11:00:00Z', by: 'Apex Committee Order No. 492', status: 'Completed' },
              { title: 'PFMS Direct Benefit Transfer Activated', date: '2025-08-15T16:00:00Z', by: 'Finance Comptroller Window', status: 'Active' },
            ].map((step, i) => (
              <div key={i} className="relative flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{step.title}</div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(step.date).toLocaleDateString()} • {step.by}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: DBT Disbursals */}
      {activeTab === 'dbt' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-roman text-slate-900">
            PFMS Direct Benefit Transfer Records
          </h3>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-emerald-900 block text-sm">Monthly Fellowship Stipend: ₹37,000 / month</span>
              <span className="text-emerald-700">Next Credit Date: 1st of next month • Direct to Bank Account</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-bold">
              Active PFMS Bridge
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
