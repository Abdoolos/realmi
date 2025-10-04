import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
};

export default function MemberBreakdown({ expenses, members }) {
    const memberExpenses = members.map(member => {
        const memberExpensesList = expenses.filter(expense => expense.user_id === member.id);
        const totalAmount = memberExpensesList.reduce((sum, exp) => sum + (exp.amount_in_sar || exp.amount), 0);
        
        return {
            member,
            totalAmount,
            expenseCount: memberExpensesList.length
        };
    }).sort((a, b) => b.totalAmount - a.totalAmount);

    const totalFamilyExpenses = expenses.reduce((sum, exp) => sum + (exp.amount_in_sar || exp.amount), 0);

    return (
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    مصاريف أفراد العائلة
                </CardTitle>
            </CardHeader>
            <CardContent>
                {memberExpenses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>لا توجد مصاريف لعرضها.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {memberExpenses.map((memberData) => {
                            const percentage = totalFamilyExpenses > 0 ? (memberData.totalAmount / totalFamilyExpenses * 100) : 0;
                            
                            return (
                                <div key={memberData.member.id} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                                    <div className="flex-1">
                                        <div className="font-medium text-emerald-800">
                                            {memberData.member.full_name || memberData.member.email}
                                        </div>
                                        <div className="text-sm text-emerald-600">
                                            {memberData.expenseCount} مصروف
                                        </div>
                                        <div className="w-full bg-emerald-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-lg font-bold text-emerald-800">
                                            {formatCurrency(memberData.totalAmount)}
                                        </div>
                                        <div className="text-xs text-emerald-600">
                                            {percentage.toFixed(0)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}