import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // يمكنك هنا إرسال أي تحليلات أو تحديثات بعد نجاح الدفع
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-lg mx-auto"
      >
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-emerald-800 mb-3">شكراً لك!</h1>
        <p className="text-emerald-600 text-lg mb-8">
          تم تفعيل اشتراكك بنجاح. أهلاً بك في عالم الإدارة المالية الذكية.
        </p>
        <Link to={createPageUrl("Dashboard")}>
          <Button size="lg" className="text-lg bg-emerald-600 hover:bg-emerald-700">
            اذهب إلى لوحة التحكم
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}