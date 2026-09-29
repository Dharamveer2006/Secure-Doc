'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types/auth';
import { ROLE_CONFIGS, DEMO_ACCOUNTS } from '@/lib/constants';
import {
  ShieldAlert,
  Scale,
  Microscope,
  FileCheck,
  ShieldCheck,
  Lock,
  Mail,
  User,
  BadgeAlert,
  Building,
  ArrowRight,
  Fingerprint,
  CheckCircle2,
  ExternalLink,
  Eye,
  Maximize2,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AuthScreen() {
  const { login, register, loginAsDemo, isLoading } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Blueprint inspection modal
  const [activeBlueprintModal, setActiveBlueprintModal] = useState<'architecture' | 'custody' | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('v.rathore@delhipolice.gov.in');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginRole, setLoginRole] = useState<UserRole>('POLICE');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('POLICE');
  const [regBadge, setRegBadge] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regStation, setRegStation] = useState('');
  const [regAcceptedTerms, setRegAcceptedTerms] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!loginEmail || !loginPassword) {
      setFormError('Please enter both official email and security password.');
      return;
    }
    await login(loginEmail, loginPassword, loginRole);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!regName || !regEmail || !regPassword || !regBadge) {
      setFormError('Please complete all mandatory credential fields.');
      return;
    }

    if (!regAcceptedTerms) {
      setFormError('You must acknowledge the Official Secrets & Evidentiary compliance oath.');
      return;
    }

    await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      badgeNumber: regBadge,
      department: regDepartment || ROLE_CONFIGS[regRole].defaultDept,
      stationOrCourt: regStation || 'Central Records Wing',
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Top Government Banner */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-semibold tracking-wide text-amber-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              GOVERNMENT OF INDIA
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              Ministry of Home Affairs • National Crime Records Bureau (NCRB)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              EAL6+ Cryptographic Enclave
            </span>
            <span className="hidden md:inline">SIH 2026 Reference Build</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero / Enterprise Context Column */}
          <div className="lg:col-span-6 space-y-5">
            {/* Government Emblem & Title */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-900 p-1 shadow-md flex items-center justify-center shrink-0 animate-subtle-float">
                <img
                  src="/images/ncrb_seal.svg"
                  alt="NCRB Ministry of Home Affairs Official Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>SIH 2026 • Women Safety Division</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Secure-Doc
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  National Digital Evidence & Investigation Management Platform
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Centralized, tamper-evident document lifecycle repository designed for law enforcement, judicial courts, 
              and state forensic laboratories. Guarantees chain-of-custody, SHA-256 cryptographic immutability, and 
              client-side AES-256 envelope encryption.
            </p>

            {/* Interactive Workflow Architecture Blueprints Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>System Architecture & Workflow Blueprints</span>
                </span>
                <span className="text-[10px] text-blue-700 font-medium font-mono">Click to enlarge</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Architecture Blueprint Card */}
                <div
                  onClick={() => setActiveBlueprintModal('architecture')}
                  className="bg-white border border-slate-200 rounded-xl p-3 card-hover cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-28 rounded-lg overflow-hidden border border-slate-200 bg-white mb-2 flex items-center justify-center p-1">
                    <img
                      src="/images/workflow_architecture.svg"
                      alt="Secure-Doc System Architecture"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                      <div className="bg-slate-900/80 backdrop-blur-xs text-white px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3 h-3 text-blue-400" />
                        <span>Inspect Architecture</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>4-Step Cryptographic Pipeline</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition" />
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      Ingestion → SHA-256 → AES-256 Enclave → Ledger
                    </p>
                  </div>
                </div>

                {/* Chain of Custody Blueprint Card */}
                <div
                  onClick={() => setActiveBlueprintModal('custody')}
                  className="bg-white border border-slate-200 rounded-xl p-3 card-hover cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-28 rounded-lg overflow-hidden border border-slate-200 bg-white mb-2 flex items-center justify-center p-1">
                    <img
                      src="/images/chain_of_custody.svg"
                      alt="Digital Chain of Custody Protocol"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                      <div className="bg-slate-900/80 backdrop-blur-xs text-white px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3 h-3 text-emerald-400" />
                        <span>Inspect Custody Flow</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>Digital Chain-of-Custody</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition" />
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      Sec 65B Evidence Act compliant custody audit trail
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Pillars Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5 card-hover">
                <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Police & Law Enf.</h4>
                  <p className="text-[10px] text-slate-500">FIRs, Seizure panchnama</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5 card-hover">
                <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Judiciary & Courts</h4>
                  <p className="text-[10px] text-slate-500">Case dockets, Bail orders</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5 card-hover">
                <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
                  <Microscope className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Forensics (CFSL)</h4>
                  <p className="text-[10px] text-slate-500">Ballistics, DNA & Cyber</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-start gap-2.5 card-hover">
                <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Prosecution / Legal</h4>
                  <p className="text-[10px] text-slate-500">Evidentiary audit certificates</p>
                </div>
              </div>
            </div>

            {/* Quick Demo Switcher Card for Hackathon Jury */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs card-hover">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    SIH Evaluator Quick-Access (1-Click RBAC Profiles)
                  </span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                  Bypass MFA Demo
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2.5">
                Select an official role to immediately experience role-specific privileges, audit trails, and interface access:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DEMO_ACCOUNTS.map((account) => {
                  const cfg = ROLE_CONFIGS[account.role];
                  return (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => loginAsDemo(account.id)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all hover:shadow-sm ${cfg.bgLight} ${cfg.borderColor} hover:border-slate-400 group card-hover`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold ${cfg.color}`}>{account.role}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="font-semibold text-slate-900 text-[11px] truncate leading-tight">
                        {account.name.split(' ')[0]} {account.name.split(' ')[1]}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{account.badgeNumber}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Auth Card Column */}
          <div className="lg:col-span-6 max-w-xl mx-auto w-full">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden card-hover">
              
              {/* Tab Selector Header */}
              <div className="border-b border-slate-200 flex">
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setFormError(null);
                  }}
                  className={`flex-1 py-3.5 text-center text-sm font-semibold transition-colors border-b-2 flex items-center justify-center gap-2 ${
                    mode === 'LOGIN'
                      ? 'border-blue-600 text-slate-900 bg-slate-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Officer Portal Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('REGISTER');
                    setFormError(null);
                  }}
                  className={`flex-1 py-3.5 text-center text-sm font-semibold transition-colors border-b-2 flex items-center justify-center gap-2 ${
                    mode === 'REGISTER'
                      ? 'border-blue-600 text-slate-900 bg-slate-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Register Officer / Agency</span>
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6">
                {formError && (
                  <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
                    <BadgeAlert className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {mode === 'LOGIN' ? (
                  /* Login Mode */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Role-Based Clearance Portal
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['POLICE', 'COURT', 'FORENSICS', 'LEGAL'] as UserRole[]).map((r) => {
                          const isSel = loginRole === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                setLoginRole(r);
                                const demo = DEMO_ACCOUNTS.find((a) => a.role === r);
                                if (demo) {
                                  setLoginEmail(demo.email);
                                }
                              }}
                              className={`py-2 px-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                                isSel
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {r}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        Selected Role:{' '}
                        <span className="font-semibold text-slate-800">
                          {ROLE_CONFIGS[loginRole].label}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Government / Official Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="officer@department.gov.in"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Cryptographic Passphrase
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">FIPS 140-2 Keyed</span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>MHA 2-Factor Authentication required next</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">TOTP / Key</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Proceed to MFA Authentication</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* Register Mode */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Select Institutional Role (RBAC)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['POLICE', 'COURT', 'FORENSICS', 'LEGAL'] as UserRole[]).map((r) => {
                          const cfg = ROLE_CONFIGS[r];
                          const isSel = regRole === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                setRegRole(r);
                                setRegDepartment(cfg.defaultDept);
                              }}
                              className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                                isSel
                                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-bold ${isSel ? 'text-blue-900' : 'text-slate-800'}`}>
                                  {r}
                                </span>
                                {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{cfg.label}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Officer Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Insp. Amit Deshmukh"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Official Badge / ID No.
                        </label>
                        <input
                          type="text"
                          required
                          value={regBadge}
                          onChange={(e) => setRegBadge(e.target.value)}
                          placeholder="e.g. POL-MH-5521"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Government Email
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="officer@nic.in / .gov.in"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Station / Court Chambers
                        </label>
                        <input
                          type="text"
                          value={regStation}
                          onChange={(e) => setRegStation(e.target.value)}
                          placeholder="e.g. Crime Branch South Unit"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department / Bureau
                      </label>
                      <input
                        type="text"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        placeholder="e.g. State CID / Central Bureau of Investigation"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Set Password (Min. 8 chars)
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition font-mono"
                      />
                    </div>

                    <div className="pt-1">
                      <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={regAcceptedTerms}
                          onChange={(e) => setRegAcceptedTerms(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>
                          I certify that I am a sworn officer / authorized judicial personnel under the{' '}
                          <strong className="text-slate-800">Official Secrets Act, 1923</strong> &{' '}
                          <strong className="text-slate-800">IT Act 2000</strong>.
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Create Account & Verify MFA</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* System Architecture & Workflow Lightbox Modal */}
      {activeBlueprintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {activeBlueprintModal === 'architecture'
                        ? 'Secure-Doc 4-Phase System Architecture Blueprint'
                        : 'Institutional Digital Chain of Custody Protocol'}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      MHA / NCRB Specification
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Smart India Hackathon 2026 Reference Architectural Blueprint
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Switch between both diagrams inside the modal */}
                <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveBlueprintModal('architecture')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                      activeBlueprintModal === 'architecture'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    System Architecture
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBlueprintModal('custody')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                      activeBlueprintModal === 'custody'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Chain of Custody
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveBlueprintModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Close Inspector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Image View */}
            <div className="flex-1 overflow-auto bg-slate-900/95 p-4 sm:p-6 flex flex-col items-center justify-center">
              <div className="max-w-4xl w-full rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-white p-2">
                <img
                  src={
                    activeBlueprintModal === 'architecture'
                      ? '/images/workflow_architecture.svg'
                      : '/images/chain_of_custody.svg'
                  }
                  alt={
                    activeBlueprintModal === 'architecture'
                      ? 'Secure-Doc Cryptographic Architecture'
                      : 'Digital Chain of Custody Lifecycle'
                  }
                  className="w-full h-auto object-contain max-h-[65vh] mx-auto rounded-lg"
                />
              </div>

              {/* Explanatory Caption */}
              <div className="mt-4 max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-300 text-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] space-y-1">
                  <p className="font-semibold text-white">
                    {activeBlueprintModal === 'architecture'
                      ? 'Cryptographic Ingestion & Enclave Pipeline'
                      : 'Evidentiary Chain-of-Custody (Section 65B Indian Evidence Act)'}
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    {activeBlueprintModal === 'architecture'
                      ? 'Multi-modal evidentiary files (FIR scans, CFSL forensic reports, wiretaps, CCTV videos, PCAP/disk dumps) undergo client-side SHA-256 pre-encryption digest generation and AES-256-GCM envelope encryption before anchoring to the permissioned blockchain ledger.'
                      : 'Every interaction from police seizure, CFSL scientific analysis, prosecution discovery, to judicial bench scrutiny is recorded into an append-only cryptographic ledger with time-expiring ACL tokens and DLP watermarking.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono text-[11px]">
                FIPS 180-4 (SHA-256) • NIST SP 800-38D (AES-256-GCM) • ISO 27037 Standard
              </span>
              <button
                type="button"
                onClick={() => setActiveBlueprintModal(null)}
                className="px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Government Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-4 px-4 sm:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <p className="text-slate-300 font-medium">
              National Crime Records Bureau (NCRB) • Smart India Hackathon 2026
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Secure Digital Document Management System for Legal & Investigation Documents
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              SHA-256 Engine Active
            </span>
            <span>•</span>
            <span className="text-blue-400">AES-256 Client Shield</span>
            <span>•</span>
            <span className="text-slate-500">Sec 65B Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
