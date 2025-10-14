'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../src/components/ui/select';
import { Wallet, Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { User } from '../../../src/api/entities';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../../../src/components/ui/alert';

// معلومات العملات
const currencies = [
  { code: 'SAR', name: 'ريال سعودي', symbol: '﷼', flag: '🇸🇦' },
  { code: 'USD', name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'يورو', symbol: '€', flag: '🇪🇺' },
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'KWD', name: 'دينار كويتي', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق', flag: '🇶🇦' }
];

export default function GoogleSignInPage() {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState('SAR');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [error, setError] = useState('');

  // تحقق من وجود مستخدم مسجل مسبقاً
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const user = await User.me();
        if (user && user.setup_completed) {
          router.push('/dashboard');
        }
      } catch {
        console.log('No existing user found');
      }
    };
    
    checkExistingUser();
  }, [router]);

  // تحميل Google API عند تحميل الصفحة
  useEffect(() => {
    loadGoogleAPI();
  }, []);

  // تحميل Google API
  const loadGoogleAPI = async () => {
    try {
      setError('');
      console.log('🔄 بدء تحميل Google API...');
      
      // التحقق من وجود Google API مسبقاً
      if (window.google?.accounts?.id) {
        console.log('✅ Google API محمل مسبقاً');
        initializeGoogle();
        return;
      }

      // إضافة script tag لتحميل Google API
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ تم تحميل Google API بنجاح');
        setTimeout(() => {
          initializeGoogle();
        }, 1000); // انتظار ثانية للتأكد من تحميل كامل
      };
      
      script.onerror = (error) => {
        console.error('❌ فشل في تحميل Google API:', error);
        setError('فشل في تحميل خدمات Google. تأكد من اتصالك بالإنترنت.');
      };
      
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('❌ خطأ في تحميل Google API:', error);
      setError('حدث خطأ أثناء تحميل خدمات Google');
    }
  };

  // تهيئة Google OAuth
  const initializeGoogle = () => {
    try {
      if (!window.google?.accounts?.id) {
        throw new Error('Google API غير متوفر');
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "454676723375-5gdpd8shc5e06e8fp38d9p810smffpfc.apps.googleusercontent.com";
      
      console.log('🔧 تهيئة Google OAuth مع Client ID:', clientId.substring(0, 20) + '...');
      
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      console.log('✅ تم تهيئة Google OAuth بنجاح');
      setGoogleReady(true);
      setError('');
      
    } catch (error) {
      console.error('❌ فشل في تهيئة Google OAuth:', error);
      setError('فشل في تهيئة خدمات Google. يرجى إعادة تحميل الصفحة.');
    }
  };

  // دالة تسجيل الدخول بـ Google
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      
      if (!googleReady || !window.google?.accounts?.id) {
        throw new Error('خدمات Google غير جاهزة');
      }

      console.log('🚀 بدء عملية تسجيل الدخول...');

      // عرض نافذة تسجيل الدخول باستخدام popup
      window.google.accounts.id.prompt((notification) => {
        console.log('Google prompt notification:', notification);
        
        if (notification.isNotDisplayed()) {
          console.warn('⚠️ لم يتم عرض نافذة Google');
          setError('لم يتم عرض نافذة تسجيل الدخول. تأكد من السماح للنوافذ المنبثقة.');
          setGoogleLoading(false);
        }
        
        if (notification.isSkippedMoment()) {
          console.log('ℹ️ تم تخطي نافذة تسجيل الدخول');
          setGoogleLoading(false);
        }
      });
      
    } catch (error) {
      console.error('❌ خطأ في تسجيل الدخول بـ Google:', error);
      setError(error.message || 'فشل في تسجيل الدخول بـ Google. يرجى المحاولة مرة أخرى.');
      setGoogleLoading(false);
    }
  };

  // طريقة بديلة لتسجيل الدخول
  const handleAlternativeGoogleSignIn = () => {
    try {
      setError('');
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "454676723375-5gdpd8shc5e06e8fp38d9p810smffpfc.apps.googleusercontent.com";
      const redirectUri = window.location.origin + '/auth/google-callback';
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=openid email profile&` +
        `access_type=offline`;
      
      window.location.href = googleAuthUrl;
      
    } catch (error) {
      console.error('❌ خطأ في الطريقة البديلة:', error);
      setError('فشلت جميع طرق تسجيل الدخول. يرجى المحاولة لاحقاً.');
    }
  };

  // معالج callback من Google
  const handleGoogleCallback = async (response) => {
    try {
      setGoogleLoading(false);
      setIsLoading(true);
      setError('');

      console.log('📨 استلام رد من Google');

      if (!response.credential) {
        throw new Error('لم يتم استلام بيانات صحيحة من Google');
      }

      // فك تشفير JWT token
      const userInfo = parseJwt(response.credential);
      console.log('👤 معلومات المستخدم:', { name: userInfo.name, email: userInfo.email });
      
      // إنشاء أو تحديث المستخدم
      await User.updateMyUserData({
        full_name: userInfo.name,
        email: userInfo.email,
        profile_picture: userInfo.picture,
        preferred_currency: selectedCurrency,
        setup_completed: true,
        google_id: userInfo.sub,
        updated_at: new Date().toISOString()
      });

      toast.success(`مرحباً ${userInfo.name}! تم تسجيل الدخول بنجاح 🎉`);
      
      // انتقال للوحة التحكم
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('❌ خطأ في معالجة رد Google:', error);
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      toast.error('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

  // دالة فك تشفير JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ خطأ في فك تشفير JWT:', error);
      throw new Error('بيانات غير صحيحة من Google');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100" dir="rtl">
      <div className="flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md space-y-6">
          
          {/* زر العودة */}
          <Button
            variant="outline"
            onClick={() => router.push('/auth')}
            className="mb-4 border-emerald-200 hover:bg-emerald-50"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للتسجيل العادي
          </Button>

          {/* شعار التطبيق */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">تسجيل دخول سريع</h1>
            <p className="text-emerald-600 text-lg">استخدم حساب Google للدخول بسهولة وأمان</p>
          </div>

          {/* رسائل الحالة */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {googleReady && !error && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                خدمات Google جاهزة للاستخدام ✓
              </AlertDescription>
            </Alert>
          )}

          {/* بطاقة تسجيل الدخول */}
          <Card className="w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-emerald-800">تسجيل دخول بـ Google</CardTitle>
              <CardDescription className="text-emerald-600 text-base">
                سجل دخولك بحساب Google واختر عملتك المفضلة
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              
              {/* اختيار العملة */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                  💰 العملة المفضلة
                </label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger className="h-12 text-base border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{currency.flag}</span>
                          <span className="font-medium">{currency.name}</span>
                          <span className="text-sm text-gray-500">({currency.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* زر تسجيل الدخول بـ Google الرئيسي */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={!googleReady || googleLoading || isLoading}
                className="w-full h-16 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 shadow-lg text-lg font-semibold"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin ml-3" />
                    جاري تحميل Google...
                  </>
                ) : isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin ml-3" />
                    جاري تسجيل الدخول...
                  </>
                ) : !googleReady ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin ml-3" />
                    جاري تهيئة Google...
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 ml-3" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    تسجيل الدخول بـ Google
                  </>
                )}
              </Button>

              {/* زر الطريقة البديلة */}
              {error && (
                <div className="space-y-2">
                  <div className="text-center">
                    <span className="text-sm text-amber-600">هل لم تعمل الطريقة الأولى؟</span>
                  </div>
                  <Button
                    onClick={handleAlternativeGoogleSignIn}
                    variant="outline"
                    disabled={isLoading}
                    className="w-full h-12 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    جرب الطريقة البديلة لـ Google
                  </Button>
                </div>
              )}

              {/* إعادة تحميل Google API */}
              {error && (
                <Button
                  onClick={loadGoogleAPI}
                  variant="outline"
                  disabled={isLoading}
                  className="w-full h-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  إعادة تحميل خدمات Google
                </Button>
              )}

              {/* معلومات الأمان */}
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">✅ لماذا Google؟</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• آمن ومحمي بمعايير Google</li>
                  <li>• لا نحفظ كلمة مرورك</li>
                  <li>• دخول سريع ومريح</li>
                  <li>• يمكنك الخروج في أي وقت</li>
                </ul>
              </div>

              {/* نصائح لحل المشاكل */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 نصائح لحل المشاكل:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• تأكد من السماح للنوافذ المنبثقة</li>
                  <li>• جرب تعطيل مانع الإعلانات مؤقتاً</li>
                  <li>• تأكد من اتصالك بالإنترنت</li>
                  <li>• جرب متصفحاً آخر إذا لم تعمل</li>
                </ul>
              </div>

            </CardContent>
          </Card>

          {/* تذييل */}
          <div className="text-center space-y-2">
            <p className="text-sm text-emerald-600">
              🔒 آمن ومحمي • مجاناً تماماً • يدعم العائلات السعودية
            </p>
            <p className="text-xs text-emerald-500">
              تم التطوير بـ ❤️ من قبل Abdullah Alawiss لخدمة العائلات في المملكة العربية السعودية
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
