
import React, { useState, useEffect, useCallback } from "react";
import { Expense, Budget, Category, Subcategory } from "@/api/entities"; // Added Category and Subcategory
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { motion } from "framer-motion";
import { FileText } from "lucide-react"; // Import FileText icon

import MonthReportHeader from "../components/reports/MonthReportHeader";
import CategoryBreakdown from "../components/reports/CategoryBreakdown";
import ExpenseTrends from "../components/reports/ExpenseTrends";
import DetailedExpensesList from "../components/reports/DetailedExpensesList";

// Helper for Hijri formatting
const formatHijriDate = (dateString, options = {}) => {
  if (!dateString) return '';
  // Ensure the date string is parsable by Date constructor for consistency across browsers,
  // e.g., 'YYYY-MM-DD' is generally preferred. If expense.date is already 'YYYY-MM-DD', no change needed.
  // Assuming expense.date is in 'YYYY-MM-DD' format.
  const date = new Date(dateString);
  const defaultOptions = {
    calendar: 'islamic-umalqura', // Use Um Al-Qura calendar
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Riyadh' // Set time zone to Riyadh for accurate Hijri conversion
  };
  return new Intl.DateTimeFormat('ar-SA', { ...defaultOptions, ...options }).format(date);
};

const formatHijriMonth = (gregorianMonth) => {
  const date = new Date(gregorianMonth + '-01');
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Riyadh'
  }).format(date);
};

