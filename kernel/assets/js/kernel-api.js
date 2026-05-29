/**
 * BrightAI Kernel - API Client (Demo Mode Enabled)
 * Handles all communication with the backend API, with a robust offline client-side simulator.
 */

(function (global) {
  'use strict';

  const STATUS_KEYS = ['blocked', 'pending', 'approved', 'executed', 'completed', 'rejected'];
  const RISK_KEYS = ['critical', 'high', 'medium', 'low', 'minimal'];

  function toNumber(value, fallback = 0) {
    if (value === null || value === undefined || value === '') return fallback;
    const normalized = typeof value === 'string' ? value.replace('%', '').replace(/,/g, '').trim() : value;
    const number = Number(normalized);
    return Number.isFinite(number) ? number : fallback;
  }

  function toPercent(value, fallback = 0) {
    const percent = toNumber(value, fallback);
    return Math.max(0, Math.min(100, Math.round(percent * 10) / 10));
  }

  function normalizeRiskLevels(raw = {}) {
    const riskLevels = RISK_KEYS.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    const source = raw.riskLevels || raw.riskDistribution || {};
    if (Array.isArray(raw.byRiskLevel)) {
      raw.byRiskLevel.forEach((row) => {
        const key = row.risk_level || row.riskLevel || row.level || row.key;
        if (RISK_KEYS.includes(key)) riskLevels[key] = toNumber(row.count || row.value);
      });
      return riskLevels;
    }

    Object.entries(source).forEach(([key, value]) => {
      if (RISK_KEYS.includes(key)) riskLevels[key] = toNumber(value);
    });

    return riskLevels;
  }

  function calculateAverageRisk(riskLevels) {
    const weights = { critical: 100, high: 75, medium: 50, low: 25, minimal: 10 };
    let total = 0;
    let weighted = 0;

    Object.entries(riskLevels || {}).forEach(([level, count]) => {
      const value = toNumber(count);
      total += value;
      weighted += value * (weights[level] || 0);
    });

    return total > 0 ? Math.round(weighted / total) : 0;
  }

  function normalizeTrace(trace = {}) {
    const traceId = trace.traceId || trace.trace_id || trace.kernel?.traceId || trace.metadata?.traceId || trace.summary?.traceId || '';
    const interactionId = trace.interactionId || trace.interaction_id || trace.id || trace.requestId || trace.request_id || '';
    return {
      ...trace,
      traceId: /^AI-\d{4}-\d{5,}$/.test(String(traceId)) ? String(traceId) : '',
      interactionId,
      requestId: interactionId,
    };
  }

  function normalizeStats(raw = {}) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const statusSource = source.statusDistribution || {};
    const requests = source.requests || statusSource;
    const statistics = source.statistics || {};

    const blocked = toNumber(source.blocked ?? requests.blocked ?? statusSource.blocked);
    const pending = toNumber(source.pendingApproval ?? source.pending ?? requests.pending ?? statusSource.pending ?? statistics.pendingRequests);
    const approved = toNumber(source.approved ?? requests.approved ?? statusSource.approved);
    const executed = toNumber(source.executed ?? requests.executed ?? statusSource.executed);
    const completed = toNumber(source.completed ?? source.autoApproved ?? requests.completed ?? requests.autoApproved ?? statusSource.completed);
    const rejected = toNumber(source.rejected ?? requests.rejected ?? statusSource.rejected);

    const statusDistribution = STATUS_KEYS.reduce((acc, key) => {
      acc[key] = { blocked, pending, approved, executed, completed, rejected }[key] || 0;
      return acc;
    }, {});

    const derivedTotal = STATUS_KEYS.reduce((sum, key) => sum + statusDistribution[key], 0);
    const totalRequests = toNumber(
      source.totalRequests ?? source.total ?? requests.total ?? statistics.totalRequests,
      derivedTotal
    ) || derivedTotal;

    const riskLevels = normalizeRiskLevels(source);
    const avgRisk = toPercent(
      source.avgRisk ?? source.avgRiskScore ?? statistics.averageRiskScore,
      calculateAverageRisk(riskLevels)
    );

    const piiDetected = toNumber(source.piiDetected ?? source.pii_detected);
    const piiDetectionRate = toPercent(
      source.piiDetectionRate ?? source.pii_detection_rate,
      totalRequests > 0 ? (piiDetected / totalRequests) * 100 : 0
    );

    const complianceFallback = totalRequests > 0
      ? ((approved + executed + completed) / totalRequests) * 100
      : 0;
    const chainSource = source.chainIntegrity ?? source.chain_integrity ?? source.chainStatus ?? source.chain?.integrity ?? source.chain?.valid;

    return {
      totalRequests,
      pendingApproval: pending,
      avgRisk,
      piiDetectionRate,
      statusDistribution,
      riskLevels,
      complianceRate: toPercent(source.complianceRate ?? source.compliance_rate, complianceFallback),
      chainIntegrity: chainSource === undefined ? 'unknown' : chainSource,
      lastUpdated: source.lastUpdated || source.updatedAt || source.generatedAt || source.timestamp || new Date().toISOString(),
      latestTraces: Array.isArray(source.latestTraces) ? source.latestTraces.map(normalizeTrace) : [],
    };
  }

  // hardcoded defaults for CORS-free / offline usage (e.g. file:// protocol)
  function getHardcodedDefaults() {
    const trace1 = "AI-2026-10491";
    const trace2 = "AI-2026-10492";
    const trace3 = "AI-2026-10493";
    const trace4 = "AI-2026-10494";

    return {
      stats: {
        total: 348,
        blocked: 28,
        pending: 2,
        approved: 24,
        autoApproved: 274,
        rejected: 20,
        piiDetected: 64,
        avgRiskScore: 31.4,
        complianceRate: "92.5%",
        byCompliancePack: [
          { "compliance_pack": "pdpl", "count": 182 },
          { "compliance_pack": "nca_ecc", "count": 94 },
          { "compliance_pack": "sfda", "count": 48 },
          { "compliance_pack": "procurement", "count": 24 }
        ],
        byRiskLevel: [
          { "risk_level": "critical", "count": 12 },
          { "risk_level": "high", "count": 34 },
          { "risk_level": "medium", "count": 68 },
          { "risk_level": "low", "count": 146 },
          { "risk_level": "minimal", "count": 88 }
        ],
        requests: {
          total: 348,
          pending: 2,
          approved: 24,
          executed: 24,
          completed: 274,
          rejected: 20,
          blocked: 28
        },
        piiDetectionRate: 18,
        riskDistribution: {
          critical: 12,
          high: 34,
          medium: 68,
          low: 146,
          minimal: 88
        },
        latestTraces: [
          {
            interactionId: "trace-10491",
            requestId: "trace-10491",
            traceId: trace1,
            status: "blocked",
            riskLevel: "critical",
            riskScore: 100,
            createdAt: new Date(Date.now() - 600000).toISOString(),
            hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            query: "مشاركة ملف المرضى المصابين بالفيروس التاجي مع جهة بحثية خارجية تشمل أرقام الهواتف والهويات الوطنية 1029482103",
            compliancePackage: "pdpl"
          },
          {
            interactionId: "trace-10493",
            requestId: "trace-10493",
            traceId: trace3,
            status: "pending",
            riskLevel: "high",
            riskScore: 82,
            createdAt: new Date(Date.now() - 1200000).toISOString(),
            hash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99",
            query: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية SA9930000000001234567890",
            compliancePackage: "pdpl"
          },
          {
            interactionId: "trace-10492",
            requestId: "trace-10492",
            traceId: trace2,
            status: "completed",
            riskLevel: "minimal",
            riskScore: 15,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            hash: "2f4007886474ba0e00d23fbc01d2a3ec2cd98c2534c06282ebbc6c483a9937a0",
            query: "مراجعة عقد توريد توربينات غازية لصالح الشركة السعودية للكهرباء بقيمة 45,000,000 ريال سعودي والتحقق من شروط الضمان والمشتريات الحكومية",
            compliancePackage: "procurement"
          }
        ]
      },
      audit: {
        total: 348,
        rows: [
          {
            id: "ki_10491",
            interactionId: "trace-10491",
            requestId: "trace-10491",
            trace_id: trace1,
            traceId: trace1,
            created_at: new Date(Date.now() - 600000).toISOString(),
            timestamp: new Date(Date.now() - 600000).toISOString(),
            createdAt: new Date(Date.now() - 600000).toISOString(),
            user_id: "user_saudi_01",
            userId: "user_saudi_01",
            user_name: "سارة القحطاني",
            userName: "سارة القحطاني",
            ip_address: "192.168.10.45",
            user_agent: "Mozilla/5.0",
            request_message: "مشاركة ملف المرضى المصابين بالفيروس التاجي مع جهة بحثية خارجية تشمل أرقام الهواتف والهويات الوطنية 1029482103",
            query: "مشاركة ملف المرضى المصابين بالفيروس التاجي مع جهة بحثية خارجية تشمل أرقام الهواتف والهويات الوطنية 1029482103",
            originalText: "مشاركة ملف المرضى المصابين بالفيروس التاجي مع جهة بحثية خارجية تشمل أرقام الهواتف والهويات الوطنية 1029482103",
            pii_detected: 1,
            pii_types: "[\"saudi_id\"]",
            piiTypes: ["saudi_id"],
            piiDetected: ["saudi_id"],
            firewall_action: "block",
            masked_message: "مشاركة ملف المرضى المصابين بالفيروس التاجي مع جهة بحثية خارجية تشمل أرقام الهواتف والهويات الوطنية [SAUDI_ID]",
            maskedText: "مشاركة ملف المرضى المصابين بالفيروس التاجي مع جهة بحثية خارجية تشمل أرقام الهواتف والهويات الوطنية [SAUDI_ID]",
            risk_score: 100,
            riskScore: 100,
            risk_level: "critical",
            riskLevel: "critical",
            risk_reasons: "[\"Request blocked by AI Firewall due to PDPL violations\"]",
            approval_status: "blocked",
            approvalStatus: "blocked",
            action: "BLOCKED",
            actor: "system",
            gemini_response: "عذراً، تم حظر طلبك نظراً لاحتوائه على معلومات شخصية حساسة (رقم هوية وطنية) غير مشفرة، وهو ما يخالف نظام حماية البيانات الشخصية (PDPL) بالمملكة العربية السعودية.",
            response: "عذراً، تم حظر طلبك نظراً لاحتوائه على معلومات شخصية حساسة (رقم هوية وطنية) غير مشفرة، وهو ما يخالف نظام حماية البيانات الشخصية (PDPL) بالمملكة العربية السعودية.",
            response_model: "NVIDIA Llama-3.1-Nemotron",
            response_time_ms: 120,
            compliance_pack: "pdpl",
            compliancePack: "pdpl",
            compliance_flags: "[\"BLOCKED: saudi_id\"]",
            previous_hash: "a4d3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            previousHash: "a4d3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            record_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            recordHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
          },
          {
            id: "ki_10493",
            interactionId: "trace-10493",
            requestId: "trace-10493",
            trace_id: trace3,
            traceId: trace3,
            created_at: new Date(Date.now() - 1200000).toISOString(),
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            createdAt: new Date(Date.now() - 1200000).toISOString(),
            user_id: "user_saudi_02",
            userId: "user_saudi_02",
            user_name: "عبد الله الشمري",
            userName: "عبد الله الشمري",
            ip_address: "192.168.10.46",
            user_agent: "Mozilla/5.0",
            request_message: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية SA9930000000001234567890",
            query: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية SA9930000000001234567890",
            originalText: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية SA9930000000001234567890",
            pii_detected: 1,
            pii_types: "[\"saudi_iban\"]",
            piiTypes: ["saudi_iban"],
            piiDetected: ["saudi_iban"],
            firewall_action: "allow",
            masked_message: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية [SAUDI_IBAN]",
            maskedText: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية [SAUDI_IBAN]",
            risk_score: 82,
            riskScore: 82,
            risk_level: "high",
            riskLevel: "high",
            risk_reasons: "[\"كشف بيانات مالية حساسة (IBAN) تتطلب مراجعة بشرية قبل الإرسال\"]",
            approval_status: "pending",
            approvalStatus: "pending",
            action: "APPROVAL_REQUESTED",
            actor: "system",
            gemini_response: null,
            compliance_pack: "pdpl",
            compliancePack: "pdpl",
            compliance_flags: "[\"REQUIRES_APPROVAL: saudi_iban\"]",
            previous_hash: "2f4007886474ba0e00d23fbc01d2a3ec2cd98c2534c06282ebbc6c483a9937a0",
            previousHash: "2f4007886474ba0e00d23fbc01d2a3ec2cd98c2534c06282ebbc6c483a9937a0",
            record_hash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99",
            recordHash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99",
            hash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99"
          }
        ]
      },
      approvals: {
        pending: [
          {
            id: "trace-10493",
            requestId: "trace-10493",
            interactionId: "trace-10493",
            trace_id: trace3,
            traceId: trace3,
            status: "pending",
            query: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية SA9930000000001234567890",
            maskedText: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية [SAUDI_IBAN]",
            compliancePackage: "pdpl",
            userName: "عبد الله الشمري",
            userId: "user_saudi_02",
            createdAt: new Date(Date.now() - 1200000).toISOString(),
            riskScore: 82,
            riskLevel: "high",
            piiDetected: ["saudi_iban"],
            matchedPolicies: [{"name": "فحص البيانات المالية العابرة للحدود"}]
          },
          {
            id: "trace-10495",
            requestId: "trace-10495",
            interactionId: "trace-10495",
            trace_id: trace4,
            traceId: trace4,
            status: "pending",
            query: "تصدير الملفات الطبية الكاملة لمرضى العيادات الخارجية بمستشفى الملك فيصل وبها الهوية 1098234102 والإجراءات العلاجية الخاصة بهم",
            maskedText: "تصدير الملفات الطبية الكاملة لمرضى العيادات الخارجية بمستشفى الملك فيصل وبها الهوية [SAUDI_ID] والإجراءات العلاجية الخاصة بهم",
            compliancePackage: "healthcare",
            userName: "نورة العتيبي",
            userId: "user_saudi_05",
            createdAt: new Date(Date.now() - 60000).toISOString(),
            riskScore: 91,
            riskLevel: "critical",
            piiDetected: ["saudi_id"],
            matchedPolicies: [{"name": "حظر تصدير الهويات الوطنية بدون تعمية كاملة"}]
          }
        ],
        recent: [
          {
            id: "trace-10492",
            requestId: "trace-10492",
            interactionId: "trace-10492",
            trace_id: trace2,
            traceId: trace2,
            status: "completed",
            query: "مراجعة عقد توريد توربينات غازية لصالح الشركة السعودية للكهرباء بقيمة 45,000,000 ريال سعودي والتحقق من شروط الضمان والمشتريات الحكومية",
            compliancePackage: "procurement",
            userName: "سعد المطيري",
            userId: "user_saudi_03",
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            riskScore: 15,
            riskLevel: "minimal",
            piiDetected: [],
            matchedPolicies: [],
            approver: "النظام الآلي"
          }
        ],
        summary: {
          totalPending: 2,
          criticalCount: 1,
          highCount: 1,
          completedToday: 14
        }
      },
      evidence: {
        total: 4,
        evidence: [
          {
            id: "trace-10491",
            interactionId: "trace-10491",
            requestId: "trace-10491",
            traceId: trace1,
            trace_id: trace1,
            createdAt: new Date(Date.now() - 600000).toISOString(),
            preview: "طلب استعلام يحتوي على بيانات شخصية حساسة تم اكتشافها وحجبها تلقائياً (الهوية الوطنية)",
            status: "blocked",
            approvalStatus: "blocked",
            riskLevel: "critical"
          },
          {
            id: "trace-10493",
            interactionId: "trace-10493",
            requestId: "trace-10493",
            traceId: trace3,
            trace_id: trace3,
            createdAt: new Date(Date.now() - 1200000).toISOString(),
            preview: "طلب تصدير التقرير المالي لشركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية",
            status: "pending",
            approvalStatus: "pending",
            riskLevel: "high"
          },
          {
            id: "trace-10492",
            interactionId: "trace-10492",
            requestId: "trace-10492",
            traceId: trace2,
            trace_id: trace2,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            preview: "مراجعة عقد توريد توربينات غازية للشركة السعودية للكهرباء متوافق مع لوائح المشتريات",
            status: "completed",
            approvalStatus: "completed",
            riskLevel: "minimal"
          }
        ],
        rows: [
          {
            id: "trace-10491",
            interactionId: "trace-10491",
            requestId: "trace-10491",
            traceId: trace1,
            trace_id: trace1,
            createdAt: new Date(Date.now() - 600000).toISOString(),
            preview: "طلب استعلام يحتوي على بيانات شخصية حساسة تم اكتشافها وحجبها تلقائياً (الهوية الوطنية)",
            status: "blocked",
            approvalStatus: "blocked",
            riskLevel: "critical"
          },
          {
            id: "trace-10493",
            interactionId: "trace-10493",
            requestId: "trace-10493",
            traceId: trace3,
            trace_id: trace3,
            createdAt: new Date(Date.now() - 1200000).toISOString(),
            preview: "طلب تصدير التقرير المالي لشركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية",
            status: "pending",
            approvalStatus: "pending",
            riskLevel: "high"
          },
          {
            id: "trace-10492",
            interactionId: "trace-10492",
            requestId: "trace-10492",
            traceId: trace2,
            trace_id: trace2,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            preview: "مراجعة عقد توريد توربينات غازية للشركة السعودية للكهرباء متوافق مع لوائح المشتريات",
            status: "completed",
            approvalStatus: "completed",
            riskLevel: "minimal"
          }
        ],
        details: {
          "trace-10491": {
            id: "trace-10491",
            interactionId: "trace-10491",
            requestId: "trace-10491",
            traceId: trace1,
            trace_id: trace1,
            createdAt: new Date(Date.now() - 600000).toISOString(),
            timestamp: new Date(Date.now() - 600000).toISOString(),
            request: "مشاركة ملف المرضى المصابين بالفيروس التاجي مع جهة بحثية خارجية تشمل أرقام الهواتف والهويات الوطنية 1029482103",
            response: "عذراً، تم حظر طلبك نظراً لاحتوائه على معلومات شخصية حساسة (رقم هوية وطنية) غير مشفرة، وهو ما يخالف نظام حماية البيانات الشخصية (PDPL) بالمملكة العربية السعودية.",
            riskScore: 100,
            riskLevel: "critical",
            approvalStatus: "blocked",
            requestHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            previousHash: "a4d3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            recordHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
          },
          [trace1]: {
            id: "trace-10491",
            interactionId: "trace-10491",
            requestId: "trace-10491",
            traceId: trace1,
            trace_id: trace1,
            createdAt: new Date(Date.now() - 600000).toISOString(),
            timestamp: new Date(Date.now() - 600000).toISOString(),
            request: "مشاركة ملف المرضى المصابين بالفيروس التاجي مع جهة بحثية خارجية تشمل أرقام الهواتف والهويات الوطنية 1029482103",
            response: "عذراً، تم حظر طلبك نظراً لاحتوائه على معلومات شخصية حساسة (رقم هوية وطنية) غير مشفرة، وهو ما يخالف نظام حماية البيانات الشخصية (PDPL) بالمملكة العربية السعودية.",
            riskScore: 100,
            riskLevel: "critical",
            approvalStatus: "blocked",
            requestHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            previousHash: "a4d3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            recordHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
          },
          "trace-10493": {
            id: "trace-10493",
            interactionId: "trace-10493",
            requestId: "trace-10493",
            traceId: trace3,
            trace_id: trace3,
            createdAt: new Date(Date.now() - 1200000).toISOString(),
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            request: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية SA9930000000001234567890",
            response: "بانتظار موافقة مدير الامتثال لوجود أرقام حسابات مصرفية غير مقنعة.",
            riskScore: 82,
            riskLevel: "high",
            approvalStatus: "pending",
            requestHash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99",
            previousHash: "2f4007886474ba0e00d23fbc01d2a3ec2cd98c2534c06282ebbc6c483a9937a0",
            recordHash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99"
          },
          [trace3]: {
            id: "trace-10493",
            interactionId: "trace-10493",
            requestId: "trace-10493",
            traceId: trace3,
            trace_id: trace3,
            createdAt: new Date(Date.now() - 1200000).toISOString(),
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            request: "طلب تصدير التقرير المالي الربع سنوي للربع الأول لعام 2026 لـ شركة الاتصالات السعودية STC ويحتوي على أرقام بطاقات مصرفية SA9930000000001234567890",
            response: "بانتظار موافقة مدير الامتثال لوجود أرقام حسابات مصرفية غير مقنعة.",
            riskScore: 82,
            riskLevel: "high",
            approvalStatus: "pending",
            requestHash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99",
            previousHash: "2f4007886474ba0e00d23fbc01d2a3ec2cd98c2534c06282ebbc6c483a9937a0",
            recordHash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99"
          },
          "trace-10492": {
            id: "trace-10492",
            interactionId: "trace-10492",
            requestId: "trace-10492",
            traceId: trace2,
            trace_id: trace2,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            request: "مراجعة عقد توريد توربينات غازية لصالح الشركة السعودية للكهرباء بقيمة 45,000,000 ريال سعودي والتحقق من شروط الضمان والمشتريات الحكومية",
            response: "تمت مراجعة مسودة العقد بالكامل. كافة البنود تتوافق مع نظام المشتريات الحكومية السعودي. شروط الضمان محددة بـ 3 سنوات وتغطي الأعطال الميكانيكية للتربينات، مما يعتبر ممتازاً ووفق معايير الصناعة.",
            riskScore: 15,
            riskLevel: "minimal",
            approvalStatus: "completed",
            requestHash: "2f4007886474ba0e00d23fbc01d2a3ec2cd98c2534c06282ebbc6c483a9937a0",
            previousHash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99",
            recordHash: "2f4007886474ba0e00d23fbc01d2a3ec2cd98c2534c06282ebbc6c483a9937a0"
          },
          [trace2]: {
            id: "trace-10492",
            interactionId: "trace-10492",
            requestId: "trace-10492",
            traceId: trace2,
            trace_id: trace2,
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            request: "مراجعة عقد توريد توربينات غازية لصالح الشركة السعودية للكهرباء بقيمة 45,000,000 ريال سعودي والتحقق من شروط الضمان والمشتريات الحكومية",
            response: "تمت مراجعة مسودة العقد بالكامل. كافة البنود تتوافق مع نظام المشتريات الحكومية السعودي. شروط الضمان محددة بـ 3 سنوات وتغطي الأعطال الميكانيكية للتربينات، مما يعتبر ممتازاً ووفق معايير الصناعة.",
            riskScore: 15,
            riskLevel: "minimal",
            approvalStatus: "completed",
            requestHash: "2f4007886474ba0e00d23fbc01d2a3ec2cd98c2534c06282ebbc6c483a9937a0",
            previousHash: "ca85d0d1e3d36b8e88fdfb06bb007a22a3eb2cd98c2534c06282ebbc6c483a99",
            recordHash: "2f4007886474ba0e00d23fbc01d2a3ec2cd98c2534c06282ebbc6c483a9937a0"
          }
        }
      },
      compliance: {
        state: {
          pdpl: { 
            score: 98, 
            status: "compliant", 
            lastAudit: new Date(Date.now() - 3600000).toISOString(),
            requirementScores: { "consent": 100, "access": 100, "breach": 95, "retention": 95, "transfer": 100 } 
          },
          gdpr: { 
            score: 95, 
            status: "compliant", 
            lastAudit: new Date(Date.now() - 7200000).toISOString(),
            requirementScores: { "forget": 100, "portability": 100, "documentation": 85, "dpo": 100, "impact": 90 } 
          },
          hipaa: { 
            score: 78, 
            status: "partial", 
            lastAudit: new Date(Date.now() - 14400000).toISOString(),
            requirementScores: { "encryption": 100, "access_logs": 80, "baa": 50, "training": 80 } 
          },
          pci: { 
            score: 100, 
            status: "compliant", 
            lastAudit: new Date(Date.now() - 1800000).toISOString(),
            requirementScores: { "card_protection": 100, "transit_encryption": 100, "pen_test": 100, "monitoring": 100 } 
          },
          iso27001: { 
            score: 92, 
            status: "compliant", 
            lastAudit: new Date(Date.now() - 86400000).toISOString(),
            requirementScores: { "policy": 100, "risk_mgmt": 100, "internal_audit": 75, "incident": 95 } 
          }
        }
      }
    };
  }

  // Initialize Demo Mode LocalStorage flag to true if not set
  if (localStorage.getItem('brightai_kernel_demo_mode') === null) {
    localStorage.setItem('brightai_kernel_demo_mode', 'true');
  }

  let dbInitPromise = null;

  // Initialize unified Local Mock Database inside localStorage
  function ensureDBInitialized() {
    if (dbInitPromise) return dbInitPromise;

    dbInitPromise = (async () => {
      let cached = localStorage.getItem('brightai_kernel_mock_db');
      if (cached) {
        try {
          window.kernelDemoState = JSON.parse(cached);
          // Sync summary statistics back just in case
          recalculateSummaryStats();
          return;
        } catch (e) {
          console.error("[BrightAI Kernel] Failed to parse cached mock DB. Re-initializing...", e);
        }
      }

      try {
        // Parallel fetch for default configuration files
        const [stats, audit, approvals, evidence, compliance] = await Promise.all([
          fetch('/kernel/api/mock/stats.json').then(r => r.json()),
          fetch('/kernel/api/mock/audit.json').then(r => r.json()),
          fetch('/kernel/api/mock/approvals.json').then(r => r.json()),
          fetch('/kernel/api/mock/evidence.json').then(r => r.json()),
          fetch('/kernel/api/mock/compliance.json').then(r => r.json())
        ]);
        window.kernelDemoState = { stats, audit, approvals, evidence, compliance };
      } catch (err) {
        console.warn("[BrightAI Kernel] Failed to fetch local JSON mock files. Using hardcoded fallback.", err);
        window.kernelDemoState = getHardcodedDefaults();
      }

      localStorage.setItem('brightai_kernel_mock_db', JSON.stringify(window.kernelDemoState));
    })();

    return dbInitPromise;
  }

  // Recalculate summary metrics for compliance and risk
  function recalculateSummaryStats() {
    if (!window.kernelDemoState) return;
    const db = window.kernelDemoState;
    
    // total requests count
    const total = (db.audit.rows || []).length + (db.approvals.pending || []).length;
    const blocked = (db.audit.rows || []).filter(r => r.approvalStatus === 'blocked' || r.firewall_action === 'block').length;
    const pending = (db.approvals.pending || []).length;
    const approved = (db.approvals.recent || []).filter(r => r.status === 'completed' || r.status === 'approved').length;
    const rejected = (db.audit.rows || []).filter(r => r.approvalStatus === 'rejected' || r.status === 'rejected').length;
    const completed = (db.audit.rows || []).filter(r => r.approvalStatus === 'completed' || r.approvalStatus === 'auto_approved' || r.status === 'completed' || r.status === 'auto_approved').length;
    
    db.stats.requests = {
      total,
      pending,
      approved,
      executed: approved,
      completed,
      rejected,
      blocked
    };
    db.stats.total = total;
    db.stats.pending = pending;
    db.stats.blocked = blocked;
    db.stats.approved = approved;
    db.stats.rejected = rejected;
    db.stats.autoApproved = completed;

    db.approvals.summary = {
      totalPending: pending,
      criticalCount: (db.approvals.pending || []).filter(r => r.riskLevel === 'critical').length,
      highCount: (db.approvals.pending || []).filter(r => r.riskLevel === 'high').length,
      completedToday: approved
    };

    localStorage.setItem('brightai_kernel_mock_db', JSON.stringify(db));
  }

  // Generate SHA-256 hash dummy for audit chain
  function generateHash() {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  function maskSensitiveText(value, piiTypes = []) {
    let text = String(value || '')
      .replace(/\b1\d{9}\b/g, '[SAUDI_ID]')
      .replace(/\b05\d{8}\b/g, '[PHONE]')
      .replace(/\bSA\d{22}\b/gi, '[SAUDI_IBAN]')
      .replace(/\b(?:\d[ -]*?){13,19}\b/g, '[CARD_OR_ACCOUNT]')
      .replace(/\bMRN[-_ ]?\d+\b/gi, '[PATIENT_ID]')
      .replace(/\bdb_password\b\s*[:=]\s*\S+/gi, 'db_password=[CREDENTIAL]')
      .replace(/mock_secret_password_123/gi, '[CREDENTIAL]');
    if (piiTypes.some((type) => /name|employee_name|person/i.test(type))) {
      text = text.replace(/[\u0600-\u06FF]{2,}\s+[\u0600-\u06FF]{2,}/g, '[PERSON_NAME]');
    }
    return text;
  }

  function normalizeMockList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      } catch (_error) {}
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
  }

  function getMockRegulatoryReferences(pack = 'general') {
    const refs = [];
    const key = String(pack || 'general').toLowerCase();
    if (key === 'pdpl' || key === 'general') {
      refs.push({ framework: 'PDPL', article: 'Article 29', description: 'Cross-border data transfer' });
      refs.push({ framework: 'PDPL', article: 'Article 13', description: 'Data processing consent' });
    }
    if (key === 'nca_ecc' || key === 'general') {
      refs.push({ framework: 'NCA ECC 2-2024', article: 'Section 4', description: 'Access control' });
      refs.push({ framework: 'NCA ECC 2-2024', article: 'Section 5', description: 'Data classification' });
    }
    if (key === 'sfda' || key === 'healthcare') {
      refs.push({ framework: 'ISO 13485', article: '§8.3', description: 'Design and development outputs' });
      refs.push({ framework: 'SFDA QMS-GL', article: '2024', description: 'QMS Guidelines for medical devices' });
    }
    return refs;
  }

  function findMockAuditRecord(db, id) {
    return (db.audit.rows || []).find((row) =>
      row.id === id ||
      row.interactionId === id ||
      row.requestId === id ||
      row.traceId === id ||
      row.trace_id === id
    ) || null;
  }

  function buildMockEvidenceFile(record = {}, db, id) {
    const auditRecord = findMockAuditRecord(db, id) || {};
    const source = { ...auditRecord, ...record };
    const traceId = source.traceId || source.trace_id || id;
    const interactionId = source.interactionId || source.id || source.requestId || id;
    const piiTypes = normalizeMockList(source.piiTypes || source.piiDetected || source.pii_types);
    const maskedRequest = maskSensitiveText(source.maskedText || source.masked_message || source.request || source.query || source.request_message || '', piiTypes);
    const recordHash = source.recordHash || source.record_hash || source.hash || generateHash();
    const evidenceHash = source.evidenceHash || source.evidence_hash || recordHash;
    const riskReasons = normalizeMockList(source.riskReasons || source.risk_reasons || source.matchedPolicies?.map?.((policy) => policy.name));
    const compliancePack = source.compliancePack || source.compliance_pack || 'general';

    return {
      evidenceId: source.evidenceId || `ev_${interactionId}`,
      generatedAt: source.generatedAt || new Date().toISOString(),
      interactionId,
      requestId: interactionId,
      traceId,
      trace_id: traceId,
      timestamp: source.timestamp || source.createdAt || source.created_at,
      summary: {
        traceId,
        interactionId,
        request: maskedRequest,
        response: source.response || source.gemini_response || '',
        riskScore: source.riskScore ?? source.risk_score,
        riskLevel: source.riskLevel || source.risk_level,
        approvalStatus: source.approvalStatus || source.approval_status || source.status,
        approvedBy: source.approvedBy || source.approver || source.actor,
        approvedAt: source.approvedAt || source.approved_at || null,
        model: source.model || source.response_model || 'Demo Mode',
        provider: source.provider || 'demo',
        responseTimeMs: source.latencyMs || source.response_time_ms || 0,
        tokensInput: source.tokensInput || source.response_tokens_input || 0,
        tokensOutput: source.tokensOutput || source.response_tokens_output || 0
      },
      firewall: {
        piiDetected: piiTypes.length > 0,
        piiTypes,
        piiItems: [],
        sensitiveCategories: [],
        action: source.firewall_action || source.action || 'allow'
      },
      risk: {
        score: source.riskScore ?? source.risk_score,
        level: source.riskLevel || source.risk_level,
        reasons: riskReasons
      },
      compliance: {
        pack: compliancePack,
        flags: normalizeMockList(source.compliance_flags)
      },
      audit: {
        traceId,
        requestHash: source.requestHash || source.request_hash || recordHash,
        responseHash: source.responseHash || source.response_hash || recordHash,
        previousHash: source.previousHash || source.previous_hash || '0',
        recordHash,
        integrityVerified: true,
        eventsCount: 0
      },
      events: [],
      user: {
        id: source.userId || source.user_id,
        name: source.userName || source.user_name,
        department: source.department || source.departmentName
      },
      regulatoryReferences: getMockRegulatoryReferences(compliancePack),
      evidenceHash
    };
  }

  // Local Chat Simulation firewall scanning and scoring
  function simulateChat(message, compliancePack) {
    const db = window.kernelDemoState;
    
    // Determine Scenario
    let scenario = 'general';
    let traceId = `AI-2026-${String(10000 + Math.floor(Math.random() * 90000))}`;
    let riskScore = 8;
    let riskLevel = 'minimal';
    let status = 'completed';
    let pii = [];
    let matchedPolicies = [];
    let responseText = "أهلاً بك! لقد تم استلام طلبك ومراجعته بنجاح من خلال بوابة حوكمة نواة BrightAI. الاستعلام متوافق مع كافة حزم حماية البيانات المعتمدة.";
    let latencyMs = 450;

    if (/آيبان|تمويل|FIN88|Finance/i.test(message)) {
      scenario = 'finance';
      traceId = 'AI-2026-FIN88';
      riskScore = 82;
      riskLevel = 'high';
      status = 'pending_approval';
      pii = ['saudi_iban'];
      matchedPolicies = [{"name": "سياسة حوكمة البيانات المالية وحماية الآيبان"}];
      responseText = "بانتظار موافقة مدير الامتثال لوجود أرقام حسابات مصرفية (آيبان) وعقد تمويل شخصي معلّق.";
      latencyMs = 780;
    } else if (/خالد الحربي|تقييم سنوي|راتب|HR99|HR/i.test(message)) {
      scenario = 'hr';
      traceId = 'AI-2026-HR99';
      riskScore = 65;
      riskLevel = 'medium';
      status = 'completed';
      pii = ['salary', 'employee_name'];
      matchedPolicies = [{"name": "سياسة حماية بيانات الموظفين والتقييمات السرية"}];
      responseText = "تمت مراجعة ملف الموظف خالد الحربي بنجاح. لقد قامت بوابة الحوكمة تلقائياً بحجب البيانات الحساسة المتعلقة بالراتب والمكافآت [Salary: *******] لضمان الخصوصية والامتثال لنظام حماية البيانات الشخصية.";
      latencyMs = 620;
    } else if (/عقد المورد|شرط جزائي|لوائح الشركة|LEG77|Legal/i.test(message)) {
      scenario = 'legal';
      traceId = 'AI-2026-LEG77';
      riskScore = 15;
      riskLevel = 'minimal';
      status = 'completed';
      pii = [];
      matchedPolicies = [{"name": "سياسة مراجعة العقود القياسية للشركات"}];
      responseText = "تم تحليل عقد المورد بنجاح. البند الخاص بالشرط الجزائي البالغ 50,000 ريال يتوافق تماماً مع الأنظمة الداخلية لشركة المشتريات ولا توجد مخاطر إضافية.";
      latencyMs = 510;
    } else if (/CAPA|MRN-12345|سكري|MED55|Healthcare/i.test(message)) {
      scenario = 'healthcare';
      traceId = 'AI-2026-MED55';
      riskScore = 91;
      riskLevel = 'critical';
      status = 'blocked';
      pii = ['patient_id'];
      matchedPolicies = [{"name": "سياسة حماية البيانات الصحية للمرضى وحوكمة الهيئة العامة للغذاء والدواء SFDA"}];
      responseText = "عذراً، تم حظر طلبك نظراً لاحتوائه على معلومات شخصية صحية وحساسة (ملف طبي MRN-12345) بدون تصريح مسبق، وهو ما يخالف نظام الهيئة العامة للغذاء والدواء SFDA ولوائح حماية البيانات الصحية.";
      latencyMs = 890;
    } else if (/db_password|mock_secret_password_123|COD44|Code/i.test(message)) {
      scenario = 'code';
      traceId = 'AI-2026-COD44';
      riskScore = 95;
      riskLevel = 'critical';
      status = 'blocked';
      pii = ['credentials'];
      matchedPolicies = [{"name": "ضوابط الأمن السيبراني الوطنية للأسرار البرمجية NCA ECC"}];
      responseText = "عذراً، تم حظر طلب الاستعلام فوراً لاحتوائه على كلمات سر ومفاتيح أمنية مكشوفة (db_password) في الكود البرمجي المرفق، وهو ما ينتهك ضوابط الأمن السيبراني الوطنية NCA ECC.";
      latencyMs = 950;
    }

    const interactionId = `ki_${String(10000 + Math.floor(Math.random() * 90000))}`;
    let result = {};

    const newRequest = {
      id: interactionId,
      requestId: interactionId,
      interactionId: interactionId,
      trace_id: traceId,
      traceId: traceId,
      status: status === 'pending_approval' ? 'pending' : status,
      query: message,
      maskedText: maskSensitiveText(message, pii),
      compliancePackage: compliancePack || (scenario === 'finance' || scenario === 'hr' ? 'PDPL' : scenario === 'healthcare' ? 'SFDA' : scenario === 'code' ? 'NCA_ECC' : 'general'),
      userName: KernelUtils?.getUserName() || 'مستخدم تجريبي',
      userId: KernelUtils?.getUserId() || 'user_demo',
      createdAt: new Date().toISOString(),
      riskScore,
      riskLevel,
      piiDetected: pii,
      matchedPolicies
    };

    if (status === 'blocked') {
      const auditEntry = {
        ...newRequest,
        created_at: newRequest.createdAt,
        timestamp: newRequest.createdAt,
        approvalStatus: 'blocked',
        action: 'BLOCKED',
        actor: 'system',
        gemini_response: responseText,
        response: responseText,
        previousHash: db.audit.rows[0]?.recordHash || generateHash(),
        recordHash: generateHash(),
        hash: generateHash()
      };
      db.audit.rows.unshift(auditEntry);
      db.audit.entries = db.audit.rows;

      result = {
        status: 'blocked',
        requiresApproval: false,
        interactionId,
        requestId: interactionId,
        traceId,
        riskScore,
        riskLevel,
        piiDetected: pii,
        matchedPolicies,
        auditHash: auditEntry.hash,
        hash: auditEntry.hash,
        reason: responseText,
        kernel: {
          firewall: { piiDetected: pii.length > 0, piiTypes: pii, action: 'block' },
          risk: { score: riskScore, level: riskLevel },
          compliance: { pack: newRequest.compliancePackage, result: 'fail' },
          traceId
        }
      };
    } else if (status === 'pending_approval') {
      // Check if already in pending list to avoid duplicates
      const exists = db.approvals.pending.some(p => p.traceId === traceId);
      if (!exists) {
        db.approvals.pending.unshift(newRequest);
      }

      result = {
        status: 'pending_approval',
        requiresApproval: true,
        interactionId,
        requestId: interactionId,
        traceId,
        riskScore,
        riskLevel,
        piiDetected: pii,
        matchedPolicies,
        auditHash: generateHash(),
        hash: generateHash(),
        reason: responseText,
        kernel: {
          firewall: { piiDetected: true, piiTypes: pii, action: 'allow' },
          risk: { score: riskScore, level: riskLevel },
          compliance: { pack: newRequest.compliancePackage, result: 'fail' },
          traceId
        }
      };
    } else {
      const auditEntry = {
        id: interactionId,
        interactionId: interactionId,
        requestId: interactionId,
        trace_id: traceId,
        traceId: traceId,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        user_id: KernelUtils?.getUserId() || 'user_demo',
        userId: KernelUtils?.getUserId() || 'user_demo',
        user_name: KernelUtils?.getUserName() || 'مستخدم تجريبي',
        userName: KernelUtils?.getUserName() || 'مستخدم تجريبي',
        ip_address: "127.0.0.1",
        user_agent: navigator.userAgent,
        request_message: message,
        query: message,
        originalText: message,
        pii_detected: pii.length > 0 ? 1 : 0,
        pii_types: JSON.stringify(pii),
        piiTypes: pii,
        piiDetected: pii,
        firewall_action: "allow",
        masked_message: newRequest.maskedText,
        maskedText: newRequest.maskedText,
        risk_score: riskScore,
        riskScore: riskScore,
        risk_level: riskLevel,
        riskLevel: riskLevel,
        risk_reasons: JSON.stringify(matchedPolicies.map(p => p.name)),
        approval_status: "auto_approved",
        approvalStatus: "auto_approved",
        action: "CHAT_REQUEST",
        actor: KernelUtils?.getUserName() || 'مستخدم تجريبي',
        gemini_response: responseText,
        response: responseText,
        response_model: "Gemini 2.5 Flash",
        response_time_ms: latencyMs,
        compliance_pack: newRequest.compliancePackage,
        compliancePack: newRequest.compliancePackage,
        compliance_flags: "[]",
        previousHash: db.audit.rows[0]?.recordHash || generateHash(),
        recordHash: generateHash(),
        hash: generateHash()
      };
      
      db.audit.rows.unshift(auditEntry);
      db.audit.entries = db.audit.rows;

      result = {
        status: 'completed',
        interactionId,
        requestId: interactionId,
        traceId,
        response: responseText,
        provider: 'gemini',
        model: 'Gemini 2.5 Flash',
        riskScore,
        riskLevel,
        piiDetected: pii,
        matchedPolicies,
        latencyMs,
        auditHash: auditEntry.hash,
        hash: auditEntry.hash,
        kernel: {
          firewall: { piiDetected: pii.length > 0, piiTypes: pii, action: 'allow' },
          risk: { score: riskScore, level: riskLevel },
          compliance: { pack: newRequest.compliancePackage, result: 'pass', flags: [] },
          tokens: { input: 24, output: 48 },
          latencyMs,
          chainHash: auditEntry.hash,
          traceId
        }
      };
    }

    // Add to evidence details
    const evExists = db.evidence.evidence.some(e => e.traceId === traceId);
    if (!evExists) {
      db.evidence.evidence.unshift({
        id: interactionId,
        interactionId,
        requestId: interactionId,
        traceId,
        trace_id: traceId,
        createdAt: new Date().toISOString(),
        preview: message.substring(0, 180),
        status: result.status,
        approvalStatus: result.status,
        riskLevel: result.riskLevel
      });
      db.evidence.rows = db.evidence.evidence;
    }

    db.evidence.details[traceId] = {
      id: interactionId,
      interactionId,
      requestId: interactionId,
      traceId,
      trace_id: traceId,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      request: newRequest.maskedText,
      maskedText: newRequest.maskedText,
      piiTypes: pii,
      piiDetected: pii,
      response: responseText,
      riskScore: riskScore,
      riskLevel: riskLevel,
      approvalStatus: status,
      requestHash: result.hash || generateHash(),
      responseHash: result.hash || generateHash(),
      previousHash: db.audit.rows[1]?.recordHash || generateHash(),
      recordHash: result.hash || generateHash(),
      evidenceHash: result.hash || generateHash(),
      response_model: result.model || 'Demo Mode',
      response_time_ms: latencyMs,
      compliancePack: newRequest.compliancePackage,
      userName: newRequest.userName,
      userId: newRequest.userId
    };
    db.evidence.details[interactionId] = db.evidence.details[traceId];

    recalculateSummaryStats();
    notifyUIUpdated();

    return result;
  }

  // Handle local mock request responses
  function handleMockRequest(url, options) {
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;

    const db = window.kernelDemoState;
    let payload = null;

    if (path.endsWith('/health')) {
      payload = {
        status: "ok",
        provider: { name: "demo", model: "وضع محاكاة النواة (BrightAI Kernel)", configured: false },
        kernel: { database: true, routes: true }
      };
    } else if (path.endsWith('/stats')) {
      payload = db.stats;
    } else if (path.endsWith('/audit')) {
      // Filtering audit logs mock
      const searchQuery = searchParams.get('search') || '';
      let filteredRows = db.audit.rows;
      if (searchQuery) {
        filteredRows = filteredRows.filter(r => 
          (r.query || '').includes(searchQuery) || 
          (r.traceId || '').includes(searchQuery)
        );
      }
      payload = {
        rows: filteredRows,
        entries: filteredRows,
        total: filteredRows.length
      };
    } else if (path.endsWith('/chain') || path.endsWith('/chain/verify')) {
      payload = {
        valid: true,
        brokenAt: null,
        totalRecords: db.audit.rows.length,
        chainStatus: 'VALID',
        chainHash: db.audit.rows[0]?.recordHash || generateHash(),
        totalEntries: db.audit.rows.length,
        entries: db.audit.rows,
        summary: {
          actionTypes: { "BLOCKED": 1, "CHAT_REQUEST": 1, "APPROVAL_REQUESTED": 1 },
          actorCount: 2
        }
      };
    } else if (path.endsWith('/approvals') || path.endsWith('/pending')) {
      if (options && options.method === 'POST') {
        // Approvals Action (Approve / Reject)
        const body = JSON.parse(options.body || '{}');
        const reqId = body.requestId || body.interactionId || body.id;
        const action = body.action;
        const approver = body.approver || 'مدير النظام';

        if (action === 'approve') {
          const index = db.approvals.pending.findIndex(p => p.id === reqId || p.traceId === reqId);
          if (index !== -1) {
            const req = db.approvals.pending.splice(index, 1)[0];
            req.status = 'completed';
            req.approver = approver;
            db.approvals.recent.unshift(req);

            // Add completed chat audit record
            const completedAudit = {
              id: req.id,
              interactionId: req.id,
              requestId: req.id,
              trace_id: req.traceId,
              traceId: req.traceId,
              created_at: new Date().toISOString(),
              timestamp: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              user_id: req.userId,
              userId: req.userId,
              user_name: req.userName,
              userName: req.userName,
              ip_address: "127.0.0.1",
              user_agent: navigator.userAgent,
              request_message: req.query,
              query: req.query,
              originalText: req.query,
              pii_detected: req.piiDetected.length > 0 ? 1 : 0,
              pii_types: JSON.stringify(req.piiDetected),
              piiTypes: req.piiDetected,
              piiDetected: req.piiDetected,
              firewall_action: "allow",
              masked_message: req.maskedText,
              maskedText: req.maskedText,
              risk_score: req.riskScore,
              riskScore: req.riskScore,
              risk_level: req.riskLevel,
              riskLevel: req.riskLevel,
              approval_status: "approved_completed",
              approvalStatus: "approved_completed",
              action: "EXECUTED",
              actor: approver,
              gemini_response: "لقد تم التصريح بهذا الاستعلام بعد المراجعة اليدوية للمشرف والموافقة الطارئة. كافة الحماية مطبقة.",
              response: "لقد تم التصريح بهذا الاستعلام بعد المراجعة اليدوية للمشرف والموافقة الطارئة. كافة الحماية مطبقة.",
              response_model: "Gemini 2.5 Flash",
              response_time_ms: 350,
              compliance_pack: req.compliancePackage,
              compliancePack: req.compliancePackage,
              previousHash: db.audit.rows[0]?.recordHash || generateHash(),
              recordHash: generateHash(),
              hash: generateHash()
            };
            db.audit.rows.unshift(completedAudit);
            db.audit.entries = db.audit.rows;

            // Update evidence
            const evIndex = db.evidence.evidence.findIndex(e => e.id === req.id || e.traceId === req.traceId);
            if (evIndex !== -1) {
              db.evidence.evidence[evIndex].status = 'completed';
              db.evidence.evidence[evIndex].approvalStatus = 'completed';
            }
            db.evidence.details[req.traceId] = {
              ...db.evidence.details[req.traceId],
              response: completedAudit.response,
              approvalStatus: 'completed'
            };
            if (req.id) db.evidence.details[req.id] = db.evidence.details[req.traceId];

            recalculateSummaryStats();
            notifyUIUpdated();
            payload = completedAudit;
          } else {
            payload = { error: 'Request not found', errorCode: 'NOT_FOUND' };
          }
        } else if (action === 'reject') {
          const index = db.approvals.pending.findIndex(p => p.id === reqId || p.traceId === reqId);
          if (index !== -1) {
            const req = db.approvals.pending.splice(index, 1)[0];
            req.status = 'rejected';
            req.approver = approver;
            req.rejectionReason = body.reason || 'تم الرفض لدواعي حماية البيانات';
            db.approvals.recent.unshift(req);

            const rejectedAudit = {
              id: req.id,
              interactionId: req.id,
              requestId: req.id,
              trace_id: req.traceId,
              traceId: req.traceId,
              created_at: new Date().toISOString(),
              timestamp: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              user_id: req.userId,
              userId: req.userId,
              user_name: req.userName,
              userName: req.userName,
              ip_address: "127.0.0.1",
              user_agent: navigator.userAgent,
              request_message: req.query,
              query: req.query,
              originalText: req.query,
              pii_detected: req.piiDetected.length > 0 ? 1 : 0,
              pii_types: JSON.stringify(req.piiDetected),
              piiTypes: req.piiDetected,
              piiDetected: req.piiDetected,
              firewall_action: "allow",
              masked_message: req.maskedText,
              maskedText: req.maskedText,
              risk_score: req.riskScore,
              riskScore: req.riskScore,
              risk_level: req.riskLevel,
              riskLevel: req.riskLevel,
              approval_status: "rejected",
              approvalStatus: "rejected",
              action: "REJECTED",
              actor: approver,
              approval_comment: req.rejectionReason,
              gemini_response: `تم رفض الطلب بواسطة المشرف. السبب: ${req.rejectionReason}`,
              response: `تم رفض الطلب بواسطة المشرف. السبب: ${req.rejectionReason}`,
              response_model: null,
              response_time_ms: 0,
              compliance_pack: req.compliancePackage,
              compliancePack: req.compliancePackage,
              previousHash: db.audit.rows[0]?.recordHash || generateHash(),
              recordHash: generateHash(),
              hash: generateHash()
            };
            db.audit.rows.unshift(rejectedAudit);
            db.audit.entries = db.audit.rows;

            // Update evidence
            const evIndex = db.evidence.evidence.findIndex(e => e.id === req.id || e.traceId === req.traceId);
            if (evIndex !== -1) {
              db.evidence.evidence[evIndex].status = 'rejected';
              db.evidence.evidence[evIndex].approvalStatus = 'rejected';
            }
            db.evidence.details[req.traceId] = {
              ...db.evidence.details[req.traceId],
              response: rejectedAudit.response,
              approvalStatus: 'rejected'
            };
            if (req.id) db.evidence.details[req.id] = db.evidence.details[req.traceId];

            recalculateSummaryStats();
            notifyUIUpdated();
            payload = rejectedAudit;
          } else {
            payload = { error: 'Request not found', errorCode: 'NOT_FOUND' };
          }
        }
      } else {
        payload = db.approvals;
      }
    } else if (path.includes('/evidence/')) {
      const match = path.match(/\/evidence\/([^/]+)/);
      if (match && match[1]) {
        const id = decodeURIComponent(match[1]);
        const record = db.evidence.details[id] || db.evidence.details[id.replace(/\/export$/, '')];
        if (record) {
          payload = buildMockEvidenceFile(record, db, id);
        } else {
          // fallback single lookup
          payload = buildMockEvidenceFile({
            id,
            interactionId: id,
            traceId: id,
            timestamp: new Date().toISOString(),
            request: "طلب تصدير ملفات الأدلة ومراجعة حوكمة BrightAI Kernel",
            response: "هذا السجل آمن ومحفوظ بالكامل عبر سلسلة التدقيق الموثوقة وصناعية بشكل كامل.",
            riskScore: 10,
            riskLevel: "low",
            approvalStatus: "completed",
            requestHash: generateHash(),
            previousHash: generateHash(),
            recordHash: generateHash()
          }, db, id);
        }
      } else {
        payload = db.evidence;
      }
    } else if (path.endsWith('/evidence')) {
      const traceIdParam = searchParams.get('traceId') || searchParams.get('trace_id');
      if (traceIdParam) {
        const detail = db.evidence.details[traceIdParam];
        payload = {
          evidence: detail ? [detail] : [],
          rows: detail ? [detail] : [],
          total: detail ? 1 : 0
        };
      } else {
        payload = db.evidence;
      }
    } else if (path.endsWith('/compliance') || path.endsWith('/compliance/check')) {
      payload = db.compliance;
    } else if (path.endsWith('/chat')) {
      // POST chat simulation
      if (options && options.body) {
        const body = JSON.parse(options.body);
        payload = simulateChat(body.message, body.compliancePack);
      }
    } else {
      payload = { error: 'Not found mock', errorCode: 'MOCK_NOT_FOUND' };
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Language': 'ar-SA'
      }
    });
  }

  // Intercept globally using fetch wrapper
  const originalFetch = window.fetch;
  window.fetch = async function (url, options) {
    const urlStr = String(url);
    const isDemoModeActive = localStorage.getItem('brightai_kernel_demo_mode') === 'true';

    if (urlStr.includes('/api/kernel')) {
      if (isDemoModeActive) {
        await ensureDBInitialized();
        return handleMockRequest(urlStr, options);
      }

      // If live mode is selected but connection fails, fallback to demo mode gracefully
      try {
        const response = await originalFetch(url, options);
        if (!response.ok && (response.status >= 500 || response.status === 404)) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response;
      } catch (err) {
        console.warn("[BrightAI Kernel] Backend failed or down. Activating offline Demo Mode...", err);
        localStorage.setItem('brightai_kernel_demo_mode', 'true');
        window.kernelDemoModeActive = true;
        updateBannerUI();
        await ensureDBInitialized();
        return handleMockRequest(urlStr, options);
      }
    }

    return originalFetch(url, options);
  };

  // Dispatch unified custom events and call global UI components directly
  function notifyUIUpdated() {
    // Save state back to localStorage
    if (window.kernelDemoState) {
      localStorage.setItem('brightai_kernel_mock_db', JSON.stringify(window.kernelDemoState));
    }

    const event = new CustomEvent('kernel-demo-update', {
      detail: window.kernelDemoState
    });
    window.dispatchEvent(event);

    // Coordinate with approvals.html inline methods
    if (typeof window.loadApprovals === 'function') {
      window.loadApprovals();
    }
    // Coordinate with stats and dashboard
    if (global.KernelStats && typeof global.KernelStats.loadStats === 'function') {
      global.KernelStats.loadStats();
    }
    // Direct DOM updater for stats cards
    updateStatsDOMDirectly();
  }

  // Instant DOM updater to guarantee zero lag or visual skeletons
  function updateStatsDOMDirectly() {
    if (!window.kernelDemoState) return;
    const stats = normalizeStats(window.kernelDemoState.stats);
    const summary = window.kernelDemoState.approvals.summary;

    const totalEl = document.getElementById('stat-total');
    const pendingEl = document.getElementById('stat-pending');
    const riskEl = document.getElementById('stat-risk');
    const piiEl = document.getElementById('stat-pii');

    const fmt = (num) => new Intl.NumberFormat('ar-SA').format(num);

    if (totalEl) totalEl.textContent = fmt(stats.totalRequests);
    if (pendingEl) pendingEl.textContent = fmt(stats.pendingApproval);
    if (riskEl) riskEl.textContent = `${Math.round(stats.avgRisk)}%`;
    if (piiEl) piiEl.textContent = `${Math.round(stats.piiDetectionRate)}%`;

    // Approvals page stats
    const aprPending = document.getElementById('stat-pending');
    const aprCritical = document.getElementById('stat-critical');
    const aprHigh = document.getElementById('stat-high');
    const aprCompleted = document.getElementById('stat-completed');

    if (aprPending && summary) aprPending.textContent = fmt(summary.totalPending);
    if (aprCritical && summary) aprCritical.textContent = fmt(summary.criticalCount);
    if (aprHigh && summary) aprHigh.textContent = fmt(summary.highCount);
    if (aprCompleted && summary) aprCompleted.textContent = fmt(summary.completedToday);

    const refreshEl = document.getElementById('last-update');
    if (refreshEl) refreshEl.textContent = new Date().toLocaleTimeString('ar-SA');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Live Feed Simulation (8 Seconds Interval)
  // ═══════════════════════════════════════════════════════════════════════════

  const poolOfSimulatedRequests = [
    {
      query: "طلب تعديل سجل المشتريات والضمان للشركة السعودية للكهرباء للربع الثاني بقيمة 12,000,000 ريال",
      masked: "طلب تعديل سجل المشتريات والضمان للشركة السعودية للكهرباء للربع الثاني بقيمة 12,000,000 ريال",
      riskScore: 12,
      riskLevel: "minimal",
      status: "completed",
      response: "تم استلام الطلب وتمريره بنجاح. البنود مطابقة للمواصفات السعودية ولا تحتوي على أي بيانات حساسة.",
      compliancePack: "procurement"
    },
    {
      query: "استبيان الموظفين الجديد ويحتوي على أرقام الهوية الوطنية 1098485721 والعناوين السكنية الخاصة بهم بمصرف الراجحي",
      masked: "استبيان الموظفين الجديد ويحتوي على أرقام الهوية الوطنية [SAUDI_ID] والعناوين السكنية الخاصة بهم بمصرف الراجحي",
      riskScore: 100,
      riskLevel: "critical",
      status: "blocked",
      response: "تم حظر العملية آلياً. يمنع إرسال الهويات الوطنية الخاصة بالموظفين بدون تشفير لحماية الخصوصية بموجب PDPL.",
      compliancePack: "pdpl",
      pii: ["saudi_id"]
    },
    {
      query: "استعلام فوري لوزارة الصحة عن قائمة المرضى وحسابات الآيبان SA9910000000123456789012 لدفع مستحقات الضمان الاجتماعي",
      masked: "استعلام فوري لوزارة الصحة عن قائمة المرضى وحسابات الآيبان [SAUDI_IBAN] لدفع مستحقات الضمان الاجتماعي",
      riskScore: 85,
      riskLevel: "high",
      status: "pending",
      response: null,
      compliancePack: "healthcare",
      pii: ["saudi_iban"]
    },
    {
      query: "صياغة عقد التفاهم وشروط العمل المشترك مع أرامكو السعودية لتطوير حقول الغاز الطبيعي بدون تسريب أسرار صناعية",
      masked: "صياغة عقد التفاهم وشروط العمل المشترك مع أرامكو السعودية لتطوير حقول الغاز الطبيعي بدون تسريب أسرار صناعية",
      riskScore: 18,
      riskLevel: "low",
      status: "completed",
      response: "تمت صياغة بنود العقد. كافة المعايير تتطابق مع دليل الأمان الفني والسلامة المهنية المعتمد.",
      compliancePack: "nca_ecc"
    }
  ];

  let liveFeedTimer = null;

  function startLiveFeedSimulator() {
    if (liveFeedTimer) clearInterval(liveFeedTimer);

    liveFeedTimer = setInterval(async () => {
      // Don't inject if demo mode is disabled
      if (localStorage.getItem('brightai_kernel_demo_mode') !== 'true') return;

      // Don't inject if user is currently interacting (e.g. prompt or alert open, or buttons active)
      if (document.querySelector('.btn-loading') || document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      await ensureDBInitialized();
      const db = window.kernelDemoState;

      const randomTemplate = poolOfSimulatedRequests[Math.floor(Math.random() * poolOfSimulatedRequests.length)];
      const traceId = `AI-2026-${String(10000 + Math.floor(Math.random() * 90000))}`;
      const interactionId = `ki_${String(10000 + Math.floor(Math.random() * 90000))}`;

      const newRecord = {
        id: interactionId,
        interactionId: interactionId,
        requestId: interactionId,
        trace_id: traceId,
        traceId: traceId,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        query: randomTemplate.query,
        maskedText: randomTemplate.masked,
        compliancePackage: randomTemplate.compliancePack,
        userName: ["أحمد الحربي", "نوف السديري", "خالد القحطاني", "مريم الدوسري"][Math.floor(Math.random() * 4)],
        userId: `user_saudi_sim_${Math.floor(Math.random() * 100)}`,
        riskScore: randomTemplate.riskScore,
        riskLevel: randomTemplate.riskLevel,
        piiDetected: randomTemplate.pii || [],
        matchedPolicies: randomTemplate.pii ? [{"name": "حماية وحجب البيانات الحساسة للمؤسسة"}] : []
      };

      if (randomTemplate.status === 'blocked') {
        // add directly to audit log
        const auditEntry = {
          ...newRecord,
          created_at: newRecord.createdAt,
          approvalStatus: 'blocked',
          action: 'BLOCKED',
          actor: 'system',
          gemini_response: randomTemplate.response,
          response: randomTemplate.response,
          previousHash: db.audit.rows[0]?.recordHash || generateHash(),
          recordHash: generateHash(),
          hash: generateHash()
        };
        db.audit.rows.unshift(auditEntry);
      } else if (randomTemplate.status === 'pending') {
        // add to pending approvals
        db.approvals.pending.unshift(newRecord);
      } else {
        // auto-approved completed
        const completedAudit = {
          ...newRecord,
          created_at: newRecord.createdAt,
          approvalStatus: 'auto_approved',
          action: 'CHAT_REQUEST',
          actor: newRecord.userName,
          gemini_response: randomTemplate.response,
          response: randomTemplate.response,
          previousHash: db.audit.rows[0]?.recordHash || generateHash(),
          recordHash: generateHash(),
          hash: generateHash()
        };
        db.audit.rows.unshift(completedAudit);
      }

      // Add to evidence details
      db.evidence.evidence.unshift({
        id: interactionId,
        interactionId,
        requestId: interactionId,
        traceId,
        trace_id: traceId,
        createdAt: new Date().toISOString(),
        preview: randomTemplate.query.substring(0, 180),
        status: randomTemplate.status,
        approvalStatus: randomTemplate.status,
        riskLevel: randomTemplate.riskLevel
      });
      db.evidence.rows = db.evidence.evidence;

      db.evidence.details[traceId] = {
        id: interactionId,
        interactionId,
        requestId: interactionId,
        traceId,
        trace_id: traceId,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        request: randomTemplate.query,
        response: randomTemplate.response || "بانتظار موافقة مشرف الحوكمة قبل الإرسال.",
        riskScore: randomTemplate.riskScore,
        riskLevel: randomTemplate.riskLevel,
        approvalStatus: randomTemplate.status,
        requestHash: generateHash(),
        previousHash: db.audit.rows[1]?.recordHash || generateHash(),
        recordHash: generateHash()
      };
      db.evidence.details[interactionId] = db.evidence.details[traceId];

      recalculateSummaryStats();
      notifyUIUpdated();

      // Show temporary smart notification bubble in corner if on approvals page
      if (pathNameContains('approvals') && randomTemplate.status === 'pending') {
        showToastNotification("طلب حوكمة جديد", `استقبل النظام طلب عالي المخاطر لـ ${newRecord.userName}.`);
      }
    }, 8000);
  }

  function pathNameContains(str) {
    return window.location.pathname.toLowerCase().includes(str);
  }

  function showToastNotification(title, message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast info';
    toast.style.animation = 'fadeSlideUp 300ms ease-out';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
      <div class="toast-content">
        <div class="toast-title">${KernelUtils?.escapeHtml(title) || title}</div>
        <div class="toast-message">${KernelUtils?.escapeHtml(message) || message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 5000);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Elegant Demo Banner & Toggle Control UI
  // ═══════════════════════════════════════════════════════════════════════════

  function injectBannerStyles() {
    const css = `
      .brightai-demo-banner {
        background: linear-gradient(135deg, #0b1329 0%, #152244 100%);
        border-bottom: 2px solid #eab308;
        padding: 0.625rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        color: #f8fafc;
        font-family: 'IBM Plex Sans Arabic', sans-serif;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        position: relative;
        z-index: 99999;
      }
      .brightai-demo-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9375rem;
        font-weight: 700;
      }
      .brightai-demo-badge {
        background: rgba(234, 179, 8, 0.12);
        border: 1px solid #eab308;
        color: #eab308;
        padding: 0.125rem 0.625rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }
      .brightai-demo-pulse {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #eab308;
        animation: brightai-pulse 1.5s infinite;
      }
      .brightai-demo-text {
        font-size: 0.875rem;
        color: #94a3b8;
      }
      .brightai-demo-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .brightai-demo-toggle-wrap {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255,255,255,0.05);
        padding: 0.25rem 0.75rem;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .brightai-demo-label {
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
      }
      .brightai-demo-switch {
        position: relative;
        display: inline-block;
        width: 38px;
        height: 20px;
      }
      .brightai-demo-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .brightai-demo-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #475569;
        transition: .3s;
        border-radius: 20px;
      }
      .brightai-demo-slider:before {
        position: absolute;
        content: "";
        height: 14px; width: 14px;
        left: 3px; bottom: 3px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
      }
      input:checked + .brightai-demo-slider {
        background-color: #eab308;
      }
      input:checked + .brightai-demo-slider:before {
        transform: translateX(18px);
      }
      .brightai-demo-btn {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        color: #f8fafc;
        padding: 0.375rem 0.875rem;
        border-radius: 6px;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .brightai-demo-btn:hover {
        background: rgba(255,255,255,0.15);
        border-color: rgba(255,255,255,0.3);
      }
      @keyframes brightai-pulse {
        0% { transform: scale(0.9); opacity: 0.6; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(0.9); opacity: 0.6; }
      }
      @media (max-width: 768px) {
        .brightai-demo-banner {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .brightai-demo-actions {
          width: 100%;
          justify-content: space-between;
        }
      }
    `;
    const style = document.createElement('style');
    style.id = 'brightai-demo-banner-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectBannerUI() {
    if (document.getElementById('brightai-demo-banner-ui')) return;

    const banner = document.createElement('div');
    banner.id = 'brightai-demo-banner-ui';
    banner.className = 'brightai-demo-banner';

    const isDemo = localStorage.getItem('brightai_kernel_demo_mode') === 'true';

    banner.innerHTML = `
      <div class="brightai-demo-brand">
        <span class="brightai-demo-badge">
          <span class="brightai-demo-pulse"></span>
          وضع المحاكاة
        </span>
        <span class="brightai-demo-text">عرض تجريبي تفاعلي — بيانات سعودية صناعية ومحمية بالكامل</span>
      </div>
      <div class="brightai-demo-actions">
        <div class="brightai-demo-toggle-wrap">
          <span class="brightai-demo-label" id="brightai-demo-mode-label">وضع المحاكاة</span>
          <label class="brightai-demo-switch">
            <input type="checkbox" id="brightai-demo-toggle-checkbox" ${isDemo ? 'checked' : ''}>
            <span class="brightai-demo-slider"></span>
          </label>
        </div>
        <button class="brightai-demo-btn" id="brightai-demo-reset-btn">إعادة تعيين البيانات</button>
      </div>
    `;

    // Inject as the first child of the body element to display at top
    if (document.body) {
      document.body.insertBefore(banner, document.body.firstChild);
    }

    // Attach control listeners
    document.getElementById('brightai-demo-toggle-checkbox')?.addEventListener('change', (e) => {
      const active = e.target.checked;
      localStorage.setItem('brightai_kernel_demo_mode', active ? 'true' : 'false');
      window.location.reload();
    });

    document.getElementById('brightai-demo-reset-btn')?.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من إعادة تعيين كافة البيانات التجريبية لحالتها الأصلية؟')) {
        localStorage.removeItem('brightai_kernel_mock_db');
        window.location.reload();
      }
    });
  }

  function updateBannerUI() {
    const checkbox = document.getElementById('brightai-demo-toggle-checkbox');
    if (checkbox) {
      checkbox.checked = localStorage.getItem('brightai_kernel_demo_mode') === 'true';
    }
  }

  // Auto initialize on DOM Load
  document.addEventListener('DOMContentLoaded', async () => {
    injectBannerStyles();
    injectBannerUI();
    
    const isDemo = localStorage.getItem('brightai_kernel_demo_mode') === 'true';
    if (isDemo) {
      await ensureDBInitialized();
      updateStatsDOMDirectly();
      startLiveFeedSimulator();
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Unified KernelAPI Mock Logic
  // ═══════════════════════════════════════════════════════════════════════════

  class KernelAPI {
    constructor() {
      this.baseURL = '/api/kernel';
      this.timeout = 30000;
      this.retryAttempts = 3;
      this.retryDelays = [500, 1000, 2000];
    }

    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'x-kernel-user-id': KernelUtils?.getUserId() || 'anonymous',
        'x-kernel-user-name': KernelUtils?.getUserName() || 'مستخدم',
        ...(options.headers || {}),
      };

      // Always calls window.fetch which will be intercepted smoothly
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new APIError(`HTTP ${response.status}`, response.status);
      }

      return await response.json();
    }

    async health() {
      return this.request('/health');
    }

    async getProviderStatus() {
      try {
        const health = await this.health();
        return {
          status: health.status,
          provider: health.provider?.name || 'demo',
          model: health.provider?.model || 'Demo Mode',
          configured: health.provider?.configured || false,
        };
      } catch (error) {
        return {
          status: 'error',
          provider: 'demo',
          model: 'Demo Mode',
          configured: false,
        };
      }
    }

    async chat(query, context = '', compliancePackage = 'general') {
      return this.request('/chat', {
        method: 'POST',
        body: {
          message: query,
          compliancePack: compliancePackage,
          metadata: { context },
        },
      }).then((data) => this.normalizeKernelRecord(data));
    }

    async getStats() {
      return this.request('/stats').then((data) => normalizeStats(data));
    }

    async getAuditLog(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/audit${queryString ? '?' + queryString : ''}`).then((data) => {
        if (Array.isArray(data.rows)) data.rows = data.rows.map((row) => this.normalizeKernelRecord(row));
        if (Array.isArray(data.entries)) data.entries = data.entries.map((row) => this.normalizeKernelRecord(row));
        return data;
      });
    }

    async getChain() {
      return this.request('/chain').then((data) => {
        if (Array.isArray(data.entries)) data.entries = data.entries.map((row) => this.normalizeKernelRecord(row));
        return data;
      });
    }

    async getAuditChain() {
      return this.getChain();
    }

    async verifyChain() {
      return this.request('/chain/verify', { method: 'POST' });
    }

    async getPendingApprovals() {
      return this.request('/approvals').then((data) => {
        if (Array.isArray(data.pending)) data.pending = data.pending.map((row) => this.normalizeKernelRecord(row));
        if (Array.isArray(data.recent)) data.recent = data.recent.map((row) => this.normalizeKernelRecord(row));
        return data;
      });
    }

    async getPendingCount() {
      try {
        const data = await this.getPendingApprovals();
        return data.summary?.totalPending || 0;
      } catch (error) {
        return 0;
      }
    }

    async approveRequest(requestId, approver) {
      return this.request('/approvals', {
        method: 'POST',
        body: {
          requestId,
          interactionId: requestId,
          traceId: this.extractTraceId({ traceId: requestId }) || undefined,
          action: 'approve',
          approver,
        },
      }).then((data) => this.normalizeKernelRecord(data));
    }

    async rejectRequest(requestId, approver, reason = '') {
      return this.request('/approvals', {
        method: 'POST',
        body: {
          requestId,
          interactionId: requestId,
          traceId: this.extractTraceId({ traceId: requestId }) || undefined,
          action: 'reject',
          approver,
          reason,
        },
      }).then((data) => this.normalizeKernelRecord(data));
    }

    async getEvidence(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/evidence${queryString ? '?' + queryString : ''}`).then((data) => {
        if (Array.isArray(data.evidence)) data.evidence = data.evidence.map((row) => this.normalizeKernelRecord(row));
        if (Array.isArray(data.rows)) data.rows = data.rows.map((row) => this.normalizeKernelRecord(row));
        return data;
      });
    }

    async getEvidenceById(requestId) {
      return this.request(`/evidence/${encodeURIComponent(requestId)}`).then((data) => this.normalizeKernelRecord(data));
    }

    async exportEvidence(requestId) {
      return this.request(`/evidence/${encodeURIComponent(requestId)}/export`).then((data) => this.normalizeKernelRecord(data));
    }

    extractTraceId(record = {}) {
      const value = record.traceId || record.trace_id || record.kernel?.traceId || record.metadata?.traceId || record.summary?.traceId;
      return /^AI-\d{4}-\d{5,}$/.test(String(value || '')) ? String(value) : null;
    }

    normalizeKernelRecord(record = {}) {
      if (!record || typeof record !== 'object') return record;
      const interactionId = record.interactionId || record.interaction_id || record.id || record.requestId || record.request_id || null;
      const traceId = this.extractTraceId(record);
      return {
        ...record,
        interactionId,
        traceId,
        trace_id: traceId,
        requestId: interactionId,
      };
    }

    traceLink(traceId, page = 'evidence') {
      const safeTrace = encodeURIComponent(traceId || '');
      const target = page.endsWith('.html') ? page : `${page}.html`;
      return `/kernel/${target}?trace_id=${safeTrace}`;
    }
  }

  class APIError extends Error {
    constructor(message, status, data = {}) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.data = data;
    }
  }

  const kernelAPI = new KernelAPI();

  global.KernelAPI = KernelAPI;
  global.kernelAPI = kernelAPI;
  global.APIError = APIError;
  global.normalizeStats = normalizeStats;

})(typeof window !== 'undefined' ? window : this);
