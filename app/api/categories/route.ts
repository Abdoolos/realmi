import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { categoryRepository } from '../../../src/server/repositories/categoryRepository';

// Validation schemas
const CreateCategorySchema = z.object({
  name: z.string().min(1, 'اسم الفئة مطلوب').max(100, 'اسم الفئة طويل جداً'),
  icon: z.string().min(1, 'أيقونة الفئة مطلوبة'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'لون الفئة يجب أن يكون بصيغة hex صحيحة'),
  isDefault: z.boolean().optional().default(false),
  familyId: z.string().optional(),
});

const GetCategoriesSchema = z.object({
  familyId: z.string().optional(),
  isDefault: z.string().optional().transform(val => 
    val === 'true' ? true : val === 'false' ? false : undefined
  ),
  name: z.string().optional(),
  includeExpenseCounts: z.string().optional().transform(val => val === 'true'),
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

// GET /api/categories - Get categories with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validationResult = GetCategoriesSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return errorResponse(
        'معاملات البحث غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const {
      familyId,
      isDefault,
      name,
      includeExpenseCounts,
      startDate,
      endDate,
    } = validationResult.data;

    let categories;

    // If familyId is provided, get family categories (includes defaults)
    if (familyId) {
      categories = await categoryRepository.getFamilyCategories(familyId);
    } else {
      // Build filters for general search
      const filters = {
        ...(familyId !== undefined && { familyId }),
        ...(isDefault !== undefined && { isDefault }),
        ...(name && { name }),
      };

      categories = await categoryRepository.findMany(filters);
    }

    // If expense counts are requested and date range is provided
    if (includeExpenseCounts && startDate && endDate) {
      const categoriesWithCounts = await categoryRepository.getCategoriesWithExpenseCounts(
        new Date(startDate),
        new Date(endDate),
        familyId
      );

      return successResponse({
        categories: categoriesWithCounts,
        includesExpenseCounts: true,
        period: { startDate, endDate }
      });
    }

    return successResponse({
      categories,
      includesExpenseCounts: false
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse('خطأ في جلب الفئات', 'FETCH_ERROR', 500);
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = CreateCategorySchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        'بيانات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const { name, icon, color, isDefault, familyId } = validationResult.data;

    // Check if category name already exists for this family
    const existingCategories = familyId 
      ? await categoryRepository.getFamilyCategories(familyId)
      : await categoryRepository.findMany({ isDefault: true });

    const nameExists = existingCategories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );

    if (nameExists) {
      return errorResponse(
        'اسم الفئة موجود بالفعل',
        'DUPLICATE_NAME',
        409
      );
    }

    // Create category
    const category = await categoryRepository.create({
      name,
      icon,
      color,
      isDefault,
      familyId: familyId || null,
    });

    // Get category with details for response
    const categoryWithDetails = await categoryRepository.findById(category.id);

    return successResponse({ category: categoryWithDetails }, 201);

  } catch (error) {
    console.error('Error creating category:', error);
    return errorResponse('خطأ في إنشاء الفئة', 'CREATE_ERROR', 500);
  }
}
