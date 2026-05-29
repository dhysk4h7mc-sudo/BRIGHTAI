'use strict';

const { scan } = require('./firewall');
const { computeRiskScore } = require('./risk-scorer');
const { logInteraction, logAuditEvent, queryAuditTrail, getAuditEntry, verifyChainIntegrity, getTraceIdFromInteraction } = require('./audit');
const approvalStore = require('./approval');
const { runComplianceChecks, saveComplianceChecks, getComplianceStatus } = require('./compliance');
const { generateEvidenceFile, generateComplianceReport } = require('./evidence');
const { isApiKeyConfigured, isNvidiaConfigured } = require('../config');
const { callOpenAiCompatibleProvider } = require('../services/openaiCompatProvider');
const { generateTraceId } = require('../db/init');
const { getActiveProvider, getProvidersResponse } = require('./providers');

const { queueForApproval, getPendingApprovals } = approvalStore;

function buildSystemInstruction(compliancePack) {
  const base = 'You are BrightAI Saqr AI, a secure AI assistant for Saudi enterprises. Respond in Arabic unless the user writes in English. Be professional, concise, and compliant with Saudi regulations.';
  const packInstructions = {
    pdpl: base + ' You are operating under PDPL (Personal Data Protection Law) compliance. Never request or output personal data. Warn if the user shares sensitive information.',
    nca_ecc: base + ' You are operating under NCA ECC 2-2024 cybersecurity controls. Prioritize security best practices. Log-relevant responses.',
    sfda: base + ' You are operating under SFDA/ISO 13485 medical device quality compliance. Assist with CAPA, rejections, complaints, and quality management. Reference ISO 13485 clauses when relevant.',
    procurement: base + ' You are operating in procurement/tenders context. Help analyze contracts, detect risks, and ensure compliance with Saudi procurement regulations.',
    healthcare: base + ' You are operating in healthcare context. Protect patient data. Assist with medical workflows while maintaining strict data confidentiality.',
  };
  return packInstructions[compliancePack] || base;
}

async function callGemini(maskedMessage, compliancePack) {
  const { config } = require('../config');
  const model = config.gemini.model || 'gemini-2.5-flash';
  const apiKey = config.gemini.apiKey;
  const endpoint = `${config.gemini.endpoint}/${model}:generateContent`;

  if (!apiKey) {
    return {
      response: '[BrightAI Kernel] Error: GEMINI_API_KEY not configured. Please set it in environment variables.',
      model,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      error: 'GEMINI_API_KEY not configured'
    };
  }

  const systemInstruction = buildSystemInstruction(compliancePack);
  const body = {
    contents: [{ role: 'user', parts: [{ text: maskedMessage }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
  };

  const startTime = Date.now();
  try {
    const fetchResponse = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const latencyMs = Date.now() - startTime;
    const data = await fetchResponse.json();

    if (data.error) {
      return {
        response: `[BrightAI Kernel] Gemini API error: ${data.error.message}`,
        model,
        inputTokens: 0,
        outputTokens: 0,
        latencyMs,
        error: data.error.message
      };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const usage = data.usageMetadata || {};

    return {
      response: text,
      model,
      inputTokens: usage.promptTokenCount || 0,
      outputTokens: usage.candidatesTokenCount || 0,
      latencyMs,
      error: null
    };
  } catch (err) {
    return {
      response: `[BrightAI Kernel] Network error: ${err.message}`,
      model,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: Date.now() - startTime,
      error: err.message
    };
  }
}

async function callOpenAI(maskedMessage, compliancePack) {
  const { config } = require('../config');
  const model = config.openai.model;
  const apiKey = config.openai.apiKey;
  const systemInstruction = buildSystemInstruction(compliancePack);
  const startTime = Date.now();

  if (!apiKey) {
    return {
      response: '[BrightAI Kernel] Error: OPENAI_API_KEY not configured.',
      provider: 'openai',
      model,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      error: 'OPENAI_API_KEY not configured'
    };
  }

  try {
    const fetchResponse = await fetch(config.openai.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: maskedMessage }
        ],
        temperature: 0.3,
        max_tokens: 4096
      })
    });

    const data = await fetchResponse.json().catch(() => ({}));
    const latencyMs = Date.now() - startTime;
    if (!fetchResponse.ok) {
      const message = data?.error?.message || `OpenAI API error: ${fetchResponse.status}`;
      return { response: `[BrightAI Kernel] ${message}`, provider: 'openai', model, inputTokens: 0, outputTokens: 0, latencyMs, error: message };
    }

    const usage = data.usage || {};
    return {
      response: data.choices?.[0]?.message?.content || '',
      provider: 'openai',
      model: data.model || model,
      inputTokens: usage.prompt_tokens || 0,
      outputTokens: usage.completion_tokens || 0,
      latencyMs,
      error: null
    };
  } catch (err) {
    return { response: `[BrightAI Kernel] Network error: ${err.message}`, provider: 'openai', model, inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - startTime, error: err.message };
  }
}

