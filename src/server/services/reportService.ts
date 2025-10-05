import { expenseRepository } from '../repositories/expenseRepository';
import { incomeRepository } from '../repositories/incomeRepository';
import { budgetRepository } from '../repositories/budgetRepository';
import { categoryRepository } from '../repositories/categoryRepository';

export interface MonthlyReportData {
  period: {
    year: number;
    month: number;
    startDate: Date;
    endDate: Date;
    monthName: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    savingsRate: number;
  };
  expensesByCategory: Array<{
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    total: number;
    count: number;
    percentage: number;
  }>;
  incomeByType: Array<{
    type: string;
    total: number;
    count: number;
    percentage: number;
  }>;
  budgetComparison?: {
    budgetId: string;
    budgetName: string;
    totalLimit: number;
    totalSpent: number;
    remainingAmount: number;
    percentageUsed: number;
    isOverBudget: boolean;
    categoryBreakdown: Array<{
      categoryId: string;
      categoryName: string;
      limit: number;
      spent: number;
      remaining: number;
      percentageUsed: number;
      isOverBudget: boolean;
    }>;
  };
  trends: {
    comparedToPreviousMonth: {
      incomeChange: number;
      expenseChange: number;
      savingsChange: number;
    };
    topCategories: Array<{
      categoryName: string;
      amount: number;
      change: number;
    }>;
  };
  recommendations: string[];
}

