import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adviceService } from '../../../src/server/services/adviceService';
import { forecastService } from '../../../src/server/services/forecastService';

// Validation schemas
const AdviceRequestSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'category'], {
    errorMap: () => ({ message: 'نوع النصيحة يجب أن يكون: daily, weekly, monthly, أو category' })
  }),
  userId: z.string().optional(),
  familyId: z.string().optional(),
});

const MonthlyAdviceSchema = z.object({
  year: z.number().int().min(2020).max(2050),
  month: z.number().int().min(1).max(12),
  userId: z.string().optional(),
  familyId: z.string().optional(),
});

const CategoryAdviceSchema = z.object({
  categoryId: z.string().min(1, 'معرف الفئة مطلوب'),
  userId: z.string().optional(),
  familyId: z.string().optional(),
});

const ForecastRequestSchema = z.object({
  months: z.number().int().min(1).max(24).default(6),
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

// GET /api/advice - Get various types of advice
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adviceType = searchParams.get('type');

    if (!adviceType) {
      return errorResponse('نوع النصيحة مطلوب. استخدم: daily, weekly, monthly, أو category');
    }

    switch (adviceType) {
      case 'daily':
        return await handleDailyAdvice(searchParams);
      case 'weekly':
        return await handleWeeklyAdvice(searchParams);
      case 'monthly':
        return await handleMonthlyAdvice(searchParams);
      case 'category':
        return await handleCategoryAdvice(searchParams);
      default:
        return errorResponse('نوع نصيحة غير مدعوم. الأنواع المتاحة: daily, weekly, monthly, category');
    }
  } catch (error) {
    console.error('Error generating advice:', error);
    return errorResponse('خطأ في إنشاء النصائح', 'ADVICE_ERROR', 500);
  }
}

// Handle daily advice
async function handleDailyAdvice(searchParams: URLSearchParams) {
  const queryParams = Object.fromEntries(searchParams.entries());

  const validationResult = AdviceRequestSchema.safeParse(queryParams);
  if (!validationResult.success) {
    return errorResponse(
      'معاملات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
    );
  }

  const { userId, familyId } = validationResult.data;

  try {
    const advice = await adviceService.generateDailyAdvice(userId, familyId);

    return successResponse({
      advice,
      metadata: {
        type: 'daily',
        generatedAt: new Date().toISOString(),
        count: advice.length,
      }
    });
  } catch (error) {
    console.error('Error generating daily advice:', error);
    return errorResponse('خطأ في إنشاء النصائح اليومية', 'DAILY_ADVICE_ERROR', 500);
  }
}

// Handle weekly advice
async function handleWeeklyAdvice(searchParams: URLSearchParams) {
  const queryParams = Object.fromEntries(searchParams.entries());

  const validationResult = AdviceRequestSchema.safeParse(queryParams);
  if (!validationResult.success) {
    return errorResponse(
      'معاملات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
    );
  }

  const { userId, familyId } = validationResult.data;

  try {
    const advice = await adviceService.generateWeeklyAdvice(userId, familyId);

    return successResponse({
      advice,
      metadata: {
        type: 'weekly',
        generatedAt: new Date().toISOString(),
        weekPeriod: {
          start: advice.weekStart.toISOString(),
          end: advice.weekEnd.toISOString(),
        },
      }
    });
  } catch (error) {
    console.error('Error generating weekly advice:', error);
    return errorResponse('خطأ في إنشاء النصائح الأسبوعية', 'WEEKLY_ADVICE_ERROR', 500);
  }
}

// Handle monthly advice
async function handleMonthlyAdvice(searchParams: URLSearchParams) {
  const queryParams = Object.fromEntries(searchParams.entries());
  
  // Convert string numbers to integers
  const processedParams = { ...queryParams };
  if (processedParams.year) processedParams.year = parseInt(processedParams.year as string) as any;
  if (processedParams.month) processedParams.month = parseInt(processedParams.month as string) as any;

  const validationResult = MonthlyAdviceSchema.safeParse(processedParams);
  if (!validationResult.success) {
    return errorResponse(
      'معاملات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
    );
  }

  const { year, month, userId, familyId } = validationResult.data;

  try {
    const advice = await adviceService.generateMonthlyAdvice(year, month, userId, familyId);

    return successResponse({
      advice,
      metadata: {
        type: 'monthly',
        generatedAt: new Date().toISOString(),
        period: `${year}-${month.toString().padStart(2, '0')}`,
        score: advice.overallScore,
      }
    });
  } catch (error) {
    console.error('Error generating monthly advice:', error);
    return errorResponse('خطأ في إنشاء النصائح الشهرية', 'MONTHLY_ADVICE_ERROR', 500);
  }
}

// Handle category advice
async function handleCategoryAdvice(searchParams: URLSearchParams) {
  const queryParams = Object.fromEntries(searchParams.entries());

  const validationResult = CategoryAdviceSchema.safeParse(queryParams);
  if (!validationResult.success) {
    return errorResponse(
      'معاملات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
    );
  }

  const { categoryId, userId, familyId } = validationResult.data;

  try {
    const advice = await adviceService.generateCategoryAdvice(categoryId, userId, familyId);

    return successResponse({
      advice,
      metadata: {
        type: 'category',
        generatedAt: new Date().toISOString(),
        categoryId,
        count: advice.length,
      }
    });
  } catch (error) {
    console.error('Error generating category advice:', error);
    
    if (error instanceof Error && error.message === 'Category not found') {
      return errorResponse('الفئة غير موجودة', 'CATEGORY_NOT_FOUND', 404);
    }
    
    return errorResponse('خطأ في إنشاء نصائح الفئة', 'CATEGORY_ADVICE_ERROR', 500);
  }
}
