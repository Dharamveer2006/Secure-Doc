'use client';

import React from 'react';
import { PublicPageTab } from './PublicNavbar';
import {
  ShieldCheck,
  Lock,
  ExternalLink,
  Scale,
  FileCheck2,
  HardDrive,
  Mail,
  Building2,
  CheckCircle2,
  Code2,
} from 'lucide-react';

interface PublicFooterProps {
  onSelectTab: (tab: PublicPageTab) => void;
  onOpenLogin: () => void;
}

export default function PublicFooter({ onSelectTab, onOpenLogin }: PublicFooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      {/* Top Footer Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand & Mandate */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 p-0.5 flex items-center justify-center shrink-0">
              <img
                src="/images/ncrb_seal.svg"
                alt="Government Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">
                Secure-Doc
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                MHA / NCRB National Evidentiary Repository
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Zero-knowledge, client-side cryptographic document management platform developed for the{' '}
            <strong className="text-white">Smart India Hackathon 2026</strong> under the Ministry of Home Affairs,
            National Crime Records Bureau (NCRB), Women Safety Division.
          </p>

          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            <span className="bg-slate-900 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-bold">
              ISO/IEC 27037:2012
            </span>
            <span className="bg-slate-900 text-blue-400 border border-blue-900 px-2 py-0.5 rounded font-bold">
              FIPS 180-4 SHA-256
            </span>
            <span className="bg-slate-900 text-purple-400 border border-purple-900 px-2 py-0.5 rounded font-bold">
              IEA SEC 65B &amp; BSA 63
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            System Modules
          </p>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('home')}
                className="hover:text-white transition"
              >
                3D Interactive Overview
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('about')}
                className="hover:text-white transition"
              >
                4-Phase System Architecture
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('dockets')}
                className="hover:text-white transition"
              >
                Classified Case Dockets Archive
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenLogin}
                className="text-blue-400 hover:text-blue-300 font-semibold transition flex items-center gap-1"
              >
                <span>Officer Secure Login</span>
                <span>&rarr;</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Statutory & Legal */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Statutory Framework
          </p>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('policy')}
                className="hover:text-white transition"
              >
                Privacy &amp; Data Protection Policy
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('policy')}
                className="hover:text-white transition"
              >
                DPDP Act, 2023 Compliance
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('policy')}
                className="hover:text-white transition"
              >
                Official Secrets Act (1923) Mandate
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('policy')}
                className="hover:text-white transition"
              >
                Sec 65B Electronic Admissibility
              </button>
            </li>
          </ul>
        </div>

        {/* Nodal & Institutional */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Institutional Nodal Desk
          </p>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('contact')}
                className="hover:text-white transition"
              >
                Nodal Officers Directory
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('contact')}
                className="hover:text-white transition"
              >
                24/7 Forensic Incident Desk
              </button>
            </li>
            <li>
              <a
                href="https://github.com/Dharamveer2006/Secure-Doc"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Copyright Bar */}
      <div className="border-t border-slate-900 bg-black/60 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            &copy; 2026 Government of India • Ministry of Home Affairs • National Crime Records Bureau. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px]">
            <span>NODE: DEL-NCRB-01</span>
            <span>•</span>
            <span className="text-emerald-400">ENCLAVE SECURE</span>
            <span>•</span>
            <span>SIH 2026 EDITION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
