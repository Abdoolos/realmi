import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { expenseRepository } from '../../../../src/server/repositories/expenseRepository';
import { budgetService } from '../../../../src/server/services/budgetService';

// Validation schema for updating expense
const UpdateExpenseSchema = z.object({
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر').optional(),
  description: z.string().min(1, 'الوصف مطلوب').max(255, 'الوصف طويل جداً').optional(),
  categoryId: z.string().min(1, 'الفئة مطلوبة').optional(),
  subcategoryId: z.string().optional().nullable(),
  date: z.string().datetime('تاريخ غير صحيح').optional(),
  notes: z.string().max(500, 'الملاحظات طويلة جداً').optional().nullable(),
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

// GET /api/expenses/[id] - Get expense by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return errorResponse('معرف المصروف مطلوب', 'MISSING_ID');
    }

    const expense = await expenseRepository.findById(id);

    if (!expense) {
      return errorResponse('المصروف غير موجود', 'NOT_FOUND', 404);
    }

    return successResponse({ expense });

  } catch (error) {
    console.error('Error fetching expense:', error);
    return errorResponse('خطأ في جلب المصروف', 'FETCH_ERROR', 500);
  }
}

// PUT /api/expenses/[id] - Update expense
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return errorResponse('معرف المصروف مطلوب', 'MISSING_ID');
    }

    // Check if expense exists
    const existingExpense = await expenseRepository.findById(id);
    if (!existingExpense) {
      return errorResponse('المصروف غير موجود', 'NOT_FOUND', 404);
    }

    const body = await request.json();

    // Validate request body
    const validationResult = UpdateExpenseSchema.safeParse(body);
    if (!validationResult.success) {
      return errorResponse(
        'بيانات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const updateData = validationResult.data;

    // If amount or category is being changed, check budget
    let budgetValidation: any = { allowed: true };
    if (updateData.amount || updateData.categoryId) {
      const newAmount = updateData.amount || Number(existingExpense.amount);
      const newCategoryId = updateData.categoryId || existingExpense.categoryId;

      budgetValidation = await budgetService.validateExpenseAgainstBudget(
        newAmount,
        newCategoryId,
        existingExpense.userId,
        existingExpense.familyId || undefined
      );

      if (!budgetValidation.allowed) {
        return errorResponse(
          budgetValidation.warning || 'هذا التعديل سيتجاوز حد الميزانية',
          'BUDGET_EXCEEDED',
          400
        );
      }
    }

    // Prepare update data
    const dataToUpdate: any = {};
    
    if (updateData.amount !== undefined) dataToUpdate.amount = updateData.amount;
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
    if (updateData.categoryId !== undefined) dataToUpdate.categoryId = updateData.categoryId;
    if (updateData.subcategoryId !== undefined) dataToUpdate.subcategoryId = updateData.subcategoryId;
    if (updateData.date !== undefined) dataToUpdate.date = new Date(updateData.date);
    if (updateData.notes !== undefined) dataToUpdate.notes = updateData.notes;

    // Update expense
    const updatedExpense = await expenseRepository.update(id, dataToUpdate);

    // Get expense with details for response
    const expenseWithDetails = await expenseRepository.findById(updatedExpense.id);

    // Prepare response with budget warning if applicable
    const responseData = {
      expense: expenseWithDetails,
      ...(budgetValidation.warning && {
        budgetWarning: budgetValidation.warning,
        budgetInfo: budgetValidation.budgetInfo,
      }),
    };

    return successResponse(responseData);

  } catch (error) {
    console.error('Error updating expense:', error);
    return errorResponse('خطأ في تعديل المصروف', 'UPDATE_ERROR', 500);
  }
}

// DELETE /api/expenses/[id] - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return errorResponse('معرف المصروف مطلوب', 'MISSING_ID');
    }

    // Check if expense exists
    const existingExpense = await expenseRepository.findById(id);
    if (!existingExpense) {
      return errorResponse('المصروف غير موجود', 'NOT_FOUND', 404);
    }

    // Delete expense
    await expenseRepository.delete(id);

    return successResponse({ 
      message: 'تم حذف المصروف بنجاح',
      deletedExpense: {
        id: existingExpense.id,
        description: existingExpense.description,
        amount: existingExpense.amount,
      }
    });

  } catch (error) {
    console.error('Error deleting expense:', error);
    return errorResponse('خطأ في حذف المصروف', 'DELETE_ERROR', 500);
  }
}
