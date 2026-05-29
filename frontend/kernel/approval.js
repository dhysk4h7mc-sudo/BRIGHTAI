'use strict';

const { getDb, generateId } = require('../db/init');
const { updateInteraction, getAuditEntry, getTraceIdFromInteraction, getTraceIdLegacyFromInteraction } = require('./audit');

function getRequiredRole(riskLevel) {
  if (riskLevel === 'critical') return 'admin';
  if (riskLevel === 'high') return 'admin';
  return 'manager';
}

async function queueForApproval(interactionId, riskScore, riskLevel, traceId) {
  const pool = getDb();
  const id = generateId('aq');
  const now = Date.now();
  const expiresAt = now + (24 * 60 * 60 * 1000);

  await pool.query(`
    INSERT INTO kernel_approval_queue (id, interaction_id, trace_id, risk_score, risk_level, created_at, status, assigned_to, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7, $8)
  `, [id, interactionId, traceId || null, riskScore, riskLevel, now, getRequiredRole(riskLevel), expiresAt]);

  return {
    id,
    interactionId,
    requestId: interactionId,
    traceId: traceId || null,
    status: 'pending',
    assignedTo: getRequiredRole(riskLevel)
  };
}

async function resolvePendingApproval(identifier) {
  const pool = getDb();
  const { rows } = await pool.query(`
    SELECT aq.*
    FROM kernel_approval_queue aq
    JOIN kernel_interactions ki ON aq.interaction_id = ki.id
    WHERE aq.status = 'pending'
      AND (
        aq.interaction_id = $1
        OR aq.trace_id = $1
        OR ki.id = $1
        OR ki.trace_id = $1
        OR ki.request_metadata ILIKE $2
      )
    ORDER BY aq.created_at DESC
    LIMIT 1
  `, [identifier, '%' + identifier + '%']);
  return rows[0] || null;
}

async function approve(interactionId, approvedBy, comment) {
  const pool = getDb();
  const now = Date.now();

  const pending = await resolvePendingApproval(interactionId);
  if (!pending) throw new Error('No pending approval found for this interaction');
  const targetInteractionId = pending.interaction_id;
  const original = await getAuditEntry(targetInteractionId);
  const traceId = pending.trace_id || (original ? getTraceIdFromInteraction(original) : null);

  await pool.query(
    'UPDATE kernel_approval_queue SET status = \'approved\', approved_by = $1, approved_at = $2, approval_comment = $3 WHERE interaction_id = $4',
    [approvedBy, now, comment || '', targetInteractionId]
  );

  await updateInteraction(targetInteractionId, {
    approval_status: 'approved',
    approved_by: approvedBy,
    approved_at: now,
    approval_comment: comment || ''
  });

  return {
    interactionId: targetInteractionId,
    requestId: targetInteractionId,
    traceId,
    status: 'approved',
    approvedBy,
    approvedAt: now
  };
}

async function reject(interactionId, rejectedBy, comment) {
  const pool = getDb();
  const now = Date.now();

  const pending = await resolvePendingApproval(interactionId);
  if (!pending) throw new Error('No pending approval found for this interaction');
  const targetInteractionId = pending.interaction_id;
  const original = await getAuditEntry(targetInteractionId);
  const traceId = pending.trace_id || (original ? getTraceIdFromInteraction(original) : null);

  await pool.query(
    'UPDATE kernel_approval_queue SET status = \'rejected\', approved_by = $1, approved_at = $2, approval_comment = $3 WHERE interaction_id = $4',
    [rejectedBy, now, comment || 'Rejected', targetInteractionId]
  );

  await updateInteraction(targetInteractionId, {
    approval_status: 'rejected',
    approved_by: rejectedBy,
    approved_at: now,
    approval_comment: comment || 'Rejected'
  });

  return {
    interactionId: targetInteractionId,
    requestId: targetInteractionId,
    traceId,
    status: 'rejected',
    rejectedBy,
    rejectedAt: now,
    modelInvoked: false
  };
}

async function getPendingApprovals(role, limit, offset, filters) {
  limit = limit || 50;
  offset = offset || 0;
  filters = filters || {};
  const pool = getDb();
  const values = [];
  let paramIdx = 1;
  const conditions = [`aq.status = 'pending'`];

  if (role) {
    conditions.push(`aq.assigned_to = $${paramIdx++}`);
    values.push(role);
  }

  const identifier = filters.traceId || filters.trace_id || filters.id || filters.interactionId || filters.requestId;
  if (identifier) {
    conditions.push(`(
      aq.interaction_id = $${paramIdx}
      OR aq.trace_id = $${paramIdx}
      OR ki.id = $${paramIdx}
      OR ki.trace_id = $${paramIdx}
      OR ki.request_metadata ILIKE $${paramIdx + 1}
    )`);
    values.push(identifier, '%' + identifier + '%');
    paramIdx += 2;
  }

  const { rows } = await pool.query(`
    SELECT aq.*, ki.trace_id AS interaction_trace_id, ki.request_metadata AS interaction_request_metadata, ki.request_message, ki.masked_message, ki.user_name, ki.user_id, ki.compliance_pack, ki.risk_reasons, ki.pii_types
    FROM kernel_approval_queue aq
    JOIN kernel_interactions ki ON aq.interaction_id = ki.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY aq.created_at DESC
    LIMIT $${paramIdx++} OFFSET $${paramIdx++}
  `, [...values, limit, offset]);

  return rows.map((row) => {
    const metadata = parseJsonObject(row.interaction_request_metadata);
    const traceId = row.trace_id || row.interaction_trace_id || metadata.traceId || metadata.trace_id || row.interaction_id;
    return {
      ...row,
      id: row.interaction_id,
      interactionId: row.interaction_id,
      requestId: row.interaction_id,
      traceId,
      trace_id: traceId,
      traceIdLegacy: getTraceIdLegacyFromInteraction({ id: row.interaction_id, trace_id: row.interaction_trace_id }),
      riskScore: row.risk_score,
      riskLevel: row.risk_level,
      createdAt: row.created_at,
      query: row.request_message,
      originalText: row.request_message,
      maskedText: row.masked_message,
      userName: row.user_name,
      userId: row.user_id,
      compliancePackage: row.compliance_pack,
      piiTypes: safeJsonArray(row.pii_types),
      matchedPolicies: safeJsonArray(row.risk_reasons).map((reason) => ({ name: reason }))
    };
  });
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

function safeJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

module.exports = { queueForApproval, approve, reject, getPendingApprovals, getRequiredRole };
