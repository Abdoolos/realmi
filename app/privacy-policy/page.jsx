'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">سياسة الخصوصية</h1>
        <p className="text-xl text-emerald-600">حماية بياناتك أولويتنا</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600" />
            سياسة حماية البيانات
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">جمع البيانات</h3>
              <p>نحن نجمع البيانات اللازمة فقط لتقديم خدماتنا بأفضل شكل ممكن.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">استخدام البيانات</h3>
              <p>نستخدم بياناتك لتحسين تجربتك وتقديم خدمات مخصصة.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">حماية البيانات</h3>
              <p>نطبق أعلى معايير الأمان لحماية معلوماتك الشخصية والمالية.</p>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">مشاركة البيانات</h3>
              <p>لا نشارك بياناتك مع أطراف ثالثة دون موافقتك الصريحة.</p>
            </section>
          </div>
          
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-800 text-sm text-center">
              تم التطوير بواسطة <strong>Abdullah Alawiss</strong> مع مراعاة أعلى معايير الخصوصية
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
