'use strict';

const crypto = require('crypto');
const { getDb, generateId } = require('../db/init');

function computeHash(data) {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  return crypto.createHash('sha256').update(content).digest('hex');
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

function getTraceIdFromInteraction(row) {
  const metadata = parseJsonObject(row.request_metadata);
  return row.trace_id || metadata.traceId || metadata.trace_id || null;
}

function getTraceIdLegacyFromInteraction(row) {
  return row && !row.trace_id ? row.id : null;
}

function normalizeAuditRow(row) {
  if (!row) return null;
  const traceId = getTraceIdFromInteraction(row) || row.id;
  const metadata = parseJsonObject(row.request_metadata);
  const traceIdLegacy = getTraceIdLegacyFromInteraction(row);
  const status = row.approval_status || 'auto_approved';
  const action = status === 'blocked' ? 'BLOCKED'
    : status === 'pending' ? 'APPROVAL_REQUESTED'
    : status === 'approved' ? 'APPROVED'
    : status === 'rejected' ? 'REJECTED'
    : status === 'approved_completed' ? 'EXECUTED'
    : 'CHAT_REQUEST';

  return {
    ...row,
    interactionId: row.id,
    requestId: row.id,
    traceId,
    trace_id: traceId,
    traceIdLegacy,
    timestamp: row.created_at,
    createdAt: row.created_at,
    action,
    actor: row.approved_by || row.user_name || row.user_id || 'system',
    hash: row.record_hash,
    previousHash: row.previous_hash,
    recordHash: row.record_hash,
    requestHash: row.request_hash,
    responseHash: row.response_hash,
    riskScore: row.risk_score,
    riskLevel: row.risk_level,
    approvalStatus: status,
    compliancePack: row.compliance_pack,
    query: row.request_message,
    originalText: row.request_message,
    maskedText: row.masked_message,
    response: row.gemini_response,
    provider: metadata.provider || null,
    responseProvider: metadata.provider || null,
    model: metadata.model || row.response_model,
    userId: row.user_id,
    userName: row.user_name
  };
}

function normalizeAuditEventRow(row) {
  if (!row) return null;
  return {
    serialId: row.serial_id,
    eventId: row.event_id,
    traceId: row.trace_id,
    eventType: row.event_type,
    actor: row.actor,
    timestamp: Number(row.timestamp),
    payload: parseJsonObject(row.payload),
    payloadHash: row.payload_hash,
    previousHash: row.previous_hash,
    recordHash: row.record_hash
  };
}

async function logInteraction(interaction) {
  const pool = getDb();

  if (!interaction.id) interaction.id = generateId('ki');
  if (!interaction.created_at) interaction.created_at = Date.now();

  interaction.request_hash = computeHash(interaction.request_message || '');
  interaction.response_hash = computeHash(interaction.gemini_response || '');

  const { rows } = await pool.query('SELECT record_hash FROM kernel_interactions ORDER BY created_at DESC LIMIT 1');
  interaction.previous_hash = rows.length > 0 ? rows[0].record_hash : '0';

  const chainData = {
    id: interaction.id,
    trace_id: interaction.trace_id || null,
    created_at: interaction.created_at,
    request_hash: interaction.request_hash,
    response_hash: interaction.response_hash,
    previous_hash: interaction.previous_hash
  };
  interaction.record_hash = computeHash(chainData);

  await pool.query(`
    INSERT INTO kernel_interactions (
      id, trace_id, created_at, user_id, user_name, ip_address, user_agent,
      request_message, request_hash, request_metadata,
      pii_detected, pii_types, pii_items, sensitive_data_categories,
      firewall_action, masked_message,
      risk_score, risk_level, risk_reasons,
      approval_status, approved_by, approved_at, approval_comment,
      gemini_response, response_hash, response_model,
      response_tokens_input, response_tokens_output, response_time_ms, response_error,
      compliance_pack, compliance_flags,
      previous_hash, record_hash
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10,
      $11, $12, $13, $14,
      $15, $16,
      $17, $18, $19,
      $20, $21, $22, $23,
      $24, $25, $26,
      $27, $28, $29, $30,
      $31, $32,
      $33, $34
    )
  `, [
    interaction.id, interaction.trace_id || null, interaction.created_at, interaction.user_id || null, interaction.user_name || null, interaction.ip_address || null, interaction.user_agent || null,
    interaction.request_message, interaction.request_hash, interaction.request_metadata || null,
    interaction.pii_detected || 0, interaction.pii_types || null, interaction.pii_items || null, interaction.sensitive_data_categories || null,
    interaction.firewall_action || 'allow', interaction.masked_message || null,
    interaction.risk_score || 0, interaction.risk_level || 'low', interaction.risk_reasons || null,
    interaction.approval_status || 'auto_approved', interaction.approved_by || null, interaction.approved_at || null, interaction.approval_comment || null,
    interaction.gemini_response || null, interaction.response_hash, interaction.response_model || null,
    interaction.response_tokens_input || 0, interaction.response_tokens_output || 0, interaction.response_time_ms || 0, interaction.response_error || null,
    interaction.compliance_pack || null, interaction.compliance_flags || null,
    interaction.previous_hash, interaction.record_hash
  ]);

  return interaction;
}

async function logAuditEvent(traceId, eventType, actor, payload) {
  const pool = getDb();
  const eventId = generateId('ae');
  const timestamp = Date.now();

  const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload || {});
  const payloadHash = computeHash(payloadStr);

  const { rows } = await pool.query('SELECT record_hash FROM kernel_audit_events ORDER BY serial_id DESC LIMIT 1');
  const previousHash = rows.length > 0 ? rows[0].record_hash : '0';

  const chainData = {
    event_id: eventId,
    trace_id: traceId,
    event_type: eventType,
    actor: actor || 'system',
    timestamp: Number(timestamp),
    payload_hash: payloadHash,
    previous_hash: previousHash
  };

  const recordHash = computeHash(chainData);

  await pool.query(`
    INSERT INTO kernel_audit_events (
      event_id, trace_id, event_type, actor, timestamp, payload, payload_hash, previous_hash, record_hash
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `, [
    eventId, traceId, eventType, actor || 'system', timestamp, payloadStr, payloadHash, previousHash, recordHash
  ]);

  return {
    eventId,
    traceId,
    eventType,
    actor: actor || 'system',
    timestamp,
    payload: parseJsonObject(payloadStr),
    payloadHash,
    previousHash,
    recordHash
  };
}

