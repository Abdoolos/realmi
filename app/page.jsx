'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../src/pages_old/Dashboard';
import { User } from '@/api/entities';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await User.me();
        if (user && user.setup_completed) {
          setIsAuthenticated(true);
        } else {
          // توجيه للصفحة الموحدة الجديدة
          router.push('/auth');
          return;
        }
      } catch {
        // مستخدم جديد - توجيه لصفحة التسجيل
        router.push('/auth');
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // عرض شاشة تحميل أثناء التحقق
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4 animate-pulse">
            <span className="text-2xl">💰</span>
          </div>
          <h2 className="text-xl font-semibold text-emerald-800 mb-2">ريال مايند</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // إذا كان مسجل الدخول، عرض Dashboard
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // في الحالات الأخرى (لن تحدث عادة)
  return null;
}
