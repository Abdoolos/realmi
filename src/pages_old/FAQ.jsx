
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, ChevronDown, ChevronUp, Search, Zap, CreditCard, Shield, Users, Smartphone, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

const faqData = [
  {
    id: 1,
    category: "عام",
    icon: HelpCircle,
    color: "emerald",
    question: "ما هو تطبيق ريال مايند؟",
    answer: "ريال مايند هو تطبيق عربي يساعدك على متابعة مصاريفك ودخلك بالريال السعودي، مع تقارير ورسوم بيانية وتنبيهات ذكية قبل تجاوز الميزانية. التطبيق مصمم خصيصاً للعائلات السعودية مع دعم التقويم الهجري والميلادي."
  },
  {
    id: 2,
    category: "الأسعار",
    icon: CreditCard,
    color: "blue",
    question: "هل التطبيق مجاني؟",
    answer: "نعم، يوجد خطة مجانية لمدة 7 أيام تتيح لك استخدام الأساسيات (إضافة مصاريف وتصنيفات محدودة). يوجد أيضاً خطط مدفوعة بأسعار رمزية تبدأ من 15 ريال شهرياً تشمل مميزات إضافية مثل: مشاركة العائلة، تقارير PDF/Excel، والمساعد الذكي."
  },
  {
    id: 3,
    category: "العملة",
    icon: Zap,
    color: "amber",
    question: "هل يدعم التطبيق العملة السعودية؟",
    answer: "نعم ✅، التطبيق مبني خصيصاً للسوق السعودي ويدعم الريال السعودي (SAR)، مع خيار عرض التواريخ بالتقويم الهجري أو الميلادي. جميع التقارير والحسابات تتم بالريال السعودي."
  },
  {
    id: 4,
    category: "الأمان",
    icon: Shield,
    color: "green",
    question: "هل بياناتي آمنة؟",
    answer: "نحن في ريال مايند نهتم بخصوصيتك. بياناتك ليست للبيع، ومحمية بتقنيات التشفير الحديثة (SSL/TLS). تقدر تحذف حسابك وكل بياناتك في أي وقت من إعدادات التطبيق. نحن نلتزم بأعلى معايير الأمان المصرفي."
  },
  {
    id: 5,
    category: "العائلة",
    icon: Users,
    color: "purple",
    question: "هل يمكن مشاركة الحساب مع عائلتي؟",
    answer: "نعم، الخطة العائلية تسمح بإضافة حتى 5 مستخدمين في نفس الحساب، بحيث كل شخص يسجل مصاريفه ويظهر تقرير موحد للأسرة. يمكن للأب أو الأم إدارة صلاحيات الأعضاء وتحديد من يستطيع رؤية ماذا."
  },
  {
    id: 6,
    category: "البدء",
    icon: Smartphone,
    color: "indigo",
    question: "كيف أبدأ باستخدام التطبيق؟",
    answer: "بسيط جداً: 1️⃣ افتح التطبيق وأنشئ حسابك ببريدك الإلكتروني 2️⃣ أضف أول مصروفك (مثلاً: قهوة 15 ريال) 3️⃣ حدّد ميزانية لفئة (مثل المطاعم أو المواصلات) 4️⃣ شارك الرابط مع عائلتك (اختياري) 5️⃣ استمتع بالتقارير والتنبيهات الذكية!"
  },
  {
    id: 7,
    category: "الدفع",
    icon: CreditCard,
    color: "red",
    question: "كيف يتم الدفع للاشتراك المدفوع؟",
    answer: "من داخل التطبيق بسهولة تامة عن طريق: بطاقة مدى، فيزا، ماستركارد. الدفع آمن ومشفر 100%. لا نحفظ تفاصيل بطاقتك في خوادمنا، كل شيء يتم عبر بوابات دفع مرخصة."
  },
  {
    id: 8,
    category: "الضمان",
    icon: Shield,
    color: "green",
    question: "ماذا لو ما أعجبني التطبيق؟",
    answer: "نوفر ضمان تجربة 14 يوم كامل: إذا ما ناسبك التطبيق خلال أول 14 يوم من الاشتراك، تقدر تطلب إلغاء الاشتراك وراح نرجع لك فلوسك بالكامل. وإذا قررت حذف حسابك تماماً، راح نحذف كل بياناتك من خوادمنا."
  },
  {
    id: 9,
    category: "الإنترنت",
    icon: Smartphone,
    color: "blue",
    question: "هل التطبيق يحتاج اتصال دائم بالإنترنت؟",
    answer: "لإضافة مصاريف ورؤية التقارير المحدثة نعم، يحتاج إنترنت. لكن التطبيق يعمل بسرعة ولا يستهلك بيانات كثيرة. نعمل حالياً على دعم الوضع دون اتصال لتسجيل المصاريف ومزامنتها لاحقاً عند توفر الإنترنت."
  },
  {
    id: 10,
    category: "الدعم",
    icon: HelpCircle,
    color: "emerald",
    question: "كيف أتواصل مع الدعم الفني؟",
    answer: "عبر البريد الإلكتروني: support@rialmind.com - الرد عادة خلال 24–48 ساعة عمل. لمشتركي الخطة المدفوعة: دعم أولوية خلال 12-24 ساعة. فريقنا يتكلم العربية ويفهم احتياجات المستخدم السعودي."
  },
  {
    id: 11,
    category: "المميزات",
    icon: Zap,
    color: "amber",
    question: "ما الفرق بين الخطة المجانية والمدفوعة؟",
    answer: "الخطة المجانية (7 أيام): إضافة مصاريف أساسية، فئات محدودة، تقرير بسيط. الخطة المميزة: مصاريف لا محدودة، المساعد الذكي، تصدير Excel، معالجة الفواتير بالكاميرا، تقارير متقدمة، إشعارات ذكية، دعم فني سريع."
  },
  {
    id: 12,
    category: "البيانات",
    icon: Settings,
    color: "gray",
    question: "هل يمكنني تصدير بياناتي؟",
    answer: "نعم! يمكنك تصدير جميع مصاريفك وتقاريرك إلى ملف Excel أو PDF في أي وقت. هذه الميزة متاحة للمشتركين في الخطة المميزة والعائلية. البيانات تشمل التواريخ الهجرية والميلادية، الفئات، المبالغ، والملاحظات."
  }
];