async function callAnthropic(maskedMessage, compliancePack) {
  const { config } = require('../config');
  const model = config.anthropic.model;
  const apiKey = config.anthropic.apiKey;
  const systemInstruction = buildSystemInstruction(compliancePack);
  const startTime = Date.now();

  if (!apiKey) {
    return {
      response: '[BrightAI Kernel] Error: ANTHROPIC_API_KEY not configured.',
      provider: 'anthropic',
      model,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 0,
      error: 'ANTHROPIC_API_KEY not configured'
    };
  }

  try {
    const fetchResponse = await fetch(config.anthropic.endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': process.env.ANTHROPIC_VERSION || '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        system: systemInstruction,
        messages: [{ role: 'user', content: maskedMessage }],
        temperature: 0.3,
        max_tokens: 4096
      })
    });

    const data = await fetchResponse.json().catch(() => ({}));
    const latencyMs = Date.now() - startTime;
    if (!fetchResponse.ok) {
      const message = data?.error?.message || `Anthropic API error: ${fetchResponse.status}`;
      return { response: `[BrightAI Kernel] ${message}`, provider: 'anthropic', model, inputTokens: 0, outputTokens: 0, latencyMs, error: message };
    }

    const usage = data.usage || {};
    return {
      response: data.content?.map((part) => part.text || '').join('') || '',
      provider: 'anthropic',
      model: data.model || model,
      inputTokens: usage.input_tokens || 0,
      outputTokens: usage.output_tokens || 0,
      latencyMs,
      error: null
    };
  } catch (err) {
    return { response: `[BrightAI Kernel] Network error: ${err.message}`, provider: 'anthropic', model, inputTokens: 0, outputTokens: 0, latencyMs: Date.now() - startTime, error: err.message };
  }
}

function callDemoProvider(provider) {
  const name = provider?.name || 'local';
  const model = provider?.model || 'brightai-kernel-demo';
  const isAllam = name === 'allam';
  return {
    response: isAllam
      ? '[BrightAI Kernel] Demo mode: ALLaM is shown as a Saudi sovereign option, but this adapter is not connected to a live ALLaM service in this build.'
      : '[BrightAI Kernel] Demo mode: no production kernel model provider configured.',
    provider: name,
    model,
    inputTokens: 0,
    outputTokens: 0,
    latencyMs: 0,
    error: isAllam ? 'ALLaM demo adapter only' : 'No production kernel model provider configured'
  };
}

