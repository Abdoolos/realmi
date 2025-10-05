import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { budgetRepository } from '../../../src/server/repositories/budgetRepository';
import { budgetService } from '../../../src/server/services/budgetService';

// Validation schemas
const CategoryBudgetSchema = z.object({
  categoryId: z.string().min(1, 'معرف الفئة مطلوب'),
  limit: z.number().positive('حد الفئة يجب أن يكون أكبر من صفر'),
});

const CreateBudgetSchema = z.object({
  name: z.string().min(1, 'اسم الميزانية مطلوب').max(255, 'اسم الميزانية طويل جداً'),
  totalLimit: z.number().positive('الحد الإجمالي يجب أن يكون أكبر من صفر'),
  startDate: z.string().datetime('تاريخ البداية غير صحيح'),
  endDate: z.string().datetime('تاريخ النهاية غير صحيح'),
  userId: z.string().min(1, 'معرف المستخدم مطلوب'),
  familyId: z.string().optional(),
  eventId: z.string().optional(),
  categoryBudgets: z.array(CategoryBudgetSchema).min(1, 'يجب إضافة فئة واحدة على الأقل'),
});

const GetBudgetsSchema = z.object({
  userId: z.string().optional(),
  familyId: z.string().optional(),
  eventId: z.string().optional(),
  isActive: z.string().optional().transform(val => val === 'true'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Helper function for error responses
function errorResponse(message: string, code: string = 'VALIDATION_ERROR', status: number = 400) {
  return NextResponse.json({
    ok: false,
    code,
    message,
  }, { status });
}

// Helper function for success responses
function successResponse(data: any, status: number = 200) {
  return NextResponse.json({
    ok: true,
    data,
  }, { status });
}

// GET /api/budgets - Get budgets with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validationResult = GetBudgetsSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return errorResponse(
        'معاملات البحث غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const {
      userId,
      familyId,
      eventId,
      isActive,
      startDate,
      endDate,
    } = validationResult.data;

    // Build filters
    const filters = {
      userId,
      familyId,
      eventId,
      isActive,
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    };

    // Get budgets
    const budgets = await budgetRepository.findMany(filters);

    // Get budget summaries for each budget
    const budgetsWithSummaries = await Promise.all(
      budgets.map(async (budget) => {
        const summary = await budgetService.getBudgetAnalysis(budget.id);
        return {
          budget,
          summary,
        };
      })
    );

    // Get budget alerts if user/family is specified
    let alerts: any[] = [];
    if (userId || familyId) {
      alerts = await budgetService.checkBudgetAlerts(userId, familyId);
    }

    return successResponse({
      budgets: budgetsWithSummaries,
      alerts,
      count: budgets.length,
    });

  } catch (error) {
    console.error('Error fetching budgets:', error);
    return errorResponse('خطأ في جلب الميزانيات', 'FETCH_ERROR', 500);
  }
}

// POST /api/budgets - Create new budget
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = CreateBudgetSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        'بيانات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const {
      name,
      totalLimit,
      startDate,
      endDate,
      userId,
      familyId,
      eventId,
      categoryBudgets,
    } = validationResult.data;

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return errorResponse(
        'تاريخ البداية يجب أن يكون قبل تاريخ النهاية',
        'INVALID_DATE_RANGE'
      );
    }

    // Validate that category budget limits don't exceed total limit
    const categoryLimitsSum = categoryBudgets.reduce((sum, cb) => sum + cb.limit, 0);
    if (categoryLimitsSum > totalLimit) {
      return errorResponse(
        `مجموع حدود الفئات (${categoryLimitsSum}) يتجاوز الحد الإجمالي (${totalLimit})`,
        'CATEGORY_LIMITS_EXCEED_TOTAL'
      );
    }

    // Check for overlapping budgets
    const existingBudgets = await budgetRepository.findMany({
      userId,
      familyId,
      startDate: start,
      endDate: end,
    });

    const hasOverlap = existingBudgets.some(existing => {
      const existingStart = new Date(existing.startDate);
      const existingEnd = new Date(existing.endDate);
      return start < existingEnd && end > existingStart;
    });

    if (hasOverlap) {
      return errorResponse(
        'يوجد ميزانية أخرى تتداخل مع هذه الفترة الزمنية',
        'OVERLAPPING_BUDGET',
        409
      );
    }

    // Create budget with category budgets
    const budget = await budgetRepository.create(
      {
        name,
        totalLimit: totalLimit as any,
        startDate: start,
        endDate: end,
        userId,
        familyId: familyId || null,
        eventId: eventId || null,
      },
      categoryBudgets.map(cb => ({
        ...cb,
        limit: cb.limit as any
      }))
    );

    // Get budget summary
    const summary = await budgetService.getBudgetAnalysis(budget.id);

    return successResponse({
      budget,
      summary,
    }, 201);

  } catch (error) {
    console.error('Error creating budget:', error);
    return errorResponse('خطأ في إنشاء الميزانية', 'CREATE_ERROR', 500);
  }
}
