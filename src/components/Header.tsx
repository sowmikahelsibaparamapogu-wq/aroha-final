import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  ShieldCheck, 
  UserCheck, 
  RefreshCw, 
  Languages, 
  Smartphone,
  ChevronDown,
  Palette,
  LogOut,
  User,
  Key,
  GraduationCap,
  ArrowRightLeft
} from 'lucide-react';
import { UserRole, AuthUser } from '../types/scholarship';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { LanguageCode, SUPPORTED_LANGUAGES, getTranslation } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import { Avatar } from './Avatar';
import { PortalLogo } from './PortalLogo';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  lastSyncedText: string;
  isSyncing: boolean;
  onManualSync: () => void;
  onOpenDemoScenarios?: () => void;
  lang?: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  tribalAmbience?: boolean;
  onToggleAmbience?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  lastSyncedText,
  isSyncing,
  onManualSync,
  onOpenDemoScenarios,
  lang: propLang,
  onLanguageChange,
  currentUser,
  onOpenAuth,
  onLogout,
  tribalAmbience,
  onToggleAmbience,
}) => {
  const { lang: contextLang, t } = useLanguage();
  const activeLang = propLang || contextLang;
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === activeLang) || SUPPORTED_LANGUAGES[0];

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((item) => {
    if (!langSearch.trim()) return true;
    const q = langSearch.toLowerCase().trim();
    return (
      item.label.toLowerCase().includes(q) ||
      item.nativeName.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q)
    );
  });

  return (
    <header id="main-header" className="bg-white border-b border-emerald-900/15 sticky top-0 z-40 shadow-xs">
      {/* Top micro-bar for Government of India / MoTA credentials with Forest Green theme */}
      <div className="bg-emerald-950 text-emerald-200 text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-emerald-100">{t('motaHeader')}</span>
          <span className="hidden sm:inline text-emerald-600">•</span>
          <span className="hidden sm:inline text-emerald-300/80">{t('motaTagline')}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400/80 text-[11px] hidden md:inline">{t('govtSchemes', 'Govt Schemes:')}</span>
          <span className="bg-emerald-900/90 text-emerald-200 border border-emerald-700/60 px-2 py-0.5 rounded text-[11px] font-semibold">
            {t('nfstSlots')}
          </span>
          <span className="bg-amber-950/80 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded text-[11px] font-semibold">
            {t('nosSlots')}
          </span>
        </div>
      </div>

      {/* Main navigation & controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Forest Emblem */}
        <div className="flex items-center gap-3.5">
          <PortalLogo portal="aroha" size="md" />

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-widest text-emerald-950 font-sans bg-gradient-to-r from-emerald-50 via-teal-50/90 to-amber-50/80 px-3.5 py-1 rounded-2xl border border-emerald-300/80 inline-block shadow-2xs">
                AROHA
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-1 rounded-xl border border-emerald-300 shadow-2xs">
                {t('versionBadge')}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 font-bold hidden sm:block tracking-wide mt-0.5">
              {t('portalSubtitle')}
            </p>
          </div>
        </div>

        {/* Center/Right: Language Selector, Role Switcher & Utility actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Multilingual Selector Dropdown */}
          <div className="relative">
            <button
              id="language-selector-btn"
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
              title="Change Portal Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-700" />
              <span>{currentLangObj.nativeName}</span>
              <ChevronDown className={`w-3 h-3 text-emerald-600 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-emerald-300/80 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 flex items-center justify-between border-b border-emerald-100 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900">
                      All 29 Languages
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    22 Const. + 7 Tribal
                  </span>
                </div>

                {/* Search input for 29 languages */}
                <div className="px-1 mb-2">
                  <input
                    type="text"
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Search 29 languages (e.g. Gondi, Tamil)..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-slate-50 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>

                {/* Scrollable List */}
                <div className="max-h-72 overflow-y-auto space-y-0.5 pr-0.5 divide-y divide-slate-100">
                  {filteredLanguages.map((item) => {
                    const isSelected = activeLang === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          onLanguageChange(item.code);
                          setIsLangOpen(false);
                          setLangSearch('');
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-800 text-white font-bold shadow-xs'
                            : 'text-slate-800 hover:bg-emerald-50'
                        }`}
                      >
                        <div>
                          <span className="font-semibold block">{item.nativeName}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                            {item.label}
                          </span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isSelected
                            ? 'bg-emerald-950 text-emerald-200'
                            : item.group === 'Indigenous Tribal'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.code.toUpperCase()}
                        </span>
                      </button>
                    );
                  })}
                  {filteredLanguages.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400">
                      No matching language found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Offline Mode Simulator Toggle */}
          <button
            id="toggle-offline-btn"
            type="button"
            onClick={onToggleSimulatedOffline}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              !isOnline
                ? 'bg-orange-50 text-orange-800 border-orange-300 hover:bg-orange-100'
                : 'bg-emerald-50/50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Toggle offline state to test PWA offline queue and auto-sync"
          >
            {!isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                <span className="font-semibold">{t('simulatedOffline')}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('online')}</span>
              </>
            )}
          </button>

          {/* Sync Trigger / Last Synced info */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50/40 border border-emerald-200 text-xs text-emerald-900">
            <button
              type="button"
              onClick={onManualSync}
              disabled={isSyncing || !isOnline}
              className="hover:text-emerald-700 transition-colors disabled:opacity-40 cursor-pointer"
              title="Click to force background sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-700' : ''}`} />
            </button>
            <span className="text-[11px]">
              {isSyncing ? t('syncing') : lastSyncedText}
            </span>
          </div>

          {/* PWA Install Button */}
          {isInstallable && !isInstalled && (
            <button
              id="pwa-install-header-btn"
              type="button"
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('installApp')}</span>
            </button>
          )}

          {/* iOS Safari Guide Button */}
          {isIOS && !isInstalled && (
            <button
              type="button"
              onClick={() => setShowIOSPrompt(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-300 text-emerald-900 hover:bg-emerald-50"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('installIos', 'Install iOS')}</span>
            </button>
          )}

          {/* Tribal Atmosphere Background Toggle */}
          {onToggleAmbience && (
            <button
              id="toggle-tribal-ambience-btn"
              type="button"
              onClick={onToggleAmbience}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                tribalAmbience
                  ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-2xs font-bold'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Toggle authentic tribal photographic background cover atmosphere"
            >
              <Palette className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden lg:inline">{tribalAmbience ? '🌾 Tribal Atmosphere: Active' : '🌾 Tribal Atmosphere: Off'}</span>
            </button>
          )}

          {/* Active Dedicated Portal Badge with Light Coloured Colorful Logo */}
          <div className="flex items-center p-1 bg-emerald-50/70 rounded-2xl border border-emerald-200 shadow-2xs">
            <div 
              id="active-portal-badge"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200/90 text-slate-800 text-xs font-bold shadow-xs"
              title={`Active Portal: ${currentRole}`}
            >
              <PortalLogo portal={currentRole} size="xs" />
              <span className="font-black text-emerald-950 tracking-tight">
                {currentRole === 'applicant' || currentRole === 'student' ? 'Scholar Portal' :
                 currentRole === 'officer' ? 'Scrutiny Portal' :
                 currentRole === 'admin' ? 'Admin Portal' : 'Supervisor Portal'}
              </span>
              <span className="hidden sm:inline text-[10px] px-2 py-0.5 bg-emerald-100/80 text-emerald-800 rounded-full font-bold border border-emerald-200">
                Active
              </span>
            </div>
          </div>

          {/* Authenticated User Profile Pill & Portal Switcher with Graphical Avatar */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl bg-emerald-900/10 hover:bg-emerald-900/15 border border-emerald-800/20 text-xs transition cursor-pointer"
                title="View logged-in profile or switch user"
              >
                <Avatar
                  type={currentUser.avatarType}
                  name={currentUser.name}
                  role={currentUser.role}
                  size="xs"
                />
                <div className="text-left hidden md:block">
                  <div className="font-bold text-emerald-950 text-[11px] leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-emerald-700" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-emerald-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-emerald-100">
                    <div className="text-xs font-bold text-emerald-950">{currentUser.name}</div>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {onLogout && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out & Select Portal</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition cursor-pointer"
                title="Sign in with Admin or Applicant credentials"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* iOS Install Prompt Dialog */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-emerald-300">
            <h3 className="text-base font-bold text-emerald-950">{t('installArohaIos', 'Install AROHA on iPhone / iPad')}</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              1. {t('iosStep1', 'Tap the Share icon at the bottom of Safari.')}<br />
              2. {t('iosStep2', 'Scroll down and choose Add to Home Screen.')}<br />
              3. {t('iosStep3', 'You can now launch AROHA with full offline PWA functionality!')}
            </p>
            <button
              type="button"
              onClick={() => setShowIOSPrompt(false)}
              className="mt-4 w-full rounded-xl bg-emerald-800 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              {t('done', 'Done')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
