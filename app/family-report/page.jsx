'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

export default function FamilyReportPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-emerald-800">تقرير العائلة</h1>
        <p className="text-emerald-600 mt-2">تقرير شامل لمصاريف العائلة</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-6 h-6 text-emerald-600" />
            تقرير العائلة الشهري
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            ستتم إضافة تقارير العائلة قريباً
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
