import React, { useState, useEffect } from 'react';
import { User, Expense } from '@/api/entities';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Loader2, PieChart, Users, AlertTriangle } from 'lucide-react';

import SummaryCards from '@/components/family-reports/SummaryCards';
import CategoryBreakdown from '@/components/family-reports/CategoryBreakdown';
import MemberBreakdown from '@/components/family-reports/MemberBreakdown';
import SmartRecommendations from '@/components/family-reports/SmartRecommendations';

// Helper for Hijri formatting
const formatHijriMonth = (date) => {
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Riyadh'
  }).format(date);
};

export default function FamilyMonthlyReport() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      if (!currentUser || !currentUser.family_id) {
        setError("أنت لست عضواً في عائلة. لا يمكن إنشاء هذا التقرير.");
        setIsLoading(false);
        return;
      }
      
      const familyId = currentUser.family_id;

      // 1. Fetch Data
      const today = new Date();
      const currentMonthStart = startOfMonth(today);
      const prevMonthStart = startOfMonth(subMonths(today, 1));
      const prevMonthEnd = endOfMonth(subMonths(today, 1));

      const [familyMembers, allExpenses] = await Promise.all([
        User.filter({ family_id: familyId }),
        Expense.filter({ family_id: familyId })
      ]);

      const currentMonthExpenses = allExpenses.filter(e => new Date(e.date) >= currentMonthStart);
      const prevMonthExpenses = allExpenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= prevMonthStart && expenseDate <= prevMonthEnd;
      });

      // 2. Process Data
      const totalCurrentMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
      const totalPrevMonth = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

      // Category Breakdown
      const categoryTotals = currentMonthExpenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {});
      const categoryData = Object.entries(categoryTotals).map(([name, amount]) => ({
        name,
        amount,
        percentage: totalCurrentMonth > 0 ? (amount / totalCurrentMonth) * 100 : 0,
      })).sort((a, b) => b.amount - a.amount);

      // Member Breakdown
      const memberMap = familyMembers.reduce((acc, member) => {
        acc[member.email] = member.full_name || member.email;
        return acc;
      }, {});
      const memberTotals = currentMonthExpenses.reduce((acc, e) => {
        acc[e.created_by] = (acc[e.created_by] || 0) + e.amount;
        return acc;
      }, {});
      const memberData = Object.entries(memberTotals).map(([email, amount]) => ({
        email,
        name: memberMap[email] || email,
        amount,
        percentage: totalCurrentMonth > 0 ? (amount / totalCurrentMonth) * 100 : 0,
      })).sort((a, b) => b.amount - a.amount);
      
      // Comparison
      const comparison = totalPrevMonth > 0 ? ((totalCurrentMonth - totalPrevMonth) / totalPrevMonth) * 100 : (totalCurrentMonth > 0 ? 100 : 0);
      
      // 3. Generate Recommendations
      let recommendations = [];
      if (currentMonthExpenses.length > 0) {
        // Rec 1: Top spending category
        if (categoryData.length > 0) {
          const topCat = categoryData[0];
          recommendations.push(`الإنفاق الأعلى هذا الشهر كان في فئة "${topCat.name}". حاولوا مراجعة هذه الفئة لفرص التوفير.`);
        }
        
        // Rec 2: Compare member to average
        if(memberData.length > 1) {
          const avgExpensePerMember = totalCurrentMonth / memberData.length;
          const highSpender = memberData.find(m => m.amount > avgExpensePerMember * 1.3); // 30% above average
          if (highSpender) {
            recommendations.push(`معدل إنفاق ${highSpender.name} أعلى من متوسط إنفاق أفراد العائلة. يمكن مناقشة أسباب ذلك.`);
          }
        }

        // Rec 3: Collective saving suggestion
        const diningCategory = categoryData.find(c => c.name === "طعام");
        if (diningCategory && diningCategory.amount > 0) {
          const potentialSaving = Math.round(diningCategory.amount * 0.20);
          recommendations.push(`إذا قمتم بتخفيض مصاريف الطعام والوجبات الخارجية بنسبة 20%، يمكنكم توفير حوالي ${potentialSaving.toLocaleString('ar-SA')} ر.س شهرياً.`);
        } else if (categoryData.length > 0) {
           const potentialSaving = Math.round(categoryData[0].amount * 0.15);
           recommendations.push(`بتقليل الإنفاق في فئة "${categoryData[0].name}" بنسبة 15%، يمكنكم توفير ما يقارب ${potentialSaving.toLocaleString('ar-SA')} ر.س.`);
        }
        
        recommendations.push("هذا التوفير المحتمل يقرّبكم من تحقيق أهدافكم المالية المشتركة، مثل السفر أو شراء سيارة.");
      }

      setReportData({
        totalExpenses: totalCurrentMonth,
        comparison,
        memberCount: familyMembers.length,
        categoryData,
        memberData,
        recommendations
      });
      
    } catch (e) {
      console.error("Failed to generate report:", e);
      setError("حدث خطأ غير متوقع أثناء إنشاء التقرير.");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-emerald-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-lg font-medium">جاري إعداد تقرير العائلة...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="max-w-2xl mx-auto text-center py-12">
             <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">خطأ في إنشاء التقرير</h2>
            <p className="text-red-600">{error}</p>
        </div>
    );
  }

  if (!reportData) {
    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <PieChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">لا توجد بيانات كافية</h2>
            <p className="text-gray-600">لم يتم العثور على مصاريف لهذا الشهر لإنشاء التقرير.</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800">
            تقرير مصاريف العائلة
          </h1>
          <p className="text-xl text-emerald-600 mt-2">
            {formatHijriMonth(new Date())}
          </p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SummaryCards 
          totalExpenses={reportData.totalExpenses}
          comparison={reportData.comparison}
          memberCount={reportData.memberCount}
        />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
          <CategoryBreakdown categoryData={reportData.categoryData} />
          <MemberBreakdown memberData={reportData.memberData} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <SmartRecommendations recommendations={reportData.recommendations} />
        </motion.div>
      </div>
    </div>
  );
}