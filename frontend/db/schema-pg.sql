-- BrightAI Kernel — PostgreSQL Schema
-- Audit trail, approvals, compliance, policies, users

CREATE TABLE IF NOT EXISTS kernel_interactions (
    id TEXT PRIMARY KEY,
    trace_id TEXT UNIQUE,
    created_at BIGINT NOT NULL,
    user_id TEXT,
    user_name TEXT,
    ip_address TEXT,
    user_agent TEXT,
    request_message TEXT NOT NULL,
    request_hash TEXT NOT NULL,
    request_metadata TEXT,
    pii_detected INTEGER DEFAULT 0,
    pii_types TEXT,
    pii_items TEXT,
    sensitive_data_categories TEXT,
    firewall_action TEXT DEFAULT 'allow',
    masked_message TEXT,
    risk_score INTEGER DEFAULT 0,
    risk_level TEXT DEFAULT 'low',
    risk_reasons TEXT,
    approval_status TEXT DEFAULT 'auto_approved',
    approved_by TEXT,
    approved_at BIGINT,
    approval_comment TEXT,
    gemini_response TEXT,
    response_hash TEXT NOT NULL,
    response_model TEXT,
    response_tokens_input INTEGER DEFAULT 0,
    response_tokens_output INTEGER DEFAULT 0,
    response_time_ms INTEGER DEFAULT 0,
    response_error TEXT,
    compliance_pack TEXT,
    compliance_flags TEXT,
    previous_hash TEXT,
    record_hash TEXT NOT NULL
);

-- Migration/fallback: existing deployments may already have kernel_interactions
-- without trace_id because CREATE TABLE IF NOT EXISTS does not alter old tables.
ALTER TABLE kernel_interactions ADD COLUMN IF NOT EXISTS trace_id TEXT;

-- One monotonic source for AI-YYYY-00000 trace IDs. Existing rows stay nullable
-- and are displayed through legacy id/request_metadata fallbacks in code.
CREATE SEQUENCE IF NOT EXISTS kernel_trace_id_seq START WITH 1;

CREATE TABLE IF NOT EXISTS kernel_approval_queue (
    id TEXT PRIMARY KEY,
    interaction_id TEXT NOT NULL UNIQUE REFERENCES kernel_interactions(id),
    trace_id TEXT,
    risk_score INTEGER NOT NULL,
    risk_level TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    status TEXT DEFAULT 'pending',
    assigned_to TEXT,
    approved_by TEXT,
    approved_at BIGINT,
    approval_comment TEXT,
    expires_at BIGINT,
    notification_sent INTEGER DEFAULT 0
);

-- Migration/fallback: older approval rows can resolve trace_id by joining their
-- interaction row, so this column remains nullable for backward compatibility.
ALTER TABLE kernel_approval_queue ADD COLUMN IF NOT EXISTS trace_id TEXT;

CREATE TABLE IF NOT EXISTS kernel_compliance_checks (
    id TEXT PRIMARY KEY,
    interaction_id TEXT NOT NULL REFERENCES kernel_interactions(id),
    compliance_pack TEXT NOT NULL,
    check_type TEXT NOT NULL,
    check_result TEXT NOT NULL,
    details TEXT,
    created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS kernel_policy_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    pii_type TEXT NOT NULL,
    action TEXT NOT NULL DEFAULT 'mask',
    risk_score_modifier INTEGER DEFAULT 0,
    compliance_pack TEXT,
    is_active INTEGER DEFAULT 1,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS kernel_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'user',
    department TEXT,
    compliance_packs TEXT,
    is_active INTEGER DEFAULT 1,
    created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_interactions_created ON kernel_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_interactions_user ON kernel_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_risk ON kernel_interactions(risk_level);
CREATE INDEX IF NOT EXISTS idx_interactions_approval ON kernel_interactions(approval_status);
CREATE INDEX IF NOT EXISTS idx_interactions_compliance ON kernel_interactions(compliance_pack);
CREATE UNIQUE INDEX IF NOT EXISTS idx_interactions_trace_unique ON kernel_interactions(trace_id) WHERE trace_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_interactions_trace ON kernel_interactions(trace_id);
CREATE INDEX IF NOT EXISTS idx_approval_status ON kernel_approval_queue(status);
CREATE INDEX IF NOT EXISTS idx_approval_created ON kernel_approval_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_approval_trace ON kernel_approval_queue(trace_id);
CREATE INDEX IF NOT EXISTS idx_compliance_interaction ON kernel_compliance_checks(interaction_id);
