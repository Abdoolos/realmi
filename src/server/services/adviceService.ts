import { expenseRepository } from '../repositories/expenseRepository';
import { incomeRepository } from '../repositories/incomeRepository';
import { budgetRepository } from '../repositories/budgetRepository';
import { reportService } from './reportService';
import { budgetService } from './budgetService';

export interface DailyAdvice {
  id: string;
  type: 'tip' | 'warning' | 'achievement' | 'reminder';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  actionable: boolean;
  actionText?: string;
  metadata?: any;
  createdAt: Date;
}

export interface WeeklyAdvice {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  summary: {
    totalSpent: number;
    budgetUsage: number;
    savingsThisWeek: number;
    comparedToLastWeek: number;
  };
  highlights: string[];
  concerns: string[];
  recommendations: string[];
}

export interface MonthlyAdvice {
  id: string;
  month: number;
  year: number;
  overallScore: number; // 0-100
  achievements: string[];
  improvements: string[];
  nextMonthGoals: string[];
  customRecommendations: string[];
}

export class AdviceService {
  // Generate daily advice based on recent activity
  async generateDailyAdvice(userId?: string, familyId?: string): Promise<DailyAdvice[]> {
    const advice: DailyAdvice[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    try {
      // Check today's expenses
      const todayExpenses = await expenseRepository.findMany({
        userId,
        familyId,
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        endDate: today,
      });

      // Check budget alerts
      const budgetAlerts = await budgetService.checkBudgetAlerts(userId, familyId);

      // Generate spending advice
      if (todayExpenses.expenses.length === 0) {
        advice.push({
          id: `daily_${Date.now()}_no_spending`,
          type: 'achievement',
          title: 'يوم بدون مصاريف!',
          content: 'ممتاز! لم تسجل أي مصاريف اليوم. هذا يساعد في تحسين ميزانيتك.',
          priority: 'medium',
          actionable: false,
          createdAt: new Date(),
        });
      } else {
        const todayTotal = todayExpenses.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
        
        if (todayTotal > 200) {
          advice.push({
            id: `daily_${Date.now()}_high_spending`,
            type: 'warning',
            title: 'إنفاق عالي اليوم',
            content: `أنفقت ${todayTotal.toFixed(2)} ريال اليوم. تأكد من أن هذه المصاريف ضرورية.`,
            priority: 'high',
            actionable: true,
            actionText: 'راجع مصاريف اليوم',
            createdAt: new Date(),
          });
        }
      }

      // Add budget alerts as advice
      budgetAlerts.forEach(alert => {
        advice.push({
          id: `daily_${Date.now()}_budget_${alert.budgetId}`,
          type: alert.type === 'danger' ? 'warning' : 'tip',
          title: 'تنبيه ميزانية',
          content: alert.message,
          priority: alert.type === 'danger' ? 'high' : 'medium',
          category: alert.categoryName,
          actionable: true,
          actionText: 'راجع الميزانية',
          metadata: {
            budgetId: alert.budgetId,
            categoryId: alert.categoryId,
          },
          createdAt: new Date(),
        });
      });

      // Generate motivational tips
      const motivationalTips = this.getMotivationalTips();
      const randomTip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
      
      advice.push({
        id: `daily_${Date.now()}_tip`,
        type: 'tip',
        title: 'نصيحة اليوم',
        content: randomTip,
        priority: 'low',
        actionable: false,
        createdAt: new Date(),
      });

      // Check for recurring expense patterns
      const recurringAdvice = await this.checkRecurringPatterns(userId, familyId);
      advice.push(...recurringAdvice);

      return advice.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

    } catch (error) {
      console.error('Error generating daily advice:', error);
      return [];
    }
  }

  // Generate weekly summary and advice
  async generateWeeklyAdvice(userId?: string, familyId?: string): Promise<WeeklyAdvice> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of current week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of current week

    // Previous week for comparison
    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(weekStart.getDate() - 7);
    const prevWeekEnd = new Date(weekEnd);
    prevWeekEnd.setDate(weekEnd.getDate() - 7);

    try {
      // Get this week's expenses
      const thisWeekExpenses = await expenseRepository.findMany({
        userId,
        familyId,
        startDate: weekStart,
        endDate: weekEnd,
      });

      // Get previous week's expenses
      const prevWeekExpenses = await expenseRepository.findMany({
        userId,
        familyId,
        startDate: prevWeekStart,
        endDate: prevWeekEnd,
      });

      // Get this week's income
      const thisWeekIncome = await incomeRepository.getTotalForPeriod(
        weekStart, weekEnd, userId, familyId
      );

      const totalSpent = thisWeekExpenses.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
      const prevWeekSpent = prevWeekExpenses.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
      const savingsThisWeek = thisWeekIncome - totalSpent;
      const changeFromLastWeek = prevWeekSpent > 0 ? ((totalSpent - prevWeekSpent) / prevWeekSpent) * 100 : 0;

      // Get budget usage
      let budgetUsage = 0;
      const currentBudget = await budgetRepository.getCurrentMonthBudget(userId, familyId);
      if (currentBudget) {
        const budgetSummary = await budgetService.getBudgetAnalysis(currentBudget.id);
        if (budgetSummary) {
          budgetUsage = budgetSummary.percentageUsed;
        }
      }

      // Generate highlights
      const highlights: string[] = [];
      if (changeFromLastWeek < -10) {
        highlights.push(`انخفضت مصاريفك بنسبة ${Math.abs(changeFromLastWeek).toFixed(1)}% مقارنة بالأسبوع الماضي`);
      }
      if (savingsThisWeek > 0) {
        highlights.push(`وفرت ${savingsThisWeek.toFixed(2)} ريال هذا الأسبوع`);
      }
      if (budgetUsage < 75) {
        highlights.push('تسير بشكل جيد ضمن حدود الميزانية');
      }

      // Generate concerns
      const concerns: string[] = [];
      if (changeFromLastWeek > 20) {
        concerns.push(`ارتفعت مصاريفك بنسبة ${changeFromLastWeek.toFixed(1)}% مقارنة بالأسبوع الماضي`);
      }
      if (budgetUsage > 90) {
        concerns.push('اقتربت من حد الميزانية الشهرية');
      }
      if (savingsThisWeek < 0) {
        concerns.push('المصاريف تجاوزت الدخل هذا الأسبوع');
      }

      // Generate recommendations
      const recommendations: string[] = [];
      const topCategories = await expenseRepository.getTotalByCategory(
        weekStart, weekEnd, userId, familyId
      );

      if (topCategories.length > 0) {
        const topCategory = topCategories[0];
        if (topCategory.total > 400) {
          recommendations.push(`فكر في تقليل مصاريف ${topCategory.categoryName} في الأسبوع القادم`);
        }
      }

      if (concerns.length === 0) {
        recommendations.push('استمر في هذا الأداء الجيد واحرص على الادخار');
      }

      return {
        id: `weekly_${weekStart.getTime()}`,
        weekStart,
        weekEnd,
        summary: {
          totalSpent,
          budgetUsage,
          savingsThisWeek,
          comparedToLastWeek: changeFromLastWeek,
        },
        highlights,
        concerns,
        recommendations,
      };

    } catch (error) {
      console.error('Error generating weekly advice:', error);
      throw error;
    }
  }

