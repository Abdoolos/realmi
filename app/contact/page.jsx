'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">تواصل معنا</h1>
        <p className="text-xl text-emerald-600">نحن هنا لمساعدتك</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-emerald-600" />
              البريد الإلكتروني
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">support@rialmind.com</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-6 h-6 text-emerald-600" />
              الهاتف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">+966 50 123 4567</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-600" />
              العنوان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">الرياض، المملكة العربية السعودية</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-12 bg-gradient-to-r from-emerald-50 to-amber-50 border-emerald-200">
        <CardContent className="p-8 text-center">
          <p className="text-emerald-700 mb-4">تم التطوير بواسطة</p>
          <div className="flex items-center justify-center gap-2 text-emerald-800">
            <span className="text-xl font-bold">Abdullah Alawiss</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
