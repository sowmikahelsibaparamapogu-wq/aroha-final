import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  X, 
  CheckCircle2, 
  FileCode, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  RotateCcw,
  Download,
  Sliders,
  Users,
  Award
} from 'lucide-react';
import { PRESET_SCENARIOS, PresetScenario } from '../services/presetService';
import { Application } from '../types/scholarship';

interface PresetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPresetUploaded: boolean;
  activePresetName: string | null;
  onApplyPresetScenario: (preset: PresetScenario) => void;
  onUploadCustomPresetJson: (jsonData: any) => void;
  onResetToPreUploadState: () => void;
}

export const PresetUploadModal: React.FC<PresetUploadModalProps> = ({
  isOpen,
  onClose,
  isPresetUploaded,
  activePresetName,
  onApplyPresetScenario,
  onUploadCustomPresetJson,
  onResetToPreUploadState,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_SCENARIOS[0].id);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        
        onUploadCustomPresetJson(parsed);
        setUploadSuccess(`Preset "${parsed.name || file.name}" uploaded successfully! Updated all tabs and portals.`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } catch (err: any) {
        setUploadError(`Failed to parse preset JSON file: ${err.message || 'Invalid format'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSamplePreset = () => {
    const samplePreset = {
      name: 'Custom MoTA Scheme Preset 2026',
      category: 'User Custom Ingestion',
      description: 'Custom preset configuring statutory parameters and adding cohort dossiers.',
      parameters: {
        incomeCeiling: 900000,
        marksThreshold: 52,
        totalSlots: 800,
        femaleQuota: 33,
      },
      additionalApplications: [
        {
          id: 'app_custom_001',
          applicationNumber: 'NFST/2026/CUSTOM01',
          scheme: 'NFST',
          status: 'submitted',
          applicant: {
            fullName: 'Somnath Soren',
            gender: 'Male',
            stCommunity: 'Santhal',
            state: 'West Bengal',
            district: 'Purulia',
            annualFamilyIncome: 310000,
          },
          academic: {
            qualifyingDegree: 'M.Sc. in Physics',
            qualifyingPercentage: 77.4,
            targetProgram: 'Ph.D',
            specialization: 'Condensed Matter Physics',
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(samplePreset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mota_scholarship_sample_preset.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const activePreset = PRESET_SCENARIOS.find((p) => p.id === selectedPresetId) || PRESET_SCENARIOS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full border-2 border-emerald-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-inner">
              <UploadCloud className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                  STATUTORY PIPELINE CONTROLLER
                </span>
                {isPresetUploaded ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black border border-white/40">
                    RESULTS ACTIVE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black">
                    AWAITING UPLOAD
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Upload Preset & Ingest Applications
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/15 hover:bg-white/30 text-white border border-white/30 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {/* Status Alert Banner */}
          <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
            isPresetUploaded
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            {isPresetUploaded ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-black text-sm">
                {isPresetUploaded
                  ? `Active Preset: ${activePresetName || 'Custom Preset'}`
                  : 'Current State: Baseline Intake (Results Not Prebuilt)'}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isPresetUploaded
                  ? 'Applications have been ingested, statutory rule evaluation has executed, and results are currently live across all portals and tabs.'
                  : 'Before preset upload, results are not shown. 2 baseline intake applications are staged, and remaining cohort applications are waiting to be added. Upload a preset to ingest remaining candidates, evaluate rules, and update results in each tab and portal.'}
              </p>
            </div>
          </div>

          {/* SECTION 1: File Upload Option */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-indigo-600" />
                Option 1: Upload Custom Preset (.json)
              </span>
              <button
                type="button"
                onClick={handleDownloadSamplePreset}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Sample JSON Template
              </button>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 group-hover:bg-indigo-200 text-indigo-700 flex items-center justify-center transition">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="font-black text-indigo-950 text-sm">
                Click or Drag & Drop Preset JSON File
              </div>
              <p className="text-xs text-indigo-700">
                Uploads scheme parameters, ingests new applications, and triggers evaluation across all tabs.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                ⚠️ {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                ✓ {uploadSuccess}
              </div>
            )}
          </div>

          {/* SECTION 2: Curated Built-in Presets */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <span className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Option 2: Select Curated Preset Scenario
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_SCENARIOS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${preset.badgeColor}`}>
                        {preset.badge}
                      </span>
                      <div className="font-black text-indigo-950 text-xs leading-snug">
                        {preset.name}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-black text-indigo-700">
                      <span>+{preset.additionalApplications.length} Candidates</span>
                      <span>₹{(preset.parameters.incomeCeiling / 100000).toFixed(0)}L Cap</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Preset Details & Highlights */}
            {activePreset && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="font-black text-indigo-950 text-sm">
                    {activePreset.name} (Preview of Ingestion)
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <Users className="w-3.5 h-3.5" />
                      +{activePreset.additionalApplications.length} to add
                    </span>
                    <span className="flex items-center gap-1 text-indigo-700">
                      <Sliders className="w-3.5 h-3.5" />
                      {activePreset.parameters.marksThreshold}% Cutoff
                    </span>
                    <span className="flex items-center gap-1 text-purple-700">
                      <Award className="w-3.5 h-3.5" />
                      {activePreset.parameters.femaleQuota}% Female
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activePreset.keyHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            {isPresetUploaded && (
              <button
                type="button"
                onClick={() => {
                  onResetToPreUploadState();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-rose-700 border border-rose-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                title="Revert back to intake state where results are not shown"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>Reset to Intake State (Before Preset)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                onApplyPresetScenario(activePreset);
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
            >
              <span>⚡ Upload Preset & Update All Tabs</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
