'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { ROLE_CONFIGS } from '@/lib/constants';
import {
  LayoutDashboard,
  UploadCloud,
  Share2,
  FileText,
  ShieldCheck,
  Building2,
  Layers,
  FileCheck2,
  FolderGit2,
  History,
  Eye,
  Cpu,
  Scale,
  Settings,
  Shield,
  Key,
  Database,
  Lock,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'cases'
  | 'upload'
  | 'viewer'
  | 'sharing'
  | 'audit'
  | 'security'
  | 'compliance'
  | 'settings';

interface AppSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

interface NavSection {
  title: string;
  items: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    badge?: string;
    badgeColor?: string;
  }[];
}

export default function AppSidebar({ activeTab, onSelectTab }: AppSidebarProps) {
  const { user } = useAuth();
  if (!user) return null;

  const roleConfig = ROLE_CONFIGS[user.role];

  const navSections: NavSection[] = [
    {
      title: 'Core Evidentiary Pipeline',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Overview',
          icon: LayoutDashboard,
          description: 'Case docket pipeline, evidence flow & operational metrics',
        },
        {
          id: 'cases',
          label: 'Case Dockets Archive',
          icon: FolderGit2,
          description: 'Comprehensive repository across Police, CFSL, Courts & MHA',
          badge: '1,428 Dockets',
        },
        {
          id: 'upload',
          label: 'Secure Upload & OCR',
          icon: UploadCloud,
          description: 'Client-side OCR, SHA-256 integrity & AES-256 packaging',
          badge: 'Enclave Active',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        {
          id: 'viewer',
          label: 'Universal Secure Viewer',
          icon: Eye,
          description: 'Client AES decryption, universal preview & tamper testing',
          badge: 'Sec 65B Proof',
        },
      ],
    },
    {
      title: 'Custody & Cryptography',
      items: [
        {
          id: 'sharing',
          label: 'Inter-Agency Sharing',
          icon: Share2,
          description: 'Time-bounded legal access tokens & cross-department ACLs',
          badge: 'ACL Active',
        },
        {
          id: 'audit',
          label: 'Immutable Audit Ledger',
          icon: History,
          description: 'Tamper-evident legal ledger & Section 65B chain of custody',
          badge: 'Zero-Knowledge',
        },
        {
          id: 'security',
          label: 'Cryptographic Enclave',
          icon: Cpu,
          description: 'Live file hash calculator, HSM telemetry & FIPS 180-4 engine',
          badge: 'FIPS 180-4',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        },
      ],
    },
    {
      title: 'Statutory Law & Governance',
      items: [
        {
          id: 'compliance',
          label: 'Legal Compliance Library',
          icon: Scale,
          description: 'IEA Sec 65B, BSA 2023 Sec 63, Supreme Court rulings & affidavit templates',
          badge: 'BSA / IEA',
        },
        {
          id: 'settings',
          label: 'Officer Profile & Security',
          icon: Settings,
          description: 'Class 3 PKI certificate, HSM token status & session security',
          badge: 'PKI Level 3',
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-77px)]">
      {/* Top Section */}
      <div className="p-4 space-y-5">
        {/* Active Clearance Badge Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Department Clearance
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${roleConfig.bgLight} ${roleConfig.color} ${roleConfig.borderColor}`}
            >
              {user.clearanceLevel}
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900 leading-tight">{roleConfig.label}</p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.stationOrCourt}</p>
          </div>

          <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-mono">
            <span>Badge: {user.badgeNumber}</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              PKI Linked
            </span>
          </div>
        </div>

        {/* Grouped Navigation */}
        <div className="space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all group relative ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 card-hover'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-r-md"></span>
                    )}
                    <div className="flex items-center gap-2.5 min-w-0 pl-1">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-700'
                        }`}
                      />
                      <span className="truncate leading-none">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border shrink-0 transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-500'
                            : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Cryptographic System Card */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-semibold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Zero-Knowledge Node</span>
          </span>
          <span className="text-emerald-700 font-bold font-mono text-[10px]">SYNCED</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2 text-[10px] text-slate-500 space-y-1 font-mono">
          <div className="flex justify-between">
            <span>Client AES Key:</span>
            <span className="text-slate-800 font-bold">Ephemeral-256</span>
          </div>
          <div className="flex justify-between">
            <span>Hash Engine:</span>
            <span className="text-slate-800 font-bold">SHA-256 (NIST)</span>
          </div>
          <div className="flex justify-between">
            <span>MHA Enclave:</span>
            <span className="text-emerald-700 font-bold">Isolated (VPC)</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center">
          Secure-Doc v2.0 • SIH 2026 Reference Build
        </p>
      </div>
    </aside>
  );
}