export interface YearlyReportData {
  year: number;
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    averageMonthlySavings: number;
    bestMonth: { month: number; savings: number };
    worstMonth: { month: number; savings: number };
  };
  monthlyBreakdown: Array<{
    month: number;
    monthName: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
  categoryAnalysis: Array<{
    categoryName: string;
    totalSpent: number;
    averageMonthly: number;
    percentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  insights: string[];
}

export class ReportService {
  // Generate monthly report
  async generateMonthlyReport(
    year: number,
    month: number,
    userId?: string,
    familyId?: string
  ): Promise<MonthlyReportData> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Previous month for comparison
    const prevStartDate = new Date(year, month - 2, 1);
    const prevEndDate = new Date(year, month - 1, 0, 23, 59, 59, 999);

    // Get month name in Arabic
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    // Get total income and expenses for the month
    const [totalIncome, totalExpenses] = await Promise.all([
      incomeRepository.getTotalForPeriod(startDate, endDate, userId, familyId),
      expenseRepository.getTotalByCategory(startDate, endDate, userId, familyId)
        .then(categories => categories.reduce((sum, cat) => sum + cat.total, 0))
    ]);

    // Get previous month totals for comparison
    const [prevIncome, prevExpenseCategories] = await Promise.all([
      incomeRepository.getTotalForPeriod(prevStartDate, prevEndDate, userId, familyId),
      expenseRepository.getTotalByCategory(prevStartDate, prevEndDate, userId, familyId)
    ]);
    const prevExpenses = prevExpenseCategories.reduce((sum, cat) => sum + cat.total, 0);

    // Calculate summary
    const netAmount = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netAmount / totalIncome) * 100 : 0;

    // Get expenses by category
    const expensesByCategory = await expenseRepository.getTotalByCategory(
      startDate, endDate, userId, familyId
    );

    // Calculate percentages for categories
    const categoriesWithPercentage = expensesByCategory.map(cat => ({
      ...cat,
      percentage: totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0,
    }));

    // Get income by type
    const incomeByType = await incomeRepository.getTotalByType(
      startDate, endDate, userId, familyId
    );

    // Calculate percentages for income types
    const incomeWithPercentage = incomeByType.map(inc => ({
      ...inc,
      percentage: totalIncome > 0 ? (inc.total / totalIncome) * 100 : 0,
    }));

    // Get budget comparison if available
    let budgetComparison: any = undefined;
    const currentBudget = await budgetRepository.getCurrentMonthBudget(userId, familyId);
    if (currentBudget) {
      const summary = await budgetRepository.getBudgetSummary(currentBudget.id);
      if (summary) {
        budgetComparison = {
          budgetId: currentBudget.id,
          budgetName: currentBudget.name,
          totalLimit: summary.totalLimit,
          totalSpent: summary.totalSpent,
          remainingAmount: summary.remainingAmount,
          percentageUsed: summary.percentageUsed,
          isOverBudget: summary.isOverBudget,
          categoryBreakdown: summary.categoryBreakdown,
        };
      }
    }

    // Calculate trends
    const incomeChange = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0;
    const expenseChange = prevExpenses > 0 ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 : 0;
    const prevSavings = prevIncome - prevExpenses;
    const savingsChange = prevSavings !== 0 ? ((netAmount - prevSavings) / Math.abs(prevSavings)) * 100 : 0;

    // Get top categories with changes
    const topCategories = categoriesWithPercentage.slice(0, 5).map(cat => {
      const prevCat = prevExpenseCategories.find(p => p.categoryId === cat.categoryId);
      const change = prevCat && prevCat.total > 0 ? ((cat.total - prevCat.total) / prevCat.total) * 100 : 0;
      return {
        categoryName: cat.categoryName,
        amount: cat.total,
        change,
      };
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      totalIncome,
      totalExpenses,
      netAmount,
      savingsRate,
      expensesByCategory: categoriesWithPercentage,
      budgetComparison,
      trends: { incomeChange, expenseChange, savingsChange },
    });

    return {
      period: {
        year,
        month,
        startDate,
        endDate,
        monthName: monthNames[month - 1],
      },
      summary: {
        totalIncome,
        totalExpenses,
        netAmount,
        savingsRate,
      },
      expensesByCategory: categoriesWithPercentage,
      incomeByType: incomeWithPercentage,
      budgetComparison,
      trends: {
        comparedToPreviousMonth: {
          incomeChange,
          expenseChange,
          savingsChange,
        },
        topCategories,
      },
      recommendations,
    };
  }

  // Generate yearly report
  async generateYearlyReport(
    year: number,
    userId?: string,
    familyId?: string
  ): Promise<YearlyReportData> {
    const monthlyData: any[] = [];
    let totalIncome = 0;
    let totalExpenses = 0;

    // Get data for each month
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const [monthIncome, monthExpenseCategories] = await Promise.all([
        incomeRepository.getTotalForPeriod(startDate, endDate, userId, familyId),
        expenseRepository.getTotalByCategory(startDate, endDate, userId, familyId)
      ]);

      const monthExpenses = monthExpenseCategories.reduce((sum, cat) => sum + cat.total, 0);
      const savings = monthIncome - monthExpenses;

      totalIncome += monthIncome;
      totalExpenses += monthExpenses;

      monthlyData.push({
        month,
        monthName: this.getMonthName(month),
        income: monthIncome,
        expenses: monthExpenses,
        savings,
      });
    }

    const netAmount = totalIncome - totalExpenses;
    const averageMonthlySavings = netAmount / 12;

    // Find best and worst months
    const sortedBySavings = [...monthlyData].sort((a, b) => b.savings - a.savings);
    const bestMonth = sortedBySavings[0];
    const worstMonth = sortedBySavings[sortedBySavings.length - 1];

    // Get yearly category analysis
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);
    
    const yearlyExpensesByCategory = await expenseRepository.getTotalByCategory(
      yearStart, yearEnd, userId, familyId
    );

    const categoryAnalysis = yearlyExpensesByCategory.map(cat => ({
      categoryName: cat.categoryName,
      totalSpent: cat.total,
      averageMonthly: cat.total / 12,
      percentage: totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0,
      trend: 'stable' as const, // Would need more complex analysis for real trends
    }));

    // Generate insights
    const insights = this.generateYearlyInsights({
      totalIncome,
      totalExpenses,
      netAmount,
      monthlyData,
      categoryAnalysis,
    });

    return {
      year,
      summary: {
        totalIncome,
        totalExpenses,
        netAmount,
        averageMonthlySavings,
        bestMonth: { month: bestMonth.month, savings: bestMonth.savings },
        worstMonth: { month: worstMonth.month, savings: worstMonth.savings },
      },
      monthlyBreakdown: monthlyData,
      categoryAnalysis,
      insights,
    };
  }

  // Generate category report
  async generateCategoryReport(
    categoryId: string,
    startDate: Date,
    endDate: Date,
    userId?: string,
    familyId?: string
  ): Promise<{
    category: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
    period: { startDate: Date; endDate: Date };
    summary: {
      totalSpent: number;
      transactionCount: number;
      averageTransaction: number;
      dailyAverage: number;
    };
    expenses: Array<{
      id: string;
      amount: number;
      description: string;
      date: Date;
      subcategory?: string;
    }>;
    trends: {
      monthlyBreakdown: Array<{
        month: string;
        total: number;
        count: number;
      }>;
      weeklyPattern: Array<{
        dayOfWeek: string;
        total: number;
        count: number;
      }>;
    };
  }> {
    // Get category details
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Get expenses for this category in the period
    const expenses = await expenseRepository.findMany({
      categoryId,
      userId,
      familyId,
      startDate,
      endDate,
    });

    // Calculate summary
    const totalSpent = expenses.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const transactionCount = expenses.expenses.length;
    const averageTransaction = transactionCount > 0 ? totalSpent / transactionCount : 0;
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyAverage = daysDiff > 0 ? totalSpent / daysDiff : 0;

    // Monthly breakdown
    const monthlyBreakdown = this.groupExpensesByMonth(expenses.expenses);

    // Weekly pattern
    const weeklyPattern = this.groupExpensesByDayOfWeek(expenses.expenses);

    return {
      category: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
      },
      period: { startDate, endDate },
      summary: {
        totalSpent,
        transactionCount,
        averageTransaction,
        dailyAverage,
      },
      expenses: expenses.expenses.map(exp => ({
        id: exp.id,
        amount: Number(exp.amount),
        description: exp.description,
        date: exp.date,
        subcategory: exp.subcategory?.name,
      })),
      trends: {
        monthlyBreakdown,
        weeklyPattern,
      },
    };
  }

  // Helper methods
  private generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    if (data.savingsRate < 10) {
      recommendations.push('معدل الادخار منخفض (أقل من 10%). حاول تقليل المصاريف غير الضرورية.');
    } else if (data.savingsRate > 30) {
      recommendations.push('ممتاز! معدل ادخار عالي. فكر في استثمار جزء من المدخرات.');
    }

    if (data.budgetComparison?.isOverBudget) {
      recommendations.push('تجاوزت الميزانية المحددة. راجع المصاريف غير المخططة.');
    }

    if (data.trends.expenseChange > 20) {
      recommendations.push('ارتفاع كبير في المصاريف مقارنة بالشهر الماضي. راجع الأسباب.');
    }

    // Category-specific recommendations
    const topCategory = data.expensesByCategory[0];
    if (topCategory && topCategory.percentage > 40) {
      recommendations.push(`فئة "${topCategory.categoryName}" تستهلك ${topCategory.percentage.toFixed(1)}% من المصاريف. فكر في تنويع الإنفاق.`);
    }

    if (recommendations.length === 0) {
      recommendations.push('أداء مالي جيد! استمر في هذا النهج.');
    }

    return recommendations;
  }

  private generateYearlyInsights(data: any): string[] {
    const insights: string[] = [];

    const savingsRate = data.totalIncome > 0 ? (data.netAmount / data.totalIncome) * 100 : 0;
    insights.push(`معدل الادخار السنوي: ${savingsRate.toFixed(1)}%`);

    const bestMonth = data.monthlyData.find((m: any) => m.month === data.summary.bestMonth.month);
    const worstMonth = data.monthlyData.find((m: any) => m.month === data.summary.worstMonth.month);
    
    insights.push(`أفضل شهر للادخار: ${bestMonth.monthName} (${data.summary.bestMonth.savings.toFixed(0)} ريال)`);
    insights.push(`أصعب شهر: ${worstMonth.monthName} (${data.summary.worstMonth.savings.toFixed(0)} ريال)`);

    const topCategory = data.categoryAnalysis[0];
    if (topCategory) {
      insights.push(`أكبر فئة إنفاق: ${topCategory.categoryName} (${topCategory.percentage.toFixed(1)}% من إجمالي المصاريف)`);
    }

    return insights;
  }

  private getMonthName(month: number): string {
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return monthNames[month - 1];
  }

  private groupExpensesByMonth(expenses: any[]): Array<{ month: string; total: number; count: number }> {
    const grouped = expenses.reduce((acc, exp) => {
      const month = exp.date.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { total: 0, count: 0 };
      }
      acc[month].total += Number(exp.amount);
      acc[month].count += 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, data]: [string, any]) => ({
      month,
      total: data.total,
      count: data.count,
    }));
  }

  private groupExpensesByDayOfWeek(expenses: any[]): Array<{ dayOfWeek: string; total: number; count: number }> {
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    const grouped = expenses.reduce((acc, exp) => {
      const dayIndex = exp.date.getDay();
      const dayName = dayNames[dayIndex];
      if (!acc[dayName]) {
        acc[dayName] = { total: 0, count: 0 };
      }
      acc[dayName].total += Number(exp.amount);
      acc[dayName].count += 1;
      return acc;
    }, {});

    return dayNames.map(day => ({
      dayOfWeek: day,
      total: grouped[day]?.total || 0,
      count: grouped[day]?.count || 0,
    }));
  }
}

export const reportService = new ReportService();
