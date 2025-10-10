'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">خطط الأسعار</h1>
        <p className="text-xl text-emerald-600">اختر الخطة المناسبة لعائلتك</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gem className="w-6 h-6 text-emerald-600" />
              الخطة المجانية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 mb-4">0 ر.س</div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>إدارة المصاريف الأساسية</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>تقارير شهرية</span>
              </div>
            </div>
            <Button className="w-full">الخطة الحالية</Button>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-500 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm">الأكثر شعبية</span>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gem className="w-6 h-6 text-emerald-600" />
              الخطة العائلية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 mb-4">29 ر.س/شهر</div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>جميع ميزات الخطة المجانية</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>إدارة عائلية متقدمة</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>تحليلات ذكية</span>
              </div>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">ترقية الآن</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gem className="w-6 h-6 text-emerald-600" />
              الخطة المتميزة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 mb-4">59 ر.س/شهر</div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>جميع ميزات الخطة العائلية</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>المساعد الذكي المتقدم</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>دعم فني مخصص</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">قريباً</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
