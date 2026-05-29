'use strict';

const kernel = require('../kernel');

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
  const url = req.url || req.originalUrl || '';
  let params = {};
  try {
    const search = url.includes('?') ? url.split('?')[1] : '';
    params = Object.fromEntries(new URLSearchParams(search));
  } catch (_) {}

  const filters = {
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
  const id = url.split('/api/kernel/audit/')[1]?.split('?')[0];
  if (!id) return res.status(400).json({ error: 'Missing audit ID' });

  const entry = await kernel.getAuditEntry(id);
  if (!entry) return res.status(404).json({ error: 'Audit entry not found' });

  res.status(200).json(entry);
}

async function kernelApproveHandler(req, res, url) {
  const id = url.split('/api/kernel/approve/')[1]?.split('?')[0];
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
  const id = url.split('/api/kernel/reject/')[1]?.split('?')[0];
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
  const url = req.url || '';
  let limit = 50, offset = 0;
  try {
    const search = url.includes('?') ? url.split('?')[1] : '';
    const params = Object.fromEntries(new URLSearchParams(search));
    limit = parseInt(params.limit) || 50;
    offset = parseInt(params.offset) || 0;
  } catch (_) {}

  const result = await kernel.getPendingApprovals(null, limit, offset);
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
  const id = url.split('/api/kernel/evidence/')[1]?.split('?')[0];
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
  const url = req.url || req.originalUrl || '';
  let params = {};
  try {
    const search = url.includes('?') ? url.split('?')[1] : '';
    params = Object.fromEntries(new URLSearchParams(search));
  } catch (_) {}

  const result = await kernel.queryAuditTrail({
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
  const id = url.split('/api/kernel/evidence/')[1]?.replace(/\/export$/, '')?.split('?')[0];
  if (!id) return res.status(400).json({ error: 'Missing interaction ID' });

  try {
    const evidence = await kernel.generateEvidenceFile(id);
    res.status(200).json(evidence);
  } catch (err) {
    res.status(404).json({ error: err.message });
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
    if (method === 'GET' && path.startsWith('/api/kernel/evidence/') && path.endsWith('/export')) return await kernelEvidenceExportHandler(req, res, path);
    if (method === 'GET' && path.startsWith('/api/kernel/evidence/')) return await kernelEvidenceExportHandler(req, res, path);
    if (method === 'POST' && path.startsWith('/api/kernel/evidence/')) return await kernelEvidenceHandler(req, res, path);
    if (method === 'GET' && path === '/api/kernel/compliance/check') return await kernelComplianceCheckHandler(req, res);

    res.status(404).json({ error: 'Kernel endpoint not found', errorCode: 'KERNEL_NOT_FOUND' });
  } catch (err) {
    console.error('[BrightAI Kernel] Route error:', err);
    res.status(500).json({ error: 'Kernel processing error', errorCode: 'KERNEL_ERROR', details: err.message });
  }
}

module.exports = { kernelRouteHandler };
