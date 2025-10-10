'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  Calendar, 
  Target,
  DollarSign,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `${(amount || 0).toLocaleString()} ر.س`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Mock data for demonstration
  const mockData = analyticsData || {
    summary: {
      totalExpenses: 75000,
      averageMonthly: 12500,
      highestMonth: 18500,
      lowestMonth: 8200,
      totalCategories: 8,
      totalTransactions: 324
    },
    trends: {
      monthlyGrowth: -5.2,
      categoryGrowth: {
        'طعام': 12.3,
        'مواصلات': -8.5,
        'تسوق': 15.7,
        'فواتير': 2.1
      }
    },
    patterns: {
      peakSpendingDay: 'الجمعة',
      peakSpendingTime: '19:00 - 21:00',
      averageDailyExpense: 411,
      weekendVsWeekday: {
        weekend: 520,
        weekday: 360
      }
    },
    predictions: {
      nextMonthEstimate: 13200,
      yearEndProjection: 152000,
      savingsOpportunity: 1800
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
          <h1 className="text-3xl font-bold text-emerald-800">الإحصائيات والتحليلات</h1>
          <p className="text-emerald-600 mt-2">تحليل متقدم لأنماط إنفاقك المالي</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
            <option value="1year">آخر سنة</option>
            <option value="all">جميع الفترات</option>
          </select>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">إجمالي المصاريف</p>
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(mockData.summary.totalExpenses)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">متوسط شهري</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(mockData.summary.averageMonthly)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">إجمالي العمليات</p>
                  <p className="text-2xl font-bold text-purple-700">{mockData.summary.totalTransactions}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">متوسط يومي</p>
                  <p className="text-2xl font-bold text-amber-700">{formatCurrency(mockData.patterns.averageDailyExpense)}</p>
                </div>
                <Calendar className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
            <TabsTrigger value="patterns">الأنماط</TabsTrigger>
            <TabsTrigger value="predictions">التوقعات</TabsTrigger>
            <TabsTrigger value="insights">رؤى ذكية</TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-emerald-800">نمو المصاريف الشهري</CardTitle>
                  <CardDescription>التغيير في متوسط الإنفاق الشهري</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className={`flex items-center justify-center gap-2 mb-4 ${
                        mockData.trends.monthlyGrowth > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {mockData.trends.monthlyGrowth > 0 ? (
                          <TrendingUp className="w-8 h-8" />
                        ) : (
                          <TrendingDown className="w-8 h-8" />
                        )}
                        <span className="text-3xl font-bold">
                          {mockData.trends.monthlyGrowth > 0 ? '+' : ''}{mockData.trends.monthlyGrowth}%
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {mockData.trends.monthlyGrowth > 0 ? 'زيادة' : 'انخفاض'} في المصاريف مقارنة بالفترة السابقة
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-emerald-800">نمو الفئات</CardTitle>
                  <CardDescription>التغيير في إنفاق كل فئة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(mockData.trends.categoryGrowth).map(([category, growth]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">{category}</span>
                      <div className={`flex items-center gap-2 ${
                        growth > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {growth > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-bold">
                          {growth > 0 ? '+' : ''}{growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-emerald-800">أنماط الإنفاق الزمنية</CardTitle>
                  <CardDescription>متى تصرف أكثر؟</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-blue-600 font-medium">أكثر أيام الإنفاق</p>
                      <p className="text-xl font-bold text-blue-800">{mockData.patterns.peakSpendingDay}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div>
                      <p className="text-amber-600 font-medium">أكثر أوقات الإنفاق</p>
                      <p className="text-xl font-bold text-amber-800">{mockData.patterns.peakSpendingTime}</p>
                    </div>
                    <Activity className="w-8 h-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-emerald-800">مقارنة نهاية الأسبوع</CardTitle>
                  <CardDescription>الفرق في الإنفاق بين أيام العمل والعطلة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-green-600 font-medium">متوسط أيام العمل</p>
                        <p className="text-xl font-bold text-green-800">
                          {formatCurrency(mockData.patterns.weekendVsWeekday.weekday)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">يوماً / 5 أيام</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div>
                        <p className="text-purple-600 font-medium">متوسط نهاية الأسبوع</p>
                        <p className="text-xl font-bold text-purple-800">
                          {formatCurrency(mockData.patterns.weekendVsWeekday.weekend)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">يوماً / يومين</div>
                    </div>

                    <div className="text-center p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600">
                        تصرف {Math.round((mockData.patterns.weekendVsWeekday.weekend / mockData.patterns.weekendVsWeekday.weekday - 1) * 100)}% 
                        أكثر في نهاية الأسبوع
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">توقع الشهر القادم</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700 mb-2">
                      {formatCurrency(mockData.predictions.nextMonthEstimate)}
                    </p>
                    <p className="text-blue-600 text-sm">بناءً على أنماطك الحالية</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">إجمالي نهاية السنة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-700 mb-2">
                      {formatCurrency(mockData.predictions.yearEndProjection)}
                    </p>
                    <p className="text-green-600 text-sm">توقع المصاريف السنوية</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-800">فرصة الادخار</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-700 mb-2">
                      {formatCurrency(mockData.predictions.savingsOpportunity)}
                    </p>
                    <p className="text-amber-600 text-sm">إمكانية التوفير الشهري</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-emerald-800">رؤى وتوصيات ذكية</CardTitle>
                <CardDescription>تحليلات مخصصة لتحسين إدارتك المالية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-red-500 mt-1" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-2">تحذير: زيادة في الإنفاق</h4>
                        <p className="text-red-700 text-sm">
                          لاحظنا زيادة 15.7% في فئة "تسوق" هذا الشهر. راجع مشترياتك غير الضرورية.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">فرصة للتوفير</h4>
                        <p className="text-green-700 text-sm">
                          يمكنك توفير 1,800 ر.س شهرياً عبر تقليل إنفاق نهاية الأسبوع بنسبة 20%.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <PieChart className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">نمط إنفاق مثالي</h4>
                        <p className="text-blue-700 text-sm">
                          إنفاقك على "مواصلات" انخفض 8.5% - هذا توجه إيجابي! استمر في هذا النهج.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-purple-500 mt-1" />
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-2">نصيحة التوقيت</h4>
                        <p className="text-purple-700 text-sm">
                          أكثر إنفاقك يحدث يوم الجمعة مساءً. خطط لميزانية محددة لهذا اليوم.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
