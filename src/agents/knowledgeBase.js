/**
 * قاعدة المعرفة الداخلية للمساعد الذكي
 * تحتوي على معلومات شاملة عن جميع وظائف التطبيق والقوائم
 * 
 * تم التطوير بواسطة: Abdullah Alawiss
 */

import { ROUTES, PAGE_TITLES, API_ROUTES } from '../config/routes';

// معلومات التطبيق الأساسية
export const APP_INFO = {
  name: "ريال مايند",
  description: "تطبيق ذكي لإدارة المصاريف العائلية بتقنيات الذكاء الاصطناعي",
  developer: "Abdullah Alawiss",
  version: "1.0.0",
  features: [
    "إدارة المصاريف الشخصية والعائلية",
    "تقارير مالية ذكية",
    "تتبع الميزانيات",
    "نصائح مالية مخصصة",
    "مساعد ذكي تفاعلي"
  ]
};

// معلومات مفصلة عن كل قائمة ووظيفتها
export const MENU_INFO = {
  [ROUTES.DASHBOARD]: {
    title: "لوحة التحكم الرئيسية",
    description: "الصفحة الرئيسية التي تعرض ملخص شامل لحالتك المالية",
    features: [
      "عرض الرصيد الحالي والمصاريف الشهرية",
      "ملخص الميزانيات وتقدم الإنفاق",
      "آخر المصاريف المضافة",
      "نصائح مالية شخصية",
      "إحصائيات سريعة"
    ],
    howToUse: "هذه هي نقطة البداية لجميع العمليات المالية. يمكنك رؤية ملخص سريع لوضعك المالي والانتقال إلى الوظائف المختلفة.",
    quickActions: [
      "إضافة مصروف سريع",
      "عرض التقرير الشهري",
      "إدارة الميزانيات"
    ]
  },

  [ROUTES.ADD_EXPENSE]: {
    title: "إضافة مصروف جديد",
    description: "صفحة لتسجيل مصاريفك اليومية بسهولة وسرعة",
    features: [
      "إدخال المبلغ والوصف",
      "اختيار الفئة (طعام، مواصلات، ترفيه، إلخ)",
      "تحديد التاريخ",
      "إضافة ملاحظات اختيارية",
      "رفع صورة الإيصال"
    ],
    howToUse: "أدخل مبلغ المصروف، اختر الفئة المناسبة، واكتب وصف مختصر. يمكنك أيضاً رفع صورة الإيصال للحفظ.",
    quickPhrase: "لإضافة مصروف قل: 'أضف مصروف 50 ريال طعام' أو 'صرفت 25 ريال على قهوة'"
  },

  [ROUTES.EXPENSES_LIST]: {
    title: "قائمة المصاريف",
    description: "عرض جميع مصاريفك مع إمكانية البحث والفلترة",
    features: [
      "عرض جميع المصاريف مرتبة حسب التاريخ",
      "فلترة حسب الفئة أو التاريخ",
      "البحث في المصاريف",
      "تعديل أو حذف المصاريف",
      "تصدير البيانات"
    ],
    howToUse: "تصفح مصاريفك، استخدم الفلاتر للبحث عن مصاريف محددة، أو انقر على أي مصروف لتعديله.",
    quickPhrase: "لعرض المصاريف قل: 'اعرض مصاريفي' أو 'كم صرفت على الطعام هذا الشهر؟'"
  },

  [ROUTES.CAMERA_RECEIPTS]: {
    title: "مسح الإيصالات بالكاميرا",
    description: "تقنية ذكية لمسح الإيصالات واستخراج المعلومات تلقائياً",
    features: [
      "مسح الإيصال بكاميرا الجوال",
      "استخراج المبلغ والتاريخ تلقائياً",
      "التعرف على اسم المتجر",
      "حفظ صورة الإيصال الأصلية",
      "تأكيد البيانات قبل الحفظ"
    ],
    howToUse: "اضغط على زر المسح، وجه الكاميرا للإيصال، وسيتم استخراج المعلومات تلقائياً.",
    quickPhrase: "قل: 'امسح إيصال' أو 'أريد تصوير فاتورة'"
  },

  [ROUTES.MONTHLY_REPORT]: {
    title: "التقرير الشهري",
    description: "تقرير مفصل عن مصاريفك ودخلك خلال الشهر",
    features: [
      "إجمالي المصاريف والدخل",
      "توزيع المصاريف حسب الفئات",
      "مقارنة مع الأشهر السابقة",
      "تحليل اتجاهات الإنفاق",
      "نصائح لتحسين الوضع المالي"
    ],
    howToUse: "اختر الشهر المطلوب لعرض تقرير مفصل بالرسوم البيانية والإحصائيات.",
    quickPhrase: "قل: 'اعرض التقرير الشهري' أو 'كم صرفت هذا الشهر؟'"
  },

  [ROUTES.ANALYTICS]: {
    title: "الإحصائيات والتحليلات",
    description: "تحليلات عميقة لعاداتك المالية مع رسوم بيانية تفاعلية",
    features: [
      "رسوم بيانية للاتجاهات المالية",
      "تحليل عادات الإنفاق",
      "توقعات مالية مستقبلية",
      "مقارنات سنوية وشهرية",
      "معدلات الادخار"
    ],
    howToUse: "استكشف الرسوم البيانية لفهم أنماط إنفاقك وحدد المجالات التي تحتاج تحسين.",
    quickPhrase: "قل: 'اعرض الإحصائيات' أو 'حلل عادات الإنفاق'"
  },

  [ROUTES.FAMILY_DASHBOARD]: {
    title: "لوحة تحكم العائلة",
    description: "إدارة مصاريف جميع أفراد العائلة في مكان واحد",
    features: [
      "عرض مصاريف جميع أفراد العائلة",
      "ميزانيات عائلية مشتركة",
      "إحصائيات لكل فرد",
      "تقارير عائلية شاملة",
      "إدارة الصلاحيات"
    ],
    howToUse: "راقب إنفاق العائلة، ضع ميزانيات مشتركة، وتابع تقدم كل فرد نحو أهدافه المالية.",
    quickPhrase: "قل: 'اعرض مصاريف العائلة' أو 'كم صرفت العائلة هذا الشهر؟'"
  },

  [ROUTES.MY_FAMILY]: {
    title: "إدارة العائلة",
    description: "إضافة وإدارة أفراد العائلة وصلاحياتهم",
    features: [
      "دعوة أفراد جدد للعائلة",
      "تحديد صلاحيات كل فرد",
      "عرض معلومات الأعضاء",
      "إدارة كود الدعوة",
      "إعدادات الخصوصية العائلية"
    ],
    howToUse: "أضف أفراد العائلة عن طريق إرسال دعوات، وحدد صلاحيات كل فرد حسب الحاجة.",
    quickPhrase: "قل: 'أضف فرد للعائلة' أو 'أريد دعوة زوجتي'"
  },

  [ROUTES.MANAGE_CATEGORIES]: {
    title: "إدارة فئات المصاريف",
    description: "تنظيم وتخصيص فئات المصاريف حسب احتياجاتك",
    features: [
      "إنشاء فئات مخصصة",
      "تعديل الفئات الموجودة",
      "اختيار ألوان ورموز للفئات",
      "تجميع الفئات في مجموعات",
      "إحصائيات لكل فئة"
    ],
    howToUse: "أنشئ فئات تناسب نمط حياتك، مثل 'طعام خارجي' أو 'فواتير المنزل' لتنظيم أفضل.",
    quickPhrase: "قل: 'أضف فئة جديدة' أو 'أريد تعديل فئة الطعام'"
  },

  [ROUTES.MANAGE_BUDGETS]: {
    title: "إدارة الميزانيات",
    description: "وضع ومتابعة الميزانيات لكل فئة أو فترة زمنية",
    features: [
      "إنشاء ميزانيات شهرية أو سنوية",
      "تحديد حدود إنفاق لكل فئة",
      "تنبيهات عند اقتراب الحد المسموح",
      "تتبع تقدم الميزانية",
      "اقتراحات لتحسين الميزانية"
    ],
    howToUse: "ضع ميزانية واقعية لكل فئة، وراقب تقدمك خلال الشهر لتجنب الإفراط في الإنفاق.",
    quickPhrase: "قل: 'ضع ميزانية للطعام 800 ريال' أو 'كم تبقى من ميزانية المواصلات؟'"
  },

  [ROUTES.FINANCIAL_PLANNER]: {
    title: "المخطط المالي",
    description: "أداة ذكية للتخطيط المالي طويل المدى",
    features: [
      "وضع أهداف مالية قصيرة وطويلة المدى",
      "خطط ادخار مخصصة",
      "نصائح استثمارية",
      "تتبع تقدم الأهداف",
      "سيناريوهات مالية مختلفة"
    ],
    howToUse: "حدد أهدافك المالية مثل شراء سيارة أو ادخار للحج، وسيضع لك خطة مناسبة.",
    quickPhrase: "قل: 'أريد خطة ادخار' أو 'كيف أوفر لشراء سيارة؟'"
  }
};

