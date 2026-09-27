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
  CheckCircle2,
  Globe
} from 'lucide-react';
import { AuthUser, UserRole } from '../types/scholarship';
import { 
  DEMO_STUDENTS, 
  DEMO_OFFICERS, 
  DEMO_ADMINS, 
  DEMO_SUPERVISORS, 
  AuthService 
} from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import { Avatar } from './Avatar';

interface AuthViewProps {
  onLogin: (user: AuthUser) => void;
  onExploreAsGuest?: (role: UserRole) => void;
  initialRole?: UserRole;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, initialRole = 'student' }) => {
  const { lang, setLanguage } = useLanguage();
  
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
  const [isLangOpen, setIsLangOpen] = useState(false);

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
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  const portals = [
    {
      id: 'student',
      title: 'SCHOLAR',
      subtitle: 'STUDENT PORTAL',
      icon: GraduationCap,
      color: 'emerald',
      iconBg: 'bg-emerald-600',
      activeRing: 'ring-4 ring-emerald-400 border-emerald-500',
      tagBg: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'officer',
      title: 'OFFICER',
      subtitle: 'SCRUTINY PORTAL',
      icon: ShieldCheck,
      color: 'indigo',
      iconBg: 'bg-indigo-600',
      activeRing: 'ring-4 ring-indigo-400 border-indigo-500',
      tagBg: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'admin',
      title: 'ADMIN',
      subtitle: 'EXECUTIVE PORTAL',
      icon: Settings,
      color: 'amber',
      iconBg: 'bg-amber-600',
      activeRing: 'ring-4 ring-amber-400 border-amber-500',
      tagBg: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'supervisor',
      title: 'SUPERVISOR',
      subtitle: 'APEX PORTAL',
      icon: Compass,
      color: 'violet',
      iconBg: 'bg-violet-600',
      activeRing: 'ring-4 ring-violet-400 border-violet-500',
      tagBg: 'bg-violet-100 text-violet-800'
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

        {/* Language Option */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white border border-white/40 text-xs font-black shadow-md transition cursor-pointer"
          >
            <Globe className="w-4 h-4 text-white" />
            <span className="text-white">{currentLangObj.nativeName}</span>
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl py-2 z-50">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLanguage(l.code);
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                    lang === l.code ? 'bg-emerald-50 text-emerald-800 font-black' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold">{l.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{l.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Container - Big Inter Typography, White Big Box Portal Options, Zero Description */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center items-center">
        
        {/* Soft Style aroha Title - Small Comparatively but Bold */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-100 text-[11px] font-bold tracking-wider uppercase mb-2.5">
            <span>Ministry of Tribal Affairs</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-wide text-white drop-shadow-md bg-white/15 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/25 inline-block shadow-lg">
              aroha
            </h1>
          </div>
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-100/90 uppercase mt-2 drop-shadow">
            National Tribal Higher Education Portal
          </div>
        </div>

        {/* 4 BOXES NOT IN LINE (2x2 GRID), ALL 4 BIG CARDS, SMALL FONT, LIGHT LOGOS */}
        <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const isSelected = selectedRole === portal.id;
            return (
              <button
                key={portal.id}
                type="button"
                onClick={() => handleRoleChange(portal.id as UserRole)}
                className={`bg-white rounded-3xl p-6 sm:p-7 min-h-[155px] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer shadow-xl border-2 text-center group ${
                  isSelected
                    ? 'ring-4 ring-emerald-400 border-emerald-500 scale-102 shadow-emerald-950/30'
                    : 'border-white/80 hover:border-white hover:scale-[1.01] hover:shadow-2xl opacity-95 hover:opacity-100'
                }`}
              >
                {/* Light Subtle Logo */}
                <div
                  className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200/70 flex items-center justify-center mb-3 opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all shadow-xs"
                >
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Small Font Title */}
                <div className="text-sm sm:text-base font-bold tracking-tight text-slate-800">
                  {portal.title}
                </div>
                
                {/* Small Font Subtitle */}
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
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
                <span className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                  {selectedRole === 'student' && 'Scholar Access'}
                  {selectedRole === 'officer' && 'Officer Access'}
                  {selectedRole === 'admin' && 'Admin Console'}
                  {selectedRole === 'supervisor' && 'Apex Access'}
                </span>
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
