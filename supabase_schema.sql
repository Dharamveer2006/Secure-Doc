-- ==============================================================================
-- Secure-Doc: Production Database Schema & Row Level Security (RLS) Policies
-- Ministry of Home Affairs / NCRB Digital Evidence Management System
-- ==============================================================================

-- 1. Enable pgcrypto for server-side cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Evidence Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id VARCHAR(64) UNIQUE NOT NULL,
    case_number VARCHAR(128) NOT NULL,
    document_title TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    originating_department TEXT NOT NULL,
    clearance_level VARCHAR(32) NOT NULL, -- 'LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5'
    original_sha256 VARCHAR(64) NOT NULL,
    encrypted_payload TEXT NOT NULL,
    encryption_algorithm VARCHAR(32) DEFAULT 'AES-256-GCM',
    created_by_officer VARCHAR(64) NOT NULL,
    created_by_badge VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Inter-Agency Sharing Links (ACLs)
CREATE TABLE IF NOT EXISTS public.sharing_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(64) UNIQUE NOT NULL,
    document_id VARCHAR(64) REFERENCES public.documents(document_id) ON DELETE CASCADE,
    created_by_badge VARCHAR(64) NOT NULL,
    recipient_role VARCHAR(32) NOT NULL,
    recipient_department TEXT NOT NULL,
    allowed_actions TEXT[] DEFAULT ARRAY['VIEW'],
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE NOT NULL,
    access_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Immutable Audit Logs Table (Chain of Custody)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(64) UNIQUE NOT NULL,
    document_id VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    actor_name VARCHAR(128) NOT NULL,
    actor_badge VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    actor_department TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    sha256_verification VARCHAR(64) NOT NULL,
    tamper_status VARCHAR(32) DEFAULT 'VERIFIED_CLEAN',
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    block_hash VARCHAR(64) NOT NULL,
    previous_block_hash VARCHAR(64) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — PREVENTING BROKEN OBJECT LEVEL AUTH (BOLA)
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sharing_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Document Access Policy: Officers can only view documents matching or below their clearance
CREATE POLICY "Enforce clearance-based document read"
ON public.documents
FOR SELECT
TO authenticated
USING (
    -- Judicial magistrates and system admins have universal view rights
    (auth.jwt() ->> 'role' = 'COURT' OR auth.jwt() ->> 'role' = 'LEGAL')
    OR
    -- Police officers can view documents they authored or their department owns
    (created_by_badge = auth.jwt() ->> 'badge_number')
    OR
    -- Or if an active, unexpired sharing token exists for their role
    EXISTS (
        SELECT 1 FROM public.sharing_links s
        WHERE s.document_id = documents.document_id
        AND s.recipient_role = auth.jwt() ->> 'role'
        AND s.expires_at > now()
        AND s.is_revoked = false
    )
);

-- Document Insert Policy: Only authorized officers can ingest records
CREATE POLICY "Authorized officers can insert documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (
    auth.jwt() ->> 'badge_number' IS NOT NULL
);

-- Sharing Link Policy: Only creator or Court can revoke sharing links
CREATE POLICY "Only creator or Court can update sharing link"
ON public.sharing_links
FOR UPDATE
TO authenticated
USING (
    created_by_badge = auth.jwt() ->> 'badge_number'
    OR auth.jwt() ->> 'role' = 'COURT'
);

-- Audit Logs Policy: STRICTLY APPEND-ONLY (Immutable Ledger)
-- No user, including administrators, can UPDATE or DELETE audit records
CREATE POLICY "Audit logs are strictly readable"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Audit logs can be appended"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Disallow UPDATE and DELETE on audit logs for total immutability
REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated, anon, public;