async function callKernelModel(maskedMessage, compliancePack) {
  const { config } = require('../config');
  const systemInstruction = buildSystemInstruction(compliancePack);
  const activeProvider = getActiveProvider();

  if (activeProvider.name === 'nvidia' && isNvidiaConfigured()) {
    const startTime = Date.now();
    try {
      const result = await callOpenAiCompatibleProvider({
        provider: 'nvidia',
        model: config.nvidia.model,
        temperature: 0.3,
        maxTokens: 4096,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: maskedMessage }
        ]
      });

      const choice = result.data?.choices?.[0] || {};
      const text = choice.message?.content || choice.text || '';
      const usage = result.data?.usage || {};

      return {
        response: text,
        provider: 'nvidia',
        model: result.model,
        inputTokens: usage.prompt_tokens || usage.input_tokens || 0,
        outputTokens: usage.completion_tokens || usage.output_tokens || 0,
        latencyMs: Date.now() - startTime,
        error: null
      };
    } catch (err) {
      return {
        response: `[BrightAI Kernel] NVIDIA API error: ${err.message}`,
        provider: 'nvidia',
        model: config.nvidia.model,
        inputTokens: 0,
        outputTokens: 0,
        latencyMs: Date.now() - startTime,
        error: err.message
      };
    }
  }

  if (activeProvider.name === 'gemini' && isApiKeyConfigured()) {
    const geminiResult = await callGemini(maskedMessage, compliancePack);
    return { ...geminiResult, provider: 'gemini' };
  }

  if (activeProvider.name === 'openai') return callOpenAI(maskedMessage, compliancePack);
  if (activeProvider.name === 'anthropic') return callAnthropic(maskedMessage, compliancePack);

  return callDemoProvider(activeProvider);
}

