# BRIGHTAI Legacy Cleanup Implementation Plan

**Status:** Ready for execution
**Branch:** `main` (requires no branch switch)
**Estimated Time:** 2-3 hours total

---

## Phase 1: Delete Dead Components (Zero Risk)

### Step 1.1: Verify Dead Components Before Deletion
```bash
# Run grep to confirm zero imports
grep -r "KernelStatCard" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "KernelTable" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "KernelLoadingState" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "SparklesCore" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "SparklesHero" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "SectionReveal" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
```
**Expected:** No output (empty results)

### Step 1.2: Delete Dead Components
```bash
git rm src/components/KernelStatCard.astro
git rm src/components/KernelTable.astro
git rm src/components/KernelLoadingState.astro
git rm src/components/SparklesCore.tsx
git rm src/components/SparklesHero.astro
git rm src/components/SectionReveal.astro
```

### Step 1.3: Verify Build Still Works
```bash
npm run build
```
**Expected:** Build completes without errors

### Step 1.4: Commit Phase 1
```bash
git commit -m "chore: remove 6 dead components (KernelStatCard, KernelTable, KernelLoadingState, SparklesCore, SparklesHero, SectionReveal)

- Removed unused components totaling ~643 lines
- Verified zero imports in src/ before deletion
- Build passes successfully"
```

---

## Phase 2: Clean Duplicated Assets (Low Risk)

### Step 2.1: Check Asset References
```bash
# Check if any src/ files reference public/frontend/assets/
grep -r "frontend/assets" src/ --include="*.astro" --include="*.ts" --include="*.tsx" --include="*.css"
```
**Expected:** Should show existing references (from earlier analysis)

### Step 2.2: Check Public Asset References
```bash
# Check if any HTML files reference frontend/assets
grep -r "frontend/assets" public/ --include="*.html" --include="*.xml" --include="*.txt"
```
**Expected:** No output (or minimal references)

### Step 2.3: Document Asset Duplication
```bash
# Create asset audit report
cat > /tmp/asset-duplication-check.txt << 'EOF'
Asset Duplication Report
========================
public/fonts/ vs public/frontend/assets/fonts/
public/images/ vs public/frontend/assets/images/

Action: Verify no active references before deletion
EOF
```

### Step 2.4: Add Archive README
```bash
cat > _archive/README.md << 'EOF'
# Archive Directory

This directory contains legacy files from the pre-Astro migration (April 2026).

## Contents

- `docx/` - Governance documentation drafts
- `legacy-public-frontend/` - Old HTML/CSS/JS assets
- `scratch/` - Temporary analysis files

## Policy

- These files are **NOT** part of the Astro build
- No `src/` code references these files
- Kept for historical reference only
- Safe to compress/archieve if repo size becomes an issue

Last reviewed: 2026-06-28
EOF
```

### Step 2.5: Add Frontend README
```bash
cat > frontend/README.md << 'EOF'
# Legacy Frontend (Express/Node.js)

⚠️ **This directory is NOT part of the Astro build or deployment.**

This is a legacy Express/Node.js application that predates the Astro migration.
It is kept for reference only and should not be modified.

## Files

- `server.js` - Express server entry point
- `demoGeminiApp.js` - Gemini AI demo
- `package.json` - Separate Node package manifest
- Test files for legacy functionality

## Recommendation

Consider moving this to a separate branch: `legacy/express-frontend`
EOF
```

### Step 2.6: Commit Phase 2
```bash
git add _archive/README.md frontend/README.md
git commit -m "docs: add README files for archive and legacy frontend

- _archive/README.md documents legacy files policy
- frontend/README.md marks Express app as non-deployed
- Prepares for future asset cleanup"
```

---

## Phase 3: Consolidate Scripts (Medium Risk)

### Step 3.1: Identify Script Categories
```bash
# List all scripts by function
ls -la scripts/*.mjs scripts/*.js scripts/*.py scripts/*.sh 2>/dev/null | head -50
```

### Step 3.2: Identify Duplicates
```bash
# Find scripts with similar names
ls scripts/*.mjs | xargs -I {} basename {} | sort | uniq -d
```

### Step 3.3: Create Script Inventory
```bash
# Generate script purpose matrix
cat > /tmp/script-inventory.txt << 'EOF'
Script Inventory
================
EOF

for f in scripts/*.mjs scripts/*.js scripts/*.py; do
  echo "$(basename $f) - $(head -5 $f | grep -i 'purpose\|description\|# ' | head -1)" >> /tmp/script-inventory.txt
done
```

### Step 3.4: Identify Unused Scripts
```bash
# Check which scripts are referenced in package.json
grep -o "scripts/[^ ]*" package.json > /tmp/used-scripts.txt
echo "Scripts in package.json:"
cat /tmp/used-scripts.txt
```

### Step 3.5: Document Script Cleanup Plan
```bash
cat > /tmp/script-cleanup-plan.md << 'EOF'
# Script Cleanup Plan

## Keep (in package.json)
- build-css-bundle.mjs
- generate-sitemap-all-pages.mjs
- verify-all.mjs

## Review (not in package.json)
- audit scripts
- migration scripts (keep for history)
- test scripts (keep for CI)

## Action
- Move migration scripts to _archive/scripts/
- Keep audit scripts for future use
EOF
```

### Step 3.6: Commit Phase 3
```bash
git add /tmp/script-cleanup-plan.md
git commit -m "docs: script cleanup analysis

- Identified scripts in package.json vs standalone
- Created cleanup plan for migration scripts
- Audit scripts preserved for future use"
```

---

## Verification Commands (Run After Each Phase)

