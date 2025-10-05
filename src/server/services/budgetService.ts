import { budgetRepository, BudgetSummary } from '../repositories/budgetRepository';
import { expenseRepository } from '../repositories/expenseRepository';

export interface BudgetAlert {
  type: 'warning' | 'danger' | 'info';
  budgetId: string;
  budgetName: string;
  categoryId: string;
  categoryName: string;
  message: string;
  limit: number;
  spent: number;
  percentage: number;
}

export class BudgetService {
  // Check for budget alerts (110% threshold)
  async checkBudgetAlerts(userId?: string, familyId?: string): Promise<BudgetAlert[]> {
    const alerts: BudgetAlert[] = [];
    
    try {
      const overBudgetItems = await budgetRepository.getOverBudgetAlerts(userId, familyId);
      
      for (const item of overBudgetItems) {
        const alertType = item.overagePercentage >= 150 ? 'danger' : 
                         item.overagePercentage >= 110 ? 'warning' : 'info';
        
        alerts.push({
          type: alertType,
          budgetId: item.budgetId,
          budgetName: item.budgetName,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          message: `تم تجاوز حد الميزانية في فئة "${item.categoryName}" بمبلغ ${item.overageAmount.toFixed(2)} ريال (${item.overagePercentage.toFixed(1)}%)`,
          limit: item.limit,
          spent: item.spent,
          percentage: item.overagePercentage,
        });
      }
      
      return alerts.sort((a, b) => b.percentage - a.percentage);
    } catch (error) {
      console.error('Error checking budget alerts:', error);
      return [];
    }
  }

  // Get budget summary with spending analysis
  async getBudgetAnalysis(budgetId: string): Promise<BudgetSummary | null> {
    try {
      const summary = await budgetRepository.getBudgetSummary(budgetId);
      if (!summary) return null;

      // Update spent amounts to ensure accuracy
      await budgetRepository.updateCategoryBudgetSpent(budgetId);
      
      // Get fresh summary after update
      return await budgetRepository.getBudgetSummary(budgetId);
    } catch (error) {
      console.error('Error getting budget analysis:', error);
      return null;
    }
  }

  // Calculate budget recommendations
  async getBudgetRecommendations(userId?: string, familyId?: string): Promise<{
    totalRecommendedBudget: number;
    categoryRecommendations: Array<{
      categoryId: string;
      categoryName: string;
      recommendedAmount: number;
      currentAverage: number;
      reasoning: string;
    }>;
    savingsGoal: number;
    emergencyFund: number;
  }> {
    try {
      // Get last 3 months average expenses
      const averages = await expenseRepository.getMonthlyAverages(3, userId, familyId);
      
      // Calculate recommendations (add 10% buffer to averages)
      const categoryRecommendations = averages.averageByCategory.map(cat => ({
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        recommendedAmount: Math.ceil(cat.averageAmount * 1.1),
        currentAverage: cat.averageAmount,
        reasoning: `بناءً على متوسط آخر 3 أشهر (${cat.averageAmount.toFixed(2)} ريال) مع إضافة 10% كهامش أمان`,
      }));

      const totalRecommendedBudget = categoryRecommendations.reduce(
        (sum, cat) => sum + cat.recommendedAmount, 0
      );

      // Recommend 20% savings and 10% emergency fund
      const savingsGoal = Math.ceil(totalRecommendedBudget * 0.2);
      const emergencyFund = Math.ceil(totalRecommendedBudget * 0.1);

      return {
        totalRecommendedBudget,
        categoryRecommendations,
        savingsGoal,
        emergencyFund,
      };
    } catch (error) {
      console.error('Error calculating budget recommendations:', error);
      return {
        totalRecommendedBudget: 0,
        categoryRecommendations: [],
        savingsGoal: 0,
        emergencyFund: 0,
      };
    }
  }