async function queryAuditTrail(filters, limit, offset) {
  limit = limit || 50;
  offset = offset || 0;
  const pool = getDb();

  const conditions = [];
  const values = [];
  let paramIdx = 1;

  if (filters.userId) { conditions.push(`user_id = $${paramIdx++}`); values.push(filters.userId); }
  if (filters.riskLevel) { conditions.push(`risk_level = $${paramIdx++}`); values.push(filters.riskLevel); }
  if (filters.compliancePack) { conditions.push(`compliance_pack = $${paramIdx++}`); values.push(filters.compliancePack); }
  if (filters.approvalStatus) { conditions.push(`approval_status = $${paramIdx++}`); values.push(filters.approvalStatus); }
  if (filters.id || filters.interactionId || filters.requestId) {
    conditions.push(`id = $${paramIdx++}`);
    values.push(filters.id || filters.interactionId || filters.requestId);
  }
  if (filters.traceId || filters.trace_id) {
    const traceId = filters.traceId || filters.trace_id;
    conditions.push(`(id = $${paramIdx} OR trace_id = $${paramIdx} OR request_metadata ILIKE $${paramIdx + 1})`);
    values.push(traceId, '%' + traceId + '%');
    paramIdx += 2;
  }
  if (filters.dateFrom) { conditions.push(`created_at >= $${paramIdx++}`); values.push(filters.dateFrom); }
  if (filters.dateTo) { conditions.push(`created_at <= $${paramIdx++}`); values.push(filters.dateTo); }
  if (filters.search) {
    conditions.push(`(request_message ILIKE $${paramIdx} OR gemini_response ILIKE $${paramIdx} OR id ILIKE $${paramIdx} OR COALESCE(trace_id, '') ILIKE $${paramIdx})`);
    values.push('%' + filters.search + '%');
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  const rowsResult = await pool.query(
    `SELECT * FROM kernel_interactions ${whereClause} ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    [...values, limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM kernel_interactions ${whereClause}`,
    values
  );

  return {
    rows: rowsResult.rows.map(normalizeAuditRow),
    entries: rowsResult.rows.map(normalizeAuditRow),
    total: parseInt(countResult.rows[0].total)
  };
}

async function getAuditEntry(id) {
  const pool = getDb();
  const { rows } = await pool.query(`
    SELECT *
    FROM kernel_interactions
    WHERE id = $1 OR trace_id = $1 OR request_metadata ILIKE $2
    ORDER BY CASE WHEN id = $1 THEN 0 ELSE 1 END, created_at DESC
    LIMIT 1
  `, [id, '%' + id + '%']);
  return normalizeAuditRow(rows[0]) || null;
}

async function verifyChainIntegrity() {
  const pool = getDb();
  const { rows } = await pool.query('SELECT * FROM kernel_audit_events ORDER BY serial_id ASC');

  if (rows.length === 0) {
    return {
      valid: true,
      brokenAt: null,
      reason: null,
      totalRecords: 0,
      chainStatus: 'VALID',
      chainHash: null,
      totalEntries: 0,
      entries: [],
      summary: { actionTypes: {}, actorCount: 0 }
    };
  }

  let prevHash = '0';
  let brokenAt = null;
  let reason = null;

  for (const row of rows) {
    // 1. Recalculate payload_hash
    const recalculatedPayloadHash = computeHash(row.payload);
    if (row.payload_hash !== recalculatedPayloadHash) {
      brokenAt = row.event_id;
      reason = `Payload hash mismatch: recalculated ${recalculatedPayloadHash} does not match stored ${row.payload_hash}`;
      break;
    }

    // 2. Verify previous_hash
    if (row.previous_hash !== prevHash) {
      brokenAt = row.event_id;
      reason = `Previous hash mismatch: row previous_hash ${row.previous_hash} does not match expected previous hash ${prevHash}`;
      break;
    }

    // 3. Recalculate record_hash
    const chainData = {
      event_id: row.event_id,
      trace_id: row.trace_id,
      event_type: row.event_type,
      actor: row.actor,
      timestamp: Number(row.timestamp),
      payload_hash: row.payload_hash,
      previous_hash: row.previous_hash
    };
    const recalculatedRecordHash = computeHash(chainData);
    if (row.record_hash !== recalculatedRecordHash) {
      brokenAt = row.event_id;
      reason = `Record hash mismatch: recalculated ${recalculatedRecordHash} does not match stored ${row.record_hash}`;
      break;
    }

    prevHash = row.record_hash;
  }

  const entries = rows.slice().reverse().map(normalizeAuditEventRow);
  const actionTypes = {};
  const actors = new Set();
  for (const entry of entries) {
    actionTypes[entry.eventType] = (actionTypes[entry.eventType] || 0) + 1;
    if (entry.actor) actors.add(entry.actor);
  }

  return {
    valid: !brokenAt,
    brokenAt,
    reason,
    totalRecords: rows.length,
    chainStatus: brokenAt ? 'INVALID' : 'VALID',
    chainHash: rows[rows.length - 1]?.record_hash || null,
    totalEntries: rows.length,
    entries,
    summary: {
      actionTypes,
      actorCount: actors.size
    }
  };
}

async function updateInteraction(id, updates) {
  const pool = getDb();
  const fields = [];
  const values = [id];
  let paramIdx = 2;
  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${paramIdx++}`);
    values.push(value);
  }
  if (fields.length === 0) return;
  await pool.query(`UPDATE kernel_interactions SET ${fields.join(', ')} WHERE id = $1`, values);
}

module.exports = {
  logInteraction,
  logAuditEvent,
  queryAuditTrail,
  getAuditEntry,
  verifyChainIntegrity,
  updateInteraction,
  computeHash,
  normalizeAuditRow,
  normalizeAuditEventRow,
  getTraceIdFromInteraction,
  getTraceIdLegacyFromInteraction
};
