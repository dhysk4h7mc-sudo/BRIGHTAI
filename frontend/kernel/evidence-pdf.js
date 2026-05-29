'use strict';

function generateEvidencePdfBuffer(evidence, options = {}) {
  const report = buildEvidenceReport(evidence, options);
  return createSimplePdf(report.lines, report.title);
}

function buildEvidenceReport(evidence = {}, options = {}) {
  const summary = evidence.summary || {};
  const firewall = evidence.firewall || {};
  const risk = evidence.risk || {};
  const audit = evidence.audit || {};
  const user = evidence.user || {};
  const compliance = evidence.compliance || {};
  const evidenceHash = normalizeHash(options.evidenceHash) || normalizeHash(evidence.evidenceHash);
  const piiTypes = normalizeList(firewall.piiTypes || evidence.piiTypes || evidence.piiDetected);
  const maskedText = redactText(
    summary.request ||
    evidence.maskedText ||
    evidence.masked_message ||
    evidence.request ||
    evidence.query ||
    '',
    piiTypes
  );

  const model = summary.model || evidence.model || evidence.response_model || 'N/A';
  const provider = summary.provider || evidence.provider || evidence.responseProvider || evidence.response_provider || 'N/A';
  const latency = summary.responseTimeMs ?? evidence.latencyMs ?? evidence.response_time_ms ?? 'N/A';
  const tokensInput = summary.tokensInput ?? evidence.tokensInput ?? evidence.response_tokens_input ?? 'N/A';
  const tokensOutput = summary.tokensOutput ?? evidence.tokensOutput ?? evidence.response_tokens_output ?? 'N/A';
  const approver = summary.approvedBy || evidence.approvedBy || evidence.approver || 'N/A';
  const approvedAt = summary.approvedAt || evidence.approvedAt || evidence.approved_at || 'N/A';
  const department = user.department || user.departmentName || evidence.department || evidence.departmentName || 'N/A';

  const lines = [
    'BrightAI Kernel Evidence Report',
    '',
    `trace_id: ${evidence.trace_id || evidence.traceId || summary.traceId || 'N/A'}`,
    `interactionId: ${evidence.interactionId || summary.interactionId || evidence.requestId || 'N/A'}`,
    `generatedAt: ${evidence.generatedAt || new Date().toISOString()}`,
    `eventTimestamp: ${evidence.timestamp || evidence.createdAt || evidence.created_at || 'N/A'}`,
    '',
    `user: ${joinPresent([user.name, user.id]) || 'N/A'}`,
    `department: ${department}`,
    '',
    'Masked text only:',
    maskedText || 'N/A',
    '',
    `PII types: ${piiTypes.length ? piiTypes.join(', ') : 'None'}`,
    '',
    `risk score: ${risk.score ?? summary.riskScore ?? evidence.riskScore ?? 'N/A'}`,
    `risk level: ${risk.level || summary.riskLevel || evidence.riskLevel || 'N/A'}`,
    'risk reasons:',
    ...prefixList(normalizeList(risk.reasons || evidence.riskReasons || evidence.risk_reasons)),
    '',
    `approval status: ${summary.approvalStatus || evidence.approvalStatus || evidence.approval_status || 'N/A'}`,
    `approver: ${approver}`,
    `approval timestamp: ${approvedAt}`,
    '',
    `provider: ${provider}`,
    `model: ${model}`,
    `latencyMs: ${latency}`,
    `tokens input: ${tokensInput}`,
    `tokens output: ${tokensOutput}`,
    '',
    'audit hashes:',
    `requestHash: ${audit.requestHash || evidence.requestHash || evidence.request_hash || 'N/A'}`,
    `responseHash: ${audit.responseHash || evidence.responseHash || evidence.response_hash || 'N/A'}`,
    `previousHash: ${audit.previousHash || evidence.previousHash || evidence.previous_hash || 'N/A'}`,
    `recordHash: ${audit.recordHash || evidence.recordHash || evidence.record_hash || evidence.hash || 'N/A'}`,
    `evidenceHash: ${evidenceHash || 'N/A'}`,
    '',
    'regulatoryReferences:',
    ...formatRegulatoryReferences(evidence.regulatoryReferences || compliance.regulatoryReferences),
    '',
    `VERIFY_EVIDENCE_HASH=${evidenceHash || 'N/A'}`
  ];

  return {
    title: 'BrightAI Kernel Evidence Report',
    lines
  };
}

