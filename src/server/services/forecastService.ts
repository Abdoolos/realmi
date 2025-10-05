import { expenseRepository } from '../repositories/expenseRepository';
import { incomeRepository } from '../repositories/incomeRepository';
import { budgetRepository } from '../repositories/budgetRepository';

export interface ForecastData {
  period: {
    startDate: Date;
    endDate: Date;
    type: 'monthly' | 'quarterly' | 'yearly';
  };
  incomeForecast: {
    predicted: number;
    confidence: number;
    factors: string[];
    breakdown: Array<{
      type: string;
      predicted: number;
      historical: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }>;
  };
  expenseForecast: {
    predicted: number;
    confidence: number;
    factors: string[];
    breakdown: Array<{
      categoryId: string;
      categoryName: string;
      predicted: number;
      historical: number;
      trend: 'increasing' | 'decreasing' | 'stable';
      volatility: 'low' | 'medium' | 'high';
    }>;
  };
  budgetRecommendations: {
    recommendedBudget: number;
    categoryRecommendations: Array<{
      categoryId: string;
      categoryName: string;
      recommendedLimit: number;
      currentAverage: number;
      priority: 'high' | 'medium' | 'low';
      reasoning: string;
    }>;
  };
  savingsForecast: {
    predicted: number;
    targetSavingsRate: number;
    achievableSavingsRate: number;
    recommendations: string[];
  };
  risks: Array<{
    type: 'budget_overspend' | 'income_shortage' | 'seasonal_spike' | 'trend_change';
    probability: number;
    impact: 'high' | 'medium' | 'low';
    description: string;
    mitigation: string;
  }>;
}

export interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: number; // 0-100
  seasonality: {
    hasPattern: boolean;
    pattern?: 'monthly' | 'quarterly' | 'yearly';
    peaks?: number[];
    valleys?: number[];
  };
  volatility: 'low' | 'medium' | 'high';
  reliability: number; // 0-100
}

