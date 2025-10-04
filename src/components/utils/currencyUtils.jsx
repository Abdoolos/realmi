// أسعار صرف محدثة ودقيقة (يجب تحديثها دورياً من مصدر موثوق)
export const EXCHANGE_RATES = {
  SAR: 1.0,      // الريال السعودي (العملة الأساسية)
  USD: 3.75,     // الدولار الأمريكي  
  EUR: 4.10,     // اليورو
  GBP: 4.75,     // الجنيه الإسترليني
  AED: 1.02,     // الدرهم الإماراتي
  QAR: 1.03,     // الريال القطري  
  KWD: 12.25,    // الدينار الكويتي
  BHD: 9.95,     // الدينار البحريني
  OMR: 9.75,     // الريال العماني
  JOD: 5.30,     // الدينار الأردني
  EGP: 0.075,    // الجنيه المصري
  TRY: 0.11,     // الليرة التركية
};

export const CURRENCIES = {
  SAR: { name: 'ريال سعودي', symbol: 'ر.س', flag: '🇸🇦' },
  USD: { name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸' },
  EUR: { name: 'يورو', symbol: '€', flag: '🇪🇺' },
  GBP: { name: 'جنيه إسترليني', symbol: '£', flag: '🇬🇧' },
  AED: { name: 'درهم إماراتي', symbol: 'د.إ', flag: '🇦🇪' },
  QAR: { name: 'ريال قطري', symbol: 'ر.ق', flag: '🇶🇦' },
  KWD: { name: 'دينار كويتي', symbol: 'د.ك', flag: '🇰🇼' },
  BHD: { name: 'دينار بحريني', symbol: 'د.ب', flag: '🇧🇭' },
  OMR: { name: 'ريال عماني', symbol: 'ر.ع', flag: '🇴🇲' },
  JOD: { name: 'دينار أردني', symbol: 'د.أ', flag: '🇯🇴' },
  EGP: { name: 'جنيه مصري', symbol: 'ج.م', flag: '🇪🇬' },
  TRY: { name: 'ليرة تركية', symbol: '₺', flag: '🇹🇷' },
};

// الحصول على سعر الصرف
export const getExchangeRate = (fromCurrency, toCurrency = 'SAR') => {
  if (fromCurrency === toCurrency) return 1;
  
  if (toCurrency === 'SAR') {
    return EXCHANGE_RATES[fromCurrency] || 1;
  }
  
  // للتحويل من عملة إلى أخرى غير الريال
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // التحويل: من العملة الأصلية → ريال سعودي → العملة المطلوبة
  return fromRate / toRate;
};

// تحويل المبلغ من عملة إلى أخرى
export const convertCurrency = (amount, fromCurrency, toCurrency = 'SAR') => {
  if (!amount || isNaN(amount)) return 0;
  if (fromCurrency === toCurrency) return parseFloat(amount);
  
  const rate = getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = parseFloat(amount) * rate;
  
  // تقريب النتيجة إلى رقمين عشريين
  return Math.round(convertedAmount * 100) / 100;
};

// تنسيق المبلغ مع العملة
export const formatCurrency = (amount, currency = 'SAR', showSymbol = true) => {
  if (!amount && amount !== 0) return '0';
  
  const currencyInfo = CURRENCIES[currency];
  if (!currencyInfo) return amount.toString();
  
  // تنسيق الرقم مع الفواصل
  const formattedNumber = parseFloat(amount).toLocaleString('ar-SA', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });
  
  if (!showSymbol) return formattedNumber;
  
  return `${formattedNumber} ${currencyInfo.symbol}`;
};

// الحصول على العملة المفضلة للمستخدم
export const getUserPreferredCurrency = () => {
  return localStorage.getItem('preferred_currency') || 'SAR';
};

// حفظ العملة المفضلة للمستخدم
export const setUserPreferredCurrency = (currency) => {
  localStorage.setItem('preferred_currency', currency);
};

// دالة شاملة للتحويل والتنسيق
export const convertAndFormat = (amount, fromCurrency, toCurrency = 'SAR', showOriginal = false) => {
  if (!amount || isNaN(amount)) {
    return {
      original: { amount: 0, currency: fromCurrency, formatted: formatCurrency(0, fromCurrency) },
      converted: { amount: 0, currency: toCurrency, formatted: formatCurrency(0, toCurrency) },
      rate: getExchangeRate(fromCurrency, toCurrency)
    };
  }
  
  const originalAmount = parseFloat(amount);
  const convertedAmount = convertCurrency(originalAmount, fromCurrency, toCurrency);
  const rate = getExchangeRate(fromCurrency, toCurrency);
  
  return {
    original: { 
      amount: originalAmount, 
      currency: fromCurrency, 
      formatted: formatCurrency(originalAmount, fromCurrency) 
    },
    converted: { 
      amount: convertedAmount, 
      currency: toCurrency, 
      formatted: formatCurrency(convertedAmount, toCurrency) 
    },
    rate: rate,
    display: showOriginal && fromCurrency !== toCurrency 
      ? `${formatCurrency(originalAmount, fromCurrency)} (${formatCurrency(convertedAmount, toCurrency)})`
      : formatCurrency(convertedAmount, toCurrency)
  };
};

// التحقق من صحة العملة
export const isValidCurrency = (currency) => {
  return Object.keys(CURRENCIES).includes(currency);
};

// الحصول على قائمة العملات المدعومة
export const getSupportedCurrencies = () => {
  return Object.keys(CURRENCIES);
};

// حساب النسبة المئوية للتغير بين عملتين
export const getCurrencyChangePercentage = (fromCurrency, toCurrency = 'SAR') => {
  if (fromCurrency === toCurrency) return 0;
  
  const rate = getExchangeRate(fromCurrency, toCurrency);
  return ((rate - 1) * 100).toFixed(2);
};

export default {
  EXCHANGE_RATES,
  CURRENCIES,
  getExchangeRate,
  convertCurrency,
  formatCurrency,
  getUserPreferredCurrency,
  setUserPreferredCurrency,
  convertAndFormat,
  isValidCurrency,
  getSupportedCurrencies,
  getCurrencyChangePercentage
};