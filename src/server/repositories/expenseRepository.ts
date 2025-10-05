import { prisma } from '../db';
import { Expense, Prisma } from '@prisma/client';

export interface ExpenseWithDetails extends Expense {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  subcategory?: {
    id: string;
    name: string;
  } | null;
  user: {
    id: string;
    name: string | null;
  };
}

export interface ExpenseFilters {
  userId?: string;
  familyId?: string;
  categoryId?: string;
  subcategoryId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: 'date' | 'amount' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export class ExpenseRepository {
  // Create expense
  async create(data: Omit<Expense, 'id'>): Promise<Expense> {
    return await prisma.expense.create({
      data,
    });
  }

  // Get expense by ID with details
  async findById(id: string): Promise<ExpenseWithDetails | null> {
    return await prisma.expense.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Get expenses with filters and pagination
  async findMany(
    filters: ExpenseFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{
    expenses: ExpenseWithDetails[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      orderBy = 'date',
      orderDirection = 'desc',
    } = pagination;

    const where: Prisma.ExpenseWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.familyId) where.familyId = filters.familyId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.subcategoryId) where.subcategoryId = filters.subcategoryId;

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }

    if (filters.minAmount || filters.maxAmount) {
      where.amount = {};
      if (filters.minAmount) where.amount.gte = filters.minAmount;
      if (filters.maxAmount) where.amount.lte = filters.maxAmount;
    }

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { [orderBy]: orderDirection },
        skip,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      expenses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update expense
  async update(id: string, data: Partial<Omit<Expense, 'id'>>): Promise<Expense> {
    return await prisma.expense.update({
      where: { id },
      data,
    });
  }

  // Delete expense
  async delete(id: string): Promise<Expense> {
    return await prisma.expense.delete({
      where: { id },
    });
  }

  // Get expenses for a specific month
  async findByMonth(
    year: number,
    month: number,
    userId?: string,
    familyId?: string
  ): Promise<ExpenseWithDetails[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const where: Prisma.ExpenseWhereInput = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) where.userId = userId;
    if (familyId) where.familyId = familyId;

    return await prisma.expense.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  // Get total expenses by category for a period
  async getTotalByCategory(
    startDate: Date,
    endDate: Date,
    userId?: string,
    familyId?: string
  ): Promise<Array<{
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    total: number;
    count: number;
  }>> {
    const where: Prisma.ExpenseWhereInput = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) where.userId = userId;
    if (familyId) where.familyId = familyId;

    const result = await prisma.expense.groupBy({
      by: ['categoryId'],
      where,
      _sum: { amount: true },
      _count: { id: true },
    });

    // Get category details
    const categoryIds = result.map(r => r.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, icon: true, color: true },
    });

    return result.map(r => {
      const category = categories.find(c => c.id === r.categoryId);
      return {
        categoryId: r.categoryId,
        categoryName: category?.name || 'غير محدد',
        categoryIcon: category?.icon || 'help-circle',
        categoryColor: category?.color || '#6B7280',
        total: Number(r._sum.amount || 0),
        count: r._count.id,
      };
    }).sort((a, b) => b.total - a.total);
  }

  // Get top 5 categories by spending
  async getTopCategories(
    startDate: Date,
    endDate: Date,
    userId?: string,
    familyId?: string,
    limit: number = 5
  ): Promise<Array<{
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    total: number;
    count: number;
  }>> {
    const totals = await this.getTotalByCategory(startDate, endDate, userId, familyId);
    return totals.slice(0, limit);
  }

  // Get monthly averages for the last N months
  async getMonthlyAverages(
    months: number = 3,
    userId?: string,
    familyId?: string
  ): Promise<{
    averageTotal: number;
    averageByCategory: Array<{
      categoryId: string;
      categoryName: string;
      averageAmount: number;
    }>;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const where: Prisma.ExpenseWhereInput = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) where.userId = userId;
    if (familyId) where.familyId = familyId;

    // Get total average
    const totalResult = await prisma.expense.aggregate({
      where,
      _sum: { amount: true },
      _count: { id: true },
    });

    const averageTotal = Number(totalResult._sum.amount || 0) / months;

    // Get category averages
    const categoryTotals = await this.getTotalByCategory(startDate, endDate, userId, familyId);
    const averageByCategory = categoryTotals.map(cat => ({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      averageAmount: cat.total / months,
    }));

    return {
      averageTotal,
      averageByCategory,
    };
  }

  // Get expenses for budget calculation
  async getExpensesForBudget(
    budgetId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Array<{
    categoryId: string;
    total: number;
  }>> {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: { categoryBudgets: true },
    });

    if (!budget) return [];

    const categoryIds = budget.categoryBudgets.map(cb => cb.categoryId);

    const result = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        categoryId: { in: categoryIds },
        date: {
          gte: startDate,
          lte: endDate,
        },
        OR: [
          { userId: budget.userId },
          { familyId: budget.familyId },
        ],
      },
      _sum: { amount: true },
    });

    return result.map(r => ({
      categoryId: r.categoryId,
      total: Number(r._sum.amount || 0),
    }));
  }

  // Delete all expenses for a user (cleanup)
  async deleteAllForUser(userId: string): Promise<number> {
    const result = await prisma.expense.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  // Delete all expenses for a family (cleanup)
  async deleteAllForFamily(familyId: string): Promise<number> {
    const result = await prisma.expense.deleteMany({
      where: { familyId },
    });
    return result.count;
  }
}

export const expenseRepository = new ExpenseRepository();
