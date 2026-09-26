import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Filter, 
  CheckCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { AppNotification, UserRole } from '../types/scholarship';

interface NotificationCenterProps {
  currentRole?: UserRole;
  onNavigateToTab?: (tab: string) => void;
}

const SEEDED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'sla_breach',
    title: 'Statutory 15-Day SLA Breach Notice',
    message: 'Application NFST/2025/0812 (Sowmika Helsiba) has completed 14 days in scrutiny stage without final order.',
    timestamp: '10 minutes ago',
    read: false,
    priority: 'urgent',
    roleTarget: 'officer',
  },
  {
    id: 'notif_2',
    type: 'dbt',
    title: 'Monthly PFMS DBT Credit Disbursed',
    message: 'Tranche #12 for ₹37,000 successfully credited to Aadhaar-linked Bank account.',
    timestamp: '2 hours ago',
    read: false,
    priority: 'high',
    roleTarget: 'student',
  },
  {
    id: 'notif_3',
    type: 'approval',
    title: 'National Merit Board Sanction Order Issued',
    message: 'Your candidature for Ph.D. fellowship in Biotechnology has been formally ratified by the Apex Screening Committee.',
    timestamp: 'Yesterday',
    read: true,
    priority: 'high',
    roleTarget: 'student',
  },
  {
    id: 'notif_4',
    type: 'deficiency',
    title: 'Deficiency Rectification Uploaded by Scholar',
    message: 'Candidate Arjun Oraon uploaded replacement revenue caste certificate with SDM digital seal.',
    timestamp: 'Yesterday',
    read: false,
    priority: 'medium',
    roleTarget: 'officer',
  },
  {
    id: 'notif_5',
    type: 'system',
    title: 'Cabinet BE Supplementary Budget Advisory',
    message: 'Parliamentary Committee approved ₹15.5 Cr supplementary allocation for overseas NOS university tuition.',
    timestamp: '2 days ago',
    read: true,
    priority: 'low',
    roleTarget: 'admin',
  },
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  currentRole,
  onNavigateToTab,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEEDED_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = notifications.filter(
    (n) => filterType === 'ALL' || n.type === filterType
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-emerald-700" />
            <span>Real-Time Alert Dispatcher</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Notifications & Alerts Stream
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            {unreadCount} Unread Alerts
          </span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {['ALL', 'sla_breach', 'dbt', 'approval', 'deficiency', 'system'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterType === t
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t === 'ALL' ? 'All Alerts' : t.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => markAsRead(item.id)}
            className={`p-5 rounded-3xl border transition cursor-pointer flex items-start justify-between gap-4 shadow-sm ${
              !item.read
                ? 'bg-white border-emerald-300 ring-1 ring-emerald-500/20'
                : 'bg-slate-50/70 border-slate-200 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  item.type === 'sla_breach' ? 'bg-rose-100 text-rose-700' :
                  item.type === 'dbt' ? 'bg-blue-100 text-blue-700' :
                  item.type === 'approval' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.type === 'sla_breach' && <AlertTriangle className="w-5 h-5" />}
                {item.type === 'dbt' && <IndianRupee className="w-5 h-5" />}
                {item.type === 'approval' && <CheckCircle2 className="w-5 h-5" />}
                {item.type === 'deficiency' && <Clock className="w-5 h-5" />}
                {item.type === 'system' && <Bell className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold font-roman text-slate-900">
                    {item.title}
                  </h3>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    item.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                    item.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {item.message}
                </p>

                <div className="text-[11px] text-slate-400 mt-2 font-medium">
                  {item.timestamp}
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
          </div>
        ))}
      </div>
    </div>
  );
};
