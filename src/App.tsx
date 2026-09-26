import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Application, 
  UserRole, 
  SchemeType, 
  SchemeRuleConfig, 
  DeficiencyNotice, 
  DocumentUpload,
  AuthUser
} from './types/scholarship';
import { StorageEngine } from './services/storage';
import { DEFAULT_SCHEME_RULES, evaluateApplication } from './services/ruleEngine';
import { SEEDED_APPLICATIONS, INITIAL_SYSTEM_STATS } from './services/mockData';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { 
  AuthService, 
  DEMO_STUDENTS, 
  DEMO_OFFICERS, 
  DEMO_ADMINS, 
  DEMO_SUPERVISORS 
} from './services/authService';

// Base Components
import { AuthView } from './components/AuthView';
import { SidePanel, PortalTab } from './components/SidePanel';
import { OfflineBanner } from './components/OfflineBanner';
import { ToastContainer, ToastMessage } from './components/Toast';
import { MultiStepForm } from './components/MultiStepForm';
import { StatusTracker } from './components/StatusTracker';
import { SchemeGuidelines } from './components/SchemeGuidelines';
import { ScrutinyQueue } from './components/ScrutinyQueue';
import { ScrutinyModal } from './components/ScrutinyModal';
import { MeritRankingView } from './components/MeritRankingView';
import { DemoScenariosModal } from './components/DemoScenariosModal';
import { RejectionDesk } from './components/RejectionDesk';
import { FieldVerificationDesk } from './components/FieldVerificationDesk';
import { TribalHeritageGallery } from './components/TribalHeritageGallery';
import { ArohaMitraBot } from './components/ArohaMitraBot';
import { useLanguage } from './context/LanguageContext';

// Top 20 Add-On Visual Intelligence Features
import { CommandCenter } from './components/CommandCenter'; // Feature 1
import { GISScholarshipMap } from './components/GISScholarshipMap'; // Feature 2
import { PolicySimulator } from './components/PolicySimulator'; // Feature 3
import { BudgetForecasting } from './components/BudgetForecasting'; // Feature 4
import { ExecutiveInsights } from './components/ExecutiveInsights'; // Feature 5
import { DecisionSupportCenter } from './components/DecisionSupportCenter'; // Feature 6
import { FraudRiskDashboard } from './components/FraudRiskDashboard'; // Feature 7
import { Applicant360Profile } from './components/Applicant360Profile'; // Feature 8
import { SLAEscalationPipeline } from './components/SLAEscalationPipeline'; // Feature 9
import { OfficerWorkloadDashboard } from './components/OfficerWorkloadDashboard'; // Feature 10
import { NoCodeRuleBuilder } from './components/NoCodeRuleBuilder'; // Feature 12
import { CrossSchemeRecommender } from './components/CrossSchemeRecommender'; // Feature 13
import { PredictiveAnalytics } from './components/PredictiveAnalytics'; // Feature 14
import { VersionTimeline } from './components/VersionTimeline'; // Feature 15
import { DocumentComparisonViewer } from './components/DocumentComparisonViewer'; // Feature 16
import { MISReportGenerator } from './components/MISReportGenerator'; // Feature 17
import { BulkVerificationQueue } from './components/BulkVerificationQueue'; // Feature 18
import { NotificationCenter } from './components/NotificationCenter'; // Feature 19
import { LiveParameterModal } from './components/LiveParameterModal';
import { PresetUploadModal } from './components/PresetUploadModal';
import { 
  BASELINE_APPLICATIONS, 
  evaluateAllWithPreset, 
  PresetScenario 
} from './services/presetService';