async function processChat(params) {
  const { message, userId, userName, ipAddress, userAgent, compliancePack, metadata, traceId } = params;
  const pack = compliancePack || 'general';
  const incomingMetadata = parseJsonObject(metadata);
  const incomingTraceId = traceId || incomingMetadata.traceId || incomingMetadata.trace_id || null;
  const canonicalTraceId = incomingTraceId || await generateTraceId();
  const requestMetadata = {
    ...incomingMetadata,
    traceId: canonicalTraceId,
    trace_id: canonicalTraceId
  };
  if (incomingTraceId && incomingTraceId !== canonicalTraceId) {
    requestMetadata.upstreamTraceId = incomingTraceId;
  }

  const actor = userId || userName || 'system';

  // 1. REQUEST_RECEIVED
  await logAuditEvent(canonicalTraceId, 'REQUEST_RECEIVED', actor, {
    message,
    userId,
    userName,
    ipAddress,
    userAgent,
    compliancePack: pack,
    requestMetadata
  });

  // Layer 1: AI Firewall
  const firewallResult = await scan(message, pack);

  // 2. PII_SCANNED
  await logAuditEvent(canonicalTraceId, 'PII_SCANNED', 'system', {
    piiDetected: firewallResult.piiDetected ? 1 : 0,
    piiTypes: firewallResult.piiTypes,
    piiItems: firewallResult.piiItems,
    sensitiveCategories: firewallResult.sensitiveCategories,
    firewallAction: firewallResult.firewallAction,
    maskedText: firewallResult.maskedText
  });

  if (firewallResult.firewallAction === 'block') {
    // 3. RISK_SCORED (for blocked event)
    await logAuditEvent(canonicalTraceId, 'RISK_SCORED', 'system', {
      score: 100,
      level: 'critical',
      reasons: ['Request blocked by AI Firewall'],
      complianceFlags: [`Blocked: ${firewallResult.piiTypes.join(', ')}`]
    });

    // 4. EVIDENCE_GENERATED (for blocked event)
    await logAuditEvent(canonicalTraceId, 'EVIDENCE_GENERATED', 'system', {
      message: 'Blocked by firewall evidence generated'
    });

    const blockedInteraction = await logInteraction({
      user_id: userId,
      user_name: userName,
      ip_address: ipAddress,
      user_agent: userAgent,
      request_message: message,
      request_metadata: JSON.stringify(requestMetadata),
      pii_detected: firewallResult.piiDetected ? 1 : 0,
      pii_types: JSON.stringify(firewallResult.piiTypes),
      pii_items: JSON.stringify(firewallResult.piiItems),
      sensitive_data_categories: JSON.stringify(firewallResult.sensitiveCategories),
      firewall_action: 'block',
      masked_message: null,
      risk_score: 100,
      risk_level: 'critical',
      risk_reasons: JSON.stringify(['Request blocked by AI Firewall']),
      approval_status: 'blocked',
      gemini_response: null,
      response_model: null,
      response_tokens_input: 0,
      response_tokens_output: 0,
      response_time_ms: 0,
      response_error: 'Blocked by firewall',
      compliance_pack: pack,
      compliance_flags: JSON.stringify([`Blocked: ${firewallResult.piiTypes.join(', ')}`]),
      trace_id: canonicalTraceId
    });

    return {
      status: 'blocked',
      interactionId: blockedInteraction.id,
      requestId: blockedInteraction.id,
      traceId: canonicalTraceId,
      trace_id: canonicalTraceId,
      reason: 'Request blocked by AI Firewall',
      piiTypes: firewallResult.piiTypes,
      riskScore: 100,
      riskLevel: 'critical',
      piiDetected: firewallResult.piiTypes,
      auditHash: blockedInteraction.record_hash,
      hash: blockedInteraction.record_hash,
      kernel: { firewall: firewallResult, risk: { score: 100, level: 'critical' }, compliance: { pack, result: 'fail' }, traceId: canonicalTraceId }
    };
  }

  // Layer 4: Compliance checks
  const complianceResult = runComplianceChecks(pack, {
    firewallResult,
    requestMessage: message,
    user: userId ? { id: userId, name: userName } : null,
    metadata: requestMetadata
  });

  // Layer 2: Risk scoring
  const riskResult = computeRiskScore({
    firewallResult,
    compliancePack: pack,
    requestMetadata: { messageLength: message.length },
    user: userId ? { id: userId, name: userName } : null
  });

  // 3. RISK_SCORED
  await logAuditEvent(canonicalTraceId, 'RISK_SCORED', 'system', {
    score: riskResult.score,
    level: riskResult.level,
    reasons: riskResult.reasons,
    complianceFlags: complianceResult.flags
  });

  // Layer 3: Approval gate
  if (riskResult.requiresApproval) {
    // 4. APPROVAL_REQUESTED
    await logAuditEvent(canonicalTraceId, 'APPROVAL_REQUESTED', 'system', {
      assignedTo: approvalStore.getRequiredRole(riskResult.level),
      status: 'pending'
    });

    // 5. EVIDENCE_GENERATED (pending state)
    await logAuditEvent(canonicalTraceId, 'EVIDENCE_GENERATED', 'system', {
      message: 'Initial pending approval evidence generated'
    });

    const pendingInteraction = await logInteraction({
      user_id: userId,
      user_name: userName,
      ip_address: ipAddress,
      user_agent: userAgent,
      request_message: message,
      request_metadata: JSON.stringify(requestMetadata),
      pii_detected: firewallResult.piiDetected ? 1 : 0,
      pii_types: JSON.stringify(firewallResult.piiTypes),
      pii_items: JSON.stringify(firewallResult.piiItems),
      sensitive_data_categories: JSON.stringify(firewallResult.sensitiveCategories),
      firewall_action: firewallResult.firewallAction,
      masked_message: firewallResult.maskedText,
      risk_score: riskResult.score,
      risk_level: riskResult.level,
      risk_reasons: JSON.stringify(riskResult.reasons),
      approval_status: 'pending',
      gemini_response: null,
      response_model: null,
      response_tokens_input: 0,
      response_tokens_output: 0,
      response_time_ms: 0,
      response_error: null,
      compliance_pack: pack,
      compliance_flags: JSON.stringify(complianceResult.flags),
      trace_id: canonicalTraceId
    });

    await saveComplianceChecks(pendingInteraction.id, complianceResult);
    await queueForApproval(pendingInteraction.id, riskResult.score, riskResult.level, canonicalTraceId);

    return {
      status: 'pending_approval',
      requiresApproval: true,
      interactionId: pendingInteraction.id,
      requestId: pendingInteraction.id,
      traceId: canonicalTraceId,
      trace_id: canonicalTraceId,
      riskScore: riskResult.score,
      riskLevel: riskResult.level,
      reasons: riskResult.reasons,
      piiDetected: firewallResult.piiTypes,
      matchedPolicies: riskResult.reasons.map((reason) => ({ name: reason })),
      auditHash: pendingInteraction.record_hash,
      hash: pendingInteraction.record_hash,
      kernel: { firewall: firewallResult, risk: riskResult, compliance: complianceResult, traceId: canonicalTraceId }
    };
  }

  // Auto-approved: call the configured Kernel model provider.
  const modelResult = await callKernelModel(firewallResult.maskedText, pack);
  requestMetadata.provider = modelResult.provider;
  requestMetadata.model = modelResult.model;

  // 4. MODEL_CALLED
  await logAuditEvent(canonicalTraceId, 'MODEL_CALLED', 'system', {
    response: modelResult.response,
    model: modelResult.model,
    provider: modelResult.provider,
    inputTokens: modelResult.inputTokens,
    outputTokens: modelResult.outputTokens,
    latencyMs: modelResult.latencyMs,
    error: modelResult.error
  });

  // 5. EVIDENCE_GENERATED
  await logAuditEvent(canonicalTraceId, 'EVIDENCE_GENERATED', 'system', {
    message: 'Completed auto-approved transaction evidence generated'
  });

  // Audit trail consolidated read-model
  const interaction = await logInteraction({
    user_id: userId,
    user_name: userName,
    ip_address: ipAddress,
    user_agent: userAgent,
    request_message: message,
    request_metadata: JSON.stringify(requestMetadata),
    pii_detected: firewallResult.piiDetected ? 1 : 0,
    pii_types: JSON.stringify(firewallResult.piiTypes),
    pii_items: JSON.stringify(firewallResult.piiItems),
    sensitive_data_categories: JSON.stringify(firewallResult.sensitiveCategories),
    firewall_action: firewallResult.firewallAction,
    masked_message: firewallResult.maskedText,
    risk_score: riskResult.score,
    risk_level: riskResult.level,
    risk_reasons: JSON.stringify(riskResult.reasons),
    approval_status: 'auto_approved',
    gemini_response: modelResult.response,
    response_model: modelResult.model,
    response_tokens_input: modelResult.inputTokens,
    response_tokens_output: modelResult.outputTokens,
    response_time_ms: modelResult.latencyMs,
    response_error: modelResult.error,
    compliance_pack: pack,
    compliance_flags: JSON.stringify(complianceResult.flags),
    trace_id: canonicalTraceId
  });

  await saveComplianceChecks(interaction.id, complianceResult);

  return {
    status: 'completed',
    interactionId: interaction.id,
    requestId: interaction.id,
    traceId: canonicalTraceId,
    trace_id: canonicalTraceId,
    response: modelResult.response,
    provider: modelResult.provider,
    model: modelResult.model,
    riskScore: riskResult.score,
    riskLevel: riskResult.level,
    piiDetected: firewallResult.piiTypes,
    matchedPolicies: riskResult.reasons.map((reason) => ({ name: reason })),
    latencyMs: modelResult.latencyMs,
    auditHash: interaction.record_hash,
    hash: interaction.record_hash,
    kernel: {
      firewall: { piiDetected: firewallResult.piiDetected, piiTypes: firewallResult.piiTypes, action: firewallResult.firewallAction },
      risk: { score: riskResult.score, level: riskResult.level },
      compliance: { pack, result: complianceResult.overallResult, flags: complianceResult.flags },
      tokens: { input: modelResult.inputTokens, output: modelResult.outputTokens },
      latencyMs: modelResult.latencyMs,
      chainHash: interaction.record_hash,
      traceId: canonicalTraceId
    }
  };
}

