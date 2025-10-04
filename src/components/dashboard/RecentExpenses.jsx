
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { motion } from "framer-motion";
import { Clock, Trash2, Users } from "lucide-react"; // إضافة أيقونة العائلة

const categoryColors = {
  "طعام": "bg-orange-100 text-orange-800 border-orange-200",
  "سكن": "bg-blue-100 text-blue-800 border-blue-200",
  "مواصلات": "bg-green-100 text-green-800 border-green-200",
  "صحة": "bg-red-100 text-red-800 border-red-200",
  "تسلية": "bg-purple-100 text-purple-800 border-purple-200",
  "أخرى": "bg-slate-100 text-slate-800 border-slate-200"
};

// Helper for Hijri formatting
const formatHijriDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = {
    calendar: 'islamic-umalqura',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Riyadh' // Specify a time zone relevant to Saudi Arabia
  };
  return new Intl.DateTimeFormat('ar-SA', { ...defaultOptions, ...options }).format(date);
};

export default function RecentExpenses({ expenses = [], onDeleteExpense }) {
  const recentExpenses = expenses.slice(0, 5);

  const handleDelete = async (expenseId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
      if (onDeleteExpense) {
        await onDeleteExpense(expenseId);
      }
    }
  };

  return (
    <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
      <CardHeader>
        <CardTitle className="text-emerald-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          آخر المصاريف
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentExpenses.length === 0 ? (
          <div className="text-center py-8 text-emerald-600">
            <p>لم تقم بإضافة أي مصاريف بعد</p>
            <p className="text-sm mt-2">ابدأ بإضافة أول مصروف لك!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {/* ✅ إصلاح: التأكد من وجود قيم صحيحة قبل العرض */}
                    <Badge className={`${categoryColors[expense.categoryName || 'أخرى'] || categoryColors['أخرى']} border`}>
                      {expense.subcategoryName || expense.subcategory || 'غير محدد'}
                    </Badge>
                    <span className="text-sm text-emerald-600">
                      {formatHijriDate(expense.date)}
                    </span>
                    {/* ✅ إضافة: إظهار أيقونة إذا كان المصروف عائلياً */}
                    {expense.family_id && (
                        <Users className="w-4 h-4 text-emerald-500" title="مصروف عائلي" />
                    )}
                  </div>
                  {expense.note && (
                    <p className="text-sm text-emerald-700">{expense.note}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-emerald-800">
                    {(expense.amount || 0).toLocaleString('ar-SA')} ر.س
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-red-100"
                    title="حذف المصروف"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
