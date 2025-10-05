import { prisma } from '../db';
import { Income, Prisma } from '@prisma/client';

export interface IncomeWithDetails extends Income {
  user: {
    id: string;
    name: string | null;
  };
}

export interface IncomeFilters {
  userId?: string;
  familyId?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export class IncomeRepository {
  // Create income
  async create(data: Omit<Income, 'id'>): Promise<Income> {
    return await prisma.income.create({
      data,
    });
  }

  // Get income by ID with details
  async findById(id: string): Promise<IncomeWithDetails | null> {
    return await prisma.income.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Get incomes with filters
  async findMany(filters: IncomeFilters = {}): Promise<IncomeWithDetails[]> {
    const where: Prisma.IncomeWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.familyId) where.familyId = filters.familyId;
    if (filters.type) where.type = filters.type;

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

    return await prisma.income.findMany({
      where,
      include: {
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

  // Update income
  async update(id: string, data: Partial<Omit<Income, 'id'>>): Promise<Income> {
    return await prisma.income.update({
      where: { id },
      data,
    });
  }

  // Delete income
  async delete(id: string): Promise<Income> {
    return await prisma.income.delete({
      where: { id },
    });
  }

  // Get incomes for a specific month
  async findByMonth(
    year: number,
    month: number,
    userId?: string,
    familyId?: string
  ): Promise<IncomeWithDetails[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const where: Prisma.IncomeWhereInput = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) where.userId = userId;
    if (familyId) where.familyId = familyId;

    return await prisma.income.findMany({
      where,
      include: {
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

  // Get total income by type for a period
  async getTotalByType(
    startDate: Date,
    endDate: Date,
    userId?: string,
    familyId?: string
  ): Promise<Array<{
    type: string;
    total: number;
    count: number;
  }>> {
    const where: Prisma.IncomeWhereInput = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) where.userId = userId;
    if (familyId) where.familyId = familyId;

    const result = await prisma.income.groupBy({
      by: ['type'],
      where,
      _sum: { amount: true },
      _count: { id: true },
    });

    return result.map(r => ({
      type: r.type,
      total: Number(r._sum.amount || 0),
      count: r._count.id,
    })).sort((a, b) => b.total - a.total);
  }

  // Get total income for a period
  async getTotalForPeriod(
    startDate: Date,
    endDate: Date,
    userId?: string,
    familyId?: string
  ): Promise<number> {
    const where: Prisma.IncomeWhereInput = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) where.userId = userId;
    if (familyId) where.familyId = familyId;

    const result = await prisma.income.aggregate({
      where,
      _sum: { amount: true },
    });

    return Number(result._sum.amount || 0);
  }

  // Get monthly income averages for the last N months
  async getMonthlyAverages(
    months: number = 3,
    userId?: string,
    familyId?: string
  ): Promise<{
    averageTotal: number;
    averageByType: Array<{
      type: string;
      averageAmount: number;
    }>;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const where: Prisma.IncomeWhereInput = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) where.userId = userId;
    if (familyId) where.familyId = familyId;

    // Get total average
    const totalResult = await prisma.income.aggregate({
      where,
      _sum: { amount: true },
    });

    const averageTotal = Number(totalResult._sum.amount || 0) / months;

    // Get type averages
    const typeTotals = await this.getTotalByType(startDate, endDate, userId, familyId);
    const averageByType = typeTotals.map(type => ({
      type: type.type,
      averageAmount: type.total / months,
    }));

    return {
      averageTotal,
      averageByType,
    };
  }

  // Get recurring income (salary patterns)
  async getRecurringIncome(
    userId?: string,
    familyId?: string
  ): Promise<Array<{
    type: string;
    averageAmount: number;
    frequency: number; // times per month
    lastAmount: number;
    lastDate: Date;
  }>> {
    // Get last 6 months of data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const incomes = await this.findMany({
      userId,
      familyId,
      startDate,
      endDate,
    });

    // Group by type and analyze patterns
    const typeGroups = incomes.reduce((acc, income) => {
      if (!acc[income.type]) {
        acc[income.type] = [];
      }
      acc[income.type].push(income);
      return acc;
    }, {} as Record<string, Income[]>);

    return Object.entries(typeGroups).map(([type, typeIncomes]) => {
      const totalAmount = typeIncomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
      const averageAmount = totalAmount / typeIncomes.length;
      const frequency = typeIncomes.length / 6; // per month average
      
      // Get latest income
      const latest = typeIncomes.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      return {
        type,
        averageAmount,
        frequency,
        lastAmount: Number(latest.amount),
        lastDate: latest.date,
      };
    }).sort((a, b) => b.averageAmount - a.averageAmount);
  }

  // Delete all incomes for a user (cleanup)
  async deleteAllForUser(userId: string): Promise<number> {
    const result = await prisma.income.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  // Delete all incomes for a family (cleanup)
  async deleteAllForFamily(familyId: string): Promise<number> {
    const result = await prisma.income.deleteMany({
      where: { familyId },
    });
    return result.count;
  }
}

export const incomeRepository = new IncomeRepository();
