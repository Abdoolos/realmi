'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Globe, User as UserIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CURRENCIES } from '@/components/utils/currencyUtils';
import { toast } from 'sonner';

export default function SetupAccount() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('SAR');

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { 
        callbackUrl: '/setup-account',
        redirect: true 
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول بجوجل');
    }
  };

  const handleContinue = () => {
    // حفظ العملة في التخزين المحلي
    localStorage.setItem('preferred_currency', selectedCurrency);
    toast.success('تم حفظ اختيارك بنجاح!');
    router.push('/dashboard');
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // إذا لم يسجل دخول، اعرض صفحة تسجيل الدخول بجوجل
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-emerald-800 mb-2">
                مرحباً بك في ريال مايند!
              </CardTitle>
              <p className="text-emerald-600 text-lg">
                ابدأ رحلتك المالية معنا
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-emerald-50/50 p-6 rounded-lg border border-emerald-100">
                <h3 className="font-semibold text-emerald-800 mb-3 text-center">
                  لماذا ريال مايند؟
                </h3>
                <ul className="space-y-2 text-emerald-700 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>إدارة مصاريفك بذكاء وسهولة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>تقارير مفصلة لميزانيتك الشهرية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>مساعد ذكي لنصائح مالية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>دعم متعدد العملات</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                className="w-full h-14 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-emerald-500 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-lg font-semibold">تسجيل الدخول بحساب جوجل</span>
                </div>
              </Button>

              <p className="text-center text-sm text-emerald-600">
                بتسجيل الدخول، أنت توافق على{' '}
                <a href="/terms-of-service" className="underline hover:text-emerald-800">
                  الشروط والأحكام
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // إذا سجل دخول، اعرض نموذج اختيار العملة
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              أهلاً {session.user.name}! 👋
            </CardTitle>
            <p className="text-emerald-600 mt-2">
              اختر عملتك المفضلة للبدء
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* معلومات المستخدم */}
            <div className="bg-emerald-50/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <UserIcon className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">معلوماتك</span>
              </div>
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name}
                    className="w-12 h-12 rounded-full border-2 border-emerald-200"
                  />
                )}
                <div className="text-sm text-emerald-700">
                  <p className="font-semibold">{session.user.name}</p>
                  <p className="text-xs">{session.user.email}</p>
                </div>
              </div>
            </div>

            {/* العملة المفضلة */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-emerald-700 font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                العملة المفضلة *
              </Label>
              <Select 
                value={selectedCurrency} 
                onValueChange={setSelectedCurrency}
              >
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="اختر عملتك المفضلة" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CURRENCIES).map(([code, info]) => (
                    <SelectItem key={code} value={code}>
                      <div className="flex items-center gap-3" dir="rtl">
                        <span className="text-lg">{info.flag}</span>
                        <div>
                          <div className="font-medium">{info.name}</div>
                          <div className="text-xs text-emerald-600">{info.symbol}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-emerald-600">
                ستكون هذه العملة الافتراضية لجميع معاملاتك
              </p>
            </div>

            {/* معاينة العملة المختارة */}
            {selectedCurrency && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amber-50/50 p-4 rounded-lg border border-amber-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CURRENCIES[selectedCurrency]?.flag}</span>
                  <div>
                    <p className="font-medium text-amber-800">
                      {CURRENCIES[selectedCurrency]?.name}
                    </p>
                    <p className="text-sm text-amber-600">
                      الرمز: {CURRENCIES[selectedCurrency]?.symbol}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* زر المتابعة */}
            <Button
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الحفظ...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  المتابعة إلى لوحة التحكم
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
