'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, Bell, Lock } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-emerald-800">إدارة الحساب</h1>
        <p className="text-emerald-600 mt-2">إعدادات الحساب والملف الشخصي</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-600" />
              الملف الشخصي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">إعدادات الملف الشخصي والبيانات</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-emerald-600" />
              الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">إعدادات الإشعارات والتنبيهات</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-emerald-600" />
              الأمان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">إعدادات كلمة المرور والأمان</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-600" />
              إعدادات عامة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">الإعدادات العامة للتطبيق</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
