'use client';

import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  FileText,
  Clock,
  IdCard,
  MapPin,
  RefreshCw,
  Shield,
  HelpCircle,
} from 'lucide-react';

export default function AuthScreen() {
  const {
    login,
    register,
    loginAsDemo,
    isLoading,
    failedAttempts,
    isLockedOut,
    lockoutSecondsRemaining,
  } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Blueprint inspection modal
  const [activeBlueprintModal, setActiveBlueprintModal] = useState<'architecture' | 'custody' | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('v.rathore@delhipolice.gov.in');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginRole, setLoginRole] = useState<UserRole>('POLICE');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaNum1, setCaptchaNum1] = useState(14);
  const [captchaNum2, setCaptchaNum2] = useState(23);

  // Register form state (Comprehensive Government Details + Gmail support)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('POLICE');
  const [regCadre, setRegCadre] = useState('IPS');
  const [regBadge, setRegBadge] = useState('');
  const [regGovIdType, setRegGovIdType] = useState('Police Service Identity Card');
  const [regGovIdNumber, setRegGovIdNumber] = useState('');
  const [regDepartment, setRegDepartment] = useState('Delhi Police - Special Crime Division');
  const [regStation, setRegStation] = useState('');
  const [regState, setRegState] = useState('NCT of Delhi');
  const [regAcceptedTerms, setRegAcceptedTerms] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Generate new math captcha
  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(10 + Math.random() * 40));
    setCaptchaNum2(Math.floor(5 + Math.random() * 25));
    setCaptchaInput('');
  };

  useEffect(() => {
    if (failedAttempts >= 3) {
      generateCaptcha();
    }
  }, [failedAttempts]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (isLockedOut) {
      setFormError(`Authentication endpoint locked for ${lockoutSecondsRemaining}s due to excessive failed attempts.`);
      return;
    }

    if (!loginEmail || !loginPassword) {
      setFormError('Please enter both your registered email and security password.');
      return;
    }

    // If failed attempts >= 3, require bot captcha verification
    if (failedAttempts >= 3) {
      const expected = captchaNum1 + captchaNum2;
      if (parseInt(captchaInput.trim(), 10) !== expected) {
        setFormError('Security Nonce Verification failed: Incorrect math challenge response.');
        generateCaptcha();
        return;
      }
    }

    const res = await login(loginEmail, loginPassword, loginRole);
    if (!res.success && res.error) {
      setFormError(res.error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (isLockedOut) {
      setFormError(`Registration rate limit active. Please wait ${lockoutSecondsRemaining}s.`);
      return;
    }

    if (!regName || !regEmail || !regPassword || !regBadge || !regGovIdNumber) {
      setFormError('Please complete all mandatory official identity and government credential fields.');
      return;
    }

    if (regPassword.length < 8) {
      setFormError('Security Password must contain at least 8 characters for cryptographic key derivation.');
      return;
    }

    if (!regAcceptedTerms) {
      setFormError('You must acknowledge the Official Secrets Act & Evidentiary integrity compliance oath.');
      return;
    }

    const res = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      badgeNumber: regBadge,
      cadre: regCadre,
      govIdType: regGovIdType,
      govIdNumber: regGovIdNumber,
      department: regDepartment || ROLE_CONFIGS[regRole].defaultDept,
      stationOrCourt: regStation || 'District Headquarters',
      jurisdictionState: regState,
    });

    if (!res.success && res.error) {
      setFormError(res.error);
    }
  };

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'Required', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, text: 'Good', color: 'bg-blue-500' };
    return { score: 4, text: 'FIPS Strong', color: 'bg-emerald-500' };
  };

  const passStrength = getPasswordStrength(regPassword);

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
              Anti-Flood Rate Limiting Armed
            </span>
            <span className="hidden md:inline">GovTech Node DEL-01</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
          {/* Left Column: Context, Blueprints & Security Metrics */}
          <div className="lg:col-span-5 space-y-5">
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
                  <span>Mandatory Access Control Enclave</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Secure-Doc
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  National Digital Evidence &amp; Investigation Management Platform
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Centralized, tamper-evident document lifecycle repository designed for law enforcement, judicial courts,
              and state forensic laboratories. Guarantees chain-of-custody, SHA-256 cryptographic immutability, and
              client-side AES-256 envelope encryption.
            </p>

            {/* Strict Access Security Notice */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 text-xs card-hover">
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <Shield className="w-4 h-4" />
                  <span>Strict Authorized Access Only</span>
                </span>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  Sec 65B Compliant
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Everyone accessing the portal must possess a registered officer account. If you do not have an account,
                you must complete official registration using your Gmail ID or Government email and service credentials.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Brute-Force Guard: Active</span>
                <span>Max Attempts: 5 / 60s</span>
              </div>
            </div>

            {/* Architecture Inspection Quick Cards */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-slate-400">System Blueprints &amp; SOPs</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  onClick={() => setActiveBlueprintModal('architecture')}
                  className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer transition card-hover"
                >
                  <p className="font-bold text-slate-900 text-[11px]">System Architecture</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">4-Phase Enclave Pipeline</p>
                </div>

                <div
                  onClick={() => setActiveBlueprintModal('custody')}
                  className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 cursor-pointer transition card-hover"
                >
                  <p className="font-bold text-slate-900 text-[11px]">Chain of Custody</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">ISO 27037 Lifecycle</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card (Login & Comprehensive Registration) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 card-hover">
              {/* Mode Switcher Tabs */}
              <div className="flex border border-slate-200 bg-slate-100 p-1 rounded-xl text-xs gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setFormError(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    mode === 'LOGIN'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Official Officer Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('REGISTER');
                    setFormError(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    mode === 'REGISTER'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <IdCard className="w-3.5 h-3.5" />
                  <span>Register Government Credentials</span>
                </button>
              </div>

              {/* Rate Limit Active Lockdown Banner */}
              {isLockedOut && (
                <div className="p-4 bg-red-950 text-red-100 rounded-xl border border-red-800 text-xs font-semibold space-y-1.5 animate-shake">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span>Security Rate Limit Lockdown Active</span>
                    </span>
                    <span className="text-[11px] font-mono bg-red-900 text-red-200 px-2 py-0.5 rounded border border-red-700">
                      Anti-Flood Defense
                    </span>
                  </div>
                  <p className="text-[11px] text-red-200 leading-relaxed">
                    Excessive failed login attempts detected. To protect system availability and block bulk brute-force
                    scripts, the authentication endpoint is locked for{' '}
                    <strong className="text-amber-300 font-mono text-xs">{lockoutSecondsRemaining} seconds</strong>.
                  </p>
                </div>
              )}

              {/* Form Error Alert */}
              {formError && !isLockedOut && (
                <div className="p-3.5 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800 font-semibold flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <p>{formError}</p>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* MODE 1: OFFICIAL OFFICER LOGIN                            */}
              {/* ========================================================= */}
              {mode === 'LOGIN' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Department Role Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Target Clearance Branch (RBAC)
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
                            className={`py-2 px-2.5 rounded-lg border text-xs font-bold text-center transition-all ${
                              isSel
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email Input (Supports Gmail or Gov email) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Email Address (Gmail or Government ID)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="officer.name@gmail.com or officer@delhipolice.gov.in"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Security Password</label>
                      <span className="text-[10px] text-slate-400 font-mono">FIPS 140-2 Keyed</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Dynamic Math Captcha if failed attempts >= 3 */}
                  {failedAttempts >= 3 && !isLockedOut && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-amber-900">
                        <span className="flex items-center gap-1.5">
                          <Fingerprint className="w-4 h-4 text-amber-700" />
                          <span>Bot Challenge: Verify Officer Nonce</span>
                        </span>
                        <span className="text-[10px] font-mono text-amber-700">Anti-Flood Guard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm bg-white px-3 py-1.5 rounded border border-amber-200">
                          {captchaNum1} + {captchaNum2} = ?
                        </span>
                        <input
                          type="number"
                          required
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          placeholder="Answer"
                          className="w-24 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Pre-Registered Evaluator Profiles Quick Selector */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pre-Enrolled Evaluator Profiles (SIH Jury)</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Click to Autofill</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                      {DEMO_ACCOUNTS.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            setLoginEmail(acc.email);
                            setLoginRole(acc.role);
                            setLoginPassword('password123');
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-white text-left transition truncate"
                        >
                          <span className="font-bold text-slate-800 block truncate">{acc.badgeNumber}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{acc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isLockedOut}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                        <span>Verifying Registered Enclave Records...</span>
                      </>
                    ) : (
                      <>
                        <span>Proceed to NIC GovAuth MFA Verification</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ========================================================= */
                /* MODE 2: REGISTER GOVERNMENT CREDENTIALS & GMAIL           */
                /* ========================================================= */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Branch Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Government Branch &amp; Role (RBAC)
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
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
                            className={`p-2 rounded-lg border text-left transition ${
                              isSel
                                ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="block leading-tight">{r}</span>
                            <span className="text-[10px] text-slate-500 font-normal line-clamp-1">
                              {cfg.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Officer Full Name &amp; Designation
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Insp. Rajesh Sharma"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gmail or Official Government Email
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="officer@gmail.com or officer@nic.in"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 2: Cadre and Official Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Service Cadre</label>
                      <select
                        value={regCadre}
                        onChange={(e) => setRegCadre(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none"
                      >
                        <option value="IPS">IPS (Indian Police Service)</option>
                        <option value="DANIPS">DANIPS / State Police Service</option>
                        <option value="CFSL_SCIENTIST">CFSL Scientific Cadre</option>
                        <option value="DJS">Delhi Judicial Service / High Court</option>
                        <option value="PROSECUTION">Central Prosecution Directorate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Badge / Service Number
                      </label>
                      <input
                        type="text"
                        required
                        value={regBadge}
                        onChange={(e) => setRegBadge(e.target.value)}
                        placeholder="e.g. POL-DL-8821"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  {/* Row 3: ID Proof Type and Reference Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Government ID Proof Type
                      </label>
                      <select
                        value={regGovIdType}
                        onChange={(e) => setRegGovIdType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none"
                      >
                        <option value="Police Service Identity Card">Police Departmental ID Card</option>
                        <option value="MHA Deputation ID">Ministry of Home Affairs Deputation ID</option>
                        <option value="CFSL Directorate Badge">CFSL Directorate Official Card</option>
                        <option value="High Court Bar / Registry Card">High Court Registry Identity Card</option>
                        <option value="Aadhaar-Linked Officer Card">Aadhaar-Linked Official ID</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ID Card Reference Number
                      </label>
                      <input
                        type="text"
                        required
                        value={regGovIdNumber}
                        onChange={(e) => setRegGovIdNumber(e.target.value)}
                        placeholder="e.g. GOV-ID-2026-90412"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 4: Station and State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Assigned Police Station / Court Bench
                      </label>
                      <input
                        type="text"
                        required
                        value={regStation}
                        onChange={(e) => setRegStation(e.target.value)}
                        placeholder="e.g. Connaught Place PS / Bench 04"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Jurisdiction State / UT
                      </label>
                      <select
                        value={regState}
                        onChange={(e) => setRegState(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none"
                      >
                        <option value="NCT of Delhi">NCT of Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="All India Central Jurisdiction">All India Central Jurisdiction</option>
                      </select>
                    </div>
                  </div>

                  {/* Password with live Strength Meter */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Security Password</label>
                      <span className="text-[10px] font-mono text-slate-500">
                        Strength:{' '}
                        <strong
                          className={
                            passStrength.score >= 3
                              ? 'text-emerald-700 font-bold'
                              : 'text-amber-700 font-bold'
                          }
                        >
                          {passStrength.text}
                        </strong>
                      </span>
                    </div>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 8 characters with letters, numbers & symbols"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                    <div className="flex gap-1 mt-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            passStrength.score >= step ? passStrength.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Statutory Oath Checkbox */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={regAcceptedTerms}
                      onChange={(e) => setRegAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-[11px] leading-relaxed cursor-pointer select-none">
                      I solemnly affirm under the <strong>Official Secrets Act, 1923</strong> and{' '}
                      <strong>Bharatiya Sakshya Adhiniyam, 2023</strong> that all entered credentials are genuine and
                      pertain to active government service.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isLockedOut}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                        <span>Enrolling Government Credentials...</span>
                      </>
                    ) : (
                      <>
                        <IdCard className="w-4 h-4 text-emerald-400" />
                        <span>Complete Registration &amp; Issue Security Token</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Blueprint Lightbox Modal */}
      {activeBlueprintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <span className="font-bold text-xs">
                {activeBlueprintModal === 'architecture'
                  ? 'Secure-Doc Cryptographic Architecture Blueprint'
                  : 'Institutional Digital Chain of Custody Protocol'}
              </span>
              <button
                type="button"
                onClick={() => setActiveBlueprintModal(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[75vh] flex items-center justify-center bg-slate-50">
              <img
                src={
                  activeBlueprintModal === 'architecture'
                    ? '/images/workflow_architecture.svg'
                    : '/images/chain_of_custody.svg'
                }
                alt="System Blueprint"
                className="max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