// معلومات عن واجهات API المتاحة
export const API_INFO = {
  [API_ROUTES.EXPENSES]: {
    description: "إدارة المصاريف",
    methods: ["GET", "POST"],
    features: ["إضافة مصروف جديد", "جلب قائمة المصاريف", "فلترة المصاريف"]
  },
  [API_ROUTES.INCOMES]: {
    description: "إدارة الدخل",
    methods: ["GET", "POST"],
    features: ["تسجيل دخل جديد", "عرض مصادر الدخل", "تتبع الدخل الشهري"]
  },
  [API_ROUTES.BUDGETS]: {
    description: "إدارة الميزانيات",
    methods: ["GET", "POST", "PUT"],
    features: ["إنشاء ميزانية", "تحديث الميزانية", "مراقبة التقدم"]
  },
  [API_ROUTES.REPORTS]: {
    description: "التقارير المالية",
    methods: ["GET"],
    features: ["تقارير شهرية", "تحليلات الإنفاق", "إحصائيات مالية"]
  }
};

// نصائح مالية ذكية
export const FINANCIAL_TIPS = [
  {
    category: "ادخار",
    tips: [
      "احفظ 20% من دخلك الشهري كحد أدنى",
      "ابدأ بمبالغ صغيرة واعتد على الادخار تدريجياً",
      "أنشئ حساب ادخار منفصل لا تلمسه إلا للضرورة"
    ]
  },
  {
    category: "إنفاق",
    tips: [
      "اتبع قاعدة 50/30/20: 50% ضروريات، 30% رغبات، 20% ادخار",
      "تجنب الشراء الاندفاعي بالانتظار 24 ساعة قبل أي شراء كبير",
      "قارن الأسعار قبل الشراء"
    ]
  },
  {
    category: "ميزانية",
    tips: [
      "راجع ميزانيتك أسبوعياً",
      "كن واقعياً في وضع الميزانية",
      "اترك هامش 10% للطوارئ"
    ]
  }
];

