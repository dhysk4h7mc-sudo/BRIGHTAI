/**
 * Kernel Data Layer — Phase 9
 * TypeScript interfaces, SEO metadata, demo data, and cross-linking network
 * for all 11 kernel pages. Every number is a demo label marked "بيانات توضيحية".
 */

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface KernelUnit {
  slug: string;
  path: string;
  label: string;
  shortDescription: string;
  title: string;
  description: string;
  canonical: string;
  h1: string;
  hreflang: { lang: string; href: string }[];
  ogImage: string;
  solutionSlug: string | null;
  docSlug: string;
  iconSvg: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
  demo: boolean;
}

export interface ActivityEvent {
  type: string;
  label: string;
  description: string;
  riskLevel: 'minimal' | 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  demo: boolean;
}

export interface ComplianceFramework {
  name: string;
  nameAr: string;
  score: number;
  maxScore: number;
  status: 'active' | 'partial' | 'not-started';
  description: string;
  demo: boolean;
}

export interface EvidenceRecord {
  id: string;
  traceId: string;
  query: string;
  status: string;
  riskLevel: string;
  riskScore: number;
  createdAt: string;
  hash: string;
  demo: boolean;
}

// ── SVG Icons (inline, no external dependency) ─────────────────────────────

const icons = {
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
  audit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
  approvals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  connectors: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
  scenarios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  policies: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"/></svg>',
  evidence: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  compliance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>',
  kernel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
};

// ── Kernel Units Data ───────────────────────────────────────────────────────

