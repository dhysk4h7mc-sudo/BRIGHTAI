/**
 * BrightAI — Blog data
 * Single source of truth for all blog articles, categories, and authors.
 * 22 articles matching sitemap.xml exactly.
 */
import { SITE } from './site';

/* ── Types ──────────────────────────────────────────────────── */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  canonical: string;
  pubDate: string;        // ISO date
  updatedDate: string;    // ISO date
  author: Author;
  tags: string[];
  category: BlogCategory;
  ogImage: string;
  draft: boolean;
  readingTime: number;    // minutes
  metaTitle?: string;
}

export interface Author {
  slug: string;
  name: string;
  nameEn: string;
  url: string;
  title: string;
  bio: string;
}

export type BlogCategory =
  | 'حوكمة الذكاء الاصطناعي'
  | 'الامتثال والأنظمة'
  | 'الأمن والسلامة'
  | 'قطاعات'
  | 'منصات وأدوات'
  | 'رؤية 2030';

/* ── Authors ────────────────────────────────────────────────── */
export const authors: Record<string, Author> = {
  'nasser-alabdullah': {
    slug: 'nasser-alabdullah',
    name: 'م. ناصر العبدالله',
    nameEn: 'Nasser AlAbdullah',
    url: `${SITE.url}/authors/nasser-alabdullah/`,
    title: 'مستشار حوكمة الذكاء الاصطناعي في BrightAI',
    bio: 'م. ناصر العبدالله مهندس ومستشار حوكمة ذكاء اصطناعي في BrightAI، ويركز محتواه المنشور على تحويل مبادئ AI Governance ومتطلبات الامتثال السعودية إلى ضوابط تشغيلية قابلة للتطبيق والتدقيق داخل المؤسسات. تغطي مقالاته حماية البيانات الشخصية وفق PDPL، وربط استخدامات الذكاء الاصطناعي بضوابط NCA ECC، والتعامل العملي مع إرشادات سدايا، إلى جانب سلامة الذكاء الاصطناعي وسجلات التدقيق والرقابة البشرية وإدارة المخاطر.',
  },
};

