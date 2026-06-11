/**
 * solutions.ts — Single source of truth for all solution metadata
 */
export interface SolutionData {
  slug: string;
  href: string;
  title: string;
  h1: string;
  description: string;
  canonical: string;
  icon: string;
  chip: string;
  shortDesc: string;
  whenNeeded: string;
  related: string[];
  docs?: string[];
  blog?: string[];
  kernel?: string[];
}

export interface SectorData {
  slug: string;
  href: string;
  title: string;
  h1: string;
  description: string;
  canonical: string;
  icon: string;
  chip: string;
  shortDesc: string;
  whenNeeded: string;
  related: string[];
  locals?: LocalData[];
  docs?: string[];
  blog?: string[];
}

export interface LocalData {
  slug: string;
  href: string;
  title: string;
  h1: string;
  description: string;
  canonical: string;
  cityAr: string;
  cityEn: string;
  areaServed: string;
  parentSlug: string;
  parentHref: string;
}

const S = 'https://brightai.site';

export const solutions: SolutionData[] = [
  {
    slug:'ai-governance-platform', href:'/solutions/ai-governance-platform/',
    title:'منصة حوكمة الذكاء الاصطناعي | BrightAI',
    h1:'منصة حوكمة الذكاء الاصطناعي',
    description:'منصة BrightAI الشاملة لإدارة ومتابعة وحوكمة كل استخدامات الذكاء الاصطناعي في المؤسسة من مكان واحد.',
    canonical:`${S}/solutions/ai-governance-platform/`,
    icon:'mdi:scale-balance', chip:'المنصة الأم',
    shortDesc:'المنصة الشاملة اللي تجمع كل الحلول. رؤية مركزية لكل استخدامات AI، السياسات، والمخاطر.',
    whenNeeded:'لو عندك أكثر من ٢ حالة استخدام AI.',
    related:['ai-firewall','ai-audit-trail','human-approval-layer','ai-evidence-file'],
    docs:['/docs/ai-governance-platform/'], blog:['/blog/ai-governance/'], kernel:['/kernel/'],
  },
  {
    slug:'ai-firewall', href:'/solutions/ai-firewall/',
    title:'AI Firewall لحماية بيانات الشركات من مخاطر الذكاء الاصطناعي | BrightAI',
    h1:'AI Firewall لحماية البيانات الحساسة قبل وصولها للنماذج',
    description:'AI Firewall من BrightAI يفحص مدخلات ومخرجات الذكاء الاصطناعي، يقلل تسريب البيانات الحساسة، ويدعم ضوابط الاستخدام الآمن داخل المؤسسات السعودية.',
    canonical:`${S}/solutions/ai-firewall/`,
    icon:'mdi:shield-half-full', chip:'حماية البيانات',
    shortDesc:'يفحص كل طلب AI ويخفي البيانات الشخصية والحساسة قبل وصولها للنموذج. حماية في الزمن الفعلي.',
    whenNeeded:'من اليوم الأول لاستخدام AI.',
    related:['ai-audit-trail','ai-risk-classification','human-approval-layer'],
    docs:['/docs/ai-firewall/'], blog:['/blog/ai-firewall-why-you-need-it/'], kernel:['/kernel/chat/'],
  },
  {
    slug:'ai-audit-trail', href:'/solutions/ai-audit-trail/',
    title:'سجل تدقيق الذكاء الاصطناعي | AI Audit Trail | BrightAI',
    h1:'سجل تدقيق الذكاء الاصطناعي (AI Audit Trail)',
    description:'سجل تدقيق غير قابل للتعديل لكل عمليات الذكاء الاصطناعي. كل طلب ورد وقرار موثق ومشفّر بـ SHA-256.',
    canonical:`${S}/solutions/ai-audit-trail/`,
    icon:'mdi:file-sign', chip:'التوثيق',
    shortDesc:'سجل تدقيق غير قابل للتعديل (Append-only) محمي بـ SHA-256. كل طلب وقرار محفوظ مدى الحياة.',
    whenNeeded:'لو شركتك تحت NCA أو SFDA.',
    related:['ai-firewall','human-approval-layer','ai-evidence-file'],
    docs:['/docs/ai-audit-trail/'], blog:['/blog/ai-audit-trail-saudi/'], kernel:['/kernel/audit/'],
  },
  {
    slug:'ai-evidence-file', href:'/solutions/ai-evidence-file/',
    title:'ملف أدلة امتثال الذكاء الاصطناعي | AI Evidence File | BrightAI',
    h1:'ملف أدلة الامتثال للذكاء الاصطناعي (AI Evidence File)',
    description:'ملف PDF موقّع رقمياً يجمع كل البيانات والقرارات والموافقات المتعلقة بالذكاء الاصطناعي. جاهز للمدقق أو الجهة التنظيمية.',
    canonical:`${S}/solutions/ai-evidence-file/`,
    icon:'mdi:folder-open', chip:'الإثبات',
    shortDesc:'ملف PDF موقّع رقمياً يجمع كل البيانات والقرارات والموافقات. جاهز للمدقق أو الجهة التنظيمية.',
    whenNeeded:'قبل أي تدقيق خارجي.',
    related:['ai-audit-trail','human-approval-layer','continuous-ai-governance'],
    docs:['/docs/ai-evidence-file/'], blog:['/blog/ai-audit-trail-compliance-path/'], kernel:['/kernel/evidence/'],
  },
  {
    slug:'human-approval-layer', href:'/solutions/human-approval-layer/',
    title:'طبقة الموافقات البشرية لقرارات الذكاء الاصطناعي | BrightAI',
    h1:'طبقة الموافقات البشرية لقرارات الذكاء الاصطناعي',
    description:'أضف مسارات موافقة بشرية للقرارات عالية المخاطر قبل تنفيذ مخرجات الذكاء الاصطناعي داخل المؤسسة.',
    canonical:`${S}/solutions/human-approval-layer/`,
    icon:'mdi:account-check', chip:'السيطرة',
    shortDesc:'القرارات الحساسة تتوقف لين يراجعها شخص مخوّل. إشعارات فورية، توقيع رقمي، تفويض ذكي.',
    whenNeeded:'لما AI يأثر على قرارات مالية أو طبية.',
    related:['ai-risk-classification','ai-firewall','ai-audit-trail'],
    docs:['/docs/human-approval-layer/'], blog:[], kernel:['/kernel/approvals/'],
  },
  {
    slug:'continuous-ai-governance', href:'/solutions/continuous-ai-governance/',
    title:'حوكمة مستمرة للذكاء الاصطناعي في المنشآت | BrightAI',
    h1:'الحوكمة المستمرة للذكاء الاصطناعي',
    description:'حوكمة AI مو مشروع لمرة. حل BrightAI للمراقبة المستمرة وتحديث السياسات تلقائياً مع تغير الأنظمة والضوابط.',
    canonical:`${S}/solutions/continuous-ai-governance/`,
    icon:'mdi:refresh', chip:'الاستمرارية',
    shortDesc:'حوكمة AI مو مشروع لمرة. هذا الحل يراقب ويحدّث ويعدّل السياسات تلقائياً مع تغير الأنظمة.',
    whenNeeded:'بعد ما تطبق الحوكمة الأساسية.',
    related:['ai-governance-platform','policy-to-control-mapping','ai-risk-classification'],
    docs:['/docs/ai-governance-platform/'], blog:[], kernel:['/kernel/compliance/'],
  },
  {
    slug:'ai-risk-classification', href:'/solutions/ai-risk-classification/',
    title:'تصنيف مخاطر الذكاء الاصطناعي | AI Risk Classification | BrightAI',
    h1:'تصنيف وتقييم مخاطر الذكاء الاصطناعي',
    description:'يصنّف كل استخدام AI حسب مستوى الخطر: عالي، متوسط، منخفض. ويحدد متى يحتاج موافقة بشرية ومتى يمر تلقائياً.',
    canonical:`${S}/solutions/ai-risk-classification/`,
    icon:'mdi:alert-triangle', chip:'تصنيف المخاطر',
    shortDesc:'يصنّف كل استخدام AI: عالي، متوسط، منخفض. ويحدد متى يحتاج موافقة بشرية ومتى يمر تلقائياً.',
    whenNeeded:'لما يكثر عدد استخدامات AI.',
    related:['human-approval-layer','ai-use-case-discovery','continuous-ai-governance'],
    docs:['/docs/ai-risk-management/'], blog:[], kernel:['/kernel/policies/'],
  },
  {
    slug:'ai-use-case-discovery', href:'/solutions/ai-use-case-discovery/',
    title:'اكتشاف استخدامات الذكاء الاصطناعي الخفية | Shadow AI | BrightAI',
    h1:'اكتشاف استخدامات الذكاء الاصطناعي (Shadow AI Discovery)',
    description:'يكتشف الاستخدامات الخفية للذكاء الاصطناعي داخل شركتك (Shadow AI) ويعطيك خريطة كاملة لكل استخدام.',
    canonical:`${S}/solutions/ai-use-case-discovery/`,
    icon:'mdi:magnify', chip:'الاكتشاف',
    shortDesc:'يكتشف الاستخدامات الخفية للذكاء الاصطناعي داخل شركتك (Shadow AI) ويعطيك خريطة كاملة.',
    whenNeeded:'لو ما عندك علم بكل استخدامات AI.',
    related:['ai-risk-classification','ai-firewall','ai-governance-platform'],
    docs:['/docs/ai-governance-platform/'], blog:['/blog/shadow-ai-discovery-saudi-company/'], kernel:['/kernel/stats/'],
  },
  {
    slug:'policy-to-control-mapping', href:'/solutions/policy-to-control-mapping/',
    title:'ربط السياسات بالضوابط التقنية | Policy to Control Mapping | BrightAI',
    h1:'ربط السياسات بالضوابط التقنية',
    description:'يحوّل سياسات الورق إلى ضوابط تقنية تطبق نفسها. من السياسة إلى التنفيذ بكبسة واحدة.',
    canonical:`${S}/solutions/policy-to-control-mapping/`,
    icon:'material-symbols:account-tree', chip:'الربط الذكي',
    shortDesc:'يحوّل سياسات الورق إلى ضوابط تقنية تطبق نفسها. من السياسة إلى التنفيذ بكبسة واحدة.',
    whenNeeded:'لو عندك سياسات ما تتنفذ.',
    related:['continuous-ai-governance','ai-governance-platform','ai-risk-classification'],
    docs:['/docs/nca-ecc-ai-controls-mapping/'], blog:[], kernel:['/kernel/policies/'],
  },
];