const categoryColors = {
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  green: "bg-green-100 text-green-800 border-green-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
  red: "bg-red-100 text-red-800 border-red-200",
  gray: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function FAQ() {
  const [openItems, setOpenItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQ = faqData.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqData.map(item => item.category))];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <HelpCircle className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
        <h1 className="text-4xl font-bold text-emerald-800">الأسئلة الشائعة</h1>
        <p className="text-lg text-emerald-600 mt-2">
          إجابات على أكثر الأسئلة شيوعاً حول ريال مايند
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
          <Input
            placeholder="ابحث في الأسئلة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 border-emerald-200 focus:border-emerald-500"
          />
        </div>
      </motion.div>

      {/* Category Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="rtl-shadow bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">فئات الأسئلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => {
                const categoryData = faqData.find(item => item.category === category);
                const Icon = categoryData?.icon || HelpCircle;
                return (
                  <div 
                    key={category}
                    className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-emerald-200"
                  >
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800 text-sm">{category}</span>
                    <span className="text-emerald-600 text-xs">
                      ({faqData.filter(item => item.category === category).length})
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQ.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
              <CardHeader
                className="cursor-pointer hover:bg-emerald-50 transition-colors"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${categoryColors[item.color]} border`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-emerald-800 text-lg text-right">
                        {item.question}
                      </CardTitle>
                      <p className="text-sm text-emerald-600 mt-1">
                        فئة: {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {openItems.includes(item.id) ? (
                      <ChevronUp className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <AnimatePresence>
                {openItems.includes(item.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      <div className="bg-emerald-50 p-4 rounded-lg border-r-4 border-emerald-400">
                        <p className="text-emerald-800 leading-relaxed text-right">
                          {item.answer}
                        </p>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredFAQ.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            لم نجد نتائج
          </h3>
          <p className="text-gray-500">
            جرب استخدام كلمات مختلفة في البحث
          </p>
        </motion.div>
      )}

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center bg-emerald-50 p-8 rounded-xl border border-emerald-200"
      >
        <h3 className="text-2xl font-semibold text-emerald-800 mb-4">
          لم تجد إجابة سؤالك؟
        </h3>
        <p className="text-emerald-700 mb-6">
          فريق الدعم الفني جاهز لمساعدتك في أي استفسار
        </p>
        <div className="flex justify-center gap-4">
          <button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => window.location.href = 'mailto:support@rialmind.com?subject=سؤال غير موجود في FAQ'}
          >
            <HelpCircle className="w-4 h-4" />
            اسأل فريق الدعم
          </button>
        </div>
      </motion.div>
    </div>
  );
}
