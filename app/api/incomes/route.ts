import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { incomeRepository } from '../../../src/server/repositories/incomeRepository';

// Validation schemas
const CreateIncomeSchema = z.object({
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  type: z.enum(['salary', 'freelance', 'investment', 'other'], {
    errorMap: () => ({ message: 'نوع الدخل يجب أن يكون: راتب، عمل حر، استثمار، أو أخرى' })
  }),
  description: z.string().min(1, 'الوصف مطلوب').max(255, 'الوصف طويل جداً'),
  date: z.string().datetime('تاريخ غير صحيح'),
  userId: z.string().min(1, 'معرف المستخدم مطلوب'),
  familyId: z.string().optional(),
});

const GetIncomesSchema = z.object({
  type: z.enum(['salary', 'freelance', 'investment', 'other']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxAmount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
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

// GET /api/incomes - Get incomes with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validationResult = GetIncomesSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return errorResponse(
        'معاملات البحث غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const {
      type,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      userId,
      familyId,
    } = validationResult.data;

    // Build filters
    const filters = {
      userId,
      familyId,
      type,
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      minAmount,
      maxAmount,
    };

    // Get incomes
    const incomes = await incomeRepository.findMany(filters);

    // Calculate totals by type
    const totalsByType = await incomeRepository.getTotalByType(
      startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1),
      endDate ? new Date(endDate) : new Date(),
      userId,
      familyId
    );

    // Calculate total for period
    const totalForPeriod = await incomeRepository.getTotalForPeriod(
      startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1),
      endDate ? new Date(endDate) : new Date(),
      userId,
      familyId
    );

    return successResponse({
      incomes,
      summary: {
        totalForPeriod,
        totalsByType,
        count: incomes.length,
      }
    });

  } catch (error) {
    console.error('Error fetching incomes:', error);
    return errorResponse('خطأ في جلب الدخل', 'FETCH_ERROR', 500);
  }
}

// POST /api/incomes - Create new income
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = CreateIncomeSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        'بيانات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const { amount, type, description, date, userId, familyId } = validationResult.data;

    // Create income
    const income = await incomeRepository.create({
      amount: amount as any,
      type,
      description,
      date: new Date(date),
      userId,
      familyId: familyId || null,
    });

    // Get income with details for response
    const incomeWithDetails = await incomeRepository.findById(income.id);

    return successResponse({ income: incomeWithDetails }, 201);

  } catch (error) {
    console.error('Error creating income:', error);
    return errorResponse('خطأ في إنشاء الدخل', 'CREATE_ERROR', 500);
  }
}
