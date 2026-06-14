import chat from './migrated-pages/kernel-chat.json';
import audit from './migrated-pages/kernel-audit.json';
import approvals from './migrated-pages/kernel-approvals.json';
import stats from './migrated-pages/kernel-stats.json';
import connectors from './migrated-pages/kernel-connectors.json';
import scenarios from './migrated-pages/kernel-scenarios.json';
import policies from './migrated-pages/kernel-policies.json';
import evidence from './migrated-pages/kernel-evidence.json';
import compliance from './migrated-pages/kernel-compliance.json';
import reports from './migrated-pages/kernel-reports.json';
import offline from './migrated-pages/kernel-offline.json';
import type { MigratedPage } from './migratedSolutionPages';

const approvalsDialogs = `
  <div class="migrated-kernel-dialogs" hidden>
    <section aria-labelledby="approval-comment-title">
      <h2 id="approval-comment-title">تعليق القرار</h2>
      <p id="approval-comment-hint"></p>
      <textarea id="approval-comment-input" placeholder="اكتب تعليق المراجع لسجل التدقيق"></textarea>
      <p id="approval-comment-error">تعليق الرفض إلزامي قبل تنفيذ القرار.</p>
      <button type="button">تأكيد القرار</button>
      <button type="button">إلغاء</button>
    </section>
    <section aria-labelledby="delegation-title">
      <h2 id="delegation-title">تحويل الطلب لمراجع آخر</h2>
      <p id="delegation-hint">اختر المراجع الذي يستلم الطلب داخل واجهة الموافقات.</p>
      <select id="delegation-reviewer">
        <option value="مدير الامتثال">مدير الامتثال</option>
        <option value="مسؤول حماية البيانات">مسؤول حماية البيانات</option>
        <option value="مراجع الأمن السيبراني">مراجع الأمن السيبراني</option>
        <option value="قائد الفريق القانوني">قائد الفريق القانوني</option>
      </select>
      <textarea id="delegation-note" placeholder="ملاحظة التحويل (اختياري)"></textarea>
      <button type="button">تحويل الطلب</button>
      <button type="button">إلغاء</button>
    </section>
  </div>
`;

const reportsDialog = `
  <section class="migrated-kernel-dialogs" aria-labelledby="generate-report-title" hidden>
    <h3 id="generate-report-title">إنشاء تقرير جديد</h3>
    <label>نوع التقرير
      <select>
        <option value="governance">تقرير حوكمة</option>
        <option value="compliance">تقرير امتثال</option>
        <option value="audit">تقرير تدقيق</option>
        <option value="risk">تقرير مخاطر</option>
        <option value="custom">تقرير مخصص</option>
      </select>
    </label>
    <label>الفترة الزمنية
      <select>
        <option value="last7">آخر 7 أيام</option>
        <option value="last30">آخر 30 يوم</option>
        <option value="lastQuarter">الربع الأخير</option>
        <option value="custom">فترة مخصصة</option>
      </select>
    </label>
    <label>صيغة التقرير
      <select>
        <option value="pdf">PDF</option>
        <option value="excel">Excel</option>
        <option value="csv">CSV</option>
      </select>
    </label>
    <button type="button">إلغاء</button>
    <button type="button">إنشاء التقرير</button>
  </section>
`;

export const migratedKernelPages: Record<string, MigratedPage> = {
  chat,
  audit,
  approvals: { ...approvals, html: `${approvals.html}${approvalsDialogs}` },
  stats,
  connectors,
  scenarios,
  policies,
  evidence,
  compliance,
  reports: { ...reports, html: `${reports.html}${reportsDialog}` },
};

export const migratedKernelOffline: MigratedPage = offline;
