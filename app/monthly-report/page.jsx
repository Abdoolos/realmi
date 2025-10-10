'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MonthlyReportPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    loadReportData();
  }, [selectedMonth]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports?month=${selectedMonth}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await fetch(`/api/reports/pdf?month=${selectedMonth}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `تقرير-شهري-${selectedMonth}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const formatCurrency = (amount) => {
    return `${(amount || 0).toLocaleString()} ر.س`;
  };

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split('-');
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const mockData = reportData || {
    totalExpenses: 12500,
    totalIncome: 15000,
    savingsRate: 16.7,
    topCategories: [
      { name: 'طعام', amount: 4200, percentage: 33.6 },
      { name: 'مواصلات', amount: 2800, percentage: 22.4 },
      { name: 'فواتير', amount: 2100, percentage: 16.8 },
      { name: 'تسوق', amount: 1800, percentage: 14.4 },
      { name: 'ترفيه', amount: 1600, percentage: 12.8 }
    ],
    dailyAverage: 403,
    comparison: {
      previousMonth: { expenses: 11200, change: 11.6 }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">التقرير الشهري</h1>
          <p className="text-emerald-600 mt-2">تحليل مفصل لمصاريفك الشهرية</p>
        </div>
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <Button
            onClick={downloadReport}
            className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white"
          >
            <Download className="w-4 h-4 ml-2" />
            تحميل PDF
          </Button>
        </div>
      </motion.div>

      {/* Month Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          تقرير شهر {formatMonth(selectedMonth)}
        </h2>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">إجمالي المصاريف</p>
                  <p className="text-2xl font-bold text-red-700">{formatCurrency(mockData.totalExpenses)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">إجمالي الدخل</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(mockData.totalIncome)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">معدل الادخار</p>
                  <p className="text-2xl font-bold text-blue-700">{mockData.savingsRate}%</p>
                </div>
                <PieChart className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">المتوسط اليومي</p>
                  <p className="text-2xl font-bold text-amber-700">{formatCurrency(mockData.dailyAverage)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Categories Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800">توزيع المصاريف حسب الفئات</CardTitle>
            <CardDescription>أكثر الفئات إنفاقاً خلال الشهر</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500" style={{
                    backgroundColor: `hsl(${160 + index * 30}, 70%, 50%)`
                  }}></div>
                  <span className="font-medium text-gray-800">{category.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    {category.percentage}%
                  </Badge>
                  <span className="font-bold text-emerald-600">{formatCurrency(category.amount)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison with Previous Month */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800">مقارنة مع الشهر السابق</CardTitle>
            <CardDescription>تحليل التغيير في نمط الإنفاق</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-lg">
              <div>
                <p className="text-gray-600 mb-2">التغيير في المصاريف</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-emerald-600">
                    {mockData.comparison.previousMonth.change > 0 ? '+' : ''}
                    {mockData.comparison.previousMonth.change}%
                  </span>
                  {mockData.comparison.previousMonth.change > 0 ? (
                    <TrendingUp className="w-5 h-5 text-red-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              <div className="text-left">
                <p className="text-gray-600 mb-2">الشهر السابق</p>
                <p className="text-xl font-semibold text-gray-800">
                  {formatCurrency(mockData.comparison.previousMonth.expenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">رؤى ذكية</CardTitle>
            <CardDescription className="text-blue-600">توصيات لتحسين إدارة المصاريف</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <p className="text-blue-700">
                إنفاقك على فئة "طعام" يمثل 33.6% من إجمالي مصاريفك. حاول تقليل هذه النسبة لتحسين ميزانيتك.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <p className="text-blue-700">
                معدل الادخار الحالي 16.7% جيد جداً! استمر في هذا المعدل أو حاول زيادته لتحقيق أهدافك المالية.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
              <p className="text-blue-700">
                زادت مصاريفك بنسبة 11.6% مقارنة بالشهر السابق. راجع الإنفاق غير الضروري.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
