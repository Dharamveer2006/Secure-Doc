'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import AuthScreen from '@/components/auth/AuthScreen';
import AppShell from '@/components/layout/AppShell';
import MfaModal from '@/components/auth/MfaModal';
import WebsiteLoadingScreen from '@/components/common/WebsiteLoadingScreen';

function PageContent() {
  const { user, session } = useAuth();
  const [hasCompletedLoading, setHasCompletedLoading] = useState(false);

  return (
    <>
      {!hasCompletedLoading && (
        <WebsiteLoadingScreen onLoaded={() => setHasCompletedLoading(true)} />
      )}

      <div className={!hasCompletedLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        {session.isAuthenticated && user ? <AppShell /> : <AuthScreen />}
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

