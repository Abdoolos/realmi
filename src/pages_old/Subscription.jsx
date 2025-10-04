
import { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { UserSubscription } from '@/api/entities';
import { FamilySubscription } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label'; // Added Label
import { CheckCircle, Gem, ShieldCheck, Star, Crown, Gift, Users, User as UserIcon, Tag } from 'lucide-react'; // Added Tag
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { validateDiscountCode } from '@/api/functions';
import { createStripeCheckout } from '@/api/functions';
import { toast } from 'sonner';

const individualFeatures = {
  free: [
    "تسجيل حتى 50 مصروف شهرياً",
    "إضافة فئات مخصصة (حتى 10)",
    "تقرير شهري أساسي",
    "نصائح ادخار بسيطة"
  ],
  premium: [
    "تسجيل عدد لا محدود من المصاريف",
    "المساعد الذكي بالذكاء الاصطناعي",
    "تصدير البيانات إلى Excel",
    "معالجة الفواتير بالكاميرا",
    "تقارير وتحليلات متقدمة",
    "إشعارات ذكية",
    "دعم فني سريع"
  ]
};

const familyFeatures = [
  "جميع مميزات الاشتراك المميز لجميع الأعضاء",
  "الحساب العائلي المتكامل",
  "إدارة الميزانيات المشتركة",
  "تقارير العائلة الشاملة",
  "صلاحيات متقدمة للأعضاء",
  "حتى 5 أعضاء في العائلة",
  "دعم فني مخصص للعائلة"
];

const prices = {
  premium_monthly: 15,
  premium_yearly: 150,
  family_monthly: 30,
  family_yearly: 250,
};

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('individual');
  const [currentUser, setCurrentUser] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [familySubscription, setFamilySubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // حالات كود الخصم
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Load user subscription
      const userSubs = await UserSubscription.filter({ user_id: user.id });
      if (userSubs.length > 0) {
        setUserSubscription(userSubs[0]);
      } else {
        setUserSubscription(null); // Ensure it's null if no subscription found
      }

      // Load family subscription if user is in a family
      if (user.family_id) {
        const familySubs = await FamilySubscription.filter({ family_id: user.family_id });
        if (familySubs.length > 0) {
          setFamilySubscription(familySubs[0]);
        } else {
          setFamilySubscription(null); // Ensure it's null if no family subscription found
        }
      } else {
        setFamilySubscription(null); // Ensure it's null if no family_id
      }
    } catch (error) {
      console.error("Error loading subscription data:", error);
      toast.error('خطأ في تحميل بيانات الاشتراك.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateDiscountCode = async (planType) => {
    if (!discountCode.trim()) {
      toast.error('يرجى إدخال كود الخصم');
      return;
    }

    setIsValidatingCode(true);
    setAppliedDiscount(null); // Clear previous discount
    try {
      const { data } = await validateDiscountCode({
        code: discountCode.trim(),
        plan_type: planType
      });

      if (data.valid) {
        setAppliedDiscount(data);
        toast.success(`تم تطبيق كود الخصم! خصم ${data.discount.percentage}%`);
      } else {
        toast.error(data.error || 'كود خصم غير صالح');
        setAppliedDiscount(null);
      }
    } catch (error) {
      console.error('Error validating discount code:', error);
      toast.error('خطأ في التحقق من كود الخصم. يرجى المحاولة لاحقاً.');
      setAppliedDiscount(null);
    } finally {
      setIsValidatingCode(false);
    }
  };

  const handleUpgrade = async (planType) => {
    setIsCreatingCheckout(true);
    try {
      const { data } = await createStripeCheckout({
        plan_type: planType,
        discount_code: appliedDiscount?.code
      });

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error('فشل في إنشاء جلسة الدفع.');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('خطأ في إنشاء جلسة الدفع. يرجى المحاولة لاحقاً.');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const calculateDiscountedPrice = (originalPrice) => {
    if (!appliedDiscount) return originalPrice;

    if (appliedDiscount.discount.type === 'percentage') {
      return originalPrice * (1 - appliedDiscount.discount.percentage / 100);
    } else {
      // Assuming fixed amount is in the same currency unit as price
      return Math.max(0, originalPrice - appliedDiscount.discount.amount);
    }
  };

  const individualYearlySaving = (prices.premium_monthly * 12) - prices.premium_yearly;
  const familyYearlySaving = (prices.family_monthly * 12) - prices.family_yearly;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">جاري تحميل بيانات الاشتراك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Gem className="mx-auto h-12 w-12 text-amber-500 mb-4" />
        <h1 className="text-4xl font-bold text-emerald-800">خطط ريال مايند</h1>
        <p className="text-lg text-emerald-600 mt-2">
          اختر الخطة المناسبة لك أو لعائلتك
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-700 font-medium">ضمان استرداد المبلغ خلال 14 يوماً</p>
        </div>
      </motion.div>

      {/* Current Subscriptions Status */}
      {(userSubscription || familySubscription) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="rtl-shadow bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-800">اشتراكاتك الحالية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userSubscription && (
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-800">الاشتراك الفردي</p>
                      <p className="text-sm text-emerald-600">
                        {userSubscription.plan_type === 'free' ? 'خطة مجانية' :
                         userSubscription.plan_type === 'premium_monthly' ? 'مميز شهري' : 'مميز سنوي'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={userSubscription.status === 'active' ? 'default' : 'secondary'}>
                    {userSubscription.status === 'active' ? 'نشط' : 'منتهي'}
                  </Badge>
                </div>
              )}

              {familySubscription && (
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-emerald-800">الاشتراك العائلي</p>
                      <p className="text-sm text-emerald-600">
                        {familySubscription.plan_type === 'family_monthly' ? 'عائلي شهري' : 'عائلي سنوي'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={familySubscription.status === 'active' ? 'default' : 'secondary'}>
                    {familySubscription.status === 'active' ? 'نشط' : 'منتهي'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* كود الخصم */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="rtl-shadow bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              كود الخصم
            </CardTitle>
            <CardDescription className="text-amber-700">
              أدخل كود الخصم للحصول على تخفيض على اشتراكك. تذكر أن بعض الأكواد قد تكون صالحة فقط لأنواع معينة من الاشتراكات.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="discount-code" className="sr-only">كود الخصم</Label>
                <Input
                  id="discount-code"
                  placeholder="مثال: RIYAL10"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase());
                    setAppliedDiscount(null); // Clear applied discount if code changes
                  }}
                  className="font-mono text-center"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const planTypeForValidation = selectedPlan === 'individual' ? 'premium_monthly' : 'family_monthly'; // Validate against a common plan type for initial check
                  handleValidateDiscountCode(planTypeForValidation);
                }}
                disabled={isValidatingCode || !discountCode.trim()}
                className="border-amber-300 hover:bg-amber-100"
              >
                {isValidatingCode ? 'جاري التحقق...' : 'تطبيق'}
              </Button>
            </div>

            {appliedDiscount && (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">تم تطبيق الخصم!</AlertTitle>
                <AlertDescription className="text-green-700">
                  كود &ldquo;{appliedDiscount.code}&rdquo; - خصم {appliedDiscount.discount.percentage}% على {appliedDiscount.plan_type_applies_to === 'all' ? 'جميع الخطط' : appliedDiscount.plan_type_applies_to === 'premium' ? 'الخطط الفردية المميزة' : 'الخطط العائلية'}.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            الاشتراك الفردي
          </TabsTrigger>
          <TabsTrigger value="family" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            الاشتراك العائلي
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Individual Plan */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="rtl-shadow bg-white border-emerald-200 h-full">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-bold text-emerald-900">
                    الخطة المجانية
                  </CardTitle>
                  <CardDescription className="text-emerald-700">
                    مثالية للتجربة
                  </CardDescription>
                  <div className="text-center py-4">
                    <span className="text-4xl font-extrabold text-emerald-800">مجاناً</span>
                    <span className="text-lg font-medium text-emerald-700 mr-1">لمدة 7 أيام</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  {individualFeatures.free.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-lg border-emerald-300 hover:bg-emerald-50"
                    onClick={() => {
                        toast.info('الخطة المجانية لا تتطلب اشتراك مدفوع.');
                        // In a real app, you might trigger a 'free trial' activation here if needed
                    }}
                    disabled={userSubscription?.plan_type === 'free'}
                  >
                    {userSubscription?.plan_type === 'free' ? 'خطتك الحالية' : 'البدء مجاناً'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Premium Monthly - مع عرض الخصم */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-500 text-white font-bold px-4 py-1 text-sm">
                  <Star className="w-4 h-4 ml-1" />
                  أفضل قيمة
                </Badge>
              </div>
              <Card className="rtl-shadow bg-gradient-to-br from-emerald-50 to-white border-emerald-300 border-2 h-full">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-bold text-emerald-900">
                    مميز شهري
                  </CardTitle>
                  <CardDescription className="text-emerald-700">
                    للاستخدام الشخصي المتقدم
                  </CardDescription>
                  <div className="text-center py-4">
                    {appliedDiscount && (appliedDiscount.plan_type_applies_to === 'all' || appliedDiscount.plan_type_applies_to === 'premium') ? (
                      <div className="space-y-2">
                        <div className="text-lg text-gray-500 line-through">
                          {prices.premium_monthly} ر.س
                        </div>
                        <div className="text-4xl font-extrabold text-emerald-800">
                          {calculateDiscountedPrice(prices.premium_monthly).toFixed(0)}
                        </div>
                        <div className="text-sm text-green-600 font-semibold">
                          وفر {(prices.premium_monthly - calculateDiscountedPrice(prices.premium_monthly)).toFixed(0)} ر.س
                        </div>
                      </div>
                    ) : (
                      <span className="text-4xl font-extrabold text-emerald-800">{prices.premium_monthly}</span>
                    )}
                    <span className="text-lg font-medium text-emerald-700 mr-1">ر.س / شهرياً</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  {individualFeatures.premium.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    size="lg"
                    className="w-full text-lg bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white shadow-lg"
                    onClick={() => handleUpgrade('premium_monthly')}
                    disabled={isCreatingCheckout || userSubscription?.plan_type === 'premium_monthly'}
                  >
                    {isCreatingCheckout ? 'جاري التحضير...' :
                     userSubscription?.plan_type === 'premium_monthly' ? 'خطتك الحالية' :
                     `اشترك شهرياً - ${appliedDiscount && (appliedDiscount.plan_type_applies_to === 'all' || appliedDiscount.plan_type_applies_to === 'premium') ? calculateDiscountedPrice(prices.premium_monthly).toFixed(0) : prices.premium_monthly} ر.س`}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Premium Yearly - مع عرض الخصم */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white font-bold px-4 py-1 text-sm">
                  <Gift className="w-4 h-4 ml-1" />
                  شهران مجاناً
                </Badge>
              </div>
              <Card className="rtl-shadow bg-gradient-to-br from-green-50 to-white border-green-300 h-full">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-bold text-emerald-900">
                    مميز سنوي
                  </CardTitle>
                  <CardDescription className="text-emerald-700">
                    وفّر أكثر مع الدفع السنوي
                  </CardDescription>
                  <div className="text-center py-4">
                    <div className="space-y-1">
                      {appliedDiscount && (appliedDiscount.plan_type_applies_to === 'all' || appliedDiscount.plan_type_applies_to === 'premium') ? (
                        <>
                          <div className="text-lg text-gray-500 line-through">
                            {prices.premium_yearly} ر.س
                          </div>
                          <span className="text-4xl font-extrabold text-emerald-800">
                            {calculateDiscountedPrice(prices.premium_yearly).toFixed(0)}
                          </span>
                          <span className="text-lg font-medium text-emerald-700 mr-1">ر.س / سنة</span>
                          <div className="text-sm text-green-600 font-semibold">
                            وفر {(prices.premium_yearly - calculateDiscountedPrice(prices.premium_yearly)).toFixed(0)} ر.س
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-extrabold text-emerald-800">{prices.premium_yearly}</span>
                          <span className="text-lg font-medium text-emerald-700 mr-1">ر.س / سنة</span>
                          <div className="text-sm text-gray-500 line-through">{prices.premium_monthly * 12} ر.س</div>
                          <div className="text-sm text-green-600 font-semibold">وفّر {individualYearlySaving} ر.س سنوياً</div>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  {individualFeatures.premium.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-emerald-800 text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    size="lg"
                    className="w-full text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                    onClick={() => handleUpgrade('premium_yearly')}
                    disabled={isCreatingCheckout || userSubscription?.plan_type === 'premium_yearly'}
                  >
                    {isCreatingCheckout ? 'جاري التحضير...' :
                     userSubscription?.plan_type === 'premium_yearly' ? 'خطتك الحالية' :
                     `اشترك سنوياً - ${appliedDiscount && (appliedDiscount.plan_type_applies_to === 'all' || appliedDiscount.plan_type_applies_to === 'premium') ? calculateDiscountedPrice(prices.premium_yearly).toFixed(0) : prices.premium_yearly} ر.س`}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="family" className="space-y-8">
          {!currentUser?.family_id ? (
            <Alert className="bg-amber-50 border-amber-200">
              <Users className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">لست في عائلة بعد</AlertTitle>
              <AlertDescription className="text-amber-700">
                تحتاج للانضمام لعائلة أو إنشاء عائلة جديدة للاشتراك في الخطة العائلية.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Family Monthly */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="rtl-shadow bg-gradient-to-br from-blue-50 to-white border-blue-300 h-full">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-xl font-bold text-emerald-900 flex items-center justify-center gap-2">
                      <Users className="w-6 h-6 text-blue-500" />
                      عائلي شهري
                    </CardTitle>
                    <CardDescription className="text-emerald-700">
                      مناسب للعائلات الصغيرة والمتوسطة
                    </CardDescription>
                    <div className="text-center py-4">
                      {appliedDiscount && (appliedDiscount.plan_type_applies_to === 'all' || appliedDiscount.plan_type_applies_to === 'family') ? (
                        <div className="space-y-2">
                          <div className="text-lg text-gray-500 line-through">
                            {prices.family_monthly} ر.س
                          </div>
                          <div className="text-4xl font-extrabold text-emerald-800">
                            {calculateDiscountedPrice(prices.family_monthly).toFixed(0)}
                          </div>
                          <div className="text-sm text-green-600 font-semibold">
                            وفر {(prices.family_monthly - calculateDiscountedPrice(prices.family_monthly)).toFixed(0)} ر.س
                          </div>
                        </div>
                      ) : (
                        <span className="text-4xl font-extrabold text-emerald-800">{prices.family_monthly}</span>
                      )}
                      <span className="text-lg font-medium text-emerald-700 mr-1">ر.س / شهرياً</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    {familyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-emerald-800 text-sm">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="lg"
                      className="w-full text-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg"
                      onClick={() => handleUpgrade('family_monthly')}
                      disabled={isCreatingCheckout || familySubscription?.plan_type === 'family_monthly'}
                    >
                      {isCreatingCheckout ? 'جاري التحضير...' :
                       familySubscription?.plan_type === 'family_monthly' ? 'خطتك الحالية' :
                       `اشترك عائلياً - ${appliedDiscount && (appliedDiscount.plan_type_applies_to === 'all' || appliedDiscount.plan_type_applies_to === 'family') ? calculateDiscountedPrice(prices.family_monthly).toFixed(0) : prices.family_monthly} ر.س`}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Family Yearly */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white font-bold px-4 py-1 text-sm">
                    <Crown className="w-4 h-4 ml-1" />
                    الأفضل للعائلات
                  </Badge>
                </div>
                <Card className="rtl-shadow bg-gradient-to-br from-purple-50 to-white border-purple-300 h-full">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-xl font-bold text-emerald-900 flex items-center justify-center gap-2">
                      <Crown className="w-6 h-6 text-purple-500" />
                      عائلي سنوي
                    </CardTitle>
                    <CardDescription className="text-emerald-700">
                      أفضل قيمة للعائلات الكبيرة
                    </CardDescription>
                    <div className="text-center py-4">
                      <div className="space-y-1">
                        {appliedDiscount && (appliedDiscount.plan_type_applies_to === 'all' || appliedDiscount.plan_type_applies_to === 'family') ? (
                          <>
                            <div className="text-lg text-gray-500 line-through">
                              {prices.family_yearly} ر.س
                            </div>
                            <span className="text-4xl font-extrabold text-emerald-800">
                              {calculateDiscountedPrice(prices.family_yearly).toFixed(0)}
                            </span>
                            <span className="text-lg font-medium text-emerald-700 mr-1">ر.س / سنة</span>
                            <div className="text-sm text-green-600 font-semibold">
                              وفر {(prices.family_yearly - calculateDiscountedPrice(prices.family_yearly)).toFixed(0)} ر.س
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-4xl font-extrabold text-emerald-800">{prices.family_yearly}</span>
                            <span className="text-lg font-medium text-emerald-700 mr-1">ر.س / سنة</span>
                            <div className="text-sm text-gray-500 line-through">{prices.family_monthly * 12} ر.س</div>
                            <div className="text-sm text-purple-600 font-semibold">وفّر {familyYearlySaving} ر.س سنوياً</div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1">
                    {[...familyFeatures, "دعم فني أولوية للعائلة"].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-emerald-800 text-sm">{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="lg"
                      className="w-full text-lg bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white shadow-lg"
                      onClick={() => handleUpgrade('family_yearly')}
                      disabled={isCreatingCheckout || familySubscription?.plan_type === 'family_yearly'}
                    >
                      {isCreatingCheckout ? 'جاري التحضير...' :
                       familySubscription?.plan_type === 'family_yearly' ? 'خطتك الحالية' :
                       `اشترك سنوياً - ${appliedDiscount && (appliedDiscount.plan_type_applies_to === 'all' || appliedDiscount.plan_type_applies_to === 'family') ? calculateDiscountedPrice(prices.family_yearly).toFixed(0) : prices.family_yearly} ر.س`}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Guarantee Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Alert variant="default" className="bg-emerald-50 border-emerald-200 text-center">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <AlertTitle className="text-emerald-800 text-lg">ضمان الرضا التام</AlertTitle>
          <AlertDescription className="text-emerald-700 mt-2">
            جرّب ريال مايند بثقة تامة. إذا لم تكن راضياً خلال أول 14 يوماً، سنسترد لك كامل المبلغ بدون أسئلة.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
}