function parseJsonObject(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (_error) {
    return {};
  }
}

async function approve(interactionId, approvedBy, comment) {
  const approvalResult = await approvalStore.approve(interactionId, approvedBy, comment);
  const original = await getAuditEntry(approvalResult.interactionId || interactionId);

  if (!original) {
    return {
      ...approvalResult,
      success: true,
      interactionId: approvalResult.interactionId || interactionId,
      requestId: approvalResult.interactionId || interactionId,
      traceId: approvalResult.traceId || null,
      trace_id: approvalResult.traceId || null,
      response: '',
      metadata: { approvalStatus: 'approved', warning: 'Original interaction not found', traceId: approvalResult.traceId || null }
    };
  }

  const maskedMessage = original.masked_message || original.request_message;
  const compliancePack = original.compliance_pack || 'general';
  const modelResult = await callKernelModel(maskedMessage, compliancePack);
  const metadata = parseJsonObject(original.request_metadata);
  const traceId = approvalResult.traceId || getTraceIdFromInteraction(original) || metadata.traceId || null;
  const riskReasons = original.risk_reasons || JSON.stringify(['Approved human review completion']);
  const complianceFlags = original.compliance_flags || JSON.stringify([]);

  // 1. MODEL_CALLED event
  await logAuditEvent(traceId, 'MODEL_CALLED', approvedBy, {
    response: modelResult.response,
    model: modelResult.model,
    provider: modelResult.provider,
    inputTokens: modelResult.inputTokens,
    outputTokens: modelResult.outputTokens,
    latencyMs: modelResult.latencyMs,
    error: modelResult.error
  });

  // 2. EVIDENCE_GENERATED event
  await logAuditEvent(traceId, 'EVIDENCE_GENERATED', approvedBy, {
    message: 'Completed approved transaction evidence generated'
  });

  // Consolidated read-model log (does not change history meaning, but gives a record for completed trace)
  const completionInteraction = await logInteraction({
    user_id: original.user_id,
    user_name: original.user_name,
    ip_address: original.ip_address,
    user_agent: original.user_agent,
    request_message: original.request_message,
    request_metadata: JSON.stringify({
      ...metadata,
      traceId,
      trace_id: traceId,
      provider: modelResult.provider,
      model: modelResult.model,
      approvedInteractionId: approvalResult.interactionId || interactionId,
      approvalEvent: 'human_approved_completion'
    }),
    pii_detected: original.pii_detected || 0,
    pii_types: original.pii_types,
    pii_items: original.pii_items,
    sensitive_data_categories: original.sensitive_data_categories,
    firewall_action: original.firewall_action || 'allow',
    masked_message: maskedMessage,
    risk_score: original.risk_score || 0,
    risk_level: original.risk_level || 'medium',
    risk_reasons: riskReasons,
    approval_status: 'approved_completed',
    approved_by: approvedBy,
    approved_at: approvalResult.approvedAt || Date.now(),
    approval_comment: comment || '',
    gemini_response: modelResult.response,
    response_model: modelResult.model,
    response_tokens_input: modelResult.inputTokens,
    response_tokens_output: modelResult.outputTokens,
    response_time_ms: modelResult.latencyMs,
    response_error: modelResult.error,
    compliance_pack: compliancePack,
    compliance_flags: complianceFlags,
    trace_id: traceId
  });

  return {
    success: true,
    status: 'completed',
    action: 'approved',
    interactionId: approvalResult.interactionId || interactionId,
    requestId: approvalResult.interactionId || interactionId,
    traceId,
    trace_id: traceId,
    completionInteractionId: completionInteraction.id,
    response: modelResult.response,
    provider: modelResult.provider,
    model: modelResult.model,
    metadata: {
      approvalStatus: 'approved_completed',
      riskScore: original.risk_score || 0,
      riskLevel: original.risk_level || 'medium',
      tokens: { input: modelResult.inputTokens, output: modelResult.outputTokens },
      latencyMs: modelResult.latencyMs,
      chainHash: completionInteraction.record_hash,
      traceId
    },
    kernel: {
      approval: approvalResult,
      tokens: { input: modelResult.inputTokens, output: modelResult.outputTokens },
      latencyMs: modelResult.latencyMs,
      chainHash: completionInteraction.record_hash,
      traceId
    }
  };
}

