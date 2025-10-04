
import React, { useState, useEffect, useCallback } from "react";
import { Expense } from '@/api/entities';
import { MonthlyIncome } from '@/api/entities';
import { Tip } from '@/api/entities';
import { CategoryBudget } from '@/api/entities';
import { Subcategory } from '@/api/entities';
import { Category } from '@/api/entities';
import { User } from '@/api/entities'; // Import User entity
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPageUrl } from "@/utils";
import { Plus, Settings, FileDown, RefreshCw, Lightbulb, TrendingUp, AlertTriangle, Camera } from "lucide-react";
import { motion } from "framer-motion";
import BudgetSummary from "@/components/dashboard/BudgetSummary";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import CreateEventBudgetDialog from "@/components/dashboard/CreateEventBudgetDialog";
import TestimonialsSection from "@/components/dashboard/TestimonialsSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Helper for Hijri formatting
const formatHijriDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = {
    calendar: 'islamic-umalqura',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Riyadh'
  };
  return new Intl.DateTimeFormat('ar-SA', { ...defaultOptions, ...options }).format(date);
};

// Helper function for currency conversion (simplified, assumes SAR if no explicit conversion rate)
// In a real app, this would fetch rates or use a library.
const convertCurrency = (amount, fromCurrency, toCurrency) => {
  // For this implementation, we assume SAR is the base currency
  // and if an amount is not explicitly in SAR, we treat it as such,
  // as no exchange rates are provided.
  if (fromCurrency === 'SAR' || fromCurrency === toCurrency) {
    return amount;
  }
  // Placeholder for actual currency conversion logic
  // e.g., if (fromCurrency === 'USD') return amount * USD_TO_SAR_RATE;
  // For now, if amount_in_sar is not provided, we just return the original amount
  // assuming it's meant to be in SAR for calculations unless converted.
  // This is a simplification given no external rates.
  return amount; // Treat as if it's already in SAR for calculations if no explicit conversion
};

// Helper for currency formatting
const formatCurrency = (amount, currency = 'SAR') => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0, // No decimals for integers
    maximumFractionDigits: 2, // Allow up to 2 decimals for cents/halalas
  }).format(amount);
};

