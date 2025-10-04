import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Target, 
  Eye, 
  Award, 
  Users, 
  TrendingUp, 
  Shield, 
  Lightbulb, 
  BookOpen,
  Calculator,
  Compass,
  Star,
  Sparkles,
  Crown,
  Gift
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-emerald-800 mb-4">عنّا – قصة ريال مايند</h1>
        <p className="text-lg text-emerald-600 leading-relaxed max-w-3xl mx-auto">
          مرحبًا بك في ريال مايند، منصّة ووجهة معرفية متخصّصة في المال الشخصي والتقنية المالية (FinTech) 
          موجهة للسوق السعودي والعربي.
        </p>
      </motion.div>

      {/* Story Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <Card className="rtl-shadow bg-gradient-to-br from-emerald-50 to-amber-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2 text-xl">
              <Sparkles className="w-6 h-6 text-amber-500" />
              كيف بدأت القصة؟
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-emerald-700 leading-relaxed">
              جاءت فكرة المشروع من حاجة بسيطة شعرنا بها جميعًا:
            </p>
            <div className="bg-white/70 p-4 rounded-lg border-r-4 border-emerald-400">
              <p className="text-emerald-800 leading-relaxed">
                الكثير من الناس يديرون أموالهم بشكل يومي، لكن القليل يملكون أدوات ومعلومات تساعدهم على الادخار، 
                التخطيط، والاستثمار بذكاء. ومع التغيّر الكبير في عالم التقنية المالية في السعودية (من البنوك الرقمية 
                والمحافظ الإلكترونية إلى حلول الاستثمار الجديدة)، أصبح من الضروري وجود مصدر موثوق يقدّم محتوى 
                واضح، عملي، ومناسب للسوق المحلي.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mission & Vision Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100 h-full">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                ✦ رسالتنا
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-700 leading-relaxed">
                نساعد الأفراد والعائلات على فهم أموالهم بشكل أفضل من خلال مقالات، أدوات، وحلول رقمية تجعل إدارة المال أسهل وأذكى.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-amber-100 h-full">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-600" />
                ✦ رؤيتنا
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 leading-relaxed">
                أن نكون المصدر الأول في السعودية والعالم العربي لفهم وتبسيط عالم المال الشخصي والتقنية المالية، 
                بحيث يتمكّن كل شخص من اتخاذ قرارات مالية صحيحة تدعم مستقبله.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* What We Offer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2 text-xl">
              <Gift className="w-6 h-6 text-emerald-600" />
              ✦ ماذا نقدّم؟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div 
                className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-emerald-800 font-medium mb-2">📝 مقالات متخصصة</p>
                <p className="text-emerald-600 text-sm">في المال الشخصي، الادخار، الاستثمار، والتقنية المالية.</p>
              </motion.div>

              <motion.div 
                className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-blue-800 font-medium mb-2">📊 أدوات رقمية</p>
                <p className="text-blue-600 text-sm">لمتابعة النفقات والميزانية بطريقة ذكية وسهلة.</p>
              </motion.div>

              <motion.div 
                className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Compass className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-amber-800 font-medium mb-2">🎯 نصائح عملية</p>
                <p className="text-amber-600 text-sm">تناسب السوق السعودي والعربي، بعيدًا عن التعقيد.</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2 text-xl">
              <Award className="w-6 h-6 text-emerald-600" />
              ✦ قيمنا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div 
                className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-1">الموثوقية</h4>
                  <p className="text-emerald-600 text-sm">نعتمد على مصادر دقيقة وحديثة.</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">البساطة</h4>
                  <p className="text-blue-600 text-sm">نشرح المفاهيم المالية المعقدة بطريقة سهلة.</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-1">الابتكار</h4>
                  <p className="text-purple-600 text-sm">نواكب أحدث الحلول المالية والتقنية.</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">القرب من الناس</h4>
                  <p className="text-amber-600 text-sm">محتوى واقعي يناسب حياة الأفراد والعائلات.</p>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Final Message Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <Card className="rtl-shadow bg-gradient-to-r from-emerald-500 to-amber-500 border-none text-white">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">✦ باختصار</h3>
            <p className="text-lg leading-relaxed mb-4">
              ريال مايند ليس مجرد موقع، بل مشروع يهدف إلى تمكين الناس من السيطرة على أموالهم وبناء مستقبل مالي أفضل.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="font-medium">معاً نحو مستقبل مالي أذكى</span>
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">2,500+</div>
            <div className="text-sm text-emerald-700">مستخدم نشط</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-blue-700">مقال متخصص</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">15+</div>
            <div className="text-sm text-amber-700">أداة مالية</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">95%</div>
            <div className="text-sm text-purple-700">رضا المستخدمين</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
