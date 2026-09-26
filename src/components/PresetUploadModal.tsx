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
  Award,
  Plus,
  Trash2,
  MapPin,
  Check,
  Compass
} from 'lucide-react';
import { 
  PRESET_SCENARIOS, 
  PresetScenario, 
  generateCustomPreset 
} from '../services/presetService';
import { ALL_INDIAN_STATES_AND_UTS } from '../data/indianStates';

interface PresetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePresets: PresetScenario[];
  onAddPreset: (preset: PresetScenario) => void;
  onRemovePreset: (presetId: string) => void;
  onUploadCustomPresetJson: (jsonData: any) => void;
  onResetAllPresets: () => void;
}

export const PresetUploadModal: React.FC<PresetUploadModalProps> = ({
  isOpen,
  onClose,
  activePresets,
  onAddPreset,
  onRemovePreset,
  onUploadCustomPresetJson,
  onResetAllPresets,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalTab, setModalTab] = useState<'curated' | 'create_custom' | 'upload_json'>('curated');
  
  // Selected curated preset in Tab 1
  const [selectedCuratedId, setSelectedCuratedId] = useState<string>(PRESET_SCENARIOS[0].id);

  // Custom Preset Creator State in Tab 2
  const [customName, setCustomName] = useState('Custom Regional ST Cohort');
  const [customScheme, setCustomScheme] = useState<'NFST' | 'NOS' | 'Both'>('Both');
  const [customIncome, setCustomIncome] = useState<number>(800000);
  const [customMarks, setCustomMarks] = useState<number>(55);
  const [customSlots, setCustomSlots] = useState<number>(750);
  const [customFemaleQuota, setCustomFemaleQuota] = useState<number>(33);
  const [customCandidateCount, setCustomCandidateCount] = useState<number>(6);
  const [selectedStates, setSelectedStates] = useState<string[]>([
    'Telangana',
    'Jharkhand',
    'Odisha',
    'Madhya Pradesh',
  ]);

  // Upload state
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [rawJsonText, setRawJsonText] = useState('');

  if (!isOpen) return null;

  const toggleStateSelection = (stateName: string) => {
    setSelectedStates((prev) =>
      prev.includes(stateName)
        ? prev.filter((s) => s !== stateName)
        : [...prev, stateName]
    );
  };

  const handleSelectAllStates = () => {
    if (selectedStates.length === ALL_INDIAN_STATES_AND_UTS.length) {
      setSelectedStates([]);
    } else {
      setSelectedStates([...ALL_INDIAN_STATES_AND_UTS]);
    }
  };

  const handleCreateAndAddCustomPreset = () => {
    if (!customName.trim()) return;

    const newPreset = generateCustomPreset({
      name: customName.trim(),
      scheme: customScheme,
      incomeCeiling: customIncome,
      marksThreshold: customMarks,
      totalSlots: customSlots,
      femaleQuota: customFemaleQuota,
      selectedStates: selectedStates.length > 0 ? selectedStates : ['Telangana', 'Jharkhand'],
      candidateCount: customCandidateCount,
    });

    onAddPreset(newPreset);
    onClose();
  };

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
        setUploadSuccess(`Preset "${parsed.name || file.name}" added successfully!`);
        setTimeout(() => onClose(), 1200);
      } catch (err: any) {
        setUploadError(`Failed to parse preset JSON file: ${err.message || 'Invalid format'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyRawJson = () => {
    if (!rawJsonText.trim()) return;
    setUploadError(null);
    try {
      const parsed = JSON.parse(rawJsonText);
      onUploadCustomPresetJson(parsed);
      setUploadSuccess(`Preset "${parsed.name || 'Raw JSON'}" added successfully!`);
      setTimeout(() => onClose(), 1200);
    } catch (err: any) {
      setUploadError(`Invalid JSON format: ${err.message}`);
    }
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
          id: 'app_custom_sample_01',
          applicationNumber: 'NFST/2026/SAMPLE01',
          scheme: 'NFST',
          status: 'submitted',
          applicant: {
            fullName: 'Somnath Soren',
            gender: 'Male',
            stCommunity: 'Santhal',
            state: 'Jharkhand',
            district: 'Khunti',
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

  const activeCuratedPreset =
    PRESET_SCENARIOS.find((p) => p.id === selectedCuratedId) || PRESET_SCENARIOS[0];

  const totalCandidatesAdded = activePresets.reduce(
    (acc, p) => acc + (p.additionalApplications?.length || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/45 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-2 border-emerald-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-inner">
              <UploadCloud className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                  STATUTORY INTAKE CONTROLLER
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                  activePresets.length > 0
                    ? 'bg-emerald-500 text-white border-white/40'
                    : 'bg-amber-400 text-amber-950 border-amber-300'
                }`}>
                  {activePresets.length > 0
                    ? `${activePresets.length} PRESET(S) ACTIVE`
                    : 'BLANK INTAKE (0 PRESETS)'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Add Preset & Update All Portals
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

        {/* Active Presets Bar: Shows all presets currently added one by one */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-indigo-950 font-black">
              <Layers className="w-4 h-4 text-indigo-600" />
              Active Presets Ingested ({activePresets.length}) — Total {totalCandidatesAdded} Candidates:
            </span>
            {activePresets.length > 0 && (
              <button
                type="button"
                onClick={onResetAllPresets}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Blank (Clear All)</span>
              </button>
            )}
          </div>

          {activePresets.length === 0 ? (
            <div className="text-xs text-amber-900 bg-amber-50 rounded-xl p-2.5 border border-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>System is currently BLANK.</strong> No false data is loaded. Choose a curated cohort below, create a custom preset, or upload JSON to ingest candidates one by one.
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {activePresets.map((preset, idx) => (
                <div
                  key={preset.id || idx}
                  className="bg-white border border-emerald-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-2xs flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="truncate max-w-[200px]">{preset.name}</span>
                  <span className="text-[10px] text-emerald-700 font-mono">
                    (+{preset.additionalApplications?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemovePreset(preset.id)}
                    className="text-slate-400 hover:text-rose-600 transition cursor-pointer ml-1 p-0.5"
                    title="Remove this preset"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setModalTab('curated')}
            className={`pb-3 px-3 text-xs font-black transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
              modalTab === 'curated'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Curated MoTA Cohorts</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('create_custom')}
            className={`pb-3 px-3 text-xs font-black transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
              modalTab === 'create_custom'
                ? 'border-indigo-600 text-indigo-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Create Custom Preset</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('upload_json')}
            className={`pb-3 px-3 text-xs font-black transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
              modalTab === 'upload_json'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4 text-teal-600" />
            <span>Upload / Paste JSON</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          
          {/* TAB 1: CURATED COHORTS */}
          {modalTab === 'curated' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                  Select a Curated Cohort to Ingest One by One:
                </span>
                <span className="text-xs text-slate-500">
                  {PRESET_SCENARIOS.length} Regional & Thematic Presets Available
                </span>
              </div>

              {/* Grid of Curated Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {PRESET_SCENARIOS.map((preset) => {
                  const isSelected = selectedCuratedId === preset.id;
                  const isAlreadyAdded = activePresets.some((p) => p.id === preset.id);

                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedCuratedId(preset.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black border ${preset.badgeColor}`}>
                            {preset.badge}
                          </span>
                          {isAlreadyAdded && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              Added ✓
                            </span>
                          )}
                        </div>
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
                    </div>
                  );
                })}
              </div>

              {/* Preview of Active Selected Curated Preset */}
              {activeCuratedPreset && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="font-black text-indigo-950 text-sm">
                      {activeCuratedPreset.name} (Preview Details)
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Users className="w-3.5 h-3.5" />
                        +{activeCuratedPreset.additionalApplications.length} to add
                      </span>
                      <span className="flex items-center gap-1 text-indigo-700">
                        <Sliders className="w-3.5 h-3.5" />
                        {activeCuratedPreset.parameters.marksThreshold}% Cutoff
                      </span>
                      <span className="flex items-center gap-1 text-purple-700">
                        <Award className="w-3.5 h-3.5" />
                        {activeCuratedPreset.parameters.femaleQuota}% Female
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeCuratedPreset.keyHighlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onAddPreset(activeCuratedPreset);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-md flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add This Preset to Active Pipeline</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE CUSTOM PRESET */}
          {modalTab === 'create_custom' && (
            <div className="space-y-5">
              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 text-xs text-indigo-950">
                <div className="font-black text-sm text-indigo-900 mb-1">
                  Custom Preset Generator (Configure Any States & Parameters)
                </div>
                <p>
                  Specify statutory income ceilings, qualifying marks threshold, target Indian states from the 36 available, and candidate volume. Real candidate dossiers will be synthesized and evaluated.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Preset Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                    placeholder="e.g. Telangana ITDA Batch 2026"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Scheme Target</label>
                  <select
                    value={customScheme}
                    onChange={(e) => setCustomScheme(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                  >
                    <option value="Both">Both NFST & NOS</option>
                    <option value="NFST">NFST Fellowship Only</option>
                    <option value="NOS">NOS Overseas Scholarship Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Annual Income Ceiling: ₹{(customIncome / 100000).toFixed(1)} Lakhs
                  </label>
                  <input
                    type="range"
                    min="300000"
                    max="1500000"
                    step="50000"
                    value={customIncome}
                    onChange={(e) => setCustomIncome(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Qualifying Marks Cutoff: {customMarks}%
                  </label>
                  <input
                    type="range"
                    min="45"
                    max="75"
                    step="1"
                    value={customMarks}
                    onChange={(e) => setCustomMarks(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Female Quota Reservation: {customFemaleQuota}%
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="50"
                    step="1"
                    value={customFemaleQuota}
                    onChange={(e) => setCustomFemaleQuota(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Candidates to Synthesize: {customCandidateCount}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={customCandidateCount}
                    onChange={(e) => setCustomCandidateCount(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              {/* State Selection Checklist (All 36 States & UTs available!) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-900 uppercase">
                    Target States & UTs ({selectedStates.length} of 36 Selected):
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllStates}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {selectedStates.length === ALL_INDIAN_STATES_AND_UTS.length
                      ? 'Deselect All'
                      : 'Select All 36'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {ALL_INDIAN_STATES_AND_UTS.map((state) => {
                    const isChecked = selectedStates.includes(state);
                    return (
                      <button
                        key={state}
                        type="button"
                        onClick={() => toggleStateSelection(state)}
                        className={`p-1.5 rounded-lg text-left text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 text-[10px] ${
                          isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                        }`}>
                          {isChecked && '✓'}
                        </span>
                        <span className="truncate">{state}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleCreateAndAddCustomPreset}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black text-xs transition cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create & Ingest Custom Preset</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD / PASTE JSON */}
          {modalTab === 'upload_json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  Upload Preset File (.json)
                </span>
                <button
                  type="button"
                  onClick={handleDownloadSamplePreset}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sample JSON
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
                  Ingests candidate dossiers and applies statutory parameters.
                </p>
              </div>

              {/* Or Paste Raw JSON */}
              <div className="space-y-2 pt-2">
                <div className="font-bold text-xs text-slate-800">Or Paste Raw JSON Below:</div>
                <textarea
                  rows={5}
                  value={rawJsonText}
                  onChange={(e) => setRawJsonText(e.target.value)}
                  placeholder='{"name": "My Custom Cohort", "parameters": { "incomeCeiling": 800000, "marksThreshold": 55, "totalSlots": 750, "femaleQuota": 30 }, "additionalApplications": [...] }'
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleApplyRawJson}
                    className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Parse & Add JSON Preset
                  </button>
                </div>
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
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            {activePresets.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onResetAllPresets();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-rose-700 border border-rose-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                title="Wipe all presets and return to completely blank state"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>Reset to Blank State (0 Presets)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
