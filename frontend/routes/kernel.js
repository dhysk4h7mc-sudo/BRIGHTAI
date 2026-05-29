'use strict';

const kernel = require('../kernel');
const { generateEvidencePdfBuffer } = require('../kernel/evidence-pdf');

function parseQueryParams(req) {
  const url = req.url || req.originalUrl || '';
  try {
    const search = url.includes('?') ? url.split('?')[1] : '';
    return Object.fromEntries(new URLSearchParams(search));
  } catch (_) {
    return {};
  }
}

function pathValue(url, prefix) {
  const value = url.split(prefix)[1]?.split('?')[0];
  return value ? decodeURIComponent(value) : null;
}

async function kernelChatHandler(req, res) {
  const body = req.body || {};
  const message = body.message || body.query;
  const compliancePack = body.compliancePack || body.compliancePackage || 'general';
  const metadata = body.metadata || { context: body.context || '' };
  const traceId = body.traceId || body.trace_id || metadata.traceId || metadata.trace_id || req.headers['x-trace-id'] || req.headers['x-request-id'] || null;
  if (!message) {
    return res.status(400).json({ error: 'message is required', errorCode: 'MISSING_MESSAGE' });
  }

  const userId = req.headers['x-kernel-user-id'] || null;
  const userName = req.headers['x-kernel-user-name'] || null;

  const result = await kernel.processChat({
    message,
    userId,
    userName,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    compliancePack,
    metadata,
    traceId
  });

  const statusCode = result.status === 'blocked' ? 403
    : result.status === 'pending_approval' ? 202
    : 200;

  res.status(statusCode).json(result);
}

async function kernelAuditListHandler(req, res) {
  const params = parseQueryParams(req);

  const filters = {
    id: params.id || params.interactionId || params.requestId,
    userId: params.userId,
    riskLevel: params.riskLevel,
    compliancePack: params.compliancePack,
    approvalStatus: params.approvalStatus,
    traceId: params.traceId || params.trace_id,
    dateFrom: params.dateFrom ? parseInt(params.dateFrom) : undefined,
    dateTo: params.dateTo ? parseInt(params.dateTo) : undefined,
    search: params.search
  };

  const result = await kernel.queryAuditTrail(filters, parseInt(params.limit) || 50, parseInt(params.offset) || 0);
  res.status(200).json(result);
}

async function kernelAuditDetailHandler(req, res, url) {
  const id = pathValue(url, '/api/kernel/audit/');
  if (!id) return res.status(400).json({ error: 'Missing audit ID' });

  const entry = await kernel.getAuditEntry(id);
  if (!entry) return res.status(404).json({ error: 'Audit entry not found' });

  res.status(200).json(entry);
}

