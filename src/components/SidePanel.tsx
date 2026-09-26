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
  HelpCircle
} from 'lucide-react';
import { UserRole, AuthUser } from '../types/scholarship';
import { Avatar } from './Avatar';

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

  // Normalize role
  const resolvedRole: UserRole = currentRole === 'applicant' ? 'student' : currentRole;

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
      className={`bg-slate-900 text-slate-100 flex flex-col justify-between shrink-0 transition-all duration-300 border-r border-slate-800 relative z-30 shadow-2xl ${
        collapsed ? 'w-20' : 'w-72 sm:w-80'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 space-y-3.5 bg-slate-950/60">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-lg border border-indigo-400/40">
                अ
              </div>
              <div>
                <div className="text-base font-black text-white tracking-wide">
                  AROHA MoTA
                </div>
                <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                  National Portal
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer shadow-sm"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5 text-indigo-400" /> : <ChevronLeft className="w-5 h-5 text-slate-300" />}
          </button>
        </div>

        {/* Current Active Portal Indicator */}
        {!collapsed && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 shadow-inner">
            <span className="text-xs font-black uppercase text-indigo-300 tracking-wider">
              {resolvedRole} Workspace
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] animate-pulse" />
          </div>
        )}
      </div>

      {/* User Profile Card */}
      {currentUser && !collapsed && (
        <div className="px-5 py-3.5 bg-slate-800/40 border-b border-slate-800 flex items-center gap-3">
          <Avatar
            type={currentUser.avatarType}
            name={currentUser.name}
            role={currentUser.role}
            size="md"
          />
          <div className="overflow-hidden">
            <div className="text-sm font-black text-white truncate tracking-wide">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-400 font-semibold capitalize">
              Authorized {currentUser.role}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs List: Big, Crisp Fonts with Modern High-Contrast Palette (No Green) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2 font-medium">
        <div className="px-2.5 py-1 text-xs font-black uppercase tracking-wider text-slate-400">
          {!collapsed ? `${resolvedRole.toUpperCase()} DESK WORKSPACE` : '•••'}
        </div>

        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id as PortalTab)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition cursor-pointer text-left text-sm ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold border border-indigo-400/50 shadow-lg shadow-indigo-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-semibold'
              }`}
              title={tab.label}
            >
              <div className="flex items-center gap-3.5 truncate">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                {!collapsed && (
                  <span className="truncate text-sm sm:text-[14.5px] font-bold tracking-tight">
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
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition cursor-pointer text-left mt-3 text-sm ${
            activeTab === 'notifications'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold border border-indigo-400/50 shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-semibold'
          }`}
          title="Live Notifications & Alerts Stream"
        >
          <div className="flex items-center gap-3.5 truncate">
            <Bell className={`w-5 h-5 shrink-0 ${activeTab === 'notifications' ? 'text-white' : 'text-indigo-400'}`} />
            {!collapsed && (
              <span className="text-sm sm:text-[14.5px] font-bold tracking-tight">
                Notifications & Alerts
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black border border-rose-400 shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Bottom Utility Controls (Clean and Minimalist, No Portal Desk Operations) */}
      <div className="p-3.5 border-t border-slate-800 space-y-2 bg-slate-950/70">
        {/* Offline Mode Switch */}
        <button
          type="button"
          onClick={onToggleOffline}
          className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
            !isOnline
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
          title="Toggle Offline-First Mode"
        >
          <div className="flex items-center gap-2.5">
            {!isOnline ? (
              <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
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
          className="w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-black text-slate-300 hover:text-white hover:bg-rose-950/40 border border-slate-700 hover:border-rose-600/50 transition cursor-pointer"
          title="Sign out and return to Portal Login"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          {!collapsed && <span>Switch Portal / Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
