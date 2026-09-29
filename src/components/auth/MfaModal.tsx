'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  AlertCircle,
  RefreshCw,
  HardDrive,
  Copy,
  Check,
  Mail,
  Zap,
  Lock,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { ROLE_CONFIGS } from '@/lib/constants';

export default function MfaModal() {
  const {
    isMfaModalOpen,
    pendingUser,
    currentTotpCode,
    totpSecondsRemaining,
    verifyMfa,
    cancelMfa,
    resendMfaCode,
  } = useAuth();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMethod, setAuthMethod] = useState<'TOTP' | 'OTP' | 'HW_TOKEN'>('TOTP');
  const [copiedCode, setCopiedCode] = useState(false);
  const [hwTokenStatus, setHwTokenStatus] = useState<'READY' | 'VERIFYING' | 'AUTHENTICATED'>('READY');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isMfaModalOpen) {
      setDigits(['', '', '', '', '', '']);
      setError(null);
      setHwTokenStatus('READY');
      return;
    }

    // Auto-focus first digit on modal open
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  }, [isMfaModalOpen]);

  if (!isMfaModalOpen || !pendingUser) return null;

  const roleConfig = ROLE_CONFIGS[pendingUser.role];

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric input
    const clean = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);
    setError(null);

    // Auto-focus next input
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleQuickFill = () => {
    const codeArr = currentTotpCode.split('');
    setDigits(codeArr);
    setError(null);
    inputRefs.current[5]?.focus();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentTotpCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits of your MHA SecureAuth token.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const ok = await verifyMfa(fullCode);
      if (!ok) {
        setError('Invalid or expired security code. Please check the active TOTP rolling code.');
      }
    } catch {
      setError('Cryptographic verification failed. Check enclave clock synchronization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHwTokenAuthenticate = () => {
    setHwTokenStatus('VERIFYING');
    setTimeout(async () => {
      setHwTokenStatus('AUTHENTICATED');
      await verifyMfa(currentTotpCode);
    }, 1200);
  };

  // Mask email for display: g***a@gmail.com
  const maskEmail = (email: string) => {
    const parts = email.split('@');
    if (parts.length < 2) return email;
    const name = parts[0];
    const maskedName = name.length > 2 ? `${name[0]}••••${name[name.length - 1]}` : name;
    return `${maskedName}@${parts[1]}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        {/* Header Micro-Bar */}
        <div className="bg-slate-950 px-6 py-4 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 p-0.5 flex items-center justify-center shrink-0">
              <img
                src="/images/ncrb_seal.svg"
                alt="Government Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold tracking-wide text-slate-100">
                  NIC SecureAuth • MFA Gate
                </span>
                <span className="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold">
                  EAL6+ Enclave
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Mandatory Multi-Factor Cryptographic Verification
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-[10px] text-slate-400 hidden sm:block">
            <span className="text-emerald-400 block font-bold">NODE: DEL-NCRB-01</span>
            <span>TLS 1.3 ARMED</span>
          </div>
        </div>

        {/* Officer Clearance Details Pill */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 px-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${roleConfig.bgLight} ${roleConfig.color} border ${roleConfig.borderColor} shrink-0`}
            >
              {pendingUser.role.slice(0, 3)}
            </div>
            <div className="truncate">
              <p className="font-bold text-slate-900 truncate leading-tight">{pendingUser.name}</p>
              <p className="text-[11px] text-slate-500 font-mono truncate">
                Badge: {pendingUser.badgeNumber} • {pendingUser.stationOrCourt}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${roleConfig.bgLight} ${roleConfig.color} ${roleConfig.borderColor}`}
          >
            {pendingUser.clearanceLevel}
          </span>
        </div>

        {/* Auth Method Selector Tabs */}
        <div className="p-6 space-y-5">
          <div className="flex border border-slate-200 bg-slate-100 p-1 rounded-xl text-xs gap-1">
            <button
              type="button"
              onClick={() => setAuthMethod('TOTP')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
                authMethod === 'TOTP'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>GovAuth TOTP</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMethod('OTP')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
                authMethod === 'OTP'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              <span>Email &amp; SMS OTP</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMethod('HW_TOKEN')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
                authMethod === 'HW_TOKEN'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
              <span>USB e-Token</span>
            </button>
          </div>

          {/* Tab 1: Live GovAuth TOTP Display */}
          {authMethod === 'TOTP' && (
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Active Dynamic RFC 6238 Token</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Refreshes in <strong className="text-white">{totpSecondsRemaining}s</strong>
                </span>
              </div>

              {/* Progress bar countdown */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${(totpSecondsRemaining / 30) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <p className="text-[10px] font-mono uppercase text-slate-400">Time-Based One-Time Pin</p>
                  <p className="text-2xl font-black font-mono tracking-widest text-emerald-400">
                    {currentTotpCode.slice(0, 3)} {currentTotpCode.slice(3)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition"
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Auto-Fill</span>
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-tight">
                Synced with NIC GovAuth App &amp; Google Authenticator. Code mathematically rotates every 30s.
              </p>
            </div>
          )}

          {/* Tab 2: Email & SMS OTP Details */}
          {authMethod === 'OTP' && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-purple-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>Dispatched to Registered Channels</span>
                </span>
                <span className="text-[10px] font-mono bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                  SENT
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                A 6-digit cryptographic verification code has been dispatched to:{' '}
                <strong className="text-slate-800 font-mono">{maskEmail(pendingUser.email)}</strong> and registered
                secure mobile ending in <strong className="text-slate-800 font-mono">••••4091</strong>.
              </p>
              <div className="pt-2 flex justify-between items-center text-[11px]">
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-purple-700 hover:text-purple-900 font-bold underline"
                >
                  Click to auto-populate received OTP
                </button>
                <button
                  type="button"
                  onClick={resendMfaCode}
                  className="text-slate-500 hover:text-slate-700 flex items-center gap-1 font-mono"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Hardware USB e-Token */}
          {authMethod === 'HW_TOKEN' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between text-emerald-950 font-bold">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-emerald-700" />
                  <span>SafeNet eToken 5110 (FIPS 140-2 Level 3)</span>
                </span>
                <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                  DETECTED
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Physical cryptographic security token detected in USB port. Touch the security key or click verify to
                sign session challenge with Class 3 PKI key.
              </p>
              <button
                type="button"
                onClick={handleHwTokenAuthenticate}
                disabled={hwTokenStatus !== 'READY'}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {hwTokenStatus === 'VERIFYING' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Signing Cryptographic Nonce...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>Authenticate via Hardware e-Token</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* 6-Digit Pin Input Form */}
          {authMethod !== 'HW_TOKEN' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2 text-center">
                  Enter 6-Digit Cryptographic Verification Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-13 text-center text-xl font-bold font-mono text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:bg-white focus:outline-none transition shadow-xs"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 font-semibold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={cancelMfa}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel Session
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || digits.join('').length < 6}
                  className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                      <span>Verifying Cryptographic Attestation...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Authorize Enclave Entry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Cryptographic Security Details Footer */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>CHALLENGE: NONCE-7F89B2</span>
            <span>IP: 10.42.108.19 (VPC)</span>
            <span className="text-emerald-700 font-bold">SHA-256 HMAC OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
