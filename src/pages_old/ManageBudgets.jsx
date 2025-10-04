
import React, { useState, useEffect } from 'react';
import { CategoryBudget, Category } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Target, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function ManageBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM-01'));
  const [formData, setFormData] = useState({ id: null, category: '', limit_amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBudgets();
    loadCategories();
  }, [currentMonth]);

  const loadBudgets = async () => {
    // The previous filter was too complex. This simpler filter correctly fetches
    // budgets for the selected month by matching the exact 'YYYY-MM-01' string.
    const data = await CategoryBudget.filter({ month: currentMonth });
    setBudgets(data);
  };

  const loadCategories = async () => {
    try {
      const data = await Category.list("name"); 
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  };

  const handleMonthChange = (value) => {
    setCurrentMonth(value + '-01');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.limit_amount) return;

    setIsSubmitting(true);
    try {
      const budgetData = {
        category: formData.category,
        limit_amount: parseFloat(formData.limit_amount),
        month: currentMonth
      };

      if (formData.id) {
        await CategoryBudget.update(formData.id, budgetData);
      } else {
        await CategoryBudget.create(budgetData);
      }

      setFormData({ id: null, category: '', limit_amount: '' });
      loadBudgets();
    } catch (error) {
      console.error("Error saving budget:", error);
    }
    setIsSubmitting(false);
  };

  const handleEdit = (budget) => {
    setFormData({
      id: budget.id,
      category: budget.category,
      limit_amount: String(budget.limit_amount)
    });
  };

  const handleDelete = async (id) => {
    try {
      await CategoryBudget.delete(id);
      loadBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy', { locale: ar })
    };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
          <Target className="w-8 h-8" />
          إدارة الميزانيات الشهرية
        </h1>
        <p className="text-emerald-600 mt-1">حدد سقف الإنفاق لكل فئة لتلقي توصيات ذكية.</p>
      </motion.div>

      <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-emerald-800">
            ميزانية شهر: {format(new Date(currentMonth), 'MMMM yyyy', { locale: ar })}
          </CardTitle>
          <Select value={format(new Date(currentMonth), 'yyyy-MM')} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-48 border-emerald-200">
              <SelectValue placeholder="اختر الشهر" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(month => (
                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-dashed border-emerald-200 rounded-lg">
                <h3 className="font-semibold text-lg text-emerald-700">{formData.id ? 'تعديل الحد' : 'إضافة حد جديد'}</h3>
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={value => handleChange('category', value)}
                    disabled={!!formData.id}
                  >
                    <SelectTrigger><SelectValue placeholder="اختر فئة..." /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem 
                          key={cat.id} 
                          value={cat.name} 
                          disabled={budgets.some(b => b.category === cat.name && b.id !== formData.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span>{cat.emoji || '🏷️'}</span> 
                            <span>{cat.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="limit_amount">حد الإنفاق (ر.س)</Label>
                  <Input 
                    id="limit_amount" 
                    type="number"
                    value={formData.limit_amount}
                    onChange={e => handleChange('limit_amount', e.target.value)} 
                    placeholder="مثال: 1500"
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                  <PlusCircle className="w-4 h-4 ml-2" />
                  {isSubmitting ? 'جاري الحفظ...' : (formData.id ? 'حفظ التعديل' : 'إضافة حد')}
                </Button>
                {formData.id && (
                  <Button variant="ghost" className="w-full" onClick={() => setFormData({ id: null, category: '', limit_amount: '' })}>
                    إلغاء التعديل
                  </Button>
                )}
              </form>
            </div>
            <div className="lg:col-span-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الفئة</TableHead>
                    <TableHead>حد الإنفاق الشهري</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.length > 0 ? budgets.map(budget => (
                    <TableRow key={budget.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{budget.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{budget.limit_amount.toLocaleString('ar-SA')} ر.س</TableCell>
                      <TableCell className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)}>
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan="3" className="text-center text-gray-500 py-8">
                        لم يتم تحديد أي ميزانيات لهذا الشهر.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
