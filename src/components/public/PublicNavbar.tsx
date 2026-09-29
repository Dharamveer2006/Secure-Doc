'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Menu,
  X,
  Scale,
  BookOpen,
  Info,
  Phone,
  FileText,
  FolderGit2,
  Cpu,
} from 'lucide-react';

export type PublicPageTab = 'home' | 'about' | 'policy' | 'contact' | 'dockets';

interface PublicNavbarProps {
  activeTab: PublicPageTab;
  onSelectTab: (tab: PublicPageTab) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export default function PublicNavbar({
  activeTab,
  onSelectTab,
  onOpenLogin,
  onOpenRegister,
}: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PublicPageTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Cpu },
    { id: 'about', label: 'About Architecture', icon: Info },
    { id: 'dockets', label: 'Case Dockets', icon: FolderGit2 },
    { id: 'policy', label: 'Privacy & Statutory Policy', icon: FileText },
    { id: 'contact', label: 'Nodal Contact', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Micro-Notice */}
      <div className="bg-slate-950 text-slate-300 text-[11px] px-4 sm:px-8 py-1 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-slate-200 font-semibold tracking-wide">
            GOVT OF INDIA • MHA / NCRB DIGITAL EVIDENCE PLATFORM
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Smart India Hackathon 2026 Reference Build
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold hidden sm:inline">
            EAL6+ Cryptographic Enclave
          </span>
          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700 text-[10px]">
            TLS 1.3 • FIPS 180-4
          </span>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 p-0.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <img
              src="/images/ncrb_seal.svg"
              alt="Government Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">
                Secure-Doc
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase tracking-wider">
                GovTech Enclave
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5 hidden sm:block">
              National Digital Evidence &amp; Investigation Management Portal
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenRegister}
            className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            Register Credentials
          </button>

          <button
            type="button"
            onClick={onOpenLogin}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs card-hover"
          >
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Officer Portal Login</span>
            <ArrowRight className="w-3 h-3 text-slate-400 hidden sm:inline" />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 px-6 space-y-2 animate-in fade-in duration-150">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 ${
                  isActive ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenRegister();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg"
            >
              Register Government Credentials
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