export const sectors: SectorData[] = [
  {
    slug:'banking-ai-governance', href:'/solutions/banking-ai-governance/',
    title:'حوكمة الذكاء الاصطناعي في البنوك والقطاع المالي | BrightAI',
    h1:'حوكمة الذكاء الاصطناعي في القطاع المالي والبنكي',
    description:'ضوابط استخدام AI مع بيانات العملاء، امتثال SAMA، NCA ECC، ومكافحة غسل الأموال في البنوك السعودية.',
    canonical:`${S}/solutions/banking-ai-governance/`,
    icon:'mdi:bank', chip:'القطاع المالي',
    shortDesc:'ضوابط استخدام AI مع بيانات العملاء، امتثال SAMA، NCA ECC، ومكافحة غسل الأموال.',
    whenNeeded:'إذا كان AI يدخل في الائتمان أو AML أو خدمة العملاء.',
    related:['ai-firewall','ai-audit-trail','human-approval-layer','ai-evidence-file'],
    locals:[{
      slug:'riyadh', href:'/solutions/banking-ai-governance/riyadh/',
      title:'حوكمة الذكاء الاصطناعي للبنوك في الرياض | BrightAI',
      h1:'حوكمة الذكاء الاصطناعي للبنوك والمؤسسات المالية في الرياض',
      description:'خدمات حوكمة الذكاء الاصطناعي للبنوك والمؤسسات المالية في الرياض. امتثال SAMA وNCA ECC وحماية بيانات العملاء.',
      canonical:`${S}/solutions/banking-ai-governance/riyadh/`,
      cityAr:'الرياض', cityEn:'Riyadh', areaServed:'Riyadh',
      parentSlug:'banking-ai-governance', parentHref:'/solutions/banking-ai-governance/',
    }],
    docs:['/docs/nca-ecc-ai-governance/'], blog:['/blog/banking-ai-governance-sama-requirements/'],
  },
  {
    slug:'government-ai-governance', href:'/solutions/government-ai-governance/',
    title:'حوكمة الذكاء الاصطناعي في الجهات الحكومية | BrightAI',
    h1:'حوكمة الذكاء الاصطناعي في الجهات الحكومية',
    description:'حوكمة استخدامات AI في الخدمات الرقمية مع DGA وPDPL ورؤية 2030 وحماية بيانات المستفيدين في الجهات الحكومية.',
    canonical:`${S}/solutions/government-ai-governance/`,
    icon:'mdi:domain', chip:'القطاع الحكومي',
    shortDesc:'حوكمة استخدامات AI في الخدمات الرقمية مع DGA وPDPL ورؤية 2030 وحماية بيانات المستفيدين.',
    whenNeeded:'إذا كان AI يدعم موظفين أو مستفيدين في جهة حكومية.',
    related:['ai-firewall','ai-audit-trail','ai-evidence-file','policy-to-control-mapping'],
    locals:[{
      slug:'dammam', href:'/solutions/government-ai-governance/dammam/',
      title:'حوكمة الذكاء الاصطناعي للجهات الحكومية في الدمام | BrightAI',
      h1:'حوكمة الذكاء الاصطناعي للجهات الحكومية في الدمام',
      description:'خدمات حوكمة الذكاء الاصطناعي للجهات الحكومية في الدمام. امتثال DGA وPDPL وحماية بيانات المستفيدين.',
      canonical:`${S}/solutions/government-ai-governance/dammam/`,
      cityAr:'الدمام', cityEn:'Dammam', areaServed:'Dammam',
      parentSlug:'government-ai-governance', parentHref:'/solutions/government-ai-governance/',
    }],
    docs:['/docs/pdpl-ai-governance/'], blog:['/blog/ai-governance-saudi-arabia/'],
  },
  {
    slug:'healthcare-ai-governance', href:'/solutions/healthcare-ai-governance/',
    title:'حوكمة الذكاء الاصطناعي في المستشفيات والرعاية الصحية | BrightAI',
    h1:'حوكمة الذكاء الاصطناعي في القطاع الصحي',
    description:'حوكمة استخدامات الذكاء الاصطناعي مع بيانات المرضى، امتثال SFDA، ISO 13485، وسجلات أدلة الجودة في المستشفيات السعودية.',
    canonical:`${S}/solutions/healthcare-ai-governance/`,
    icon:'mdi:hospital-building', chip:'قطاع الرعاية الصحية',
    shortDesc:'حوكمة استخدامات الذكاء الاصطناعي مع بيانات المرضى، امتثال SFDA، ISO 13485، وسجلات أدلة الجودة.',
    whenNeeded:'إذا كان AI يلامس بيانات صحية أو توصيات سريرية.',
    related:['ai-firewall','ai-audit-trail','human-approval-layer','ai-evidence-file'],
    locals:[{
      slug:'jeddah', href:'/solutions/healthcare-ai-governance/jeddah/',
      title:'حوكمة الذكاء الاصطناعي للمستشفيات في جدة | BrightAI',
      h1:'حوكمة الذكاء الاصطناعي للمستشفيات والمنشآت الصحية في جدة',
      description:'خدمات حوكمة الذكاء الاصطناعي للمستشفيات والمنشآت الصحية في جدة. امتثال SFDA وISO 13485 وحماية بيانات المرضى.',
      canonical:`${S}/solutions/healthcare-ai-governance/jeddah/`,
      cityAr:'جدة', cityEn:'Jeddah', areaServed:'Jeddah',
      parentSlug:'healthcare-ai-governance', parentHref:'/solutions/healthcare-ai-governance/',
    }],
    docs:['/docs/ai-governance-saudi-arabia/'], blog:['/blog/healthcare-ai-governance-saudi-hospitals/'],
  },
  {
    slug:'manufacturing-ai-governance', href:'/solutions/manufacturing-ai-governance/',
    title:'حوكمة الذكاء الاصطناعي في القطاع الصناعي | BrightAI',
    h1:'حوكمة الذكاء الاصطناعي في القطاع الصناعي',
    description:'حوكمة AI في الجودة والصيانة التنبؤية وسلامة IoT وتوصيات التشغيل داخل المصانع السعودية.',
    canonical:`${S}/solutions/manufacturing-ai-governance/`,
    icon:'mdi:factory', chip:'القطاع الصناعي',
    shortDesc:'حوكمة AI في الجودة والصيانة التنبؤية وسلامة IoT وتوصيات التشغيل داخل المصانع.',
    whenNeeded:'إذا كان AI يؤثر على خط إنتاج أو جودة أو أصل صناعي.',
    related:['ai-firewall','ai-audit-trail','ai-risk-classification','continuous-ai-governance'],
    docs:['/docs/ai-risk-management/'], blog:[],
  },
];

export function getSolution(slug: string) { return solutions.find(s => s.slug === slug); }
export function getSector(slug: string) { return sectors.find(s => s.slug === slug); }
export function getRelatedSolutions(slug: string): SolutionData[] {
  const sol = getSolution(slug);
  if (!sol) return [];
  return sol.related.map(r => getSolution(r)).filter((s): s is SolutionData => !!s);
}
export function getRelatedSectors(solutionSlug: string): SectorData[] {
  return sectors.filter(s => s.related.includes(solutionSlug));
}