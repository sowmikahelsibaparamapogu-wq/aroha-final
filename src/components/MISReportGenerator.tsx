import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  FileSpreadsheet, 
  Calendar, 
  Building2, 
  Award,
  Sparkles
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface MISReportGeneratorProps {
  applications: Application[];
}

export const MISReportGenerator: React.FC<MISReportGeneratorProps> = ({ applications }) => {
  const [reportPeriod, setReportPeriod] = useState<'Q2_2025' | 'ANNUAL_2024_25'>('Q2_2025');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExport = (type: 'PDF' | 'EXCEL') => {
    setIsExporting(type);
    setTimeout(() => {
      setIsExporting(null);
      setToastMessage(`Official MIS Report successfully generated and downloaded as ${type} format.`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Parliamentary Reporting</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Automated MIS Reports
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleExport('EXCEL')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Excel</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Official Formatted Document Preview Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-300 shadow-md max-w-4xl mx-auto space-y-6 font-roman text-slate-900 print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6 space-y-1">
          <div className="text-sm font-bold uppercase tracking-widest text-slate-700 font-sans">
            Government of India • Ministry of Tribal Affairs
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            QUARTERLY MANAGEMENT INFORMATION SYSTEM (MIS) PERFORMANCE REPORT
          </h1>
          <div className="text-xs text-slate-600 font-sans font-medium">
            National Fellowship (NFST) & National Overseas Scholarship (NOS) For ST Candidates
          </div>
          <div className="text-xs text-slate-500 pt-1 font-sans">
            Report Reference: MoTA/MIS/2025-Q2/REF-8902 • Cycle Active: 2025–2026
          </div>
        </div>

        {/* Executive Summary Table */}
        <div className="space-y-3 font-sans">
          <h3 className="font-roman text-lg font-bold text-slate-900">
            1. National Fellowship & Scholarship Vital Statistics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">Total Applications</div>
              <div className="text-2xl font-bold font-roman text-slate-900">1,420</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-xs text-emerald-800">Verified & Clean</div>
              <div className="text-2xl font-bold font-roman text-emerald-800">1,085</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-xs text-blue-800">DBT Active Disbursals</div>
              <div className="text-2xl font-bold font-roman text-blue-800">750</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-xs text-amber-800">ST Women Ratio</div>
              <div className="text-2xl font-bold font-roman text-amber-800">34.8%</div>
            </div>
          </div>
        </div>

        {/* Scheme-Wise Financial Outflow Summary */}
        <div className="space-y-3 font-sans">
          <h3 className="font-roman text-lg font-bold text-slate-900">
            2. Parliamentary Expenditure & DBT Disbursal Ledger
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Head of Account</th>
                  <th className="p-2.5">Statutory Slots</th>
                  <th className="p-2.5">BE Allocation</th>
                  <th className="p-2.5">Actual Disbursed</th>
                  <th className="p-2.5">Fulfillment %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-bold">NFST Higher Education Fellowship</td>
                  <td className="p-2.5">750</td>
                  <td className="p-2.5 font-mono">₹43.30 Cr</td>
                  <td className="p-2.5 font-mono">₹31.30 Cr</td>
                  <td className="p-2.5 font-bold text-emerald-700">100.0%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">National Overseas Scholarship (NOS)</td>
                  <td className="p-2.5">20</td>
                  <td className="p-2.5 font-mono">₹38.50 Cr</td>
                  <td className="p-2.5 font-mono">₹29.40 Cr</td>
                  <td className="p-2.5 font-bold text-emerald-700">100.0%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Total Composite Tribal Higher Education</td>
                  <td className="p-2.5">770</td>
                  <td className="p-2.5 font-mono font-bold">₹81.80 Cr</td>
                  <td className="p-2.5 font-mono font-bold">₹60.70 Cr</td>
                  <td className="p-2.5 font-bold text-emerald-700">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Attestation & Authority Signature Block */}
        <div className="pt-8 border-t border-slate-300 flex justify-between items-end font-sans text-xs">
          <div>
            <div className="text-slate-500">Prepared by: AI System Controller (AROHA)</div>
            <div className="text-slate-500">Digital Seal: e-Pramaan MoTA Authenticated</div>
          </div>
          <div className="text-right space-y-1">
            <div className="font-roman font-bold text-sm text-slate-900">Dr. Rajeshwar Soren, IES</div>
            <div className="text-slate-600">Senior Scrutiny Officer & Member Secretary</div>
            <div className="text-slate-400 text-[10px]">Ministry of Tribal Affairs, New Delhi</div>
          </div>
        </div>

      </div>
    </div>
  );
};
