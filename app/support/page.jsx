'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageCircle, Book, Phone } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">الدعم والمساعدة</h1>
        <p className="text-xl text-emerald-600">نحن هنا لمساعدتك في أي وقت</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-600" />
              الأسئلة الشائعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">أجوبة للأسئلة الأكثر شيوعاً</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-emerald-600" />
              الدردشة المباشرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">تحدث مع فريق الدعم مباشرة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-6 h-6 text-emerald-600" />
              دليل الاستخدام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">تعلم كيفية استخدام جميع الميزات</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-6 h-6 text-emerald-600" />
              الدعم الهاتفي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">اتصل بنا: +966 50 123 4567</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