async function reject(interactionId, rejectedBy, comment) {
  const result = await approvalStore.reject(interactionId, rejectedBy, comment);
  const original = await getAuditEntry(result.interactionId || interactionId);
  const traceId = result.traceId || (original ? getTraceIdFromInteraction(original) : null);

  // 1. EVIDENCE_GENERATED event
  if (traceId) {
    await logAuditEvent(traceId, 'EVIDENCE_GENERATED', rejectedBy, {
      message: 'Transaction rejected evidence generated',
      comment: comment || 'Rejected'
    });
  }

  return {
    ...result,
    success: true,
    action: 'rejected',
    interactionId: result.interactionId || interactionId,
    requestId: result.interactionId || interactionId,
    traceId,
    trace_id: traceId,
    response: null,
    metadata: { approvalStatus: 'rejected', modelInvoked: false, traceId }
  };
}

async function getHealth() {
  const provider = getActiveProvider();

  let database = false;
  try {
    const { getDb } = require('../db/init');
    const pool = getDb();
    await pool.query('SELECT 1');
    database = true;
  } catch (_error) {
    database = false;
  }

  return {
    status: database && provider.configured && provider.mode !== 'demo' ? 'ok' : 'degraded',
    provider,
    kernel: {
      database,
      routes: true
    }
  };
}

