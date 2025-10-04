
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ar } from "date-fns/locale"; // Only ar locale is needed now
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Helper for Hijri formatting
const formatHijriDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = {
    calendar: 'islamic-umalqura',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Riyadh'
  };
  return new Intl.DateTimeFormat('ar-SA', { ...defaultOptions, ...options }).format(date);
};

export default function ExpenseTrends({ expenses, selectedMonth }) {
  const getDailyExpenses = () => {
    const dailyTotals = {};
    
    expenses.forEach(expense => {
      // ✅ إصلاح: التأكد من وجود تاريخ صحيح
      if (expense.date) {
        const day = expense.date.split('T')[0]; // أخذ التاريخ فقط
        dailyTotals[day] = (dailyTotals[day] || 0) + (expense.amount || 0);
      }
    });

    // إنشاء بيانات لجميع أيام الشهر
    const year = parseInt(selectedMonth.split('-')[0]);
    const month = parseInt(selectedMonth.split('-')[1]); // month is 1-indexed from selectedMonth string
    
    // To get the number of days in the month, `new Date(year, month, 0)`
    // where `month` is 1-indexed will give the last day of that month.
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const dailyData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${selectedMonth}-${day.toString().padStart(2, '0')}`;
      dailyData.push({
        // `day` for XAxis label (e.g., "1", "15")
        day: day.toString(), 
        amount: dailyTotals[dateString] || 0,
        // `fullDate` for tooltip (e.g., "١٥ رمضان ١٤٤٥")
        fullDate: formatHijriDate(dateString)
      });
    }

    return dailyData;
  };

  const getWeeklyExpenses = () => {
    const weeklyTotals = {};
    
    expenses.forEach(expense => {
      // ✅ إصلاح: التأكد من وجود تاريخ صحيح
      if (expense.date) {
        const date = new Date(expense.date);
        // Calculate week number based on day of month, grouping into 7-day chunks
        // Example: Day 1-7 is week 1, Day 8-14 is week 2, etc.
        const weekNumber = Math.ceil(date.getDate() / 7); 
        const weekKey = `الأسبوع ${weekNumber}`;
        weeklyTotals[weekKey] = (weeklyTotals[weekKey] || 0) + (expense.amount || 0);
      }
    });

    // Convert weeklyTotals object to an array for Recharts
    // Sort by week number to ensure correct order
    return Object.entries(weeklyTotals)
      .map(([week, amount]) => ({
        week,
        amount
      }))
      .sort((a, b) => {
        const weekNumA = parseInt(a.week.replace('الأسبوع ', ''));
        const weekNumB = parseInt(b.week.replace('الأسبوع ', ''));
        return weekNumA - weekNumB;
      });
  };

  const dailyData = getDailyExpenses();
  const weeklyData = getWeeklyExpenses();
  const totalDays = dailyData.length;
  const daysWithExpenses = dailyData.filter(day => day.amount > 0).length;
  const averageDaily = dailyData.reduce((sum, day) => sum + day.amount, 0) / totalDays;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // For daily data, fullDate will be available. For weekly data, week will be available.
      const displayLabel = payload[0].payload.fullDate || payload[0].payload.week;
      return (
        <div className="bg-white p-3 border border-emerald-200 rounded-lg shadow-lg">
          <p className="font-medium text-emerald-800">{displayLabel}</p>
          <p className="text-emerald-600">
            {payload[0].value.toLocaleString('ar-SA')} ر.س
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-600">
              متوسط المصروف اليومي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {averageDaily.toLocaleString('ar-SA', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ر.س
            </div>
          </CardContent>
        </Card>

        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">
              أيام الإنفاق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {daysWithExpenses} من {totalDays}
            </div>
          </CardContent>
        </Card>

        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-600">
              أعلى مصروف يومي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {Math.max(...dailyData.map(d => d.amount || 0)).toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800">المصاريف اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" // Changed to 'day' to show day numbers
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#059669" 
                  strokeWidth={2}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#D97706' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800">المصاريف الأسبوعية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#D97706" 
                  strokeWidth={3}
                  dot={{ fill: '#D97706', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