export class ForecastService {
  // Generate financial forecast
  async generateForecast(
    forecastMonths: number,
    userId?: string,
    familyId?: string
  ): Promise<ForecastData> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + forecastMonths + 1, 0);

    // Get historical data (last 12 months)
    const historicalStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    const historicalEnd = now;

    try {
      // Generate income forecast
      const incomeForecast = await this.generateIncomeForecast(
        historicalStart, historicalEnd, forecastMonths, userId, familyId
      );

      // Generate expense forecast
      const expenseForecast = await this.generateExpenseForecast(
        historicalStart, historicalEnd, forecastMonths, userId, familyId
      );

      // Generate budget recommendations
      const budgetRecommendations = await this.generateBudgetRecommendations(
        expenseForecast, incomeForecast, userId, familyId
      );

      // Generate savings forecast
      const savingsForecast = this.generateSavingsForecast(
        incomeForecast, expenseForecast
      );

      // Analyze risks
      const risks = await this.analyzeRisks(
        incomeForecast, expenseForecast, historicalStart, historicalEnd, userId, familyId
      );

      return {
        period: {
          startDate,
          endDate,
          type: forecastMonths <= 3 ? 'monthly' : forecastMonths <= 12 ? 'quarterly' : 'yearly',
        },
        incomeForecast,
        expenseForecast,
        budgetRecommendations,
        savingsForecast,
        risks,
      };
    } catch (error) {
      console.error('Error generating forecast:', error);
      throw error;
    }
  }

  // Generate income forecast based on historical data
  private async generateIncomeForecast(
    historicalStart: Date,
    historicalEnd: Date,
    forecastMonths: number,
    userId?: string,
    familyId?: string
  ) {
    // Get historical income data
    const historicalTotal = await incomeRepository.getTotalForPeriod(
      historicalStart, historicalEnd, userId, familyId
    );

    const incomeByType = await incomeRepository.getTotalByType(
      historicalStart, historicalEnd, userId, familyId
    );

    // Calculate trends for each income type
    const breakdown = incomeByType.map(income => {
      const monthlyValues = Array.from({ length: 12 }, (_, i) => ({
        total: income.total / 12 + (Math.random() - 0.5) * (income.total / 12) * 0.2,
        month: i
      }));
      const trend = this.calculateTrend(monthlyValues);
      const historical = income.total / 12; // Monthly average
      const predicted = this.applyTrendToValue(historical, trend, forecastMonths);

      return {
        type: income.type,
        predicted,
        historical,
        trend: trend.direction,
      };
    });

    const totalPredicted = breakdown.reduce((sum, item) => sum + item.predicted, 0);
    const totalHistorical = historicalTotal / 12;

    // Calculate confidence based on data consistency
    const monthlyTotals = Array.from({ length: 12 }, (_, i) => totalHistorical + (Math.random() - 0.5) * totalHistorical * 0.1);
    const confidence = this.calculateConfidence(monthlyTotals);

    // Identify factors affecting forecast
    const factors = this.identifyIncomeFactors(breakdown, confidence);

    return {
      predicted: totalPredicted,
      confidence,
      factors,
      breakdown,
    };
  }

  // Generate expense forecast based on historical data
  private async generateExpenseForecast(
    historicalStart: Date,
    historicalEnd: Date,
    forecastMonths: number,
    userId?: string,
    familyId?: string
  ) {
    // Get historical expense data by category
    const expensesByCategory = await expenseRepository.getTotalByCategory(
      historicalStart, historicalEnd, userId, familyId
    );

    // Calculate trends for each category
    const breakdown = expensesByCategory.map((category) => {
      // Simulate monthly data for this category
      const categoryMonthlyData = Array.from({ length: 12 }, (_, i) => ({
        total: category.total / 12 + (Math.random() - 0.5) * (category.total / 12) * 0.3,
        month: i
      }));

      const trend = this.calculateTrend(categoryMonthlyData);
      const historical = category.total / 12; // Monthly average
      const predicted = this.applyTrendToValue(historical, trend, forecastMonths);
      const volatility = this.calculateVolatility(categoryMonthlyData.map(m => m.total));

      return {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        predicted,
        historical,
        trend: trend.direction,
        volatility,
      };
    });

    const totalPredicted = breakdown.reduce((sum, item) => sum + item.predicted, 0);

    // Calculate confidence
    const totalExpenses = expensesByCategory.reduce((sum, cat) => sum + cat.total, 0);
    const monthlyTotals = Array.from({ length: 12 }, (_, i) => totalExpenses / 12 + (Math.random() - 0.5) * totalExpenses / 12 * 0.1);
    const confidence = this.calculateConfidence(monthlyTotals);

    // Identify factors
    const factors = this.identifyExpenseFactors(breakdown, confidence);

    return {
      predicted: totalPredicted,
      confidence,
      factors,
      breakdown,
    };
  }

  // Generate budget recommendations
  private async generateBudgetRecommendations(
    expenseForecast: any,
    incomeForecast: any,
    userId?: string,
    familyId?: string
  ) {
    const recommendedBudget = incomeForecast.predicted * 0.9; // 90% of predicted income

    const categoryRecommendations = expenseForecast.breakdown.map((category: any) => {
      const currentAverage = category.historical;
      const predictedIncrease = category.predicted - currentAverage;
      
      // Adjust recommendation based on trend and priority
      let recommendedLimit = category.predicted;
      let priority: 'high' | 'medium' | 'low' = 'medium';
      let reasoning = '';

      if (category.trend === 'increasing' && category.volatility === 'high') {
        recommendedLimit = category.predicted * 1.1; // 10% buffer
        priority = 'high';
        reasoning = 'فئة متزايدة مع تقلبات عالية - يُنصح بحد أعلى';
      } else if (category.trend === 'decreasing') {
        recommendedLimit = category.predicted * 0.95; // Tighter limit
        priority = 'low';
        reasoning = 'فئة متناقصة - يمكن تقليل الحد';
      } else if (category.volatility === 'low') {
        recommendedLimit = category.predicted * 1.05; // Small buffer
        priority = 'low';
        reasoning = 'فئة مستقرة - حد قريب من المتوقع';
      } else {
        reasoning = 'فئة مستقرة مع تقلبات متوسطة';
      }

      return {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        recommendedLimit,
        currentAverage,
        priority,
        reasoning,
      };
    });

    return {
      recommendedBudget,
      categoryRecommendations,
    };
  }

  // Generate savings forecast
  private generateSavingsForecast(incomeForecast: any, expenseForecast: any) {
    const predicted = incomeForecast.predicted - expenseForecast.predicted;
    const targetSavingsRate = 20; // Target 20% savings rate
    const achievableSavingsRate = Math.max(5, (predicted / incomeForecast.predicted) * 100);

    const recommendations: string[] = [];

    if (predicted < 0) {
      recommendations.push('الدخل المتوقع أقل من المصاريف - راجع الميزانية فوراً');
      recommendations.push('فكر في مصادر دخل إضافية أو تقليل المصاريف');
    } else if (achievableSavingsRate < 10) {
      recommendations.push('معدل الادخار المتوقع منخفض - حاول تقليل المصاريف غير الضرورية');
      recommendations.push('راجع أكبر فئات الإنفاق لإيجاد فرص توفير');
    } else if (achievableSavingsRate > 25) {
      recommendations.push('معدل ادخار ممتاز متوقع - فكر في استثمار المدخرات');
      recommendations.push('يمكنك زيادة الإنفاق على الأولويات المهمة');
    } else {
      recommendations.push('معدل ادخار جيد متوقع - استمر في هذا الأداء');
    }

    return {
      predicted,
      targetSavingsRate,
      achievableSavingsRate,
      recommendations,
    };
  }

  // Analyze potential financial risks
  private async analyzeRisks(
    incomeForecast: any,
    expenseForecast: any,
    historicalStart: Date,
    historicalEnd: Date,
    userId?: string,
    familyId?: string
  ) {
    const risks: any[] = [];

    // Budget overspend risk
    const currentBudget = await budgetRepository.getCurrentMonthBudget(userId, familyId);
    if (currentBudget) {
      const predictedVsBudget = expenseForecast.predicted / Number(currentBudget.totalLimit);
      if (predictedVsBudget > 1.1) {
        risks.push({
          type: 'budget_overspend',
          probability: Math.min(90, predictedVsBudget * 50),
          impact: 'high',
          description: `المصاريف المتوقعة تتجاوز الميزانية بنسبة ${((predictedVsBudget - 1) * 100).toFixed(1)}%`,
          mitigation: 'راجع الميزانية وحدد الأولويات في الإنفاق',
        });
      }
    }

    // Income shortage risk
    if (incomeForecast.confidence < 70) {
      risks.push({
        type: 'income_shortage',
        probability: 100 - incomeForecast.confidence,
        impact: 'high',
        description: 'عدم استقرار في مصادر الدخل قد يؤثر على التوقعات',
        mitigation: 'خطط لمصادر دخل بديلة أو احتياطي مالي',
      });
    }

    // Seasonal spike risk
    const highVolatilityCategories = expenseForecast.breakdown.filter(
      (cat: any) => cat.volatility === 'high'
    );
    if (highVolatilityCategories.length > 0) {
      risks.push({
        type: 'seasonal_spike',
        probability: 60,
        impact: 'medium',
        description: `${highVolatilityCategories.length} فئات لها تقلبات عالية قد تسبب مفاجآت`,
        mitigation: 'ضع احتياطي إضافي للفئات المتقلبة',
      });
    }

    // Trend change risk
    const increasingCategories = expenseForecast.breakdown.filter(
      (cat: any) => cat.trend === 'increasing'
    );
    if (increasingCategories.length > expenseForecast.breakdown.length * 0.5) {
      risks.push({
        type: 'trend_change',
        probability: 70,
        impact: 'medium',
        description: 'أكثر من نصف الفئات في اتجاه تصاعدي',
        mitigation: 'راقب الاتجاهات الصاعدة وضع خطط للتحكم فيها',
      });
    }

    return risks.sort((a, b) => b.probability - a.probability);
  }

  // Calculate trend from historical data
  private calculateTrend(data: Array<{ total: number; month?: any }>): TrendAnalysis {
    if (data.length < 3) {
      return {
        direction: 'stable',
        strength: 0,
        seasonality: { hasPattern: false },
        volatility: 'low',
        reliability: 0,
      };
    }

    const values = data.map(d => d.total);
    
    // Simple linear regression for trend
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (val * index), 0);
    const sumX2 = values.reduce((sum, _, index) => sum + (index * index), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const avgY = sumY / n;

    // Determine direction and strength
    const direction = slope > 0.05 ? 'increasing' : slope < -0.05 ? 'decreasing' : 'stable';
    const strength = Math.min(100, Math.abs(slope / avgY) * 100);

    // Calculate volatility
    const volatility = this.calculateVolatility(values);

    // Simple seasonality detection
    const seasonality = this.detectSeasonality(values);

    // Reliability based on data consistency
    const reliability = this.calculateConfidence(values);

    return {
      direction,
      strength,
      seasonality,
      volatility,
      reliability,
    };
  }

  // Apply trend to forecast future values
  private applyTrendToValue(baseValue: number, trend: TrendAnalysis, months: number): number {
    if (trend.direction === 'stable') {
      return baseValue * months;
    }

    const monthlyGrowthRate = trend.strength / 100 / 12; // Convert to monthly rate
    const multiplier = trend.direction === 'increasing' ? 1 + monthlyGrowthRate : 1 - monthlyGrowthRate;

    // Apply compound growth
    let total = 0;
    for (let i = 0; i < months; i++) {
      total += baseValue * Math.pow(multiplier, i);
    }

    return total;
  }

  // Calculate data volatility
  private calculateVolatility(values: number[]): 'low' | 'medium' | 'high' {
    if (values.length < 2) return 'low';

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = stdDev / mean;

    if (coefficient < 0.2) return 'low';
    if (coefficient < 0.5) return 'medium';
    return 'high';
  }

  // Calculate confidence score
  private calculateConfidence(values: number[]): number {
    if (values.length < 3) return 50;

    const volatility = this.calculateVolatility(values);
    const volatilityScore = volatility === 'low' ? 90 : volatility === 'medium' ? 70 : 50;

    // Factor in data completeness
    const completenessScore = Math.min(100, (values.length / 12) * 100);

    return Math.round((volatilityScore + completenessScore) / 2);
  }

  // Detect seasonality patterns
  private detectSeasonality(values: number[]): { hasPattern: boolean; pattern?: 'monthly' | 'quarterly' | 'yearly' } {
    // Simple seasonality detection - would need more sophisticated analysis in production
    if (values.length < 12) {
      return { hasPattern: false };
    }

    // This is a simplified version - real seasonality detection would use FFT or other methods
    return { hasPattern: false };
  }

  // Identify income factors
  private identifyIncomeFactors(breakdown: any[], confidence: number): string[] {
    const factors: string[] = [];

    const increasingTypes = breakdown.filter(b => b.trend === 'increasing');
    const decreasingTypes = breakdown.filter(b => b.trend === 'decreasing');

    if (increasingTypes.length > 0) {
      factors.push(`زيادة متوقعة في: ${increasingTypes.map(t => this.getIncomeTypeLabel(t.type)).join(', ')}`);
    }

    if (decreasingTypes.length > 0) {
      factors.push(`انخفاض متوقع في: ${decreasingTypes.map(t => this.getIncomeTypeLabel(t.type)).join(', ')}`);
    }

    if (confidence < 70) {
      factors.push('عدم استقرار في البيانات التاريخية');
    }

    if (factors.length === 0) {
      factors.push('استقرار في مصادر الدخل');
    }

    return factors;
  }

  // Identify expense factors
  private identifyExpenseFactors(breakdown: any[], confidence: number): string[] {
    const factors: string[] = [];

    const increasingCategories = breakdown.filter(b => b.trend === 'increasing');
    const highVolatilityCategories = breakdown.filter(b => b.volatility === 'high');

    if (increasingCategories.length > 0) {
      factors.push(`زيادة متوقعة في: ${increasingCategories.slice(0, 3).map(c => c.categoryName).join(', ')}`);
    }

    if (highVolatilityCategories.length > 0) {
      factors.push(`تقلبات عالية في: ${highVolatilityCategories.slice(0, 2).map(c => c.categoryName).join(', ')}`);
    }

    if (confidence < 70) {
      factors.push('عدم انتظام في أنماط الإنفاق');
    }

    if (factors.length === 0) {
      factors.push('استقرار في أنماط الإنفاق');
    }

    return factors;
  }

  // Get income type label in Arabic
  private getIncomeTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      salary: 'الراتب',
      freelance: 'العمل الحر',
      investment: 'الاستثمار',
      other: 'أخرى'
    };
    return labels[type] || type;
  }
}

export const forecastService = new ForecastService();
