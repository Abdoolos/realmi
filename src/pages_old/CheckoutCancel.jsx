import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-lg mx-auto"
      >
        <AlertCircle className="h-20 w-20 text-amber-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-emerald-800 mb-3">تم إلغاء عملية الدفع</h1>
        <p className="text-emerald-600 text-lg mb-8">
          يبدو أنك ألغيت عملية الدفع. لا تتردد في العودة واختيار الخطة المناسبة لك في أي وقت.
        </p>
        <Link to={createPageUrl("Pricing")}>
          <Button size="lg" variant="outline" className="text-lg">
            العودة إلى صفحة الخطط
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}