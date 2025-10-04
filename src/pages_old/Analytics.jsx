
import React, { useState, useEffect } from "react";
import { Expense, Category, Subcategory } from "@/api/entities"; // Added Category, Subcategory
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const CATEGORY_COLORS = {
  "طعام": "#F59E0B",
  "سكن": "#3B82F6",
  "مواصلات": "#10B981",
  "صحة": "#EF4444",
  "تسلية": "#8B5CF6"
};

// Helper for Hijri formatting
const formatHijriDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = {
    calendar: 'islamic-umalqura',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Riyadh'
  };
  return new Intl.DateTimeFormat('ar-SA', { ...defaultOptions, ...options }).format(date);
};

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);

      // ✅ إصلاح: جلب البيانات مع الربط الصحيح وتجنب undefined
      const [expensesData, categoriesData, subcategoriesData] = await Promise.all([
        Expense.list("-date"),
        Category.list(),
        Subcategory.list()
      ]);

      // إنشاء خرائط للوصول السريع
      const categoriesMap = new Map(categoriesData.map(cat => [cat.id, cat]));
      const subcategoriesMap = new Map(subcategoriesData.map(sub => [sub.id, sub]));

      // فلترة المصاريف للشهر الحالي مع دمج بيانات الفئات
      const thisMonthExpenses = expensesData
        .filter(expense => expense.date.startsWith(currentMonth))
        .map(expense => {
          const subcategory = subcategoriesMap.get(expense.subcategory_id);
          const category = subcategory ? categoriesMap.get(subcategory.category_id) : null;

          return {
            ...expense,
            // ✅ إصلاح: التأكد من وجود قيم افتراضية وعدم ظهور undefined
            category: category ? category.name : 'غير مصنف',
            subcategory: subcategory ? subcategory.name : 'غير محدد',
            categoryColor: category ? category.color : '#6B7280',
            categoryIcon: category ? category.icon : '🏷️'
          };
        })
        .filter(expense => expense.category !== 'غير مصنف'); // إخفاء المصاريف غير المصنفة من التقارير

      setExpenses(thisMonthExpenses);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
    setIsLoading(false);
  };

  const getCategoryData = () => {
    const categoryTotals = {};
    const categoryColorsMap = {}; // To store the color for each category

    expenses.forEach(expense => {
      // ✅ إصلاح: التأكد من وجود قيمة للفئة
      const categoryName = expense.category || 'غير مصنف';
      if (categoryName !== 'غير مصنف') {
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + expense.amount;
        // Store the actual color from the expense object
        categoryColorsMap[categoryName] = expense.categoryColor || '#6B7280'; // Fallback to a default gray
      }
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      // Use the stored color
      fill: categoryColorsMap[category]
    }));
  };

  const getTopExpenses = () => {
    return expenses
      .filter(expense => expense.category && expense.category !== 'غير مصنف') // تصفية المصاريف غير المصنفة
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length ? totalAmount / expenses.length : 0;
  const categoryData = getCategoryData();
  const topExpenses = getTopExpenses();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-emerald-200 rounded-lg shadow-lg">
          <p className="font-medium text-emerald-800">{data.payload.name}</p>
          <p className="text-emerald-600">
            {data.value.toLocaleString('ar-SA')} ر.س
          </p>
          <p className="text-sm text-emerald-500">
            {((data.value / totalAmount) * 100).toFixed(1)}% من المصاريف
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8" />
          الإحصائيات والتحليلات
        </h1>
        <p className="text-emerald-600">
          تحليل شامل لمصاريفك خلال {format(new Date(), 'MMMM yyyy', { locale: ar })}
        </p>
      </motion.div>

      {expenses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-emerald-800 mb-2">لا توجد بيانات</h3>
          <p className="text-emerald-600">لم يتم إضافة أي مصاريف لهذا الشهر بعد</p>
        </motion.div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-emerald-600 text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    إجمالي المصاريف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-800 mb-1">
                    {totalAmount.toLocaleString('ar-SA')} ر.س
                  </div>
                  <p className="text-sm text-emerald-600">{expenses.length} مصروف</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-amber-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-amber-600 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    متوسط المصروف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-800 mb-1">
                    {averageExpense.toLocaleString('ar-SA')} ر.س
                  </div>
                  <p className="text-sm text-amber-600">لكل مصروف</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-600 text-sm">
                    أعلى فئة مصاريف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800 mb-1">
                    {categoryData.length > 0 ? categoryData[0].name : '-'}
                  </div>
                  <p className="text-sm text-blue-600">
                    {categoryData.length > 0 ? `${categoryData[0].value.toLocaleString('ar-SA')} ر.س` : 'لا يوجد'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                <CardHeader>
                  <CardTitle className="text-emerald-800">توزيع المصاريف حسب الفئة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
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
                      <Tooltip content={<CustomTooltip />} />
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
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Expenses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                <CardHeader>
                  <CardTitle className="text-emerald-800">أكبر المصاريف</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topExpenses.map((expense, index) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 border border-emerald-100"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              // Use expense.categoryColor directly here
                              style={{ backgroundColor: expense.categoryColor }}
                            />
                            <span className="font-medium text-emerald-800">
                              {expense.category}
                            </span>
                          </div>
                          <div className="text-sm text-emerald-600">
                            {formatHijriDate(expense.date)}
                          </div>
                          {expense.notes && (
                            <div className="text-xs text-emerald-500 mt-1">
                              {expense.notes}
                            </div>
                          )}
                        </div>
                        <div className="text-lg font-bold text-emerald-800">
                          {expense.amount.toLocaleString('ar-SA')} ر.س
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
              <CardHeader>
                <CardTitle className="text-emerald-800">تفصيل الفئات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryData.map((category) => {
                    const percentage = ((category.value / totalAmount) * 100).toFixed(1);
                    return (
                      <div
                        key={category.name}
                        className="p-4 rounded-lg border-r-4 bg-gray-50"
                        // Use category.fill directly as it now contains the correct color
                        style={{ borderColor: category.fill }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">{category.name}</h4>
                          <span className="text-sm text-gray-600">{percentage}%</span>
                        </div>
                        <div className="text-xl font-bold mb-1" style={{ color: category.fill }}>
                          {category.value.toLocaleString('ar-SA')} ر.س
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: category.fill
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