  // Monitor budget performance
  async getBudgetPerformance(budgetId: string): Promise<{
    overall: {
      score: number; // 0-100
      status: 'excellent' | 'good' | 'warning' | 'danger';
      message: string;
    };
    categories: Array<{
      categoryId: string;
      categoryName: string;
      score: number;
      status: 'on-track' | 'warning' | 'over-budget';
      trend: 'improving' | 'stable' | 'worsening';
    }>;
    suggestions: string[];
  }> {
    try {
      const summary = await this.getBudgetAnalysis(budgetId);
      if (!summary) {
        return {
          overall: { score: 0, status: 'danger', message: 'لا يمكن العثور على الميزانية' },
          categories: [],
          suggestions: [],
        };
      }

      // Calculate overall score
      let overallScore = 100;
      if (summary.isOverBudget) {
        overallScore = Math.max(0, 100 - (summary.percentageUsed - 100));
      } else if (summary.percentageUsed > 90) {
        overallScore = 90;
      } else if (summary.percentageUsed > 75) {
        overallScore = 85;
      }

      const overallStatus = summary.isOverBudget ? 'danger' :
                           summary.percentageUsed > 90 ? 'warning' :
                           summary.percentageUsed > 75 ? 'good' : 'excellent';

      const overallMessage = summary.isOverBudget 
        ? `تم تجاوز الميزانية بنسبة ${(summary.percentageUsed - 100).toFixed(1)}%`
        : summary.percentageUsed > 90
        ? `اقتراب من حد الميزانية (${summary.percentageUsed.toFixed(1)}%)`
        : `أداء جيد في الميزانية (${summary.percentageUsed.toFixed(1)}%)`;

      // Analyze categories
      const categories = summary.categoryBreakdown.map(cat => {
        const score = cat.isOverBudget ? 0 : 
                     cat.percentageUsed > 90 ? 30 :
                     cat.percentageUsed > 75 ? 70 : 100;

        const status = cat.isOverBudget ? 'over-budget' :
                      cat.percentageUsed > 90 ? 'warning' : 'on-track';

        return {
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          score,
          status,
          trend: 'stable' as const, // Would need historical data for real trend
        };
      });

      // Generate suggestions
      const suggestions: string[] = [];
      
      if (summary.isOverBudget) {
        suggestions.push('قم بمراجعة المصاريف غير الضرورية وتقليلها');
      }

      const overBudgetCategories = summary.categoryBreakdown.filter(cat => cat.isOverBudget);
      if (overBudgetCategories.length > 0) {
        suggestions.push(`راجع مصاريف: ${overBudgetCategories.map(c => c.categoryName).join('، ')}`);
      }

      const nearLimitCategories = summary.categoryBreakdown.filter(cat => cat.isNearLimit && !cat.isOverBudget);
      if (nearLimitCategories.length > 0) {
        suggestions.push(`انتبه لفئات قريبة من الحد: ${nearLimitCategories.map(c => c.categoryName).join('، ')}`);
      }

      if (summary.percentageUsed < 50) {
        suggestions.push('أداء ممتاز! يمكنك زيادة الادخار أو الاستثمار');
      }

      return {
        overall: { score: overallScore, status: overallStatus, message: overallMessage },
        categories: categories as any,
        suggestions,
      };
    } catch (error) {
      console.error('Error getting budget performance:', error);
      return {
        overall: { score: 0, status: 'danger', message: 'خطأ في تحليل الميزانية' },
        categories: [],
        suggestions: [],
      };
    }
  }

