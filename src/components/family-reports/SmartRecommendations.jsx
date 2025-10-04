import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle } from 'lucide-react';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
};

export default function SmartRecommendations({ expenses, income, budgets }) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount_in_sar, 0);
    const savings = income - totalExpenses;

    let recommendations = [];

    // توصية عامة بناءً على الادخار
    if (income > 0) {
        if (savings > income * 0.2) {
            recommendations.push({
                type: 'positive',
                text: `ادخار ممتاز! لقد وفرتم ما يزيد عن 20% من دخلكم. فكروا في استثمار جزء من المبلغ.`,
            });
        } else if (savings > 0) {
            recommendations.push({
                type: 'positive',
                text: `عمل جيد! أنتم ضمن الميزانية هذا الشهر. استمروا في الإدارة المالية الجيدة.`,
            });
        } else {
            recommendations.push({
                type: 'warning',
                text: `تنبيه: مصاريفكم تجاوزت دخلكم بمقدار ${formatCurrency(Math.abs(savings))}. يُنصح بمراجعة النفقات.`,
            });
        }
    }

    // توصية بناءً على أعلى فئة إنفاق
    const categoryTotals = expenses.reduce((acc, expense) => {
        const category = expense.categoryName || 'غير محدد';
        acc[category] = (acc[category] || 0) + expense.amount_in_sar;
        return acc;
    }, {});

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] > totalExpenses * 0.3) {
        recommendations.push({
            type: 'info',
            text: `ملاحظة: فئة "${topCategory[0]}" تشكل ${((topCategory[1] / totalExpenses) * 100).toFixed(0)}% من إجمالي مصاريفكم. قد ترغبون في مراجعتها.`,
        });
    }

    return (
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    توصيات ذكية للعائلة
                </CardTitle>
            </CardHeader>
            <CardContent>
                {recommendations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>لا توجد توصيات حاليًا. أضف المزيد من البيانات للحصول على نصائح مخصصة.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {recommendations.map((rec, index) => (
                            <li key={index} className={`flex items-start gap-3 p-3 rounded-lg ${rec.type === 'warning' ? 'bg-red-50/70' : 'bg-emerald-50/70'}`}>
                                {rec.type === 'warning' ? 
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" /> : 
                                    <Lightbulb className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                                }
                                <p className={`text-sm ${rec.type === 'warning' ? 'text-red-800' : 'text-emerald-800'}`}>
                                    {rec.text}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}