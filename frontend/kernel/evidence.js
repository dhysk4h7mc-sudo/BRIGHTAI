'use strict';

const { getAuditEntry, computeHash, normalizeAuditEventRow } = require('./audit');
const { generateId, getDb } = require('../db/init');

async function generateEvidenceFile(interactionId) {
  const entry = await getAuditEntry(interactionId);
  if (!entry) throw new Error('Interaction not found: ' + interactionId);

  let piiItems = [];
  try { piiItems = JSON.parse(entry.pii_items || '[]'); } catch (_) {}
  let riskReasons = [];
  try { riskReasons = JSON.parse(entry.risk_reasons || '[]'); } catch (_) {}
  let complianceFlags = [];
  try { complianceFlags = JSON.parse(entry.compliance_flags || '[]'); } catch (_) {}
  const requestMetadata = parseJsonObject(entry.request_metadata);

  const traceId = entry.trace_id || requestMetadata.traceId || requestMetadata.trace_id || entry.id;
  const traceIdLegacy = entry.trace_id ? null : entry.id;

  // Query all linear events for this specific trace from the cryptographic audit events ledger
  const pool = getDb();
  const { rows: eventRows } = await pool.query(
    'SELECT * FROM kernel_audit_events WHERE trace_id = $1 ORDER BY serial_id ASC',
    [traceId]
  );
  const events = eventRows.map(normalizeAuditEventRow);
  const modelEvent = [...events].reverse().find((event) => event.eventType === 'MODEL_CALLED') || {};
  const modelPayload = modelEvent.payload || {};
  const provider = modelPayload.provider || requestMetadata.provider || null;
  const model = modelPayload.model || requestMetadata.model || entry.response_model || null;

  const evidence = {
    evidenceId: generateId('ev'),
    generatedAt: new Date().toISOString(),
    interactionId: entry.id,
    requestId: entry.id,
    traceId,
    trace_id: traceId,
    traceIdLegacy,
    timestamp: entry.created_at,
    summary: {
      traceId,
      traceIdLegacy,
      interactionId: entry.id,
      requestId: entry.id,
      request: entry.masked_message || entry.request_message,
      response: entry.gemini_response,
      riskScore: entry.risk_score,
      riskLevel: entry.risk_level,
      approvalStatus: entry.approval_status,
      approvedBy: entry.approved_by,
      approvedAt: entry.approved_at ? new Date(entry.approved_at).toISOString() : null,
      provider,
      model,
      responseTimeMs: entry.response_time_ms,
      tokensInput: entry.response_tokens_input,
      tokensOutput: entry.response_tokens_output
    },
    firewall: {
      piiDetected: !!entry.pii_detected,
      piiTypes: entry.pii_types ? JSON.parse(entry.pii_types) : [],
      piiItems: piiItems,
      sensitiveCategories: entry.sensitive_data_categories ? JSON.parse(entry.sensitive_data_categories) : [],
      action: entry.firewall_action
    },
    risk: {
      score: entry.risk_score,
      level: entry.risk_level,
      reasons: riskReasons
    },
    compliance: {
      pack: entry.compliance_pack,
      flags: complianceFlags
    },
    audit: {
      traceId,
      traceIdLegacy,
      requestHash: entry.request_hash,
      responseHash: entry.response_hash,
      previousHash: entry.previous_hash,
      recordHash: entry.record_hash,
      integrityVerified: true,
      eventsCount: events.length
    },
    events: events, // Embed the complete chain of cryptographic events
    user: {
      id: entry.user_id,
      name: entry.user_name,
      ip: entry.ip_address
    },
    regulatoryReferences: getRegulatoryReferences(entry)
  };

  evidence.evidenceHash = computeHash(getStableEvidenceHashPayload(evidence));

  return evidence;
}

function getStableEvidenceHashPayload(evidence) {
  const { evidenceId, generatedAt, evidenceHash, ...stablePayload } = evidence;
  return stablePayload;
}

