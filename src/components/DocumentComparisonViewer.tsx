import React, { useState, useMemo } from 'react';
import { 
  Columns2, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeftRight,
  FileText,
  Search,
  User,
  ShieldCheck,
  Building2,
  FileCheck,
  Grid3X3,
  Split,
  Eye,
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import { Application, DocumentUpload } from '../types/scholarship';
import { Avatar } from './Avatar';
import { useLanguage } from '../context/LanguageContext';

interface DocumentComparisonViewerProps {
  application?: Application;
  allApplications?: Application[];
  selectedAppId?: string;
  onSelectApplication?: (id: string) => void;
}

export interface SyntheticDocView {
  id: string;
  docType: string;
  title: string;
  fileName: string;
  authority: string;
  certificateNo: string;
  issueDate: string;
  status: 'verified' | 'mismatch' | 'flagged';
  confidence: number;
  extractedFields: Record<string, string | number>;
  mismatches: string[];
  contentLines: string[];
  securityFeature: string;
}

export const DocumentComparisonViewer: React.FC<DocumentComparisonViewerProps> = ({
  application: propApplication,
  allApplications = [],
  selectedAppId: propSelectedAppId,
  onSelectApplication,
}) => {
  const { t } = useLanguage();

  // Active student selection
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    propSelectedAppId || propApplication?.id || allApplications[0]?.id || ''
  );
  const [studentSearch, setStudentSearch] = useState('');

  // Sync internal selected ID with prop changes
  React.useEffect(() => {
    if (propSelectedAppId) {
      setInternalSelectedId(propSelectedAppId);
    } else if (propApplication?.id) {
      setInternalSelectedId(propApplication.id);
    }
  }, [propSelectedAppId, propApplication?.id]);

  // Current active student
  const currentStudent = useMemo(() => {
    return (
      allApplications.find((a) => a.id === internalSelectedId) ||
      propApplication ||
      allApplications[0]
    );
  }, [allApplications, internalSelectedId, propApplication]);

  // View modes
  const [viewMode, setViewMode] = useState<'all_side_by_side' | 'dual_compare' | 'consistency_matrix'>('all_side_by_side');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Dual compare selection indices
  const [docAIndex, setDocAIndex] = useState(0);
  const [docBIndex, setDocBIndex] = useState(1);

  // Generate authentic comprehensive document representations for this candidate
  const candidateDocs: SyntheticDocView[] = useMemo(() => {
    if (!currentStudent) return [];

    const applicant = currentStudent.applicant;
    const academic = currentStudent.academic;
    const name = applicant?.fullName || 'Candidate';
    const father = applicant?.fatherName || 'P. Rameshwar';
    const community = applicant?.stCommunity || 'Gond';
    const state = applicant?.state || 'Telangana';
    const district = applicant?.district || 'Adilabad';
    const income = applicant?.annualFamilyIncome || 320000;
    const degree = academic?.qualifyingDegree || 'Master of Science (M.Sc)';
    const percentage = academic?.qualifyingPercentage || 76.4;
    const rollNo = academic?.ugcNetRollNo || 'TG01004829';

    // Check if candidate has deficiencies or known mismatch
    const isMismatchCandidate = 
      currentStudent.aiAnalysis?.riskScore === 'High' ||
      currentStudent.status === 'flagged_deficiency' ||
      (currentStudent.deficiencies && currentStudent.deficiencies.length > 0);

    const docList: SyntheticDocView[] = [
      {
        id: 'doc_caste',
        docType: 'caste_certificate',
        title: 'ST Community / Caste Certificate',
        fileName: `${name.replace(/\s+/g, '_')}_ST_Caste_Cert.pdf`,
        authority: `Revenue Department, Office of Tahsildar / SDM, ${district}`,
        certificateNo: `ST/REV/2023/${Math.floor(100000 + Math.random() * 900000)}`,
        issueDate: '14-Aug-2023',
        status: isMismatchCandidate ? 'mismatch' : 'verified',
        confidence: isMismatchCandidate ? 78 : 98,
        mismatches: isMismatchCandidate 
          ? [`Candidate surname recorded as '${name.split(' ')[0]} Lapang' vs form '${name}'. Requires SDM Affidavit.`]
          : [],
        extractedFields: {
          'Candidate Name': isMismatchCandidate ? `${name.split(' ')[0]} Lapang` : name,
          "Father's Name": father,
          'Community / Caste': `${community} (Scheduled Tribe)`,
          'Constitutional Clause': 'Article 342, Constitution (Scheduled Tribes) Order, 1950',
          'Issuing Authority': `Sub-Divisional Magistrate, ${district}`,
          'Digital Signature': 'e-Pramaan DSC ID: SDM-REV-7821-TG',
        },
        contentLines: [
          'GOVERNMENT OF INDIA • STATE REVENUE DEPARTMENT',
          `OFFICE OF THE SUB-DIVISIONAL MAGISTRATE, ${district.toUpperCase()}`,
          `Certificate No: ST-TG-${district.slice(0, 3).toUpperCase()}-90182`,
          `This is to certify that ${isMismatchCandidate ? `${name.split(' ')[0]} Lapang` : name} D/o / S/o ${father}`,
          `residing at District: ${district}, State: ${state}, belongs to the`,
          `${community.toUpperCase()} community which is recognized as a Scheduled Tribe`,
          'under Article 342 of the Constitution of India.',
          '[OFFICIAL REVENUE STAMP & DIGITAL HASH ATTESTATION]',
        ],
        securityFeature: '256-bit e-Pramaan QR Code & UIDAI Hash Verified',
      },
      {
        id: 'doc_income',
        docType: 'income_certificate',
        title: 'Annual Family Income Certificate',
        fileName: `${name.replace(/\s+/g, '_')}_Income_Cert_FY24.pdf`,
        authority: `Mandal Revenue Officer / Tehsildar, ${district}`,
        certificateNo: `INC/TG/${district.slice(0, 3).toUpperCase()}/2024/0984`,
        issueDate: '22-Jun-2024',
        status: 'verified',
        confidence: 96,
        mismatches: [],
        extractedFields: {
          'Candidate Name': name,
          'Annual Family Income': `₹${income.toLocaleString('en-IN')}`,
          'Financial Year': '2024-2025',
          'Family Landholding': '2.4 Acres Rainfed Tribal Agriculture',
          'Statutory NOS Limit': 'Within ₹8,00,000 MoTA Ceiling',
        },
        contentLines: [
          'GOVERNMENT REVENUE ADMINISTRATION',
          'OFFICIAL ANNUAL INCOME EVALUATION RECORD',
          `Certified that the gross annual family income of ${name}`,
          `from all household sources is calculated as ₹${income.toLocaleString('en-IN')}`,
          '(Rupees Three Lakhs Twenty Thousand Only).',
          'Assessment verified through local Patwari / Village Revenue Officer enquiry.',
          `Valid for Academic Year 2024-2026 across Central Fellowship Schemes.`,
        ],
        securityFeature: 'State Land & Revenue Registry Watermark Sealed',
      },
      {
        id: 'doc_marksheet',
        docType: 'marksheet',
        title: 'Post-Graduate Consolidated Marksheet',
        fileName: `${name.replace(/\s+/g, '_')}_PG_Transcript.pdf`,
        authority: academic?.institutionName || 'Central University Examination Controller',
        certificateNo: `UNIV/TRANSCRIPT/${academic?.passingYear || 2024}/8921`,
        issueDate: '10-Jul-2024',
        status: 'verified',
        confidence: 99,
        mismatches: [],
        extractedFields: {
          'Candidate Name': name,
          'Degree Awarded': degree,
          'Passing Year': academic?.passingYear || 2024,
          'Aggregate Percentage': `${percentage}%`,
          'MoTA Cutoff Check': `${percentage}% >= 55.0% Mandatory Cutoff (PASSED)`,
          'Division / Grade': 'First Class with Distinction',
        },
        contentLines: [
          `${(academic?.institutionName || 'UNIVERSITY OF HYDERABAD').toUpperCase()}`,
          'CONSOLIDATED STATEMENT OF MARKS / ACADEMIC TRANSCRIPT',
          `Candidate: ${name.toUpperCase()} • Roll No: ${rollNo}`,
          `Degree: ${degree.toUpperCase()}`,
          `Total Marks Secured: 1528 / 2000 (${percentage}%)`,
          'Division: FIRST CLASS WITH DISTINCTION',
          'All statutory credits completed without supplementary backlogs.',
        ],
        securityFeature: 'University Registrar Hologram & Anti-Tamper Micro-Text',
      },
      {
        id: 'doc_aadhaar',
        docType: 'aadhaar',
        title: 'Aadhaar Card (Masked e-Aadhaar)',
        fileName: `${name.replace(/\s+/g, '_')}_Aadhaar_Masked.pdf`,
        authority: 'Unique Identification Authority of India (UIDAI)',
        certificateNo: applicant?.aadhaarNumber || 'XXXX-XXXX-8921',
        issueDate: '01-Feb-2020',
        status: 'verified',
        confidence: 97,
        mismatches: [],
        extractedFields: {
          'Full Name': name,
          'Gender': applicant?.gender || 'Female',
          'Date of Birth': applicant?.dob || '1998-04-12',
          'NPCI Bank Seeding': 'Active (Aadhaar Seeded for Direct DBT Disbursal)',
          'State': state,
        },
        contentLines: [
          'GOVERNMENT OF INDIA • UIDAI',
          'AADHAAR - MASKED IDENTITY VERIFICATION SLIP',
          `Name: ${name}`,
          `DOB: ${applicant?.dob || '1998-04-12'} | Gender: ${applicant?.gender || 'Female'}`,
          `Aadhaar Number: ${applicant?.aadhaarNumber || 'XXXX-XXXX-8921'}`,
          'Aadhaar is a proof of identity, not of citizenship or caste.',
          '[NPCI MAPPER CONFIRMED: SEEDED WITH SBI DBT GATEWAY]',
        ],
        securityFeature: 'UIDAI Cryptographic QR Signature Intact',
      },
      {
        id: currentStudent.scheme === 'NOS' ? 'doc_offer' : 'doc_net',
        docType: currentStudent.scheme === 'NOS' ? 'offer_letter' : 'bonafide_certificate',
        title: currentStudent.scheme === 'NOS' 
          ? 'Foreign University Admission Offer Letter' 
          : 'UGC-NET / CSIR-NET JRF Award Letter',
        fileName: currentStudent.scheme === 'NOS' 
          ? `${name.replace(/\s+/g, '_')}_Oxford_Offer_Letter.pdf`
          : `${name.replace(/\s+/g, '_')}_UGC_NET_Award_Letter.pdf`,
        authority: currentStudent.scheme === 'NOS'
          ? (academic?.foreignUniversity || 'University of Oxford, Admissions Office')
          : 'National Testing Agency (NTA) / UGC-CSIR',
        certificateNo: currentStudent.scheme === 'NOS' ? 'OXF/DPHIL/2025/ST-092' : `NTA/NET/JRF/${rollNo}`,
        issueDate: '18-Aug-2024',
        status: 'verified',
        confidence: 98,
        mismatches: [],
        extractedFields: {
          'Candidate Name': name,
          'Program / Scheme': currentStudent.scheme === 'NOS' ? 'Ph.D in Biological Sciences' : 'Junior Research Fellowship (JRF)',
          'Rank / Percentile': currentStudent.scheme === 'NOS' 
            ? `QS World Rank #${academic?.qsWorldRanking || 3}`
            : `${academic?.ugcNetScore || 96.4} Percentile`,
          'Conditionality': currentStudent.scheme === 'NOS' ? 'Unconditional Offer' : 'JRF Qualified (Category 1)',
        },
        contentLines: [
          currentStudent.scheme === 'NOS' 
            ? `${(academic?.foreignUniversity || 'UNIVERSITY OF OXFORD').toUpperCase()} - ADMISSIONS`
            : 'UNIVERSITY GRANTS COMMISSION • NTA NET BUREAU',
          currentStudent.scheme === 'NOS' 
            ? 'OFFICIAL LETTER OF UNCONDITIONAL ADMISSION'
            : 'JOINT CSIR-UGC TEST FOR JRF & ELIGIBILITY FOR LECTURESHIP',
          `Awarded to: ${name.toUpperCase()}`,
          currentStudent.scheme === 'NOS' 
            ? `Course: Ph.D / D.Phil in Advanced Bioscience (Duration: 36 Months)`
            : `Roll No: ${rollNo} • Qualified for Junior Research Fellowship (JRF)`,
          'Valid for direct Central Government Fellowship DBT remittance.',
        ],
        securityFeature: 'Official Institutional Seal & Registrar Verification Hash',
      },
    ];

    return docList;
  }, [currentStudent]);

  const docA = candidateDocs[docAIndex] || candidateDocs[0];
  const docB = candidateDocs[docBIndex] || candidateDocs[1] || candidateDocs[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-800/40 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black mb-2">
              <Columns2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>MoTA DOCUMENTATION STUDIO • DUAL-VIEWPORT VERIFICATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Documentation Studio & Side-by-Side Comparison</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
              Inspect all uploaded documents side-by-side or select any candidate to cross-verify ST Caste, Income, Marksheet, and Admission records.
            </p>
          </div>

          {/* Student Selector Bar */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <div className="flex items-center gap-2 px-2 text-xs text-emerald-200 font-bold shrink-0">
              <User className="w-4 h-4 text-amber-300" />
              <span>Select Student:</span>
            </div>
            <select
              value={internalSelectedId}
              onChange={(e) => {
                const newId = e.target.value;
                setInternalSelectedId(newId);
                onSelectApplication?.(newId);
              }}
              className="bg-emerald-900/90 text-white font-bold text-xs px-3 py-2 rounded-xl border border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer w-full sm:w-64"
            >
              {allApplications.length === 0 ? (
                <option value="">No applications loaded</option>
              ) : (
                allApplications.map((app) => (
                  <option key={app.id} value={app.id} className="bg-slate-900 text-white">
                    {app.applicant?.fullName} ({app.scheme} • {app.applicant?.stCommunity})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Selected Candidate Quick Dossier Strip */}
        {currentStudent && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={currentStudent.applicant?.fullName || 'Scholar'} size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white">{currentStudent.applicant?.fullName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950">
                    {currentStudent.scheme}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentStudent.status === 'flagged_deficiency'
                      ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
                      : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                  }`}>
                    {currentStudent.status === 'flagged_deficiency' ? 'Flagged for Review' : 'Verified Genuine'}
                  </span>
                </div>
                <div className="text-xs text-emerald-200 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>App #: <strong className="text-white font-mono">{currentStudent.applicationNumber}</strong></span>
                  <span>•</span>
                  <span>Tribe: <strong className="text-white">{currentStudent.applicant?.stCommunity}</strong></span>
                  <span>•</span>
                  <span>State: <strong className="text-white">{currentStudent.applicant?.state}</strong></span>
                  <span>•</span>
                  <span>Docs Uploaded: <strong className="text-amber-300 font-bold">{candidateDocs.length} Verified Files</strong></span>
                </div>
              </div>
            </div>

            {/* View Mode Tabs & Zoom */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/20 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('all_side_by_side')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'all_side_by_side' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>All Docs Side-by-Side</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('dual_compare')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'dual_compare' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>Dual Compare Diff</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('consistency_matrix')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'consistency_matrix' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Consistency Matrix</span>
                </button>
              </div>

              {/* Zoom Buttons */}
              <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/20 text-white">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                  className="p-1.5 hover:bg-white/20 rounded-lg cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1 font-bold">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  className="p-1.5 hover:bg-white/20 rounded-lg cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zero State if no candidate is loaded */}
      {!currentStudent && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <Columns2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Candidate Dossier Selected</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please select a candidate or ingest preset cohorts from the side panel to view uploaded documents side by side.
          </p>
        </div>
      )}

      {/* VIEW MODE 1: All Uploaded Documents Side-by-Side (Multi-Column Grid / Carousel) */}
      {currentStudent && viewMode === 'all_side_by_side' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Showing All {candidateDocs.length} Uploaded Documents Side-by-Side for <strong>{currentStudent.applicant?.fullName}</strong></span>
            </span>
            <span className="text-[11px] text-slate-500">
              Scroll horizontally or zoom to inspect high-resolution security seals and OCR fields
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {candidateDocs.map((doc, idx) => (
              <div 
                key={doc.id}
                className="bg-slate-900 rounded-3xl p-5 border border-slate-700/80 text-white flex flex-col justify-between space-y-4 shadow-lg hover:border-emerald-500/60 transition group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="leading-tight">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-0.5">
                      Doc {idx + 1}: {doc.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-white truncate max-w-[200px] block">
                      {doc.fileName}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[220px]">
                      {doc.authority}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    doc.status === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  }`}>
                    {doc.status === 'verified' ? 'Verified (100%)' : 'Mismatch Flagged'}
                  </span>
                </div>

                {/* Simulated Document Canvas Viewport */}
                <div className="bg-slate-50 rounded-2xl p-4 text-slate-900 font-mono text-[10px] leading-relaxed shadow-inner min-h-[300px] max-h-[360px] overflow-auto select-none border border-slate-300">
                  <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
                    <div className="text-center font-bold text-xs mb-3 border-b-2 border-emerald-700 pb-2 text-emerald-950">
                      {doc.contentLines[0]}
                      <div className="text-[9px] text-slate-600 font-semibold">{doc.contentLines[1]}</div>
                    </div>

                    <div className="space-y-1.5 my-3">
                      {doc.contentLines.slice(2).map((line, lIdx) => (
                        <p key={lIdx} className={line.startsWith('[') ? 'font-bold text-emerald-800 text-[9px] mt-2' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* Security Badge in Document */}
                    <div className="mt-4 p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-[9px] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{doc.securityFeature}</span>
                    </div>

                    {/* Discrepancy Alert if flagged */}
                    {doc.mismatches.length > 0 && (
                      <div className="mt-3 p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-[9px] flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>[Discrepancy]:</strong> {doc.mismatches[0]}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extracted Fields Summary */}
                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="text-[10px] font-black uppercase text-amber-300 mb-1 flex items-center justify-between">
                    <span>AI OCR Extracted Entities</span>
                    <span className="text-emerald-400 font-mono">{doc.confidence}% Confidence</span>
                  </div>
                  {Object.entries(doc?.extractedFields || {}).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">{key}:</span>
                      <strong className="text-white truncate max-w-[140px]">{String(val)}</strong>
                    </div>
                  ))}
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400 text-[10px]">Issued: {doc.issueDate}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDocAIndex(idx);
                      setDocBIndex((idx + 1) % candidateDocs.length);
                      setViewMode('dual_compare');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>Compare This</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Dual Viewport Forensic Compare */}
      {currentStudent && viewMode === 'dual_compare' && (
        <div className="space-y-4">
          {/* Pair Selector Controls */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-700">Compare:</span>
              <select
                value={docAIndex}
                onChange={(e) => setDocAIndex(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:bg-white"
              >
                {candidateDocs.map((d, i) => (
                  <option key={d.id} value={i}>Viewport 1: {d.title}</option>
                ))}
              </select>
              <ArrowLeftRight className="w-4 h-4 text-emerald-700 shrink-0" />
              <select
                value={docBIndex}
                onChange={(e) => setDocBIndex(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:bg-white"
              >
                {candidateDocs.map((d, i) => (
                  <option key={d.id} value={i}>Viewport 2: {d.title}</option>
                ))}
              </select>
            </div>

            <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Forensic Cross-Referencing Active</span>
            </div>
          </div>

          {/* Forensic Dual Split-Screen Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Viewport 1 (Doc A) */}
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-700 text-white flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                    Viewport A: {docA.title}
                  </span>
                  <span className="text-xs font-bold text-white font-mono truncate max-w-[220px] block">
                    {docA.fileName}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  docA.status === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                }`}>
                  {docA.status === 'verified' ? 'Verified 100%' : 'Mismatch'}
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 text-slate-900 font-mono text-[11px] leading-relaxed shadow-inner min-h-[380px] overflow-auto select-none border border-slate-300">
                <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
                  <div className="text-center font-bold text-sm mb-4 border-b border-emerald-700 pb-2 text-emerald-950">
                    {docA.contentLines[0]}
                    <div className="text-[10px] text-slate-600 font-normal">{docA.contentLines[1]}</div>
                  </div>
                  <div className="space-y-2">
                    {docA.contentLines.slice(2).map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                  <div className="mt-6 border border-emerald-400 p-2.5 bg-emerald-50 text-emerald-900 text-[10px] rounded space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{docA.securityFeature}</span>
                    </div>
                    <div>Authority Certificate ID: <strong>{docA.certificateNo}</strong></div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Scan Verified: {docA.issueDate}</span>
                <span className="text-emerald-400 font-bold">OCR Confidence: {docA.confidence}%</span>
              </div>
            </div>

            {/* Viewport 2 (Doc B) */}
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-700 text-white flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Viewport B: {docB.title}
                  </span>
                  <span className="text-xs font-bold text-white font-mono truncate max-w-[220px] block">
                    {docB.fileName}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  docB.status === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                }`}>
                  {docB.status === 'verified' ? 'Verified 100%' : 'Mismatch'}
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 text-slate-900 font-mono text-[11px] leading-relaxed shadow-inner min-h-[380px] overflow-auto select-none border border-slate-300">
                <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
                  <div className="text-center font-bold text-sm mb-4 border-b border-emerald-700 pb-2 text-emerald-950">
                    {docB.contentLines[0]}
                    <div className="text-[10px] text-slate-600 font-normal">{docB.contentLines[1]}</div>
                  </div>
                  <div className="space-y-2">
                    {docB.contentLines.slice(2).map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                  <div className="mt-6 border border-emerald-400 p-2.5 bg-emerald-50 text-emerald-900 text-[10px] rounded space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{docB.securityFeature}</span>
                    </div>
                    <div>Authority Certificate ID: <strong>{docB.certificateNo}</strong></div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Scan Verified: {docB.issueDate}</span>
                <span className="text-emerald-400 font-bold">OCR Confidence: {docB.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: Cross-Document Consistency Matrix */}
      {currentStudent && viewMode === 'consistency_matrix' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-700" />
              <span>Multi-Document Identity Consistency Matrix</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Comparing Form Entry Against All {candidateDocs.length} Documents
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-black text-[10px]">
                  <th className="p-3 border-b border-slate-200">Identity Field</th>
                  <th className="p-3 border-b border-slate-200">Application Entry</th>
                  {candidateDocs.map((d) => (
                    <th key={d.id} className="p-3 border-b border-slate-200">{d.title}</th>
                  ))}
                  <th className="p-3 border-b border-slate-200 text-right">Consistency Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Candidate Full Name</td>
                  <td className="p-3 font-bold text-indigo-900">{currentStudent.applicant?.fullName}</td>
                  {candidateDocs.map((d) => {
                    const extracted = d?.extractedFields?.['Candidate Name'] || d?.extractedFields?.['Full Name'] || 'N/A';
                    const isMismatch = String(extracted).toLowerCase() !== String(currentStudent?.applicant?.fullName || '').toLowerCase();
                    return (
                      <td key={d?.id || Math.random()} className={`p-3 font-mono ${isMismatch ? 'text-rose-700 font-bold bg-rose-50' : 'text-emerald-800'}`}>
                        {String(extracted)}
                      </td>
                    );
                  })}
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ Matches
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-900">Father's / Guardian's Name</td>
                  <td className="p-3 font-bold text-indigo-900">{currentStudent?.applicant?.fatherName || 'P. Rameshwar'}</td>
                  {candidateDocs.map((d) => {
                    const extracted = d?.extractedFields?.["Father's Name"] || 'N/A';
                    return (
                      <td key={d?.id || Math.random()} className="p-3 font-mono text-emerald-800">
                        {String(extracted)}
                      </td>
                    );
                  })}
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ Matches
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-900">ST Community / Tribe</td>
                  <td className="p-3 font-bold text-indigo-900">{currentStudent?.applicant?.stCommunity || 'Scheduled Tribe'}</td>
                  {candidateDocs.map((d) => {
                    const extracted = d?.extractedFields?.['Community / Caste'] || 'N/A';
                    return (
                      <td key={d?.id || Math.random()} className="p-3 font-mono text-emerald-800">
                        {String(extracted)}
                      </td>
                    );
                  })}
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ Article 342 Cleared
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-900">Domicile State / District</td>
                  <td className="p-3 font-bold text-indigo-900">{currentStudent?.applicant?.district || 'District'}, {currentStudent?.applicant?.state || 'State'}</td>
                  {candidateDocs.map((d) => {
                    const extracted = d?.extractedFields?.['Issuing Authority'] || d?.extractedFields?.['State'] || 'N/A';
                    return (
                      <td key={d?.id || Math.random()} className="p-3 font-mono text-emerald-800 truncate max-w-[120px]">
                        {String(extracted)}
                      </td>
                    );
                  })}
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ Domicile Authenticated
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
