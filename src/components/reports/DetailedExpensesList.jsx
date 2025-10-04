
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { List, Calendar } from "lucide-react";

const categoryColors = {
  "طعام": "bg-orange-100 text-orange-800 border-orange-200",
  "سكن": "bg-blue-100 text-blue-800 border-blue-200",
  "مواصلات": "bg-green-100 text-green-800 border-green-200",
  "صحة": "bg-red-100 text-red-800 border-red-200",
  "تسلية": "bg-purple-100 text-purple-800 border-purple-200"
};

// Helper for Hijri formatting
const formatHijriDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = {
    calendar: 'islamic-umalqura',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Riyadh' // Set a specific timezone if dates are stored in a specific local time
  };
  // Ensure the date object is valid before formatting
  if (isNaN(date.getTime())) {
    console.error("Invalid date string provided to formatHijriDate:", dateString);
    return dateString; // Return original string or an error message
  }
  return new Intl.DateTimeFormat('ar-SA', { ...defaultOptions, ...options }).format(date);
};

export default function DetailedExpensesList({ expenses }) {
  const groupExpensesByDate = (expenses) => {
    const grouped = {};
    expenses.forEach(expense => {
      const date = expense.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(expense);
    });
    return grouped;
  };

  const groupedExpenses = groupExpensesByDate(expenses);
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));

  return (
    <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
      <CardHeader>
        <CardTitle className="text-emerald-800 flex items-center gap-2">
          <List className="w-5 h-5" />
          تفاصيل جميع المصاريف
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-emerald-600">
            <p>لا توجد مصاريف لهذا الشهر</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {sortedDates.map((date) => (
              <div key={date} className="space-y-3">
                <div className="flex justify-between items-center sticky top-0 bg-white py-2 border-b border-emerald-100">
                  <h4 className="font-semibold text-emerald-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatHijriDate(date)}
                  </h4>
                  <div className="text-lg font-bold text-emerald-700">
                    {groupedExpenses[date].reduce((sum, expense) => sum + expense.amount, 0).toLocaleString('ar-SA')} ر.س
                  </div>
                </div>
                <div className="space-y-2 pr-6">
                  {groupedExpenses[date].map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/30 border border-emerald-100/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge className={`${categoryColors[expense.category]} border text-xs`}>
                            {expense.category}
                          </Badge>
                        </div>
                        {expense.notes && (
                          <p className="text-sm text-emerald-700">{expense.notes}</p>
                        )}
                      </div>
                      <div className="text-lg font-bold text-emerald-800">
                        {expense.amount.toLocaleString('ar-SA')} ر.س
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