  // Generate monthly advice and score
  async generateMonthlyAdvice(
    year: number,
    month: number,
    userId?: string,
    familyId?: string
  ): Promise<MonthlyAdvice> {
    try {
      // Get monthly report for detailed analysis
      const monthlyReport = await reportService.generateMonthlyReport(year, month, userId, familyId);

      // Calculate overall score (0-100)
      let score = 70; // Base score

      // Adjust score based on savings rate
      if (monthlyReport.summary.savingsRate > 20) score += 20;
      else if (monthlyReport.summary.savingsRate > 10) score += 10;
      else if (monthlyReport.summary.savingsRate < 0) score -= 20;

      // Adjust score based on budget performance
      if (monthlyReport.budgetComparison) {
        if (!monthlyReport.budgetComparison.isOverBudget) score += 10;
        else score -= 15;
        
        if (monthlyReport.budgetComparison.percentageUsed < 80) score += 5;
      }

      // Adjust score based on expense distribution
      const topCategoryPercentage = monthlyReport.expensesByCategory[0]?.percentage || 0;
      if (topCategoryPercentage < 40) score += 5;
      else if (topCategoryPercentage > 60) score -= 10;

      score = Math.max(0, Math.min(100, score)); // Clamp between 0-100

      // Generate achievements
      const achievements: string[] = [];
      if (monthlyReport.summary.savingsRate > 15) {
        achievements.push(`حققت معدل ادخار ممتاز (${monthlyReport.summary.savingsRate.toFixed(1)}%)`);
      }
      if (monthlyReport.budgetComparison && !monthlyReport.budgetComparison.isOverBudget) {
        achievements.push('التزمت بحدود الميزانية المحددة');
      }
      if (monthlyReport.trends.comparedToPreviousMonth.expenseChange < -5) {
        achievements.push('قللت من مصاريفك مقارنة بالشهر الماضي');
      }

      // Generate improvements
      const improvements: string[] = [];
      if (monthlyReport.summary.savingsRate < 5) {
        improvements.push('حاول زيادة معدل الادخار الشهري');
      }
      if (monthlyReport.budgetComparison?.isOverBudget) {
        improvements.push('خطط بشكل أفضل لتجنب تجاوز الميزانية');
      }
      if (topCategoryPercentage > 50) {
        const topCategory = monthlyReport.expensesByCategory[0];
        improvements.push(`نوع مصاريفك أكثر - ${topCategory.categoryName} تشكل نسبة عالية`);
      }

      // Generate next month goals
      const nextMonthGoals: string[] = [];
      const targetSavingsRate = Math.min(monthlyReport.summary.savingsRate + 5, 25);
      nextMonthGoals.push(`استهدف معدل ادخار ${targetSavingsRate.toFixed(0)}% الشهر القادم`);
      
      if (monthlyReport.budgetComparison) {
        nextMonthGoals.push('التزم بحدود الميزانية في جميع الفئات');
      }
      
      nextMonthGoals.push('راجع مصاريفك أسبوعياً لتجنب المفاجآت');

      // Custom recommendations based on spending patterns
      const customRecommendations = monthlyReport.recommendations;

      return {
        id: `monthly_${year}_${month}`,
        month,
        year,
        overallScore: score,
        achievements,
        improvements,
        nextMonthGoals,
        customRecommendations,
      };

    } catch (error) {
      console.error('Error generating monthly advice:', error);
      throw error;
    }
  }

