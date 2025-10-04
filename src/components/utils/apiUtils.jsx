import { getEnvironmentInfo, getProductionConfig } from './envUtils';

// معالج طلبات API محسن للإنتاج
export class APIClient {
  constructor() {
    this.config = getProductionConfig();
    this.env = getEnvironmentInfo();
  }

  // إعادة المحاولة مع تأخير تدريجي
  async withRetry(fn, maxRetries = this.config.maxRetries) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // لا تعيد المحاولة في حالات معينة
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw error;
        }
        
        // تأخير تدريجي بين المحاولات
        if (attempt < maxRetries) {
          const delay = this.config.apiRetryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  // طلب API آمن مع معالجة الأخطاء
  async safeRequest(requestFn, fallbackValue = null) {
    try {
      return await this.withRetry(requestFn);
    } catch (error) {
      if (this.config.enableDebugLogs) {
        console.error('API Request failed:', error);
      }
      
      if (this.config.enableErrorReporting) {
        this.reportError(error);
      }
      
      return fallbackValue;
    }
  }

  // تقرير الأخطاء في الإنتاج
  reportError(error) {
    try {
      console.error('Production API Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        timestamp: new Date().toISOString(),
        userAgent: this.env.isClient ? navigator.userAgent : 'Server',
        environment: this.env.environment
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }
}

// مثيل عام للاستخدام
export const apiClient = new APIClient();

// دالة مساعدة للطلبات الآمنة
export const safeApiCall = async (requestFn, fallbackValue = null) => {
  return apiClient.safeRequest(requestFn, fallbackValue);
};

export default {
  APIClient,
  apiClient,
  safeApiCall
};