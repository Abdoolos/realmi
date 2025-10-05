import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { expenseRepository } from '../../../src/server/repositories/expenseRepository';
import { budgetService } from '../../../src/server/services/budgetService';

// Validation schemas
const CreateExpenseSchema = z.object({
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  description: z.string().min(1, 'الوصف مطلوب').max(255, 'الوصف طويل جداً'),
  categoryId: z.string().min(1, 'الفئة مطلوبة'),
  subcategoryId: z.string().optional(),
  date: z.string().datetime('تاريخ غير صحيح'),
  notes: z.string().max(500, 'الملاحظات طويلة جداً').optional(),
  userId: z.string().min(1, 'معرف المستخدم مطلوب'),
  familyId: z.string().optional(),
});

const GetExpensesSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxAmount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  orderBy: z.enum(['date', 'amount', 'createdAt']).optional().default('date'),
  orderDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  userId: z.string().optional(),
  familyId: z.string().optional(),
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

// GET /api/expenses - Get expenses with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validationResult = GetExpensesSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return errorResponse(
        'معاملات البحث غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const {
      page,
      limit,
      categoryId,
      subcategoryId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      orderBy,
      orderDirection,
      userId,
      familyId,
    } = validationResult.data;

    // Build filters
    const filters = {
      userId,
      familyId,
      categoryId,
      subcategoryId,
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      minAmount,
      maxAmount,
    };

    // Get expenses
    const result = await expenseRepository.findMany(filters, {
      page,
      limit: Math.min(limit, 100), // Max 100 items per page
      orderBy,
      orderDirection,
    });

    return successResponse(result);

  } catch (error) {
    console.error('Error fetching expenses:', error);
    return errorResponse('خطأ في جلب المصاريف', 'FETCH_ERROR', 500);
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = CreateExpenseSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        'بيانات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const { amount, description, categoryId, subcategoryId, date, notes, userId, familyId } = validationResult.data;

    // Check budget before creating expense
    const budgetValidation = await budgetService.validateExpenseAgainstBudget(
      amount,
      categoryId,
      userId,
      familyId
    );

    if (!budgetValidation.allowed) {
      return errorResponse(
        budgetValidation.warning || 'هذا المصروف سيتجاوز حد الميزانية',
        'BUDGET_EXCEEDED',
        400
      );
    }

    // Create expense
    const expense = await expenseRepository.create({
      amount: amount as any,
      description,
      categoryId,
      subcategoryId: subcategoryId || null,
      date: new Date(date),
      notes: notes || null,
      userId,
      familyId: familyId || null,
      billId: null,
    });

    // Get expense with details for response
    const expenseWithDetails = await expenseRepository.findById(expense.id);

    // Prepare response with budget warning if applicable
    const responseData = {
      expense: expenseWithDetails,
      ...(budgetValidation.warning && {
        budgetWarning: budgetValidation.warning,
        budgetInfo: budgetValidation.budgetInfo,
      }),
    };

    return successResponse(responseData, 201);

  } catch (error) {
    console.error('Error creating expense:', error);
    return errorResponse('خطأ في إنشاء المصروف', 'CREATE_ERROR', 500);
  }
}
