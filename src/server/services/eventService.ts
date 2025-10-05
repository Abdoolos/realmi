import { expenseRepository } from '../repositories/expenseRepository';
import { budgetRepository } from '../repositories/budgetRepository';
import { categoryRepository } from '../repositories/categoryRepository';

export interface EventData {
  id: string;
  name: string;
  description?: string;
  type: 'wedding' | 'vacation' | 'ramadan' | 'eid' | 'birthday' | 'graduation' | 'other';
  startDate: Date;
  endDate: Date;
  estimatedBudget: number;
  actualSpent: number;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  userId: string;
  familyId?: string;
  categories: Array<{
    categoryId: string;
    categoryName: string;
    estimatedAmount: number;
    actualAmount: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  milestones: Array<{
    id: string;
    name: string;
    targetDate: Date;
    estimatedCost: number;
    actualCost: number;
    status: 'pending' | 'in_progress' | 'completed';
    description?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventBudgetAnalysis {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  isOverBudget: boolean;
  daysRemaining: number;
  dailyBudgetRemaining: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    budgeted: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
    status: 'on-track' | 'warning' | 'over-budget';
  }>;
  recommendations: string[];
  alerts: Array<{
    type: 'budget_warning' | 'deadline_approaching' | 'milestone_due';
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface EventTemplate {
  type: string;
  name: string;
  description: string;
  estimatedDuration: number; // days
  categories: Array<{
    categoryName: string;
    estimatedPercentage: number;
    priority: 'high' | 'medium' | 'low';
    description: string;
  }>;
  milestones: Array<{
    name: string;
    daysBeforeEvent: number;
    estimatedPercentage: number;
    description: string;
  }>;
}

export class EventService {
  // Predefined event templates
  private eventTemplates: EventTemplate[] = [
    {
      type: 'wedding',
      name: 'حفل زفاف',
      description: 'تنظيم حفل زفاف كامل',
      estimatedDuration: 180, // 6 months
      categories: [
        { categoryName: 'قاعة الأفراح', estimatedPercentage: 30, priority: 'high', description: 'حجز وتجهيز القاعة' },
        { categoryName: 'الطعام والشراب', estimatedPercentage: 25, priority: 'high', description: 'وجبات وضيافة' },
        { categoryName: 'التصوير', estimatedPercentage: 15, priority: 'medium', description: 'تصوير وفيديو' },
        { categoryName: 'الملابس', estimatedPercentage: 12, priority: 'medium', description: 'فساتين وبدلات' },
        { categoryName: 'الزينة والزهور', estimatedPercentage: 8, priority: 'medium', description: 'ديكور وتنسيق' },
        { categoryName: 'الموسيقى والترفيه', estimatedPercentage: 6, priority: 'low', description: 'DJ أو فرقة موسيقية' },
        { categoryName: 'متنوعة', estimatedPercentage: 4, priority: 'low', description: 'مصاريف أخرى' },
      ],
      milestones: [
        { name: 'حجز القاعة', daysBeforeEvent: 150, estimatedPercentage: 15, description: 'حجز وتأمين القاعة' },
        { name: 'طلب الدعوات', daysBeforeEvent: 60, estimatedPercentage: 3, description: 'طباعة وإرسال الدعوات' },
        { name: 'تأكيد الطعام', daysBeforeEvent: 30, estimatedPercentage: 25, description: 'تأكيد قائمة الطعام' },
        { name: 'التجهيزات النهائية', daysBeforeEvent: 7, estimatedPercentage: 10, description: 'اللمسات الأخيرة' },
      ],
    },
    {
      type: 'vacation',
      name: 'رحلة سياحية',
      description: 'تخطيط رحلة سياحية عائلية',
      estimatedDuration: 60, // 2 months
      categories: [
        { categoryName: 'تذاكر الطيران', estimatedPercentage: 35, priority: 'high', description: 'حجز تذاكر السفر' },
        { categoryName: 'الإقامة', estimatedPercentage: 30, priority: 'high', description: 'حجز الفنادق' },
        { categoryName: 'الطعام والشراب', estimatedPercentage: 15, priority: 'medium', description: 'وجبات ومطاعم' },
        { categoryName: 'المواصلات', estimatedPercentage: 10, priority: 'medium', description: 'تاكسي وتنقلات' },
        { categoryName: 'الأنشطة والجولات', estimatedPercentage: 7, priority: 'low', description: 'رحلات ومعالم' },
        { categoryName: 'تسوق وهدايا', estimatedPercentage: 3, priority: 'low', description: 'تذكارات ومشتريات' },
      ],
      milestones: [
        { name: 'حجز الطيران', daysBeforeEvent: 45, estimatedPercentage: 35, description: 'حجز تذاكر الطيران' },
        { name: 'حجز الإقامة', daysBeforeEvent: 30, estimatedPercentage: 30, description: 'حجز الفنادق' },
        { name: 'تحضير الوثائق', daysBeforeEvent: 14, estimatedPercentage: 2, description: 'جواز سفر وفيزا' },
        { name: 'تحضير الحقائب', daysBeforeEvent: 3, estimatedPercentage: 1, description: 'ترتيب الأمتعة' },
      ],
    },
    {
      type: 'ramadan',
      name: 'شهر رمضان',
      description: 'ميزانية شهر رمضان المبارك',
      estimatedDuration: 30,
      categories: [
        { categoryName: 'الطعام والشراب', estimatedPercentage: 40, priority: 'high', description: 'إفطار وسحور' },
        { categoryName: 'الصدقة والزكاة', estimatedPercentage: 25, priority: 'high', description: 'زكاة وصدقات' },
        { categoryName: 'الملابس', estimatedPercentage: 15, priority: 'medium', description: 'ملابس العيد' },
        { categoryName: 'الضيافة', estimatedPercentage: 10, priority: 'medium', description: 'استقبال الضيوف' },
        { categoryName: 'التكافل الاجتماعي', estimatedPercentage: 6, priority: 'medium', description: 'إفطار صائم' },
        { categoryName: 'متنوعة', estimatedPercentage: 4, priority: 'low', description: 'مصاريف أخرى' },
      ],
      milestones: [
        { name: 'التسوق الأولي', daysBeforeEvent: 7, estimatedPercentage: 20, description: 'شراء المواد الأساسية' },
        { name: 'تحضير العيد', daysBeforeEvent: 3, estimatedPercentage: 15, description: 'ملابس وحلويات العيد' },
      ],
    },
  ];

  // Get event templates
  getEventTemplates(): EventTemplate[] {
    return this.eventTemplates;
  }

  // Get template by type
  getEventTemplate(type: string): EventTemplate | null {
    return this.eventTemplates.find(template => template.type === type) || null;
  }

  // Create event from template
  createEventFromTemplate(
    templateType: string,
    name: string,
    startDate: Date,
    totalBudget: number,
    userId: string,
    familyId?: string,
    customizations?: {
      categories?: Array<{ categoryName: string; amount: number }>;
      milestones?: Array<{ name: string; targetDate: Date; estimatedCost: number }>;
    }
  ): EventData {
    const template = this.getEventTemplate(templateType);
    if (!template) {
      throw new Error(`Template not found for type: ${templateType}`);
    }

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + template.estimatedDuration);

    // Calculate category budgets
    const categories = template.categories.map(cat => {
      const customCategory = customizations?.categories?.find(c => c.categoryName === cat.categoryName);
      const estimatedAmount = customCategory ? customCategory.amount : (totalBudget * cat.estimatedPercentage / 100);
      
      return {
        categoryId: this.generateCategoryId(cat.categoryName),
        categoryName: cat.categoryName,
        estimatedAmount,
        actualAmount: 0,
        priority: cat.priority,
      };
    });

    // Calculate milestones
    const milestones = template.milestones.map((milestone, index) => {
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() - milestone.daysBeforeEvent);
      
      const customMilestone = customizations?.milestones?.find(m => m.name === milestone.name);
      const estimatedCost = customMilestone ? customMilestone.estimatedCost : (totalBudget * milestone.estimatedPercentage / 100);

      return {
        id: `milestone_${Date.now()}_${index}`,
        name: milestone.name,
        targetDate: customMilestone ? customMilestone.targetDate : targetDate,
        estimatedCost,
        actualCost: 0,
        status: 'pending' as const,
        description: milestone.description,
      };
    });

    return {
      id: `event_${Date.now()}`,
      name,
      description: template.description,
      type: templateType as any,
      startDate,
      endDate,
      estimatedBudget: totalBudget,
      actualSpent: 0,
      status: 'planning',
      userId,
      familyId,
      categories,
      milestones,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Analyze event budget
  async analyzeEventBudget(
    eventId: string,
    userId: string,
    familyId?: string
  ): Promise<EventBudgetAnalysis> {
    // In a real implementation, this would fetch the event from database
    // For now, we'll simulate the analysis
    
    // Get event expenses
    const eventExpenses = await expenseRepository.findMany({
      userId,
      familyId,
      // eventId, // Would need to add this field to expenses
    });

    // Calculate totals (simulated)
    const totalBudget = 50000; // Example budget
    const totalSpent = eventExpenses.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const remaining = totalBudget - totalSpent;
    const percentageUsed = (totalSpent / totalBudget) * 100;
    const isOverBudget = totalSpent > totalBudget;

    // Calculate days remaining (simulated)
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 30); // 30 days from now
    const daysRemaining = Math.max(0, Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    const dailyBudgetRemaining = daysRemaining > 0 ? remaining / daysRemaining : 0;

    // Category breakdown (simulated)
    const categoryBreakdown = [
      {
        categoryId: 'cat_venue',
        categoryName: 'قاعة الأفراح',
        budgeted: 15000,
        spent: 12000,
        remaining: 3000,
        percentageUsed: 80,
        status: 'on-track' as const,
      },
      {
        categoryId: 'cat_food',
        categoryName: 'الطعام والشراب',
        budgeted: 12500,
        spent: 8000,
        remaining: 4500,
        percentageUsed: 64,
        status: 'on-track' as const,
      },
    ];

    // Generate recommendations
    const recommendations = this.generateEventRecommendations({
      totalBudget,
      totalSpent,
      remaining,
      percentageUsed,
      daysRemaining,
      categoryBreakdown,
    });

    // Generate alerts
    const alerts = this.generateEventAlerts({
      percentageUsed,
      daysRemaining,
      isOverBudget,
      categoryBreakdown,
    });

    return {
      totalBudget,
      totalSpent,
      remaining,
      percentageUsed,
      isOverBudget,
      daysRemaining,
      dailyBudgetRemaining,
      categoryBreakdown,
      recommendations,
      alerts: alerts as any,
    };
  }

  // Generate event-specific recommendations
  private generateEventRecommendations(data: {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
    percentageUsed: number;
    daysRemaining: number;
    categoryBreakdown: any[];
  }): string[] {
    const recommendations: string[] = [];

    if (data.percentageUsed > 80) {
      recommendations.push('اقتربت من حد الميزانية - راجع المصاريف المتبقية بعناية');
    }

    if (data.daysRemaining < 30 && data.percentageUsed < 50) {
      recommendations.push('لديك متسع في الميزانية - يمكنك إضافة تحسينات على المناسبة');
    }

    if (data.daysRemaining < 7) {
      recommendations.push('المناسبة قريبة - تأكد من إنجاز جميع التجهيزات');
    }

    // Category-specific recommendations
    const overBudgetCategories = data.categoryBreakdown.filter(cat => cat.status === 'over-budget');
    if (overBudgetCategories.length > 0) {
      recommendations.push(`راجع فئات: ${overBudgetCategories.map(c => c.categoryName).join(', ')} - تجاوزت الحد المخصص`);
    }

    if (recommendations.length === 0) {
      recommendations.push('تسير الميزانية بشكل جيد - استمر في هذا النهج');
    }

    return recommendations;
  }

  // Generate event alerts
  private generateEventAlerts(data: {
    percentageUsed: number;
    daysRemaining: number;
    isOverBudget: boolean;
    categoryBreakdown: any[];
  }): Array<{ type: string; message: string; priority: string }> {
    const alerts: any[] = [];

    if (data.isOverBudget) {
      alerts.push({
        type: 'budget_warning',
        message: 'تجاوزت الميزانية المحددة للمناسبة',
        priority: 'high',
      });
    } else if (data.percentageUsed > 90) {
      alerts.push({
        type: 'budget_warning',
        message: 'اقتربت من حد الميزانية (أكثر من 90%)',
        priority: 'medium',
      });
    }

    if (data.daysRemaining <= 7) {
      alerts.push({
        type: 'deadline_approaching',
        message: `المناسبة خلال ${data.daysRemaining} أيام - تأكد من التجهيزات`,
        priority: 'high',
      });
    } else if (data.daysRemaining <= 14) {
      alerts.push({
        type: 'deadline_approaching',
        message: `المناسبة خلال أسبوعين - راجع قائمة المهام`,
        priority: 'medium',
      });
    }

    return alerts;
  }

  // Helper method to generate category ID
  private generateCategoryId(categoryName: string): string {
    return `cat_${categoryName.replace(/\s+/g, '_').toLowerCase()}`;
  }

  // Get event spending recommendations based on progress
  getSpendingRecommendations(
    daysElapsed: number,
    totalDays: number,
    spentPercentage: number
  ): string[] {
    const expectedSpentPercentage = (daysElapsed / totalDays) * 100;
    const recommendations: string[] = [];

    if (spentPercentage > expectedSpentPercentage + 20) {
      recommendations.push('الإنفاق أسرع من المتوقع - قلل المصاريف غير الضرورية');
    } else if (spentPercentage < expectedSpentPercentage - 20) {
      recommendations.push('الإنفاق أبطأ من المتوقع - تأكد من عدم تأجيل المصاريف المهمة');
    } else {
      recommendations.push('معدل الإنفاق مناسب للجدول الزمني');
    }

    return recommendations;
  }

  // Calculate event ROI (for business events)
  calculateEventROI(
    totalCost: number,
    benefits: { revenue?: number; savings?: number; intangibleValue?: number }
  ): {
    roi: number;
    analysis: string;
    recommendations: string[];
  } {
    const totalBenefits = (benefits.revenue || 0) + (benefits.savings || 0) + (benefits.intangibleValue || 0);
    const roi = totalCost > 0 ? ((totalBenefits - totalCost) / totalCost) * 100 : 0;

    let analysis = '';
    const recommendations: string[] = [];

    if (roi > 20) {
      analysis = 'عائد استثمار ممتاز للمناسبة';
      recommendations.push('فكر في إقامة مناسبات مشابهة في المستقبل');
    } else if (roi > 0) {
      analysis = 'عائد استثمار إيجابي';
      recommendations.push('ابحث عن طرق لتحسين الكفاءة في المرات القادمة');
    } else {
      analysis = 'تكلفة أعلى من الفوائد المباشرة';
      recommendations.push('ركز على الفوائد غير المباشرة والقيمة المعنوية');
    }

    return { roi, analysis, recommendations };
  }
}

export const eventService = new EventService();
