# AI Prompts & Instructions

## تعليمات المشروع

هذا الملف يحتوي على البرومبتات والتعليمات المخصصة للذكاء الاصطناعي المستخدم في تطوير هذا المشروع.

---

## البرومبت الرئيسي

[تعليمات إلى Cline — اكتب README بالعربية ثم نفّذ الـ Back-End والـ API خطوة بخطوة]

الدور: أنت كبير مطورين. لدينا مشروع Next.js (App Router) بواجهة جاهزة بصريًا. المطلوب:
1) تأليف README تفصيلي باللغة العربية يصف كل ما سنبنيه (قاعدة البيانات، الـ API، الخدمات، Stripe، OCR، PDF، التنبؤ، العائلة…).
2) البدء بالبرمجة خطوة بخطوة بنفس ترتيب المهام المحدد أدناه، مع الحفاظ على التصميم الحالي Pixel‑perfect (ممنوع تعديل الكلاسات/الألوان/المسافات/النصوص).

### [قواعد عامة]
- لغة المستندات والـ README والأمثلة النصية تكون بالعربية. أسماء المتغيرات والدوال في الكود بالإنجليزية كالعادة.
- لا تغيّر الواجهة إطلاقًا. استبدل مصادر البيانات فقط إلى استدعاءات API.
- استخدم Next.js Route Handlers تحت: src/app/api/**/route.(js|ts).
- التحقق من المدخلات باستخدام Zod. كل الأخطاء على هيئة JSON: { ok:false, code, message }.
- قاعدة البيانات: Prisma + SQLite كبداية (سهل الاستبدال).
- تنظيم الكود: src/server/db.ts (Prisma)، src/server/repositories/* (CRUD)، src/server/services/* (منطق الأعمال).
- اللغة/التاريخ: دعم هجري وميلادي في التقارير باستخدام Intl ('ar‑SA‑u‑ca‑islamic').

### [اكتب README أولًا (بالعربية)]
أنشئ/حدّث README.md بمحتوى كامل (ليس placeholders) ويشمل:
1) نظرة عامة وأهداف التطبيق (إدارة ميزانية شخصية/عائلية بميزات ذكية).
2) المعمارية: Next.js (App Router) + Prisma/SQLite + Route Handlers، وخريطة المجلدات.
3) المتطلبات الوظيفية (نفّذها لاحقًا في الكود):
   - الاشتراكات والدفع (Stripe): Checkout/Portal/Webhook + إدارة الباقة (معلومات الاشتراك/تاريخ التجديد/إلغاء/تعديل).
   - إدارة الميزانية والمصاريف:
     * إدخال الدخل الأساسي والجانبي.
     * إدخال المصاريف اليومية (المبلغ، الفئة، التاريخ، الملاحظات) مع حذف بتأكيد.
     * حدود ميزانية لكل فئة + تنبيه 110% عند التجاوز.
   - التقارير الذكية وPDF:
     * شهري: ملخص (الدخل − المصروف = المتبقي)، مقارنة بمتوسط آخر 3 أشهر، أفضل 5 فئات، نصائح قصيرة للتوفير.
     * سنوي: اتجاه 12 شهرًا + مقارنة متوسط 3 أشهر + أفضل 5 فئات.
     * أنواع التقارير: شهري/سنوي/عائلي/حسب فئة/حسب عضو.
     * خيارات: اختيار الفترة، إخفاء/إظهار الجداول أو الرسوم، تضمين الملاحظات، تنسيق للطباعة (هوامش، ترقيم صفحات)، تنزيل PDF.
   - المناسبات: (رمضان/عيد/مدارس/مخصص) لسنة أو سنتين؛ تظهر في Dashboard وزر "ميزانية مناسبة" للحدث.
   - التوصيات المالية والادخار: مقارنة المصاريف بالدخل، اقتراح خفض أكبر الفئات، اقتراح ادخار 10–20%، توصيات للأهداف (زواج/سفر/طوارئ).
   - إضافة الفواتير بالكاميرا: رفع/تصوير، OCR لاستخراج (المبلغ/التاريخ/تقدير الفئة) وإنشاء مصروف تلقائي مع إمكانية التعديل قبل الحفظ.
   - الحساب العائلي: إنشاء/انضمام بعائلة عبر كود دعوة؛ كل فرد يدخل مصاريفه؛ لوحة تلخيص: إجمالي مصاريف العائلة، توزيع حسب الفئات، مساهمة كل فرد، توصيات مشتركة.
   - التقويم الهجري والميلادي: إدخال/عرض بالتقويمين؛ التقارير بأسماء الشهور الهجرية؛ التخطيط لـ 12 شهرًا قادمًا.
   - الميزانية الشهرية والسنوية: مقارنة المخطط مع الفعلي، تلوين التجاوز (أحمر) والالتزام/التوفير (أخضر).
   - تقسيم الفواتير (Split Bills): تحديد نصيب كل فرد آليًا وحالة "من دفع/من عليه".
   - توقع الميزانية القادمة (ذكاء اصطناعي بسيط قابل للترقية) + بوت نصائح يومية يرتكز على السلوك ويجيب على أسئلة ("كيف أوفّر هذا الأسبوع؟").
   - فلترة عروض/تخفيضات حسب المنطقة (Placeholder لتكامل لاحق).
   - QR Code للوصول السريع (وثّق فقط).
4) سكيمة Prisma (Mermaid ERD) للجداول والعلاقات:
   User, Income, Category, Subcategory, Expense, Budget, CategoryBudget, Event,
   Family, FamilyMember, Bill, BillParticipant, Subscription, StripeEventLog, Advice, Forecast.
5) البيئة (.env.example):
   DATABASE_URL="file:./prisma/dev.db"
   APP_BASE_URL="http://localhost:3000"
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   STRIPE_PRICE_BASIC=
   STRIPE_PRICE_PRO=
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET=
   OPENAI_API_KEY=
6) جدول الـ API (الطريقة/المسار/المدخلات/المخرجات/الأخطاء):
   - المصاريف: GET/POST/PUT/DELETE /api/expenses
   - الدخل: GET/POST /api/incomes
   - الفئات/الفرعية: GET/POST /api/categories, GET/POST /api/subcategories
   - الميزانيات: GET/POST /api/budgets, GET /api/budgets/:id/summary
   - التقارير:
     * شهري: GET /api/reports/monthly?y=YYYY&m=MM&includeNotes=1&hideTables=0
     * سنوي: GET /api/reports/yearly?y=YYYY
     * عائلي/حسب فئة/عضو عبر باراميترات موضحة
     * PDF: GET /api/reports/monthly/pdf?y=YYYY&m=MM&includeNotes=1&hideCharts=0
   - المناسبات: GET/POST /api/events
   - العائلة: POST /api/family/create, POST /api/family/join, GET /api/family/summary
   - تقسيم الفواتير: POST /api/bills/split, GET /api/bills/:id/status
   - التنبؤ: POST /api/forecast/run?y=YYYY&m=MM, GET /api/forecast?y=YYYY&m=MM
   - النصائح: GET /api/advice/monthly?y=YYYY&m=MM, GET /api/advice/daily-latest
   - المساعد: POST /api/assistant/ask
   - OCR: POST /api/ocr/receipt (FormData: file)
   - Stripe: POST /api/stripe/checkout, POST /api/stripe/portal, POST /api/stripe/webhook
   - العروض (Placeholder): GET /api/deals/search?region=...&q=...
7) التقنيات: Zod، date-fns، @react-pdf/renderer (أو pdfmake)، tesseract.js، Recharts، Intl للهجري.
8) التشغيل محليًا، الاختبارات اليدوية، الأمن والصلاحيات، النشر + Vercel Cron، خارطة طريق مستقبلية.

بعد إنهاء README بالعربية وإضافة ERD في /docs/erd.png وملف API Collection في /docs/api_collection.json، ابدأ التنفيذ التالي بالترتيب:

### [خطة التنفيذ خطوة بخطوة]

**(1) Prisma & Schema & Seed**
- أضف prisma/schema.prisma بكل الجداول المذكورة، وأكتب seed ببيانات تجريبية: مستخدم/عائلة/فئات شائعة/مصاريف 6 أشهر للخلف.
- سكربتات npm: "prisma:dev", "db:seed".
- أنشئ src/server/db.(ts|js) (Prisma client singleton).

**(2) Repositories + Services الأساسية**
- Repositories لكل كيان (CRUD + استعلامات مخصصة: مصاريف الشهر، أفضل 5 فئات، متوسط 3 أشهر).
- Services:
  * budgetService: حساب تجاوز 110% للفئات.
  * reportService: ملخصات شهري/سنوي/عائلي/حسب فئة/عضو.
  * adviceService: توصيات (خفض فئات كبرى، ادخار 10–20%، توصيات أهداف).
  * forecastService: Moving Average + Exponential Smoothing (آخر 3–6 أشهر) وتخزين النتائج في Forecast.

**(3) Routes أساسية (Expenses/Incomes/Categories/Budgets)**
- GET/POST/PUT/DELETE /api/expenses
- GET/POST /api/incomes
- GET/POST /api/categories, GET/POST /api/subcategories
- GET/POST /api/budgets, GET /api/budgets/:id/summary
- Zod للتحقق، JSON موحد للأخطاء.

**(4) التقارير + PDF**
- GET /api/reports/monthly, GET /api/reports/yearly (+ الأنواع الأخرى بالباراميترات).
- PDF شهري عبر @react-pdf/renderer (أو pdfmake) مع: ترويسة هجري/ميلادي، هوامش، ترقيم صفحات، خيارات الإخفاء/الإظهار.
- خزّن قالب PDF في src/server/pdf/monthlyReport.(tsx|ts).

**(5) المناسبات + "ميزانية مناسبة"**
- GET/POST /api/events، وزر يربط بإنشاء Budget مرتبط بالحدث.

**(6) الحساب العائلي + الدعوات + الملخّص**
- POST /api/family/create, POST /api/family/join, GET /api/family/summary.
- الصلاحيات: العضو يرى فقط عائلته.
- الملخص: إجمالي مصاريف الشهر، توزيع الفئات، مساهمة كل فرد، توصيات مشتركة.

**(7) تقسيم الفواتير (Split Bills)**
- POST /api/bills/split ينشئ Bill + BillParticipants وخيار "سجل كمصروفات" ينشئ Expenses حسب الحصص.
- GET /api/bills/:id/status لعرض "من دفع/من عليه".

**(8) OCR الفواتير**
- POST /api/ocr/receipt (FormData صورة). tesseract.js + regex لاستخراج amount/date/categoryGuess.
- يعاد القيم لملء النموذج قبل الحفظ ثم POST /api/expenses.

**(9) التنبؤ + النصائح اليومية + Cron**
- POST /api/forecast/run + GET /api/forecast.
- GET /api/advice/monthly + GET /api/advice/daily-latest.
- Route مجدول: src/app/api/cron/daily-tips/route.(js|ts) لتوليد نصيحة يومية. أضف تعليمات Vercel Cron في README.

**(10) المساعد المالي (Chatbot)**
- POST /api/assistant/ask: الأرقام من reportService، والإجابات بالعربية بقواعد ثابتة. (إن توفر OPENAI_API_KEY حسّن الصياغة فقط، الأرقام دائمًا من القاعدة).

**(11) Stripe الاشتراكات**
- POST /api/stripe/checkout (plan=basic|pro) ⟶ url.
- POST /api/stripe/portal ⟶ url.
- POST /api/stripe/webhook (raw) يتعامل مع:
  * checkout.session.completed ⟶ إنشاء/ربط Subscription و stripeCustomerId.
  * customer.subscription.updated|deleted ⟶ مزامنة الحالة و currentPeriodEnd.
- قيود الخطة: Basic (مثال: 1 عائلة، ≤4 أعضاء، حد تقارير PDF/شهر) و Pro أوسع. لا تغيّر الواجهة.

**(12) العروض/التخفيضات (Placeholder)**
- GET /api/deals/search?region=...&q=... يعيد بيانات تجريبية الآن مع TODO لتكامل خارجي لاحق.

**(13) Hijri/Gregorian**
- تأكد من العرض المزدوج في التقارير والواجهة عبر Intl، وخيار تبديل إن لم يكن موجودًا.

**(14) الحماية والجلسات**
- استخدم Session بسيطة (Cookie) أو NextAuth (Credentials) و Helper getUserIdOrThrow().
- حماية مسارات العائلة والاشتراك وفق الجلسة والخطة.

**(15) الاختبارات اليدوية والقبول**
- أضف /docs/tests.http أو مجموعة Thunder/Postman لاختبار كل Endpoint.
- تحقق وظيفيًا من: تنبيه 110%، PDF، OCR، Split Bills، Family Summary، Forecast، Advice Cron، Stripe Checkout/Portal/Webhook.

**(16) التنظيف والتوثيق**
- إزالة أي Stubs قديمة.
- تحديث README بالعربية بالنتيجة النهائية، مع لقطات شاشة إن لزم.
- افتح PR بعنوان: "إتمام Back-End & API: Budgets/Reports/Stripe/OCR/AI/Family/Split".

### [ملاحظات حرجة]
- الواجهة ثابتة بصريًا (Pixel‑perfect).
- التواريخ والعملة تراعي إعدادات المستخدم/العائلة.
- الأداء: فهارس Prisma المناسبة ومعاملات Transactions عندما يلزم.
- كل الكود والـ README يُرفقان مع رسائل كومِت عربية واضحة لسهولة المراجعة.

**ابدأ الآن: اكتب README بالعربية ثم نفّذ المهام بالترتيب أعلاه مع كومِتات صغيرة منظمة.**

---

## ملاحظات التطوير

- تم إنشاء هذا الملف لحفظ التعليمات المطولة
- يمكن تحديث المحتوى حسب الحاجة
- الملف متاح لجميع أعضاء الفريق

---

## تاريخ التحديثات

- **إنشاء الملف**: 30/09/2025
- **آخر تحديث**: 30/09/2025
- **إضافة البرومبت الكامل**: 30/09/2025

---

*ملاحظة: هذا الملف خاص بالتطوير ولا يؤثر على وظائف التطبيق*
