
import { useState, useEffect } from 'react';
import { UserSubscription } from '@/api/entities';
import { FamilySubscription } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CreditCard, User as UserIcon, Users, Loader2, ArrowLeft, Gem } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';
import { createBillingPortalSession } from '@/api/functions';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AccountPage() {
  const [userSubscription, setUserSubscription] = useState(null);
  const [familySubscription, setFamilySubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [hasManageableSubscription, setHasManageableSubscription] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await User.me();
        const [userSubs, familySubs] = await Promise.all([
          UserSubscription.filter({ user_id: user.id }),
          user.family_id ? FamilySubscription.filter({ family_id: user.family_id }) : Promise.resolve([])
        ]);

        if (userSubs.length > 0) {
          const sub = userSubs[0];
          setUserSubscription(sub);
          if (sub.plan_type !== 'free' && sub.status === 'active') {
            setHasManageableSubscription(true);
          }
        }
        if (familySubs.length > 0) {
          const sub = familySubs[0];
          setFamilySubscription(sub);
          if (sub.status === 'active') {
            setHasManageableSubscription(true);
          }
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء تحميل بيانات الحساب.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleManageBilling = async () => {
    setIsPortalLoading(true);
    try {
      const { data, error } = await createBillingPortalSession();
      if (error || !data?.url) {
        toast.error("لا يمكن الوصول إلى بوابة الفواتير الآن.");
      } else {
        window.location.href = data.url;
      }
    } catch {
      toast.error("حدث خطأ غير متوقع.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  const renderSubscriptionCard = (subscription, isFamily = false) => {
    if (!subscription) return null;

    const planNames = {
      premium_monthly: 'مميز شهري',
      premium_yearly: 'مميز سنوي',
      family_monthly: 'عائلي شهري',
      family_yearly: 'عائلي سنوي',
      free: 'مجاني'
    };

    const statusColors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    return (
      <Card key={isFamily ? 'family' : 'user'} className="rtl-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            {isFamily ? <Users /> : <UserIcon />}
            الاشتراك {isFamily ? 'العائلي' : 'الفردي'}
          </CardTitle>
          <CardDescription>تفاصيل خطتك الحالية.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">الخطة الحالية</span>
            <span className="font-bold">{planNames[subscription.plan_type] || subscription.plan_type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">الحالة</span>
            <Badge className={statusColors[subscription.status] || 'bg-gray-100'}>
              {subscription.status}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">تاريخ التجديد القادم</span>
            <span className="font-mono">{subscription.end_date ? format(new Date(subscription.end_date), 'PPP', { locale: ar }) : '-'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">التجديد التلقائي</span>
            <span className="font-bold">{subscription.auto_renew ? 'مفعل' : 'متوقف'}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-emerald-800">إدارة الحساب</h1>
      {userSubscription ? renderSubscriptionCard(userSubscription, false) : null}
      {familySubscription ? renderSubscriptionCard(familySubscription, true) : null}
      
      {!userSubscription && !familySubscription && !isLoading && (
        <Card className="rtl-shadow border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2"><Gem /> لا يوجد لديك اشتراك فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-4">
              يبدو أنك لم تشترك في أي خطة بعد. قم بترقية حسابك للوصول إلى الميزات المتقدمة.
            </p>
          </CardContent>
          <CardFooter>
            <Link to={createPageUrl("Pricing")}>
              <Button variant="outline" className="bg-amber-500 text-white hover:bg-amber-600 border-amber-600">
                عرض خطط الأسعار
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      {hasManageableSubscription && (
          <Card className="rtl-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800"><CreditCard />إدارة الفواتير</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                يمكنك تحديث طريقة الدفع، عرض سجل الفواتير، أو إلغاء اشتراكك من خلال بوابة العميل الآمنة.
              </p>
              <Button onClick={handleManageBilling} disabled={isPortalLoading}>
                {isPortalLoading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <ExternalLink className="ml-2 h-4 w-4" />}
                {isPortalLoading ? 'جاري التوجيه...' : 'الذهاب إلى بوابة الفواتير'}
              </Button>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