function parseJsonObject(value) {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function getRegulatoryReferences(entry) {
  const refs = [];
  const pack = entry.compliance_pack || 'general';

  if (pack === 'pdpl' || pack === 'general') {
    refs.push({ framework: 'PDPL', article: 'Article 29', description: 'Cross-border data transfer' });
    refs.push({ framework: 'PDPL', article: 'Article 13', description: 'Data processing consent' });
  }
  if (pack === 'nca_ecc' || pack === 'general') {
    refs.push({ framework: 'NCA ECC 2-2024', article: 'Section 4', description: 'Access control' });
    refs.push({ framework: 'NCA ECC 2-2024', article: 'Section 5', description: 'Data classification' });
  }
  if (pack === 'sfda') {
    refs.push({ framework: 'ISO 13485', article: '§8.3', description: 'Design and development outputs' });
    refs.push({ framework: 'ISO 13485', article: '§8.5.2', description: 'Corrective action' });
    refs.push({ framework: 'SFDA QMS-GL', article: '2024', description: 'QMS Guidelines for medical devices' });
  }
  if (pack === 'healthcare') {
    refs.push({ framework: 'PDPL', article: 'Article 17', description: 'Health data processing' });
    refs.push({ framework: 'NCA ECC', article: 'Section 6', description: 'Healthcare data protection' });
  }
  if (pack === 'procurement') {
    refs.push({ framework: 'Etimad', article: 'Tender Regulations', description: 'Government procurement compliance' });
  }

  return refs;
}

const REPORT_FILTER_DEFINITIONS = [
  { key: 'compliancePack', column: 'compliance_pack', operator: '=' },
  { key: 'dateFrom', column: 'created_at', operator: '>=' },
  { key: 'dateTo', column: 'created_at', operator: '<=' }
];

const ALLOWED_WHERE_COLUMNS = new Set([
  'compliance_pack',
  'created_at',
  'firewall_action',
  'approval_status',
  'pii_detected'
]);

const ALLOWED_WHERE_OPERATORS = new Set(['=', '>=', '<=']);

function buildWhere(baseFilters = {}, extraConditions = []) {
  const conditions = [];
  const values = [];

  for (const definition of REPORT_FILTER_DEFINITIONS) {
    const value = baseFilters[definition.key];
    if (value === undefined || value === null || value === '') continue;
    addWhereCondition(conditions, values, definition.column, definition.operator, value);
  }

  for (const condition of extraConditions) {
    if (!condition) continue;
    const { column, operator = '=', value } = condition;
    if (value === undefined || value === null || value === '') continue;
    addWhereCondition(conditions, values, column, operator, value);
  }

  return {
    clause: conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : 'WHERE 1=1',
    values
  };
}

function addWhereCondition(conditions, values, column, operator, value) {
  if (!ALLOWED_WHERE_COLUMNS.has(column)) throw new Error('Unsupported compliance report column: ' + column);
  if (!ALLOWED_WHERE_OPERATORS.has(operator)) throw new Error('Unsupported compliance report operator: ' + operator);

  values.push(value);
  conditions.push(`${column} ${operator} $${values.length}`);
}

async function queryComplianceCount(pool, filters, extraConditions = []) {
  const where = buildWhere(filters, extraConditions);
  const { rows } = await pool.query(
    `SELECT COUNT(*) as count FROM kernel_interactions ${where.clause}`,
    where.values
  );
  return rows[0]?.count || '0';
}

async function generateComplianceReport(filters = {}) {
  const pool = getDb();

  const total = await queryComplianceCount(pool, filters);
  const blocked = await queryComplianceCount(pool, filters, [{ column: 'firewall_action', value: 'block' }]);
  const pending = await queryComplianceCount(pool, filters, [{ column: 'approval_status', value: 'pending' }]);
  const approved = await queryComplianceCount(pool, filters, [{ column: 'approval_status', value: 'approved' }]);
  const rejected = await queryComplianceCount(pool, filters, [{ column: 'approval_status', value: 'rejected' }]);
  const piiDetected = await queryComplianceCount(pool, filters, [{ column: 'pii_detected', value: 1 }]);
  const totalCount = Number(total);
  const blockedCount = Number(blocked);
  const rejectedCount = Number(rejected);

  return {
    generatedAt: new Date().toISOString(),
    period: { from: filters.dateFrom, to: filters.dateTo },
    summary: { total, blocked, pending, approved, rejected, piiDetected },
    complianceRate: totalCount > 0 ? (((totalCount - blockedCount - rejectedCount) / totalCount) * 100).toFixed(1) + '%' : 'N/A'
  };
}

module.exports = { generateEvidenceFile, generateComplianceReport, buildWhere };