export default function MonthlyReport() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // ✅ إصلاح: جلب البيانات مع الربط الصحيح لتجنب undefined
      const [expensesData, budgetData, categoriesData, subcategoriesData] = await Promise.all([
        Expense.list("-date"),
        Budget.filter({ month: selectedMonth + "-01" }),
        Category.list(),
        Subcategory.list()
      ]);
      
      // إنشاء خرائط للوصول السريع
      const categoriesMap = new Map(categoriesData.map(cat => [cat.id, cat]));
      const subcategoriesMap = new Map(subcategoriesData.map(sub => [sub.id, sub]));
      
      // فلترة المصاريف للشهر المحدد مع دمج بيانات الفئات
      const monthExpenses = expensesData
        .filter(expense => expense.date.startsWith(selectedMonth))
        .map(expense => {
          const subcategory = subcategoriesMap.get(expense.subcategory_id);
          const category = subcategory ? categoriesMap.get(subcategory.category_id) : null;
          
          return {
            ...expense,
            // ✅ إصلاح: التأكد من وجود قيم افتراضية
            category: category ? category.name : 'غير مصنف',
            subcategory: subcategory ? subcategory.name : 'غير محدد',
            categoryColor: category ? category.color : '#6B7280',
            categoryIcon: category ? category.icon : '🏷️'
          };
        })
        .filter(expense => expense.category !== 'غير مصنف'); // إخفاء المصاريف غير المصنفة
      
      setExpenses(monthExpenses);

      if (budgetData.length > 0) {
        setBudget(budgetData[0]);
      } else {
        setBudget(null);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  }, [selectedMonth]); // ✅ إصلاح: إضافة selectedMonth كـ dependency

  useEffect(() => {
    loadData();
  }, [loadData]); // ✅ إصلاح: إضافة loadData كـ dependency

  const downloadReport = async () => {
    try {
      // Prepare comprehensive report data with Hijri dates
      const monthName = formatHijriMonth(selectedMonth);
      const reportData = {
        month: monthName,
        summary: {
          totalIncome: budget?.monthly_income || 0,
          totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
          savings: (budget?.monthly_income || 0) - expenses.reduce((sum, expense) => sum + expense.amount, 0),
          expenseCount: expenses.length
        },
        categoryBreakdown: {},
        expenses: expenses.map(expense => ({
          'التاريخ الهجري': formatHijriDate(expense.date),
          'التاريخ الميلادي': expense.date,
          'الفئة': expense.category, // Now guaranteed to be a string due to loadData changes
          'المبلغ (ر.س)': expense.amount,
          'الملاحظات': expense.notes || 'لا توجد ملاحظات'
        }))
      };

      // Calculate category breakdown
      expenses.forEach(expense => {
        reportData.categoryBreakdown[expense.category] = 
          (reportData.categoryBreakdown[expense.category] || 0) + expense.amount;
      });

      // Create Excel-compatible CSV with proper Arabic support
      let csvContent = '';
      
      // Add BOM for proper UTF-8 encoding in Excel
      csvContent += '\uFEFF';
      
      // Report header with Hijri date
      csvContent += `"تقرير المصاريف الشهري - ${reportData.month}"\n\n`;
      
      // Summary section
      csvContent += '"ملخص الشهر:"\n';
      csvContent += '"البيان","القيمة (ر.س)"\n';
      csvContent += `"الدخل الشهري","${reportData.summary.totalIncome.toLocaleString('ar-SA')}"\n`;
      csvContent += `"إجمالي المصاريف","${reportData.summary.totalExpenses.toLocaleString('ar-SA')}"\n`;
      csvContent += `"صافي المدخرات","${reportData.summary.savings.toLocaleString('ar-SA')}"\n`;
      csvContent += `"عدد المصاريف","${reportData.summary.expenseCount}"\n`;
      csvContent += `"معدل الادخار","${((reportData.summary.savings / (reportData.summary.totalIncome || 1)) * 100).toFixed(1)}%"\n\n`;

      // Category breakdown section
      csvContent += '"توزيع المصاريف حسب الفئة:"\n';
      csvContent += '"الفئة","المبلغ (ر.س)","النسبة %"\n';
      Object.entries(reportData.categoryBreakdown)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, amount]) => {
          const percentage = ((amount / reportData.summary.totalExpenses) * 100).toFixed(1);
          csvContent += `"${category}","${amount.toLocaleString('ar-SA')}","${percentage}%"\n`;
        });

      csvContent += '\n';

      // Detailed expenses section with both Hijri and Gregorian dates
      csvContent += '"تفاصيل جميع المصاريف:"\n';
      csvContent += '"التاريخ الهجري","التاريخ الميلادي","الفئة","المبلغ (ر.س)","الملاحظات"\n';
      
      // expenses are already sorted by date (newest first) from initial `Expense.list("-date")` query
      const sortedExpenses = [...reportData.expenses]; 

      sortedExpenses.forEach(expense => {
        csvContent += `"${expense['التاريخ الهجري']}","${expense['التاريخ الميلادي']}","${expense.الفئة}","${expense['المبلغ (ر.س)'].toLocaleString('ar-SA')}","${expense.الملاحظات}"\n`;
      });

      // Add statistics section
      csvContent += '\n"إحصائيات إضافية:"\n';
      csvContent += '"الإحصائية","القيمة"\n';
      
      const daysInMonth = new Date(new Date(selectedMonth + '-01').getFullYear(), new Date(selectedMonth + '-01').getMonth() + 1, 0).getDate();
      const dailyAverage = reportData.summary.totalExpenses / daysInMonth;
      const highestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;
      const lowestExpense = expenses.length > 0 ? Math.min(...expenses.map(e => e.amount)) : 0;
      
      csvContent += `"متوسط الإنفاق اليومي","${dailyAverage.toFixed(2)} ر.س"\n`;
      csvContent += `"أعلى مصروف منفرد","${highestExpense.toLocaleString('ar-SA')} ر.س"\n`;
      csvContent += `"أقل مصروف منفرد","${lowestExpense.toLocaleString('ar-SA')} ر.س"\n`;
      
      // Most expensive category
      const topCategory = Object.entries(reportData.categoryBreakdown)
        .sort(([,a], [,b]) => b - a)[0];
      if (topCategory) {
        csvContent += `"الفئة الأعلى إنفاقاً","${topCategory[0]} (${topCategory[1].toLocaleString('ar-SA')} ر.س)"\n`;
      }

      // Add report generation info with Hijri date
      csvContent += '\n"معلومات التقرير:"\n';
      const currentHijriDate = formatHijriDate(new Date(), {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      csvContent += `"تاريخ إنشاء التقرير","${currentHijriDate}"\n`;
      csvContent += '"المصدر","تطبيق ريال مايند - إدارة المصاريف العائلية"\n';

      // Create and download the file with proper encoding
      const blob = new Blob([csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `تقرير-مصاريف-${selectedMonth}-${format(new Date(), 'ddMMyyyy')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const totalIncome = budget?.monthly_income || 0;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="print:hidden"
      >
        <MonthReportHeader
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          onDownloadReport={downloadReport}
          onDownloadPDF={() => window.print()}
        />
      </motion.div>

      {/* Print-only Header */}
      <div className="hidden print:block text-center mb-8 page-break-avoid">
        <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <FileText className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">تقرير المصاريف الشهري</h1>
        </div>
        <p className="text-lg text-gray-600">{formatHijriMonth(selectedMonth)}</p>
      </div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="page-break-avoid"
      >
        <CategoryBreakdown expenses={expenses} totalExpenses={totalExpenses} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="page-break-avoid"
      >
        <ExpenseTrends expenses={expenses} selectedMonth={selectedMonth} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="page-break-avoid"
      >
        <DetailedExpensesList expenses={expenses} />
      </motion.div>
    </div>
  );
}
