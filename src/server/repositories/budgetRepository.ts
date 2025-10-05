import { prisma } from '../db';
import { Budget, CategoryBudget, Prisma } from '@prisma/client';

export interface BudgetWithDetails extends Budget {
  categoryBudgets: Array<CategoryBudget & {
    category: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
  }>;
  event?: {
    id: string;
    name: string;
    type: string;
  } | null;
}

export interface BudgetFilters {
  userId?: string;
  familyId?: string;
  eventId?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface BudgetSummary {
  budget: BudgetWithDetails;
  totalSpent: number;
  totalLimit: number;
  remainingAmount: number;
  percentageUsed: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    limit: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
    isOverBudget: boolean;
    isNearLimit: boolean; // > 90%
  }>;
  isOverBudget: boolean;
  isNearLimit: boolean; // > 90%
}

export class BudgetRepository {
  // Create budget with category budgets
  async create(
    budgetData: Omit<Budget, 'id'>,
    categoryBudgets: Array<Omit<CategoryBudget, 'id' | 'budgetId' | 'spent'>>
  ): Promise<BudgetWithDetails> {
    return await prisma.$transaction(async (tx) => {
      // Create budget
      const budget = await tx.budget.create({
        data: budgetData,
      });

      // Create category budgets
      await tx.categoryBudget.createMany({
        data: categoryBudgets.map(cb => ({
          ...cb,
          budgetId: budget.id,
          spent: 0,
        })),
      });

      // Return with details
      return await tx.budget.findUnique({
        where: { id: budget.id },
        include: {
          categoryBudgets: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                  color: true,
                },
              },
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      }) as BudgetWithDetails;
    });
  }

  // Get budget by ID with details
  async findById(id: string): Promise<BudgetWithDetails | null> {
    return await prisma.budget.findUnique({
      where: { id },
      include: {
        categoryBudgets: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                icon: true,
                color: true,
              },
            },
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  // Get budgets with filters
  async findMany(filters: BudgetFilters = {}): Promise<BudgetWithDetails[]> {
    const where: Prisma.BudgetWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.familyId) where.familyId = filters.familyId;
    if (filters.eventId) where.eventId = filters.eventId;

    if (filters.startDate || filters.endDate) {
      where.startDate = {};
      if (filters.startDate) where.startDate.gte = filters.startDate;
      if (filters.endDate) where.startDate.lte = filters.endDate;
    }

    if (filters.isActive) {
      const now = new Date();
      where.AND = [
        { startDate: { lte: now } },
        { endDate: { gte: now } },
      ];
    }

    return await prisma.budget.findMany({
      where,
      include: {
        categoryBudgets: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                icon: true,
                color: true,
              },
            },
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  // Update budget
  async update(id: string, data: Partial<Omit<Budget, 'id'>>): Promise<Budget> {
    return await prisma.budget.update({
      where: { id },
      data,
    });
  }

  // Delete budget
  async delete(id: string): Promise<Budget> {
    return await prisma.budget.delete({
      where: { id },
    });
  }

  // Get active budgets for user/family
  async getActiveBudgets(userId?: string, familyId?: string): Promise<BudgetWithDetails[]> {
    return await this.findMany({
      userId,
      familyId,
      isActive: true,
    });
  }

  // Get budget summary with calculations
  async getBudgetSummary(id: string): Promise<BudgetSummary | null> {
    const budget = await this.findById(id);
    if (!budget) return null;

    // Get actual expenses for the budget period
    const expenseData = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        categoryId: { in: budget.categoryBudgets.map(cb => cb.categoryId) },
        date: {
          gte: budget.startDate,
          lte: budget.endDate,
        },
        OR: [
          { userId: budget.userId },
          { familyId: budget.familyId },
        ],
      },
      _sum: { amount: true },
    });

    const totalLimit = Number(budget.totalLimit);
    let totalSpent = 0;

    const categoryBreakdown = budget.categoryBudgets.map(cb => {
      const expenseInfo = expenseData.find(e => e.categoryId === cb.categoryId);
      const spent = Number(expenseInfo?._sum.amount || 0);
      const limit = Number(cb.limit);
      const remaining = Math.max(0, limit - spent);
      const percentageUsed = limit > 0 ? (spent / limit) * 100 : 0;

      totalSpent += spent;

      return {
        categoryId: cb.categoryId,
        categoryName: cb.category.name,
        categoryIcon: cb.category.icon,
        categoryColor: cb.category.color,
        limit,
        spent,
        remaining,
        percentageUsed,
        isOverBudget: spent > limit,
        isNearLimit: percentageUsed >= 90,
      };
    });

    const remainingAmount = Math.max(0, totalLimit - totalSpent);
    const percentageUsed = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

    return {
      budget,
      totalSpent,
      totalLimit,
      remainingAmount,
      percentageUsed,
      categoryBreakdown,
      isOverBudget: totalSpent > totalLimit,
      isNearLimit: percentageUsed >= 90,
    };
  }

  // Update category budget spent amounts
  async updateCategoryBudgetSpent(budgetId: string): Promise<void> {
    const budget = await this.findById(budgetId);
    if (!budget) return;

    const expenseData = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        categoryId: { in: budget.categoryBudgets.map(cb => cb.categoryId) },
        date: {
          gte: budget.startDate,
          lte: budget.endDate,
        },
        OR: [
          { userId: budget.userId },
          { familyId: budget.familyId },
        ],
      },
      _sum: { amount: true },
    });

    // Update each category budget
    await Promise.all(
      budget.categoryBudgets.map(async (cb) => {
        const expenseInfo = expenseData.find(e => e.categoryId === cb.categoryId);
        const spent = Number(expenseInfo?._sum.amount || 0);

        await prisma.categoryBudget.update({
          where: { id: cb.id },
          data: { spent },
        });
      })
    );
  }

  // Get budgets that are over limit (110%)
  async getOverBudgetAlerts(userId?: string, familyId?: string): Promise<Array<{
    budgetId: string;
    budgetName: string;
    categoryId: string;
    categoryName: string;
    limit: number;
    spent: number;
    overageAmount: number;
    overagePercentage: number;
  }>> {
    const activeBudgets = await this.getActiveBudgets(userId, familyId);
  const alerts: any[] = [];

    for (const budget of activeBudgets) {
      const summary = await this.getBudgetSummary(budget.id);
      if (!summary) continue;

      for (const category of summary.categoryBreakdown) {
        // Check if over 110% of limit
        if (category.spent > category.limit * 1.1) {
          alerts.push({
            budgetId: budget.id,
            budgetName: budget.name,
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            limit: category.limit,
            spent: category.spent,
            overageAmount: category.spent - category.limit,
            overagePercentage: category.percentageUsed,
          });
        }
      }
    }

    return alerts;
  }

  // Get budget for current month
  async getCurrentMonthBudget(userId?: string, familyId?: string): Promise<BudgetWithDetails | null> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const budgets = await this.findMany({
      userId,
      familyId,
      startDate: startOfMonth,
      endDate: endOfMonth,
    });

    return budgets.find(b => 
      b.startDate <= endOfMonth && b.endDate >= startOfMonth
    ) || null;
  }

  // Delete all budgets for a user (cleanup)
  async deleteAllForUser(userId: string): Promise<number> {
    const result = await prisma.budget.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  // Delete all budgets for a family (cleanup)
  async deleteAllForFamily(familyId: string): Promise<number> {
    const result = await prisma.budget.deleteMany({
      where: { familyId },
    });
    return result.count;
  }
}

export class CategoryBudgetRepository {
  // Update category budget
  async update(id: string, data: Partial<Omit<CategoryBudget, 'id'>>): Promise<CategoryBudget> {
    return await prisma.categoryBudget.update({
      where: { id },
      data,
    });
  }

  // Delete category budget
  async delete(id: string): Promise<CategoryBudget> {
    return await prisma.categoryBudget.delete({
      where: { id },
    });
  }

  // Add category to existing budget
  async addCategoryToBudget(
    budgetId: string,
    categoryId: string,
    limit: number
  ): Promise<CategoryBudget> {
    return await prisma.categoryBudget.create({
      data: {
        budgetId,
        categoryId,
        limit,
        spent: 0,
      },
    });
  }

  // Remove category from budget
  async removeCategoryFromBudget(budgetId: string, categoryId: string): Promise<CategoryBudget> {
    return await prisma.categoryBudget.delete({
      where: {
        budgetId_categoryId: {
          budgetId,
          categoryId,
        },
      },
    });
  }
}

export const budgetRepository = new BudgetRepository();
export const categoryBudgetRepository = new CategoryBudgetRepository();
