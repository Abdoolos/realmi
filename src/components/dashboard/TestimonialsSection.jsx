import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    text: "وفّرنا أكثر من 400 ريال أول شهر بس لأننا عرفنا وين تروح فلوسنا.",
    author: "أم عبدالله",
    location: "جدة",
    rating: 5
  },
  {
    id: 2,
    text: "أخيرًا قدرت أتابع مصاريف أولادي بالجامعة بسهولة.",
    author: "أبو محمد",
    location: "الرياض",
    rating: 5
  },
  {
    id: 3,
    text: "التطبيق ساعدني أخطط لشهر رمضان وأوفر للعيد بشكل أفضل.",
    author: "أم سارة",
    location: "الخبر",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">ماذا يقول عنا عملاؤنا</h2>
        <p className="text-emerald-600">تجارب حقيقية من عائلات سعودية استفادت من ريال مايند</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100 h-full hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <div className="relative mb-4">
                  <Quote className="w-8 h-8 text-emerald-200 absolute -top-2 -right-2" />
                  <p className="text-emerald-800 leading-relaxed pr-6">
                    "{testimonial.text}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-emerald-900">{testimonial.author}</p>
                    <p className="text-sm text-emerald-600">{testimonial.location}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {testimonial.author.split(' ')[0][0]}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-lg font-bold text-emerald-800">4.9/5</span>
          </div>
          <p className="text-emerald-700 text-sm">
            متوسط تقييم أكثر من <span className="font-semibold">2,500</span> عائلة سعودية
          </p>
        </div>
      </motion.div>
    </div>
  );
}