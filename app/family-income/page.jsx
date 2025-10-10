'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FamilyIncomePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">الدخل العائلي</h1>
          <p className="text-emerald-600 mt-2">إدارة مصادر الدخل العائلي</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white">
          <Plus className="w-4 h-4 ml-2" />
          إضافة دخل
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600" />
            مصادر الدخل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            ستتم إضافة وظائف إدارة الدخل العائلي قريباً
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
