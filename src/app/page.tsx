'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import AuthScreen from '@/components/auth/AuthScreen';
import AppShell from '@/components/layout/AppShell';
import MfaModal from '@/components/auth/MfaModal';
import WebsiteLoadingScreen from '@/components/common/WebsiteLoadingScreen';
import PublicNavbar, { PublicPageTab } from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import HomePage from '@/components/public/HomePage';
import AboutPage from '@/components/public/AboutPage';
import PrivacyPolicyPage from '@/components/public/PrivacyPolicyPage';
import ContactPage from '@/components/public/ContactPage';
import PublicDocketsPage from '@/components/public/PublicDocketsPage';

function PageContent() {
  const { user, session } = useAuth();
  const [hasCompletedLoading, setHasCompletedLoading] = useState(false);
  const [publicTab, setPublicTab] = useState<PublicPageTab>('home');
  const [authViewOpen, setAuthViewOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  const handleOpenLogin = () => {
    setAuthInitialMode('LOGIN');
    setAuthViewOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRegister = () => {
    setAuthInitialMode('REGISTER');
    setAuthViewOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {!hasCompletedLoading && (
        <WebsiteLoadingScreen onLoaded={() => setHasCompletedLoading(true)} />
      )}

      <div className={!hasCompletedLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        {/* If user is authenticated, render full Enclave AppShell */}
        {session.isAuthenticated && user ? (
          <AppShell />
        ) : authViewOpen ? (
          /* If user chose to login/register, render AuthScreen */
          <AuthScreen
            onBackToPortal={() => setAuthViewOpen(false)}
            initialMode={authInitialMode}
          />
        ) : (
          /* Public 3D Modern Portal */
          <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
            <PublicNavbar
              activeTab={publicTab}
              onSelectTab={setPublicTab}
              onOpenLogin={handleOpenLogin}
              onOpenRegister={handleOpenRegister}
            />

            <main className="flex-1">
              {publicTab === 'home' && (
                <HomePage
                  onSelectTab={setPublicTab}
                  onOpenLogin={handleOpenLogin}
                  onOpenRegister={handleOpenRegister}
                />
              )}
              {publicTab === 'about' && (
                <AboutPage
                  onSelectTab={setPublicTab}
                  onOpenLogin={handleOpenLogin}
                />
              )}
              {publicTab === 'dockets' && (
                <PublicDocketsPage
                  onSelectTab={setPublicTab}
                  onOpenLogin={handleOpenLogin}
                />
              )}
              {publicTab === 'policy' && (
                <PrivacyPolicyPage
                  onSelectTab={setPublicTab}
                  onOpenLogin={handleOpenLogin}
                />
              )}
              {publicTab === 'contact' && (
                <ContactPage
                  onSelectTab={setPublicTab}
                  onOpenLogin={handleOpenLogin}
                />
              )}
            </main>

            <PublicFooter
              onSelectTab={setPublicTab}
              onOpenLogin={handleOpenLogin}
            />
          </div>
        )}

        {/* Global Multi-Factor Authenticator Modal */}
        <MfaModal />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <PageContent />
    </AuthProvider>
  );
}
