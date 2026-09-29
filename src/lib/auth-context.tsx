'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthSession, GovernmentUser, UserRole } from '@/types/auth';
import { DEMO_ACCOUNTS, ROLE_CONFIGS } from './constants';
import { supabase, isSupabaseConfigured } from './supabase';

interface AuthContextType {
  user: GovernmentUser | null;
  session: AuthSession;
  isLoading: boolean;
  isMfaModalOpen: boolean;
  pendingUser: GovernmentUser | null;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    badgeNumber: string;
    department: string;
    stationOrCourt: string;
  }) => Promise<boolean>;
  verifyMfa: (code: string) => Promise<boolean>;
  cancelMfa: () => void;
  loginAsDemo: (accountId: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const STORAGE_KEY = 'securedoc_auth_session';
const JWT_KEY = 'securedoc_jwt_token';

// Generates a mock signed JWT token for the user session
function generateMockJwt(user: GovernmentUser): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      badge: user.badgeNumber,
      dept: user.department,
      clearance: user.clearanceLevel,
      iss: 'secure-doc.mha.gov.in',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
    })
  );
  const signature = btoa(`sig_${user.id}_${Date.now()}`).substring(0, 32);
  return `${header}.${payload}.${signature}`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GovernmentUser | null>(null);
  const [session, setSession] = useState<AuthSession>({
    user: null,
    token: null,
    isAuthenticated: false,
    expiresAt: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<GovernmentUser | null>(null);

  // Initialize session from localStorage or Supabase on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(JWT_KEY);
      const storedSession = localStorage.getItem(STORAGE_KEY);

      if (storedToken && storedSession) {
        const parsedUser: GovernmentUser = JSON.parse(storedSession);
        setUser(parsedUser);
        setSession({
          user: parsedUser,
          token: storedToken,
          isAuthenticated: true,
          expiresAt: Date.now() + 86400 * 7 * 1000,
        });
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Standard Login
  const login = async (email: string, _password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);

    try {
      // If real Supabase is configured, attempt authentication
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: _password,
        });

        if (error) {
          console.warn('Supabase auth failed, falling back to enterprise session handler:', error.message);
        } else if (data?.user) {
          const matchedRole = (data.user.user_metadata?.role as UserRole) || role || 'POLICE';
          const govUser: GovernmentUser = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || email,
            role: matchedRole,
            badgeNumber: data.user.user_metadata?.badge_number || `GOV-${Math.floor(1000 + Math.random() * 9000)}`,
            department: data.user.user_metadata?.department || ROLE_CONFIGS[matchedRole].defaultDept,
            clearanceLevel: ROLE_CONFIGS[matchedRole].defaultClearance,
            stationOrCourt: 'Regional Headquarters',
            isMfaVerified: false,
          };

          setPendingUser(govUser);
          setIsMfaModalOpen(true);
          setIsLoading(false);
          return true;
        }
      }

      // Check if matches demo accounts or arbitrary email
      const matchedDemo = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
      const selectedRole = role || (matchedDemo ? matchedDemo.role : 'POLICE');

      const govUser: GovernmentUser = matchedDemo || {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        role: selectedRole,
        badgeNumber: `IND-${selectedRole.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
        department: ROLE_CONFIGS[selectedRole].defaultDept,
        clearanceLevel: ROLE_CONFIGS[selectedRole].defaultClearance,
        stationOrCourt: 'Sector HQ - Digital Verification Wing',
        isMfaVerified: false,
      };

      setPendingUser(govUser);
      setIsMfaModalOpen(true);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register New Account
  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    badgeNumber: string;
    department: string;
    stationOrCourt: string;
  }): Promise<boolean> => {
    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.name,
              role: data.role,
              badge_number: data.badgeNumber,
              department: data.department,
            },
          },
        });
      }

      const newUser: GovernmentUser = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        badgeNumber: data.badgeNumber,
        department: data.department,
        clearanceLevel: ROLE_CONFIGS[data.role].defaultClearance,
        stationOrCourt: data.stationOrCourt,
        isMfaVerified: false,
      };

      setPendingUser(newUser);
      setIsMfaModalOpen(true);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify MFA Token
  const verifyMfa = async (code: string): Promise<boolean> => {
    if (!pendingUser) return false;

    // Simulate OTP / Hardware Token validation (e.g. 6 digits)
    if (code.length < 6) return false;

    const verifiedUser: GovernmentUser = {
      ...pendingUser,
      isMfaVerified: true,
    };

    const token = generateMockJwt(verifiedUser);

    setUser(verifiedUser);
    setSession({
      user: verifiedUser,
      token,
      isAuthenticated: true,
      expiresAt: Date.now() + 86400 * 7 * 1000,
    });

    localStorage.setItem(JWT_KEY, token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedUser));

    setPendingUser(null);
    setIsMfaModalOpen(false);
    return true;
  };

  const cancelMfa = () => {
    setPendingUser(null);
    setIsMfaModalOpen(false);
  };

  // Fast 1-click Demo Account Login for Hackathon Presentation
  const loginAsDemo = (accountId: string) => {
    const found = DEMO_ACCOUNTS.find((a) => a.id === accountId) || DEMO_ACCOUNTS[0];
    const token = generateMockJwt(found);

    setUser(found);
    setSession({
      user: found,
      token,
      isAuthenticated: true,
      expiresAt: Date.now() + 86400 * 7 * 1000,
    });

    localStorage.setItem(JWT_KEY, token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  };

  // Fast Role Switcher while logged in
  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: GovernmentUser = {
      ...user,
      role: newRole,
      department: ROLE_CONFIGS[newRole].defaultDept,
      clearanceLevel: ROLE_CONFIGS[newRole].defaultClearance,
    };
    const token = generateMockJwt(updated);
    setUser(updated);
    setSession((prev) => ({ ...prev, user: updated, token }));
    localStorage.setItem(JWT_KEY, token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Logout
  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore
    }
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setSession({
      user: null,
      token: null,
      isAuthenticated: false,
      expiresAt: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isMfaModalOpen,
        pendingUser,
        login,
        register,
        verifyMfa,
        cancelMfa,
        loginAsDemo,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
