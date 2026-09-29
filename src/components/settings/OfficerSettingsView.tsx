'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ROLE_CONFIGS } from '@/lib/constants';
import {
  UserCheck,
  Shield,
  KeyRound,
  FileBadge,
  HardDrive,
  Laptop,
  Clock,
  CheckCircle2,
  Lock,
  History,
  Copy,
  Check,
  Sliders,
  Bell,
  Eye,
  RefreshCw,
  Building,
} from 'lucide-react';

export default function OfficerSettingsView() {
  const { user } = useAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [autoLockMinutes, setAutoLockMinutes] = useState('15');
  const [enforceWatermark, setEnforceWatermark] = useState(true);
  const [tamperAlertsEmail, setTamperAlertsEmail] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) return null;
  const roleConfig = ROLE_CONFIGS[user.role];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const recentSessions = [
    {
      id: 'SES-9012',
      ip: '10.42.108.19',
      location: 'Delhi Police HQ, Jai Singh Road',
      device: 'Secured Workstation (Ubuntu 24.04 LTS)',
      time: 'Today, 21:40 IST',
      status: 'ACTIVE_SESSION',
    },
    {
      id: 'SES-8841',
      ip: '10.42.108.19',
      location: 'Delhi Police HQ, Jai Singh Road',
      device: 'Secured Workstation (Ubuntu 24.04 LTS)',
      time: 'Yesterday, 18:15 IST',
      status: 'TERMINATED',
    },
    {
      id: 'SES-8120',
      ip: '14.139.60.22',
      location: 'NIC Gov Cloud Enclave, New Delhi',
      device: 'GovTech Terminal (Windows 11 Enterprise)',
      time: '27 Sep 2026, 11:02 IST',
      status: 'TERMINATED',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-mono">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Officer Profile &amp; Cryptographic Identity</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">MHA Digital Id v2.4</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Officer Credentials &amp; Node Security Settings
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            Manage your digital signature certificate, FIPS 140-2 cryptographic token status, session auto-lock
            thresholds, and evidence export watermarking preferences.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Session ID: SES-9012</span>
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Security preferences updated and synchronized with MHA GovTech Enclave.</span>
        </div>
      )}

      {/* Main Profile & PKI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Officer Badge Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs card-hover space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center border-2 border-slate-700 shadow-xs shrink-0">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate">{user.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{roleConfig.label}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${roleConfig.bgLight} ${roleConfig.color} ${roleConfig.borderColor}`}
                >
                  {user.clearanceLevel}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Officer Badge / ID</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{user.badgeNumber}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Jurisdiction Station / Court</span>
              <span className="font-semibold text-slate-800">{user.stationOrCourt}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Official Government Email</span>
              <span className="font-mono text-slate-700">{user.badgeNumber.toLowerCase()}@delhipolice.gov.in</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned GovTech Node</span>
              <span className="font-mono text-slate-700">DEL-NCRB-NODE-01 (MHA Enclave)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Statutory Standing</span>
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Empowered under Section 65B(4) Indian Evidence Act and Section 79A IT Act to sign electronic evidence dockets.
            </p>
          </div>
        </div>

        {/* Right Column (2 cols wide): PKI Certificate & Security Preferences */}
        <div className="lg:col-span-2 space-y-6">
          {/* PKI Class 3 Digital Certificate */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs card-hover space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-purple-600" />
                <span>Class 3 National PKI Digital Certificate (X.509 v3)</span>
              </h3>
              <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 font-bold">
                NIC-CA Validated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Certificate Serial No</span>
                <span className="font-mono font-bold text-slate-800">4F:8A:29:01:CE:5B:78:22</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Validity Period</span>
                <span className="font-mono text-emerald-700 font-bold">01 Jan 2025 to 31 Dec 2027</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Public Key SHA-256 Fingerprint
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'thumbprint')}
                  className="text-[11px] font-mono text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {copiedKey === 'thumbprint' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Fingerprint</span>
                    </>
                  )}
                </button>
              </div>
              <p className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs break-all select-all">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Cryptographic Hardware e-Token:</span>
                <span className="font-bold text-blue-900">SafeNet eToken 5110 (FIPS 140-2 Level 3)</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                INSERTED &amp; LOCKED
              </span>
            </div>
          </div>

          {/* Preferences & Security Form */}
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs card-hover space-y-5">
            <div className="pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Security Governance &amp; Session Configuration</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">
                    Session Inactivity Auto-Lock
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Automatically lock the browser session and zeroize AES decryption keys after inactivity.
                  </p>
                </div>
                <select
                  value={autoLockMinutes}
                  onChange={(e) => setAutoLockMinutes(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">5 Minutes</option>
                  <option value="15">15 Minutes (Recommended)</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">
                    Mandatory Watermark Injection
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Stamp officer badge number, timestamp, and legal disclaimer on all exported digital evidence previews.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enforceWatermark}
                  onChange={(e) => setEnforceWatermark(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">
                    Instant Tamper &amp; ACL Alerts
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Send high-priority security notifications when a hash verification failure occurs or ACL link expires.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={tamperAlertsEmail}
                  onChange={(e) => setTamperAlertsEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-xs"
              >
                <span>Save Security Configuration</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs card-hover space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <span>Recent Officer Access &amp; Network Session Audit Log</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500">Last 3 Authentications</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-3">Session ID</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Physical Location</th>
                <th className="p-3">Device &amp; Operating System</th>
                <th className="p-3">Authentication Timestamp</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSessions.map((ses) => (
                <tr key={ses.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-mono font-bold text-slate-800">{ses.id}</td>
                  <td className="p-3 font-mono text-slate-700">{ses.ip}</td>
                  <td className="p-3 text-slate-700">{ses.location}</td>
                  <td className="p-3 text-slate-600">{ses.device}</td>
                  <td className="p-3 font-mono text-slate-500">{ses.time}</td>
                  <td className="p-3">
                    {ses.status === 'ACTIVE_SESSION' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        CURRENT
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">EXPIRED</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
