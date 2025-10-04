// عميل API محسن للإنتاج مع معالجة الأخطاء
import { getEnvironmentInfo } from './envUtils';

class ProductionAPIClient {
  constructor() {
    this.env = getEnvironmentInfo();
    this.baseURL = this.env.isProduction 
      ? 'https://api.base44.app' 
      : window.location.origin;
    
    // إعدادات الإنتاج
    this.timeout = this.env.isProduction ? 30000 : 10000;
    this.maxRetries = this.env.isProduction ? 3 : 1;
  }

  // معالجة طلبات API مع إعادة المحاولة
  async request(endpoint, options = {}) {
    const url = this.createURL(endpoint);
    const config = this.createRequestConfig(options);

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, config);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`API Request failed (attempt ${attempt}/${this.maxRetries}):`, {
          url,
          error: error.message,
          status: error.response?.status
        });

        if (attempt === this.maxRetries) {
          throw this.createUserFriendlyError(error);
        }

        // تأخير تدريجي بين المحاولات
        await this.delay(1000 * attempt);
      }
    }
  }

  createURL(endpoint) {
    // تنظيف المسار
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    
    // إنشاء URL مطلق
    if (cleanEndpoint.startsWith('http')) {
      return cleanEndpoint;
    }
    
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  createRequestConfig(options) {
    return {
      // إعدادات CORS محسنة
      mode: 'cors',
      credentials: 'include',
      
      // Headers محسنة للإنتاج
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      },
      
      ...options
    };
  }

  async fetchWithTimeout(url, config) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  createUserFriendlyError(error) {
    // تحويل الأخطاء التقنية إلى رسائل مفهومة للمستخدم
    if (error.message.includes('CORS')) {
      return new Error('خطأ في الاتصال بالخادم. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
    }
    
    if (error.message.includes('404')) {
      return new Error('الخدمة المطلوبة غير متاحة حالياً.');
    }
    
    if (error.message.includes('timeout')) {
      return new Error('انتهت مهلة الطلب. يرجى التحقق من اتصال الإنترنت.');
    }
    
    return new Error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// مثيل عام
export const apiClient = new ProductionAPIClient();

// دوال مساعدة
export const safeApiCall = async (requestFn, fallback = null) => {
  try {
    return await requestFn();
  } catch (error) {
    console.error('Safe API call failed:', error);
    return fallback;
  }
};

export default apiClient;