async function kernelApproveHandler(req, res, url) {
  const id = pathValue(url, '/api/kernel/approve/');
  if (!id) return res.status(400).json({ error: 'Missing interaction ID' });

  const { approvedBy, comment } = req.body || {};
  const approver = approvedBy || req.headers['x-kernel-user-id'] || 'unknown';

  try {
    const result = await kernel.approve(id, approver, comment);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function kernelRejectHandler(req, res, url) {
  const id = pathValue(url, '/api/kernel/reject/');
  if (!id) return res.status(400).json({ error: 'Missing interaction ID' });

  const { rejectedBy, comment } = req.body || {};
  const rejector = rejectedBy || req.headers['x-kernel-user-id'] || 'unknown';

  try {
    const result = await kernel.reject(id, rejector, comment || 'Rejected');
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function kernelPendingHandler(req, res) {
  const params = parseQueryParams(req);
  let limit = 50, offset = 0;
  limit = parseInt(params.limit) || 50;
  offset = parseInt(params.offset) || 0;

  const result = await kernel.getPendingApprovals(params.role || null, limit, offset, {
    id: params.id || params.interactionId || params.requestId,
    traceId: params.traceId || params.trace_id
  });
  const criticalCount = result.filter((row) => row.riskLevel === 'critical').length;
  const highCount = result.filter((row) => row.riskLevel === 'high').length;
  res.status(200).json({
    pending: result,
    total: result.length,
    summary: { totalPending: result.length, criticalCount, highCount, completedToday: 0 }
  });
}

async function kernelStatsHandler(req, res) {
  const stats = await kernel.getStats();
  res.status(200).json(stats);
}

async function kernelEvidenceHandler(req, res, url) {
  const id = pathValue(url, '/api/kernel/evidence/');
  if (!id) return res.status(400).json({ error: 'Missing interaction ID' });

  try {
    const evidence = await kernel.generateEvidenceFile(id);
    res.status(200).json(evidence);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function kernelComplianceCheckHandler(req, res) {
  const status = await kernel.getComplianceStatus();
  res.status(200).json(status);
}

async function kernelHealthHandler(req, res) {
  const health = await kernel.getHealth();
  res.status(200).json(health);
}

async function kernelApprovalsActionHandler(req, res) {
  const { requestId, interactionId, traceId, trace_id, id, action, approver, approvedBy, rejectedBy, comment, reason } = req.body || {};
  const targetId = interactionId || traceId || trace_id || requestId || id;
  if (!targetId) return res.status(400).json({ error: 'Missing request ID' });

  const normalizedAction = String(action || '').trim().toLowerCase();
  if (normalizedAction === 'approve') {
    const actor = approver || approvedBy || req.headers['x-kernel-user-id'] || 'unknown';
    try {
      const result = await kernel.approve(targetId, actor, comment);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }

  if (normalizedAction === 'reject') {
    const actor = approver || rejectedBy || req.headers['x-kernel-user-id'] || 'unknown';
    try {
      const result = await kernel.reject(targetId, actor, comment || reason || 'Rejected');
      return res.status(200).json(result);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }

  return res.status(400).json({ error: 'Unsupported approval action' });
}

async function kernelChainHandler(req, res) {
  const chain = await kernel.verifyChainIntegrity();
  res.status(200).json(chain);
}

async function kernelEvidenceListHandler(req, res) {
  const params = parseQueryParams(req);

  const result = await kernel.queryAuditTrail({
    id: params.id || params.interactionId || params.requestId,
    traceId: params.traceId || params.trace_id || params.id,
    search: params.search
  }, parseInt(params.limit) || 50, parseInt(params.offset) || 0);

  res.status(200).json({
    evidence: result.rows || result.entries || result,
    rows: result.rows || result.entries || result,
    total: result.total || (Array.isArray(result) ? result.length : 0)
  });
}

async function kernelEvidenceExportHandler(req, res, url) {
  const id = pathValue(url, '/api/kernel/evidence/')?.replace(/\/export$/, '');
  if (!id) return res.status(400).json({ error: 'Missing interaction ID' });

  try {
    const evidence = await kernel.generateEvidenceFile(id);
    res.status(200).json(evidence);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function kernelEvidencePdfHandler(req, res, url) {
  const id = pathValue(url, '/api/kernel/evidence/')?.replace(/\/pdf$/, '');
  if (!id) return res.status(400).json({ error: 'Missing interaction ID' });

  try {
    const evidence = await kernel.generateEvidenceFile(id);
    const params = parseQueryParams(req);
    const pdf = generateEvidencePdfBuffer(evidence, {
      evidenceHash: params.evidenceHash || params.evidence_hash
    });
    const safeId = String(evidence.traceId || evidence.trace_id || id).replace(/[^a-z0-9_-]/gi, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="brightai-evidence-${safeId}.pdf"`);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(pdf);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

const { sanitizeUserInput } = require('../utils/sanitizer');

async function kernelPoliciesGetHandler(req, res) {
  const params = parseQueryParams(req);
  const isDemoMode = params.demo === 'true';

  if (!isDemoMode) {
    try {
      const { getDb } = require('../db/init');
      const pool = getDb();
      const { rows } = await pool.query('SELECT * FROM kernel_policy_rules ORDER BY created_at DESC');
      return res.status(200).json(rows);
    } catch (_) { }
  }

  try {
    const fs = require('fs');
    const path = require('path');
    const mockPath = path.join(__dirname, '../../kernel/api/mock/policies.json');
    if (fs.existsSync(mockPath)) {
      const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
      return res.status(200).json(mockData);
    }
    return res.status(200).json([]);
  } catch (err) {
    return res.status(500).json({ error: 'فشل تحميل السياسات', details: err.message });
  }
}

async function kernelPoliciesPostHandler(req, res) {
  const params = parseQueryParams(req);
  const isDemoMode = params.demo === 'true';
  const body = req.body || {};

  const name = sanitizeUserInput(body.name || '');
  const description = sanitizeUserInput(body.description || '');
  const piiType = sanitizeUserInput(body.piiType || body.pii_type || '');
  const compliancePack = sanitizeUserInput(body.compliancePack || body.compliance_pack || 'general');
  const action = sanitizeUserInput(body.action || 'mask');
  const riskScoreModifier = parseInt(body.riskScoreModifier || body.risk_score_modifier || 0, 10);
  const isActive = body.is_active !== undefined ? parseInt(body.is_active, 10) : 1;

  if (!name || !piiType) {
    return res.status(400).json({ error: 'الاسم ونوع البيانات مطلوبة' });
  }

  const crypto = require('crypto');
  const id = 'pr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  const now = Date.now();

  if (!isDemoMode) {
    try {
      const { getDb } = require('../db/init');
      const pool = getDb();
      await pool.query(
        `INSERT INTO kernel_policy_rules (id, name, description, pii_type, action, risk_score_modifier, compliance_pack, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [id, name, description, piiType, action, riskScoreModifier, compliancePack, isActive, now, now]
      );
      return res.status(201).json({ id, name, description, pii_type: piiType, compliance_pack: compliancePack, action, risk_score_modifier: riskScoreModifier, is_active: isActive, created_at: now, updated_at: now });
    } catch (_) { }
  }

  try {
    const fs = require('fs');
    const path = require('path');
    const mockPath = path.join(__dirname, '../../kernel/api/mock/policies.json');
    let mockData = [];
    if (fs.existsSync(mockPath)) {
      mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
    }
    const newRule = { id, name, description, pii_type: piiType, compliance_pack: compliancePack, action, risk_score_modifier: riskScoreModifier, is_active: isActive };
    mockData.unshift(newRule);
    fs.writeFileSync(mockPath, JSON.stringify(mockData, null, 2), 'utf8');
    return res.status(201).json(newRule);
  } catch (err) {
    return res.status(500).json({ error: 'فشل حفظ السياسة', details: err.message });
  }
}

async function kernelPoliciesPatchHandler(req, res, url) {
  const id = pathValue(url, '/api/kernel/policies/');
  if (!id) return res.status(400).json({ error: 'معرف السياسة مفقود' });

  const params = parseQueryParams(req);
  const isDemoMode = params.demo === 'true';
  const body = req.body || {};
  const now = Date.now();

  const name = body.name !== undefined ? sanitizeUserInput(body.name) : undefined;
  const description = body.description !== undefined ? sanitizeUserInput(body.description) : undefined;
  const piiType = body.pii_type !== undefined ? sanitizeUserInput(body.pii_type) : (body.piiType !== undefined ? sanitizeUserInput(body.piiType) : undefined);
  const compliancePack = body.compliance_pack !== undefined ? sanitizeUserInput(body.compliance_pack) : (body.compliancePack !== undefined ? sanitizeUserInput(body.compliancePack) : undefined);
  const action = body.action !== undefined ? sanitizeUserInput(body.action) : undefined;
  const riskScoreModifier = body.risk_score_modifier !== undefined ? parseInt(body.risk_score_modifier, 10) : (body.riskScoreModifier !== undefined ? parseInt(body.riskScoreModifier, 10) : undefined);
  const isActive = body.is_active !== undefined ? parseInt(body.is_active, 10) : undefined;

  if (!isDemoMode) {
    try {
      const { getDb } = require('../db/init');
      const pool = getDb();
      
      const updates = [];
      const values = [];
      let index = 1;

      if (name !== undefined) { updates.push(`name = $${index++}`); values.push(name); }
      if (description !== undefined) { updates.push(`description = $${index++}`); values.push(description); }
      if (piiType !== undefined) { updates.push(`pii_type = $${index++}`); values.push(piiType); }
      if (compliancePack !== undefined) { updates.push(`compliance_pack = $${index++}`); values.push(compliancePack); }
      if (action !== undefined) { updates.push(`action = $${index++}`); values.push(action); }
      if (riskScoreModifier !== undefined) { updates.push(`risk_score_modifier = $${index++}`); values.push(riskScoreModifier); }
      if (isActive !== undefined) { updates.push(`is_active = $${index++}`); values.push(isActive); }
      
      updates.push(`updated_at = $${index++}`); values.push(now);

      if (updates.length > 1) {
        values.push(id);
        const queryText = `UPDATE kernel_policy_rules SET ${updates.join(', ')} WHERE id = $${index} RETURNING *`;
        const { rows } = await pool.query(queryText, values);
        if (rows.length > 0) {
          return res.status(200).json(rows[0]);
        }
      }
    } catch (_) { }
  }

  try {
    const fs = require('fs');
    const path = require('path');
    const mockPath = path.join(__dirname, '../../kernel/api/mock/policies.json');
    if (fs.existsSync(mockPath)) {
      const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
      const ruleIndex = mockData.findIndex(r => r.id === id);
      if (ruleIndex !== -1) {
        const rule = mockData[ruleIndex];
        if (name !== undefined) rule.name = name;
        if (description !== undefined) rule.description = description;
        if (piiType !== undefined) rule.pii_type = piiType;
        if (compliancePack !== undefined) rule.compliance_pack = compliancePack;
        if (action !== undefined) rule.action = action;
        if (riskScoreModifier !== undefined) rule.risk_score_modifier = riskScoreModifier;
        if (isActive !== undefined) rule.is_active = isActive;
        
        fs.writeFileSync(mockPath, JSON.stringify(mockData, null, 2), 'utf8');
        return res.status(200).json(rule);
      }
    }
    return res.status(404).json({ error: 'السياسة غير موجودة' });
  } catch (err) {
    return res.status(500).json({ error: 'فشل تعديل السياسة', details: err.message });
  }
}

async function kernelPoliciesDeleteHandler(req, res, url) {
  const id = pathValue(url, '/api/kernel/policies/');
  if (!id) return res.status(400).json({ error: 'معرف السياسة مفقود' });

  const params = parseQueryParams(req);
  const isDemoMode = params.demo === 'true';

  if (!isDemoMode) {
    try {
      const { getDb } = require('../db/init');
      const pool = getDb();
      const { rowCount } = await pool.query('DELETE FROM kernel_policy_rules WHERE id = $1', [id]);
      if (rowCount > 0) {
        return res.status(200).json({ success: true, message: 'تم حذف القاعدة بنجاح' });
      }
    } catch (_) { }
  }

  try {
    const fs = require('fs');
    const path = require('path');
    const mockPath = path.join(__dirname, '../../kernel/api/mock/policies.json');
    if (fs.existsSync(mockPath)) {
      const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
      const ruleIndex = mockData.findIndex(r => r.id === id);
      if (ruleIndex !== -1) {
        mockData.splice(ruleIndex, 1);
        fs.writeFileSync(mockPath, JSON.stringify(mockData, null, 2), 'utf8');
        return res.status(200).json({ success: true, message: 'تم حذف القاعدة بنجاح' });
      }
    }
    return res.status(404).json({ error: 'السياسة غير موجودة' });
  } catch (err) {
    return res.status(500).json({ error: 'فشل حذف السياسة', details: err.message });
  }
}

async function kernelRouteHandler(req, res, method, url) {
  try {
    const path = (url || '').split('?')[0];
    if (method === 'POST' && path === '/api/kernel/chat') return await kernelChatHandler(req, res);
    if (method === 'GET' && path === '/api/kernel/health') return await kernelHealthHandler(req, res);
    if (method === 'GET' && path.startsWith('/api/kernel/audit/')) return await kernelAuditDetailHandler(req, res, path);
    if (method === 'GET' && path === '/api/kernel/audit') return await kernelAuditListHandler(req, res);
    if (method === 'POST' && path.startsWith('/api/kernel/approve/')) return await kernelApproveHandler(req, res, path);
    if (method === 'POST' && path.startsWith('/api/kernel/reject/')) return await kernelRejectHandler(req, res, path);
    if (method === 'GET' && path === '/api/kernel/pending') return await kernelPendingHandler(req, res);
    if (method === 'GET' && path === '/api/kernel/approvals') return await kernelPendingHandler(req, res);
    if (method === 'POST' && path === '/api/kernel/approvals') return await kernelApprovalsActionHandler(req, res);
    if (method === 'GET' && path === '/api/kernel/stats') return await kernelStatsHandler(req, res);
    if (method === 'GET' && path === '/api/kernel/chain') return await kernelChainHandler(req, res);
    if (method === 'POST' && path === '/api/kernel/chain/verify') return await kernelChainHandler(req, res);
    if (method === 'GET' && path === '/api/kernel/evidence') return await kernelEvidenceListHandler(req, res);
    if (method === 'GET' && path.startsWith('/api/kernel/evidence/') && path.endsWith('/pdf')) return await kernelEvidencePdfHandler(req, res, path);
    if (method === 'GET' && path.startsWith('/api/kernel/evidence/') && path.endsWith('/export')) return await kernelEvidenceExportHandler(req, res, path);
    if (method === 'GET' && path.startsWith('/api/kernel/evidence/')) return await kernelEvidenceExportHandler(req, res, path);
    if (method === 'POST' && path.startsWith('/api/kernel/evidence/')) return await kernelEvidenceHandler(req, res, path);
    if (method === 'GET' && path === '/api/kernel/compliance/check') return await kernelComplianceCheckHandler(req, res);

    // API policy rules paths
    if (method === 'GET' && path === '/api/kernel/policies') return await kernelPoliciesGetHandler(req, res);
    if (method === 'POST' && path === '/api/kernel/policies') return await kernelPoliciesPostHandler(req, res);
    if (method === 'PATCH' && path.startsWith('/api/kernel/policies/')) return await kernelPoliciesPatchHandler(req, res, path);
    if (method === 'DELETE' && path.startsWith('/api/kernel/policies/')) return await kernelPoliciesDeleteHandler(req, res, path);

    res.status(404).json({ error: 'Kernel endpoint not found', errorCode: 'KERNEL_NOT_FOUND' });
  } catch (err) {
    console.error('[BrightAI Kernel] Route error:', err);
    res.status(500).json({ error: 'Kernel processing error', errorCode: 'KERNEL_ERROR', details: err.message });
  }
}

module.exports = { kernelRouteHandler };
