'use client'

import React, { useState, useEffect, useCallback } from "react";
import { Expense } from '../../src/api/entities';
import { Category } from '../../src/api/entities';
import { Subcategory } from '../../src/api/entities';
import { User } from '../../src/api/entities';
import { CategoryBudget } from '../../src/api/entities';
import { UploadFile } from "../../src/api/integrations";
import { Button } from "../../src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import { Textarea } from "../../src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "../../src/components/ui/select";
import { Alert, AlertDescription } from "../../src/components/ui/alert";
import { useRouter } from "next/navigation";
import { ArrowRight, Save, Receipt, AlertTriangle, CheckCircle, Loader2, Tag, Lightbulb, RefreshCw, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "../../src/components/ui/tabs";
import { normalizeArabic } from "../../src/components/utils/arabicNormalization";
import { CURRENCIES, formatCurrency, convertCurrency, getExchangeRate, getUserPreferredCurrency, convertAndFormat } from "../../src/components/utils/currencyUtils";
import { Skeleton } from "../../src/components/ui/skeleton";
import Image from "next/image";

// Helper for Hijri formatting
const formatHijriDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
        calendar: 'islamic-umalqura',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timeZone: 'Asia/Riyadh'
    }).format(date);
};

const logTelemetry = (action, status, duration) => {
    console.log(`TELEMETRY: { action: "${action}", status: "${status}", duration: ${duration}ms }`);
};

// Skeleton component for loading state
const AddExpenseSkeleton = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
    </div>
);

