import { } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Mail, Clock, Star, MessageCircle, BookOpen, Phone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Support() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12">

        <HelpCircle className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
        <h1 className="text-4xl font-bold text-emerald-800">الدعم الفني</h1>
        <p className="text-lg text-emerald-600 mt-2">
          نحن هنا لدعمك في أي وقت
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}>

          <Card className="rtl-shadow bg-gradient-to-br from-emerald-50 to-white border-emerald-200 h-full">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                البريد الإلكتروني
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700">
                أسرع طريقة للحصول على الدعم
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-xl font-mono text-emerald-800">support@riyalmind.com

                </p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <Clock className="w-4 h-4" />
                <span>الرد خلال 24-48 ساعة عمل</span>
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => window.location.href = 'mailto:support@rialmind.com'}>

                إرسال رسالة
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}>

          <Card className="rtl-shadow bg-gradient-to-br from-amber-50 to-white border-amber-200 h-full">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <Star className="w-5 h-5" />
                الدعم المميز
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-amber-700">
                لمشتركي الخطط المدفوعة
              </p>
              <ul className="space-y-2 text-amber-700">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>أولوية في الرد (خلال 12-24 ساعة)</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-amber-500" />
                  <span>دعم مخصص للمشاكل التقنية</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500" />
                  <span>مساعدة في إعداد الحساب العائلي</span>
                </li>
              </ul>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-lg">
                <p className="text-amber-800 text-sm font-medium">
                  💎 متاح للخطط المميزة والعائلية فقط
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>

        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100 mb-8">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              قاعدة المعرفة والأسئلة الشائعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-700 mb-4">
              ابحث عن إجابات فورية للأسئلة الأكثر شيوعاً
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-800">🚀 البدء السريع</h4>
                <ul className="space-y-1 text-emerald-700 text-sm">
                  <li>• كيف أنشئ حساباً جديداً؟</li>
                  <li>• إضافة أول مصروف</li>
                  <li>• إعداد الميزانية الشهرية</li>
                  <li>• دعوة أفراد العائلة</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-800">💡 مميزات متقدمة</h4>
                <ul className="space-y-1 text-emerald-700 text-sm">
                  <li>• تصدير التقارير إلى Excel</li>
                  <li>• استخدام المساعد الذكي</li>
                  <li>• إعداد التنبيهات</li>
                  <li>• مشاركة الميزانيات العائلية</li>
                </ul>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-emerald-200 hover:bg-emerald-50">

              تصفح جميع الأسئلة الشائعة
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>

        <Card className="rtl-shadow bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              أوقات الاستجابة المتوقعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">📧 الاستفسارات العامة</h4>
                <p className="text-blue-700 text-sm">24-48 ساعة عمل</p>
                <p className="text-blue-600 text-xs mt-1">السبت - الخميس: 9ص - 6م</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">🚨 المشاكل التقنية العاجلة</h4>
                <p className="text-blue-700 text-sm">12-24 ساعة (للمشتركين المميزين)</p>
                <p className="text-blue-600 text-xs mt-1">الرد السريع للمشاكل الحرجة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center bg-emerald-50 p-8 rounded-xl border border-emerald-200 mt-8">

        <h3 className="text-2xl font-semibold text-emerald-800 mb-4">
          👥 فريق الدعم في خدمتك
        </h3>
        <p className="text-emerald-700 mb-6">
          فريقنا من خبراء الدعم التقني جاهز لمساعدتك في حل أي مشكلة أو استفسار.
          نحن نتكلم العربية ونفهم احتياجات المستخدم السعودي.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => window.location.href = 'mailto:support@rialmind.com?subject=استفسار عام عن ريال مايند'}>

            <Mail className="w-4 h-4 ml-2" />
            تواصل معنا الآن
          </Button>
        </div>
      </motion.div>
    </div>);

}