// Helper function to delay between API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyIncome, setMonthlyIncomeState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [monthlyIncomeInput, setMonthlyIncomeInput] = useState("");
  const [sideIncomeInput, setSideIncomeInput] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  // States for smart tips
  const [tips, setTips] = useState([]);
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);
  const [topCategories, setTopCategories] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState({ current: 0, average: 0 });

  // Loading states for different sections
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  // Use a state for currentUser that can be updated
  const [currentUser, setCurrentUser] = useState(null);

  const generateBudgetAlerts = useCallback((currentExpenses, currentIncome, categoryBudgets) => {
    const alerts = [];
    const threshold = 0.85; // 85%

    // 1. Check main income budget - مع إصلاح حساب العملات
    if (currentIncome && ((currentIncome.main_amount || 0) + (currentIncome.side_amount || 0)) > 0) {
      const totalMonthlyIncome = (currentIncome.main_amount || 0) + (currentIncome.side_amount || 0);
      
      // حساب إجمالي المصروفات بالريال السعودي (باستخدام amount_in_sar إذا كان متاحاً)
      const totalSpent = currentExpenses.reduce((sum, e) => {
        // استخدام المبلغ المحول إلى الريال إذا كان متاحاً، وإلا استخدم المبلغ الأصلي
        const amountInSAR = e.amount_in_sar || convertCurrency(e.amount || 0, e.currency || 'SAR', 'SAR');
        return sum + amountInSAR;
      }, 0);
      
      const percentageSpent = totalSpent / totalMonthlyIncome;
      if (percentageSpent >= threshold && percentageSpent <= 1.0) {
        alerts.push({
          type: 'main',
          message: `تنبيه: لقد استهلكت ${(percentageSpent * 100).toFixed(0)}% من دخلك الشهري (${formatCurrency(totalSpent, 'SAR')} من ${formatCurrency(totalMonthlyIncome, 'SAR')}).`
        });
      } else if (percentageSpent > 1.0) {
        alerts.push({
          type: 'main',
          message: `تحذير: لقد تجاوزت دخلك الشهري بنسبة ${(percentageSpent * 100 - 100).toFixed(0)}% (${formatCurrency(totalSpent - totalMonthlyIncome, 'SAR')} إضافية).`
        });
      }
    }

    // 2. Check category budgets - مع إصلاح حساب العملات
    if (categoryBudgets.length > 0) {
      categoryBudgets.forEach(catBudget => {
        // حساب المصروفات لهذه الفئة بالريال السعودي
        const categoryExpenses = currentExpenses
          .filter(e => e.category === catBudget.category)
          .reduce((sum, e) => {
            const amountInSAR = e.amount_in_sar || convertCurrency(e.amount || 0, e.currency || 'SAR', 'SAR');
            return sum + amountInSAR;
          }, 0);

        if (catBudget.limit_amount > 0) {
          const percentageSpent = categoryExpenses / catBudget.limit_amount;
          if (percentageSpent >= threshold && percentageSpent <= 1.0) {
            alerts.push({
              type: 'category',
              message: `تنبيه: لقد استهلكت ${(percentageSpent * 100).toFixed(0)}% من ميزانية فئة "${catBudget.category}" (${formatCurrency(categoryExpenses, 'SAR')} من ${formatCurrency(catBudget.limit_amount, 'SAR')}).`
            });
          } else if (percentageSpent > 1.0) {
            alerts.push({
              type: 'category',
              message: `تحذير: لقد تجاوزت ميزانية فئة "${catBudget.category}" بنسبة ${(percentageSpent * 100 - 100).toFixed(0)}% (${formatCurrency(categoryExpenses - catBudget.limit_amount, 'SAR')} إضافية).`
            });
          }
        }
      });
    }

    setBudgetAlerts(alerts);
  }, []); // Dependencies are empty as it only uses passed arguments and setBudgetAlerts (stable)

  const loadExpenseAnalysis = useCallback(async (allExpensesParam = []) => {
    if (!currentUser) return;
    const userId = currentUser.id;

    try {
      const today = new Date();
      const currentMonthStart = startOfMonth(today);

      // Use passed expenses or fetch them if not provided (for robustness)
      let expensesToAnalyze = allExpensesParam;
      if (!expensesToAnalyze || expensesToAnalyze.length === 0) {
        // ✅ إصلاح: جلب جميع المصاريف (شخصية وعائلية) في حالة الفشل
        const fetchedExpenses = await Expense.filter({ user_id: userId }, "-date");
        const subcategoriesData = await Subcategory.list(); // Global as per loadDashboardData
        const categoriesData = await Category.list(); // Global as per loadDashboardData
        const subcategoriesMap = new Map(subcategoriesData.map(sub => [sub.id, sub]));
        const categoriesMap = new Map(categoriesData.map(cat => [cat.id, cat]));
        expensesToAnalyze = fetchedExpenses.map(expense => {
          const subcategory = subcategoriesMap.get(expense.subcategory_id);
          const category = subcategory ? categoriesMap.get(subcategory.category_id) : null;
          return {
            ...expense,
            subcategoryName: subcategory ? subcategory.name : 'غير محدد',
            categoryName: category ? category.name : 'غير محدد',
            categoryColor: category ? category.color : '#6B7280',
            categoryIcon: category ? category.icon : '🏷️',
            category: category ? category.name : (expense.category || 'غير محدد'),
            subcategory: subcategory ? subcategory.name : 'غير محدد',
            amount_in_sar: expense.amount_in_sar, // Ensure amount_in_sar is carried over
            currency: expense.currency || 'SAR', // Ensure currency is carried over
          };
        });
      }

      // Filter current month expenses for the current total
      const currentMonthExpenses = expensesToAnalyze.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= currentMonthStart && expenseDate <= endOfMonth(today);
      });

      // حساب المجموع الحالي للشهر - مع إصلاح تحويل العملات
      const currentTotal = currentMonthExpenses.reduce((sum, e) => {
        const amountInSAR = e.amount_in_sar || convertCurrency(e.amount || 0, e.currency || 'SAR', 'SAR');
        return sum + amountInSAR;
      }, 0);

      // Filter expenses for the previous 3 *full* months to calculate average correctly
      const threeMonthsAgoStart = startOfMonth(subMonths(currentMonthStart, 3));
      const expensesForAverageCalculation = expensesToAnalyze.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= threeMonthsAgoStart && expenseDate < currentMonthStart; // Up to start of current month (exclusive)
      });

      // حساب المجموع للأشهر السابقة - مع إصلاح تحويل العملات
      const totalForAverage = expensesForAverageCalculation.reduce((sum, e) => {
        const amountInSAR = e.amount_in_sar || convertCurrency(e.amount || 0, e.currency || 'SAR', 'SAR');
        return sum + amountInSAR;
      }, 0);
      
      // Ensure average is 0 if no expenses in the period to avoid division by zero or NaN.
      const average3Months = expensesForAverageCalculation.length > 0 ? totalForAverage / 3 : 0;

      setExpenseSummary({ current: currentTotal, average: average3Months });

      // Top 5 categories this month - مع إصلاح حساب العملات
      const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
        const category = expense.categoryName || 'غير محدد';
        const amountInSAR = expense.amount_in_sar || convertCurrency(expense.amount || 0, expense.currency || 'SAR', 'SAR');
        acc[category] = (acc[category] || 0) + amountInSAR;
        return acc;
      }, {});

      const sortedCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      setTopCategories(sortedCategories);

    } catch (error) {
      console.error("Error loading expense analysis:", error);
      setExpenseSummary({ current: 0, average: 0 });
      setTopCategories([]);
    }
  }, [currentUser]); // Add currentUser as a dependency

  const loadDashboardData = useCallback(async () => {
    // Wait until currentUser is loaded
    if (!currentUser) {
      setIsLoading(false); // Ensure loading state is false if no user
      return;
    }

    setIsLoading(true);
    try {
      const today = new Date();
      const currentMonthStartFormatted = format(startOfMonth(today), 'yyyy-MM-01');
      const userId = currentUser.id;

      // ✅ إصلاح: جلب المصاريف الشخصية فقط (حيث family_id هو null)
      const [
        personalExpensesData,
        subcategoriesData,
        categoriesData,
        incomeDataRaw,
        categoryBudgetsData,
        tipsData
      ] = await Promise.all([
        Expense.filter({ user_id: userId, family_id: null }),  // جلب المصاريف الشخصية فقط
        Subcategory.list(),
        Category.list(),
        MonthlyIncome.filter({ user_id: userId, is_shared: false }),
        CategoryBudget.filter({ user_id: userId, family_id: null }), // ميزانيات شخصية فقط
        Tip.filter({ user_id: userId })
      ]);

      // تصفية البيانات للشهر الحالي
      const thisMonthExpenses = personalExpensesData.filter(expense => {
        const expenseMonth = expense.date.substring(0, 7); // YYYY-MM
        const currentMonth = currentMonthStartFormatted.substring(0, 7); // YYYY-MM
        return expenseMonth === currentMonth;
      });

      const thisMonthIncome = incomeDataRaw.filter(inc => inc.month === currentMonthStartFormatted);
      const thisMonthBudgets = categoryBudgetsData.filter(budget => budget.month === currentMonthStartFormatted);
      const thisMonthTips = tipsData.filter(tip => tip.month === currentMonthStartFormatted);

      // إنشاء خرائط للوصول السريع
      const subcategoriesMap = new Map(subcategoriesData.map(sub => [sub.id, sub]));
      const categoriesMap = new Map(categoriesData.map(cat => [cat.id, cat]));

      // دمج بيانات المصاريف مع الفئات والبنود
      const hydratedExpenses = thisMonthExpenses.map(expense => {
        const subcategory = subcategoriesMap.get(expense.subcategory_id);
        const category = subcategory ? categoriesMap.get(subcategory.category_id) : null;
        return {
          ...expense,
          // New properties to be used where explicit category/subcategory names are needed
          subcategoryName: subcategory ? subcategory.name : 'غير محدد',
          categoryName: category ? category.name : 'غير محدد',
          categoryColor: category ? category.color : '#6B7280',
          categoryIcon: category ? category.icon : '🏷️',
          // Overwrite existing 'category' and add 'subcategory' for compatibility
          // with components that use expense.category or expense.subcategory directly
          category: category ? category.name : (expense.category || 'غير محدد'), // Ensure category is always the name
          subcategory: subcategory ? subcategory.name : 'غير محدد', // Add subcategory name for display
          amount_in_sar: expense.amount_in_sar, // Ensure amount_in_sar is carried over
          currency: expense.currency || 'SAR', // Ensure currency is carried over
        };
      });

      setExpenses(hydratedExpenses);

      let currentIncome = null;
      if (thisMonthIncome.length > 0) {
        currentIncome = thisMonthIncome[0];
        setMonthlyIncomeState(currentIncome);
        setMonthlyIncomeInput(currentIncome.main_amount?.toString() || "");
        setSideIncomeInput(currentIncome.side_amount?.toString() || "");
      } else {
        setMonthlyIncomeState(null);
        setMonthlyIncomeInput("");
        setSideIncomeInput("");
      }

      // معالجة وتعيين البيانات الأخرى
      await loadExpenseAnalysis(personalExpensesData); // استخدام جميع المصاريف للتحليل
      generateBudgetAlerts(hydratedExpenses, currentIncome, thisMonthBudgets);
      setTips(thisMonthTips); // Set filtered tips

      console.log('✅ تم تحميل البيانات:', {
        totalExpenses: personalExpensesData.length,
        thisMonthExpenses: hydratedExpenses.length,
        income: currentIncome ? 'موجود' : 'غير موجود',
        budgets: thisMonthBudgets.length,
        tips: thisMonthTips.length
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  }, [currentUser, loadExpenseAnalysis, generateBudgetAlerts]); // Add dependencies

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Handle not logged in case, maybe redirect to login
        setIsLoading(false); // Ensure loading state is false even if user fetch fails
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // This will run automatically when currentUser is set
    if (currentUser) {
        loadDashboardData();
    }
  }, [currentUser, loadDashboardData]);

  const generateTipsWithData = async (monthlyExpenses, incomeData) => {
    if (!currentUser) return; // Ensure currentUser is available
    const userId = currentUser.id;

    setIsGeneratingTips(true);
    try {
      const currentMonth = format(new Date(), 'yyyy-MM-01');

      // حذف النصائح القديمة للشهر الحالي
      const oldTips = await Tip.filter({ user_id: userId, month: { gte: currentMonth } });
      for (const tip of oldTips) {
        await Tip.delete(tip.id);
        await delay(100);
      }

      await delay(500);

      // استخدام البيانات المدمجة من loadDashboardData
      const totalIncome = (incomeData?.main_amount || 0) + (incomeData?.side_amount || 0); // Updated to use new income structure
      const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + (e.amount_in_sar || convertCurrency(e.amount || 0, e.currency || 'SAR', 'SAR')), 0);

      // جلب ميزانيات الفئات (الشخصية فقط)
      const categoryBudgets = await CategoryBudget.filter({ user_id: userId, month: currentMonth, family_id: null });

      let newTips = [];
      let hasOverspending = false;

      // التعامل مع حالة الإعداد الأولي
      if (categoryBudgets.length === 0 && totalIncome === 0) {
        newTips.push({
          user_id: userId, // Add user_id to new tip
          month: currentMonth,
          tip_text: "ابدأ بتحديد دخلك الشهري وميزانيات الفئات من صفحات الإعدادات لتلقي نصائح مخصصة.",
          category: "عام"
        });
      } else {
        // الأولوية 1: التحقق من تجاوز الدخل الإجمالي
        if (totalIncome > 0 && totalExpenses > totalIncome) {
          const overspendAmount = totalExpenses - totalIncome;
          newTips.push({
            user_id: userId, // Add user_id to new tip
            month: currentMonth,
            tip_text: `تحذير! لقد تجاوزت دخلك الشهري بمقدار ${formatCurrency(overspendAmount)}. يجب مراجعة نفقاتك فوراً.`,
            category: "تحذير مالي"
          });
          hasOverspending = true;
        }

        // الأولوية 2: التحقق من تجاوز ميزانيات الفئات
        for (const budgetItem of categoryBudgets) {
          // استخدام expense.category الذي تم دمجه مع اسم الفئة الصحيح
          const spentInCategory = monthlyExpenses
            .filter(e => e.category === budgetItem.category)
            .reduce((sum, e) => sum + (e.amount_in_sar || convertCurrency(e.amount || 0, e.currency || 'SAR', 'SAR')), 0);

          if (budgetItem.limit_amount > 0 && spentInCategory > budgetItem.limit_amount) {
            const categoryOverspend = spentInCategory - budgetItem.limit_amount;
            newTips.push({
              user_id: userId, // Add user_id to new tip
              month: currentMonth,
              tip_text: `تجاوزت ميزانية فئة "${budgetItem.category}" بمقدار ${formatCurrency(categoryOverspend)}.`,
              category: budgetItem.category
            });
            hasOverspending = true;
          }
        }

        // نصيحة إيجابية فقط إذا لم يكن هناك تجاوز نهائياً
        if (!hasOverspending && totalIncome > 0) {
          newTips.push({
            user_id: userId, // Add user_id to new tip
            month: currentMonth,
            tip_text: "ممتاز! أنت ضمن حدود ميزانيتك هذا الشهر. استمر في الإدارة الجيدة لأموالك.",
            category: "إيجابي"
          });
        }
      }

      if (newTips.length > 0) {
        await delay(500);
        await Tip.bulkCreate(newTips);
        await delay(500);
        setTips(newTips);
      } else {
        setTips([]);
      }

    } catch (error) {
      console.error("Error generating tips:", error);
      setTips([{
        id: 'error-tip',
        tip_text: "عذراً، حدث خطأ أثناء توليد النصائح. يرجى المحاولة مرة أخرى لاحقاً.",
        category: "خطأ"
      }]);
    }
    setIsGeneratingTips(false);
  };

  const generateTips = async () => {
    if (!currentUser) return; // Ensure currentUser is available
    const userId = currentUser.id;

    // This function now just calls generateTipsWithData with fresh data
    try {
      setIsGeneratingTips(true); // Set loading state for button feedback
      const currentMonth = format(new Date(), 'yyyy-MM-01');
      const expensesDataRaw = await Expense.filter({ user_id: userId, family_id: null }); // Personal expenses only

      // Need to hydrate expenses for generateTipsWithData if called independently
      const subcategoriesData = await Subcategory.list(); // Global as per loadDashboardData
      const categoriesData = await Category.list(); // Global as per loadDashboardData
      const subcategoriesMap = new Map(subcategoriesData.map(sub => [sub.id, sub]));
      const categoriesMap = new Map(categoriesData.map(cat => [cat.id, cat]));

      const hydratedExpenses = expensesDataRaw.map(expense => {
        const subcategory = subcategoriesMap.get(expense.subcategory_id);
        const category = subcategory ? categoriesMap.get(subcategory.category_id) : null;
        return {
          ...expense,
          subcategoryName: subcategory ? subcategory.name : 'غير محدد',
          categoryName: category ? category.name : 'غير محدد',
          categoryColor: category ? category.color : '#6B7280',
          categoryIcon: category ? category.icon : '🏷️',
          category: category ? category.name : (expense.category || 'غير محدد'),
          subcategory: subcategory ? subcategory.name : 'غير محدد',
          amount_in_sar: expense.amount_in_sar, // Ensure amount_in_sar is carried over
          currency: expense.currency || 'SAR', // Ensure currency is carried over
        };
      });

      const monthlyExpenses = hydratedExpenses.filter(expense =>
        expense.date.startsWith(currentMonth.slice(0, 7))
      );

      const incomeData = await MonthlyIncome.filter({ user_id: userId, month: currentMonth, is_shared: false });
      const currentIncome = incomeData.length > 0 ? incomeData[0] : null;

      await generateTipsWithData(monthlyExpenses, currentIncome);
    } catch (error) {
      console.error("Error in generateTips:", error);
    } finally {
      setIsGeneratingTips(false); // Reset loading state
    }
  };


  const handleDeleteExpense = async (id) => {
    try {
      await Expense.delete(id); // Deletes by ID, user_id check is implicit through data fetching logic
      loadDashboardData(); // Reload all data after deletion
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("حدث خطأ أثناء حذف المصروف.");
    }
  };

  const handleSetBudget = async () => {
    // التحقق من صحة البيانات
    if (!monthlyIncomeInput || isNaN(parseFloat(monthlyIncomeInput))) {
      alert("يرجى إدخال مبلغ صحيح للدخل الشهري");
      return;
    }

    // التأكد من وجود المستخدم
    if (!currentUser || !currentUser.id) {
      alert("خطأ في بيانات المستخدم. يرجى تسجيل الدخول مرة أخرى.");
      return;
    }

    const currentMonth = format(new Date(), 'yyyy-MM-01');
    const mainAmount = parseFloat(monthlyIncomeInput);
    const sideAmount = parseFloat(sideIncomeInput) || 0;

    try {
      const incomeData = {
        user_id: currentUser.id, // إضافة user_id المطلوب
        month: currentMonth,
        main_amount: mainAmount,
        side_amount: sideAmount,
        // ✅ تحديث: تحديد أن هذا الدخل شخصي وليس مشترك
        is_shared: false 
      };

      if (monthlyIncome && monthlyIncome.id) {
        // Update existing monthly income
        await MonthlyIncome.update(monthlyIncome.id, incomeData);
      } else {
        // Create new monthly income record
        await MonthlyIncome.create(incomeData);
      }

      setShowBudgetDialog(false);

      // تأخير صغير ثم إعادة تحميل البيانات
      setTimeout(() => {
        loadDashboardData();
      }, 500);

    } catch (error) {
      console.error("Error setting monthly income:", error);
      alert("حدث خطأ في حفظ البيانات. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleBudgetCreated = () => {
    setSelectedEvent(null);
    setTimeout(() => loadDashboardData(), 1000); // Add delay before reloading dashboard
  };

  const downloadExcel = async () => {
    setIsExporting(true);
    try {
      // Use expense.category and expense.subcategory which are now hydrated with names
      const exportData = expenses.map(expense => ({
        'التاريخ': formatHijriDate(expense.date),
        'الوصف': expense.description || '',
        'الفئة': expense.category || '', // Use the hydrated category name
        'الفئة الفرعية': expense.subcategory || '', // Use the hydrated subcategory name
        'المبلغ (ر.س)': (expense.amount_in_sar || convertCurrency(expense.amount || 0, expense.currency || 'SAR', 'SAR'))?.toLocaleString('ar-SA') || '0', // Use SAR amount for export
      }));

      let csvContent = '\uFEFF';

      const headers = exportData.length > 0 ? Object.keys(exportData[0]) : [];
      if (headers.length > 0) {
        csvContent += headers.map(header => `"${header}"`).join(',') + '\n';
      }

      exportData.forEach(row => {
        csvContent += headers.map(header => {
          const value = String(row[header] || '').replace(/"/g, '""');
          return `"${value}"`;
        }).join(',') + '\n';
      });

      const totalExpensesAmount = expenses.reduce((sum, exp) => sum + (exp.amount_in_sar || convertCurrency(exp.amount || 0, exp.currency || 'SAR', 'SAR')), 0);
      csvContent += '\n"ملخص البيانات:"\n';
      csvContent += `"إجمالي عدد المصاريف","${expenses.length}"\n`;
      csvContent += `"إجمالي المبلغ المصروف","${formatCurrency(totalExpensesAmount)}"\n`;
      csvContent += `"متوسط قيمة المصروف","${formatCurrency(totalExpensesAmount / (expenses.length || 1))}"\n`;
      csvContent += `"تاريخ التصدير","${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ar })}"\n`;

      // ✅ إصلاح: إزالة الفاصلة المنقوطة الزائدة من هنا
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `مصاريف-${format(new Date(), 'ddMMyyyy')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      // ✅ إصلاح: إضافة النقر على الرابط وتصحيح الترتيب
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
    setIsExporting(false);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount_in_sar || convertCurrency(expense.amount || 0, expense.currency || 'SAR', 'SAR')), 0);
  const totalIncome = (monthlyIncome?.main_amount || 0) + (monthlyIncome?.side_amount || 0);

  // Show loading state if currentUser is null, indicating user data is still being fetched.
  // Or if setIsLoading is true from loadDashboardData.
  if (!currentUser || isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">الصفحة الرئيسية</h1>
          <p className="text-emerald-600">مرحباً بك في تطبيق إدارة المصاريف العائلية</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-emerald-200 hover:bg-emerald-50">
                <Settings className="w-4 h-4 ml-2" />
                {/* ✅ تحديث: توضيح أن هذا للدخل الشخصي */}
                تعديل الدخل الشخصي
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                 {/* ✅ تحديث: توضيح أن هذا للدخل الشخصي */}
                <DialogTitle>تحديد الدخل الشخصي الشهري</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="main_income">الدخل الأساسي (ريال سعودي)</Label>
                  <Input
                    id="main_income"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="أدخل دخلك الأساسي"
                    value={monthlyIncomeInput}
                    onChange={(e) => setMonthlyIncomeInput(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="side_income">الدخل الجانبي (ريال سعودي)</Label>
                  <Input
                    id="side_income"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="أدخل دخلك الجانبي (اختياري)"
                    value={sideIncomeInput}
                    onChange={(e) => setSideIncomeInput(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSetBudget}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={!monthlyIncomeInput || isNaN(parseFloat(monthlyIncomeInput))}
                >
                  حفظ الدخل الشهري
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={downloadExcel}
            disabled={isExporting || expenses.length === 0}
            variant="outline"
            className="border-emerald-200 hover:bg-emerald-50"
          >
            {isExporting ? 'جاري التصدير...' : (
              <>
                <FileDown className="w-4 h-4 ml-2" />
                تصدير إلى Excel
              </>
            )}
          </Button>

          <Link href={createPageUrl("CameraReceipts")}>
            <Button variant="outline" className="border-emerald-200 hover:bg-emerald-50">
              <Camera className="w-4 h-4 ml-2" />
              فواتير الكاميرا
            </Button>
          </Link>

          <Link href={createPageUrl("AddExpense")}>
            <Button className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white shadow-lg">
              <Plus className="w-5 h-5 ml-2" />
              إضافة مصروف جديد
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Smart Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-3"
        >
          {budgetAlerts.map((alert, index) => (
              <Alert key={index} variant="destructive" className="bg-red-50/70 border-red-200">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="font-medium text-red-800">
                      {alert.message}
                  </AlertDescription>
              </Alert>
          ))}
        </motion.div>
      )}

      <BudgetSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        savings={totalIncome - totalExpenses}
      />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  نصائح الادخار لهذا الشهر
                </CardTitle>
                <CardDescription>توصيات ذكية بناءً على إنفاقك.</CardDescription>
              </div>
              <Button onClick={generateTips} disabled={isGeneratingTips || isLoadingTips} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 ml-2 ${(isGeneratingTips || isLoadingTips) ? 'animate-spin' : ''}`} />
                {(isGeneratingTips || isLoadingTips) ? 'جاري التحديث...' : 'تحديث النصائح'}
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingTips || isGeneratingTips ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                  <p className="text-emerald-600 text-sm">جاري تحميل النصائح...</p>
                </div>
              ) : tips.length > 0 ? (
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={tip.id || `tip-${index}`} className="flex items-start gap-3 p-3 bg-emerald-50/70 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                      <p className="text-sm text-emerald-800">{tip.tip_text}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>لا توجد نصائح حاليًا.</p>
                  <p className="text-xs">اضغط على "تحديث النصائح" لتوليد توصيات جديدة بناءً على ميزانياتك.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <RecentExpenses expenses={expenses} onDeleteExpense={handleDeleteExpense} />
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <TrendingUp className="w-5 h-5" />
                ملخص الإنفاق
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">مصروف الشهر الحالي</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(expenseSummary.current)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">متوسط آخر 3 أشهر</p>
                <p className="text-lg font-semibold text-gray-800">{formatCurrency(expenseSummary.average)}</p>
              </div>
              <div className="pt-4">
                <h4 className="font-semibold text-gray-700 mb-2">أعلى 5 فئات إنفاق هذا الشهر</h4>
                <ul className="space-y-2">
                  {topCategories.length > 0 ? (
                    topCategories.map(([category, amount]) => (
                      <li key={category} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{category}</span>
                        <span className="font-mono font-semibold">{formatCurrency(amount)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">لا توجد بيانات للفئات بعد.</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
          <UpcomingEvents onSelectEvent={setSelectedEvent} />
        </div>
      </div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-16"
      >
        <TestimonialsSection />
      </motion.div>

      <CreateEventBudgetDialog
        event={selectedEvent}
        onOpenChange={(isOpen) => !isOpen && setSelectedEvent(null)}
        onBudgetCreated={handleBudgetCreated}
      />
    </div>
  );
}