export default function AddExpense() {
    const router = useRouter();

    // Core data states
    const [currentUser, setCurrentUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [expenseType, setExpenseType] = useState('personal');

    // Form states
    const [formData, setFormData] = useState({
        amount: "",
        subcategory_id: "",
        currency: getUserPreferredCurrency(),
        date: new Date().toISOString().split('T')[0],
        note: "",
        receipt_url: ""
    });

    // UI states
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [errors, setErrors] = useState({});
    const [budgetWarning, setBudgetWarning] = useState(null);

    // ✅ دالة تنظيف شاملة لحذف الفئات الفرعية الخاطئة وإنشاء فئات جديدة
    const fixSubcategoriesCompletely = useCallback(async () => {
        console.log('🧹 بدء التنظيف الشامل للفئات الفرعية...');

        try {
            // 1. جلب جميع الفئات والفئات الفرعية الموجودة
            const [allCategories, allSubcategories] = await Promise.all([
                Category.list(),
                Subcategory.list()
            ]);

            console.log(`📊 الوضع الحالي: ${allCategories.length} فئة، ${allSubcategories.length} فئة فرعية`);

            // 2. ✅ إصلاح: حذف الفئات الفرعية مع تجاهل الأخطاء إذا كانت محذوفة بالفعل
            if (allSubcategories.length > 0) {
                console.log(`🗑️ حذف ${allSubcategories.length} فئة فرعية قديمة...`);
                for (const sub of allSubcategories) {
                    try {
                        await Subcategory.delete(sub.id);
                        console.log(`- تم حذف: ${sub.name} (ID: ${sub.id})`);
                        await new Promise(resolve => setTimeout(resolve, 50)); // تأخير أقل لتحسين الأداء
                    } catch (deleteError) {
                        // إذا كان الخطأ 404، فهذا يعني أن البند محذوف بالفعل، لذا نتجاهل الخطأ ونكمل
                        if (deleteError.response && deleteError.response.status === 404) {
                            console.warn(`- البند (ID: ${sub.id}) محذوف بالفعل. سيتم التجاوز.`);
                        } else {
                            // لأي أخطاء أخرى، نسجلها ولكن لا نوقف العملية بأكملها
                            console.error(`- خطأ أثناء حذف البند (ID: ${sub.id}):`, deleteError.message);
                        }
                    }
                }
                console.log('✅ اكتمل حذف البنود القديمة.');
            }

            // 3. إنشاء خريطة للفئات الصحيحة
            const categoryMap = new Map();
            allCategories.forEach(cat => {
                categoryMap.set(normalizeArabic(cat.name), cat.id);
                console.log(`📋 فئة: ${cat.name} -> ID: ${cat.id}`);
            });

            // 4. تعريف الفئات الفرعية الصحيحة
            const subcategoriesData = [
                // فئة الطعام
                { categoryName: 'طعام', items: [
                    { name: 'مطاعم', aliases: ['مطعم', 'مأكولات', 'وجبات', 'ريستورانت'] },
                    { name: 'قهوة ومشروبات', aliases: ['قهوة', 'كافيه', 'مشروبات', 'عصائر', 'ستاربكس'] },
                    { name: 'بقالة وسوبرماركت', aliases: ['بقالة', 'سوبرماركت', 'مواد غذائية', 'تموينات', 'هايبر'] },
                    { name: 'حلويات ومعجنات', aliases: ['حلويات', 'كيك', 'معجنات', 'حلا', 'آيس كريم'] },
                    { name: 'وجبات سريعة', aliases: ['برجر', 'بيتزا', 'وجبة سريعة', 'فاست فود', 'ماكدونالدز'] },
                ]},

                // فئة المواصلات
                { categoryName: 'مواصلات', items: [
                    { name: 'وقود', aliases: ['بنزين', 'ديزل', 'وقود السيارة', 'محطة وقود'] },
                    { name: 'تاكسي وأوبر', aliases: ['تاكسي', 'أوبر', 'كريم', 'نقل', 'مواصلات عامة'] },
                    { name: 'صيانة السيارة', aliases: ['صيانة', 'إصلاح السيارة', 'قطع غيار', 'ورشة'] },
                    { name: 'مواقف سيارات', aliases: ['موقف', 'باركنج', 'ركن السيارة'] },
                ]},

                // فئة السكن
                { categoryName: 'سكن', items: [
                    { name: 'إيجار المنزل', aliases: ['إيجار', 'أجرة المنزل', 'إيجار الشقة'] },
                    { name: 'أثاث ومفروشات', aliases: ['أثاث', 'مفروشات', 'ديكور', 'إيكيا'] },
                    { name: 'صيانة منزل', aliases: ['صيانة البيت', 'إصلاحات منزلية', 'صيانة'] },
                ]},

                // فئة الفواتير والخدمات
                { categoryName: 'فواتير وخدمات', items: [
                    { name: 'كهرباء', aliases: ['فاتورة كهرباء', 'الكهرباء', 'السعودية للكهرباء'] },
                    { name: 'مياه', aliases: ['فاتورة مياه', 'المياه', 'ماء'] },
                    { name: 'إنترنت واتصالات', aliases: ['إنترنت', 'جوال', 'اتصالات', 'موبايلي', 'زين'] },
                    { name: 'اشتراكات رقمية', aliases: ['نتفليكس', 'شاهد', 'سبوتيفاي', 'اشتراك'] },
                ]},

                // فئة الصحة
                { categoryName: 'صحة', items: [
                    { name: 'عيادة ومستشفى', aliases: ['دكتور', 'طبيب', 'عيادة', 'مستشفى'] },
                    { name: 'دواء وصيدلية', aliases: ['دواء', 'صيدلية', 'أدوية', 'النهدي', 'الدواء'] },
                    { name: 'تحاليل ومختبر', aliases: ['تحاليل', 'مختبر', 'فحوصات'] },
                ]},

                // فئة التعليم
                { categoryName: 'تعليم ودورات', items: [
                    { name: 'رسوم دراسية', aliases: ['مدرسة', 'جامعة', 'رسوم', 'تعليم'] },
                    { name: 'كتب ومستلزمات', aliases: ['كتب', 'قرطاسية', 'مستلزمات دراسية'] },
                ]},

                // فئة الترفيه
                { categoryName: 'ترفيه', items: [
                    { name: 'سينما ومسرح', aliases: ['سينما', 'أفلام', 'تذاكر', 'مسارح'] },
                    { name: 'ألعاب وهوايات', aliases: ['ألعاب', 'هوايات', 'ترفيه'] },
                    { name: 'منتزهات وملاهي', aliases: ['ملاهي', 'منتزهات', 'حدائق'] },
                ]},

                // فئة السفر
                { categoryName: 'سفر', items: [
                    { name: 'تذاكر طيران', aliases: ['طيران', 'تذاكر', 'سفر', 'رحلات'] },
                    { name: 'فنادق وإقامة', aliases: ['فندق', 'إقامة', 'حجز'] },
                ]},

                // فئة التسوق العام
                { categoryName: 'تسوق عام', items: [
                    { name: 'ملابس وأزياء', aliases: ['ملابس', 'أزياء', 'أحذية'] },
                    { name: 'إلكترونيات', aliases: ['جوال', 'لابتوب', 'إلكترونيات', 'أجهزة'] },
                ]},

                // فئة أخرى
                { categoryName: 'أخرى', items: [
                    { name: 'متنوع', aliases: ['أخرى', 'متنوع', 'عام'] },
                ]},
            ];

            // 5. إنشاء الفئات الفرعية بالـ IDs الصحيحة
            let totalCreated = 0;

            for (const categoryDef of subcategoriesData) {
                const categoryId = categoryMap.get(normalizeArabic(categoryDef.categoryName));

                if (!categoryId) {
                    console.warn(`⚠️ لم يتم العثور على فئة: ${categoryDef.categoryName}. لن يتم إنشاء فئاتها الفرعية.`);
                    continue;
                }

                console.log(`➕ جاري إنشاء فئات فرعية لـ: ${categoryDef.categoryName} (ID: ${categoryId})`);

                for (const item of categoryDef.items) {
                    const subcategoryData = {
                        category_id: categoryId,
                        name: item.name,
                        name_normalized: normalizeArabic(item.name),
                        aliases: item.aliases,
                        aliases_normalized: item.aliases.map(alias => normalizeArabic(alias)),
                        is_active: true,
                        usage_count: 0,
                        created_by_user: false
                    };
                    try {
                        await Subcategory.create(subcategoryData);
                        totalCreated++;
                        await new Promise(resolve => setTimeout(resolve, 50)); // تأخير بسيط
                    } catch (error) {
                        console.error(`❌ فشل إنشاء الفئة الفرعية: ${item.name} (${error.message})`);
                        // Continue to the next subcategory even if one fails
                    }
                }
            }

            console.log(`🎉 اكتمل! تم إنشاء ${totalCreated} فئة فرعية جديدة بنجاح.`);
            return true;

        } catch (error) {
            console.error('💥 خطأ في التنظيف الشامل:', error);
            return false;
        }
    }, []);

    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        setErrors({});
        const startTime = Date.now();

        try {
            // 1. تحميل المستخدم
            let user;
            try {
                user = await User.me();
                setCurrentUser(user);
            } catch (userError) {
                console.error("Error fetching user:", userError);
                if (userError.response?.status === 429) {
                    throw new Error("الخدمة مشغولة حالياً. يرجى المحاولة مرة أخرى بعد قليل.");
                } else {
                    throw new Error("فشل تحميل بيانات المستخدم. يرجى تسجيل الدخول مرة أخرى.");
                }
            }

            // 2. فحص الحاجة للتنظيف
            // We ensure default categories exist first before fixing subcategories,
            // as subcategories depend on category IDs.
            const defaultCategoriesToEnsure = [
                { name: 'طعام', icon: '🍽️', color: '#F59E0B', type: 'default', sort_order: 1 },
                { name: 'مواصلات', icon: '🚗', color: '#10B981', type: 'default', sort_order: 2 },
                { name: 'سكن', icon: '🏠', color: '#3B82F6', type: 'default', sort_order: 3 },
                { name: 'فواتير وخدمات', icon: '🧾', color: '#84CC16', type: 'default', sort_order: 4 },
                { name: 'صحة', icon: '🏥', color: '#EF4444', type: 'default', sort_order: 5 },
                { name: 'تعليم ودورات', icon: '📚', color: '#F97316', type: 'default', sort_order: 6 },
                { name: 'ترفيه', icon: '🎉', color: '#8B5CF6', type: 'default', sort_order: 7 },
                { name: 'سفر', icon: '✈️', color: '#06B6D4', type: 'default', sort_order: 8 },
                { name: 'تسوق عام', icon: '🛍️', color: '#EC4899', type: 'default', sort_order: 9 },
                { name: 'احتياجات شخصية', icon: '👕', color: '#EAB308', type: 'default', sort_order: 10 }, // This category was in the old list, added for completeness
                { name: 'أخرى', icon: '❓', color: '#6B7280', type: 'default', sort_order: 99 }
            ];

            let currentCategories = await Category.list();
            const existingCategoriesMap = new Map(
                currentCategories.map(cat => [normalizeArabic(cat.name), cat])
            );

            const newCategoriesToCreate = [];
            for(const catData of defaultCategoriesToEnsure) {
                if (!existingCategoriesMap.has(normalizeArabic(catData.name))) {
                    newCategoriesToCreate.push({
                        ...catData,
                        name_normalized: normalizeArabic(catData.name),
                        is_active: true
                    });
                }
            }

            if (newCategoriesToCreate.length > 0) {
                console.log(`➕ Creating ${newCategoriesToCreate.length} new default categories...`);
                const createdCats = await Promise.all(
                    newCategoriesToCreate.map(cat => Category.create(cat))
                );
                currentCategories = [...currentCategories, ...createdCats]; // Update categories list with new ones
                console.log('✅ New default categories created.');
            }

            const needsCleanup = !localStorage.getItem('rialmind_subcategories_fixed_v3');

            if (needsCleanup) {
                console.log('🔧 يحتاج تنظيف شامل للفئات الفرعية...');
                const cleanupSuccess = await fixSubcategoriesCompletely();
                if (cleanupSuccess) {
                    localStorage.setItem('rialmind_subcategories_fixed_v3', 'true');
                    console.log('✅ تم وضع علامة على الفئات الفرعية على أنها ثابتة.');
                }
            }

            // 3. تحميل البيانات المحدثة (سواء بعد التنظيف أو مباشرة إذا لم يكن هناك حاجة للتنظيف)
            const [categoriesData, subcategoriesData] = await Promise.all([
                Category.list(),
                Subcategory.list()
            ]);

            // 4. تنظيف وترتيب البيانات
            const cleanCategories = (categoriesData || [])
                .filter(cat => cat.is_active !== false)
                .filter((cat, index, self) =>
                    index === self.findIndex(c => normalizeArabic(c.name) === normalizeArabic(cat.name))
                )
                .sort((a, b) => {
                    if (a.type === 'default' && b.type !== 'default') return -1;
                    if (a.type !== 'default' && b.type === 'default') return 1;
                    if (a.sort_order !== undefined && b.sort_order !== undefined) return a.sort_order - b.sort_order;
                    return a.name.localeCompare(b.name, 'ar');
                });

            const validCategoryIds = new Set(cleanCategories.map(cat => cat.id));
            const validSubcategories = (subcategoriesData || []).filter(sub =>
                validCategoryIds.has(sub.category_id) && sub.is_active !== false
            );

            setCategories(cleanCategories);
            setSubcategories(validSubcategories);

            console.log(`✅ النتيجة النهائية: ${cleanCategories.length} فئة، ${validSubcategories.length} فئة فرعية`);

        } catch (err) {
            console.error("خطأ في تحميل البيانات:", err);
            setErrors({ general: err.message || "حدث خطأ أثناء تحميل البيانات." });
        } finally {
            setIsLoading(false);
            console.log(`[Perf] إجمالي وقت التحميل: ${Date.now() - startTime}ms`);
        }
    }, [fixSubcategoriesCompletely]); // Add fixSubcategoriesCompletely as a dependency

    const loadLastUsedSubcategory = useCallback(() => {
        const lastSubcategoryId = localStorage.getItem('rialmind_last_subcategory_id');
        if (lastSubcategoryId && subcategories.some(sub => String(sub.id) === String(lastSubcategoryId))) {
            setFormData(prev => ({ ...prev, subcategory_id: lastSubcategoryId }));
        }
    }, [subcategories]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    useEffect(() => {
        if (subcategories.length > 0) {
            loadLastUsedSubcategory();
        }
    }, [subcategories, loadLastUsedSubcategory]);

    useEffect(() => {
        if (currentUser?.family_id) {
            setExpenseType('family');
        } else {
            setExpenseType('personal');
        }
    }, [currentUser]);

    const validateForm = () => {
        const newErrors = {};

        const amount = parseFloat(formData.amount);
        if (!formData.amount || isNaN(amount) || amount <= 0) {
            newErrors.amount = "أدخل مبلغاً صحيحاً أكبر من صفر";
        }

        if (!formData.subcategory_id) {
            newErrors.subcategory_id = "اختر البند";
        }

        const selectedDate = new Date(formData.date);
        const maxDate = addDays(new Date(), 30);
        selectedDate.setHours(0, 0, 0, 0);
        maxDate.setHours(0, 0, 0, 0);

        if (selectedDate > maxDate) {
            newErrors.date = "التاريخ لا يمكن أن يكون أكثر من 30 يوماً في المستقبل";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileUpload = async (file) => {
        if (!file) return;

        setIsUploadingFile(true);
        try {
            const { file_url } = await UploadFile({ file });
            setFormData(prev => ({ ...prev, receipt_url: file_url }));
            toast.success("تم رفع الفاتورة بنجاح");
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("فشل رفع الفاتورة");
        }
        setIsUploadingFile(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || !currentUser) {
            setErrors({ ...errors, general: "لا يمكن إضافة مصروف بدون بيانات مستخدم صحيحة" });
            return;
        }

        setIsSubmitting(true);
        const submitStartTime = Date.now();

        try {
            const selectedSubcategory = subcategories.find(sub => String(sub.id) === String(formData.subcategory_id));
            if (!selectedSubcategory) {
                throw new Error("البند المحدد غير صحيح");
            }

            const amount = parseFloat(formData.amount);
            const currency = formData.currency;

            const conversionResult = convertAndFormat(amount, currency, 'SAR');

            console.log('💰 تفاصيل تحويل العملة:', {
                original: `${amount} ${currency}`,
                converted: `${conversionResult.converted.amount} SAR`,
                rate: conversionResult.rate,
                calculation: `${amount} × ${conversionResult.rate} = ${conversionResult.converted.amount}`
            });

            const familyId = expenseType === 'family' && currentUser.family_id ? currentUser.family_id : null;

            const expenseData = {
                family_id: familyId,
                user_id: currentUser.id,
                subcategory_id: formData.subcategory_id,
                amount: amount,
                currency: currency,
                amount_in_sar: conversionResult.converted.amount,
                exchange_rate: conversionResult.rate,
                date: new Date(formData.date).toISOString(),
                note: formData.note || null,
                receipt_url: formData.receipt_url || null
            };

            console.log('💾 بيانات المصروف النهائية:', {
                ...expenseData,
                expenseType,
                familyIdFromUser: currentUser.family_id,
                willBeFamilyExpense: expenseType === 'family' && currentUser.family_id
            });

            await Expense.create(expenseData);

            try {
                await Subcategory.update(selectedSubcategory.id, {
                    usage_count: (selectedSubcategory.usage_count || 0) + 1
                });
            } catch (updateError) {
                console.warn("Failed to update usage count:", updateError);
            }

            localStorage.setItem('rialmind_last_subcategory_id', formData.subcategory_id);

            logTelemetry('createExpense', 'success', Date.now() - submitStartTime);
            toast.success(`تم إضافة المصروف بنجاح: ${conversionResult.original.formatted}`);
            router.push("/dashboard");

        } catch (error) {
            logTelemetry('createExpense', 'error', Date.now() - submitStartTime);
            console.error("Error adding expense:", error);

            if (error.message?.includes('ValidationError')) {
                setErrors({ submit: "بيانات غير صحيحة. تأكد من صحة جميع الحقول." });
            } else {
                setErrors({ submit: "حدث خطأ أثناء حفظ المصروف. يرجى المحاولة مرة أخرى." });
            }
        }
        setIsSubmitting(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const getGroupedSubcategories = () => {
        const grouped = {};

        // Categories are already sorted in loadInitialData, iterate through them directly
        categories.forEach(category => {
            const categorySubcategories = subcategories
                .filter(sub => String(sub.category_id) === String(category.id))
                .filter((sub, index, self) =>
                    // Ensure unique subcategory names within a category, picking the first one
                    // This can happen if somehow duplicates were created
                    index === self.findIndex(s => s.name === sub.name)
                )
                .sort((a, b) => {
                    // Sort by usage count (descending), then by name (ascending)
                    if ((b.usage_count || 0) !== (a.usage_count || 0)) {
                        return (b.usage_count || 0) - (a.usage_count || 0);
                    }
                    return a.name.localeCompare(b.name, 'ar');
                });

            if (categorySubcategories.length > 0) {
                grouped[category.name] = categorySubcategories;
            }
        });

        // The categories array is already sorted, so iterating through it will maintain order.
        // No need for a separate `orderedGrouped` object.
        return grouped;
    };

    if (isLoading && !categories.length) {
        return <AddExpenseSkeleton />;
    }

    if (errors.general && !categories.length && !subcategories.length) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-center h-96">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{errors.general}</AlertDescription>
                        <Button onClick={loadInitialData} className="mt-4">
                            <RefreshCw className="w-4 h-4 ml-2" />
                            إعادة المحاولة
                        </Button>
                    </Alert>
                </div>
            </div>
        );
    }

    const groupedSubcategories = getGroupedSubcategories();

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard")}
                            className="border-emerald-200 hover:bg-emerald-50"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-emerald-800">إضافة مصروف جديد</h1>
                            <p className="text-emerald-600 mt-1">
                                اليوم: {formatHijriDate(new Date())}
                            </p>
                        </div>
                    </div>

                    {errors.categories && (
                        <Alert className="mb-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{errors.categories}</AlertDescription>
                        </Alert>
                    )}

                    {budgetWarning && (
                        <Alert className="mb-6 border-orange-200 bg-orange-50">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800">{budgetWarning}</AlertDescription>
                        </Alert>
                    )}

                    {errors.submit && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{errors.submit}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                                <CardHeader>
                                    <CardTitle className="text-emerald-800 flex items-center gap-2">
                                        <Receipt className="w-5 h-5" />
                                        تفاصيل المصروف
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {currentUser?.family_id && (
                                        <div className="space-y-2">
                                            <Label className="text-emerald-700 font-medium">نوع المصروف</Label>
                                            <Tabs value={expenseType} onValueChange={setExpenseType} dir="rtl">
                                                <TabsList className="grid w-full grid-cols-2 bg-emerald-50">
                                                    <TabsTrigger value="personal">شخصي</TabsTrigger>
                                                    <TabsTrigger value="family">عائلي</TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                            <p className="text-xs text-emerald-600 mt-2 px-1">
                                                {expenseType === 'personal'
                                                    ? 'سيُسجل هذا المصروف في حسابك الشخصي فقط.'
                                                    : 'سيتم مشاركة هذا المصروف مع العائلة وتضمينه في الميزانيات المشتركة.'}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount" className="text-emerald-700 font-medium">
                                                المبلغ *
                                            </Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                placeholder="0.00"
                                                value={formData.amount}
                                                onChange={(e) => handleChange('amount', e.target.value)}
                                                className={`text-lg ${errors.amount ? 'border-red-300' : 'border-emerald-200'} focus:border-emerald-500`}
                                                required
                                            />
                                            {errors.amount && (
                                                <p className="text-sm text-red-600">{errors.amount}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="currency" className="text-emerald-700 font-medium">
                                                العملة *
                                            </Label>
                                            <Select
                                                value={formData.currency}
                                                onValueChange={(value) => handleChange('currency', value)}
                                            >
                                                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                                                    <SelectValue placeholder="اختر العملة" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(CURRENCIES).map(([code, info]) => (
                                                        <SelectItem key={code} value={code}>
                                                            <div className="flex items-center gap-2" dir="rtl">
                                                                <span>{info.flag}</span>
                                                                <span>{info.name}</span>
                                                                <span className="text-emerald-600">({info.symbol})</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {formData.currency !== 'SAR' && formData.amount && !isNaN(parseFloat(formData.amount)) && parseFloat(formData.amount) > 0 && (
                                                <div className="text-xs bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-emerald-700">💱 المعادل:</span>
                                                        <span className="font-bold text-emerald-800">
                                                            {formatCurrency(convertCurrency(parseFloat(formData.amount), formData.currency, 'SAR'), 'SAR')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1 text-emerald-600">
                                                        <span>سعر الصرف:</span>
                                                        <span>{getExchangeRate(formData.currency)} ر.س</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subcategory_id" className="text-emerald-700 font-medium flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            البند *
                                        </Label>

                                        {isLoading ? (
                                            <Skeleton className="h-10 w-full" />
                                        ) : errors.general ? (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center flex items-center justify-between">
                                                <p className="text-red-700 text-sm font-medium">فشل تحميل البنود.</p>
                                                <Button onClick={loadInitialData} variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                                                    <RefreshCw className="w-4 h-4 ml-2" />
                                                    إعادة المحاولة
                                                </Button>
                                            </div>
                                        ) : subcategories.length > 0 ? (
                                            <Select
                                                onValueChange={(value) => handleChange('subcategory_id', value)}
                                                value={formData.subcategory_id}
                                                dir="rtl"
                                            >
                                                <SelectTrigger className={`${errors.subcategory_id ? 'border-red-300' : 'border-emerald-200'} focus:border-emerald-500`}>
                                                    <SelectValue placeholder="اختر البند" />
                                                </SelectTrigger>
                                                <SelectContent position="popper" sideOffset={5} align="end">
                                                    {Object.entries(groupedSubcategories).map(([categoryName, subs]) => (
                                                        <SelectGroup key={categoryName}>
                                                            <SelectLabel className="text-emerald-700 bg-emerald-50 sticky top-0">{categoryName}</SelectLabel>
                                                            {subs.map((subcategory) => (
                                                                <SelectItem key={`${subcategory.id}-${subcategory.name}`} value={subcategory.id}>
                                                                    <div className="flex items-center gap-2" dir="rtl">
                                                                        <span>{subcategory.name}</span>
                                                                        {subcategory.usage_count > 0 && (
                                                                            <span className="text-xs text-emerald-500">({subcategory.usage_count})</span>
                                                                        )}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
                                                <p className="text-amber-800 font-semibold">لا توجد بنود</p>
                                                <p className="text-sm text-amber-700">اذهب إلى صفحة الفئات لإضافة بنود جديدة.</p>
                                            </div>
                                        )}
                                        {errors.subcategory_id && (
                                            <p className="text-sm text-red-600">{errors.subcategory_id}</p>
                                        )}
                                        <div className="text-xs text-emerald-600 flex items-center gap-2 mt-2">
                                            <Lightbulb className="w-4 h-4 text-amber-500" />
                                            <span>
                                                لا تجد البند المطلوب؟ استخدم{' '}
                                                <button 
                                                    type="button"
                                                    onClick={() => router.push('/financial-chatbot')} 
                                                    className="font-bold underline text-emerald-700 hover:text-emerald-900"
                                                >
                                                    المساعد الذكي
                                                </button>{' '}
                                                لإضافة بنود جديدة تلقائياً.
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                                <CardHeader>
                                    <CardTitle className="text-emerald-800 flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5" />
                                        معلومات إضافية
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="text-emerald-700 font-medium">
                                            التاريخ *
                                        </Label>
                                        <div className="space-y-2">
                                            <Input
                                                id="date"
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => handleChange('date', e.target.value)}
                                                className={`${errors.date ? 'border-red-300' : 'border-emerald-200'} focus:border-emerald-500`}
                                                required
                                            />
                                            {errors.date && (
                                                <p className="text-sm text-red-600">{errors.date}</p>
                                            )}
                                            <p className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded">
                                                📅 التاريخ الهجري: {formatHijriDate(formData.date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="note" className="text-emerald-700 font-medium">
                                            ملاحظات (اختيارية)
                                        </Label>
                                        <Textarea
                                            id="note"
                                            placeholder="أضف أي ملاحظات إضافية..."
                                            value={formData.note}
                                            onChange={(e) => handleChange('note', e.target.value)}
                                            className="h-24 border-emerald-200 focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="receipt" className="text-emerald-700 font-medium">
                                            إرفاق فاتورة (اختياري)
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="receipt"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={(e) => handleFileUpload(e.target.files[0])}
                                                className="border-emerald-200"
                                                disabled={isUploadingFile}
                                            />
                                            {isUploadingFile && (
                                                <div className="flex items-center gap-2 px-3">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-sm text-emerald-600">جاري الرفع...</span>
                                                </div>
                                            )}
                                        </div>
                                        {formData.receipt_url && (
                                            <div className="flex items-center gap-2 text-sm text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>تم رفع الفاتورة بنجاح</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dashboard")}
                                className="flex-1 border-emerald-200 hover:bg-emerald-50"
                                disabled={isSubmitting}
                            >
                                إلغاء
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || Object.keys(errors).some(key => key !== 'general' && errors[key])}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        جاري الحفظ...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        حفظ المصروف
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
