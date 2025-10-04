import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Globe, User as UserIcon, Phone, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createPageUrl } from '@/utils';
import { CURRENCIES } from '@/components/utils/currencyUtils';
import { toast } from 'sonner';

export default function SetupAccount() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const hasCheckedUser = useRef(false);
  const [formData, setFormData] = useState({
    phone: '',
    preferred_currency: 'SAR'
  });

  useEffect(() => {
    // منع الطلبات المتكررة
    if (hasCheckedUser.current) return;
    
    checkUserSetup();
  }, []);

  const checkUserSetup = async () => {
    // منع الطلبات المتكررة
    if (hasCheckedUser.current) return;
    hasCheckedUser.current = true;
    
    setIsLoading(true);
    
    try {
      // التحقق من التخزين المحلي أولاً
      const cachedSetupStatus = localStorage.getItem('user_setup_completed');
      if (cachedSetupStatus === 'true') {
        router.push(createPageUrl("Dashboard"));
        return;
      }

      const user = await User.me();
      setCurrentUser(user);
      
      // إذا كان المستخدم أكمل الإعداد بالفعل، وجهه للصفحة الرئيسية
      if (user.setup_completed) {
        localStorage.setItem('user_setup_completed', 'true');
        router.push(createPageUrl("Dashboard"));
        return;
      }

      // ملء البيانات الموجودة
      setFormData({
        phone: user.phone || '',
        preferred_currency: user.preferred_currency || 'SAR'
      });
      
    } catch (error) {
      console.error("Error loading user:", error);
      
      if (error.response?.status === 429) {
        toast.error("الخدمة مشغولة حالياً، يرجى المحاولة مرة أخرى بعد قليل");
        // إعادة المحاولة بعد تأخير
        setTimeout(() => {
          hasCheckedUser.current = false;
          checkUserSetup();
        }, 5000);
      } else {
        toast.error("حدث خطأ في تحميل بيانات المستخدم");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.phone || !formData.preferred_currency) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSaving(true);
    try {
      await User.updateMyUserData({
        phone: formData.phone,
        preferred_currency: formData.preferred_currency,
        setup_completed: true
      });

      // تحديث التخزين المحلي
      localStorage.setItem('user_setup_completed', 'true');
      localStorage.setItem('preferred_currency', formData.preferred_currency);

      toast.success("تم حفظ إعدادات الحساب بنجاح!");
      router.push(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error saving setup:", error);
      
      if (error.response?.status === 429) {
        toast.error("الخدمة مشغولة حالياً، يرجى المحاولة مرة أخرى بعد قليل");
      } else {
        toast.error("حدث خطأ في حفظ الإعدادات");
      }
    }
    setIsSaving(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

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
              مرحباً بك في ريال مايند!
            </CardTitle>
            <p className="text-emerald-600 mt-2">
              دعنا نعد حسابك لتحصل على أفضل تجربة
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* معلومات المستخدم */}
            {currentUser && (
              <div className="bg-emerald-50/50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <UserIcon className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">معلوماتك الأساسية</span>
                </div>
                <div className="text-sm text-emerald-700">
                  <p><strong>الاسم:</strong> {currentUser.full_name}</p>
                  <p><strong>البريد الإلكتروني:</strong> {currentUser.email}</p>
                </div>
              </div>
            )}

            {/* رقم الهاتف */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-emerald-700 font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="مثال: 0505123456"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
                dir="ltr"
              />
              <p className="text-xs text-emerald-600">
                سنستخدم رقم هاتفك للتنبيهات المهمة فقط
              </p>
            </div>

            {/* العملة المفضلة */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-emerald-700 font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                العملة المفضلة *
              </Label>
              <Select 
                value={formData.preferred_currency} 
                onValueChange={(value) => handleChange('preferred_currency', value)}
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
                ستكون هذه العملة الافتراضية لجميع معاملاتك. يمكنك تغييرها لاحقاً من الإعدادات
              </p>
            </div>

            {/* معاينة العملة المختارة */}
            {formData.preferred_currency && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amber-50/50 p-4 rounded-lg border border-amber-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CURRENCIES[formData.preferred_currency]?.flag}</span>
                  <div>
                    <p className="font-medium text-amber-800">
                      {CURRENCIES[formData.preferred_currency]?.name}
                    </p>
                    <p className="text-sm text-amber-600">
                      الرمز: {CURRENCIES[formData.preferred_currency]?.symbol}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* زر الحفظ */}
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.phone || !formData.preferred_currency}
              className="w-full bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white shadow-lg"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الحفظ...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  إنهاء الإعداد والبدء
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
