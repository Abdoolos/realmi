import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { reportService } from '../../../src/server/services/reportService';
import { pdfGenerator } from '../../../src/server/services/pdfGenerator';

// Validation schemas
const MonthlyReportSchema = z.object({
  year: z.number().int().min(2020).max(2050),
  month: z.number().int().min(1).max(12),
  userId: z.string().optional(),
  familyId: z.string().optional(),
  format: z.enum(['json', 'pdf']).optional().default('json'),
});

const YearlyReportSchema = z.object({
  year: z.number().int().min(2020).max(2050),
  userId: z.string().optional(),
  familyId: z.string().optional(),
  format: z.enum(['json', 'pdf']).optional().default('json'),
});

const CategoryReportSchema = z.object({
  categoryId: z.string().min(1, 'معرف الفئة مطلوب'),
  startDate: z.string().datetime('تاريخ البداية غير صحيح'),
  endDate: z.string().datetime('تاريخ النهاية غير صحيح'),
  userId: z.string().optional(),
  familyId: z.string().optional(),
  format: z.enum(['json', 'pdf']).optional().default('json'),
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

// GET /api/reports - Get various types of reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');

    if (!reportType) {
      return errorResponse('نوع التقرير مطلوب. استخدم: monthly, yearly, أو category');
    }

    switch (reportType) {
      case 'monthly':
        return await handleMonthlyReport(searchParams);
      case 'yearly':
        return await handleYearlyReport(searchParams);
      case 'category':
        return await handleCategoryReport(searchParams);
      default:
        return errorResponse('نوع تقرير غير مدعوم. الأنواع المتاحة: monthly, yearly, category');
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return errorResponse('خطأ في إنشاء التقرير', 'REPORT_ERROR', 500);
  }
}

// Handle monthly report generation
async function handleMonthlyReport(searchParams: URLSearchParams) {
  const queryParams = Object.fromEntries(searchParams.entries());
  
  // Convert string numbers to integers
  const processedParams = { ...queryParams };
  if (processedParams.year) processedParams.year = parseInt(processedParams.year as string) as any;
  if (processedParams.month) processedParams.month = parseInt(processedParams.month as string) as any;

  const validationResult = MonthlyReportSchema.safeParse(processedParams);
  if (!validationResult.success) {
    return errorResponse(
      'معاملات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
    );
  }

  const { year, month, userId, familyId, format } = validationResult.data;

  try {
    const reportData = await reportService.generateMonthlyReport(year, month, userId, familyId);

    if (format === 'pdf') {
      const pdfBuffer = await pdfGenerator.generateMonthlyReportPDF(reportData);
      
      return new NextResponse(pdfBuffer as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="monthly-report-${year}-${month}.pdf"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
      });
    }

    return successResponse({
      report: reportData,
      metadata: {
        type: 'monthly',
        generatedAt: new Date().toISOString(),
        period: `${year}-${month.toString().padStart(2, '0')}`,
      }
    });
  } catch (error) {
    console.error('Error generating monthly report:', error);
    return errorResponse('خطأ في إنشاء التقرير الشهري', 'MONTHLY_REPORT_ERROR', 500);
  }
}

// Handle yearly report generation
async function handleYearlyReport(searchParams: URLSearchParams) {
  const queryParams = Object.fromEntries(searchParams.entries());
  
  // Convert string numbers to integers
  const processedParams2 = { ...queryParams };
  if (processedParams2.year) processedParams2.year = parseInt(processedParams2.year as string) as any;

  const validationResult = YearlyReportSchema.safeParse(processedParams2);
  if (!validationResult.success) {
    return errorResponse(
      'معاملات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
    );
  }

  const { year, userId, familyId, format } = validationResult.data;

  try {
    const reportData = await reportService.generateYearlyReport(year, userId, familyId);

    if (format === 'pdf') {
      const pdfBuffer = await pdfGenerator.generateYearlyReportPDF(reportData);
      
      return new NextResponse(pdfBuffer as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="yearly-report-${year}.pdf"`,
          'Content-Length': pdfBuffer.length.toString(),
        },
      });
    }

    return successResponse({
      report: reportData,
      metadata: {
        type: 'yearly',
        generatedAt: new Date().toISOString(),
        period: year.toString(),
      }
    });
  } catch (error) {
    console.error('Error generating yearly report:', error);
    return errorResponse('خطأ في إنشاء التقرير السنوي', 'YEARLY_REPORT_ERROR', 500);
  }
}

// Handle category report generation
async function handleCategoryReport(searchParams: URLSearchParams) {
  const queryParams = Object.fromEntries(searchParams.entries());

  const validationResult = CategoryReportSchema.safeParse(queryParams);
  if (!validationResult.success) {
    return errorResponse(
      'معاملات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
    );
  }

  const { categoryId, startDate, endDate, userId, familyId, format } = validationResult.data;

  // Validate date range
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    return errorResponse('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
  }

  // Check if date range is not too large (max 2 years)
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 730) {
    return errorResponse('نطاق التاريخ كبير جداً. الحد الأقصى سنتان');
  }

  try {
    const reportData = await reportService.generateCategoryReport(
      categoryId, start, end, userId, familyId
    );

    if (format === 'pdf') {
      // For category reports, we'll generate a simple PDF
      // In a real application, you might want to create a specific template for category reports
      return errorResponse('تصدير PDF للفئات غير متاح حالياً', 'PDF_NOT_SUPPORTED', 501);
    }

    return successResponse({
      report: reportData,
      metadata: {
        type: 'category',
        generatedAt: new Date().toISOString(),
        period: `${startDate.split('T')[0]} to ${endDate.split('T')[0]}`,
        categoryId,
      }
    });
  } catch (error) {
    console.error('Error generating category report:', error);
    
    if (error instanceof Error && error.message === 'Category not found') {
      return errorResponse('الفئة غير موجودة', 'CATEGORY_NOT_FOUND', 404);
    }
    
    return errorResponse('خطأ في إنشاء تقرير الفئة', 'CATEGORY_REPORT_ERROR', 500);
  }
}
