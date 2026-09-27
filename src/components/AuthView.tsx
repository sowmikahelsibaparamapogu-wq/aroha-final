import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Settings, 
  Compass, 
  ArrowRight, 
  Lock, 
  User, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AuthUser, UserRole } from '../types/scholarship';
import { 
  DEMO_STUDENTS, 
  DEMO_OFFICERS, 
  DEMO_ADMINS, 
  DEMO_SUPERVISORS, 
  AuthService 
} from '../services/authService';
import { Avatar } from './Avatar';
import { PortalLogo } from './PortalLogo';

interface AuthViewProps {
  onLogin: (user: AuthUser) => void;
  onExploreAsGuest?: (role: UserRole) => void;
  initialRole?: UserRole;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, initialRole = 'student' }) => {
  // Normalize initial role
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    if (initialRole === 'applicant') return 'student';
    return initialRole || 'student';
  });

  // Form inputs
  const [identifier, setIdentifier] = useState(() => {
    return DEMO_STUDENTS[0].identifier;
  });
  const [passcode, setPasscode] = useState('••••••••••••');

  // Switch role and update form preset
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const presets = AuthService.getDemoUsersForRole(role);
    if (presets.length > 0) {
      setIdentifier(presets[0].identifier || presets[0].email);
    }
  };

  const handleApplyPreset = (user: AuthUser) => {
    setIdentifier(user.identifier || user.email);
    AuthService.loginAs(user);
    onLogin(user);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim().toLowerCase();
    const allPresets = [
      ...DEMO_STUDENTS,
      ...DEMO_OFFICERS,
      ...DEMO_ADMINS,
      ...DEMO_SUPERVISORS
    ];

    const matched = allPresets.find(
      (u) => u.identifier?.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );

    if (matched) {
      AuthService.loginAs(matched);
      onLogin(matched);
    } else {
      const customUser: AuthUser = {
        id: `user_${Date.now()}`,
        role: selectedRole,
        name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        email: identifier.includes('@') ? identifier : `${cleanId}@mota.gov.in`,
        identifier: identifier.trim(),
        designation: 
          selectedRole === 'student' ? 'ST Research Scholar' :
          selectedRole === 'officer' ? 'Desk Verification Officer' :
          selectedRole === 'admin' ? 'System Administrator' : 'Apex Supervisor',
        community: selectedRole === 'student' ? 'Gond' : undefined,
        state: 'Telangana',
        scheme: 'NFST',
        avatarType: selectedRole === 'student' ? 'scholar_female' : 'officer_senior'
      };
      AuthService.loginAs(customUser);
      onLogin(customUser);
    }
  };

  const currentPresets = AuthService.getDemoUsersForRole(selectedRole);

  const portals = [
    {
      id: 'student',
      title: 'SCHOLAR',
      subtitle: 'STUDENT APPLICATION PORTAL',
      icon: GraduationCap,
      color: 'emerald',
      lightBg: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-700',
      badgeDot: 'bg-emerald-500',
      activeRing: 'ring-4 ring-emerald-400 border-emerald-500',
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'officer',
      title: 'OFFICER',
      subtitle: 'SCRUTINY DESK PORTAL',
      icon: ShieldCheck,
      color: 'indigo',
      lightBg: 'bg-gradient-to-br from-sky-100 via-indigo-50 to-blue-100',
      borderColor: 'border-indigo-200',
      iconColor: 'text-indigo-700',
      badgeDot: 'bg-indigo-500',
      activeRing: 'ring-4 ring-indigo-400 border-indigo-500',
      tagBg: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    },
    {
      id: 'admin',
      title: 'ADMIN',
      subtitle: 'EXECUTIVE ADMIN PORTAL',
      icon: Settings,
      color: 'amber',
      lightBg: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-700',
      badgeDot: 'bg-amber-500',
      activeRing: 'ring-4 ring-amber-400 border-amber-500',
      tagBg: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'supervisor',
      title: 'SUPERVISOR',
      subtitle: 'APEX SUPERVISORY PORTAL',
      icon: Compass,
      color: 'violet',
      lightBg: 'bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-700',
      badgeDot: 'bg-purple-500',
      activeRing: 'ring-4 ring-violet-400 border-violet-500',
      tagBg: 'bg-violet-100 text-violet-800 border-purple-200'
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden font-sans select-none">
      {/* Crystal Clear Realistic Forest Background for Login */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/realistic_forest_bg.jpg"
          alt="Lush forest canopy"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105 saturate-110"
        />
        {/* Subtle, translucent contrast gradient to ensure clear forest visibility with legible typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/45" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/40 shadow-xl">
          <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white/60">
            अ
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest font-black text-white">
              GOVERNMENT OF INDIA
            </div>
            <div className="text-base sm:text-lg font-black text-white tracking-wide">
              MINISTRY OF TRIBAL AFFAIRS
            </div>
          </div>
        </div>
      </header>

      {/* Main Container - Big Inter Typography, White Big Box Portal Options, Zero Description */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center">
        
        {/* Soft Style AROHA Title - BIG, BOLD CAPITAL BEAUTIFUL FONT */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-emerald-100 text-xs font-bold tracking-widest uppercase mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Ministry of Tribal Affairs • Government of India</span>
          </div>

          <div className="flex items-center justify-center gap-3.5 my-1">
            {/* Master Light Coloured Colorful AROHA Emblem */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-br from-emerald-100/90 via-teal-50 to-amber-100/90 p-2.5 text-emerald-800 shadow-xl flex items-center justify-center border-2 border-white/80 shrink-0 backdrop-blur-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-emerald-700">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                <path d="m19 12-4-4 4-4" />
                <path d="m5 12 4 4-4 4" />
              </svg>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-sans tracking-[0.16em] uppercase text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] bg-gradient-to-r from-white/30 via-emerald-100/25 to-white/30 backdrop-blur-xl px-8 sm:px-12 py-2.5 sm:py-3 rounded-3xl border border-white/40 shadow-2xl inline-block">
              AROHA
            </h1>
          </div>

          <div className="text-xs sm:text-sm font-bold tracking-widest text-emerald-100 uppercase mt-2.5 drop-shadow">
            AI-Enabled Scholarship & Fellowship Management System
          </div>
        </div>

        {/* 4 PORTAL CARDS WITH LIGHT COLOURED COLORFUL LOGOS */}
        <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const isSelected = selectedRole === portal.id;
            return (
              <button
                key={portal.id}
                type="button"
                onClick={() => handleRoleChange(portal.id as UserRole)}
                className={`bg-white rounded-3xl p-6 sm:p-7 min-h-[160px] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer shadow-xl border-2 text-center group ${
                  isSelected
                    ? 'ring-4 ring-emerald-400 border-emerald-500 scale-102 shadow-emerald-950/30'
                    : 'border-white/80 hover:border-white hover:scale-[1.01] hover:shadow-2xl opacity-95 hover:opacity-100'
                }`}
              >
                {/* Light Coloured Colorful Logo for Portal */}
                <div
                  className={`w-14 h-14 rounded-2xl ${portal.lightBg} border ${portal.borderColor} flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform relative`}
                >
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${portal.badgeDot} border-2 border-white shadow-xs`} />
                  <Icon className={`w-7 h-7 ${portal.iconColor}`} />
                </div>
                
                {/* Portal Title */}
                <div className="text-base sm:text-lg font-black tracking-tight text-slate-800 flex items-center gap-1.5">
                  <span>{portal.title}</span>
                </div>
                
                {/* Subtitle with Portal Name */}
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                  {portal.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* WHITE BIG BOX LOGIN CARD */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Direct Form */}
            <form onSubmit={handleFormSubmit} className="md:col-span-6 space-y-4">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PortalLogo portal={selectedRole} size="sm" />
                  <span className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
                    {selectedRole === 'student' && 'Scholar Access'}
                    {selectedRole === 'officer' && 'Officer Access'}
                    {selectedRole === 'admin' && 'Admin Console'}
                    {selectedRole === 'supervisor' && 'Apex Access'}
                  </span>
                </div>
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {selectedRole}
                </span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Identifier / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter Identifier"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-base font-bold text-slate-800 placeholder:text-slate-400 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Security Passcode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Security Passcode"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-base font-bold text-slate-800 placeholder:text-slate-400 outline-none transition"
                  />
                </div>
              </div>

              {/* Big Colorful Action Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-base font-black tracking-wider uppercase shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>ENTER WORKSPACE</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </form>

            {/* Quick 1-Click Access Options */}
            <div className="md:col-span-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  1-Click Access
                </span>
                <span className="text-[11px] font-bold text-slate-400">Select to Enter</span>
              </div>

              <div className="space-y-2.5">
                {currentPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        type={preset.avatarType}
                        name={preset.name}
                        role={preset.role}
                        size="md"
                      />
                      <div>
                        <div className="text-sm font-black text-slate-800 flex items-center gap-2">
                          <span>{preset.name}</span>
                          {preset.scheme && (
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-black">
                              {preset.scheme}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 truncate max-w-[200px]">
                          {preset.designation}
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 group-hover:scale-125 transition" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 text-center text-xs font-extrabold text-white/90">
        MINISTRY OF TRIBAL AFFAIRS • GOVERNMENT OF INDIA
      </footer>
    </div>
  );
};
