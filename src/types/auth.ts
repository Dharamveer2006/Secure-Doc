export type UserRole = 'POLICE' | 'COURT' | 'FORENSICS' | 'LEGAL' | 'NCRB_ADMIN';

export interface GovernmentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeNumber: string;
  department: string;
  clearanceLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';
  stationOrCourt: string;
  isMfaVerified: boolean;
  avatarUrl?: string;
}

export interface AuthSession {
  user: GovernmentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  expiresAt: number | null;
}

export interface RoleConfig {
  label: string;
  fullName: string;
  color: string;
  bgLight: string;
  borderColor: string;
  defaultDept: string;
  defaultClearance: GovernmentUser['clearanceLevel'];
  description: string;
  iconName: string;
}
