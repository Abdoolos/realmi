
import { } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CreditCard, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12">

        <FileText className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
        <h1 className="text-4xl font-bold text-emerald-800">شروط الاستخدام</h1>
        <p className="text-lg text-emerald-600 mt-2">
          باستخدامك لخدمات ريال مايند فأنت توافق على ما يلي
        </p>
        <p className="text-sm text-gray-500 mt-2">
          آخر تحديث: يناير 2025
        </p>
      </motion.div>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>

          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                الاستخدام المسموح
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700 leading-relaxed">
                يحق لك استخدام تطبيق ريال مايند في الحالات التالية:
              </p>
              <ul className="space-y-2 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                  <span>الاستخدام الشخصي لإدارة مصاريفك ودخلك</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                  <span>الاستخدام العائلي مع أفراد أسرتك المقربين</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                  <span>الاستخدام التجاري البسيط (للشركات الصغيرة) مع الخطة المناسبة</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>

          <Card className="rtl-shadow bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                الاستخدام المحظور
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-red-700 leading-relaxed">
                يمنع منعاً باتاً القيام بالأنشطة التالية:
              </p>
              <ul className="space-y-2 text-red-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></span>
                  <span>محاولات اختراق أو تعطيل التطبيق أو خوادمه</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></span>
                  <span>نسخ أو تكرار الكود أو التصميم للاستخدام التجاري</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></span>
                  <span>التلاعب بالخدمات أو محاولة تجاوز القيود المفروضة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></span>
                  <span>مشاركة بيانات دخولك مع أشخاص غير مخولين</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></span>
                  <span>استخدام التطبيق لأنشطة مخالفة للقانون السعودي</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>

          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                مسؤوليات المستخدم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700 leading-relaxed">
                كمستخدم لريال مايند، أنت مسؤول عن:
              </p>
              <ul className="space-y-2 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>صحة ودقة البيانات المالية التي تُدخلها</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>حماية بيانات دخولك وعدم مشاركتها</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>الالتزام بالاستخدام المقبول والقانوني فقط</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>إبلاغنا عن أي مشاكل تقنية أو أمنية تواجهها</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}>

          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                سياسة الاشتراكات والمدفوعات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 mb-2">ضمان 7 أيام للتجربة المجانية</h4>
                <p className="text-blue-700 text-sm">يمكنك إلغاء اشتراكك خلال أول 7 أيام واسترداد كامل المبلغ دون أسئلة

                </p>
              </div>
              <ul className="space-y-2 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>الاشتراكات المدفوعة غير قابلة للاسترجاع بعد انتهاء فترة الضمان</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>يتم تجديد الاشتراكات تلقائياً ما لم تلغيها قبل موعد التجديد</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>الأسعار قابلة للتغيير مع إشعار مسبق للمشتركين الحاليين</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>في حالة عدم دفع الاشتراك، سيتحول حسابك إلى الخطة المجانية</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>

          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                حقوق ريال مايند والتطوير
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-emerald-700 leading-relaxed">
                تحتفظ شركة ريال مايند بالحقوق التالية:
              </p>
              <ul className="space-y-2 text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>تعديل أو إضافة أو إيقاف بعض الخصائص لتحسين الخدمة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>إرسال تحديثات مهمة للمستخدمين عبر التطبيق أو البريد الإلكتروني</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>إيقاف حسابات تنتهك شروط الاستخدام بعد التحذير</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                  <span>تحليل أنماط الاستخدام لتطوير مميزات أفضل (بدون كشف الهوية)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}>

          <Card className="rtl-shadow bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                تحديث الشروط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 leading-relaxed">
                قد نحدث هذه الشروط عند الحاجة (تطوير مميزات جديدة، تحسين الأمان، أو الامتثال للقوانين). 
                سنشعرك بالتغييرات المهمة عبر التطبيق، وإذا لم توافق على الشروط الجديدة يمكنك إلغاء حسابك وحذف بياناتك.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center bg-emerald-50 p-6 rounded-xl border border-emerald-200">

          <h3 className="text-xl font-semibold text-emerald-800 mb-2">
            أسئلة حول الشروط؟
          </h3>
          <p className="text-emerald-700 mb-4">
            فريق الدعم مستعد لمساعدتك
          </p>
          <div className="text-emerald-600">
            <p>📧 support@riyalmind.com</p>
          </div>
        </motion.div>
      </div>
    </div>);

}
