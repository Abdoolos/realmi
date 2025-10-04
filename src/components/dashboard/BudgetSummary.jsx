
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function BudgetSummary({ totalIncome, totalExpenses, savings }) {
  const remaining = totalIncome - totalExpenses;
  const savingsPercentage = totalIncome ? ((remaining / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              إجمالي الدخل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700 mb-2">
              {totalIncome.toLocaleString('ar-SA')} ر.س
            </div>
            <p className="text-sm text-emerald-600">الدخل الشهري</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
      >
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-red-100 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              إجمالي المصاريف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 mb-2">
              {totalExpenses.toLocaleString('ar-SA')} ر.س
            </div>
            <p className="text-sm text-red-600">مصاريف هذا الشهر</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <Card className={`rtl-shadow bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
          remaining >= 0 ? 'border-amber-100' : 'border-red-200'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${
              remaining >= 0 ? 'text-amber-600' : 'text-red-600'
            }`}>
              <DollarSign className="w-4 h-4" />
              المتبقي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-2 ${
              remaining >= 0 ? 'text-amber-700' : 'text-red-700'
            }`}>
              {Math.abs(remaining).toLocaleString('ar-SA')} ر.س
              {remaining < 0 && <span className="text-lg mr-2">-</span>}
            </div>
            <p className={`text-sm ${
              remaining >= 0 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {remaining >= 0 ? `${savingsPercentage}% من الدخل` : 'تجاوز الميزانية'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