export const kernelUnits: KernelUnit[] = [
  {
    slug: 'index',
    path: '/kernel/',
    label: 'الفهرس',
    shortDescription: 'نظرة عامة على Kernel ولوحة التشغيل',
    title: 'منصة حوكمة الذكاء الاصطناعي للمنشآت | BrightAI Kernel',
    description: 'شغّل حوكمة الذكاء الاصطناعي في منشأتك من لوحة مركزية تجمع السياسات والموافقات والأدلة والرقابة، وتمنح فرق العمل رؤية تنفيذية موحدة.',
    canonical: 'https://brightai.site/kernel/',
    h1: 'غرفة تشغيل حوكمة الذكاء الاصطناعي — راقب كل شي من مكان واحد',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'ai-governance-platform',
    docSlug: 'kernel-architecture',
    iconSvg: icons.kernel,
  },
  {
    slug: 'chat',
    path: '/kernel/chat/',
    label: 'المحادثة',
    shortDescription: 'محادثة ذكاء اصطناعي آمنة بضوابط الحوكمة',
    title: 'محادثة ذكاء اصطناعي آمنة بضوابط الحوكمة | BrightAI',
    description: 'وفّر لفرقك محادثة ذكاء اصطناعي آمنة تطبّق سياسات الحوكمة، وتحمي البيانات الحساسة، وتوثّق كل تفاعل بسجل تدقيق كامل.',
    canonical: 'https://brightai.site/kernel/chat/',
    h1: 'المحادثة الآمنة',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/chat/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/chat/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'ai-firewall',
    docSlug: 'kernel-chat',
    iconSvg: icons.chat,
  },
  {
    slug: 'audit',
    path: '/kernel/audit/',
    label: 'التدقيق',
    shortDescription: 'سجل تدقيق الذكاء الاصطناعي وتتبع القرارات',
    title: 'سجل تدقيق الذكاء الاصطناعي وتتبع القرارات | BrightAI',
    description: 'تتبّع أحداث الذكاء الاصطناعي في سجل تدقيق زمني يوضح الطلبات والقرارات والتغييرات، ويسهّل التحقيق الداخلي والتحقق من المساءلة.',
    canonical: 'https://brightai.site/kernel/audit/',
    h1: 'سجل التدقيق',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/audit/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/audit/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'ai-audit-trail',
    docSlug: 'kernel-audit-trail',
    iconSvg: icons.audit,
  },
  {
    slug: 'approvals',
    path: '/kernel/approvals/',
    label: 'الموافقات',
    shortDescription: 'الموافقات البشرية على قرارات الذكاء الاصطناعي',
    title: 'الموافقات البشرية على قرارات الذكاء الاصطناعي | BrightAI',
    description: 'أدر الموافقات البشرية على قرارات الذكاء الاصطناعي، وراجع مستوى المخاطر والسياق قبل التنفيذ، مع سجل كامل للقرارات.',
    canonical: 'https://brightai.site/kernel/approvals/',
    h1: 'مراجعة الحوكمة',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/approvals/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/approvals/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'human-approval-layer',
    docSlug: 'kernel-approvals',
    iconSvg: icons.approvals,
  },
  {
    slug: 'stats',
    path: '/kernel/stats/',
    label: 'الإحصائيات',
    shortDescription: 'مؤشرات وإحصائيات استخدام الذكاء الاصطناعي',
    title: 'مؤشرات وإحصائيات استخدام الذكاء الاصطناعي | BrightAI',
    description: 'تابع مؤشرات استخدام الذكاء الاصطناعي ومعدلات المخاطر والموافقات والامتثال، واكشف الاتجاهات مبكراً.',
    canonical: 'https://brightai.site/kernel/stats/',
    h1: 'مؤشرات وإحصائيات استخدام الذكاء الاصطناعي — تابع الأداء والمخاطر',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/stats/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/stats/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'continuous-ai-governance',
    docSlug: 'kernel-stats',
    iconSvg: icons.stats,
  },
  {
    slug: 'connectors',
    path: '/kernel/connectors/',
    label: 'الموصلات',
    shortDescription: 'موصلات الذكاء الاصطناعي للأنظمة المؤسسية',
    title: 'موصلات الذكاء الاصطناعي للأنظمة المؤسسية | BrightAI',
    description: 'اربط بوابة الذكاء الاصطناعي بأنظمة المؤسسة ومصادر البيانات عبر موصلات محكومة، مع فحص تلقائي وتوثيق كل اتصال.',
    canonical: 'https://brightai.site/kernel/connectors/',
    h1: 'الموصلات',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/connectors/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/connectors/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'ai-governance-platform',
    docSlug: 'kernel-connectors',
    iconSvg: icons.connectors,
  },
  {
    slug: 'scenarios',
    path: '/kernel/scenarios/',
    label: 'السيناريوهات',
    shortDescription: 'اختبار سيناريوهات ومخاطر الذكاء الاصطناعي',
    title: 'اختبار سيناريوهات ومخاطر الذكاء الاصطناعي | BrightAI',
    description: 'اختبر سيناريوهات استخدام الذكاء الاصطناعي قبل التشغيل، وقارن مستويات المخاطر والاستجابات لتجهيز فرق الحوكمة.',
    canonical: 'https://brightai.site/kernel/scenarios/',
    h1: 'السيناريوهات',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/scenarios/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/scenarios/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'ai-risk-classification',
    docSlug: 'kernel-scenarios',
    iconSvg: icons.scenarios,
  },
  {
    slug: 'policies',
    path: '/kernel/policies/',
    label: 'السياسات',
    shortDescription: 'محرر سياسات الذكاء الاصطناعي البصري',
    title: 'محرر سياسات الذكاء الاصطناعي البصري | BrightAI',
    description: 'صمّم سياسات الذكاء الاصطناعي في محرر بصري يحدد الشروط والإجراءات والضوابط، ثم فعّلها فوراً عبر سير العمل.',
    canonical: 'https://brightai.site/kernel/policies/',
    h1: 'محرر السياسات البصري',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/policies/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/policies/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'ai-firewall',
    docSlug: 'kernel-policies',
    iconSvg: icons.policies,
  },
  {
    slug: 'evidence',
    path: '/kernel/evidence/',
    label: 'الأدلة',
    shortDescription: 'ملف أدلة امتثال الذكاء الاصطناعي',
    title: 'ملف أدلة امتثال الذكاء الاصطناعي | BrightAI Kernel',
    description: 'أنشئ ملف أدلة امتثال لكل قرار ذكاء اصطناعي، واجمع السجلات والموافقات والسياسات المرتبطة في ملف واحد.',
    canonical: 'https://brightai.site/kernel/evidence/',
    h1: 'الأدلة',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/evidence/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/evidence/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'ai-evidence-file',
    docSlug: 'kernel-evidence',
    iconSvg: icons.evidence,
  },
  {
    slug: 'compliance',
    path: '/kernel/compliance/',
    label: 'الامتثال',
    shortDescription: 'إدارة امتثال الذكاء الاصطناعي والضوابط',
    title: 'إدارة امتثال الذكاء الاصطناعي والضوابط | BrightAI',
    description: 'راقب امتثال أنظمة الذكاء الاصطناعي للأطر التنظيمية، واربط كل متطلب بالضوابط والسجلات ذات الصلة.',
    canonical: 'https://brightai.site/kernel/compliance/',
    h1: 'الامتثال',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/compliance/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/compliance/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'continuous-ai-governance',
    docSlug: 'kernel-compliance',
    iconSvg: icons.compliance,
  },
  {
    slug: 'reports',
    path: '/kernel/reports/',
    label: 'التقارير',
    shortDescription: 'تقارير حوكمة الذكاء الاصطناعي التنفيذية',
    title: 'تقارير حوكمة الذكاء الاصطناعي التنفيذية | BrightAI',
    description: 'أنشئ تقارير حوكمة الذكاء الاصطناعي للإدارة وفرق الامتثال، واعرض اتجاهات المخاطر والامتثال والقرارات في تقرير واحد.',
    canonical: 'https://brightai.site/kernel/reports/',
    h1: 'التقارير',
    hreflang: [
      { lang: 'ar-SA', href: 'https://brightai.site/kernel/reports/' },
      { lang: 'x-default', href: 'https://brightai.site/kernel/reports/' },
    ],
    ogImage: '/images/og/brightai-og-1200x630.png',
    solutionSlug: 'ai-audit-trail',
    docSlug: 'kernel-reports',
    iconSvg: icons.reports,
  },
];

