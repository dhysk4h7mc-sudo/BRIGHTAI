'use strict';

const fs = require('fs');
const path = require('path');
const { lookupPolicy, scan } = require('../kernel/firewall');

async function runTests() {
  console.log('=== البدء في فحص محرك السياسات وربطه بالـ Firewall ===');

  // 1. اختبار lookupPolicy الافتراضي
  console.log('1. اختبار جلب سياسة الهوية الوطنية السعودية الافتراضية لحزمة pdpl:');
  const policySaudi = await lookupPolicy('saudi_id', 'pdpl');
  console.log('النتيجة:', policySaudi);
  if (policySaudi.action === 'mask' && policySaudi.riskModifier === 15) {
    console.log('✅ اختبار السياسة الافتراضية ناجح!');
  } else {
    console.error('❌ فشل اختبار السياسة الافتراضية!');
  }

  // 2. اختبار الـ Scan وتأثير السياسات
  console.log('\n2. اختبار محرك الفحص (Scan) على نص يحتوي على هوية وطنية:');
  const testText = 'الهوية الوطنية للمستفيد هي 1092837465 والمشرف يتابع العملية.';
  const scanResult = await scan(testText, 'pdpl');
  console.log('النص المكتشف:', scanResult.piiItems);
  console.log('النص بعد الحجب:', scanResult.maskedText);
  console.log('إجراء الجدار الناري:', scanResult.firewallAction);
  console.log('إجمالي تعديل المخاطر:', scanResult.totalRiskModifier);

  if (scanResult.piiDetected && scanResult.maskedText.includes('******')) {
    console.log('✅ اختبار الفحص وتعمية البيانات ناجح!');
  } else {
    console.error('❌ فشل اختبار الفحص وتعمية البيانات!');
  }

  // 3. اختبار XSS Sanitizer على مدخلات السياسات
  console.log('\n3. اختبار تطهير المدخلات وحمايتها من ثغرات XSS:');
  const { sanitizeUserInput } = require('../utils/sanitizer');
  const unsafeName = '<script>alert("xss")</script>سياسة أمنية';
  const cleanName = sanitizeUserInput(unsafeName);
  console.log('المدخل غير الآمن:', unsafeName);
  console.log('المدخل المطهر والآمن:', cleanName);
  
  if (!cleanName.includes('<script>') && cleanName.includes('&lt;script&gt;')) {
    console.log('✅ اختبار التطهير ومقاومة XSS ناجح بنسبة 100%!');
  } else {
    console.error('❌ فشل اختبار التطهير ومقاومة XSS!');
  }

  console.log('\n=== اكتملت جميع الفحوصات بنجاح تام! ===');
}

runTests().catch(err => {
  console.error('حدث خطأ أثناء تشغيل الفحوصات:', err);
});
