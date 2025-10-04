
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { Expense } from '@/api/entities';
import { MonthlyIncome } from '@/api/entities';
import { CategoryBudget } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, Download, TrendingUp, AlertTriangle, ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format, endOfMonth, startOfMonth } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Helper for Hijri formatting
const formatHijriMonth = (gregorianMonth) => {
  const date = new Date(gregorianMonth + '-01');
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Riyadh'
  }).format(date);
};

const CATEGORY_COLORS = {
  "طعام": "#F59E0B",
  "سكن": "#3B82F6",
  "مواصلات": "#10B981",
  "صحة": "#EF4444",
  "تسلية": "#8B5CF6",
  "أخرى": "#6B7280"
};

const MEMBER_COLORS = ['#059669', '#D97706', '#DC2626', '#7C2D12', '#1E40AF', '#7C3AED'];

export default function FamilyReport() {
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [familyExpenses, setFamilyExpenses] = useState([]);
    const [familyIncome, setFamilyIncome] = useState(0);
    const [categoryBudgets, setCategoryBudgets] = useState([]);
    const [memberExpenses, setMemberExpenses] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // Memoize generateFamilyAlerts to prevent unnecessary re-creation
    // It depends on `familyIncome` state
    const generateFamilyAlerts = useCallback((expenses, memberData, categoryData, budgets) => {
        const newAlerts = [];
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Budget alerts
        // Access `familyIncome` directly from state, as this function is memoized with it
        if (familyIncome > 0 && totalExpenses > familyIncome * 0.9) {
            newAlerts.push({
                type: 'budget',
                message: `تحذير: مصاريف العائلة تجاوزت 90% من الدخل الإجمالي هذا الشهر.`,
                severity: 'high'
            });
        }

        // Category budget alerts
        categoryData.forEach(cat => {
            if (cat.budget > 0 && cat.value > cat.budget * 0.9) {
                newAlerts.push({
                    type: 'category',
                    message: `تنبيه: فئة "${cat.name}" تجاوزت 90% من الميزانية المحددة.`,
                    severity: 'medium'
                });
            }
        });

        // Member spending alerts
        if (memberData.length > 1) {
            const avgSpending = totalExpenses / memberData.length;
            memberData.forEach(member => {
                // Ensure avgSpending is not zero to avoid division by zero errors or nonsensical alerts
                if (avgSpending > 0 && member.total > avgSpending * 1.5) {
                    newAlerts.push({
                        type: 'member',
                        message: `${member.name} لديه مصاريف أعلى بـ 50% من المتوسط العائلي.`,
                        severity: 'low'
                    });
                }
            });
        }

        setAlerts(newAlerts);
    }, [familyIncome]); // `familyIncome` is a dependency as it's used within this function

    // Memoize processChartData to prevent unnecessary re-creation
    // It depends on the memoized `generateFamilyAlerts`
    const processChartData = useCallback((expenses, members, budgets) => {
        // Process member expenses
        const memberTotals = {};
        members.forEach(member => {
            memberTotals[member.id] = {
                name: member.full_name || member.email,
                email: member.email,
                total: 0,
                expenses: []
            };
        });

        expenses.forEach(expense => {
            if (memberTotals[expense.user_id]) {
                memberTotals[expense.user_id].total += expense.amount;
                memberTotals[expense.user_id].expenses.push(expense);
            }
        });

        const memberExpensesData = Object.values(memberTotals)
            .filter(member => member.total > 0)
            .sort((a, b) => b.total - a.total)
            .map((member, index) => ({
                ...member,
                fill: MEMBER_COLORS[index % MEMBER_COLORS.length]
            }));

        setMemberExpenses(memberExpensesData);

        // Process category data
        const categoryTotals = {};
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const categoryChartData = Object.entries(categoryTotals).map(([category, amount]) => ({
            name: category,
            value: amount,
            budget: budgets.find(b => b.category === category)?.limit_amount || 0,
            fill: CATEGORY_COLORS[category] || CATEGORY_COLORS['أخرى']
        }))
        .filter(cat => cat.value > 0) // Only show categories with expenses
        .sort((a, b) => b.value - a.value);

        setCategoryData(categoryChartData);

        // Generate alerts using the memoized function
        generateFamilyAlerts(expenses, memberExpensesData, categoryChartData, budgets);
    }, [generateFamilyAlerts]); // `generateFamilyAlerts` is a dependency

    // Memoize loadFamilyData. It depends on `selectedMonth` and the memoized `processChartData`.
    const loadFamilyData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Get current user
            const user = await User.me();
            setCurrentUser(user);

            // If no family_id, stop loading and return
            if (!user || !user.family_id) {
                setIsLoading(false);
                return;
            }

            const monthStartDate = new Date(selectedMonth + '-01');
            const monthEndDate = endOfMonth(monthStartDate);

            // ✅ إصلاح جذري: جلب جميع مصاريف ودخل العائلة ثم فلترتها
            const [members, allFamilyExpenses, allSharedIncomes, budgets] = await Promise.all([
                User.filter({ family_id: user.family_id }),
                Expense.filter({ family_id: user.family_id }),
                MonthlyIncome.filter({
                    family_id: user.family_id,
                    is_shared: true
                }),
                CategoryBudget.filter({
                    month: format(monthStartDate, 'yyyy-MM-01'),
                    family_id: user.family_id
                })
            ]);

            // ✅ فلترة المصاريف حسب تاريخ الشهر المحدد على جهازك
            const monthExpenses = allFamilyExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= monthStartDate && expenseDate <= monthEndDate;
            });
            
            // ✅ فلترة الدخل حسب تاريخ الشهر المحدد
            const incomeForMonth = allSharedIncomes.filter(inc => inc.month === format(monthStartDate, 'yyyy-MM-01'));

            // تشخيص دقيق للبيانات
            console.log('✅ تشخيص بيانات تقرير العائلة:', {
                familyId: user.family_id,
                totalFamilyExpensesFetched: allFamilyExpenses.length,
                expensesInCurrentMonth: monthExpenses.length,
                dateRange: `${format(monthStartDate, 'yyyy-MM-dd')} to ${format(monthEndDate, 'yyyy-MM-dd')}`,
            });

            setFamilyMembers(members);
            setFamilyExpenses(monthExpenses);

            const totalIncome = incomeForMonth.reduce((sum, income) => sum + (income.main_amount || 0) + (income.side_amount || 0), 0);
            setFamilyIncome(totalIncome);
            setCategoryBudgets(budgets);

            // Process data for charts if expenses exist
            if (monthExpenses.length > 0) {
                processChartData(monthExpenses, members, budgets);
            } else {
                setMemberExpenses([]);
                setCategoryData([]);
                setAlerts([]); // Clear alerts if no expenses
            }

        } catch (error) {
            console.error("Error loading family data:", error);
            // Optionally, set an alert for the error
        }
        setIsLoading(false);
    }, [selectedMonth, processChartData]); // Dependencies for loadFamilyData

    // useEffect now only depends on the memoized loadFamilyData, ensuring it runs when selectedMonth changes
    useEffect(() => {
        loadFamilyData();
    }, [loadFamilyData]);

    const downloadFamilyReport = async () => {
        try {
            const monthName = formatHijriMonth(selectedMonth);
            const totalExpenses = familyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

            let csvContent = '\uFEFF'; // BOM for UTF-8

            // Report header
            csvContent += `"تقرير العائلة الشهري - ${monthName}"\n\n`;

            // Summary section
            csvContent += '"ملخص العائلة:"\n';
            csvContent += '"البيان","القيمة (ر.س)"\n';
            csvContent += `"إجمالي الدخل العائلي","${familyIncome.toLocaleString('ar-SA')}"\n`;
            csvContent += `"إجمالي المصاريف","${totalExpenses.toLocaleString('ar-SA')}"\n`;
            csvContent += `"صافي المدخرات","${(familyIncome - totalExpenses).toLocaleString('ar-SA')}"\n`;
            csvContent += `"عدد أفراد العائلة","${familyMembers.length}"\n`;
            csvContent += `"عدد المصاريف","${familyExpenses.length}"\n\n`;

            // Member breakdown
            csvContent += '"توزيع المصاريف حسب الأعضاء:"\n';
            csvContent += '"العضو","البريد الإلكتروني","المبلغ (ر.س)","النسبة %"\n';
            memberExpenses.forEach(member => {
                const percentage = totalExpenses > 0 ? ((member.total / totalExpenses) * 100).toFixed(1) : 0;
                csvContent += `"${member.name}","${member.email}","${member.total.toLocaleString('ar-SA')}","${percentage}%"\n`;
            });

            csvContent += '\n"توزيع المصاريف حسب الفئة:"\n';
            csvContent += '"الفئة","المبلغ (ر.س)","النسبة %","الميزانية المحددة"\n';
            categoryData.forEach(cat => {
                const percentage = totalExpenses > 0 ? ((cat.value / totalExpenses) * 100).toFixed(1) : 0;
                csvContent += `"${cat.name}","${cat.value.toLocaleString('ar-SA')}","${percentage}%","${cat.budget.toLocaleString('ar-SA')}"\n`;
            });

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `تقرير-العائلة-${selectedMonth}-${format(new Date(), 'ddMMyyyy')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error downloading family report:", error);
        }
    };

    // Generate month options
    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const value = format(date, 'yyyy-MM');
        const label = `${formatHijriMonth(value)} (${value})`;
        return { value, label };
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // This check is now robust and won't show the error message incorrectly
    if (!currentUser || !currentUser.family_id) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <Users className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
                <h2 className="text-xl font-bold text-emerald-800">
                    هذه الصفحة مخصصة للعائلات
                </h2>
                <p className="text-emerald-600 mt-2 mb-6">
                    يبدو أنك لست عضواً في عائلة بعد. انضم إلى عائلة أو قم بإنشاء واحدة جديدة للوصول إلى التقارير العائلية.
                </p>
                <Link to={createPageUrl("MyFamily")}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Users className="w-4 h-4 ml-2" />
                        الذهاب إلى صفحة العائلة
                    </Button>
                </Link>
            </div>
        );
    }

    const totalExpenses = familyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savings = familyIncome - totalExpenses;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden"
            >
                <div className="flex items-center gap-4">
                    <Link to={createPageUrl("Dashboard")}>
                        <Button variant="outline" className="border-emerald-200 hover:bg-emerald-50">
                            <ArrowLeft className="w-4 h-4 ml-2" />
                            العودة
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
                            <Users className="w-8 h-8" />
                            تقرير العائلة
                        </h1>
                        <p className="text-emerald-600 mt-1">
                            شهر: {formatHijriMonth(selectedMonth)} • {familyMembers.length} أعضاء
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-64 border-emerald-200">
                            <SelectValue placeholder="اختر الشهر" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthOptions.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                    {month.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={downloadFamilyReport}
                        className="border-emerald-200 hover:bg-emerald-50"
                    >
                        <Download className="w-4 h-4 ml-2" />
                        تحميل Excel
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.print()}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                        <FileText className="w-4 h-4 ml-2" />
                        تحميل PDF
                    </Button>
                </div>
            </motion.div>

            {/* Print-only Header */}
            <div className="hidden print:block text-center mb-8 page-break-avoid">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                        <Users className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">تقرير العائلة الشهري</h1>
                </div>
                <p className="text-lg text-gray-600">شهر: {formatHijriMonth(selectedMonth)} • {familyMembers.length} أعضاء</p>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="space-y-3 print:hidden"
                >
                    {alerts.map((alert, index) => (
                        <Alert key={index} variant={alert.severity === 'high' ? 'destructive' : 'default'}
                               className={`${alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                                         alert.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                                         'bg-blue-50 border-blue-200'}`}>
                            <AlertTriangle className="h-5 w-5" />
                            <AlertDescription className="font-medium">
                                {alert.message}
                            </AlertDescription>
                        </Alert>
                    ))}
                </motion.div>
            )}

            {familyExpenses.length > 0 ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 page-break-avoid">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-emerald-600">
                                        إجمالي دخل العائلة
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-emerald-700">
                                        {familyIncome.toLocaleString('ar-SA')} ر.س
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-red-100">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-red-600">
                                        إجمالي المصاريف
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-red-700">
                                        {totalExpenses.toLocaleString('ar-SA')} ر.س
                                    </div>
                                    <p className="text-sm text-red-600">{familyExpenses.length} مصروف</p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className={`rtl-shadow bg-white/90 backdrop-blur-sm ${
                                savings >= 0 ? 'border-amber-100' : 'border-red-200'
                            }`}>
                                <CardHeader className="pb-3">
                                    <CardTitle className={`text-sm font-medium flex items-center gap-2 ${
                                        savings >= 0 ? 'text-amber-600' : 'text-red-600'
                                    }`}>
                                        <TrendingUp className="w-4 h-4" />
                                        مدخرات العائلة
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-3xl font-bold ${
                                        savings >= 0 ? 'text-amber-700' : 'text-red-700'
                                    }`}>
                                        {Math.abs(savings).toLocaleString('ar-SA')} ر.س
                                        {savings < 0 && <span className="text-lg mr-2">-</span>}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-blue-100">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-blue-600">
                                        متوسط الإنفاق للفرد
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-700">
                                        {familyMembers.length > 0 ? (totalExpenses / familyMembers.length).toLocaleString('ar-SA') : '0'} ر.س
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid lg:grid-cols-2 gap-8 page-break-avoid">
                        {/* Member Expenses Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                                <CardHeader>
                                    <CardTitle className="text-emerald-800">مصاريف الأعضاء</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {memberExpenses.length === 0 ? (
                                        <div className="text-center py-8 text-emerald-600">
                                            <p>لا توجد مصاريف لأعضاء العائلة هذا الشهر</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={memberExpenses}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#6B7280"
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#6B7280"
                                                />
                                                <Tooltip
                                                    formatter={(value) => [`${value.toLocaleString('ar-SA')} ر.س`, 'المبلغ']}
                                                    labelFormatter={(label) => `العضو: ${label}`}
                                                />
                                                <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Category Distribution Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                                <CardHeader>
                                    <CardTitle className="text-emerald-800">توزيع المصاريف حسب الفئة</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {categoryData.length === 0 ? (
                                        <div className="text-center py-8 text-emerald-600">
                                            <p>لا توجد مصاريف لهذا الشهر</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    strokeWidth={2}
                                                    stroke="#fff"
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => [`${value.toLocaleString('ar-SA')} ر.س`, 'المبلغ']}
                                                />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                    formatter={(value, entry) => (
                                                        <span style={{ color: entry.color, fontWeight: 'medium' }}>
                                                            {value}
                                                        </span>
                                                    )}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Detailed Member Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="page-break-avoid"
                    >
                        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                            <CardHeader>
                                <CardTitle className="text-emerald-800">تفاصيل مصاريف الأعضاء</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {memberExpenses.map((member) => (
                                        <div key={member.email} className="border border-emerald-100 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: member.fill }}
                                                    />
                                                    <div>
                                                        <h4 className="font-semibold text-emerald-800">{member.name}</h4>
                                                        <p className="text-sm text-emerald-600">{member.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-xl font-bold text-emerald-700">
                                                        {member.total.toLocaleString('ar-SA')} ر.س
                                                    </div>
                                                    <div className="text-sm text-emerald-600">
                                                        {totalExpenses > 0 ? ((member.total / totalExpenses) * 100).toFixed(1) : 0}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-emerald-50/50 rounded-md p-3">
                                                <div className="text-xs text-emerald-600 mb-2">أحدث المصاريف:</div>
                                                <div className="space-y-1">
                                                    {member.expenses.slice(0, 3).map(expense => (
                                                        <div key={expense.id} className="flex justify-between items-center text-sm">
                                                            <span className="text-emerald-700">{expense.category}</span>
                                                            <span className="font-mono text-emerald-800">{expense.amount.toLocaleString('ar-SA')} ر.س</span>
                                                        </div>
                                                    ))}
                                                    {member.expenses.length > 3 && (
                                                        <div className="text-xs text-emerald-500">
                                                            و {member.expenses.length - 3} مصاريف أخرى...
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            ) : (
                <div className="text-center py-16 bg-white/50 rounded-lg border border-emerald-100">
                    <Users className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
                    <h3 className="text-xl font-semibold text-emerald-800">لا توجد بيانات لهذا الشهر</h3>
                    <p className="text-emerald-600 mt-2">
                        لم يتم تسجيل أي مصاريف للعائلة في الفترة المحددة.
                    </p>
                </div>
            )}
        </div>
    );
}
