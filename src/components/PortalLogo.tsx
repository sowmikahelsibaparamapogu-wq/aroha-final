import React from 'react';
import { GraduationCap, ShieldCheck, Settings, Compass, Award, Sparkles } from 'lucide-react';
import { UserRole } from '../types/scholarship';

export interface PortalLogoConfig {
  id: string;
  name: string;
  shortName: string;
  roleLabel: string;
  bgGradient: string;
  borderColor: string;
  iconColor: string;
  accentDot: string;
  badgeBg: string;
  badgeText: string;
}

export const PORTAL_CONFIGS: Record<string, PortalLogoConfig> = {
  student: {
    id: 'student',
    name: 'Scholar Application Portal',
    shortName: 'Scholar Portal',
    roleLabel: 'ST Candidate',
    bgGradient: 'from-emerald-100 via-teal-50 to-green-100',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-700',
    accentDot: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-900',
  },
  applicant: {
    id: 'applicant',
    name: 'Scholar Application Portal',
    shortName: 'Scholar Portal',
    roleLabel: 'ST Candidate',
    bgGradient: 'from-emerald-100 via-teal-50 to-green-100',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-700',
    accentDot: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-900',
  },
  officer: {
    id: 'officer',
    name: 'Scrutiny Desk Portal',
    shortName: 'Scrutiny Portal',
    roleLabel: 'Verification Officer',
    bgGradient: 'from-sky-100 via-indigo-50 to-blue-100',
    borderColor: 'border-indigo-200',
    iconColor: 'text-indigo-700',
    accentDot: 'bg-indigo-500',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    badgeText: 'text-indigo-900',
  },
  admin: {
    id: 'admin',
    name: 'Executive Admin Portal',
    shortName: 'Admin Portal',
    roleLabel: 'System Administrator',
    bgGradient: 'from-amber-100 via-yellow-50 to-orange-100',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-700',
    accentDot: 'bg-amber-500',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-900',
  },
  supervisor: {
    id: 'supervisor',
    name: 'Apex Supervisory Portal',
    shortName: 'Supervisor Portal',
    roleLabel: 'Apex Authority',
    bgGradient: 'from-violet-100 via-purple-50 to-pink-100',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-700',
    accentDot: 'bg-purple-500',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    badgeText: 'text-purple-900',
  },
};

interface PortalLogoProps {
  portal: UserRole | 'student' | 'officer' | 'admin' | 'supervisor' | 'applicant' | 'aroha';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withLabel?: boolean;
  withSubtitle?: boolean;
  className?: string;
  layout?: 'row' | 'col';
}

export const PortalLogo: React.FC<PortalLogoProps> = ({
  portal,
  size = 'md',
  withLabel = false,
  withSubtitle = false,
  className = '',
  layout = 'row',
}) => {
  if (portal === 'aroha') {
    const sizeClasses = {
      xs: 'w-7 h-7 text-xs',
      sm: 'w-9 h-9 text-sm',
      md: 'w-11 h-11 text-base',
      lg: 'w-14 h-14 text-lg',
      xl: 'w-16 h-16 text-xl',
    };

    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <div
          className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 border border-emerald-300/80 shadow-md flex items-center justify-center shrink-0 relative overflow-hidden`}
        >
          {/* Subtle multi-hue decorative rings */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 via-transparent to-amber-400/20 pointer-events-none" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3/5 h-3/5 text-emerald-800"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <path d="m19 12-4-4 4-4" />
            <path d="m5 12 4 4-4 4" />
          </svg>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-amber-950 font-black text-[8px] flex items-center justify-center border border-white shadow-2xs">
            AI
          </span>
        </div>
        {withLabel && (
          <div>
            <div className="text-xl sm:text-2xl font-black tracking-widest text-emerald-950 uppercase font-sans">
              AROHA
            </div>
            {withSubtitle && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/80">
                MoTA National Portal
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const config = PORTAL_CONFIGS[portal] || PORTAL_CONFIGS.student;

  const sizeClasses = {
    xs: { box: 'w-6 h-6 rounded-lg', icon: 'w-3.5 h-3.5' },
    sm: { box: 'w-8 h-8 rounded-xl', icon: 'w-4 h-4' },
    md: { box: 'w-10 h-10 rounded-2xl', icon: 'w-5 h-5' },
    lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7' },
    xl: { box: 'w-16 h-16 rounded-3xl', icon: 'w-8 h-8' },
  };

  const currentSize = sizeClasses[size];

  const renderIcon = () => {
    switch (portal) {
      case 'student':
      case 'applicant':
        return <GraduationCap className={`${currentSize.icon} ${config.iconColor}`} />;
      case 'officer':
        return <ShieldCheck className={`${currentSize.icon} ${config.iconColor}`} />;
      case 'admin':
        return <Settings className={`${currentSize.icon} ${config.iconColor}`} />;
      case 'supervisor':
        return <Compass className={`${currentSize.icon} ${config.iconColor}`} />;
      default:
        return <Award className={`${currentSize.icon} ${config.iconColor}`} />;
    }
  };

  return (
    <div
      className={`inline-flex ${
        layout === 'col' ? 'flex-col items-center text-center' : 'items-center text-left'
      } gap-2.5 ${className}`}
    >
      {/* Light Coloured Colorful Logo Box */}
      <div
        className={`${currentSize.box} bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} shadow-sm flex items-center justify-center shrink-0 relative transition-transform duration-200 hover:scale-105`}
      >
        {/* Soft luminous ambient dot */}
        <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${config.accentDot} border-2 border-white shadow-xs`} />
        {renderIcon()}
      </div>

      {withLabel && (
        <div className="leading-tight">
          <div className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <span>{config.shortName}</span>
          </div>
          {withSubtitle && (
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              {config.roleLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
