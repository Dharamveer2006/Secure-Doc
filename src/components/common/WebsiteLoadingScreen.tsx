'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, KeyRound, Cpu, CheckCircle2 } from 'lucide-react';

interface WebsiteLoadingScreenProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

export default function WebsiteLoadingScreen({
  onLoaded,
  minDurationMs = 1800,
}: WebsiteLoadingScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isDestroyed, setIsDestroyed] = useState<boolean>(false);

  const diagnosticSteps = [
    { label: 'Generating Ephemeral Client Enclave Keys', tag: 'INIT' },
    { label: 'Arming SHA-256 Bitstream Integrity Engine', tag: 'FIPS 180-4' },
    { label: 'Initializing AES-256 Envelope Cipher (NIST SP 800-38D)', tag: 'AES-256' },
    { label: 'Synchronizing Permissioned Ledger Node DEL-NCRB-01', tag: 'BLOCKCHAIN' },
    { label: 'Evidentiary Chain-of-Custody Verified • System Ready', tag: 'SEC 65B' },
  ];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(Math.round((elapsed / minDurationMs) * 100), 100);

      setProgress(rawProgress);

      // Map progress to diagnostic message steps
      if (rawProgress < 22) {
        setCurrentStepIndex(0);
      } else if (rawProgress < 48) {
        setCurrentStepIndex(1);
      } else if (rawProgress < 72) {
        setCurrentStepIndex(2);
      } else if (rawProgress < 94) {
        setCurrentStepIndex(3);
      } else {
        setCurrentStepIndex(4);
      }

      if (rawProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setIsDestroyed(true);
            if (onLoaded) onLoaded();
          }, 500);
        }, 250);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [minDurationMs, onLoaded]);

  if (isDestroyed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#070b14] flex flex-col items-center justify-center p-6 text-white transition-all duration-500 selection:bg-blue-600 ${
        isFadingOut ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Center Content Box */}
      <div className="relative flex flex-col items-center text-center max-w-md w-full z-10 space-y-6">
        
        {/* Animated Central Emblem with Halo Rings */}
        <div className="relative flex items-center justify-center w-36 h-36">
          {/* Outer Slow Rotating Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/40 animate-spin-slow pointer-events-none" />
          
          {/* Inner Reverse Rotating Ring */}
          <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-spin-reverse pointer-events-none" />

          {/* Glowing Radial Backdrop */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-900/60 to-slate-900/90 shadow-2xl backdrop-blur-md border border-slate-700/60" />

          {/* Official Website Logo Emblem */}
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-950/80 p-1.5 shadow-2xl flex items-center justify-center border border-slate-700/80 group">
            <img
              src="/images/ncrb_seal.svg"
              alt="Secure-Doc Official National Emblem"
              className="w-full h-full object-contain filter drop-shadow-md animate-subtle-float"
            />
          </div>

          {/* Operational Pulse Dot */}
          <div className="absolute bottom-2 right-2 flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-emerald-500/30 animate-ping absolute" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070b14]" />
          </div>
        </div>

        {/* Title and Government Hierarchy */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10.5px] font-semibold text-slate-300 font-mono tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>GOVERNMENT OF INDIA • MHA / NCRB</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Secure-Doc</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold uppercase tracking-wider">
              GovTech Enclave
            </span>
          </h1>

          <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
            National Digital Evidence &amp; Investigation Management Platform
          </p>
        </div>

        {/* Progress Bar and Dynamic Ticker */}
        <div className="w-full space-y-3 pt-2">
          {/* Progress Bar Container */}
          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-75 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage & Diagnostic Tag Row */}
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>[ {diagnosticSteps[currentStepIndex].tag} ]</span>
            </span>
            <span className="font-bold text-slate-200">{progress}%</span>
          </div>

          {/* Diagnostic Message Box */}
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

        {/* Bottom Legal Security Badges */}
        <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/60 w-full">
          <span>SHA-256 (NIST)</span>
          <span>•</span>
          <span>AES-256-GCM</span>
          <span>•</span>
          <span>SEC 65B EVIDENCE ACT</span>
        </div>
      </div>
    </div>
  );
}
