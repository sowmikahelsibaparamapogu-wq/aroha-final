import React, { useState } from 'react';
import { 
  BarChart3, 
  MapPin, 
  Sliders, 
  IndianRupee, 
  Sparkles, 
  Scale, 
  ShieldAlert, 
  User, 
  Clock, 
  Users, 
  Award, 
  Code, 
  Percent, 
  TrendingUp, 
  History, 
  Columns2, 
  FileText, 
  CheckSquare, 
  Bell, 
  GraduationCap, 
  ShieldCheck, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Wifi,
  WifiOff,
  Palette,
  HelpCircle,
  Globe,
  ChevronDown
} from 'lucide-react';
import { UserRole, AuthUser } from '../types/scholarship';
import { Avatar } from './Avatar';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../utils/translations';
import { PortalLogo } from './PortalLogo';

export type PortalTab = 
  | 'command_center'
  | 'gis_map'
  | 'policy_simulator'
  | 'budget_forecast'
  | 'executive_insights'
  | 'decision_support'
  | 'fraud_risk'
  | 'profile_360'
  | 'sla_pipeline'
  | 'officer_workload'
  | 'merit'
  | 'rule_builder'
  | 'cross_scheme'
  | 'predictive_analytics'
  | 'timeline'
  | 'doc_compare'
  | 'mis_report'
  | 'bulk_queue'
  | 'notifications'
  | 'apply'
  | 'track'
  | 'guidelines'
  | 'scrutiny'
  | 'rejections'
  | 'field_verification'
  | 'tribal_heritage';