```bash
# Verify no broken imports
npm run build

# Verify no TypeScript errors
npx tsc --noEmit

# Verify no ESLint errors
npm run lint 2>/dev/null || echo "No lint script configured"

# Verify all pages exist
find src/pages -name "*.astro" | wc -l  # Should be 35
```

---

## Rollback Plan

If any phase causes issues:

```bash
# Revert last commit
git reset --hard HEAD~1

# Or revert specific file deletions
git checkout HEAD -- src/components/KernelStatCard.astro
git checkout HEAD -- src/components/KernelTable.astro
# ... etc
```

---

## Success Criteria

- [ ] Phase 1: Build passes, 6 dead components removed
- [ ] Phase 2: README files added, no broken references
- [ ] Phase 3: Script inventory documented, no broken scripts
- [ ] All 35 pages render correctly
- [ ] No console errors in browser
- [ ] Repo size reduced by ~30KB (dead components)

---

*Plan generated as part of BRIGHTAI legacy code audit initiative.*
---

## النسخة العربية السعودية العامية

### المرحلة 1: حذف المكونات الميتة (بدون مخاطر)

#### خطوة 1.1: تأكد من إن المكونات مش مستخدمة
```bash
# تأكد إن الـ grep ما يطلع شيء
grep -r "KernelStatCard" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "KernelTable" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "KernelLoadingState" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "SparklesCore" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "SparklesHero" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
grep -r "SectionReveal" src/ --include="*.astro" --include="*.ts" --include="*.tsx"
```
**النتيحة المتوقعة:** ما يطلع شيء (المكونات مش موجودة)

#### خطوة 1.2: احذف المكونات
```bash
git rm src/components/KernelStatCard.astro
git rm src/components/KernelTable.astro
git rm src/components/KernelLoadingState.astro
git rm src/components/SparklesCore.tsx
git rm src/components/SparklesHero.astro
git rm src/components/SectionReveal.astro
```

#### خطوة 1.3: تأكد إن البناء لا ينهار
```bash
npm run build
```
**النتيحة المتوقعة:** البناء يكتمل من غير أخطاء

#### خطوة 1.4: احفظ التغييرات
```bash
git commit -m "chore: حذف 6 مكونات ميتة (KernelStatCard, KernelTable, KernelLoadingState, SparklesCore, SparklesHero, SectionReveal)

- حذفت مكونات مش مستخدمة بـ ~643 سطر
- تأكدت من عدم وجود imports قبل الحذف
- البناء نجح"
```

---

### المرحلة 2: تنظيف الأصول المكررة (مخاطر قليلة)

#### خطوة 2.1: تأكد من مراجع الأصول
```bash
# تأكد إن أي ملفات src/ بتشير على public/frontend/assets/
grep -r "frontend/assets" src/ --include="*.astro" --include="*.ts" --include="*.tsx" --include="*.css"
```
**النتيحة المتوقعة:** ما يطلع شيء أو نتائج قليلة

#### خطوة 2.2: أضف ملف README للأرشيف
```bash
cat > _archive/README.md << 'EOF'
# مجلد الأرشيف

هذا المجلد فيه ملفات قديمة من قبل ترحيل Astro (أبريل 2026).

## المحتويات

- `docx/` - مسودات وثائق الحوكمة
- `legacy-public-frontend/` - أصول HTML/CSS/JS قديمة
- `scratch/` - ملفات تحليل مؤقتة

## السياسة

- هذه الملفات **ما هي** جزء من بناء Astro
- أي ملف في src/ ما بيشير على هذه الملفات
- خليت للمرجع التاريخي فقط
- تقدر تضغطها لو حجم الريبو زاد

آخر مراجعة: 2026-06-28
EOF
```

#### خطوة 2.3: أضف ملف README للـ frontend القديم
```bash
cat > frontend/README.md << 'EOF'
# الواجهة القديمة (Express/Node.js)

⚠️ **هذا المجلد ما هو جزء من بناء Astro أو النشر.**

هذا تطبيق Express/Node.js قديم قبل ترحيل Astro.
خليته للمرجع فقط وما ينصح تعديل فيه.

## الملفات

- `server.js` - نقطة دخول خادم Express
- `demoGeminiApp.js` - تجربة Gemini AI
- `package.json` - ملف حزمة Node منفصل
- ملفات تجربة للوظائف القديمة

## التوصية

افكر في نقل هذا لفرع منفصل: `legacy/express-frontend`
EOF
```

---

### المرحلة 3: تنظيم السكربتات (مخاطر متوسطة)

#### خطوة 3.1: اكتشف السكربتات المتكررة
```bash
# افتح ملف السكربتات وشوف الأسطر المتشابهة
ls scripts/*.mjs scripts/*.js scripts/*.py scripts/*.sh 2>/dev/null | wc -l
```

#### خطوة 3.2: حفظ السكربتات المهمة
```bash
# السكربتات اللي في package.json خليك معاها
grep -o "scripts/[^ ]*" package.json
```

---

## أوامر التحقق (شغّليها بعد كل مرحلة)

```bash
# تأكد إن البناء ما ينهار
npm run build

# تأكد إن TypeScript ما فيه أخطاء
npx tsc --noEmit

# تأكد إن كل الصفحات موجودة
find src/pages -name "*.astro" | wc -l  # لازم يطلع 35
```

---

## خطة التراجع

لو حصل أي مشكلة:

```bash
# ارجع آخر commit
git reset --hard HEAD~1

# أو ارجع ملفات محددة
git checkout HEAD -- src/components/KernelStatCard.astro
git checkout HEAD -- src/components/KernelTable.astro
# ... وهكذا
```

---

*الخطة جاهزة للتنفيذ - تم إنشاؤها كجزء من مبادرة تدقيق الشيفرة القديمة.*