async function getStats() {
  const { getDb } = require('../db/init');
  const pool = getDb();

  const { rows: [{ c: total }] } = await pool.query('SELECT COUNT(*) as c FROM kernel_interactions');
  const { rows: [{ c: blocked }] } = await pool.query("SELECT COUNT(*) as c FROM kernel_interactions WHERE firewall_action = 'block'");
  const { rows: [{ c: pending }] } = await pool.query("SELECT COUNT(*) as c FROM kernel_interactions WHERE approval_status = 'pending'");
  const { rows: [{ c: approved }] } = await pool.query("SELECT COUNT(*) as c FROM kernel_interactions WHERE approval_status = 'approved'");
  const { rows: [{ c: autoApproved }] } = await pool.query("SELECT COUNT(*) as c FROM kernel_interactions WHERE approval_status = 'auto_approved'");
  const { rows: [{ c: rejected }] } = await pool.query("SELECT COUNT(*) as c FROM kernel_interactions WHERE approval_status = 'rejected'");
  const { rows: [{ c: piiDetected }] } = await pool.query('SELECT COUNT(*) as c FROM kernel_interactions WHERE pii_detected = 1');
  const { rows: [{ avg }] } = await pool.query('SELECT AVG(risk_score)::numeric as avg FROM kernel_interactions');
  const chain = await verifyChainIntegrity();

  const { rows: byPack } = await pool.query('SELECT compliance_pack, COUNT(*) as count FROM kernel_interactions GROUP BY compliance_pack');
  const { rows: byRiskLevel } = await pool.query('SELECT risk_level, COUNT(*) as count FROM kernel_interactions GROUP BY risk_level');
  const { rows: latestRows } = await pool.query(`
    SELECT id, trace_id, request_metadata, approval_status, risk_level, risk_score, created_at, record_hash
    FROM kernel_interactions
    ORDER BY created_at DESC
    LIMIT 5
  `);

  const riskDistribution = byRiskLevel.reduce((acc, row) => {
    acc[row.risk_level || 'low'] = Number(row.count) || 0;
    return acc;
  }, {});

  const requests = {
    total: Number(total) || 0,
    pending: Number(pending) || 0,
    approved: Number(approved) || 0,
    executed: 0,
    completed: Number(autoApproved) || 0,
    rejected: Number(rejected) || 0,
    blocked: Number(blocked) || 0
  };

  return {
    total, blocked, pending, approved, autoApproved, rejected, piiDetected,
    avgRiskScore: Math.round(parseFloat(avg || 0) * 10) / 10,
    complianceRate: total > 0 ? (((total - blocked - rejected) / total) * 100).toFixed(1) + '%' : '100%',
    byCompliancePack: byPack,
    byRiskLevel,
    chainIntegrity: chain,
    requests,
    piiDetectionRate: total > 0 ? Math.round((piiDetected / total) * 100) : 0,
    riskDistribution,
    latestTraces: latestRows.map((row) => {
      const traceId = getTraceIdFromInteraction(row) || row.id;
      return {
        interactionId: row.id,
        requestId: row.id,
        traceId,
        traceIdLegacy: row.trace_id ? null : row.id,
        status: row.approval_status,
        riskLevel: row.risk_level,
        riskScore: row.risk_score,
        createdAt: row.created_at,
        hash: row.record_hash
      };
    })
  };
}

module.exports = {
  processChat,
  approve,
  reject,
  getPendingApprovals,
  queryAuditTrail,
  getAuditEntry,
  verifyChainIntegrity,
  getComplianceStatus,
  generateEvidenceFile,
  generateComplianceReport,
  getStats,
  getHealth,
  getProviders: getProvidersResponse
};