  // Auto-adjust budget based on spending patterns
  async suggestBudgetAdjustments(budgetId: string): Promise<{
    adjustments: Array<{
      categoryId: string;
      categoryName: string;
      currentLimit: number;
      suggestedLimit: number;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    totalAdjustment: number;
  }> {
    try {
      const summary = await this.getBudgetAnalysis(budgetId);
      if (!summary) {
        return { adjustments: [], totalAdjustment: 0 };
      }

      const adjustments = summary.categoryBreakdown
        .map(cat => {
          let suggestedLimit = cat.limit;
          let reason = '';
          let priority: 'high' | 'medium' | 'low' = 'low';

          if (cat.isOverBudget) {
            // Increase limit by 20% for over-budget categories
            suggestedLimit = Math.ceil(cat.spent * 1.2);
            reason = `تم تجاوز الحد، يُقترح زيادة الميزانية بـ ${((suggestedLimit - cat.limit) / cat.limit * 100).toFixed(1)}%`;
            priority = 'high';
          } else if (cat.percentageUsed > 90) {
            // Increase limit by 10% for near-limit categories
            suggestedLimit = Math.ceil(cat.limit * 1.1);
            reason = `قريب من الحد، يُقترح زيادة طفيفة للأمان`;
            priority = 'medium';
          } else if (cat.percentageUsed < 50) {
            // Decrease limit by 10% for under-utilized categories
            suggestedLimit = Math.ceil(cat.limit * 0.9);
            reason = `استخدام منخفض، يمكن تقليل الحد وتوجيه المبلغ للادخار`;
            priority = 'low';
          }

          return {
            categoryId: cat.categoryId,
            categoryName: cat.categoryName,
            currentLimit: cat.limit,
            suggestedLimit,
            reason,
            priority,
          };
        })
        .filter(adj => adj.suggestedLimit !== adj.currentLimit);

      const totalAdjustment = adjustments.reduce(
        (sum, adj) => sum + (adj.suggestedLimit - adj.currentLimit), 0
      );

      return {
        adjustments: adjustments.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }),
        totalAdjustment,
      };
    } catch (error) {
      console.error('Error suggesting budget adjustments:', error);
      return { adjustments: [], totalAdjustment: 0 };
    }
  }

  // Check if expense would exceed budget (before adding)
  async validateExpenseAgainstBudget(
    amount: number,
    categoryId: string,
    userId?: string,
    familyId?: string
  ): Promise<{
    allowed: boolean;
    warning?: string;
    budgetInfo?: {
      budgetId: string;
      categoryLimit: number;
      currentSpent: number;
      remainingAfterExpense: number;
      percentageAfterExpense: number;
    };
  }> {
    try {
      // Get current month budget
      const currentBudget = await budgetRepository.getCurrentMonthBudget(userId, familyId);
      if (!currentBudget) {
        return { allowed: true }; // No budget = no restrictions
      }

      const summary = await this.getBudgetAnalysis(currentBudget.id);
      if (!summary) {
        return { allowed: true };
      }

      const categoryBudget = summary.categoryBreakdown.find(cat => cat.categoryId === categoryId);
      if (!categoryBudget) {
        return { allowed: true }; // Category not in budget = allowed
      }

      const newSpent = categoryBudget.spent + amount;
      const newPercentage = (newSpent / categoryBudget.limit) * 100;

      if (newSpent > categoryBudget.limit * 1.1) {
        return {
          allowed: false,
          warning: `هذا المصروف سيتجاوز حد فئة "${categoryBudget.categoryName}" بنسبة ${newPercentage.toFixed(1)}%. الحد المسموح: ${categoryBudget.limit} ريال`,
          budgetInfo: {
            budgetId: currentBudget.id,
            categoryLimit: categoryBudget.limit,
            currentSpent: categoryBudget.spent,
            remainingAfterExpense: categoryBudget.limit - newSpent,
            percentageAfterExpense: newPercentage,
          },
        };
      }

      if (newSpent > categoryBudget.limit) {
        return {
          allowed: true,
          warning: `تنبيه: هذا المصروف سيتجاوز حد فئة "${categoryBudget.categoryName}" (${newPercentage.toFixed(1)}%)`,
          budgetInfo: {
            budgetId: currentBudget.id,
            categoryLimit: categoryBudget.limit,
            currentSpent: categoryBudget.spent,
            remainingAfterExpense: categoryBudget.limit - newSpent,
            percentageAfterExpense: newPercentage,
          },
        };
      }

      if (newPercentage > 90) {
        return {
          allowed: true,
          warning: `تنبيه: اقتراب من حد فئة "${categoryBudget.categoryName}" (${newPercentage.toFixed(1)}%)`,
          budgetInfo: {
            budgetId: currentBudget.id,
            categoryLimit: categoryBudget.limit,
            currentSpent: categoryBudget.spent,
            remainingAfterExpense: categoryBudget.limit - newSpent,
            percentageAfterExpense: newPercentage,
          },
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error validating expense against budget:', error);
      return { allowed: true }; // Allow on error to not block user
    }
  }
}

export const budgetService = new BudgetService();
