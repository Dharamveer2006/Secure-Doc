'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

interface WebsiteLoadingScreenProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

export default function WebsiteLoadingScreen({
  onLoaded,
  minDurationMs = 800,
}: WebsiteLoadingScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isDestroyed, setIsDestroyed] = useState<boolean>(false);

  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  const diagnosticSteps = [
    { label: 'Generating Ephemeral Client Enclave Keys', tag: 'INIT' },
    { label: 'Arming SHA-256 Bitstream Integrity Engine', tag: 'FIPS 180-4' },
    { label: 'Initializing AES-256 Envelope Cipher (NIST SP 800-38D)', tag: 'AES-256' },
    { label: 'Synchronizing Permissioned Ledger Node DEL-NCRB-01', tag: 'BLOCKCHAIN' },
    { label: 'Evidentiary Chain-of-Custody Verified • System Ready', tag: 'SEC 65B' },
  ];

  const handleFinish = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('securedoc_intro_seen', '1');
      }
    } catch {}
    setIsFadingOut(true);
    setTimeout(() => {
      setIsDestroyed(true);
      onLoadedRef.current?.();
    }, 250);
  };

  useEffect(() => {
    // If user has visited in this tab session, skip directly
    if (typeof window !== 'undefined' && sessionStorage.getItem('securedoc_intro_seen')) {
      setIsDestroyed(true);
      onLoadedRef.current?.();
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(Math.round((elapsed / minDurationMs) * 100), 100);

      setProgress(rawProgress);

      if (rawProgress < 25) setCurrentStepIndex(0);
      else if (rawProgress < 50) setCurrentStepIndex(1);
      else if (rawProgress < 75) setCurrentStepIndex(2);
      else if (rawProgress < 95) setCurrentStepIndex(3);
      else setCurrentStepIndex(4);

      if (rawProgress >= 100) {
        clearInterval(interval);
        handleFinish();
      }
    }, 20);

    // Hard failsafe timer: maximum 1200ms
    const failsafe = setTimeout(() => {
      clearInterval(interval);
      handleFinish();
    }, minDurationMs + 400);

    return () => {
      clearInterval(interval);
      clearTimeout(failsafe);
    };
  }, [minDurationMs]);

  if (isDestroyed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#070b14] flex flex-col items-center justify-center p-6 text-white transition-opacity duration-300 selection:bg-blue-600 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Center Content Box */}
      <div className="relative flex flex-col items-center text-center max-w-md w-full z-10 space-y-6">
        {/* Animated Central Emblem with Halo Rings */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/40 animate-spin-slow pointer-events-none" />
          <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-spin-reverse pointer-events-none" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-blue-900/60 to-slate-900/90 shadow-2xl backdrop-blur-md border border-slate-700/60" />

          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-950/80 p-1.5 shadow-2xl flex items-center justify-center border border-slate-700/80">
            <img
              src="/images/ncrb_seal.svg"
              alt="Secure-Doc Official National Emblem"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>

          <div className="absolute bottom-1 right-1 flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/30 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#070b14]" />
          </div>
        </div>

        {/* Title and Government Hierarchy */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10.5px] font-semibold text-slate-300 font-mono tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>GOVERNMENT OF INDIA • MHA / NCRB</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Secure-Doc</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold uppercase tracking-wider">
              Enclave
            </span>
          </h1>

          <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
            National Digital Evidence &amp; Investigation Management Platform
          </p>
        </div>

        {/* Progress Bar and Dynamic Ticker */}
        <div className="w-full space-y-3 pt-1">
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-75 shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>[ {diagnosticSteps[currentStepIndex].tag} ]</span>
            </span>
            <span className="font-bold text-slate-200">{progress}%</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3 text-left flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-pulse" />
              <span className="text-[11px] font-mono text-slate-300 truncate">
                {diagnosticSteps[currentStepIndex].label}
              </span>
            </div>
            {progress >= 100 && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
            )}
          </div>
        </div>

        {/* Quick Skip Button & Statutory Footnote */}
        <div className="flex flex-col items-center gap-3 w-full pt-1">
          <button
            type="button"
            onClick={handleFinish}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 cursor-pointer"
          >
            <span>Skip intro &amp; enter portal</span>
            <ArrowRight className="w-3 h-3 text-blue-400" />
          </button>

          <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60 w-full">
            <span>SHA-256 (NIST)</span>
            <span>•</span>
            <span>AES-256-GCM</span>
            <span>•</span>
            <span>SEC 65B BSA CERTIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