// ── Navigation items (all units except index) ───────────────────────────────

export const kernelNavItems = kernelUnits.filter(u => u.slug !== 'index');

// ── Helper: get unit by slug ────────────────────────────────────────────────

export function getKernelUnit(slug: string): KernelUnit | undefined {
  return kernelUnits.find(u => u.slug === slug);
}

// ── Cross-linking: kernel ↔ solution ↔ doc ─────────────────────────────────

export function getCrossLinks(unit: KernelUnit) {
  const solutionPath = unit.solutionSlug ? `/solutions/${unit.solutionSlug}/` : null;
  const docPath = `/docs/${unit.docSlug}/`;
  return { solutionPath, docPath };
}

// ── Demo Data: LiveDashboardMockup ──────────────────────────────────────────

export const dashboardMetrics: DashboardMetric[] = [
  { label: 'إجمالي الطلبات', value: '١٬٢٤٧', trend: 'من سجل Kernel', demo: true },
  { label: 'بانتظار الموافقة', value: '١٨', trend: 'تحتاج قرار بشري', demo: true },
  { label: 'متوسط المخاطر', value: '٢٣٪', trend: 'درجة تشغيلية تراكمية', demo: true },
  { label: 'كشف PII', value: '٤٫٢٪', trend: 'من الطلبات المفحوصة', demo: true },
];

// ── Demo Data: ActivityStream ───────────────────────────────────────────────

export const activityEvents: ActivityEvent[] = [
  {
    type: 'policy_checked',
    label: 'فحص السياسة',
    description: 'تم فحص الطلب مقابل سياسة حماية البيانات الشخصية — النتيجة: متوافق',
    riskLevel: 'low',
    timestamp: '٢٠٢٦/٠٦/١١ ١٨:١٥',
    demo: true,
  },
  {
    type: 'risk_score_assigned',
    label: 'تقييم المخاطر',
    description: 'تم احتساب درجة مخاطر ٤٥/١٠٠ — تصنيف: متوسط — طلب مراجعة إضافية',
    riskLevel: 'medium',
    timestamp: '٢٠٢٦/٠٦/١١ ١٨:١٤',
    demo: true,
  },
  {
    type: 'approval_requested',
    label: 'طلب موافقة',
    description: 'طلب موافقة بشرية بسبب محتوى مالي حساس — الحالة: بانتظار المراجعة',
    riskLevel: 'high',
    timestamp: '٢٠٢٦/٠٦/١١ ١٨:١٢',
    demo: true,
  },
  {
    type: 'evidence_generated',
    label: 'توليد الدليل',
    description: 'تم إنشاء ملف دليل AI-2026-00042 — يشمل السجل والموافقات والسياسات',
    riskLevel: 'minimal',
    timestamp: '٢٠٢٦/٠٦/١١ ١٨:١٠',
    demo: true,
  },
  {
    type: 'pdpl_mapped',
    label: 'ربط PDPL',
    description: 'تم ربط الطلب بالمادة ١٢ من نظام حماية البيانات الشخصية — لا يتطلب إجراء إضافي',
    riskLevel: 'low',
    timestamp: '٢٠٢٦/٠٦/١١ ١٨:٠٨',
    demo: true,
  },
];

// ── Demo Data: ComplianceRadar ──────────────────────────────────────────────

