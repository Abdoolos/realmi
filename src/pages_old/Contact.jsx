
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Globe, MessageCircle, MapPin, Send, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const supportEmail = 'support@riyalmind.com';

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12">

        <Mail className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
        <h1 className="text-4xl font-bold text-emerald-800">تواصل معنا</h1>
        <p className="text-lg text-emerald-600 mt-2">
          يسعدنا تواصلك معنا لأي استفسار أو اقتراح
        </p>
      </motion.div>

      <div className="grid md:grid-cols-1 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}>

          <Card className="rtl-shadow bg-gradient-to-br from-emerald-50 to-white border-emerald-200 h-full">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Send className="w-5 h-5" />
                الدعم والشراكات وكافة الاستفسارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">البريد الإلكتروني الموحد</span>
                </div>
                <p className="text-xl font-mono text-emerald-800">
                  {supportEmail}
                </p>
              </div>
              <p className="text-emerald-700 text-sm">
                للمساعدة التقنية، الأسئلة، الشراكات، أو أي استفسارات أخرى
              </p>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => window.location.href = `mailto:${supportEmail}?subject=استفسار عام`}>

                إرسال رسالة
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8">

        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              طرق التواصل الأخرى
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-emerald-800 mb-2">تابعنا على الشبكات الاجتماعية</h4>
                <p className="text-emerald-700 text-sm">@RiyalMindApp</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-emerald-800 mb-2">الموقع</h4>
                <p className="text-emerald-700 text-sm">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8">

        <Card className="rtl-shadow bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              ساعدنا في تطوير ريال مايند
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700 mb-4">
              رأيك مهم جداً لنا! شاركنا اقتراحاتك لتحسين التطبيق أو المميزات التي تود رؤيتها.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">💡 اقتراحات جديدة</h4>
                <p className="text-purple-700 text-sm mb-3">شارك أفكارك لمميزات جديدة</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 hover:bg-purple-50"
                  onClick={() => window.location.href = `mailto:${supportEmail}?subject=اقتراح مميزة جديدة`}>

                  إرسال اقتراح
                </Button>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🐛 تبليغ عن مشكلة</h4>
                <p className="text-purple-700 text-sm mb-3">ساعدنا في إصلاح أي خطأ واجهته</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-200 hover:bg-purple-50"
                  onClick={() => window.location.href = `mailto:${supportEmail}?subject=تبليغ عن مشكلة تقنية`}>

                  إبلاغ عن خطأ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center bg-emerald-50 p-8 rounded-xl border border-emerald-200">

        <h3 className="text-2xl font-semibold text-emerald-800 mb-4">
          🙏 شكراً لاختيارك ريال مايند
        </h3>
        <p className="text-emerald-700 mb-6">
          نحن فخورون بخدمة الأسر السعودية ومساعدتهم في إدارة أموالهم بشكل أفضل.
          تواصلك معنا يساعدنا على تطوير تطبيق أفضل للجميع.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => window.location.href = `mailto:${supportEmail}?subject=رسالة شكر وتقدير`}>

            <Mail className="w-4 h-4 ml-2" />
            شاركنا تجربتك
          </Button>
        </div>
      </motion.div>
    </div>);

}
