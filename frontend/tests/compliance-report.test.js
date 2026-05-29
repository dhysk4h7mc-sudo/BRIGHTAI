const dbPath = require.resolve('../db/init');
const evidencePath = require.resolve('../kernel/evidence');
const originalDbModule = require(dbPath);

function loadEvidenceWithPool(pool) {
  delete require.cache[evidencePath];
  require.cache[dbPath].exports = {
    ...originalDbModule,
    getDb: () => pool
  };
  return require('../kernel/evidence');
}

describe('generateComplianceReport query building', () => {
  let pool;

  beforeEach(() => {
    pool = {
      query: vi.fn(async () => ({ rows: [{ count: '0' }] }))
    };
  });

  afterEach(() => {
    delete require.cache[evidencePath];
    require.cache[dbPath].exports = originalDbModule;
  });

  it('builds valid parameterized queries with no filters', async () => {
    const { generateComplianceReport } = loadEvidenceWithPool(pool);

    await generateComplianceReport();

    expect(pool.query).toHaveBeenCalledTimes(6);
    expect(pool.query.mock.calls[0][0]).toBe('SELECT COUNT(*) as count FROM kernel_interactions WHERE 1=1');
    expect(pool.query.mock.calls[0][1]).toEqual([]);
    expect(pool.query.mock.calls[1][0]).toBe('SELECT COUNT(*) as count FROM kernel_interactions WHERE firewall_action = $1');
    expect(pool.query.mock.calls[1][1]).toEqual(['block']);
  });

  it('builds valid parameterized queries with compliancePack only', async () => {
    const { generateComplianceReport } = loadEvidenceWithPool(pool);

    await generateComplianceReport({ compliancePack: 'pdpl' });

    expect(pool.query.mock.calls[0][0]).toBe('SELECT COUNT(*) as count FROM kernel_interactions WHERE compliance_pack = $1');
    expect(pool.query.mock.calls[0][1]).toEqual(['pdpl']);
    expect(pool.query.mock.calls[1][0]).toBe('SELECT COUNT(*) as count FROM kernel_interactions WHERE compliance_pack = $1 AND firewall_action = $2');
    expect(pool.query.mock.calls[1][1]).toEqual(['pdpl', 'block']);
  });

  it('builds valid parameterized queries with dateFrom/dateTo', async () => {
    const { generateComplianceReport } = loadEvidenceWithPool(pool);

    await generateComplianceReport({ dateFrom: 1717200000000, dateTo: 1719878399000 });

    expect(pool.query.mock.calls[0][0]).toBe('SELECT COUNT(*) as count FROM kernel_interactions WHERE created_at >= $1 AND created_at <= $2');
    expect(pool.query.mock.calls[0][1]).toEqual([1717200000000, 1719878399000]);
    expect(pool.query.mock.calls[5][0]).toBe('SELECT COUNT(*) as count FROM kernel_interactions WHERE created_at >= $1 AND created_at <= $2 AND pii_detected = $3');
    expect(pool.query.mock.calls[5][1]).toEqual([1717200000000, 1719878399000, 1]);
  });
});
