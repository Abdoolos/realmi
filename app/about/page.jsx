'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">عن ريال مايند</h1>
        <p className="text-xl text-emerald-600 max-w-3xl mx-auto">
          تطبيق ذكي لإدارة المصاريف العائلية بتقنيات الذكاء الاصطناعي، مصمم خصيصاً للعائلات السعودية
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-600" />
              رؤيتنا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              نسعى لتكون الحل الأمثل لإدارة المصاريف العائلية في المملكة العربية السعودية، 
              مع توفير أدوات ذكية تساعد العائلات على تحقيق الاستقرار المالي.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-emerald-600" />
              رسالتنا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              تمكين العائلات من إدارة أموالها بذكاء وفعالية، من خلال تقنيات حديثة 
              وواجهة عربية سهلة الاستخدام تناسب الثقافة المحلية.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-emerald-50 to-amber-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-center text-emerald-800">
            طُور بـ ❤️ في المملكة العربية السعودية
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-emerald-700 mb-4">
            تم تطوير ريال مايند من قبل فريق سعودي متخصص في التقنية المالية
          </p>
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <span>المصمم:</span>
            <span className="font-bold">Abdullah Alawiss</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