export default function App() {
  const { isOnline, realOnline, isSimulatedOffline, toggleSimulatedOffline } = useNetworkStatus();
  const { lang, setLang, t } = useLanguage();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());
  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('aroha_current_auth_user');
    } catch {
      return true;
    }
  });

  // Current Role: Student, Officer, Admin, Supervisor
  const [role, setRole] = useState<UserRole>(() => {
    const user = AuthService.getCurrentUser();
    if (user?.role === 'applicant') return 'student';
    return user?.role || 'student';
  });

  // Active Tab across side panel
  const [activeTab, setActiveTab] = useState<PortalTab>(() => {
    const user = AuthService.getCurrentUser();
    const r = user?.role || 'student';
    if (r === 'officer') return 'bulk_queue';
    if (r === 'admin') return 'command_center';
    if (r === 'supervisor') return 'executive_insights';
    return 'apply';
  });

  // Multiple Active Presets State (Starts completely empty with zero false data)
  const [activePresets, setActivePresets] = useState<PresetScenario[]>(() => {
    try {
      const raw = localStorage.getItem('aroha_active_presets');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isPresetUploaded, setIsPresetUploaded] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('aroha_active_presets');
      const presets = raw ? JSON.parse(raw) : [];
      return presets.length > 0;
    } catch {
      return false;
    }
  });

  const [activePresetName, setActivePresetName] = useState<string | null>(() => {
    try {
      return localStorage.getItem('aroha_active_preset_name');
    } catch {
      return null;
    }
  });

  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  // Applications Data State: STRICTLY EMPTY ([]) when no presets are added!
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const rawPresets = localStorage.getItem('aroha_active_presets');
      const presets: PresetScenario[] = rawPresets ? JSON.parse(rawPresets) : [];
      if (presets.length === 0) return [];
      const rawApps = localStorage.getItem('aroha_cached_apps');
      return rawApps ? JSON.parse(rawApps) : [];
    } catch {
      return [];
    }
  });

  const [rules, setRules] = useState<Record<SchemeType, SchemeRuleConfig>>(DEFAULT_SCHEME_RULES);
  const [selectedAppId, setSelectedAppId] = useState<string>('app_nfst_001');
  const [scrutinyModalApp, setScrutinyModalApp] = useState<Application | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isParamModalOpen, setIsParamModalOpen] = useState(false);

  // Offline Sync State
  const [queuedDocsCount, setQueuedDocsCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncedText, setLastSyncedText] = useState('Last synced: Just now');
  const isSyncingRef = useRef(false);
  const wasOfflineRef = useRef(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'warning' | 'info', title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize DB on mount: strictly empty if no presets added
  useEffect(() => {
    const initData = async () => {
      try {
        const rawPresets = localStorage.getItem('aroha_active_presets');
        const presets: PresetScenario[] = rawPresets ? JSON.parse(rawPresets) : [];
        if (presets.length > 0) {
          const storedApps = await StorageEngine.getApplications();
          if (storedApps && storedApps.length > 0) {
            setApplications(storedApps);
          } else {
            const allApps = presets.flatMap((p) => p.additionalApplications || []);
            const uniqueMap = new Map<string, Application>();
            allApps.forEach((a) => uniqueMap.set(a.id, a));
            const merged = Array.from(uniqueMap.values());
            setApplications(merged);
            await StorageEngine.saveApplications(merged);
          }
          setIsPresetUploaded(true);
        } else {
          // Strictly blank initially - zero false/mock data
          setApplications([]);
          setIsPresetUploaded(false);
          await StorageEngine.clearAllApplications();
        }
      } catch {
        setApplications([]);
        setIsPresetUploaded(false);
      }

      const queued = await StorageEngine.getQueuedDocuments();
      setQueuedDocsCount(queued ? queued.length : 0);
    };

    initData();
  }, []);

  // Background sync handler
  const triggerSync = useCallback(async (options?: { showToast?: boolean }) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSyncing(true);
    setSyncProgress(20);

    const queued = await StorageEngine.getQueuedDocuments();
    const queuedCount = queued.length;
    setQueuedDocsCount(queuedCount);

    setTimeout(async () => {
      setSyncProgress(60);
      if (queuedCount > 0) {
        await StorageEngine.clearQueuedDocuments();
        setQueuedDocsCount(0);
      }

      setTimeout(() => {
        setSyncProgress(100);
        setIsSyncing(false);
        isSyncingRef.current = false;
        setLastSyncedText(`Last synced: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
        
        const shouldShow = options?.showToast ?? true;
        if (shouldShow) {
          addToast(
            'success',
            'Synced with MoTA Database',
            queuedCount > 0 
              ? `${queuedCount} queued document(s) uploaded and synchronized.`
              : 'All offline applications, document queues, and scrutiny logs are up to date.'
          );
        }
      }, 400);
    }, 600);
  }, [addToast]);

  // Handle new submission
  const handleApplicationSubmitted = (newApp: Application) => {
    setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
    setSelectedAppId(newApp.id);
    setActiveTab('track');
  };

  // Resolve Deficiency
  const handleResolveDeficiency = async (appId: string, defId: string, replacementDoc: DocumentUpload) => {
    const updated = applications.map((app) => {
      if (app.id !== appId) return app;
      const updatedDocs = [...(app.documents || []), replacementDoc];
      const updatedDefs = app.deficiencies?.filter((d) => d.id !== defId) || [];
      return {
        ...app,
        documents: updatedDocs,
        deficiencies: updatedDefs,
        status: updatedDefs.length === 0 ? ('in_scrutiny' as const) : app.status,
        updatedAt: new Date().toISOString(),
      };
    });
    setApplications(updated);
    await StorageEngine.saveApplications(updated);
  };

  // Scrutiny Modal Actions
  const handleApproveFromScrutiny = async (appId: string, remarks: string) => {
    const updated = applications.map((app) => {
      if (app.id !== appId) return app;
      return {
        ...app,
        status: 'approved' as const,
        scrutiny: {
          verifiedBy: currentUser?.name || 'MoTA Scrutiny Officer (Desk-IV)',
          reviewedAt: new Date().toISOString(),
          decision: 'approved' as const,
          remarks,
        },
        updatedAt: new Date().toISOString(),
      };
    });
    setApplications(updated);
    await StorageEngine.saveApplications(updated);
    addToast('success', 'Application Approved', 'Dossier cleared for National Merit Board.');
  };

  const handleIssueDeficiencyFromScrutiny = async (appId: string, notice: DeficiencyNotice) => {
    const updated = applications.map((app) => {
      if (app.id !== appId) return app;
      return {
        ...app,
        status: 'flagged_deficiency' as const,
        deficiencies: [...(app.deficiencies || []), notice],
        updatedAt: new Date().toISOString(),
      };
    });
    setApplications(updated);
    await StorageEngine.saveApplications(updated);
    addToast('warning', 'Deficiency Notice Issued', 'Candidate notified via SMS/email.');
  };

  const handleRejectFromScrutiny = async (appId: string, reason: string) => {
    const updated = applications.map((app) => {
      if (app.id !== appId) return app;
      return {
        ...app,
        status: 'rejected' as const,
        scrutiny: {
          verifiedBy: currentUser?.name || 'MoTA Scrutiny Officer',
          reviewedAt: new Date().toISOString(),
          decision: 'rejected' as const,
          remarks: reason,
        },
        updatedAt: new Date().toISOString(),
      };
    });
    setApplications(updated);
    await StorageEngine.saveApplications(updated);
    addToast('info', 'Application Rejected', 'Statutory rejection recorded.');
  };

  const handleRejectWithStatutoryClause = async (appId: string, clauseCode: string, fullRemarks: string) => {
    const updated = applications.map((app) => {
      if (app.id !== appId) return app;
      return {
        ...app,
        status: 'rejected' as const,
        scrutiny: {
          verifiedBy: currentUser?.name || 'MoTA Scrutiny Officer',
          reviewedAt: new Date().toISOString(),
          decision: 'rejected' as const,
          remarks: fullRemarks,
        },
        updatedAt: new Date().toISOString(),
      };
    });
    setApplications(updated);
    await StorageEngine.saveApplications(updated);
    addToast('info', 'Statutory Rejection Registered', `Rejected under Clause [${clauseCode}].`);
  };

  // Bulk actions for Feature 18
  const handleBatchApprove = async (ids: string[]) => {
    const updated = applications.map((app) => {
      if (ids.includes(app.id)) {
        return {
          ...app,
          status: 'approved' as const,
          updatedAt: new Date().toISOString(),
        };
      }
      return app;
    });
    setApplications(updated);
    await StorageEngine.saveApplications(updated);
    addToast('success', 'Batch Approved', `${ids.length} applications sanctioned successfully.`);
  };

  // Dynamic Policy & Parameter Update: when given update, recalculate all parameters and features dynamically
  const handleUpdateParameters = async (params: {
    incomeCeiling?: number;
    marksThreshold?: number;
    totalSlots?: number;
    femaleQuota?: number;
  }) => {
    const updatedRules: Record<SchemeType, SchemeRuleConfig> = {
      ...rules,
      NFST: {
        ...rules.NFST,
        maxSlots: params.totalSlots ?? rules.NFST.maxSlots,
        femaleReservationPercent: params.femaleQuota ?? rules.NFST.femaleReservationPercent,
        eligibility: {
          ...rules.NFST.eligibility,
          minQualifyingPercentage: params.marksThreshold ?? rules.NFST.eligibility.minQualifyingPercentage,
          maxIncomeLimit: params.incomeCeiling ?? rules.NFST.eligibility.maxIncomeLimit,
        },
      },
      NOS: {
        ...rules.NOS,
        femaleReservationPercent: params.femaleQuota ?? rules.NOS.femaleReservationPercent,
        eligibility: {
          ...rules.NOS.eligibility,
          minQualifyingPercentage: params.marksThreshold ?? rules.NOS.eligibility.minQualifyingPercentage,
          maxIncomeLimit: params.incomeCeiling ?? rules.NOS.eligibility.maxIncomeLimit,
        },
      },
    };

    setRules(updatedRules);

    // Re-evaluate all applications using the updated scheme rule parameters
    const updatedApps = applications.map((app) => {
      const schemeRule = updatedRules[app.scheme || 'NFST'];
      const evalResult = evaluateApplication(app, schemeRule);

      let newStatus = app.status;
      if (evalResult.passed && (app.status === 'rejected' || app.status === 'flagged_deficiency')) {
        newStatus = 'in_scrutiny';
      } else if (!evalResult.passed && (app.status === 'in_scrutiny' || app.status === 'submitted')) {
        newStatus = 'flagged_deficiency';
      }

      return {
        ...app,
        status: newStatus,
        aiAnalysis: {
          ...app.aiAnalysis,
          eligibilityPassed: evalResult.passed,
          flags: evalResult.flags,
          riskScore: evalResult.riskScore,
          calculatedMeritScore: evalResult.meritScore,
          overallConfidence: evalResult.overallConfidence,
        },
        updatedAt: new Date().toISOString(),
      };
    });

    setApplications(updatedApps);
    await StorageEngine.saveApplications(updatedApps);
    addToast(
      'success',
      'All Parameters & Features Recalculated',
      'Updated national eligibility, merit quotas, and command dashboards based on input.'
    );
  };

  // Handle Add Preset (One by One)
  const handleAddPreset = async (preset: PresetScenario) => {
    const existingPresets = activePresets.filter((p) => p.id !== preset.id);
    const updatedPresets = [...existingPresets, preset];
    setActivePresets(updatedPresets);

    // Merge applications across all active presets
    const allPresetsApps = updatedPresets.flatMap((p) => p.additionalApplications || []);
    const uniqueMap = new Map<string, Application>();
    allPresetsApps.forEach((a) => uniqueMap.set(a.id, a));
    const mergedPool = Array.from(uniqueMap.values());

    const { updatedRules, evaluatedApplications } = evaluateAllWithPreset(
      mergedPool,
      preset.parameters,
      rules
    );

    setRules(updatedRules);
    setApplications(evaluatedApplications);
    setIsPresetUploaded(true);
    setActivePresetName(preset.name);

    try {
      localStorage.setItem('aroha_preset_uploaded', 'true');
      localStorage.setItem('aroha_active_preset_name', preset.name);
      localStorage.setItem('aroha_active_presets', JSON.stringify(updatedPresets));
    } catch {
      // ignore
    }

    await StorageEngine.saveApplications(evaluatedApplications);

    addToast(
      'success',
      `Preset Added: ${preset.name}`,
      `Ingested ${preset.additionalApplications.length} candidates. Total ${evaluatedApplications.length} active dossiers across India's 36 States & UTs.`
    );
  };

  // Handle Remove Individual Preset
  const handleRemovePreset = async (presetId: string) => {
    const updatedPresets = activePresets.filter((p) => p.id !== presetId);
    setActivePresets(updatedPresets);

    if (updatedPresets.length === 0) {
      await handleResetAllPresets();
      return;
    }

    const allPresetsApps = updatedPresets.flatMap((p) => p.additionalApplications || []);
    const uniqueMap = new Map<string, Application>();
    allPresetsApps.forEach((a) => uniqueMap.set(a.id, a));
    const mergedPool = Array.from(uniqueMap.values());

    const latestPreset = updatedPresets[updatedPresets.length - 1];
    const { updatedRules, evaluatedApplications } = evaluateAllWithPreset(
      mergedPool,
      latestPreset.parameters,
      rules
    );

    setRules(updatedRules);
    setApplications(evaluatedApplications);
    setActivePresetName(latestPreset.name);

    try {
      localStorage.setItem('aroha_active_preset_name', latestPreset.name);
      localStorage.setItem('aroha_active_presets', JSON.stringify(updatedPresets));
    } catch {
      // ignore
    }

    await StorageEngine.saveApplications(evaluatedApplications);

    addToast(
      'info',
      'Preset Removed',
      `Re-evaluated pipeline with remaining ${updatedPresets.length} preset(s) and ${evaluatedApplications.length} dossiers.`
    );
  };

  // Handle Custom JSON Preset Upload
  const handleUploadCustomPresetJson = async (jsonData: any) => {
    const params = {
      incomeCeiling: jsonData.parameters?.incomeCeiling ?? 800000,
      marksThreshold: jsonData.parameters?.marksThreshold ?? 55,
      totalSlots: jsonData.parameters?.totalSlots ?? 750,
      femaleQuota: jsonData.parameters?.femaleQuota ?? 30,
    };

    const presetName = jsonData.name || 'Custom Uploaded Preset';
    const extraApps: Application[] = Array.isArray(jsonData.additionalApplications) && jsonData.additionalApplications.length > 0
      ? jsonData.additionalApplications
      : [];

    const customPreset: PresetScenario = {
      id: `preset_json_${Date.now()}`,
      name: presetName,
      badge: 'JSON Ingestion',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      category: 'Uploaded JSON Cohort',
      description: jsonData.description || 'Uploaded custom JSON preset cohort.',
      parameters: params,
      additionalApplications: extraApps,
      keyHighlights: [`Ingests ${extraApps.length} candidates from uploaded JSON`],
    };

    await handleAddPreset(customPreset);
  };

  // Reset to Blank State (0 Presets, Zero False Data)
  const handleResetAllPresets = async () => {
    setApplications([]);
    setActivePresets([]);
    setRules(DEFAULT_SCHEME_RULES);
    setIsPresetUploaded(false);
    setActivePresetName(null);

    try {
      localStorage.removeItem('aroha_preset_uploaded');
      localStorage.removeItem('aroha_active_preset_name');
      localStorage.removeItem('aroha_active_presets');
      localStorage.removeItem('aroha_cached_apps');
    } catch {
      // ignore
    }

    await StorageEngine.clearAllApplications();

    addToast(
      'info',
      'Reset to Blank State',
      'All presets and candidate dossiers cleared. System is in 100% clean intake state.'
    );
  };

  // Authentication Handlers
  const handleLogin = (user: AuthUser) => {
    const normalizedRole: UserRole = user.role === 'applicant' ? 'student' : user.role;
    setCurrentUser(user);
    AuthService.setCurrentUser(user);
    setRole(normalizedRole);

    // Route to role-specific default tab
    if (normalizedRole === 'student') {
      setActiveTab('apply');
      if (user.associatedAppId) setSelectedAppId(user.associatedAppId);
    } else if (normalizedRole === 'officer') {
      setActiveTab('bulk_queue');
    } else if (normalizedRole === 'admin') {
      setActiveTab('command_center');
    } else if (normalizedRole === 'supervisor') {
      setActiveTab('executive_insights');
    }

    setShowAuthScreen(false);
    addToast('success', `Welcome, ${user.name}`, `Routed to ${normalizedRole.toUpperCase()} Portal.`);
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setShowAuthScreen(true);
    addToast('info', 'Logged Out', 'Returned to AROHA Portal Authentication.');
  };

  // Switch role dynamically from side panel
  const handleRoleChange = (newRole: UserRole) => {
    const normalized: UserRole = newRole === 'applicant' ? 'student' : newRole;
    setRole(normalized);
    const presets = AuthService.getDemoUsersForRole(normalized);
    if (presets.length > 0) {
      setCurrentUser(presets[0]);
      AuthService.setCurrentUser(presets[0]);
    }
    // Route to default tab of chosen role
    if (normalized === 'student') setActiveTab('apply');
    else if (normalized === 'officer') setActiveTab('bulk_queue');
    else if (normalized === 'admin') setActiveTab('command_center');
    else if (normalized === 'supervisor') setActiveTab('executive_insights');

    addToast('info', `Switched to ${normalized.toUpperCase()} Portal`, `Loaded active workspace for ${normalized}.`);
  };

  // Handle Bot quick navigation
  const handleBotNavigate = (targetTab: string) => {
    setActiveTab(targetTab as PortalTab);
  };

  const currentApplication = (applications && applications.length > 0)
    ? (applications.find((a) => a.id === selectedAppId) || applications[0])
    : null;

  // If user is not logged in: Render minimal, realistic forest background login portal
  if (showAuthScreen) {
    return (
      <>
        <AuthView
          onLogin={handleLogin}
          initialRole={role}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased relative selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Offline Status & Progress Banner */}
      <OfflineBanner
        isOnline={isOnline}
        isSyncing={isSyncing}
        syncProgress={syncProgress}
        queuedDocsCount={queuedDocsCount}
        onSyncNow={triggerSync}
        onToggleBackOnline={toggleSimulatedOffline}
      />

      {/* Main Workspace with ALL Tabs on Side Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* SIDE PANEL: Hosts ALL tabs and desks (No middle horizontal tabs!) */}
        <SidePanel
          currentRole={role}
          onRoleChange={handleRoleChange}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentUser={currentUser}
          onLogout={handleLogout}
          isOnline={isOnline}
          onToggleOffline={toggleSimulatedOffline}
          unreadCount={2}
        />

        {/* Right Main Content Canvas - Bright, Crisp & Colorful */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50/20 relative">
          
          {/* Top Quick Actions & Breadcrumb Bar */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2.5 text-xs flex-wrap">
              <span className="font-black text-indigo-500 uppercase tracking-wider font-mono">PORTAL:</span>
              <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black uppercase text-xs border border-emerald-300 shadow-xs">
                {role}
              </span>
              <span className="text-slate-300 font-bold">/</span>
              <span className="font-black text-indigo-900 capitalize text-sm tracking-wide">
                {activeTab.replace('_', ' ')}
              </span>

              {/* Logged in User: ONLY NAME, NO DESCRIPTION */}
              {currentUser && (
                <>
                  <span className="text-slate-300 font-bold hidden sm:inline">•</span>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 font-black text-xs border border-indigo-200 shadow-xs">
                    👤 {currentUser.name}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-xs flex-wrap">
              {/* Preset Upload & Controller Button */}
              <button
                type="button"
                onClick={() => setIsPresetModalOpen(true)}
                className={`px-4 py-2 rounded-2xl font-black transition cursor-pointer shadow-md flex items-center gap-1.5 ${
                  activePresets.length > 0
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-emerald-700/20'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-amber-600/20 animate-pulse'
                }`}
                title="Configure and add multiple presets one by one across India's 36 states"
              >
                <span>{activePresets.length > 0 ? `⚙️ Presets (${activePresets.length} Active)` : '➕ New Preset'}</span>
              </button>

              {/* Dynamic Live Parameter Controller */}
              <button
                type="button"
                onClick={() => setIsParamModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-indigo-900 border border-slate-300 font-black transition cursor-pointer shadow-xs flex items-center gap-1.5"
                title="Update system-wide policy parameters and dynamically recalculate all features"
              >
                <span>⚡ Parameters</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-black transition cursor-pointer shadow-xs"
              >
                ★ Scenarios
              </button>
              <button
                type="button"
                onClick={() => triggerSync({ showToast: true })}
                className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black transition cursor-pointer shadow-md shadow-indigo-600/20"
              >
                ↻ Cloud Sync
              </button>
            </div>
          </div>

          {/* Active Presets Multi-Ingestion Ribbon */}
          <div className="mb-6 p-4 rounded-3xl border shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white border-slate-200">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-black uppercase text-indigo-950 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${activePresets.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                Active Ingestion Presets:
              </span>

              {activePresets.length === 0 ? (
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                  0 Presets Active • Blank Intake Mode (Zero False Data)
                </span>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activePresets.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-950 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs"
                    >
                      <span className="truncate max-w-[150px]">{p.name}</span>
                      <span className="text-[10px] text-emerald-700 font-mono">
                        (+{p.additionalApplications?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePreset(p.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer ml-0.5"
                        title="Remove preset"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <span className="text-xs text-slate-500 font-semibold ml-1">
                    ({applications.length} total dossiers across India)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsPresetModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-xs hover:from-emerald-500 hover:to-indigo-500 transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>➕ {activePresets.length > 0 ? 'Add Another Preset' : 'New Preset Option'}</span>
              </button>
              {activePresets.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetAllPresets}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer"
                >
                  Reset to Blank
                </button>
              )}
            </div>
          </div>

          {/* VIEW SWITCHER FOR WORKSPACES & MODULES */}
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Feature 1: AROHA Command Center */}
            {activeTab === 'command_center' && (
              <CommandCenter
                applications={applications}
                onSelectApplication={(id) => {
                  setSelectedAppId(id);
                  setActiveTab('profile_360');
                }}
                onNavigateTab={(tab) => setActiveTab(tab as PortalTab)}
                onUpdateParameters={handleUpdateParameters}
                isPresetUploaded={activePresets.length > 0}
                activePresetName={activePresetName}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
                onResetToPreUploadState={handleResetAllPresets}
              />
            )}

            {/* Feature 2: GIS Scholarship Intelligence Map */}
            {activeTab === 'gis_map' && (
              <GISScholarshipMap
                applications={applications}
                onSelectApplication={(id) => {
                  setSelectedAppId(id);
                  setActiveTab('profile_360');
                }}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 3: What-If Policy Simulator */}
            {activeTab === 'policy_simulator' && (
              <PolicySimulator
                applications={applications}
                onApplyPolicyUpdate={handleUpdateParameters}
              />
            )}

            {/* Feature 4: Budget Forecasting Dashboard */}
            {activeTab === 'budget_forecast' && (
              <BudgetForecasting
                applications={applications}
                isPresetUploaded={activePresets.length > 0}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 5: AI Executive Insights Panel */}
            {activeTab === 'executive_insights' && (
              <ExecutiveInsights
                applications={applications}
                onSelectApplication={(id) => {
                  setSelectedAppId(id);
                  setActiveTab('profile_360');
                }}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 6: Government Decision Support Center */}
            {activeTab === 'decision_support' && (
              <DecisionSupportCenter
                applications={applications}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 7: Fraud & Risk Dashboard */}
            {activeTab === 'fraud_risk' && (
              <FraudRiskDashboard
                applications={applications}
                onSelectApplication={(id) => {
                  setSelectedAppId(id);
                  setActiveTab('profile_360');
                }}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 8: Applicant 360 Degree Profile */}
            {activeTab === 'profile_360' && (
              <Applicant360Profile
                application={currentApplication as Application}
                allApplications={applications}
                onSelectAnother={setSelectedAppId}
              />
            )}

            {/* Feature 9: SLA + Escalation Pipeline */}
            {activeTab === 'sla_pipeline' && (
              <SLAEscalationPipeline
                applications={applications}
                onSelectApplication={(id) => {
                  setSelectedAppId(id);
                  setActiveTab('profile_360');
                }}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 10: Officer Workload Dashboard */}
            {activeTab === 'officer_workload' && (
              <OfficerWorkloadDashboard
                applications={applications}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 11: Merit Ranking Leaderboard */}
            {activeTab === 'merit' && (
              <MeritRankingView
                applications={applications}
                onOpenApplication={(app) => setScrutinyModalApp(app)}
                isPresetUploaded={activePresets.length > 0}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 12: No-Code Rule Builder */}
            {activeTab === 'rule_builder' && (
              <NoCodeRuleBuilder applications={applications} />
            )}

            {/* Feature 13: Cross-Scheme Recommendation Cards */}
            {activeTab === 'cross_scheme' && (
              <CrossSchemeRecommender
                application={currentApplication || undefined}
                onApplyAlternative={(scheme) => {
                  addToast('info', 'Scheme Selected', `Initiated application for ${scheme}.`);
                  setActiveTab('apply');
                }}
              />
            )}

            {/* Feature 14: Predictive Analytics Charts */}
            {activeTab === 'predictive_analytics' && (
              <PredictiveAnalytics
                applications={applications}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 15: Application Version Timeline */}
            {activeTab === 'timeline' && (
              <VersionTimeline
                applicationId={currentApplication?.applicationNumber || 'N/A'}
                applicantName={currentApplication?.applicant?.fullName || 'N/A'}
              />
            )}

            {/* Feature 16: Side-by-Side Document Comparison Viewer */}
            {activeTab === 'doc_compare' && (
              <DocumentComparisonViewer 
                application={currentApplication || undefined}
                allApplications={applications}
                selectedAppId={selectedAppId}
                onSelectApplication={setSelectedAppId}
              />
            )}

            {/* Feature 17: Automated MIS Report Generator */}
            {activeTab === 'mis_report' && (
              <MISReportGenerator
                applications={applications}
                onOpenPresetModal={() => setIsPresetModalOpen(true)}
              />
            )}

            {/* Feature 18: Bulk Verification Queue */}
            {activeTab === 'bulk_queue' && (
              <BulkVerificationQueue
                applications={applications}
                onBatchApprove={handleBatchApprove}
                onSelectApplication={(id) => {
                  setSelectedAppId(id);
                  setActiveTab('profile_360');
                }}
              />
            )}

            {/* Feature 19: Notification Center */}
            {activeTab === 'notifications' && (
              <NotificationCenter
                currentRole={role}
                onNavigateToTab={(t) => setActiveTab(t as PortalTab)}
              />
            )}

            {/* Student Base: Application Form */}
            {activeTab === 'apply' && (
              <MultiStepForm
                isOnline={isOnline}
                onSubmitSuccess={handleApplicationSubmitted}
                onToast={addToast}
              />
            )}

            {/* Student Base: Track Status & DBT */}
            {activeTab === 'track' && (
              <StatusTracker
                applications={applications}
                selectedAppId={selectedAppId}
                onSelectApplication={setSelectedAppId}
                onResolveDeficiency={handleResolveDeficiency}
                isOnline={isOnline}
                onToast={addToast}
              />
            )}

            {/* Student Base: Scheme Guidelines */}
            {activeTab === 'guidelines' && <SchemeGuidelines />}

            {/* Officer Base: Scrutiny Queue */}
            {activeTab === 'scrutiny' && (
              <ScrutinyQueue
                applications={applications}
                onOpenScrutiny={(app) => setScrutinyModalApp(app)}
                onRejectApplication={handleRejectWithStatutoryClause}
                onApproveApplication={handleApproveFromScrutiny}
              />
            )}

            {/* Officer Base: Rejections Desk */}
            {activeTab === 'rejections' && (
              <RejectionDesk
                applications={applications}
                onOpenApplication={(app) => setScrutinyModalApp(app)}
                onRejectApplication={handleRejectWithStatutoryClause}
              />
            )}

            {/* Officer Base: Field Verification */}
            {activeTab === 'field_verification' && (
              <FieldVerificationDesk
                applications={applications}
                onOpenApplication={(app) => setScrutinyModalApp(app)}
                onToast={addToast}
              />
            )}

            {/* Heritage Gallery */}
            {activeTab === 'tribal_heritage' && (
              <TribalHeritageGallery lang={lang} />
            )}
          </div>
        </main>
      </div>

      {/* Scrutiny Modal */}
      {scrutinyModalApp && (
        <ScrutinyModal
          application={scrutinyModalApp}
          onClose={() => setScrutinyModalApp(null)}
          onApprove={handleApproveFromScrutiny}
          onIssueDeficiency={handleIssueDeficiencyFromScrutiny}
          onReject={handleRejectFromScrutiny}
        />
      )}

      {/* Demo Preset Scenarios Modal */}
      <DemoScenariosModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectScenario={(scenarioId) => {
          if (scenarioId === 'scenario_clean_nfst') {
            setSelectedAppId('app_nfst_001');
            setActiveTab('profile_360');
          } else if (scenarioId === 'scenario_deficiency_nos') {
            setSelectedAppId('app_nos_002');
            setActiveTab('track');
          } else if (scenarioId === 'scenario_scrutiny_desk') {
            setRole('officer');
            setActiveTab('bulk_queue');
          } else if (scenarioId === 'scenario_merit_ranking') {
            setRole('admin');
            setActiveTab('merit');
          }
          setIsDemoModalOpen(false);
        }}
      />

      {/* Live Parameter Controller Modal */}
      <LiveParameterModal
        isOpen={isParamModalOpen}
        onClose={() => setIsParamModalOpen(false)}
        applications={applications}
        onApplyUpdate={handleUpdateParameters}
      />

      {/* Preset Upload Modal: multi-preset ingestion & curated scenarios */}
      <PresetUploadModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        activePresets={activePresets}
        onAddPreset={handleAddPreset}
        onRemovePreset={handleRemovePreset}
        onUploadCustomPresetJson={handleUploadCustomPresetJson}
        onResetAllPresets={handleResetAllPresets}
      />

      {/* Floating Micro-Interaction Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Interactive Conversational Assistant Bot (AROHA Mitra) */}
      <ArohaMitraBot lang={lang} onNavigateTab={handleBotNavigate} />
    </div>
  );
}
