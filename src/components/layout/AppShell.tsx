'use client';

import React, { useState } from 'react';
import AppHeader from './AppHeader';
import AppSidebar, { NavTab } from './AppSidebar';
import DashboardOverview from '../dashboard/DashboardOverview';
import CaseDocketRepositoryView from '../cases/CaseDocketRepositoryView';
import SecureUploadView from '../upload/SecureUploadView';
import SecureDocumentViewer from '../viewer/SecureDocumentViewer';
import InterDepartmentSharingView from '../sharing/InterDepartmentSharingView';
import AuditLogsView from '../audit/AuditLogsView';
import CryptoEnclaveMonitorView from '../security/CryptoEnclaveMonitorView';
import LegalComplianceView from '../compliance/LegalComplianceView';
import OfficerSettingsView from '../settings/OfficerSettingsView';
import { useAuth } from '@/lib/auth-context';
import { ChevronRight } from 'lucide-react';

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const { user } = useAuth();

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Evidentiary Case Docket & System Metrics';
      case 'cases':
        return 'Classified Investigation & Case Dockets Repository';
      case 'upload':
        return 'Digital Ingestion & Client-Side OCR Extraction';
      case 'viewer':
        return 'Client AES Decryption & SHA-256 Tamper Verification';
      case 'sharing':
        return 'Inter-Agency Evidence Sharing & ACL Access Control';
      case 'audit':
        return 'Immutable Audit Ledger & ISO 27037 Chain of Custody';
      case 'security':
        return 'Cryptographic Enclave & Live File Hash Calculator';
      case 'compliance':
        return 'Indian Evidence Act Sec 65B & BSA 2023 Statutory Library';
      case 'settings':
        return 'Officer Profile, Class 3 PKI Certificate & Security';
      default:
        return 'Operational Command';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Application Header with Global Search and Horizontal Tabs */}
      <AppHeader activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Body Shell: Sidebar + Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <AppSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-4">
          {/* Breadcrumbs & Operational Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-1.5 font-medium">
              <span
                onClick={() => setActiveTab('dashboard')}
                className="text-slate-400 hover:text-slate-700 cursor-pointer transition"
              >
                Secure-Doc Portal
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 font-semibold capitalize">
                {activeTab === 'cases' ? 'Case Dockets' : activeTab}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <span className="text-slate-500 hidden sm:inline">{getBreadcrumbTitle()}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Active Session: {user?.badgeNumber}</span>
              </span>
            </div>
          </div>

          {/* Active View Container */}
          <div className="transition-all duration-150">
            {activeTab === 'dashboard' && <DashboardOverview onNavigateTab={setActiveTab} />}
            {activeTab === 'cases' && <CaseDocketRepositoryView onNavigateTab={setActiveTab} />}
            {activeTab === 'upload' && <SecureUploadView />}
            {activeTab === 'viewer' && <SecureDocumentViewer />}
            {activeTab === 'sharing' && <InterDepartmentSharingView />}
            {activeTab === 'audit' && <AuditLogsView />}
            {activeTab === 'security' && <CryptoEnclaveMonitorView />}
            {activeTab === 'compliance' && <LegalComplianceView />}
            {activeTab === 'settings' && <OfficerSettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
}
