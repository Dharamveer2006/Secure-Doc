'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, KeyRound, Smartphone, AlertCircle, RefreshCw } from 'lucide-react';
import { ROLE_CONFIGS } from '@/lib/constants';

export default function MfaModal() {
  const { isMfaModalOpen, pendingUser, verifyMfa, cancelMfa } = useAuth();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isMfaModalOpen) {
      setDigits(['', '', '', '', '', '']);
      setError(null);
      setTimer(180);
      return;
    }

    // Auto-focus first digit
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
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
    setDigits(['1', '2', '3', '4', '5', '6']);
    setError(null);
    inputRefs.current[5]?.focus();
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
        setError('Invalid or expired token code. Please retry or generate new code.');
      }
    } catch {
      setError('Cryptographic verification failed. Check server clock sync.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base tracking-wide text-white">MHA SecureAuth MFA</h3>
                <p className="text-xs text-slate-400">Restricted Government Access Step</p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              EAL6+ Token
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* User badge preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-5 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center font-bold text-xs ${roleConfig.bgLight} ${roleConfig.color} border ${roleConfig.borderColor} shrink-0`}>
              {pendingUser.role.slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900 truncate">{pendingUser.name}</p>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                  {pendingUser.badgeNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{pendingUser.department}</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full mb-2">
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>Token sent to registered government device</span>
            </div>
            <p className="text-xs text-slate-500">
              Enter the 6-digit cryptographic security code from your NIC / GovToken Authenticator.
            </p>
          </div>

          {/* 6 Digit Input Boxes */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-2.5 mb-5">
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
                  className="w-11 h-12 text-center text-xl font-bold font-mono text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
              <div className="flex items-center gap-1">
                <span>Code expires in:</span>
                <span className="font-mono font-semibold text-slate-700">{formatTimer(timer)}</span>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
              >
                <KeyRound className="w-3 h-3" />
                <span>Demo Code (123456)</span>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelMfa}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Grant Access</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security watermark footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-2.5 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 font-mono">
          <span>SHA-256 HMAC Session Bind</span>
          <span>•</span>
          <span>IP Trace: NIC-VPN Node 10.4.18.2</span>
        </div>
      </div>
    </div>
  );
}
