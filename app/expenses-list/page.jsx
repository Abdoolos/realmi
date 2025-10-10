'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Filter, Edit2, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ExpensesListPage() {
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
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
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
          setExpenses(expenses.filter(expense => expense.id !== id));
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         expense.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">قائمة المصاريف</h1>
          <p className="text-emerald-600 mt-2">إدارة وعرض جميع مصاريفك</p>
        </div>
        <Link href="/add-expense">
          <Button className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مصروف جديد
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في المصاريف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">جميع الفئات</option>
                <option value="طعام">طعام</option>
                <option value="مواصلات">مواصلات</option>
                <option value="تسوق">تسوق</option>
                <option value="صحة">صحة</option>
                <option value="تعليم">تعليم</option>
                <option value="ترفيه">ترفيه</option>
                <option value="فواتير">فواتير</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="grid gap-4">
        {filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد مصاريف</h3>
              <p className="text-gray-500 mb-6">لم يتم العثور على أي مصاريف مطابقة للبحث</p>
              <Link href="/add-expense">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  إضافة أول مصروف
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {expense.description || 'مصروف'}
                        </h3>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                          {expense.category || 'غير محدد'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {expense.date ? new Date(expense.date).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </span>
                        {expense.notes && (
                          <span className="text-gray-500">
                            {expense.notes}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <div className="text-2xl font-bold text-emerald-600">
                          {expense.amount ? `${expense.amount.toLocaleString()} ر.س` : '0 ر.س'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log('Edit expense:', expense.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Summary */}
      {filteredExpenses.length > 0 && (
        <Card className="bg-gradient-to-r from-emerald-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-emerald-800">إجمالي المصاريف</h3>
                <p className="text-emerald-600">عدد العمليات: {filteredExpenses.length}</p>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0).toLocaleString()} ر.س
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
