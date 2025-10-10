'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function FinancialPlannerPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-emerald-800">المخطط المالي</h1>
        <p className="text-emerald-600 mt-2">تخطيط مالي ذكي لمستقبل أفضل</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-emerald-600" />
            خطتك المالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            ستتم إضافة المخطط المالي الذكي قريباً
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
