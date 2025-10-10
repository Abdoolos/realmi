'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tags, Plus, Edit2, Trash2, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Mock data
  const mockCategories = categories.length > 0 ? categories : [
    { id: 1, name: 'طعام', color: '#10B981', icon: '🍽️', count: 45 },
    { id: 2, name: 'مواصلات', color: '#3B82F6', icon: '🚗', count: 32 },
    { id: 3, name: 'تسوق', color: '#EF4444', icon: '🛒', count: 28 },
    { id: 4, name: 'صحة', color: '#8B5CF6', icon: '🏥', count: 15 },
    { id: 5, name: 'تعليم', color: '#F59E0B', icon: '📚', count: 12 },
    { id: 6, name: 'ترفيه', color: '#EC4899', icon: '🎮', count: 18 },
    { id: 7, name: 'فواتير', color: '#6B7280', icon: '📄', count: 8 },
    { id: 8, name: 'أخرى', color: '#84CC16', icon: '📦', count: 22 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">إدارة الفئات</h1>
          <p className="text-emerald-600 mt-2">تنظيم وإدارة فئات المصاريف</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة فئة جديدة
        </Button>
      </motion.div>

      {/* Add Category Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-xl text-emerald-800">إضافة فئة جديدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input placeholder="اسم الفئة" />
                <Input placeholder="الأيقونة (emoji)" />
                <Input type="color" defaultValue="#10B981" />
                <div className="flex gap-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    حفظ
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    إلغاء
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.count} مصروف</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    className="text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    نشط
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
