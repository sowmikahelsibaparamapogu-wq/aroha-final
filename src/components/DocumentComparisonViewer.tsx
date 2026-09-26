import React, { useState } from 'react';
import { 
  Columns2, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeftRight,
  FileText
} from 'lucide-react';
import { Application } from '../types/scholarship';

interface DocumentComparisonViewerProps {
  application?: Application;
}

export const DocumentComparisonViewer: React.FC<DocumentComparisonViewerProps> = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'versions' | 'cross_doc'>('versions');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Columns2 className="w-4 h-4 text-emerald-700" />
            <span>Dual-Viewport Forensic Verification</span>
          </div>
          <h2 className="text-2xl font-bold font-roman text-slate-900">
            Side-by-Side Document Comparison Viewer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect resolution differences between original uncertified drafts and re-uploaded official revenue certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('versions')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                viewMode === 'versions' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              V1 vs. V2 Replacement
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cross_doc')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                viewMode === 'cross_doc' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Caste Cert vs. Marksheet
            </button>
          </div>

          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-white">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono px-1 font-bold text-slate-700">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Split-Screen Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Viewport: Document A (Original / V1) */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-700 text-white flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                {viewMode === 'versions' ? 'Original Upload (V1 - Deficient)' : 'Document A: Caste Certificate'}
              </span>
              <span className="text-xs font-bold text-white font-mono">
                {viewMode === 'versions' ? 'Temporary_Affidavit_Notary.pdf' : 'ST_Caste_Certificate_Adilabad.pdf'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
              {viewMode === 'versions' ? 'Missing SDM Barcode' : 'Verified'}
            </span>
          </div>

          {/* Document Simulated Canvas */}
          <div className="bg-slate-100 rounded-2xl p-6 text-slate-900 font-mono text-[11px] leading-relaxed shadow-inner min-h-[360px] overflow-auto select-none border border-slate-300">
            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
              <div className="text-center font-bold text-sm mb-4 border-b border-slate-300 pb-2">
                NOTARIZED COMMUNITY AFFIDAVIT (PROVISIONAL)
              </div>
              <p>I, <strong>Sowmika Helsiba Paramapogu</strong>, hereby affirm:</p>
              <p className="mt-2">1. That I belong to the <strong>Gond Community (Scheduled Tribe)</strong> residing in District Adilabad.</p>
              <p className="mt-2">2. That my annual family income is ₹3,40,000 as certified by village revenue officer.</p>
              <div className="mt-6 border border-dashed border-rose-400 p-2 bg-rose-50 text-rose-800 text-[10px] rounded">
                [OCR DEFICIENCY]: This provisional document lacks the mandatory Sub-Divisional Magistrate (SDM) official seal and digital e-Pramaan barcode verification required under MoTA NFST guidelines Clause 3.1.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Scan Time: 2025-08-10 11:22 AM</span>
            <span className="text-rose-400 font-semibold">Flagged for Resolution</span>
          </div>
        </div>

        {/* Right Viewport: Document B (Replacement V2 / Certified) */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-emerald-700/60 text-white flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                {viewMode === 'versions' ? 'Replacement Upload (V2 - Validated)' : 'Document B: Academic Marksheet'}
              </span>
              <span className="text-xs font-bold text-white font-mono">
                {viewMode === 'versions' ? 'ST_Caste_Certificate_Adilabad_SDM.pdf' : 'MSc_Biotech_Consolidated_Marksheet.pdf'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Cryptographically Verified (100%)
            </span>
          </div>

          {/* Document Simulated Canvas */}
          <div className="bg-slate-50 rounded-2xl p-6 text-slate-900 font-mono text-[11px] leading-relaxed shadow-inner min-h-[360px] overflow-auto select-none border border-emerald-300">
            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
              <div className="text-center font-bold text-sm mb-4 border-b border-emerald-600 pb-2 text-emerald-950">
                GOVERNMENT OF TELANGANA • REVENUE DEPARTMENT
                <div className="text-[10px] text-slate-500 font-normal">OFFICE OF THE SUB-DIVISIONAL MAGISTRATE, ADILABAD</div>
              </div>
              <p>Certificate Serial No: <strong>TG/ST/2023/009182</strong></p>
              <p className="mt-2">This is to certify that <strong>Sowmika Helsiba Paramapogu</strong> D/o <strong>P. Rameshwar</strong> belongs to the <strong>Gond Community</strong> which is recognized as a Scheduled Tribe under Article 342 of the Constitution.</p>
              
              <div className="mt-6 border border-emerald-400 p-2.5 bg-emerald-50 text-emerald-900 text-[10px] rounded space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>e-Pramaan QR Code & Digital Signature Valid</span>
                </div>
                <div>SDM Digital Certificate Authority ID: <strong>SDM-ADL-REV-0941</strong></div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-emerald-300 flex items-center justify-between">
            <span>Verified Time: 2025-08-12 04:48 PM</span>
            <span className="text-emerald-400 font-bold">Cleared for Merit List</span>
          </div>
        </div>

      </div>
    </div>
  );
};