function createSimplePdf(lines, title) {
  const objects = [];
  const pages = [];
  const verificationLine = lines.find((line) => String(line).startsWith('VERIFY_EVIDENCE_HASH='));
  const evidenceHash = verificationLine ? String(verificationLine).split('=')[1] : '';
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 42;
  const startY = 790;
  const lineHeight = 15;
  const maxLinesPerPage = 48;
  const wrappedLines = lines.flatMap((line) => wrapLine(String(line || ''), 88));

  for (let i = 0; i < wrappedLines.length; i += maxLinesPerPage) {
    const pageLines = wrappedLines.slice(i, i + maxLinesPerPage);
    const content = buildContentStream(pageLines, marginX, startY, lineHeight);
    const contentObjectNumber = objects.length + 1;
    objects.push(`<< /Length ${Buffer.byteLength(content, 'binary')} >>\nstream\n${content}\nendstream`);
    const pageObjectNumber = objects.length + 1;
    pages.push(pageObjectNumber);
    objects.push(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 0 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`);
  }

  const fontObjectNumber = objects.length + 1;
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const pagesObjectNumber = objects.length + 1;
  objects.push(`<< /Type /Pages /Kids [${pages.map((page) => `${page} 0 R`).join(' ')}] /Count ${pages.length} >>`);
  const catalogObjectNumber = objects.length + 1;
  objects.push(`<< /Type /Catalog /Pages ${pagesObjectNumber} 0 R >>`);
  const infoObjectNumber = objects.length + 1;
  objects.push(`<< /Title ${pdfText(title)} /Producer ${pdfText('BrightAI Kernel')} >>`);

  const fixedObjects = objects.map((object) => object
    .replaceAll('/Parent 0 0 R', `/Parent ${pagesObjectNumber} 0 R`)
    .replaceAll('/F1 0 0 R', `/F1 ${fontObjectNumber} 0 R`));

  let pdf = `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n% BrightAIEvidenceHash: ${evidenceHash}\n`;
  const offsets = [0];
  fixedObjects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'binary'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'binary');
  pdf += `xref\n0 ${fixedObjects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${fixedObjects.length + 1} /Root ${catalogObjectNumber} 0 R /Info ${infoObjectNumber} 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'binary');
}

function buildContentStream(lines, x, y, lineHeight) {
  const commands = [
    'BT',
    '/F1 16 Tf',
    `${x} ${y} Td`
  ];

  lines.forEach((line, index) => {
    if (index === 1) commands.push('/F1 10 Tf');
    commands.push(`${pdfText(line)} Tj`);
    commands.push(`0 -${lineHeight} Td`);
  });

  commands.push('ET');
  return commands.join('\n');
}

function pdfText(value) {
  const bytes = Buffer.from('\uFEFF' + String(value), 'utf16le');
  for (let i = 0; i < bytes.length; i += 2) {
    const next = bytes[i];
    bytes[i] = bytes[i + 1];
    bytes[i + 1] = next;
  }
  return `<${bytes.toString('hex').toUpperCase()}>`;
}

function wrapLine(line, maxLength) {
  if (!line) return [''];
  const chunks = [];
  let value = line;
  while (value.length > maxLength) {
    chunks.push(value.slice(0, maxLength));
    value = value.slice(maxLength);
  }
  chunks.push(value);
  return chunks;
}

function normalizeHash(value) {
  const hash = String(value || '').trim();
  return /^[a-f0-9]{64}$/i.test(hash) ? hash : '';
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch (_) {}
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function prefixList(items) {
  return items.length ? items.map((item) => `- ${item}`) : ['- None'];
}

function formatRegulatoryReferences(refs) {
  const items = Array.isArray(refs) ? refs : [];
  if (!items.length) return ['- None'];
  return items.map((ref) => {
    if (typeof ref === 'string') return `- ${ref}`;
    return `- ${joinPresent([ref.framework, ref.article, ref.description], ' | ')}`;
  });
}

function joinPresent(items, separator = ' / ') {
  return items.filter((item) => item !== null && item !== undefined && item !== '').join(separator);
}

function redactText(value, piiTypes = []) {
  let text = String(value || '');
  text = text.replace(/\b1\d{9}\b/g, '[SAUDI_ID]');
  text = text.replace(/\b05\d{8}\b/g, '[PHONE]');
  text = text.replace(/\bSA\d{22}\b/gi, '[SAUDI_IBAN]');
  text = text.replace(/\b(?:\d[ -]*?){13,19}\b/g, '[CARD_OR_ACCOUNT]');
  text = text.replace(/\bMRN[-_ ]?\d+\b/gi, '[PATIENT_ID]');
  text = text.replace(/\bdb_password\b\s*[:=]\s*\S+/gi, 'db_password=[CREDENTIAL]');
  text = text.replace(/mock_secret_password_123/gi, '[CREDENTIAL]');

  if (piiTypes.includes('credentials')) {
    text = text.replace(/\b(password|secret|token|api[_-]?key)\b\s*[:=]\s*\S+/gi, '$1=[CREDENTIAL]');
  }
  if (piiTypes.some((type) => /name|employee_name|person/i.test(type))) {
    text = text.replace(/[\u0600-\u06FF]{2,}\s+[\u0600-\u06FF]{2,}/g, '[PERSON_NAME]');
  }

  return text;
}

module.exports = {
  buildEvidenceReport,
  generateEvidencePdfBuffer,
  redactText
};