  // Check for recurring patterns and suggest optimizations
  private async checkRecurringPatterns(userId?: string, familyId?: string): Promise<DailyAdvice[]> {
    const advice: DailyAdvice[] = [];
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    try {
      // Get recurring income patterns
      const recurringIncome = await incomeRepository.getRecurringIncome(userId, familyId);
      
      // Check for salary patterns
      const salaryIncome = recurringIncome.find(inc => inc.type === 'salary');
      if (salaryIncome && salaryIncome.frequency > 0.8) { // More than 80% frequency
        const daysSinceLastSalary = Math.floor((today.getTime() - salaryIncome.lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastSalary > 35) { // More than 35 days
          advice.push({
            id: `pattern_${Date.now()}_salary`,
            type: 'reminder',
            title: 'تذكير راتب',
            content: 'لم تسجل راتبك هذا الشهر. لا تنس إضافته لتتبع دخلك بدقة.',
            priority: 'medium',
            actionable: true,
            actionText: 'أضف الراتب',
            createdAt: new Date(),
          });
        }
      }

      return advice;
    } catch (error) {
      console.error('Error checking recurring patterns:', error);
      return [];
    }
  }

  // Get motivational tips
  private getMotivationalTips(): string[] {
    return [
      'الادخار اليوم هو استثمار في مستقبلك.',
      'كل ريال توفره اليوم يقربك من أهدافك المالية.',
      'تتبع مصاريفك يساعدك على اتخاذ قرارات مالية أفضل.',
      'الميزانية الجيدة هي خريطة الطريق نحو الحرية المالية.',
      'الإنفاق الذكي لا يعني الحرمان، بل التخطيط الجيد.',
      'صغار المصاريف قد تؤدي إلى كبار المشاكل المالية.',
      'الاستثمار في المعرفة المالية يحقق أفضل الفوائد.',
      'تذكر: الثراء ليس كم تكسب، بل كم توفر.',
      'خطط لمصاريفك واجعل كل ريال له هدف.',
      'الانضباط المالي اليوم يعني راحة البال غداً.',
    ];
  }

  // Generate category-specific advice
  async generateCategoryAdvice(
    categoryId: string,
    userId?: string,
    familyId?: string
  ): Promise<string[]> {
    const advice: string[] = [];
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    try {
      // Get category report for current month
      const categoryReport = await reportService.generateCategoryReport(
        categoryId, monthStart, today, userId, familyId
      );

      const { category, summary } = categoryReport;

      // Generate advice based on spending patterns
      if (summary.transactionCount > 15) {
        advice.push(`لديك ${summary.transactionCount} مصروف في فئة ${category.name} هذا الشهر. فكر في تجميع المشتريات لتوفير الوقت والمال.`);
      }

      if (summary.averageTransaction < 20) {
        advice.push(`متوسط مصاريف ${category.name} منخفض (${summary.averageTransaction.toFixed(2)} ريال). هذا يشير إلى إنفاق مدروس.`);
      } else if (summary.averageTransaction > 200) {
        advice.push(`متوسط مصاريف ${category.name} عالي (${summary.averageTransaction.toFixed(2)} ريال). راجع إمكانية التوفير.`);
      }

      // Weekly pattern advice
      const weekendSpending = categoryReport.trends.weeklyPattern
        .filter(day => day.dayOfWeek === 'الجمعة' || day.dayOfWeek === 'السبت')
        .reduce((sum, day) => sum + day.total, 0);
      
      const weekdaySpending = summary.totalSpent - weekendSpending;
      
      if (weekendSpending > weekdaySpending * 0.6) {
        advice.push(`تنفق أكثر في نهاية الأسبوع في فئة ${category.name}. خطط مسبقاً لتجنب الإنفاق الزائد.`);
      }

      return advice;
    } catch (error) {
      console.error('Error generating category advice:', error);
      return [];
    }
  }
}

export const adviceService = new AdviceService();
