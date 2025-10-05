import { prisma } from '../db';
import { Category, Subcategory, Prisma } from '@prisma/client';

export interface CategoryWithSubcategories extends Category {
  subcategories: Subcategory[];
  _count?: {
    expenses: number;
  };
}

export interface CategoryFilters {
  familyId?: string;
  isDefault?: boolean;
  name?: string;
}

export class CategoryRepository {
  // Create category
  async create(data: Omit<Category, 'id'>): Promise<Category> {
    return await prisma.category.create({
      data,
    });
  }

  // Get category by ID with subcategories
  async findById(id: string): Promise<CategoryWithSubcategories | null> {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
        _count: {
          select: {
            expenses: true,
          },
        },
      },
    });
  }

  // Get categories with filters
  async findMany(filters: CategoryFilters = {}): Promise<CategoryWithSubcategories[]> {
    const where: Prisma.CategoryWhereInput = {};

    if (filters.familyId !== undefined) {
      where.familyId = filters.familyId;
    }
    if (filters.isDefault !== undefined) {
      where.isDefault = filters.isDefault;
    }
    if (filters.name) {
      where.name = {
        contains: filters.name,
      };
    }

    return await prisma.category.findMany({
      where,
      include: {
        subcategories: true,
        _count: {
          select: {
            expenses: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  // Update category
  async update(id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  // Delete category
  async delete(id: string): Promise<Category> {
    return await prisma.category.delete({
      where: { id },
    });
  }

  // Get default categories
  async getDefaultCategories(): Promise<CategoryWithSubcategories[]> {
    return await this.findMany({ isDefault: true });
  }

  // Get categories for a family (including defaults)
  async getFamilyCategories(familyId: string): Promise<CategoryWithSubcategories[]> {
    return await prisma.category.findMany({
      where: {
        OR: [
          { familyId },
          { isDefault: true },
        ],
      },
      include: {
        subcategories: true,
        _count: {
          select: {
            expenses: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  // Get categories with expense counts for a period
  async getCategoriesWithExpenseCounts(
    startDate: Date,
    endDate: Date,
    familyId?: string
  ): Promise<Array<CategoryWithSubcategories & {
    expenseCount: number;
    totalAmount: number;
  }>> {
    const categories = await this.getFamilyCategories(familyId || '');

    const expenseData = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(familyId && { familyId }),
      },
      _count: { id: true },
      _sum: { amount: true },
    });

    return categories.map(category => {
      const expenseInfo = expenseData.find(e => e.categoryId === category.id);
      return {
        ...category,
        expenseCount: expenseInfo?._count.id || 0,
        totalAmount: Number(expenseInfo?._sum.amount || 0),
      };
    });
  }

  // Check if category can be deleted (no expenses)
  async canDelete(id: string): Promise<boolean> {
    const expenseCount = await prisma.expense.count({
      where: { categoryId: id },
    });
    return expenseCount === 0;
  }

  // Delete all categories for a family (cleanup)
  async deleteAllForFamily(familyId: string): Promise<number> {
    const result = await prisma.category.deleteMany({
      where: { familyId },
    });
    return result.count;
  }
}

export class SubcategoryRepository {
  // Create subcategory
  async create(data: Omit<Subcategory, 'id'>): Promise<Subcategory> {
    return await prisma.subcategory.create({
      data,
    });
  }

  // Get subcategory by ID
  async findById(id: string): Promise<Subcategory | null> {
    return await prisma.subcategory.findUnique({
      where: { id },
    });
  }

  // Get subcategories by category
  async findByCategory(categoryId: string): Promise<Subcategory[]> {
    return await prisma.subcategory.findMany({
      where: { categoryId },
      orderBy: { name: 'asc' },
    });
  }

  // Get all subcategories with category info
  async findManyWithCategory(): Promise<Array<Subcategory & {
    category: Category;
  }>> {
    return await prisma.subcategory.findMany({
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  // Update subcategory
  async update(id: string, data: Partial<Omit<Subcategory, 'id'>>): Promise<Subcategory> {
    return await prisma.subcategory.update({
      where: { id },
      data,
    });
  }

  // Delete subcategory
  async delete(id: string): Promise<Subcategory> {
    return await prisma.subcategory.delete({
      where: { id },
    });
  }

  // Check if subcategory can be deleted (no expenses)
  async canDelete(id: string): Promise<boolean> {
    const expenseCount = await prisma.expense.count({
      where: { subcategoryId: id },
    });
    return expenseCount === 0;
  }

  // Delete all subcategories for a category
  async deleteAllForCategory(categoryId: string): Promise<number> {
    const result = await prisma.subcategory.deleteMany({
      where: { categoryId },
    });
    return result.count;
  }
}

export const categoryRepository = new CategoryRepository();
export const subcategoryRepository = new SubcategoryRepository();