// عبارات شائعة وكيفية فهمها
export const COMMON_PHRASES = {
  // عبارات إضافة المصاريف
  expenses: [
    { pattern: /صرفت|اشتريت|دفعت|اشتريت/, action: "add_expense" },
    { pattern: /مصروف|إنفاق/, action: "add_expense" },
    { pattern: /ريال|درهم|دينار/, action: "extract_amount" }
  ],
  
  // عبارات الاستعلام
  queries: [
    { pattern: /كم صرفت|كم أنفقت/, action: "show_expenses" },
    { pattern: /تقرير|ملخص|إحصائيات/, action: "show_report" },
    { pattern: /ميزانية|حد|محدود/, action: "budget_info" }
  ],
  
  // عبارات التنقل
  navigation: [
    { pattern: /اذهب إلى|انتقل إلى|افتح/, action: "navigate" },
    { pattern: /قائمة|صفحة/, action: "navigate" }
  ]
};

// دالة للحصول على معلومات صفحة معينة
export function getPageInfo(route) {
  return MENU_INFO[route] || null;
}

// دالة للبحث في المعرفة
export function searchKnowledge(query) {
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  // البحث في معلومات الصفحات
  Object.entries(MENU_INFO).forEach(([route, info]) => {
    if (info.title.toLowerCase().includes(lowerQuery) ||
        info.description.toLowerCase().includes(lowerQuery) ||
        info.features.some(feature => feature.toLowerCase().includes(lowerQuery))) {
      results.push({
        type: 'page',
        route,
        info,
        relevance: calculateRelevance(lowerQuery, info)
      });
    }
  });
  
  return results.sort((a, b) => b.relevance - a.relevance);
}

