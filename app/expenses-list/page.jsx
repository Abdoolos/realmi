'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Edit2, Trash2, Plus, ArrowRight, Receipt } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ExpensesListPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenses(Array.isArray(data) ? data : []);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      try {
        const response = await fetch(`/api/expenses/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setExpenses(prev => Array.isArray(prev) ? prev.filter(expense => expense.id !== id) : []);
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  // التأكد من أن expenses هو array قبل الفلترة
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  
  const filteredExpenses = safeExpenses.filter(expense => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         expense.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-emerald-700 font-medium">جاري تحميل المصاريف...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-emerald-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="border-emerald-200 hover:bg-emerald-50"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-emerald-800">قائمة المصاريف</h1>
              <p className="text-emerald-600 mt-2 text-lg">إدارة وعرض جميع مصاريفك بسهولة</p>
            </div>
            <Link href="/add-expense">
              <Button className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white shadow-lg">
                <Plus className="w-5 h-5 ml-2" />
                إضافة مصروف جديد
              </Button>
            </Link>
          </div>

          {/* Filters Card */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-emerald-100">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                  <Input
                    placeholder="🔍 ابحث في المصاريف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-12 text-lg border-emerald-200 focus:border-emerald-500 h-12"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-3 text-lg border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="all">🏷️ جميع الفئات</option>
                  <option value="طعام">🍽️ طعام</option>
                  <option value="مواصلات">🚗 مواصلات</option>
                  <option value="تسوق">🛍️ تسوق</option>
                  <option value="صحة">🏥 صحة</option>
                  <option value="تعليم">📚 تعليم</option>
                  <option value="ترفيه">🎉 ترفيه</option>
                  <option value="فواتير">🧾 فواتير</option>
                  <option value="أخرى">❓ أخرى</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Summary */}
        {filteredExpenses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-emerald-500 to-amber-500 text-white shadow-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-emerald-50 text-sm mb-1">عدد المصاريف</p>
                    <p className="text-3xl font-bold">{filteredExpenses.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-50 text-sm mb-1">إجمالي المبلغ</p>
                    <p className="text-3xl font-bold">
                      {filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0).toLocaleString()} ر.س
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-50 text-sm mb-1">متوسط المصروف</p>
                    <p className="text-3xl font-bold">
                      {filteredExpenses.length > 0 
                        ? Math.round(filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0) / filteredExpenses.length).toLocaleString()
                        : 0
                      } ر.س
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Expenses List */}
        <div className="space-y-4">
          {filteredExpenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="mb-12"
            >
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-emerald-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400"></div>
                <CardContent className="p-16 text-center">
                  <div className="text-emerald-200 mb-6">
                    <Receipt className="w-24 h-24 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">لا توجد مصاريف</h3>
                  <p className="text-gray-500 mb-8 text-lg">
                    {searchTerm || filterCategory !== 'all' 
                      ? 'لم يتم العثور على مصاريف مطابقة للبحث' 
                      : 'ابدأ بإضافة أول مصروف لك'}
                  </p>
                  <Link href="/add-expense">
                    <Button className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white text-lg px-8 py-6">
                      <Plus className="w-5 h-5 ml-2" />
                      إضافة أول مصروف
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 border-emerald-100 hover:border-emerald-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-800">
                            {expense.description || 'مصروف'}
                          </h3>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1">
                            {expense.category || 'غير محدد'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                          <span className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span className="font-medium">
                              {expense.date ? new Date(expense.date).toLocaleDateString('ar-SA') : 'غير محدد'}
                            </span>
                          </span>
                          {expense.notes && (
                            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                              📝 {expense.notes}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-emerald-600">
                            {expense.amount ? `${expense.amount.toLocaleString()}` : '0'}
                          </div>
                          <div className="text-sm text-emerald-500 font-medium">ريال سعودي</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log('Edit expense:', expense.id)}
                            className="hover:bg-emerald-50 hover:border-emerald-300"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
