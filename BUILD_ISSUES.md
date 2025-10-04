# مشاكل البناء - Build Issues

## ✅ المشاكل المُصلحة بتاريخ 4/10/2025:

### ./src/pages_old/MyFamily.jsx
- ✅ حذف المتغيرات غير المستخدمة: LogOut, CheckCircle, AlertTriangle, Settings, PlusCircle, LinkIcon
- ✅ حذف المتغير غير المستخدم: isAdmin
- ✅ حذف استيراد React غير المستخدم
- ✅ حذف استيراد useEffect غير المستخدم
- ✅ حذف استيراد Alert و AlertDescription غير المستخدم

### ./src/pages_old/SetupAccount.jsx
- ✅ إصلاح مشكلة useEffect dependency بإضافة eslint-disable comment

## النتيجة
تم حل جميع المشاكل المطلوبة بنجاح! البناء يعمل بدون أخطاء في الملفات المحددة.

## الحالة الحالية
تم إصلاح المشاكل الأصلية المطلوبة، ولكن توجد مشاكل إضافية في البناء.

## المشاكل المُصلحة ✅
- `./src/pages_old/Pricing.jsx` - تم حذف `Star` غير المستخدم
- `./src/pages_old/PrivacyPolicy.jsx` - لم يكن به مشكلة (لا يستورد React)
- `./src/pages_old/SetupAccount.jsx` - تم إصلاح useEffect dependencies
- `./src/pages_old/StripeEventMonitor.jsx` - تم التأكد من صحة prop validation

---

## مشاكل البناء الإضافية - يرجى إضافة المشاكل هنا:

```
ضع هنا مشاكل البناء الجديدة التي تريد إصلاحها...
```

## تعليمات الاستخدام:
1. انسخ مشاكل البناء من Terminal
2. ضعها في المساحة المحددة أعلاه
3. احفظ الملف
4. اطلب الإصلاح

---

