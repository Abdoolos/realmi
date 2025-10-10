'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">شروط الاستخدام</h1>
        <p className="text-xl text-emerald-600">الشروط والأحكام الخاصة بالخدمة</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            شروط وأحكام الاستخدام
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">قبول الشروط</h3>
              <p>باستخدام تطبيق ريال مايند، فإنك توافق على جميع الشروط والأحكام المذكورة.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">استخدام الخدمة</h3>
              <p>يجب استخدام الخدمة بطريقة قانونية ومسؤولة وفقاً للغرض المحدد.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">المسؤوليات</h3>
              <p>المستخدم مسؤول عن دقة البيانات المدخلة وحفظ بيانات تسجيل الدخول.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">إنهاء الخدمة</h3>
              <p>يحق لنا إنهاء أو تعليق حسابك في حالة انتهاك الشروط.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">التعديلات</h3>
              <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت مع إشعارك مسبقاً.</p>
            </section>
          </div>
          
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-800 text-sm text-center">
              تم التطوير بواسطة <strong>Abdullah Alawiss</strong> - جميع الحقوق محفوظة © 2025
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
