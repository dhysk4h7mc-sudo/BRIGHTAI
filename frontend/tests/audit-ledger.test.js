import { describe, expect, it, beforeAll, afterAll } from 'vitest';

const { initializeDatabase } = require('../db/init');
const { logAuditEvent, verifyChainIntegrity } = require('../kernel/audit');

describe('Cryptographic Audit Ledger Integrity Tests', () => {
  let pool;

  beforeAll(async () => {
    // Initialize database connection using CommonJS module to share cache
    pool = await initializeDatabase();
    // Clear any existing test data to have a clean environment
    await pool.query('DELETE FROM kernel_audit_events');
  });

  afterAll(async () => {
    // Clean up after tests
    await pool.query('DELETE FROM kernel_audit_events');
  });

  it('1. verifies that a normal sequence of events maintains a valid chain', async () => {
    const traceId = 'test-trace-valid-' + Date.now();

    const ev1 = await logAuditEvent(traceId, 'REQUEST_RECEIVED', 'test_user', { query: 'hello' });
    const ev2 = await logAuditEvent(traceId, 'PII_SCANNED', 'system', { scanned: true });
    const ev3 = await logAuditEvent(traceId, 'RISK_SCORED', 'system', { risk: 0 });

    const result = await verifyChainIntegrity();

    expect(result.valid).toBe(true);
    expect(result.chainStatus).toBe('VALID');
    expect(result.brokenAt).toBeNull();
    expect(result.totalRecords).toBeGreaterThanOrEqual(3);
  });

  it('2. detects and flags manual payload tampering immediately', async () => {
    const traceId = 'test-trace-tamper-payload-' + Date.now();

    const ev1 = await logAuditEvent(traceId, 'REQUEST_RECEIVED', 'test_user', { query: 'secure' });
    const ev2 = await logAuditEvent(traceId, 'PII_SCANNED', 'system', { scanned: true });

    // Verify it is initially valid
    let result = await verifyChainIntegrity();
    expect(result.valid).toBe(true);

    // Tamper with the payload of ev2 manually in the DB
    await pool.query(
      'UPDATE kernel_audit_events SET payload = $1 WHERE event_id = $2',
      [JSON.stringify({ scanned: false, tampered: true }), ev2.eventId]
    );

    // Run verification again
    result = await verifyChainIntegrity();

    expect(result.valid).toBe(false);
    expect(result.chainStatus).toBe('INVALID');
    expect(result.brokenAt).toBe(ev2.eventId);
    expect(result.reason).toContain('Payload hash mismatch');
  });

  it('3. detects and flags a broken previous_hash link immediately', async () => {
    // Clear ledger to make this specific test isolated and simple to trace
    await pool.query('DELETE FROM kernel_audit_events');

    const traceId = 'test-trace-tamper-link-' + Date.now();

    const ev1 = await logAuditEvent(traceId, 'REQUEST_RECEIVED', 'test_user', { query: 'test' });
    const ev2 = await logAuditEvent(traceId, 'PII_SCANNED', 'system', { scanned: true });
    const ev3 = await logAuditEvent(traceId, 'RISK_SCORED', 'system', { risk: 0 });

    // Verify it is initially valid
    let result = await verifyChainIntegrity();
    expect(result.valid).toBe(true);

    // Manually break the previous_hash link of ev3 in the DB
    await pool.query(
      'UPDATE kernel_audit_events SET previous_hash = $1 WHERE event_id = $2',
      ['hacked_previous_hash', ev3.eventId]
    );

    // Run verification again
    result = await verifyChainIntegrity();

    expect(result.valid).toBe(false);
    expect(result.chainStatus).toBe('INVALID');
    expect(result.brokenAt).toBe(ev3.eventId);
    expect(result.reason).toContain('Previous hash mismatch');
  });
});