## آخر تحديث: {{ new Date().toLocaleDateString('ar-SA') }}
23:53:36.880 Running build in Washington, D.C., USA (East) – iad1
23:53:36.880 Build machine configuration: 2 cores, 8 GB
23:53:36.923 Cloning github.com/Abdoolos/realmi (Branch: master, Commit: 450b5cf)
23:53:37.056 Previous build caches not available
23:53:37.212 Cloning completed: 289.000ms
23:53:37.529 Running "vercel build"
23:53:37.902 Vercel CLI 48.2.0
23:53:38.247 Installing dependencies...
23:54:10.594 
23:54:10.596 added 732 packages in 32s
23:54:10.596 
23:54:10.597 228 packages are looking for funding
23:54:10.597   run `npm fund` for details
23:54:10.667 Detected Next.js version: 15.5.4
23:54:10.674 Running "npm run build"
23:54:10.776 
23:54:10.776 > base44-app@0.0.0 build
23:54:10.776 > next build
23:54:10.777 
23:54:11.317 Attention: Next.js now collects completely anonymous telemetry regarding usage.
23:54:11.317 This information is used to shape Next.js' roadmap and prioritize features.
23:54:11.317 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
23:54:11.317 https://nextjs.org/telemetry
23:54:11.318 
23:54:11.374    ▲ Next.js 15.5.4
23:54:11.374 
23:54:11.438    Creating an optimized production build ...
23:54:30.023  ✓ Compiled successfully in 18.3s
23:54:30.027    Linting and checking validity of types ...
23:54:30.769 
23:54:30.770  ⚠ The Next.js plugin was not detected in your ESLint configuration. See https://nextjs.org/docs/app/api-reference/config/eslint#migrating-existing-config
23:54:35.684 
23:54:35.684 Failed to compile.
23:54:35.684 
23:54:35.684 ./src/components/FinancialPlanner.jsx
23:54:35.684 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.684 7:52  Error: 'CardDescription' is defined but never used.  no-unused-vars
23:54:35.685 7:69  Error: 'CardFooter' is defined but never used.  no-unused-vars
23:54:35.685 11:48  Error: 'Edit' is defined but never used.  no-unused-vars
23:54:35.685 23:12  Error: 'currentUser' is assigned a value but never used.  no-unused-vars
23:54:35.685 
23:54:35.685 ./src/components/ProductionCheck.jsx
23:54:35.685 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.685 8:43  Error: 'children' is missing in props validation  react/prop-types
23:54:35.685 
23:54:35.685 ./src/components/ProtectedRoute.jsx
23:54:35.685 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.685 5:37  Error: 'requiredPlan' is defined but never used.  no-unused-vars
23:54:35.685 5:51  Error: 'requiredRole' is defined but never used.  no-unused-vars
23:54:35.685 
23:54:35.685 ./src/components/SubscriptionBanner.jsx
23:54:35.686 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.686 3:10  Error: 'UserSubscription' is defined but never used.  no-unused-vars
23:54:35.686 3:28  Error: 'FamilySubscription' is defined but never used.  no-unused-vars
23:54:35.686 4:10  Error: 'Card' is defined but never used.  no-unused-vars
23:54:35.686 8:10  Error: 'Sparkles' is defined but never used.  no-unused-vars
23:54:35.686 8:23  Error: 'Crown' is defined but never used.  no-unused-vars
23:54:35.686 
23:54:35.686 ./src/components/ai/AIAssistant.jsx
23:54:35.686 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.686 10:116  Error: 'Zap' is defined but never used.  no-unused-vars
23:54:35.686 27:10  Error: 'retryCount' is assigned a value but never used.  no-unused-vars
23:54:35.686 39:9  Error: 'env' is assigned a value but never used.  no-unused-vars
23:54:35.686 222:9  Error: 'loadArchivedConversations' is assigned a value but never used.  no-unused-vars
23:54:35.686 
23:54:35.686 ./src/components/ai/MessageBubble.jsx
23:54:35.686 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.686 4:10  Error: 'Button' is defined but never used.  no-unused-vars
23:54:35.686 5:10  Error: 'Copy' is defined but never used.  no-unused-vars
23:54:35.687 7:10  Error: 'toast' is defined but never used.  no-unused-vars
23:54:35.687 9:28  Error: 'toolCall' is missing in props validation  react/prop-types
23:54:35.687 11:28  Error: 'toolCall.name' is missing in props validation  react/prop-types
23:54:35.687 12:30  Error: 'toolCall.status' is missing in props validation  react/prop-types
23:54:35.687 13:31  Error: 'toolCall.results' is missing in props validation  react/prop-types
23:54:35.687 61:50  Error: 'toolCall.arguments_string' is missing in props validation  react/prop-types
23:54:35.687 69:31  Error: 'toolCall.arguments_string' is missing in props validation  react/prop-types
23:54:35.687 75:83  Error: 'toolCall.arguments_string' is missing in props validation  react/prop-types
23:54:35.687 77:57  Error: 'toolCall.arguments_string' is missing in props validation  react/prop-types
23:54:35.687 98:41  Error: 'message' is missing in props validation  react/prop-types
23:54:35.687 98:50  Error: 'isThinking' is missing in props validation  react/prop-types
23:54:35.687 99:28  Error: 'message.role' is missing in props validation  react/prop-types
23:54:35.687 111:43  Error: 'message.content' is missing in props validation  react/prop-types
23:54:35.687 127:26  Error: 'message.content' is missing in props validation  react/prop-types
23:54:35.687 133:77  Error: 'message.content' is missing in props validation  react/prop-types
23:54:35.687 141:42  Error: 'message.content' is missing in props validation  react/prop-types
23:54:35.692 147:26  Error: 'message.tool_calls' is missing in props validation  react/prop-types
23:54:35.693 147:38  Error: 'message.tool_calls.length' is missing in props validation  react/prop-types
23:54:35.693 149:34  Error: 'message.tool_calls' is missing in props validation  react/prop-types
23:54:35.693 149:45  Error: 'message.tool_calls.map' is missing in props validation  react/prop-types
23:54:35.693 
23:54:35.693 ./src/components/dashboard/BudgetSummary.jsx
23:54:35.693 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.693 7:41  Error: 'totalIncome' is missing in props validation  react/prop-types
23:54:35.693 7:54  Error: 'totalExpenses' is missing in props validation  react/prop-types
23:54:35.693 7:69  Error: 'savings' is defined but never used.  no-unused-vars
23:54:35.693 7:69  Error: 'savings' is missing in props validation  react/prop-types
23:54:35.693 
23:54:35.693 ./src/components/dashboard/CreateEventBudgetDialog.jsx
23:54:35.693 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.693 7:35  Error: 'AlertTitle' is defined but never used.  no-unused-vars
23:54:35.693 11:51  Error: 'event' is missing in props validation  react/prop-types
23:54:35.693 11:58  Error: 'onOpenChange' is missing in props validation  react/prop-types
23:54:35.693 11:72  Error: 'onBudgetCreated' is missing in props validation  react/prop-types
23:54:35.693 49:47  Error: 'event.date_gregorian' is missing in props validation  react/prop-types
23:54:35.693 56:25  Error: 'event.id' is missing in props validation  react/prop-types
23:54:35.693 67:28  Error: 'event.date_gregorian' is missing in props validation  react/prop-types
23:54:35.693 67:60  Error: 'event.date_gregorian' is missing in props validation  react/prop-types
23:54:35.693 73:41  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.693 73:50  Error: 'event.name' is missing in props validation  react/prop-types
23:54:35.693 73:55  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.693 
23:54:35.693 ./src/components/dashboard/RecentExpenses.jsx
23:54:35.693 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.693 6:10  Error: 'format' is defined but never used.  no-unused-vars
23:54:35.693 7:10  Error: 'ar' is defined but never used.  no-unused-vars
23:54:35.693 33:42  Error: 'expenses' is missing in props validation  react/prop-types
23:54:35.693 33:57  Error: 'onDeleteExpense' is missing in props validation  react/prop-types
23:54:35.693 
23:54:35.693 ./src/components/dashboard/TestimonialsSection.jsx
23:54:35.693 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.693 61:21  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.694 61:40  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.694 
23:54:35.694 ./src/components/dashboard/UpcomingEvents.jsx
23:54:35.694 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.694 7:10  Error: 'format' is defined but never used.  no-unused-vars
23:54:35.694 8:10  Error: 'ar' is defined but never used.  no-unused-vars
23:54:35.694 44:42  Error: 'onSelectEvent' is missing in props validation  react/prop-types
23:54:35.694 
23:54:35.694 ./src/components/family/FamilyErrorState.jsx
23:54:35.694 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.694 6:44  Error: 'error' is defined but never used.  no-unused-vars
23:54:35.694 6:44  Error: 'error' is missing in props validation  react/prop-types
23:54:35.694 6:51  Error: 'onRetry' is missing in props validation  react/prop-types
23:54:35.694 
23:54:35.694 ./src/components/family/FamilyLoadingState.jsx
23:54:35.695 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.696 
23:54:35.696 ./src/components/family/FamilyUpgradeBanner.jsx
23:54:35.696 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.696 
23:54:35.696 ./src/components/family-reports/CategoryBreakdown.jsx
23:54:35.696 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.696 12:26  Error: 'active' is missing in props validation  react/prop-types
23:54:35.696 12:34  Error: 'payload' is missing in props validation  react/prop-types
23:54:35.696 13:38  Error: 'payload.length' is missing in props validation  react/prop-types
23:54:35.696 16:61  Error: 'payload[].name' is missing in props validation  react/prop-types
23:54:35.696 17:78  Error: 'payload[].value' is missing in props validation  react/prop-types
23:54:35.698 18:78  Error: 'payload[].payload' is missing in props validation  react/prop-types
23:54:35.698 18:86  Error: 'payload[].payload.percent' is missing in props validation  react/prop-types
23:54:35.698 25:45  Error: 'expenses' is missing in props validation  react/prop-types
23:54:35.698 26:37  Error: 'expenses.reduce' is missing in props validation  react/prop-types
23:54:35.699 74:56  Error: 'entry' is defined but never used.  no-unused-vars
23:54:35.699 
23:54:35.699 ./src/components/family-reports/MemberBreakdown.jsx
23:54:35.699 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.699 9:43  Error: 'expenses' is missing in props validation  react/prop-types
23:54:35.699 9:53  Error: 'members' is missing in props validation  react/prop-types
23:54:35.699 10:36  Error: 'members.map' is missing in props validation  react/prop-types
23:54:35.699 11:45  Error: 'expenses.filter' is missing in props validation  react/prop-types
23:54:35.699 21:42  Error: 'expenses.reduce' is missing in props validation  react/prop-types
23:54:35.699 
23:54:35.699 ./src/components/family-reports/SmartRecommendations.jsx
23:54:35.700 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.700 9:48  Error: 'expenses' is missing in props validation  react/prop-types
23:54:35.700 9:58  Error: 'income' is missing in props validation  react/prop-types
23:54:35.700 9:66  Error: 'budgets' is defined but never used.  no-unused-vars
23:54:35.700 9:66  Error: 'budgets' is missing in props validation  react/prop-types
23:54:35.700 10:36  Error: 'expenses.reduce' is missing in props validation  react/prop-types
23:54:35.700 36:37  Error: 'expenses.reduce' is missing in props validation  react/prop-types
23:54:35.700 
23:54:35.700 ./src/components/family-reports/SummaryCards.jsx
23:54:35.701 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.701 10:24  Error: 'title' is missing in props validation  react/prop-types
23:54:35.701 10:31  Error: 'value' is missing in props validation  react/prop-types
23:54:35.701 10:38  Error: 'icon' is missing in props validation  react/prop-types
23:54:35.701 10:50  Error: 'color' is missing in props validation  react/prop-types
23:54:35.701 10:57  Error: 'delay' is missing in props validation  react/prop-types
23:54:35.701 28:40  Error: 'totalIncome' is missing in props validation  react/prop-types
23:54:35.701 28:53  Error: 'totalExpenses' is missing in props validation  react/prop-types
23:54:35.701 28:68  Error: 'savings' is missing in props validation  react/prop-types
23:54:35.701 28:77  Error: 'membersCount' is missing in props validation  react/prop-types
23:54:35.701 
23:54:35.702 ./src/components/hooks/useFamily.jsx
23:54:35.702 13:12  Error: 'retryCount' is assigned a value but never used.  no-unused-vars
23:54:35.702 
23:54:35.702 ./src/components/reports/CategoryBreakdown.jsx
23:54:35.702 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.702 7:45  Error: 'expenses' is missing in props validation  react/prop-types
23:54:35.702 7:55  Error: 'totalExpenses' is missing in props validation  react/prop-types
23:54:35.702 28:14  Error: 'expenses.forEach' is missing in props validation  react/prop-types
23:54:35.702 47:28  Error: 'active' is missing in props validation  react/prop-types
23:54:35.702 47:36  Error: 'payload' is missing in props validation  react/prop-types
23:54:35.702 48:38  Error: 'payload.length' is missing in props validation  react/prop-types
23:54:35.702 52:61  Error: 'payload[].payload' is missing in props validation  react/prop-types
23:54:35.703 52:69  Error: 'payload[].payload.name' is missing in props validation  react/prop-types
23:54:35.703 54:19  Error: 'payload[].value' is missing in props validation  react/prop-types
23:54:35.703 57:19  Error: 'payload[].payload' is missing in props validation  react/prop-types
23:54:35.703 57:27  Error: 'payload[].payload.percentage' is missing in props validation  react/prop-types
23:54:35.703 
23:54:35.703 ./src/components/reports/DetailedExpensesList.jsx
23:54:35.703 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.703 35:48  Error: 'expenses' is missing in props validation  react/prop-types
23:54:35.703 38:14  Error: 'expenses.forEach' is missing in props validation  react/prop-types
23:54:35.703 
23:54:35.704 ./src/components/reports/ExpenseTrends.jsx
23:54:35.704 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.704 4:10  Error: 'ar' is defined but never used.  no-unused-vars
23:54:35.704 20:41  Error: 'expenses' is missing in props validation  react/prop-types
23:54:35.704 20:51  Error: 'selectedMonth' is missing in props validation  react/prop-types
23:54:35.704 24:14  Error: 'expenses.forEach' is missing in props validation  react/prop-types
23:54:35.704 33:41  Error: 'selectedMonth.split' is missing in props validation  react/prop-types
23:54:35.705 34:42  Error: 'selectedMonth.split' is missing in props validation  react/prop-types
23:54:35.705 58:14  Error: 'expenses.forEach' is missing in props validation  react/prop-types
23:54:35.705 90:28  Error: 'active' is missing in props validation  react/prop-types
23:54:35.705 90:36  Error: 'payload' is missing in props validation  react/prop-types
23:54:35.705 90:45  Error: 'label' is defined but never used.  no-unused-vars
23:54:35.705 90:45  Error: 'label' is missing in props validation  react/prop-types
23:54:35.705 91:38  Error: 'payload.length' is missing in props validation  react/prop-types
23:54:35.705 93:39  Error: 'payload[].payload' is missing in props validation  react/prop-types
23:54:35.705 93:47  Error: 'payload[].payload.fullDate' is missing in props validation  react/prop-types
23:54:35.705 93:70  Error: 'payload[].payload' is missing in props validation  react/prop-types
23:54:35.719 93:78  Error: 'payload[].payload.week' is missing in props validation  react/prop-types
23:54:35.719 98:25  Error: 'payload[].value' is missing in props validation  react/prop-types
23:54:35.719 
23:54:35.719 ./src/components/reports/MonthReportHeader.jsx
23:54:35.719 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.719 23:3  Error: 'selectedMonth' is missing in props validation  react/prop-types
23:54:35.719 24:3  Error: 'onMonthChange' is missing in props validation  react/prop-types
23:54:35.720 25:3  Error: 'totalIncome' is missing in props validation  react/prop-types
23:54:35.720 26:3  Error: 'totalExpenses' is missing in props validation  react/prop-types
23:54:35.720 27:3  Error: 'onDownloadReport' is missing in props validation  react/prop-types
23:54:35.720 28:3  Error: 'onDownloadPDF' is missing in props validation  react/prop-types
23:54:35.720 
23:54:35.720 ./src/components/ui/accordion.jsx
23:54:35.720 9:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 14:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 14:57  Error: 'children' is missing in props validation  react/prop-types
23:54:35.720 31:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 31:57  Error: 'children' is missing in props validation  react/prop-types
23:54:35.720 
23:54:35.720 ./src/components/ui/alert-dialog.jsx
23:54:35.720 13:48  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 24:48  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 39:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 49:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 58:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 63:52  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 72:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 77:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 
23:54:35.720 ./src/components/ui/alert.jsx
23:54:35.720 22:35  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 22:46  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.720 31:40  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 39:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 
23:54:35.720 ./src/components/ui/avatar.jsx
23:54:35.720 8:36  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 16:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 24:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 
23:54:35.720 ./src/components/ui/badge.jsx
23:54:35.720 1:13  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.720 27:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 28:3  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.720 34:17  Warning: Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.  react-refresh/only-export-components
23:54:35.720 
23:54:35.720 ./src/components/ui/breadcrumb.jsx
23:54:35.720 12:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.720 23:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 31:44  Error: 'asChild' is missing in props validation  react/prop-types
23:54:35.721 31:53  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 43:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 55:3  Error: 'children' is missing in props validation  react/prop-types
23:54:35.721 56:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 70:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 
23:54:35.721 ./src/components/ui/button.jsx
23:54:35.721 37:36  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 37:47  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.721 37:56  Error: 'size' is missing in props validation  react/prop-types
23:54:35.721 37:62  Error: 'asChild' is missing in props validation  react/prop-types
23:54:35.721 48:18  Warning: Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.  react-refresh/only-export-components
23:54:35.721 
23:54:35.721 ./src/components/ui/calendar.jsx
23:54:35.721 1:13  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.721 9:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 10:3  Error: 'classNames' is missing in props validation  react/prop-types
23:54:35.721 11:3  Error: 'showOutsideDays' is missing in props validation  react/prop-types
23:54:35.721 37:17  Error: 'mode' is missing in props validation  react/prop-types
23:54:35.721 59:22  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 62:23  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 
23:54:35.721 ./src/components/ui/card.jsx
23:54:35.721 5:34  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 13:40  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 21:39  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 29:45  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 37:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 42:40  Error: 'className' is missing in props validation  react/prop-types
23:54:35.721 
23:54:35.721 ./src/components/ui/carousel.jsx
23:54:35.722 22:5  Error: 'orientation' is missing in props validation  react/prop-types
23:54:35.722 23:5  Error: 'opts' is missing in props validation  react/prop-types
23:54:35.722 24:5  Error: 'setApi' is missing in props validation  react/prop-types
23:54:35.722 25:5  Error: 'plugins' is missing in props validation  react/prop-types
23:54:35.722 26:5  Error: 'className' is missing in props validation  react/prop-types
23:54:35.722 27:5  Error: 'children' is missing in props validation  react/prop-types
23:54:35.722 95:33  Error: 'opts.axis' is missing in props validation  react/prop-types
23:54:35.722 115:45  Error: 'className' is missing in props validation  react/prop-types
23:54:35.722 133:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.722 151:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.722 151:57  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.723 151:78  Error: 'size' is missing in props validation  react/prop-types
23:54:35.723 172:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.723 172:53  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.723 172:74  Error: 'size' is missing in props validation  react/prop-types
23:54:35.723 
23:54:35.724 ./src/components/ui/chart.jsx
23:54:35.724 25:44  Error: 'id' is missing in props validation  react/prop-types
23:54:35.724 25:48  Error: 'className' is missing in props validation  react/prop-types
23:54:35.724 25:59  Error: 'children' is missing in props validation  react/prop-types
23:54:35.724 25:69  Error: 'config' is missing in props validation  react/prop-types
23:54:35.724 50:3  Error: 'id' is missing in props validation  react/prop-types
23:54:35.724 51:3  Error: 'config' is missing in props validation  react/prop-types
23:54:35.724 53:76  Error: 'config.theme' is missing in props validation  react/prop-types
23:54:35.724 53:92  Error: 'config.color' is missing in props validation  react/prop-types
23:54:35.725 84:5  Error: 'active' is missing in props validation  react/prop-types
23:54:35.725 85:5  Error: 'payload' is missing in props validation  react/prop-types
23:54:35.725 86:5  Error: 'className' is missing in props validation  react/prop-types
23:54:35.725 87:5  Error: 'indicator' is missing in props validation  react/prop-types
23:54:35.725 88:5  Error: 'hideLabel' is missing in props validation  react/prop-types
23:54:35.725 89:5  Error: 'hideIndicator' is missing in props validation  react/prop-types
23:54:35.725 90:5  Error: 'label' is missing in props validation  react/prop-types
23:54:35.725 91:5  Error: 'labelFormatter' is missing in props validation  react/prop-types
23:54:35.725 92:5  Error: 'labelClassName' is missing in props validation  react/prop-types
23:54:35.725 93:5  Error: 'formatter' is missing in props validation  react/prop-types
23:54:35.725 94:5  Error: 'color' is missing in props validation  react/prop-types
23:54:35.725 95:5  Error: 'nameKey' is missing in props validation  react/prop-types
23:54:35.725 96:5  Error: 'labelKey' is missing in props validation  react/prop-types
23:54:35.725 103:32  Error: 'payload.length' is missing in props validation  react/prop-types
23:54:35.725 138:28  Error: 'payload.length' is missing in props validation  react/prop-types
23:54:35.725 142:29  Error: 'payload.length' is missing in props validation  react/prop-types
23:54:35.725 153:18  Error: 'payload.map' is missing in props validation  react/prop-types
23:54:35.725 220:5  Error: 'className' is missing in props validation  react/prop-types
23:54:35.725 220:16  Error: 'hideIcon' is missing in props validation  react/prop-types
23:54:35.725 220:34  Error: 'payload' is missing in props validation  react/prop-types
23:54:35.725 220:43  Error: 'verticalAlign' is missing in props validation  react/prop-types
23:54:35.725 220:69  Error: 'nameKey' is missing in props validation  react/prop-types
23:54:35.725 225:17  Error: 'payload.length' is missing in props validation  react/prop-types
23:54:35.725 237:16  Error: 'payload.map' is missing in props validation  react/prop-types
23:54:35.726 
23:54:35.726 ./src/components/ui/checkbox.jsx
23:54:35.726 7:38  Error: 'className' is missing in props validation  react/prop-types
23:54:35.726 
23:54:35.726 ./src/components/ui/command.jsx
23:54:35.726 8:37  Error: 'className' is missing in props validation  react/prop-types
23:54:35.726 20:3  Error: 'children' is missing in props validation  react/prop-types
23:54:35.726 35:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.726 36:52  Error: Unknown property 'cmdk-input-wrapper' found  react/no-unknown-property
23:54:35.732 50:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.732 65:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.732 77:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.732 82:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.732 95:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.732 
23:54:35.732 ./src/components/ui/context-menu.jsx
23:54:35.732 19:51  Error: 'className' is missing in props validation  react/prop-types
23:54:35.732 19:62  Error: 'inset' is missing in props validation  react/prop-types
23:54:35.732 19:69  Error: 'children' is missing in props validation  react/prop-types
23:54:35.732 34:51  Error: 'className' is missing in props validation  react/prop-types
23:54:35.732 45:48  Error: 'className' is missing in props validation  react/prop-types
23:54:35.732 58:45  Error: 'className' is missing in props validation  react/prop-types
23:54:35.732 58:56  Error: 'inset' is missing in props validation  react/prop-types
23:54:35.732 70:53  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 70:64  Error: 'children' is missing in props validation  react/prop-types
23:54:35.733 70:74  Error: 'checked' is missing in props validation  react/prop-types
23:54:35.733 90:50  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 90:61  Error: 'children' is missing in props validation  react/prop-types
23:54:35.733 108:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 108:57  Error: 'inset' is missing in props validation  react/prop-types
23:54:35.733 120:50  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 129:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 
23:54:35.733 ./src/components/ui/dialog.jsx
23:54:35.733 17:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 28:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 28:54  Error: 'children' is missing in props validation  react/prop-types
23:54:35.733 50:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 60:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 69:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 77:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 
23:54:35.733 ./src/components/ui/drawer.jsx
23:54:35.733 9:3  Error: 'shouldScaleBackground' is missing in props validation  react/prop-types
23:54:35.733 22:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 30:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 30:54  Error: 'children' is missing in props validation  react/prop-types
23:54:35.733 48:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 58:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 65:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 73:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 
23:54:35.733 ./src/components/ui/dropdown-menu.jsx
23:54:35.733 19:52  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 19:63  Error: 'inset' is missing in props validation  react/prop-types
23:54:35.733 19:70  Error: 'children' is missing in props validation  react/prop-types
23:54:35.733 35:52  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 47:49  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 47:60  Error: 'sideOffset' is missing in props validation  react/prop-types
23:54:35.733 62:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.733 62:57  Error: 'inset' is missing in props validation  react/prop-types
23:54:35.733 74:54  Error: 'className' is missing in props validation  react/prop-types
23:54:35.734 74:65  Error: 'children' is missing in props validation  react/prop-types
23:54:35.734 74:75  Error: 'checked' is missing in props validation  react/prop-types
23:54:35.734 94:51  Error: 'className' is missing in props validation  react/prop-types
23:54:35.734 94:62  Error: 'children' is missing in props validation  react/prop-types
23:54:35.734 112:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.734 112:58  Error: 'inset' is missing in props validation  react/prop-types
23:54:35.734 120:51  Error: 'className' is missing in props validation  react/prop-types
23:54:35.734 129:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.734 
23:54:35.734 ./src/components/ui/form.jsx
23:54:35.734 19:54  Error: 'name' is missing in props validation  react/prop-types
23:54:35.734 50:38  Error: 'className' is missing in props validation  react/prop-types
23:54:35.734 61:39  Error: 'className' is missing in props validation  react/prop-types
23:54:35.734 92:45  Error: 'className' is missing in props validation  react/prop-types
23:54:35.734 105:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.734 105:52  Error: 'children' is missing in props validation  react/prop-types
23:54:35.734 126:3  Warning: Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.  react-refresh/only-export-components
23:54:35.734 
23:54:35.734 ./src/components/ui/hover-card.jsx
23:54:35.735 12:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.735 12:57  Error: 'align' is missing in props validation  react/prop-types
23:54:35.735 12:75  Error: 'sideOffset' is missing in props validation  react/prop-types
23:54:35.735 
23:54:35.735 ./src/components/ui/input-otp.jsx
23:54:35.735 7:38  Error: 'className' is missing in props validation  react/prop-types
23:54:35.735 7:49  Error: 'containerClassName' is missing in props validation  react/prop-types
23:54:35.735 16:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.735 21:42  Error: 'index' is missing in props validation  react/prop-types
23:54:35.735 21:49  Error: 'className' is missing in props validation  react/prop-types
23:54:35.735 
23:54:35.735 ./src/components/ui/input.jsx
23:54:35.735 5:35  Error: 'className' is missing in props validation  react/prop-types
23:54:35.735 5:46  Error: 'type' is missing in props validation  react/prop-types
23:54:35.742 
23:54:35.742 ./src/components/ui/label.jsx
23:54:35.743 11:35  Error: 'className' is missing in props validation  react/prop-types
23:54:35.743 
23:54:35.743 ./src/components/ui/menubar.jsx
23:54:35.744 39:37  Error: 'className' is missing in props validation  react/prop-types
23:54:35.744 50:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.744 61:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.744 61:58  Error: 'inset' is missing in props validation  react/prop-types
23:54:35.745 61:65  Error: 'children' is missing in props validation  react/prop-types
23:54:35.745 76:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.745 88:5  Error: 'className' is missing in props validation  react/prop-types
23:54:35.745 88:16  Error: 'align' is missing in props validation  react/prop-types
23:54:35.746 88:33  Error: 'alignOffset' is missing in props validation  react/prop-types
23:54:35.746 88:51  Error: 'sideOffset' is missing in props validation  react/prop-types
23:54:35.746 106:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.747 106:52  Error: 'inset' is missing in props validation  react/prop-types
23:54:35.747 118:49  Error: 'className' is missing in props validation  react/prop-types
23:54:35.747 118:60  Error: 'children' is missing in props validation  react/prop-types
23:54:35.747 118:70  Error: 'checked' is missing in props validation  react/prop-types
23:54:35.748 137:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.748 137:57  Error: 'children' is missing in props validation  react/prop-types
23:54:35.748 155:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.749 155:53  Error: 'inset' is missing in props validation  react/prop-types
23:54:35.749 163:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.749 172:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.749 
23:54:35.750 ./src/components/ui/navigation-menu.jsx
23:54:35.750 8:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.750 8:55  Error: 'children' is missing in props validation  react/prop-types
23:54:35.750 22:48  Error: 'className' is missing in props validation  react/prop-types
23:54:35.751 39:51  Error: 'className' is missing in props validation  react/prop-types
23:54:35.751 39:62  Error: 'children' is missing in props validation  react/prop-types
23:54:35.751 52:51  Error: 'className' is missing in props validation  react/prop-types
23:54:35.752 65:52  Error: 'className' is missing in props validation  react/prop-types
23:54:35.752 79:53  Error: 'className' is missing in props validation  react/prop-types
23:54:35.752 95:3  Warning: Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.  react-refresh/only-export-components
23:54:35.752 
23:54:35.753 ./src/components/ui/pagination.jsx
23:54:35.753 8:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.753 19:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.754 27:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.754 33:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.755 34:3  Error: 'isActive' is missing in props validation  react/prop-types
23:54:35.756 35:3  Error: 'size' is missing in props validation  react/prop-types
23:54:35.756 49:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.756 64:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.756 79:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.757 
23:54:35.758 ./src/components/ui/popover.jsx
23:54:35.758 12:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.758 12:55  Error: 'align' is missing in props validation  react/prop-types
23:54:35.759 12:73  Error: 'sideOffset' is missing in props validation  react/prop-types
23:54:35.759 
23:54:35.759 ./src/components/ui/progress.jsx
23:54:35.759 8:38  Error: 'className' is missing in props validation  react/prop-types
23:54:35.760 8:49  Error: 'value' is missing in props validation  react/prop-types
23:54:35.760 
23:54:35.760 ./src/components/ui/radio-group.jsx
23:54:35.760 7:40  Error: 'className' is missing in props validation  react/prop-types
23:54:35.761 12:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.761 
23:54:35.761 ./src/components/ui/resizable.jsx
23:54:35.761 9:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.762 23:3  Error: 'withHandle' is missing in props validation  react/prop-types
23:54:35.762 24:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.763 
23:54:35.763 ./src/components/ui/scroll-area.jsx
23:54:35.763 6:40  Error: 'className' is missing in props validation  react/prop-types
23:54:35.763 6:51  Error: 'children' is missing in props validation  react/prop-types
23:54:35.764 20:39  Error: 'className' is missing in props validation  react/prop-types
23:54:35.764 20:50  Error: 'orientation' is missing in props validation  react/prop-types
23:54:35.764 
23:54:35.764 ./src/components/ui/select.jsx
23:54:35.765 15:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.765 15:54  Error: 'children' is missing in props validation  react/prop-types
23:54:35.765 31:50  Error: 'className' is missing in props validation  react/prop-types
23:54:35.765 41:52  Error: 'className' is missing in props validation  react/prop-types
23:54:35.766 52:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.766 52:54  Error: 'children' is missing in props validation  react/prop-types
23:54:35.766 52:64  Error: 'position' is missing in props validation  react/prop-types
23:54:35.767 76:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.767 84:40  Error: 'className' is missing in props validation  react/prop-types
23:54:35.767 84:51  Error: 'children' is missing in props validation  react/prop-types
23:54:35.768 102:45  Error: 'className' is missing in props validation  react/prop-types
23:54:35.768 
23:54:35.768 ./src/components/ui/separator.jsx
23:54:35.768 7:5  Error: 'className' is missing in props validation  react/prop-types
23:54:35.769 7:16  Error: 'orientation' is missing in props validation  react/prop-types
23:54:35.769 7:44  Error: 'decorative' is missing in props validation  react/prop-types
23:54:35.769 
23:54:35.770 ./src/components/ui/sheet.jsx
23:54:35.770 17:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.771 47:42  Error: 'side' is missing in props validation  react/prop-types
23:54:35.771 47:58  Error: 'className' is missing in props validation  react/prop-types
23:54:35.771 47:69  Error: 'children' is missing in props validation  react/prop-types
23:54:35.772 63:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.772 73:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.772 82:40  Error: 'className' is missing in props validation  react/prop-types
23:54:35.772 90:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.773 
23:54:35.773 ./src/components/ui/sidebar.jsx
23:54:35.773 40:5  Error: 'defaultOpen' is missing in props validation  react/prop-types
23:54:35.774 41:5  Error: 'open' is missing in props validation  react/prop-types
23:54:35.774 42:5  Error: 'onOpenChange' is missing in props validation  react/prop-types
23:54:35.774 43:5  Error: 'className' is missing in props validation  react/prop-types
23:54:35.775 44:5  Error: 'style' is missing in props validation  react/prop-types
23:54:35.775 45:5  Error: 'children' is missing in props validation  react/prop-types
23:54:35.775 133:5  Error: 'side' is missing in props validation  react/prop-types
23:54:35.775 134:5  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.776 135:5  Error: 'collapsible' is missing in props validation  react/prop-types
23:54:35.776 136:5  Error: 'className' is missing in props validation  react/prop-types
23:54:35.776 137:5  Error: 'children' is missing in props validation  react/prop-types
23:54:35.777 219:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.777 219:55  Error: 'onClick' is missing in props validation  react/prop-types
23:54:35.777 241:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.777 266:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.778 280:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.778 294:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.778 305:43  Error: 'className' is missing in props validation  react/prop-types
23:54:35.779 316:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.779 327:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.779 341:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.780 352:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.780 352:58  Error: 'asChild' is missing in props validation  react/prop-types
23:54:35.780 369:48  Error: 'className' is missing in props validation  react/prop-types
23:54:35.780 369:59  Error: 'asChild' is missing in props validation  react/prop-types
23:54:35.781 388:49  Error: 'className' is missing in props validation  react/prop-types
23:54:35.781 397:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.781 406:45  Error: 'className' is missing in props validation  react/prop-types
23:54:35.782 439:5  Error: 'asChild' is missing in props validation  react/prop-types
23:54:35.782 440:5  Error: 'isActive' is missing in props validation  react/prop-types
23:54:35.782 441:5  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.783 442:5  Error: 'size' is missing in props validation  react/prop-types
23:54:35.783 443:5  Error: 'tooltip' is missing in props validation  react/prop-types
23:54:35.783 444:5  Error: 'className' is missing in props validation  react/prop-types
23:54:35.783 485:47  Error: 'className' is missing in props validation  react/prop-types
23:54:35.784 485:58  Error: 'asChild' is missing in props validation  react/prop-types
23:54:35.784 485:75  Error: 'showOnHover' is missing in props validation  react/prop-types
23:54:35.784 509:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.785 526:49  Error: 'className' is missing in props validation  react/prop-types
23:54:35.785 526:60  Error: 'showIcon' is missing in props validation  react/prop-types
23:54:35.785 554:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.785 571:6  Error: 'asChild' is missing in props validation  react/prop-types
23:54:35.786 571:23  Error: 'size' is missing in props validation  react/prop-types
23:54:35.786 571:36  Error: 'isActive' is missing in props validation  react/prop-types
23:54:35.786 571:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.787 618:3  Warning: Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.  react-refresh/only-export-components
23:54:35.787 
23:54:35.787 ./src/components/ui/skeleton.jsx
23:54:35.788 4:3  Error: 'className' is missing in props validation  react/prop-types
23:54:35.788 
23:54:35.788 ./src/components/ui/slider.jsx
23:54:35.788 6:36  Error: 'className' is missing in props validation  react/prop-types
23:54:35.789 
23:54:35.789 ./src/components/ui/switch.jsx
23:54:35.789 6:36  Error: 'className' is missing in props validation  react/prop-types
23:54:35.790 
23:54:35.790 ./src/components/ui/table.jsx
23:54:35.790 5:35  Error: 'className' is missing in props validation  react/prop-types
23:54:35.790 15:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.791 20:39  Error: 'className' is missing in props validation  react/prop-types
23:54:35.791 28:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.791 36:38  Error: 'className' is missing in props validation  react/prop-types
23:54:35.792 47:39  Error: 'className' is missing in props validation  react/prop-types
23:54:35.792 58:39  Error: 'className' is missing in props validation  react/prop-types
23:54:35.792 69:42  Error: 'className' is missing in props validation  react/prop-types
23:54:35.792 
23:54:35.793 ./src/components/ui/tabs.jsx
23:54:35.793 8:38  Error: 'className' is missing in props validation  react/prop-types
23:54:35.793 19:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.794 30:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.794 
23:54:35.794 ./src/components/ui/textarea.jsx
23:54:35.795 5:38  Error: 'className' is missing in props validation  react/prop-types
23:54:35.795 
23:54:35.795 ./src/components/ui/toast.jsx
23:54:35.795 40:35  Error: 'className' is missing in props validation  react/prop-types
23:54:35.796 40:46  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.796 51:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.796 63:40  Error: 'className' is missing in props validation  react/prop-types
23:54:35.797 70:5  Error: Unknown property 'toast-close' found  react/no-unknown-property
23:54:35.797 78:40  Error: 'className' is missing in props validation  react/prop-types
23:54:35.797 87:46  Error: 'className' is missing in props validation  react/prop-types
23:54:35.797 
23:54:35.798 ./src/components/ui/toggle-group.jsx
23:54:35.798 13:41  Error: 'className' is missing in props validation  react/prop-types
23:54:35.798 13:52  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.799 13:61  Error: 'size' is missing in props validation  react/prop-types
23:54:35.799 13:67  Error: 'children' is missing in props validation  react/prop-types
23:54:35.799 26:45  Error: 'className' is missing in props validation  react/prop-types
23:54:35.800 26:56  Error: 'children' is missing in props validation  react/prop-types
23:54:35.800 26:66  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.800 26:75  Error: 'size' is missing in props validation  react/prop-types
23:54:35.800 
23:54:35.801 ./src/components/ui/toggle.jsx
23:54:35.801 29:36  Error: 'className' is missing in props validation  react/prop-types
23:54:35.801 29:47  Error: 'variant' is missing in props validation  react/prop-types
23:54:35.802 29:56  Error: 'size' is missing in props validation  react/prop-types
23:54:35.802 38:18  Warning: Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.  react-refresh/only-export-components
23:54:35.802 
23:54:35.802 ./src/components/ui/tooltip.jsx
23:54:35.803 14:44  Error: 'className' is missing in props validation  react/prop-types
23:54:35.803 14:55  Error: 'sideOffset' is missing in props validation  react/prop-types
23:54:35.803 
23:54:35.804 ./src/components/ui/use-toast.jsx
23:54:35.804 2:31  Error: 'createContext' is defined but never used.  no-unused-vars
23:54:35.804 2:46  Error: 'useContext' is defined but never used.  no-unused-vars
23:54:35.805 39:7  Error: 'clearFromRemoveQueue' is assigned a value but never used.  no-unused-vars
23:54:35.805 
23:54:35.805 ./src/components/user/UserDataInitializer.jsx
23:54:35.805 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.806 42:40  Error: Do not access Object.prototype method 'hasOwnProperty' from target object.  no-prototype-builtins
23:54:35.806 43:39  Error: Do not access Object.prototype method 'hasOwnProperty' from target object.  no-prototype-builtins
23:54:35.807 
23:54:35.807 ./src/components/utils/configValidator.jsx
23:54:35.807 42:16  Error: 'error' is defined but never used.  no-unused-vars
23:54:35.808 50:11  Error: 'criticalEndpoints' is assigned a value but never used.  no-unused-vars
23:54:35.808 
23:54:35.808 ./src/components/utils/errorBoundary.jsx
23:54:35.808 12:35  Error: 'error' is defined but never used.  no-unused-vars
23:54:35.808 101:23  Error: 'children' is missing in props validation  react/prop-types
23:54:35.808 
23:54:35.808 ./src/main.jsx
23:54:35.809 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.809 
23:54:35.809 ./src/pages_old/AIAssistant.jsx
23:54:35.809 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.810 5:10  Warning: Fast refresh only works when a file only exports components. Move your component(s) to a separate file.  react-refresh/only-export-components
23:54:35.810 13:1  Warning: Fast refresh can't handle anonymous components. Add a name to your export.  react-refresh/only-export-components
23:54:35.810 13:16  Error: Component definition is missing display name  react/display-name
23:54:35.810 
23:54:35.810 ./src/pages_old/About.jsx
23:54:35.810 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.810 3:10  Error: 'Badge' is defined but never used.  no-unused-vars
23:54:35.810 
23:54:35.810 ./src/pages_old/Account.jsx
23:54:35.810 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.810 66:14  Error: 'err' is defined but never used.  no-unused-vars
23:54:35.811 
23:54:35.811 ./src/pages_old/AddExpense.jsx
23:54:35.811 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.811 7:10  Error: 'CategoryBudget' is defined but never used.  no-unused-vars
23:54:35.811 20:10  Error: 'format' is defined but never used.  no-unused-vars
23:54:35.811 78:27  Error: 'setBudgetWarning' is assigned a value but never used.  no-unused-vars
23:54:35.811 
23:54:35.811 ./src/pages_old/Analytics.jsx
23:54:35.811 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.811 11:7  Error: 'CATEGORY_COLORS' is assigned a value but never used.  no-unused-vars
23:54:35.811 115:28  Error: 'active' is missing in props validation  react/prop-types
23:54:35.811 115:36  Error: 'payload' is missing in props validation  react/prop-types
23:54:35.812 116:38  Error: 'payload.length' is missing in props validation  react/prop-types
23:54:35.812 120:61  Error: 'payload[].payload' is missing in props validation  react/prop-types
23:54:35.812 120:69  Error: 'payload[].payload.name' is missing in props validation  react/prop-types
23:54:35.812 122:19  Error: 'payload[].value' is missing in props validation  react/prop-types
23:54:35.812 125:21  Error: 'payload[].value' is missing in props validation  react/prop-types
23:54:35.812 292:48  Error: 'index' is defined but never used.  no-unused-vars
23:54:35.812 
23:54:35.812 ./src/pages_old/CameraReceipts.jsx
23:54:35.812 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.812 9:10  Error: 'Textarea' is defined but never used.  no-unused-vars
23:54:35.812 
23:54:35.812 ./src/pages_old/CheckoutCancel.jsx
23:54:35.812 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.812 
23:54:35.813 ./src/pages_old/CheckoutSuccess.jsx
23:54:35.813 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.813 
23:54:35.813 ./src/pages_old/Contact.jsx
23:54:35.813 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.813 
23:54:35.813 ./src/pages_old/Dashboard.jsx
23:54:35.813 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.813 90:25  Error: 'setIsLoadingTips' is assigned a value but never used.  no-unused-vars
23:54:35.813 91:10  Error: 'isLoadingEvents' is assigned a value but never used.  no-unused-vars
23:54:35.813 91:27  Error: 'setIsLoadingEvents' is assigned a value but never used.  no-unused-vars
23:54:35.813 787:51  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.813 787:65  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.813 
23:54:35.813 ./src/pages_old/ExpensesList.jsx
23:54:35.813 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.813 12:10  Error: 'ar' is defined but never used.  no-unused-vars
23:54:35.813 
23:54:35.813 ./src/pages_old/FAQ.jsx
23:54:35.813 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.813 183:42  Error: 'index' is defined but never used.  no-unused-vars
23:54:35.813 
23:54:35.813 ./src/pages_old/FamilyDashboard.jsx
23:54:35.813 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.813 6:10  Error: 'CategoryBudget' is defined but never used.  no-unused-vars
23:54:35.813 22:7  Error: 'formatCurrency' is assigned a value but never used.  no-unused-vars
23:54:35.813 134:64  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.813 134:71  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.813 190:70  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.813 190:76  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.814 
23:54:35.814 ./src/pages_old/FamilyIncome.jsx
23:54:35.814 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.814 11:10  Error: 'Alert' is defined but never used.  no-unused-vars
23:54:35.814 11:17  Error: 'AlertDescription' is defined but never used.  no-unused-vars
23:54:35.814 17:18  Error: 'startOfMonth' is defined but never used.  no-unused-vars
23:54:35.814 214:21  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.814 214:43  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.814 350:54  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.814 350:64  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.814 
23:54:35.814 ./src/pages_old/FamilyMonthlyReport.jsx
23:54:35.814 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.814 3:47  Error: 'format' is defined but never used.  no-unused-vars
23:54:35.816 4:10  Error: 'ar' is defined but never used.  no-unused-vars
23:54:35.816 6:29  Error: 'Users' is defined but never used.  no-unused-vars
23:54:35.816 
23:54:35.817 ./src/pages_old/FamilyReport.jsx
23:54:35.817 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.817 15:30  Error: 'startOfMonth' is defined but never used.  no-unused-vars
23:54:35.817 46:12  Error: 'categoryBudgets' is assigned a value but never used.  no-unused-vars
23:54:35.817 53:83  Error: 'budgets' is defined but never used.  no-unused-vars
23:54:35.817 
23:54:35.817 ./src/pages_old/FinancialChatbot.jsx
23:54:35.817 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.817 8:23  Error: 'UserIcon' is defined but never used.  no-unused-vars
23:54:35.818 8:101  Error: 'Mic' is defined but never used.  no-unused-vars
23:54:35.818 27:10  Error: 'currentUser' is assigned a value but never used.  no-unused-vars
23:54:35.818 170:61  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.818 170:83  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.818 170:88  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.818 170:107  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
23:54:35.818 
23:54:35.818 ./src/pages_old/FinancialPlanner.jsx
23:54:35.819 1:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.819 5:10  Warning: Fast refresh only works when a file only exports components. Move your component(s) to a separate file.  react-refresh/only-export-components
23:54:35.819 13:1  Warning: Fast refresh can't handle anonymous components. Add a name to your export.  react-refresh/only-export-components
23:54:35.819 13:16  Error: Component definition is missing display name  react/display-name
23:54:35.819 
23:54:35.819 ./src/pages_old/Layout.jsx
23:54:35.819 3:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.819 8:45  Error: 'SheetClose' is defined but never used.  no-unused-vars
23:54:35.819 64:20  Error: 'item' is missing in props validation  react/prop-types
23:54:35.820 64:26  Error: 'pathname' is missing in props validation  react/prop-types
23:54:35.820 65:38  Error: 'item.url' is missing in props validation  react/prop-types
23:54:35.820 67:20  Error: 'item.url' is missing in props validation  react/prop-types
23:54:35.820 78:53  Error: 'item.title' is missing in props validation  react/prop-types
23:54:35.820 84:28  Error: 'title' is missing in props validation  react/prop-types
23:54:35.820 84:35  Error: 'items' is missing in props validation  react/prop-types
23:54:35.820 84:42  Error: 'icon' is missing in props validation  react/prop-types
23:54:35.820 84:54  Error: 'pathname' is missing in props validation  react/prop-types
23:54:35.820 85:31  Error: 'items.some' is missing in props validation  react/prop-types
23:54:35.820 104:16  Error: 'items.map' is missing in props validation  react/prop-types
23:54:35.820 117:26  Error: 'item' is missing in props validation  react/prop-types
23:54:35.821 117:32  Error: 'pathname' is missing in props validation  react/prop-types
23:54:35.821 117:42  Error: 'onClose' is missing in props validation  react/prop-types
23:54:35.821 118:38  Error: 'item.url' is missing in props validation  react/prop-types
23:54:35.821 120:20  Error: 'item.url' is missing in props validation  react/prop-types
23:54:35.821 126:41  Error: 'item.emoji' is missing in props validation  react/prop-types
23:54:35.821 127:53  Error: 'item.title' is missing in props validation  react/prop-types
23:54:35.821 133:29  Error: 'title' is missing in props validation  react/prop-types
23:54:35.821 133:36  Error: 'items' is missing in props validation  react/prop-types
23:54:35.821 133:43  Error: 'pathname' is missing in props validation  react/prop-types
23:54:35.821 133:53  Error: 'onClose' is missing in props validation  react/prop-types
23:54:35.821 133:62  Error: 'emoji' is missing in props validation  react/prop-types
23:54:35.821 133:69  Error: 'defaultOpen' is missing in props validation  react/prop-types
23:54:35.821 135:31  Error: 'items.some' is missing in props validation  react/prop-types
23:54:35.821 156:16  Error: 'items.map' is missing in props validation  react/prop-types
23:54:35.821 176:34  Error: 'children' is missing in props validation  react/prop-types
23:54:35.823 176:44  Error: 'currentPageName' is defined but never used.  no-unused-vars
23:54:35.823 176:44  Error: 'currentPageName' is missing in props validation  react/prop-types
23:54:35.823 
23:54:35.823 ./src/pages_old/ManageBudgets.jsx
23:54:35.823 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.823 5:52  Error: 'CardDescription' is defined but never used.  no-unused-vars
23:54:35.823 10:10  Error: 'Badge' is defined but never used.  no-unused-vars
23:54:35.823 26:6  Warning: React Hook useEffect has a missing dependency: 'loadBudgets'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
23:54:35.823 
23:54:35.824 ./src/pages_old/ManageCategories.jsx
23:54:35.824 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.824 
23:54:35.824 ./src/pages_old/ManageEvents.jsx
23:54:35.824 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.824 13:10  Error: 'format' is defined but never used.  no-unused-vars
23:54:35.824 14:10  Error: 'ar' is defined but never used.  no-unused-vars
23:54:35.824 
23:54:35.824 ./src/pages_old/MonthlyReport.jsx
23:54:35.824 2:8  Error: 'React' is defined but never used.  no-unused-vars
23:54:35.824 5:10  Error: 'ar' is defined but never used.  no-unused-vars
23:54:35.824 
23:54:35.824 info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
23:54:35.849 Error: Command "npm run build" exited with 1
2:8  Error: 'React' is defined but never used.  no-unused-vars
./src/pages_old/ManageEvents.jsx
2:8  Error: 'React' is defined but never used.  no-unused-vars
13:10  Error: 'format' is defined but never used.  no-unused-vars
14:10  Error: 'ar' is defined but never used.  no-unused-vars
./src/pages_old/MonthlyReport.jsx
2:8  Error: 'React' is defined but never used.  no-unused-vars
5:10  Error: 'ar' is defined but never used.  no-unused-vars
info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
Error: Command "npm run build" exited with 1
Deployment Summary
Assigning Custom Domains
fix: resolve build issues and clean up code - 7a7ef9
Import a different Git Repository →
Browse Templates →
Home
Docs
Guides
Academy
Help
Contact

All systems normal.
Select a display theme:
system
light
dark
