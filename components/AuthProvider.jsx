"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import PropTypes from 'prop-types';

function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // قائمة الصفحات التي لا تحتاج مصادقة
    const publicPages = ['/auth/signin', '/auth/error', '/', '/setup-account'];
    
    if (status === "loading") return; // لا نفعل شيء أثناء التحميل
    
    if (!session && !publicPages.includes(pathname)) {
      router.push('/setup-account');
    }
  }, [session, status, router, pathname]);

  // إذا كانت الصفحة عامة أو المستخدم مسجل دخول، اعرض المحتوى
  const publicPages = ['/auth/signin', '/auth/error', '/', '/setup-account'];
  if (publicPages.includes(pathname) || session) {
    return children;
  }

  // في حالة عدم تسجيل الدخول، اعرض شاشة تحميل
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">جاري التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  return null;
}

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </SessionProvider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
