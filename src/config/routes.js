/**
 * ملف تكوين مركزي للمسارات والروابط
 * يحتوي على جميع المسارات المستخدمة في التطبيق لضمان سهولة الصيانة
 */

// المسارات الأساسية
export const ROUTES = {
  // الصفحة الرئيسية
  HOME: '/',
  DASHBOARD: '/dashboard',

  // إدارة المصاريف
  ADD_EXPENSE: '/add-expense',
  EXPENSES_LIST: '/expenses-list',
  CAMERA_RECEIPTS: '/camera-receipts',

  // التقارير والإحصائيات
  MONTHLY_REPORT: '/monthly-report',
  ANALYTICS: '/analytics',
  FAMILY_REPORT: '/family-report',

  // إدارة العائلة
  FAMILY_DASHBOARD: '/family-dashboard',
  MY_FAMILY: '/my-family',
  FAMILY_INCOME: '/family-income',

  // إدارة النظام
  MANAGE_CATEGORIES: '/manage-categories',
  MANAGE_BUDGETS: '/manage-budgets',
  MANAGE_EVENTS: '/manage-events',

  // الأدوات والخدمات
  FINANCIAL_PLANNER: '/financial-planner',
  FINANCIAL_CHATBOT: '/financial-chatbot',

  // الحساب والإعدادات
  ACCOUNT: '/account',
  SETUP_ACCOUNT: '/setup-account',

  // المصادقة
  AUTH: '/auth',
  AUTH_SIGNIN: '/auth/signin',
  AUTH_GOOGLE: '/auth/google-signin',

  // معلومات التطبيق
  ABOUT: '/about',
  PRICING: '/pricing',
  CONTACT: '/contact',
  SUPPORT: '/support',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service'
};

// تسميات الصفحات باللغة العربية
export const PAGE_TITLES = {
  [ROUTES.HOME]: 'الرئيسية',
  [ROUTES.DASHBOARD]: 'لوحة التحكم',
  [ROUTES.ADD_EXPENSE]: 'إضافة مصروف',
  [ROUTES.EXPENSES_LIST]: 'قائمة المصاريف',
  [ROUTES.CAMERA_RECEIPTS]: 'مسح الإيصالات',
  [ROUTES.MONTHLY_REPORT]: 'التقرير الشهري',
  [ROUTES.ANALYTICS]: 'الإحصائيات',
  [ROUTES.FAMILY_REPORT]: 'تقرير العائلة',
  [ROUTES.FAMILY_DASHBOARD]: 'لوحة تحكم العائلة',
  [ROUTES.MY_FAMILY]: 'إدارة العائلة',
  [ROUTES.FAMILY_INCOME]: 'الدخل العائلي',
  [ROUTES.MANAGE_CATEGORIES]: 'إدارة الفئات',
  [ROUTES.MANAGE_BUDGETS]: 'إدارة الميزانيات',
  [ROUTES.MANAGE_EVENTS]: 'إدارة المناسبات',
  [ROUTES.FINANCIAL_PLANNER]: 'المخطط المالي',
  [ROUTES.FINANCIAL_CHATBOT]: 'المساعد الذكي',
  [ROUTES.ACCOUNT]: 'إدارة الحساب',
  [ROUTES.SETUP_ACCOUNT]: 'إعداد الحساب',
  [ROUTES.AUTH]: 'تسجيل الدخول',
  [ROUTES.AUTH_SIGNIN]: 'تسجيل الدخول',
  [ROUTES.AUTH_GOOGLE]: 'دخول جوجل',
  [ROUTES.ABOUT]: 'عنّا',
  [ROUTES.PRICING]: 'الأسعار',
  [ROUTES.CONTACT]: 'تواصل معنا',
  [ROUTES.SUPPORT]: 'الدعم',
  [ROUTES.PRIVACY_POLICY]: 'سياسة الخصوصية',
  [ROUTES.TERMS_OF_SERVICE]: 'شروط الاستخدام'
};

// APIs endpoints
export const API_ROUTES = {
  // المصاريف
  EXPENSES: '/api/expenses',
  EXPENSE_BY_ID: (id) => `/api/expenses/${id}`,
  
  // الدخل
  INCOMES: '/api/incomes',
  
  // الميزانيات
  BUDGETS: '/api/budgets',
  
  // الفئات
  CATEGORIES: '/api/categories',
  
  // التقارير
  REPORTS: '/api/reports',
  FORECASTS: '/api/forecasts',
  
  // النصائح المالية
  ADVICE: '/api/advice',
  
  // العائلة
  FAMILY: '/api/family',
  FAMILY_DASHBOARD: '/api/family/dashboard'
};

// حالة الصفحات - لتحديد أي منها جاهز للاستخدام
export const PAGE_STATUS = {
  [ROUTES.DASHBOARD]: 'ready',
  [ROUTES.ADD_EXPENSE]: 'ready',
  [ROUTES.EXPENSES_LIST]: 'ready',
  [ROUTES.MONTHLY_REPORT]: 'ready',
  [ROUTES.ANALYTICS]: 'ready',
  [ROUTES.FAMILY_DASHBOARD]: 'ready',
  [ROUTES.MY_FAMILY]: 'ready',
  [ROUTES.MANAGE_CATEGORIES]: 'ready',
  [ROUTES.MANAGE_BUDGETS]: 'basic',
  [ROUTES.MANAGE_EVENTS]: 'basic',
  [ROUTES.FAMILY_REPORT]: 'basic',
  [ROUTES.FAMILY_INCOME]: 'basic',
  [ROUTES.FINANCIAL_PLANNER]: 'basic',
  [ROUTES.FINANCIAL_CHATBOT]: 'ready', // تم التفعيل
  [ROUTES.CAMERA_RECEIPTS]: 'ready',
  [ROUTES.SETUP_ACCOUNT]: 'ready',
  [ROUTES.ACCOUNT]: 'basic',
  [ROUTES.ABOUT]: 'ready',
  [ROUTES.PRICING]: 'ready',
  [ROUTES.CONTACT]: 'ready',
  [ROUTES.SUPPORT]: 'basic',
  [ROUTES.PRIVACY_POLICY]: 'ready',
  [ROUTES.TERMS_OF_SERVICE]: 'ready',
  [ROUTES.AUTH]: 'ready',
  [ROUTES.AUTH_SIGNIN]: 'ready',
  [ROUTES.AUTH_GOOGLE]: 'ready'
};

// دالة مساعدة للحصول على المسار
export const getRoute = (routeName, params = {}) => {
  const route = ROUTES[routeName];
  if (!route) {
    console.warn(`Route ${routeName} not found`);
    return ROUTES.HOME;
  }
  
  // إذا كانت الدالة تتطلب معاملات
  if (typeof route === 'function') {
    return route(params);
  }
  
  return route;
};

// دالة للتحقق من حالة الصفحة
export const isPageReady = (route) => {
  return PAGE_STATUS[route] === 'ready';
};

// دالة للتحقق من أن الصفحة معطلة
export const isPageDisabled = (route) => {
  return PAGE_STATUS[route] === 'disabled';
};

export default {
  ROUTES,
  PAGE_TITLES,
  API_ROUTES,
  PAGE_STATUS,
  getRoute,
  isPageReady,
  isPageDisabled
};
