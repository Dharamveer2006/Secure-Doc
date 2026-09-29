'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ROLE_CONFIGS } from '@/lib/constants';
import { UserRole } from '@/types/auth';
import { NavTab } from './AppSidebar';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Clock,
  ChevronDown,
  Layers,
  KeyRound,
  Shield,
  FileBadge,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  FileText,
  Cpu,
  Scale,
  Settings,
  X,
  ExternalLink,
  Sliders,
  Eye,
  UploadCloud,
  Share2,
  History,
  LayoutDashboard,
} from 'lucide-react';

interface AppHeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export default function AppHeader({ activeTab, onSelectTab }: AppHeaderProps) {
  const { user, logout, switchRole } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update IST legal evidentiary clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
          ' ' +
          now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }) +
          ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsRoleDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!user) return null;
  const roleConfig = ROLE_CONFIGS[user.role];

  const searchableItems = [
    {
      type: 'docket',
      title: 'FIR-2026-DEL-0482: Cyber Intrusion & Ransomware',
      subtitle: 'Police FIR • Delhi Police Cyber Division',
      target: 'cases' as NavTab,
    },
    {
      type: 'docket',
      title: 'CFSL-2026-BALL-114: Forensic Ballistics Report',
      subtitle: 'CFSL Sealed • Dr. Ananya Sen',
      target: 'cases' as NavTab,
    },
    {
      type: 'docket',
      title: 'HC-CRL-2026-904: Electronic Evidence Scrutiny Minutes',
      subtitle: 'Judicial Order • High Court Bench 03',
      target: 'cases' as NavTab,
    },
    {
      type: 'page',
      title: 'Secure Upload & Client OCR Ingestion',
      subtitle: 'Calculate SHA-256 & extract text client-side',
      target: 'upload' as NavTab,
    },
    {
      type: 'page',
      title: 'Cryptographic Enclave & Live File Hash Validator',
      subtitle: 'Test any physical file for SHA-256 bit-level tampering',
      target: 'security' as NavTab,
    },
    {
      type: 'page',
      title: 'Indian Evidence Act Section 65B Knowledgebase',
      subtitle: '4-Condition Statutory Checklist & Supreme Court Precedents',
      target: 'compliance' as NavTab,
    },
    {
      type: 'page',
      title: 'Officer Credentials & PKI Digital Certificate',
      subtitle: 'NIC-CA Class 3 e-Token & Session Security',
      target: 'settings' as NavTab,
    },
    {
      type: 'page',
      title: 'Immutable Audit Ledger & Chain of Custody',
      subtitle: 'Zero-knowledge verification of tamper events',
      target: 'audit' as NavTab,
    },
  ];

  const filteredSearchResults = searchQuery.trim()
    ? searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchableItems;

  const topHorizontalTabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Case Dockets', icon: FolderGit2 },
    { id: 'upload', label: 'Secure Upload', icon: UploadCloud },
    { id: 'viewer', label: 'Universal Viewer', icon: Eye },
    { id: 'sharing', label: 'Inter-Agency Sharing', icon: Share2 },
    { id: 'audit', label: 'Audit Ledger', icon: History },
    { id: 'security', label: 'Crypto Enclave', icon: Cpu },
    { id: 'compliance', label: 'Legal Compliance', icon: Scale },
    { id: 'settings', label: 'Officer Settings', icon: Settings },
  ];

  const handleSearchResultClick = (tab: NavTab) => {
    onSelectTab(tab);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro-bar: Government Notice & System Diagnostics */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 sm:px-6 py-1 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-slate-200 font-semibold tracking-wide">
            GOVT OF INDIA • MHA / NCRB CLASSIFIED REPOSITORY
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Indian Evidence Act Sec 65B &amp; BSA Sec 63 Compliant
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{currentTime || 'Synchronizing Legal Clock...'}</span>
          </div>
          <span className="hidden sm:inline bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded border border-slate-700 text-[10px]">
            TLS 1.3 • FIPS 180-4
          </span>
        </div>
      </div>

      {/* Main header row */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl border border-slate-200 shadow-xs overflow-hidden bg-slate-900 p-0.5 flex items-center justify-center shrink-0 group-hover:border-slate-400 transition-colors">
              <img
                src="/images/ncrb_seal.svg"
                alt="NCRB Ministry of Home Affairs Official Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-xs"
              title="MHA Enclave Verified & Operational"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">
                Secure-Doc
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold tracking-wide">
                GovTech Enclave
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none mt-0.5">
              National Digital Evidence &amp; Investigation Management • MHA / NCRB
            </p>
          </div>
        </div>

        {/* Global Search Bar (Ctrl+K trigger) */}
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
          <div
            onClick={() => {
              setIsSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            className="w-full px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg text-xs text-slate-500 flex items-center justify-between cursor-pointer transition card-hover"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search cases, forensic hashes, FIRs, or statutes...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Right Action Icons & Officer Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile search button */}
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Enclave Armed Badge */}
          <div
            onClick={() => onSelectTab('security')}
            className="hidden xl:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer hover:bg-slate-100 transition card-hover"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono text-slate-700">
              <span className="font-semibold">Enclave:</span>{' '}
              <span className="text-emerald-700 font-bold">ARMED (99.98%)</span>
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsRoleDropdownOpen(false);
              }}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Evidentiary Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Evidentiary Alerts</span>
                  </div>
                  {unreadNotifications > 0 && (
                    <button
                      type="button"
                      onClick={() => setUnreadNotifications(0)}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => {
                      onSelectTab('cases');
                      setIsNotificationsOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-100 hover:bg-purple-100/60 cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 flex items-center gap-1">
                        <FileBadge className="w-3 h-3 text-purple-600" />
                        CFSL Report Sealed
                      </span>
                      <span className="text-[10px] font-mono text-purple-600">5m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Dr. Sen sealed ballistics micro-spectroscopy report for CFSL-2026-BALL-114.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      onSelectTab('compliance');
                      setIsNotificationsOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-100/60 cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Sec 65B Certificate Ready
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600">22m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Sworn Section 65B Certificate generated and signed for FIR-2026-DEL-0482.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      onSelectTab('sharing');
                      setIsNotificationsOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 hover:bg-amber-100/60 cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        ACL Token Expiry Notice
                      </span>
                      <span className="text-[10px] font-mono text-amber-600">1h ago</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Inter-Agency access link for High Court Bench expires in 2 hours.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('audit');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                  >
                    View Full Immutable Audit Ledger &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Card & Role Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsRoleDropdownOpen(!isRoleDropdownOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all card-hover text-left"
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${roleConfig.bgLight} ${roleConfig.color} border ${roleConfig.borderColor}`}
              >
                {user.role.slice(0, 3)}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <span className={`font-semibold ${roleConfig.color}`}>{roleConfig.label}</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role & Profile Dropdown */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2.5 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.stationOrCourt}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Badge: {user.badgeNumber}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      {user.clearanceLevel}
                    </span>
                  </div>
                </div>

                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Evaluator Role (RBAC)
                </div>

                {(['POLICE', 'COURT', 'FORENSICS', 'LEGAL'] as UserRole[]).map((r) => {
                  const cfg = ROLE_CONFIGS[r];
                  const isCurrent = user.role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        switchRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-1.5 px-2 rounded-lg text-xs flex items-center justify-between transition ${
                        isCurrent
                          ? 'bg-blue-50 text-blue-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${cfg.bgLight} ${cfg.color} border ${cfg.borderColor}`}
                        >
                          {r.slice(0, 2)}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight text-[11px]">{cfg.label}</p>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="border-t border-slate-100 mt-1 pt-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('settings');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-left p-1.5 px-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Officer Credentials &amp; Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left p-1.5 px-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Terminate Session (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Horizontal Navigation Tab Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1 py-1 min-w-max">
          {topHorizontalTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Interactive Global Search Modal (Ctrl+K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden space-y-0">
            {/* Search Input Bar */}
            <div className="p-3.5 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case dockets, FIRs, forensic hashes, statutes, or modules..."
                className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredSearchResults.length > 0 ? (
                filteredSearchResults.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSearchResultClick(res.target)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-white">
                        {res.type === 'docket' ? (
                          <FolderGit2 className="w-4 h-4 text-blue-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                          {res.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{res.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 ml-2">
                      Jump &rarr;
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching case dockets or modules found for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Press ESC to close</span>
              <span>Secure-Doc Unified Index</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
