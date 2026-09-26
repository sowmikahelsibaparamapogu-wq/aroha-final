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
  Settings, 
  Compass, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Wifi,
  WifiOff,
  Palette,
  HelpCircle,
  Layers
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

  // Role-specific primary operational tabs (Distinct names, strictly NO mention of "features")
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

  // Role-specific divided operations (strictly NO cross-portal operations)
  const getDividedOperationsForRole = () => {
    switch (resolvedRole) {
      case 'student':
        return [
          { id: 'apply', label: 'Apply Scholarship' },
          { id: 'track', label: 'Track DBT Status' },
          { id: 'profile_360', label: '360° Dossier' },
          { id: 'cross_scheme', label: 'Scheme Eligibility' },
          { id: 'guidelines', label: 'Statutory Guidelines' },
          { id: 'tribal_heritage', label: 'Heritage Gallery' },
        ];
      case 'officer':
        return [
          { id: 'bulk_queue', label: 'Batch Desk' },
          { id: 'scrutiny', label: 'AI Scrutiny Desk' },
          { id: 'doc_compare', label: 'Document Studio' },
          { id: 'sla_pipeline', label: 'SLA Escalations' },
          { id: 'rejections', label: 'Deficiencies Desk' },
          { id: 'field_verification', label: 'Field Inquest' },
          { id: 'timeline', label: 'Audit Timeline' },
        ];
      case 'admin':
        return [
          { id: 'command_center', label: 'Command Center' },
          { id: 'rule_builder', label: 'Rules Architect' },
          { id: 'policy_simulator', label: 'Policy Simulator' },
          { id: 'merit', label: 'Merit Leaderboard' },
          { id: 'gis_map', label: 'Geographic Map' },
          { id: 'fraud_risk', label: 'Fraud Sentinel' },
          { id: 'budget_forecast', label: 'Budget Radar' },
          { id: 'mis_report', label: 'Automated MIS' },
        ];
      case 'supervisor':
        return [
          { id: 'executive_insights', label: 'Executive Insights' },
          { id: 'decision_support', label: 'Decision Matrix' },
          { id: 'command_center', label: 'Executive Overview' },
          { id: 'officer_workload', label: 'Workload Capacity' },
          { id: 'predictive_analytics', label: 'Demand Forecasts' },
          { id: 'profile_360', label: 'Priority Dossier' },
          { id: 'mis_report', label: 'Performance MIS' },
        ];
      default:
        return [];
    }
  };

  const dividedOperations = getDividedOperationsForRole();

  return (
    <aside
      className={`bg-[#065f46] text-white flex flex-col justify-between shrink-0 transition-all duration-300 border-r border-emerald-700/50 relative z-30 shadow-2xl ${
        collapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-white/20 space-y-3">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-black text-lg flex items-center justify-center shadow-lg border border-white/40">
                अ
              </div>
              <div>
                <div className="text-sm font-black text-white tracking-wide">
                  AROHA MoTA
                </div>
                <div className="text-[10px] text-white/90 font-bold uppercase tracking-wider">
                  National Portal
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/30 text-white border border-white/30 transition cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-white" />}
          </button>
        </div>

        {/* Current Active Portal Indicator (No 4 portal switcher tabs inside active portal) */}
        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/15 border border-white/25">
            <span className="text-[11px] font-black uppercase text-white tracking-wider">
              {resolvedRole} Workspace
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          </div>
        )}
      </div>

      {/* User Profile Card (Just Name of Logged-In User, NO Description) */}
      {currentUser && !collapsed && (
        <div className="px-4 py-3 bg-white/10 border-b border-white/20 flex items-center gap-3">
          <Avatar
            type={currentUser.avatarType}
            name={currentUser.name}
            role={currentUser.role}
            size="sm"
          />
          <div className="overflow-hidden">
            <div className="text-sm font-black text-white truncate tracking-wide">
              {currentUser.name}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs List (All on Side Panel, Only White Text) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs font-medium">
        <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-white">
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
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer text-left text-xs ${
                isActive
                  ? 'bg-emerald-700 text-white font-black border-2 border-white shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/15'
              }`}
              title={tab.label}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className="w-4 h-4 shrink-0 text-white" />
                {!collapsed && <span className="truncate font-bold">{tab.label}</span>}
              </div>
            </button>
          );
        })}

        {/* Live Notification Stream */}
        <button
          type="button"
          onClick={() => onSelectTab('notifications')}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer text-left mt-2 text-xs ${
            activeTab === 'notifications'
              ? 'bg-emerald-700 text-white font-black border-2 border-white'
              : 'text-white/90 hover:text-white hover:bg-white/15'
          }`}
          title="Live Notifications & Alerts Stream"
        >
          <div className="flex items-center gap-3 truncate">
            <Bell className="w-4 h-4 text-white shrink-0" />
            {!collapsed && <span className="font-bold">Notifications & Alerts</span>}
          </div>
          {unreadCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-black border border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Role-Specific Divided Operations on Side Panel (Strictly separated per portal, ZERO cross-portal pollution) */}
        {!collapsed && (
          <div className="pt-3 border-t border-white/20 mt-2">
            <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5 truncate">
                <Layers className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">{resolvedRole.toUpperCase()} OPERATIONS</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold shrink-0">
                PORTAL DESK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs pt-1.5">
              {dividedOperations.map((desk) => (
                <button
                  key={desk.id}
                  type="button"
                  onClick={() => onSelectTab(desk.id as PortalTab)}
                  className={`p-2 rounded-xl text-left truncate text-[11px] font-bold transition cursor-pointer border ${
                    activeTab === desk.id
                      ? 'bg-emerald-700 text-white border-2 border-white shadow-md'
                      : 'bg-white/10 hover:bg-white/25 text-white/95 border-white/20'
                  }`}
                  title={desk.label}
                >
                  <span className="truncate block">{desk.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Utility Controls */}
      <div className="p-3 border-t border-white/20 space-y-2 bg-[#065f46]">
        {/* Offline Mode Switch */}
        <button
          type="button"
          onClick={onToggleOffline}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
            !isOnline
              ? 'bg-amber-600/80 text-white border-white'
              : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
          }`}
          title="Toggle Offline-First Mode"
        >
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <WifiOff className="w-4 h-4 text-white animate-pulse" />
            ) : (
              <Wifi className="w-4 h-4 text-white" />
            )}
            {!collapsed && <span className="text-white">{!isOnline ? 'Tribal Offline Active' : 'Online Sync Active'}</span>}
          </div>
        </button>

        {/* Sign Out / Switch Portal */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-black text-white hover:bg-white/20 border border-white/30 transition cursor-pointer"
          title="Sign out and return to Forest Portal Login"
        >
          <LogOut className="w-4 h-4 text-white" />
          {!collapsed && <span className="text-white">Switch Portal / Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
