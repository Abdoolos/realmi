// معالج الأخطاء المحسن للإنتاج
import { getEnvironmentInfo } from './envUtils';

export class ErrorHandler {
  constructor() {
    this.env = getEnvironmentInfo();
    this.errorQueue = [];
    this.isReporting = false;
  }

  // معالجة الأخطاء بناءً على النوع
  handle(error, context = {}) {
    const errorInfo = this.analyzeError(error, context);
    
    // تسجيل الخطأ
    this.logError(errorInfo);
    
    // في بيئة الإنتاج، أرسل تقرير
    if (this.env.isProduction) {
      this.queueErrorReport(errorInfo);
    }
    
    return this.getUserFriendlyMessage(errorInfo);
  }

  analyzeError(error, context) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      type: this.determineErrorType(error),
      context,
      timestamp: new Date().toISOString(),
      url: this.env.isClient ? window.location.href : '',
      userAgent: this.env.isClient ? navigator.userAgent : ''
    };

    return errorInfo;
  }

  determineErrorType(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('cors')) return 'CORS';
    if (message.includes('404')) return 'NOT_FOUND';
    if (message.includes('500')) return 'SERVER_ERROR';
    if (message.includes('timeout')) return 'TIMEOUT';
    if (message.includes('network')) return 'NETWORK';
    if (message.includes('unauthorized')) return 'AUTH';
    if (message.includes('hydrat')) return 'HYDRATION';
    
    return 'UNKNOWN';
  }

  logError(errorInfo) {
    const logMethod = this.env.isProduction ? console.error : console.warn;
    
    logMethod('Application Error:', {
      type: errorInfo.type,
      message: errorInfo.message,
      context: errorInfo.context,
      timestamp: errorInfo.timestamp
    });
  }

  getUserFriendlyMessage(errorInfo) {
    const messages = {
      'CORS': 'خطأ في الاتصال بالخادم. يرجى تحديث الصفحة.',
      'NOT_FOUND': 'الخدمة المطلوبة غير متاحة حالياً.',
      'SERVER_ERROR': 'خطأ في الخادم. يرجى المحاولة مرة أخرى.',
      'TIMEOUT': 'انتهت مهلة الطلب. يرجى التحقق من اتصال الإنترنت.',
      'NETWORK': 'خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت.',
      'AUTH': 'انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى.',
      'HYDRATION': 'خطأ في تحميل الصفحة. سيتم إعادة تحميلها تلقائياً.',
      'UNKNOWN': 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
    };
    
    return messages[errorInfo.type] || messages['UNKNOWN'];
  }

  queueErrorReport(errorInfo) {
    this.errorQueue.push(errorInfo);
    
    // أرسل التقارير دفعياً
    if (!this.isReporting) {
      setTimeout(() => this.sendErrorReports(), 5000);
    }
  }

  async sendErrorReports() {
    if (this.errorQueue.length === 0 || this.isReporting) return;
    
    this.isReporting = true;
    
    try {
      // يمكن إرسال التقارير إلى خدمة مراقبة الأخطاء
      console.log('Sending error reports:', this.errorQueue);
      
      // مسح قائمة الأخطاء بعد الإرسال
      this.errorQueue = [];
    } catch (error) {
      console.error('Failed to send error reports:', error);
    } finally {
      this.isReporting = false;
    }
  }
}

// مثيل عام
export const errorHandler = new ErrorHandler();

// دالة مساعدة للاستخدام السريع
export const handleError = (error, context) => {
  return errorHandler.handle(error, context);
};

export default errorHandler;