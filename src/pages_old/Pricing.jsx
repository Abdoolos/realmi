
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Gem, ShieldCheck, Users, Crown, Gift, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createStripeCheckout } from '@/api/functions';

const plans = [
  {
    type: 'free_trial',
    title: 'تجربة مجانية',
    price: 0,
    description: '7 أيام مجاناً لتجربة جميع المميزات',
    features: [
      "7 أيام مجاناً كاملة", 
      "جميع المميزات متاحة", 
      "تسجيل مصاريف لا محدود", 
      "تقارير وإحصائيات", 
      "إلغاء في أي وقت",
      "لا يتطلب بيانات دفع"
    ],
    badge: "ابدأ الآن",
    badgeIcon: Gift,
    isFree: true,
  },
  {
    type: 'premium_monthly',
    title: 'مميز شهري',
    price: 15,
    description: 'للاستخدام الشخصي المتقدم',
    features: ["تسجيل عدد لا محدود من المصاريف", "المساعد الذكي", "تصدير البيانات", "معالجة الفواتير بالكاميرا"],
    badge: null,
  },
  {
    type: 'premium_yearly',
    title: 'مميز سنوي',
    price: 150,
    description: 'وفر أكثر مع الدفع السنوي',
    features: ["جميع مزايا الشهري", "خصم كبير", "دعم فني سريع"],
    badge: "الأكثر توفيراً",
    badgeIcon: Gift,
    bestValue: true,
  },
  {
    type: 'family_monthly',
    title: 'عائلي شهري',
    price: 30,
    description: 'للعائلات الصغيرة والمتوسطة',
    features: ["جميع مزايا المميز", "حتى 5 أعضاء", "تقارير عائلية", "ميزانيات مشتركة"],
    badge: null,
    icon: Users,
  },
  {
    type: 'family_yearly',
    title: 'عائلي سنوي',
    price: 250,
    description: 'أفضل قيمة للعائلات',
    features: ["جميع مزايا العائلي الشهري", "خصم كبير", "دعم فني مخصص"],
    badge: "الأفضل للعائلات",
    badgeIcon: Crown,
    icon: Crown,
  }
];

export default function PricingPage() {
  const [coupon, setCoupon] = useState('');
  const [isLoading, setIsLoading] = useState(null);

  const handleFreeTrial = async () => {
    setIsLoading('free_trial');
    try {
      // استخدام User SDK لبدء التجربة المجانية
      const { User, UserSubscription } = await import('@/api/entities');
      const user = await User.me();
      
      // التحقق من وجود اشتراك سابق
      const existingSubs = await UserSubscription.filter({ user_id: user.id });
      
      if (existingSubs.length > 0 && existingSubs[0].plan_type !== 'free') {
        toast.error('لديك اشتراك مسبق. يمكنك إدارته من صفحة الحساب.');
        return;
      }
      
      // إنشاء اشتراك مجاني لمدة 7 أيام
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      
      const subscriptionData = {
        user_id: user.id,
        plan_type: 'free',
        status: 'trialing',
        start_date: new Date().toISOString(),
        end_date: trialEndDate.toISOString(),
        auto_renew: false
      };
      
      if (existingSubs.length > 0) {
        await UserSubscription.update(existingSubs[0].id, subscriptionData);
      } else {
        await UserSubscription.create(subscriptionData);
      }
      
      toast.success('تم بدء التجربة المجانية بنجاح! 🎉');
      setTimeout(() => {
        window.location.href = '/Dashboard';
      }, 1500);
      
    } catch (err) {
      toast.error('حدث خطأ أثناء بدء التجربة المجانية. يرجى المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setIsLoading(null);
    }
  };

  const handleCheckout = async (planType) => {
    if (planType === 'free_trial') {
      await handleFreeTrial();
      return;
    }
    
    setIsLoading(planType);
    try {
      const { data, error } = await createStripeCheckout({
        plan: planType,
        coupon: coupon || null,
      });

      if (error) {
        toast.error(error?.data?.error || 'فشل في إنشاء جلسة الدفع.');
      } else if (data?.success) {
        // Handle successful coupon activation
        toast.success(data.message || "تم تفعيل اشتراكك بنجاح!");
        setTimeout(() => {
            window.location.href = data.redirect_url || '/Dashboard';
        }, 1500);
      } else if (data?.url) {
        // Handle Stripe redirect
        window.location.href = data.url;
      } else {
        // Fallback error
        toast.error('فشل في إنشاء جلسة الدفع.');
      }
    } catch (err) {
      toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <Gem className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <h1 className="text-4xl font-bold text-emerald-800">اختر الخطة التي تناسبك</h1>
        <p className="text-lg text-emerald-600 mt-2">مرونة في الأسعار، قيمة استثنائية.</p>
      </motion.div>

      <div className="mb-8 max-w-md mx-auto">
        <Card className="rtl-shadow bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              لديك كوبون خصم؟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="coupon-code" className="sr-only">كود الخصم</Label>
            <Input id="coupon-code" placeholder="أدخل الكود هنا" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} className="font-mono text-center" />
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div key={plan.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className={`rtl-shadow flex flex-col h-full ${
              plan.bestValue ? 'border-emerald-500 border-2' : 
              plan.isFree ? 'border-amber-400 border-2 bg-gradient-to-br from-amber-50 to-yellow-50' : 
              'border-gray-200'
            }`}>
              {plan.badge && (
                <div className={`text-white text-xs font-bold text-center py-1.5 rounded-t-lg flex items-center justify-center gap-2 ${
                  plan.isFree ? 'bg-amber-500' : 'bg-emerald-600'
                }`}>
                  {React.createElement(plan.badgeIcon, { className: "w-4 h-4" })}
                  {plan.badge}
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-emerald-900 flex items-center justify-center gap-2">
                  {plan.icon && React.createElement(plan.icon, { className: "w-6 h-6 text-emerald-600" })}
                  {plan.title}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-4xl font-extrabold text-emerald-800 mt-4">
                  {plan.price === 0 ? (
                    <span className="text-amber-600">مجاناً</span>
                  ) : (
                    <>
                      {plan.price} <span className="text-lg font-medium">ر.س</span>
                      <span className="text-base font-normal text-gray-500">/{plan.type.includes('yearly') ? 'سنة' : 'شهر'}</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  size="lg" 
                  className={`w-full text-lg shadow-lg ${
                    plan.isFree ? 'bg-amber-500 hover:bg-amber-600 text-white' :
                    plan.bestValue ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 
                    'bg-gray-800 hover:bg-gray-900 text-white'
                  }`} 
                  onClick={() => handleCheckout(plan.type)} 
                  disabled={isLoading}
                >
                  {isLoading === plan.type ? 'جاري التحضير...' : 
                   plan.isFree ? 'ابدأ التجربة المجانية' : 'اشترك الآن'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-700 font-medium text-sm">ضمان استرداد المبلغ خلال 14 يوماً</p>
        </div>
      </motion.div>
    </div>
  );
}
