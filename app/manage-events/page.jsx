'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Plus } from 'lucide-react';

export default function ManageEventsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">إدارة المناسبات</h1>
          <p className="text-emerald-600 mt-2">تخطيط ميزانيات المناسبات والأحداث</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مناسبة
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarPlus className="w-6 h-6 text-emerald-600" />
            المناسبات القادمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            ستتم إضافة وظائف إدارة المناسبات قريباً
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
