import { useEffect, useRef } from 'react';
import { User } from '@/api/entities';
import { useRouter } from 'next/navigation';
import { createPageUrl } from '@/utils';

// مكون محسن لتهيئة بيانات المستخدم - النسخة المحلية
export default function UserDataInitializer() {
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // منع التشغيل المتكرر
    if (hasInitialized.current) {
      return;
    }

    const initUserData = async () => {
      try {
        // تحميل بيانات المستخدم المحلي
        const user = await User.me();

        if (!user) {
          console.error('Failed to load local user data');
          hasInitialized.current = true;
          return;
        }

        // التحقق من إكمال الإعداد
        const setupCompleted = user?.setup_completed ?? false;
        
        // حفظ حالة الإعداد في التخزين المحلي
        localStorage.setItem('user_setup_completed', setupCompleted.toString());
        
        // التوجه لصفحة الإعداد إذا لم يكتمل
        if (!setupCompleted) {
          router.push(createPageUrl("SetupAccount"));
          hasInitialized.current = true;
          return;
        }

        // التحقق من الحقول المطلوبة والتحديث إذا لزم الأمر
        const hasRequiredFields = Object.prototype.hasOwnProperty.call(user, 'preferred_currency') && 
                                 Object.prototype.hasOwnProperty.call(user, 'setup_completed');
        
        if (!hasRequiredFields) {
          // تحديث البيانات الناقصة
          await User.update({
            family_id: user?.family_id || null,
            phone: user?.phone || '',
            preferred_currency: user?.preferred_currency || 'SAR',
            setup_completed: setupCompleted
          });
        }

        hasInitialized.current = true;
        
      } catch (error) {
        console.error("Error in user initialization:", error);
        hasInitialized.current = true; // منع إعادة المحاولة اللانهائية
      }
    };

    // تأخير بسيط لضمان تحميل النظام
    const timeout = setTimeout(initUserData, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [router]);

  return null;
}
