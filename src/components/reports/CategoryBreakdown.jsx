
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Progress } from "@/components/ui/progress";

export default function CategoryBreakdown({ expenses, totalExpenses }) {
  // Define CATEGORY_COLORS here so it's accessible within the component
  // and before getCategoryData is called.
  const CATEGORY_COLORS = {
    "طعام": "#F59E0B",
    "مواصلات": "#10B981",
    "سكن": "#3B82F6",
    "فواتير وخدمات": "#EF4444",
    "صحة": "#EC4899",
    "تعليم ودورات": "#8B5CF6",
    "ترفيه": "#F97316",
    "سفر": "#06B6D4",
    "تسوق عام": "#84CC16",
    "أعمال وشركة": "#6366F1",
    "احتياجات شخصية": "#14B8A6",
    "أخرى": "#6B7280"
  };

  const getCategoryData = () => {
    const categoryTotals = {};

    expenses.forEach(expense => {
      // ✅ إصلاح: التأكد من وجود فئة صحيحة قبل الإضافة
      const categoryName = expense.category;
      if (categoryName && categoryName !== 'غير مصنف' && categoryName !== 'undefined') {
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + expense.amount;
      }
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      // ✅ إصلاح: تجنب القسمة على صفر إذا كانت إجمالي المصاريف صفر
      percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0,
      fill: CATEGORY_COLORS[category] || "#6B7280" // Use the locally defined colors
    })).sort((a, b) => b.value - a.value);
  };

  const categoryData = getCategoryData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-emerald-200 rounded-lg shadow-lg">
          <p className="font-medium text-emerald-800">{data.payload.name}</p>
          <p className="text-emerald-600">
            {data.value.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
          </p>
          <p className="text-sm text-emerald-500">
            {data.payload.percentage}% من المصاريف
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
        <CardHeader>
          <CardTitle className="text-emerald-800">توزيع المصاريف حسب الفئة</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="text-center py-8 text-emerald-600">
              <p>لا توجد مصاريف لهذا الشهر</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color, fontWeight: 'medium' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
        <CardHeader>
          <CardTitle className="text-emerald-800">تفصيل الفئات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.fill }}
                    />
                    <span className="font-medium text-emerald-800">{category.name}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-emerald-700">
                      {category.value.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                    </div>
                    <div className="text-sm text-emerald-600">{category.percentage}%</div>
                  </div>
                </div>
                <Progress
                  value={parseFloat(category.percentage)}
                  className="h-2"
                  style={{
                    backgroundColor: '#f3f4f6'
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
