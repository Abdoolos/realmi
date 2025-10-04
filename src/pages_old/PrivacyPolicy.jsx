
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Database, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Shield className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
        <h1 className="text-4xl font-bold text-emerald-800">سياسة الخصوصية</h1>
        <p className="text-lg text-emerald-600 mt-2">
          نحن في ريال مايند نحترم خصوصيتك ونلتزم بحماية بياناتك
        </p>
        <p className="text-sm text-gray-500 mt-2">
          آخر تحديث: يناير 2025
        </p>
      </motion.div>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Database className="w-5 h-5" />
                المعلومات التي نجمعها
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700 leading-relaxed">
                نحن نجمع فقط المعلومات الأساسية اللازمة لتشغيل الخدمة:
              </p>
              <ul className="space-y-2 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>الاسم الكامل والبريد الإلكتروني للتسجيل</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>البيانات المالية التي تُدخلها بنفسك (الدخل والمصاريف وفئاتها)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>معلومات الاستخدام الأساسية لتحسين التطبيق</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                كيف نستخدم بياناتك
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700 leading-relaxed">
                نستخدم بياناتك حصرياً للأغراض التالية:
              </p>
              <ul className="space-y-2 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>عرض تقاريرك المالية الشخصية والعائلية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>إرسال إشعارات التنبيه عند تجاوز الميزانية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>تحسين الخدمة وإضافة مميزات جديدة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>التواصل معك بخصوص حسابك أو التحديثات المهمة</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                مشاركة البيانات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border-r-4 border-green-500">
                <p className="text-green-800 font-semibold">
                  ✅ نحن لا نبيع أو نشارك بياناتك مع أطراف ثالثة لأغراض تسويقية
                </p>
              </div>
              <p className="text-emerald-700 leading-relaxed">
                قد نستخدم خدمات طرف ثالث موثوقة فقط في الحالات التالية:
              </p>
              <ul className="space-y-2 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>بوابات الدفع المرخصة (لمعالجة الاشتراكات)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>مزودي التحليلات (لتحسين الأداء) بما يتوافق مع معايير الأمان</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>خدمات البنية التحتية السحابية المشفرة</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                الأمان وحماية البيانات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700 leading-relaxed">
                نستخدم أحدث تقنيات الحماية لضمان أمان بياناتك:
              </p>
              <ul className="space-y-2 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>تشفير SSL/TLS لجميع البيانات أثناء النقل</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>تشفير البيانات في قواعد البيانات</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>نسخ احتياطية دورية محمية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>مراقبة أمنية مستمرة للخوادم</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                حقوقك والتحكم في بياناتك
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700 leading-relaxed">
                أنت تملك السيطرة الكاملة على بياناتك:
              </p>
              <ul className="space-y-2 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>الوصول إلى جميع بياناتك وتصديرها في أي وقت</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>تعديل أو حذف أي معلومة في حسابك</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>حذف حسابك وجميع بياناتك نهائياً في أي وقت</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>التحكم في إعدادات الإشعارات والخصوصية</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="rtl-shadow bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                التحديثات على السياسة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 leading-relaxed">
                قد نحدث هذه السياسة من حين لآخر لتحسين الخدمة أو للامتثال لقوانين جديدة. 
                سيتم إشعارك داخل التطبيق عند أي تغييرات مهمة، ولك الحق في إلغاء حسابك إذا لم توافق على التحديثات الجديدة.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center bg-emerald-50 p-6 rounded-xl border border-emerald-200"
        >
          <h3 className="text-xl font-semibold text-emerald-800 mb-2">
            لديك أسئلة حول الخصوصية؟
          </h3>
          <p className="text-emerald-700 mb-4">
            لا تتردد في التواصل معنا
          </p>
          <div className="text-emerald-600">
            <p>📧 support@riyalmind.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
