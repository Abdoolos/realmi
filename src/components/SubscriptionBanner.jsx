import { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubscriptionBanner() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من إخفاء البانر من التخزين المحلي
    const dismissed = localStorage.getItem('subscription_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      setIsLoading(false);
      return;
    }

    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // في النسخة المجانية الكاملة، نعتبر كل المستخدمين لديهم اشتراك نشط
      setSubscription({
        status: 'active',
        plan_type: 'free_premium', // خطة مجانية مميزة
        end_date: null // بدون تاريخ انتهاء
      });
      
    } catch (error) {
      console.error("Error loading user subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('subscription_banner_dismissed', 'true');
  };

  // في النسخة المجانية الكاملة، لا نعرض أي بانرات اشتراك
  if (isLoading || isDismissed || subscription?.status === 'active') {
    return null;
  }

  // هذا البانر سيظهر فقط للمستخدمين الذين لم يكملوا إعداد حسابهم
  if (!user?.data?.setup_completed) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-gradient-to-r from-emerald-500 to-amber-500 text-white shadow-lg print:hidden"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5" />
                <div>
                  <p className="font-semibold">🎉 مرحباً بك في ريال مايند!</p>
                  <p className="text-sm opacity-90">أكمل إعداد حسابك للاستفادة من جميع الميزات المجانية</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to={createPageUrl("SetupAccount")}>
                  <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    إكمال الإعداد
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20 w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