interface SidePanelProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: PortalTab;
  onSelectTab: (tab: PortalTab) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  isOnline: boolean;
  onToggleOffline: () => void;
  unreadCount?: number;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  isOnline,
  onToggleOffline,
  unreadCount = 2,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { lang, setLanguage, t } = useLanguage();

  // Normalize role
  const resolvedRole: UserRole = currentRole === 'applicant' ? 'student' : currentRole;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  // Role-specific primary operational tabs with clear titles and rich icons
  const getPrimaryTabsForRole = () => {
    switch (resolvedRole) {
      case 'student':
        return [
          { id: 'apply', label: 'Scholarship Application', icon: GraduationCap },
          { id: 'track', label: 'Status & Direct Benefit', icon: IndianRupee },
          { id: 'profile_360', label: 'Applicant 360° Dossier', icon: User },
          { id: 'cross_scheme', label: 'Cross-Scheme Navigator', icon: Percent },
          { id: 'guidelines', label: 'Scheme Guidelines', icon: HelpCircle },
          { id: 'tribal_heritage', label: 'Tribal Heritage Gallery', icon: Palette },
        ];
      case 'officer':
        return [
          { id: 'bulk_queue', label: 'Batch Verification Desk', icon: CheckSquare },
          { id: 'scrutiny', label: 'AI Scrutiny Desk', icon: ShieldCheck },
          { id: 'doc_compare', label: 'Document Studio', icon: Columns2 },
          { id: 'sla_pipeline', label: 'SLA Escalation Radar', icon: Clock },
          { id: 'rejections', label: 'Deficiencies Desk', icon: ShieldAlert },
          { id: 'field_verification', label: 'Field Verification Desk', icon: MapPin },
          { id: 'timeline', label: 'Application Version Timeline', icon: History },
        ];
      case 'admin':
        return [
          { id: 'command_center', label: 'Command Center', icon: BarChart3 },
          { id: 'rule_builder', label: 'Eligibility Rules Architect', icon: Code },
          { id: 'policy_simulator', label: 'Policy Impact Simulator', icon: Sliders },
          { id: 'merit', label: 'Merit Ranking Leaderboard', icon: Award },
          { id: 'gis_map', label: 'Geographic Intelligence', icon: MapPin },
          { id: 'fraud_risk', label: 'Risk & Integrity Sentinel', icon: ShieldAlert },
          { id: 'budget_forecast', label: 'Budget Allocation Radar', icon: IndianRupee },
          { id: 'mis_report', label: 'Automated MIS Reports', icon: FileText },
        ];
      case 'supervisor':
        return [
          { id: 'command_center', label: 'Executive Overview', icon: BarChart3 },
          { id: 'executive_insights', label: 'Strategic AI Insights', icon: Sparkles },
          { id: 'decision_support', label: 'Decision Matrix Center', icon: Scale },
          { id: 'officer_workload', label: 'Officer Workload Capacity', icon: Users },
          { id: 'predictive_analytics', label: 'Predictive Demand Forecasts', icon: TrendingUp },
          { id: 'profile_360', label: 'Applicant 360° Dossier', icon: User },
          { id: 'mis_report', label: 'Performance MIS Reports', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const primaryTabs = getPrimaryTabsForRole();

  return (
    <aside
      className={`bg-gradient-to-b from-red-900 via-rose-950 to-red-950 text-white flex flex-col justify-between shrink-0 transition-all duration-300 border-r border-red-800/80 relative z-30 shadow-2xl font-['Inter',sans-serif] ${
        collapsed ? 'w-20' : 'w-72 sm:w-80'
      }`}
    >
      {/* Top Header - Regal Red Theme with AROHA MoTA in Inter font */}
      <div className="p-4 sm:p-5 border-b border-red-800/60 space-y-3.5 bg-red-950/60">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <PortalLogo portal="aroha" size="sm" />
              <div>
                <div className="text-lg font-black text-white tracking-widest font-sans bg-white/15 backdrop-blur-md px-3 py-0.5 rounded-xl border border-white/20 inline-block shadow-2xs">
                  AROHA
                </div>
                <div className="text-[10px] text-red-200/90 font-bold uppercase tracking-wider font-sans mt-0.5">
                  MoTA National Portal
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-red-100 hover:text-white border border-red-700/80 transition cursor-pointer shadow-xs"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-red-200" />}
          </button>
        </div>

        {/* Current Active Portal Indicator with Light Coloured Colorful Logo */}
        {!collapsed ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
            <div className="flex items-center gap-2.5">
              <PortalLogo portal={resolvedRole} size="xs" />
              <div>
                <span className="text-xs font-black uppercase text-white tracking-wider font-sans block leading-tight">
                  {resolvedRole === 'student' ? 'Scholar Portal' :
                   resolvedRole === 'officer' ? 'Scrutiny Portal' :
                   resolvedRole === 'admin' ? 'Admin Portal' : 'Supervisor Portal'}
                </span>
                <span className="text-[9px] font-semibold text-rose-200/90 uppercase tracking-widest">
                  Active Workspace
                </span>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse shrink-0" />
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <PortalLogo portal={resolvedRole} size="xs" />
          </div>
        )}

        {/* Embedded Language Switcher directly in Side Panel */}
        {!collapsed ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-red-900/60 hover:bg-red-900 border border-red-700/80 text-white text-xs font-bold transition cursor-pointer shadow-xs font-['Inter',sans-serif]"
              title="Switch portal interface language"
            >
              <div className="flex items-center gap-2 truncate">
                <Globe className="w-4 h-4 text-red-300 shrink-0" />
                <span className="truncate">{currentLangObj.nativeName} ({currentLangObj.label})</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-red-300 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-stone-900 border border-red-700/80 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-stone-800 animate-in fade-in font-['Inter',sans-serif]">
                <div className="px-3 py-1 text-[10px] font-black uppercase text-red-300/80 tracking-wider">
                  Select Language (29 Languages)
                </div>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                      lang === l.code
                        ? 'bg-red-800 text-white font-black'
                        : 'text-stone-200 hover:bg-stone-800 font-semibold'
                    }`}
                  >
                    <span>{l.nativeName} <span className="text-[11px] text-stone-400 font-normal">({l.label})</span></span>
                    <span className="text-[10px] text-red-300 font-mono font-bold uppercase">{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setCollapsed(false);
                setIsLangOpen(true);
              }}
              className="p-2 rounded-xl bg-red-900/80 border border-red-700 text-red-200 hover:bg-red-800 hover:text-white transition cursor-pointer"
              title={`Language: ${currentLangObj.nativeName}`}
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* User Profile Card - Red Theme */}
      {currentUser && !collapsed && (
        <div className="mx-3.5 my-2 p-3 bg-red-950/70 rounded-2xl border border-red-800/80 flex items-center gap-3">
          <Avatar
            type={currentUser.avatarType}
            name={currentUser.name}
            role={currentUser.role}
            size="md"
          />
          <div className="overflow-hidden">
            <div className="text-xs font-black text-white truncate tracking-wide font-['Inter',sans-serif]">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-red-200 font-semibold capitalize truncate font-['Inter',sans-serif]">
              {currentUser.designation || `Authorized ${currentUser.role}`}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs List: Red Theme Aesthetic with High Contrast */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-1.5 font-medium">
        <div className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-red-300/80 font-['Inter',sans-serif]">
          {!collapsed ? `${resolvedRole.toUpperCase()} OPERATIONS` : '•••'}
        </div>

        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id as PortalTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition cursor-pointer text-left text-sm font-['Inter',sans-serif] ${
                isActive
                  ? 'bg-white text-red-950 font-black border border-white shadow-lg shadow-black/25'
                  : 'text-red-100/90 hover:text-white hover:bg-red-800/60 font-semibold'
              }`}
              title={tab.label}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-red-700' : 'text-red-300'}`} />
                {!collapsed && (
                  <span className="truncate text-xs sm:text-[13.5px] font-bold tracking-tight">
                    {tab.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Live Notification Stream */}
        <button
          type="button"
          onClick={() => onSelectTab('notifications')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition cursor-pointer text-left mt-2.5 text-sm font-['Inter',sans-serif] ${
            activeTab === 'notifications'
              ? 'bg-white text-red-950 font-black border border-white shadow-lg shadow-black/25'
              : 'text-red-100/90 hover:text-white hover:bg-red-800/60 font-semibold'
          }`}
          title="Live Notifications & Alerts Stream"
        >
          <div className="flex items-center gap-3 truncate">
            <Bell className={`w-4 h-4 shrink-0 ${activeTab === 'notifications' ? 'text-red-700' : 'text-red-300'}`} />
            {!collapsed && (
              <span className="text-xs sm:text-[13.5px] font-bold tracking-tight">
                Notifications & Alerts
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 font-black shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Bottom Utility Controls - Red Theme with clearance for bottom-left bot */}
      <div className="p-3.5 pb-20 border-t border-red-800/70 space-y-2 bg-red-950/80 font-['Inter',sans-serif]">
        {/* Offline Mode Switch */}
        <button
          type="button"
          onClick={onToggleOffline}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
            !isOnline
              ? 'bg-amber-400 text-stone-900 border-amber-300 hover:bg-amber-300'
              : 'bg-red-900/60 text-red-100 border-red-700/80 hover:bg-red-900 hover:text-white shadow-2xs'
          }`}
          title="Toggle Offline-First Mode"
        >
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <WifiOff className="w-4 h-4 text-stone-900 animate-pulse" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-400" />
            )}
            {!collapsed && (
              <span className="font-bold">
                {!isOnline ? 'Tribal Offline Active' : 'Online Sync Active'}
              </span>
            )}
          </div>
        </button>

        {/* Sign Out / Switch Portal */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-red-100 hover:text-white bg-red-900/60 hover:bg-rose-900/90 border border-red-700/80 hover:border-red-600 transition cursor-pointer shadow-2xs"
          title="Sign out and return to Portal Login"
        >
          <LogOut className="w-4 h-4 text-red-300" />
          {!collapsed && <span>Switch Portal / Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