/* ── Blog Posts (22 articles — matches sitemap.xml) ─────────── */
export const posts: BlogPost[] = [
  {
    slug: 'what-is-ai-governance-saudi-companies',
    title: 'ما هي حوكمة الذكاء الاصطناعي؟ الدليل الكامل للشركات السعودية وAI Governance Saudi Arabia',
    description: 'دليل تنفيذي يشرح معنى حوكمة الذكاء الاصطناعي للشركات السعودية، وكيف تربط السياسات والمخاطر والامتثال بضوابط تشغيلية قابلة للتدقيق.',
    canonical: `${SITE.url}/blog/what-is-ai-governance-saudi-companies/`,
    pubDate: '2026-06-09',
    updatedDate: '2026-06-09',
    author: authors['nasser-alabdullah'],
    tags: ['حوكمة الذكاء الاصطناعي', 'AI Governance', 'الشركات السعودية', 'حوكمة AI'],
    category: 'حوكمة الذكاء الاصطناعي',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 12,
  },
  {
    slug: 'hidden-ai-risks-saudi-organizations',
    title: '5 مخاطر خفية للذكاء الاصطناعي في المؤسسات السعودية: مخاطر الذكاء الاصطناعي وتصنيف مخاطر AI',
    description: 'خمسة مخاطر قد لا تظهر في العروض التجريبية للذكاء الاصطناعي، لكنها تظهر عند التشغيل الحقيقي داخل المؤسسات السعودية.',
    canonical: `${SITE.url}/blog/hidden-ai-risks-saudi-organizations/`,
    pubDate: '2026-06-12',
    updatedDate: '2026-06-12',
    author: authors['nasser-alabdullah'],
    tags: ['مخاطر AI', 'الأمن السيبراني', 'المؤسسات السعودية', 'تصنيف المخاطر'],
    category: 'الأمن والسلامة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 10,
  },
  {
    slug: 'ai-governance-vs-ai-safety-vs-ai-security',
    title: 'الفرق بين AI Governance و AI Safety و AI Security: حوكمة AI وأمان AI وأمن AI',
    description: 'شرح عملي للفروق بين حوكمة AI وأمان AI وأمن AI، وكيف تتكامل الثلاثة داخل برنامج واحد بدلاً من أن تعمل كجزر منفصلة.',
    canonical: `${SITE.url}/blog/ai-governance-vs-ai-safety-vs-ai-security/`,
    pubDate: '2026-06-16',
    updatedDate: '2026-06-16',
    author: authors['nasser-alabdullah'],
    tags: ['حوكمة AI', 'أمان AI', 'أمن AI', 'AI Governance vs Safety vs Security'],
    category: 'حوكمة الذكاء الاصطناعي',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 11,
  },
  {
    slug: 'shadow-ai-discovery-saudi-company',
    title: 'Shadow AI: كيف تكتشف الاستخدام الخفي للذكاء الاصطناعي في شركتك',
    description: 'طريقة عملية لاكتشاف أدوات AI غير المصرح بها، وتصنيفها، وتحويلها من خطر خفي إلى استخدام محكوم.',
    canonical: `${SITE.url}/blog/shadow-ai-discovery-saudi-company/`,
    pubDate: '2026-06-19',
    updatedDate: '2026-06-19',
    author: authors['nasser-alabdullah'],
    tags: ['Shadow AI', 'الاستخدام الخفي', 'اكتشاف AI', 'الشركات السعودية'],
    category: 'الأمن والسلامة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 9,
  },
  {
    slug: 'pdpl-ai-compliance-guide',
    title: 'دليل PDPL والذكاء الاصطناعي: امتثال PDPL للذكاء الاصطناعي لمسؤول الامتثال',
    description: 'دليل لمسؤولي الامتثال عن ربط PDPL باستخدامات الذكاء الاصطناعي، من الأساس النظامي إلى سجلات المعالجة والتدقيق.',
    canonical: `${SITE.url}/blog/pdpl-ai-compliance-guide/`,
    pubDate: '2026-06-23',
    updatedDate: '2026-06-23',
    author: authors['nasser-alabdullah'],
    tags: ['PDPL', 'امتثال', 'حماية البيانات', 'الذكاء الاصطناعي'],
    category: 'الامتثال والأنظمة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 14,
  },
  {
    slug: 'nca-ecc-ai-controls-guide',
    title: 'ضوابط NCA ECC للذكاء الاصطناعي: ضوابط NCA للذكاء الاصطناعي خطوة بخطوة',
    description: 'شرح تشغيلي لكيفية قراءة ضوابط NCA ECC عند استخدام AI، وربطها بسياسات الوصول، البيانات، المراقبة، والتدقيق.',
    canonical: `${SITE.url}/blog/nca-ecc-ai-controls-guide/`,
    pubDate: '2026-06-26',
    updatedDate: '2026-06-26',
    author: authors['nasser-alabdullah'],
    tags: ['NCA ECC', 'ضوابط سيبرانية', 'امتثال', 'الذكاء الاصطناعي'],
    category: 'الامتثال والأنظمة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 13,
  },
  {
    slug: 'sdaia-generative-ai-guidelines-practical-compliance',
    title: 'إرشادات سدايا للذكاء الاصطناعي التوليدي: كيف تتوافق عملياً',
    description: 'دليل عملي لترجمة مبادئ وإرشادات سدايا حول الذكاء الاصطناعي إلى سياسات استخدام وضوابط قابلة للتطبيق.',
    canonical: `${SITE.url}/blog/sdaia-generative-ai-guidelines-practical-compliance/`,
    pubDate: '2026-06-30',
    updatedDate: '2026-06-30',
    author: authors['nasser-alabdullah'],
    tags: ['SDAIA', 'الذكاء الاصطناعي التوليدي', 'إرشادات', 'امتثال'],
    category: 'الامتثال والأنظمة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 12,
  },
  {
    slug: 'iso-42001-saudi-implementation-guide',
    title: 'ISO/IEC 42001 للشركات السعودية: ISO 42001 السعودية دليل التطبيق العملي',
    description: 'كيف تستفيد الشركات السعودية من ISO/IEC 42001 لبناء نظام إدارة ذكاء اصطناعي قابل للتحسين والتدقيق.',
    canonical: `${SITE.url}/blog/iso-42001-saudi-implementation-guide/`,
    pubDate: '2026-07-03',
    updatedDate: '2026-07-03',
    author: authors['nasser-alabdullah'],
    tags: ['ISO 42001', 'إدارة AI', 'الشركات السعودية', 'تدقيق'],
    category: 'الامتثال والأنظمة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 15,
  },
  {
    slug: 'ai-firewall-why-you-need-it',
    title: 'جدار حماية الذكاء الاصطناعي (AI Firewall): ما هو ولماذا تحتاجه',
    description: 'شرح مبسط وعملي لمفهوم AI Firewall ودوره في حماية البيانات، منع الاستخدامات الخطرة، وتسجيل الأدلة.',
    canonical: `${SITE.url}/blog/ai-firewall-why-you-need-it/`,
    pubDate: '2026-07-07',
    updatedDate: '2026-07-07',
    author: authors['nasser-alabdullah'],
    tags: ['AI Firewall', 'جدار حماية', 'حماية البيانات', 'أمان AI'],
    category: 'الأمن والسلامة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 10,
  },
  {
    slug: 'ai-audit-trail-compliance-path',
    title: 'سجل تدقيق الذكاء الاصطناعي: كيف تبني AI Audit Trail ومسار امتثال واضح',
    description: 'دليل لبناء AI Audit Trail يوضح من استخدم النموذج، ما البيانات التي عولجت، ما القرار، وما الدليل.',
    canonical: `${SITE.url}/blog/ai-audit-trail-compliance-path/`,
    pubDate: '2026-07-10',
    updatedDate: '2026-07-10',
    author: authors['nasser-alabdullah'],
    tags: ['سجل التدقيق', 'AI Audit Trail', 'امتثال', 'تدقيق'],
    category: 'حوكمة الذكاء الاصطناعي',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 11,
  },
  {
    slug: 'healthcare-ai-governance-saudi-hospitals',
    title: 'حوكمة الذكاء الاصطناعي في المستشفيات السعودية: حوكمة AI للمستشفيات وامتثال SFDA',
    description: 'دليل للمستشفيات ومقدمي الرعاية حول حوكمة AI، حماية بيانات المرضى، ومتطلبات SFDA عند وجود أجهزة أو برمجيات طبية.',
    canonical: `${SITE.url}/blog/healthcare-ai-governance-saudi-hospitals/`,
    pubDate: '2026-07-14',
    updatedDate: '2026-07-14',
    author: authors['nasser-alabdullah'],
    tags: ['قطاع الصحة', 'حوكمة AI', 'SFDA', 'المستشفيات السعودية'],
    category: 'قطاعات',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 13,
  },
  {
    slug: 'banking-ai-governance-sama-requirements',
    title: 'حوكمة الذكاء الاصطناعي في البنوك السعودية: حوكنة AI للبنوك وامتثال SAMA',
    description: 'كيف تبني البنوك السعودية حوكمة AI متوافقة مع توقعات الحوكمة التقنية وإدارة المخاطر والرقابة.',
    canonical: `${SITE.url}/blog/banking-ai-governance-sama-requirements/`,
    pubDate: '2026-07-17',
    updatedDate: '2026-07-17',
    author: authors['nasser-alabdullah'],
    tags: ['قطاع البنوك', 'SAMA', 'حوكمة AI', 'البنوك السعودية'],
    category: 'قطاعات',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 12,
  },
  {
    slug: 'ai-ethics-saudi-responsible-ai',
    title: 'أخلاقيات الذكاء الاصطناعي في السعودية: AI المسؤول بين الابتكار والمسؤولية',
    description: 'مقال يربط أخلاقيات AI بالحوكمة العملية: العدالة، الشفافية، الخصوصية، المساءلة، والرقابة البشرية.',
    canonical: `${SITE.url}/blog/ai-ethics-saudi-responsible-ai/`,
    pubDate: '2026-07-21',
    updatedDate: '2026-07-21',
    author: authors['nasser-alabdullah'],
    tags: ['أخلاقيات AI', 'AI المسؤول', 'العدالة', 'الشفافية'],
    category: 'حوكمة الذكاء الاصطناعي',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 10,
  },
  {
    slug: 'best-ai-governance-platforms-2026',
    title: 'مقارنة: أفضل منصات حوكمة الذكاء الاصطناعي في 2026 وأفضل منصة حوكمة AI: BrightAI vs Credo AI',
    description: 'مقارنة عملية بين معايير اختيار منصات حوكمة AI في 2026، مع توضيح أين تتميز BrightAI للشركات السعودية.',
    canonical: `${SITE.url}/blog/best-ai-governance-platforms-2026/`,
    pubDate: '2026-07-24',
    updatedDate: '2026-07-24',
    author: authors['nasser-alabdullah'],
    tags: ['منصات حوكمة AI', 'مقارنة', 'BrightAI', '2026'],
    category: 'منصات وأدوات',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 14,
  },
  {
    slug: 'ai-red-teaming-security-testing',
    title: 'AI Red Teaming: كيف تختبر أمان أنظمة الذكاء الاصطناعي واختبار أمان AI لديك',
    description: 'طريقة منظمة لاختبار أمان AI ضد تسريب البيانات، prompt injection، تجاوز السياسات، والمخرجات الخطرة.',
    canonical: `${SITE.url}/blog/ai-red-teaming-security-testing/`,
    pubDate: '2026-07-28',
    updatedDate: '2026-07-28',
    author: authors['nasser-alabdullah'],
    tags: ['Red Teaming', 'اختبار الأمان', 'prompt injection', 'أمن AI'],
    category: 'الأمن والسلامة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 11,
  },
  {
    slug: 'vision-2030-ai-governance-roadmap',
    title: 'الذكاء الاصطناعي في رؤية 2030: رؤية 2030 الذكاء الاصطناعي والتحول الرقمي السعودي',
    description: 'خريطة طريق تربط توسع الذكاء الاصطناعي في رؤية 2030 بالحوكمة، الثقة، الامتثال، وسلامة التحول الرقمي السعودي.',
    canonical: `${SITE.url}/blog/vision-2030-ai-governance-roadmap/`,
    pubDate: '2026-07-31',
    updatedDate: '2026-07-31',
    author: authors['nasser-alabdullah'],
    tags: ['رؤية 2030', 'التحول الرقمي', 'حوكمة AI', 'السعودية'],
    category: 'رؤية 2030',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 12,
  },
  {
    slug: 'ai-governance-saudi-arabia',
    title: 'حوكمة الذكاء الاصطناعي في السعودية',
    description: 'دليل عملي لحوكمة الذكاء الاصطناعي في السعودية. ابدأ حوكمة AI في شركتك بدون تعقيد مع حلول BrightAI المتوافقة مع SDAIA وPDPL.',
    canonical: `${SITE.url}/blog/ai-governance-saudi-arabia/`,
    pubDate: '2026-05-31',
    updatedDate: '2026-05-31',
    author: authors['nasser-alabdullah'],
    tags: ['حوكمة AI', 'السعودية', 'SDAIA', 'PDPL', 'حلول BrightAI'],
    category: 'حوكمة الذكاء الاصطناعي',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 15,
  },
  {
    slug: 'ai-audit-trail-saudi',
    title: 'سجل تدقيق الذكاء الاصطناعي 2026: دليلك الشامل للحوكمة والامتثال في السعودية',
    description: 'دليلك الشامل لسجل تدقيق الذكاء الاصطناعي في عام AI 2026 السعودي. تعرف على متطلبات SDAIA، NCA، PDPL، غرامات الـ 48 قرار، وإطار الأمن السيبراني للذكاء الاصطناعي التوليدي.',
    canonical: `${SITE.url}/blog/ai-audit-trail-saudi/`,
    pubDate: '2026-06-02',
    updatedDate: '2026-06-02',
    author: authors['nasser-alabdullah'],
    tags: ['سجل التدقيق', 'السعودية', 'امتثال', 'توثيق AI'],
    category: 'حوكمة الذكاء الاصطناعي',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 11,
  },
  {
    slug: 'ai-customer-data-protection-saudi',
    title: 'حماية بيانات العملاء بالذكاء الاصطناعي في السعودية',
    description: 'دليل شامل لحماية بيانات العملاء عند استخدام AI في الشركات السعودية. تعلم كيفية منع تسرب البيانات، إخفاء PII، والامتثال لـ PDPL مع حلول BrightAI.',
    canonical: `${SITE.url}/blog/ai-customer-data-protection-saudi/`,
    pubDate: '2026-06-04',
    updatedDate: '2026-06-04',
    author: authors['nasser-alabdullah'],
    tags: ['حماية البيانات', 'PDPL', 'بيانات العملاء', 'الخصوصية'],
    category: 'الامتثال والأنظمة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 10,
  },
  {
    slug: 'ai-governance',
    title: 'الدليل التنفيذي الشامل لتطبيق حوكمة الذكاء الاصطناعي السعودية في المؤسسات',
    metaTitle: 'حوكمة الذكاء الاصطناعي السعودية: AI Governance | برايت آي',
    description: 'كيف تقود شركتك بأمان؟ اقرأ الدليل الشامل حول حوكمة الذكاء الاصطناعي السعودية وتعرف على استراتيجيات تأمين البيانات والامتثال. طوّر معرفتك واحمِ عملك الآن!',
    canonical: `${SITE.url}/blog/ai-governance/`,
    pubDate: '2026-06-06',
    updatedDate: '2026-06-06',
    author: authors['nasser-alabdullah'],
    tags: ['حوكمة AI', 'ممارسات عملية', 'إطار عمل', 'AI Governance'],
    category: 'حوكمة الذكاء الاصطناعي',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 13,
  },
  {
    slug: 'pdpl-ai-safety',
    title: 'كيف يساعد نظام PDPL السعودي الشركات على استخدام الذكاء الاصطناعي بأمان؟',
    metaTitle: 'PDPL وحماية بيانات الذكاء الاصطناعي | BrightAI',
    description: 'دليل عملي يوضح كيف تستخدم شركتك الذكاء الاصطناعي مع حماية البيانات الشخصية والالتزام بمتطلبات PDPL في السعودية، من جمع البيانات حتى المراجعة، بوضوح.',
    canonical: `${SITE.url}/blog/pdpl-ai-safety/`,
    pubDate: '2026-06-08',
    updatedDate: '2026-06-08',
    author: authors['nasser-alabdullah'],
    tags: ['PDPL', 'سلامة AI', 'حماية البيانات', 'الأنظمة السعودية'],
    category: 'الامتثال والأنظمة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 10,
  },
  {
    slug: 'pdpl-and-ai-saudi',
    title: 'PDPL والذكاء الاصطناعي: ما الذي يجب أن تعرفه الشركات السعودية؟',
    description: 'دليل شامل حول PDPL والذكاء الاصطناعي للشركات السعودية: المخاطر، الامتثال، حماية البيانات الشخصية، ودور AI Firewall و Audit Trail في بناء بيئة AI آمنة وخاضعة للحوكمة.',
    canonical: `${SITE.url}/blog/pdpl-and-ai-saudi/`,
    pubDate: '2026-06-10',
    updatedDate: '2026-06-10',
    author: authors['nasser-alabdullah'],
    tags: ['PDPL', 'الذكاء الاصطناعي', 'السعودية', 'حماية البيانات'],
    category: 'الامتثال والأنظمة',
    ogImage: '/images/og-default.webp',
    draft: false,
    readingTime: 11,
  },
];

/* ── Helpers ────────────────────────────────────────────────── */

/** Get all unique categories */
export function getCategories(): BlogCategory[] {
  const cats = new Set(posts.map(p => p.category));
  return [...cats];
}

/** Get posts by category */
export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return posts.filter(p => p.category === category && !p.draft);
}

/** Get published posts sorted by date (newest first) */
export function getPublishedPosts(): BlogPost[] {
  return posts
    .filter(p => !p.draft)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

/** Get related posts by tags/category */
export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = posts.find(p => p.slug === currentSlug);
  if (!current) return [];

  return posts
    .filter(p => p.slug !== currentSlug && !p.draft)
    .map(p => ({
      post: p,
      score: p.tags.filter(t => current.tags.includes(t)).length
        + (p.category === current.category ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.post);
}

/** Get posts by author */
export function getPostsByAuthor(authorSlug: string): BlogPost[] {
  return posts.filter(p => p.author.slug === authorSlug && !p.draft);
}

/** Get article count (for verification against sitemap) */
export const ARTICLE_COUNT = posts.length; // Must be 22