// حساب درجة الصلة
function calculateRelevance(query, info) {
  let score = 0;
  if (info.title.toLowerCase().includes(query)) score += 10;
  if (info.description.toLowerCase().includes(query)) score += 5;
  info.features.forEach(feature => {
    if (feature.toLowerCase().includes(query)) score += 3;
  });
  return score;
}

// دالة لتحليل النية من النص
export function analyzeIntent(text) {
  const lowerText = text.toLowerCase();
  
  // تحليل نية إضافة مصروف
  if (/صرفت|اشتريت|دفعت/.test(lowerText)) {
    const amount = extractAmount(text);
    const category = extractCategory(text);
    return {
      intent: 'add_expense',
      amount,
      category,
      confidence: amount ? 0.9 : 0.6
    };
  }
  
  // تحليل نية الاستعلام
  if (/كم|تقرير|ملخص|إحصائيات/.test(lowerText)) {
    return {
      intent: 'query_data',
      type: extractQueryType(text),
      confidence: 0.8
    };
  }
  
  // تحليل نية التنقل
  if (/اذهب|انتقل|افتح|اعرض/.test(lowerText)) {
    return {
      intent: 'navigate',
      target: extractNavigationTarget(text),
      confidence: 0.7
    };
  }
  
  return {
    intent: 'general',
    confidence: 0.3
  };
}

// استخراج المبلغ من النص
function extractAmount(text) {
  const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*ريال/);
  return amountMatch ? parseFloat(amountMatch[1]) : null;
}

// استخراج الفئة من النص
function extractCategory(text) {
  const categories = {
    'طعام': ['طعام', 'أكل', 'مطعم', 'غداء', 'عشاء', 'فطار'],
    'مواصلات': ['مواصلات', 'بنزين', 'تاكسي', 'أوبر', 'باص'],
    'ترفيه': ['ترفيه', 'سينما', 'لعب', 'رحلة'],
    'صحة': ['طبيب', 'دواء', 'صيدلية', 'مستشفى']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return null;
}

// استخراج نوع الاستعلام
function extractQueryType(text) {
  if (/شهر|شهري/.test(text)) return 'monthly';
  if (/يوم|يومي|اليوم/.test(text)) return 'daily';
  if (/فئة|تصنيف/.test(text)) return 'category';
  return 'general';
}

// استخراج هدف التنقل
function extractNavigationTarget(text) {
  const targets = {
    'مصاريف': ROUTES.EXPENSES_LIST,
    'تقرير': ROUTES.MONTHLY_REPORT,
    'إحصائيات': ROUTES.ANALYTICS,
    'عائلة': ROUTES.FAMILY_DASHBOARD,
    'ميزانية': ROUTES.MANAGE_BUDGETS,
    'فئات': ROUTES.MANAGE_CATEGORIES
  };
  
  for (const [keyword, route] of Object.entries(targets)) {
    if (text.includes(keyword)) {
      return route;
    }
  }
  
  return null;
}

export default {
  APP_INFO,
  MENU_INFO,
  API_INFO,
  FINANCIAL_TIPS,
  COMMON_PHRASES,
  getPageInfo,
  searchKnowledge,
  analyzeIntent
};
