import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart, Tag } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border rounded shadow-lg">
                <p className="font-semibold">{`${payload[0].name}`}</p>
                <p className="text-sm">{`المبلغ: ${formatCurrency(payload[0].value)}`}</p>
                <p className="text-xs text-gray-500">{`النسبة: ${(payload[0].payload.percent * 100).toFixed(0)}%`}</p>
            </div>
        );
    }
    return null;
};

export default function CategoryBreakdown({ expenses }) {
    const categoryTotals = expenses.reduce((acc, expense) => {
        const category = expense.categoryName || 'غير محدد';
        acc[category] = (acc[category] || 0) + expense.amount_in_sar;
        return acc;
    }, {});

    const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

    const chartData = Object.entries(categoryTotals)
        .map(([name, value]) => ({
            name,
            value,
            percent: totalExpenses > 0 ? value / totalExpenses : 0,
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    توزيع المصاريف حسب الفئة
                </CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <BarChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>لا توجد مصاريف لعرضها.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={(value, entry) => <span className="text-gray-700">{value}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}