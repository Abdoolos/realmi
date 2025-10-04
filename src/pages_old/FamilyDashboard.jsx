
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { Expense } from '@/api/entities';
import { MonthlyIncome } from '@/api/entities';
import { CategoryBudget } from '@/api/entities';
import { Category } from '@/api/entities';
import { Subcategory } from '@/api/entities';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import SummaryCards from '@/components/family-reports/SummaryCards';
import CategoryBreakdown from '@/components/family-reports/CategoryBreakdown';
import MemberBreakdown from '@/components/family-reports/MemberBreakdown';
import SmartRecommendations from '@/components/family-reports/SmartRecommendations';
import RecentExpenses from '@/components/dashboard/RecentExpenses';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
};

export default function FamilyDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [familyExpenses, setFamilyExpenses] = useState([]);
    const [familyIncome, setFamilyIncome] = useState(0);

    const loadFamilyData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const user = await User.me();
            setCurrentUser(user);

            if (!user.family_id) {
                setIsLoading(false);
                return;
            }

            const today = new Date();
            const monthStart = startOfMonth(today);
            const monthEnd = endOfMonth(today);

            // ✅ إصلاح: جلب جميع الدخل والمصاريف للعائلة ثم تصفيتها
            const [members, allFamilyExpenses, allSharedIncomes, categoriesData, subcategoriesData] = await Promise.all([
                User.filter({ family_id: user.family_id }),
                Expense.filter({ family_id: user.family_id }),
                MonthlyIncome.filter({ 
                    family_id: user.family_id, 
                    is_shared: true 
                }),
                Category.list(),
                Subcategory.list(),
            ]);

            setFamilyMembers(members);

            // Filter expenses for the current month
            const expensesForMonth = allFamilyExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= monthStart && expenseDate <= monthEnd;
            });

            // Filter income for the current month
            const incomeForMonth = allSharedIncomes.filter(inc => inc.month === format(monthStart, 'yyyy-MM-01'));

            console.log('✅ تشخيص نهائي للبيانات:', {
                familyId: user.family_id,
                totalFamilyExpensesFetched: allFamilyExpenses.length,
                expensesInCurrentMonth: expensesForMonth.length,
                dateRange: `${format(monthStart, 'yyyy-MM-dd')} to ${format(monthEnd, 'yyyy-MM-dd')}`,
                sampleAllFetched: allFamilyExpenses.slice(0, 2).map(e => ({id: e.id, date: e.date, amount: e.amount_in_sar})),
                sampleMonthFiltered: expensesForMonth.slice(0, 2).map(e => ({id: e.id, date: e.date, amount: e.amount_in_sar}))
            });

            // دمج بيانات المصاريف مع الفئات
            const categoriesMap = new Map(categoriesData.map(c => [c.id, c]));
            const subcategoriesMap = new Map(subcategoriesData.map(s => [s.id, s]));
            
            const hydratedExpenses = expensesForMonth.map(expense => {
                const subcategory = subcategoriesMap.get(expense.subcategory_id);
                const category = subcategory ? categoriesMap.get(subcategory.category_id) : null;
                return {
                    ...expense,
                    categoryName: category ? category.name : 'غير محدد',
                    subcategoryName: subcategory ? subcategory.name : 'غير محدد',
                };
            });
            
            setFamilyExpenses(hydratedExpenses);

            const totalIncome = incomeForMonth.reduce((sum, inc) => sum + inc.main_amount + (inc.side_amount || 0), 0);
            setFamilyIncome(totalIncome);

        } catch (err) {
            console.error("Error loading family dashboard:", err);
            setError("حدث خطأ أثناء تحميل بيانات العائلة. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFamilyData();
    }, [loadFamilyData]);

    const totalExpenses = familyExpenses.reduce((sum, exp) => sum + exp.amount_in_sar, 0);
    const savings = familyIncome - totalExpenses;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-emerald-600">جاري تحميل لوحة تحكم العائلة...</p>
                </div>
            </div>
        );
    }

    if (!currentUser || !currentUser.family_id) {
        return (
            <div className="text-center p-8">
                <Users className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
                <h2 className="text-2xl font-bold text-emerald-800">لم تنضم إلى عائلة بعد</h2>
                <p className="text-emerald-600 mt-2">
                    انضم إلى عائلة أو أنشئ واحدة جديدة من صفحة "عائلتي" للوصول إلى هذه الميزات.
                </p>
                <Link to={createPageUrl('MyFamily')}>
                    <Button className="mt-4">الذهاب إلى صفحة عائلتي</Button>
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <h2 className="text-xl font-bold text-red-700">حدث خطأ</h2>
                <p className="text-red-600 mt-2">{error}</p>
                <Button onClick={loadFamilyData} variant="destructive" className="mt-4">
                    إعادة المحاولة
                </Button>
            </div>
        );
    }

    return (
        <motion.div 
            className="max-w-7xl mx-auto space-y-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-emerald-800">لوحة تحكم العائلة</h1>
                    <p className="text-emerald-600">نظرة شاملة على الوضع المالي لعائلتك هذا الشهر.</p>
                    {familyExpenses.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                            📊 يتم عرض {familyExpenses.length} مصروف من العائلة
                        </p>
                    )}
                </div>
                <Link to={createPageUrl("FamilyReport")}>
                    <Button variant="outline">عرض التقرير التفصيلي</Button>
                </Link>
            </div>
            
            <SummaryCards 
                totalIncome={familyIncome}
                totalExpenses={totalExpenses}
                savings={savings}
                membersCount={familyMembers.length}
            />

            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    {familyExpenses.length === 0 ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                            <h3 className="text-lg font-semibold text-amber-800 mb-2">لا توجد مصاريف عائلية هذا الشهر</h3>
                            <p className="text-amber-700 text-sm">
                                عند إضافة مصروف جديد، تأكد من اختيار "عائلي" في نوع المصروف ليظهر هنا.
                            </p>
                            <Link to={createPageUrl("AddExpense")} className="inline-block mt-3">
                                <Button className="bg-amber-600 hover:bg-amber-700">
                                    إضافة مصروف عائلي
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <RecentExpenses expenses={familyExpenses} />
                    )}
                    <SmartRecommendations expenses={familyExpenses} income={familyIncome} />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <CategoryBreakdown expenses={familyExpenses} />
                    <MemberBreakdown expenses={familyExpenses} members={familyMembers} />
                </div>
            </div>
        </motion.div>
    );
}