export const complianceFrameworks: ComplianceFramework[] = [
  {
    name: 'PDPL',
    nameAr: 'نظام حماية البيانات الشخصية',
    score: 78,
    maxScore: 100,
    status: 'active',
    description: 'يدعم مواءمة ضوابط حماية البيانات الشخصية وفق نظام PDPL السعودي',
    demo: true,
  },
  {
    name: 'NCA ECC',
    nameAr: 'ضوابط الأمن السيبراني',
    score: 65,
    maxScore: 100,
    status: 'active',
    description: 'يدعم مواءمة متطلبات الضوابط الأساسية للأمن السيبراني من الهيئة الوطنية للأمن السيبراني',
    demo: true,
  },
  {
    name: 'SDAIA',
    nameAr: 'إرشادات الذكاء الاصطناعي التوليدي',
    score: 72,
    maxScore: 100,
    status: 'active',
    description: 'يدعم مواءمة إرشادات هيئة البيانات والذكاء الاصطناعي لاستخدام الذكاء الاصطناعي التوليدي',
    demo: true,
  },
  {
    name: 'SFDA',
    nameAr: 'متطلبات الغذاء والدواء',
    score: 45,
    maxScore: 100,
    status: 'partial',
    description: 'يدعم مواءمة متطلبات الهيئة العامة للغذاء والدواء لتطبيقات الذكاء الاصطناعي في القطاع الصحي',
    demo: true,
  },
  {
    name: 'ISO 27001',
    nameAr: 'إدارة أمن المعلومات',
    score: 82,
    maxScore: 100,
    status: 'active',
    description: 'يدعم مواءمة متطلبات أمن المعلومات وفق معيار ISO/IEC 27001',
    demo: true,
  },
  {
    name: 'ISO 42001',
    nameAr: 'نظام إدارة الذكاء الاصطناعي',
    score: 58,
    maxScore: 100,
    status: 'partial',
    description: 'يدعم مواءمة متطلبات نظام إدارة الذكاء الاصطناعي وفق معيار ISO/IEC 42001',
    demo: true,
  },
];

// ── Demo Data: EvidenceFileMockup ───────────────────────────────────────────

export const evidenceRecords: EvidenceRecord[] = [
  {
    id: 'EV-2026-00042',
    traceId: 'AI-2026-00042',
    query: 'تحليل تقرير مالي ربع سنوي',
    status: 'موافق عليه',
    riskLevel: 'medium',
    riskScore: 45,
    createdAt: '٢٠٢٦/٠٦/١١ ١٨:١٠',
    hash: 'sha256:a3f7c2...e8d1b4',
    demo: true,
  },
  {
    id: 'EV-2026-00041',
    traceId: 'AI-2026-00041',
    query: 'تلخيص بيانات مريض',
    status: 'محظور',
    riskLevel: 'critical',
    riskScore: 92,
    createdAt: '٢٠٢٦/٠٦/١١ ١٧:٤٥',
    hash: 'sha256:b1d9e4...f2c6a8',
    demo: true,
  },
  {
    id: 'EV-2026-00040',
    traceId: 'AI-2026-00040',
    query: 'ترجمة عقد مورد',
    status: 'موافق عليه تلقائياً',
    riskLevel: 'low',
    riskScore: 12,
    createdAt: '٢٠٢٦/٠٦/١١ ١٧:٣٠',
    hash: 'sha256:c4e8a1...d7b3f5',
    demo: true,
  },
  {
    id: 'EV-2026-00039',
    traceId: 'AI-2026-00039',
    query: 'توليد تقرير امتثال',
    status: 'بانتظار الموافقة',
    riskLevel: 'high',
    riskScore: 68,
    createdAt: '٢٠٢٦/٠٦/١١ ١٧:١٥',
    hash: 'sha256:d2f5b3...a9c1e7',
    demo: true,
  },
];

// ── Risk level CSS class helper ─────────────────────────────────────────────

export function riskLevelClass(level: string): string {
  const map: Record<string, string> = {
    minimal: 'k-risk--minimal',
    low: 'k-risk--low',
    medium: 'k-risk--medium',
    high: 'k-risk--high',
    critical: 'k-risk--critical',
  };
  return map[level] || 'k-risk--minimal';
}

export function riskLevelLabel(level: string): string {
  const map: Record<string, string> = {
    minimal: 'ضئيل',
    low: 'منخفض',
    medium: 'متوسط',
    high: 'مرتفع',
    critical: 'حرج',
  };
  return map[level] || level;
}