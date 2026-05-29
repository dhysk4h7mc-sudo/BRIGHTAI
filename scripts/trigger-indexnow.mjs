/**
 * سكريبت أتمتة الفهرسة اللحظية (IndexNow API Automation) لـ BrightAI
 * يقوم بإرسال إشارة أرشفة فورية لمحركات البحث (مثل Bing) عند كل عملية نشر.
 */

import { writeFileSync } from 'fs';

const host = 'brightai.site';
const key = '06932e6c52144c44bb9ff0296e3da655';
const keyLocation = `https://${host}/${key}.txt`;

// قائمة الروابط الرئيسية التي نريد أرشفتها تلقائياً عند النشر
const urlList = [
  `https://${host}/`,
  `https://${host}/about/`,
  `https://${host}/contact/`,
  `https://${host}/services/`,
  `https://${host}/pricing/`,
  `https://${host}/pdpl-statement/`,
  `https://${host}/solutions/ai-governance-platform/`,
  `https://${host}/solutions/ai-firewall/`,
  `https://${host}/solutions/ai-audit-trail/`,
  `https://${host}/solutions/human-approval-layer/`,
  `https://${host}/solutions/ai-evidence-file/`
];

async function triggerIndexNow() {
  console.log('🔄 جاري بدء أرشفة الصفحات لحظياً عبر بروتوكول IndexNow لـ Bing...');
  
  try {
    const response = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList
      })
    });

    if (response.status === 200) {
      console.log('✅ تم إرسال الروابط بنجاح! Bing ومحركات البحث الشريكة ستبدأ أرشفتها فورياً.');
      console.log(`🔗 قائمة الروابط المرسلة (${urlList.length} روابط):`);
      urlList.forEach(url => console.log(`   - ${url}`));
    } else {
      console.error(`❌ فشل الاتصال بـ IndexNow API. رمز الاستجابة: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ حدث خطأ غير متوقع أثناء إرسال طلب IndexNow:', error);
  }
}

triggerIndexNow();
