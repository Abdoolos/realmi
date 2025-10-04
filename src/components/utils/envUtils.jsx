// أدوات البيئة المحسنة للإنتاج
export const getEnvironmentInfo = () => {
  // التحقق من وجود window قبل الاستخدام
  const isClient = typeof window !== 'undefined';
  
  if (!isClient) {
    // في بيئة الخادم (SSR) أو البناء
    return {
      isClient: false,
      isServer: true,
      baseUrl: '',
      environment: 'production', // افتراض الإنتاج للسلامة
      isPreview: false,
      isProduction: true
    };
  }
  
  // في بيئة المتصفح
  const hostname = window.location.hostname;
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const isPreview = hostname.includes('preview') || hostname.includes('dev') || isLocalhost;
  const isProduction = hostname.includes('base44.app') || (!isLocalhost && !isPreview);
  
  return {
    isClient: true,
    isServer: false,
    baseUrl: window.location.origin,
    environment: isProduction ? 'production' : 'development',
    isPreview,
    isProduction,
    hostname
  };
};

// إنشاء URL مطلق محسن
export const createAbsoluteUrl = (path) => {
  const env = getEnvironmentInfo();
  
  // إذا كان المسار مطلق بالفعل، أرجعه كما هو
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // في بيئة الخادم، استخدم المسار النسبي
  if (env.isServer || !env.baseUrl) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // في المتصفح، أنشئ URL مطلق
  const baseUrl = env.baseUrl.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// التحقق من الميزات المتاحة
export const checkFeatureAvailability = () => {
  const env = getEnvironmentInfo();
  
  return {
    localStorage: env.isClient && typeof localStorage !== 'undefined',
    sessionStorage: env.isClient && typeof sessionStorage !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    webWorkers: env.isClient && typeof Worker !== 'undefined',
    notifications: env.isClient && 'Notification' in window,
    geolocation: env.isClient && 'geolocation' in navigator,
    camera: env.isClient && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function',
  };
};

// إعدادات محسنة للإنتاج
export const getProductionConfig = () => {
  const env = getEnvironmentInfo();
  
  return {
    // تأخيرات API محسنة للإنتاج
    apiRetryDelay: env.isProduction ? 2000 : 1000,
    apiTimeout: env.isProduction ? 10000 : 5000,
    maxRetries: env.isProduction ? 3 : 1,
    
    // إعدادات التخزين المؤقت
    cacheTimeout: env.isProduction ? 300000 : 60000, // 5 دقائق في الإنتاج
    
    // إعدادات التصحيح
    enableDebugLogs: !env.isProduction,
    enableErrorReporting: env.isProduction,
  };
};

export default {
  getEnvironmentInfo,
  createAbsoluteUrl,
  checkFeatureAvailability,
  getProductionConfig
};