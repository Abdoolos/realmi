/**
 * دالة تطبيع النص العربي - مطابقة لنسخة قاعدة البيانات
 * @param {string} text - النص المراد تطبيعه
 * @returns {string} النص المطبع
 */
export function normalizeArabic(text) {
    if (!text || typeof text !== 'string') return '';
    
    let normalized = text.toLowerCase().trim();
    
    // إزالة التشكيل
    normalized = normalized.replace(/[\u0617-\u061A\u064B-\u0652]/g, '');
    
    // تطبيع الأحرف العربية
    normalized = normalized.replace(/[أإآ]/g, 'ا');
    normalized = normalized.replace(/ى/g, 'ي');
    normalized = normalized.replace(/ة/g, 'ه');
    
    // تحويل الأرقام العربية إلى إنجليزية
    normalized = normalized.replace(/[٠-٩]/g, (d) => 
        '0123456789'[d.charCodeAt(0) - 0x0660]
    );
    
    // حذف "ال" التعريف من البداية
    normalized = normalized.replace(/^\s*ال\s*/, '');
    
    // توحيد المسافات
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    return normalized;
}

/**
 * دالة البحث الذكي عن البند
 * @param {string} itemRaw - النص الخام للبند
 * @param {Array} subcategories - قائمة البنود الفرعية
 * @returns {Object|null} البند المطابق أو null
 */
export function findSubcategory(itemRaw, subcategories) {
    if (!itemRaw || !Array.isArray(subcategories)) return null;
    
    const normalizedItem = normalizeArabic(itemRaw);
    
    // البحث المباشر في الأسماء المطبعة
    let match = subcategories.find(sub => 
        sub.name_normalized === normalizedItem
    );
    
    if (match) return match;
    
    // البحث في المرادفات المطبعة
    match = subcategories.find(sub => {
        if (!sub.aliases_normalized || !Array.isArray(sub.aliases_normalized)) return false;
        return sub.aliases_normalized.includes(normalizedItem);
    });
    
    return match || null;
}

/**
 * دالة إنشاء البند مع التطبيع التلقائي
 * @param {string} name - اسم البند
 * @param {string} categoryId - معرف الفئة
 * @param {Array} aliases - المرادفات (اختياري)
 * @returns {Object} بيانات البند الجاهزة للإرسال
 */
export function createNormalizedSubcategory(name, categoryId, aliases = []) {
    const normalizedName = normalizeArabic(name);
    const allAliases = [name, ...aliases];
    const normalizedAliases = allAliases.map(alias => normalizeArabic(alias));
    
    return {
        category_id: categoryId,
        name: name,
        name_normalized: normalizedName,
        aliases: allAliases,
        aliases_normalized: normalizedAliases,
        is_active: true,
        usage_count: 0,
        created_by_user: true
    };
}

/**
 * دالة استخراج البيانات من النص
 * @param {string} text - النص المُدخل
 * @returns {Object} البيانات المستخرجة
 */
export function extractExpenseData(text) {
    if (!text || typeof text !== 'string') {
        return { amount: null, item: null, date: new Date() };
    }
    
    // استخراج المبلغ - البحث عن أرقام
    const amountMatch = text.match(/[\d٠-٩.,]+/);
    const amount = amountMatch ? parseFloat(
        amountMatch[0]
            .replace(/[٠-٩]/g, (d) => '0123456789'[d.charCodeAt(0) - 0x0660])
            .replace(/,/g, '')
    ) : null;
    
    // استخراج البند - إزالة الأرقام وكلمات الإيقاف
    let item = text
        .replace(/[\d٠-٩.,]+/g, '') // إزالة الأرقام
        .replace(/\b(ريال|ر\.س|جنيه|دولار|اليوم|امس|البارحة|تم|صرفت|اشتريت|دفعت)\b/gi, '') // كلمات الإيقاف
        .trim();
    
    // التاريخ - افتراضي اليوم (يمكن تحسينه لاحقاً)
    const date = new Date();
    
    return { amount, item, date };
}