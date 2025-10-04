// مدقق إعدادات البيئة
import { getEnvironmentInfo } from './envUtils';

export class ConfigValidator {
  constructor() {
    this.env = getEnvironmentInfo();
    this.errors = [];
    this.warnings = [];
  }

  // التحقق من الإعدادات المطلوبة
  validateEnvironment() {
    this.errors = [];
    this.warnings = [];

    // التحقق من المتغيرات الأساسية
    this.checkBaseConfiguration();
    
    // التحقق من إعدادات API
    this.checkAPIConfiguration();
    
    // التحقق من إعدادات Stripe
    this.checkStripeConfiguration();
    
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  checkBaseConfiguration() {
    if (this.env.isClient && !window.location.origin) {
      this.errors.push('Base URL is not available');
    }

    // التحقق من Storage
    if (this.env.isClient) {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
      } catch (error) {
        this.warnings.push('LocalStorage is not available');
      }
    }
  }

  checkAPIConfiguration() {
    // التحقق من إمكانية الوصول للـ APIs
    const criticalEndpoints = [
      '/api/user',
      '/functions/getFamilyData'
    ];

    // يمكن إضافة فحص فعلي للـ endpoints هنا
    this.warnings.push('API endpoint validation not implemented');
  }

  checkStripeConfiguration() {
    // التحقق من وجود مفاتيح Stripe (سيتم فحصها في الخادم)
    if (this.env.isProduction) {
      this.warnings.push('Stripe configuration should be validated server-side');
    }
  }

  // إصلاح تلقائي للمشاكل البسيطة
  autoFix() {
    const fixes = [];

    // إعادة تحميل الصفحة في حالة مشاكل معينة
    if (this.errors.some(error => error.includes('hydration'))) {
      fixes.push('Reloading page to fix hydration issues');
      setTimeout(() => window.location.reload(), 1000);
    }

    return fixes;
  }
}

export const configValidator = new ConfigValidator();

// دالة للفحص السريع
export const validateConfig = () => {
  return configValidator.validateEnvironment();
};

export default configValidator;