import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { forecastService } from '../../../src/server/services/forecastService';

// Validation schema
const ForecastRequestSchema = z.object({
  months: z.string().optional().transform(val => val ? parseInt(val) : 6),
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

// GET /api/forecasts - Generate financial forecast
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validationResult = ForecastRequestSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return errorResponse(
        'معاملات غير صحيحة: ' + validationResult.error.errors.map(e => e.message).join(', ')
      );
    }

    const { months, userId, familyId } = validationResult.data;

    // Validate months range
    if (months < 1 || months > 24) {
      return errorResponse('عدد الأشهر يجب أن يكون بين 1 و 24');
    }

    try {
      const forecast = await forecastService.generateForecast(months, userId, familyId);

      return successResponse({
        forecast,
        metadata: {
          generatedAt: new Date().toISOString(),
          forecastPeriod: {
            months,
            startDate: forecast.period.startDate,
            endDate: forecast.period.endDate,
            type: forecast.period.type,
          },
          confidence: {
            income: forecast.incomeForecast.confidence,
            expense: forecast.expenseForecast.confidence,
          },
          riskLevel: forecast.risks.length > 0 ? forecast.risks[0].impact : 'low',
        }
      });
    } catch (error) {
      console.error('Error generating forecast:', error);
      return errorResponse('خطأ في إنشاء التنبؤ المالي', 'FORECAST_ERROR', 500);
    }
  } catch (error) {
    console.error('Error processing forecast request:', error);
    return errorResponse('خطأ في معالجة طلب التنبؤ', 'REQUEST_ERROR', 500);
  }
}
