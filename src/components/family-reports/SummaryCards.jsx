import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
};

const SummaryCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
        <Card className={`rtl-shadow bg-white/90 backdrop-blur-sm border-${color}-100 hover:shadow-lg transition-all duration-300`}>
            <CardHeader className="pb-3">
                <CardTitle className={`text-sm font-medium text-${color}-600 flex items-center gap-2`}>
                    <Icon className="w-4 h-4" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold text-${color}-700 mb-2`}>
                    {typeof value === 'number' ? formatCurrency(value) : value}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export default function SummaryCards({ totalIncome, totalExpenses, savings, membersCount }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard title="إجمالي دخل العائلة" value={totalIncome} icon={TrendingUp} color="emerald" delay={0.1} />
            <SummaryCard title="إجمالي مصاريف العائلة" value={totalExpenses} icon={TrendingDown} color="red" delay={0.2} />
            <SummaryCard title="المدخرات العائلية" value={savings} icon={PiggyBank} color={savings >= 0 ? "amber" : "red"} delay={0.3} />
            <SummaryCard title="أفراد العائلة" value={membersCount} icon={Users} color="blue" delay={0.4} />
        </div>
    );
}