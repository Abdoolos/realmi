
import React, { useState, useEffect } from 'react';
import { Category } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Tags, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from "sonner";

// دالة تطبيع النص العربي
const normalizeArabic = (text) => {
  if (!text) return '';
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي') 
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F\u0670\u0671]/g, '') // حذف التشكيل
    .replace(/^ال/, '') // حذف أل التعريف
    .replace(/[٠-٩]/g, (d) => '0123456789'[d.charCodeAt(0) - 0x0660]) // تحويل الأرقام
    .toLowerCase().trim();
};

const EMOJI_OPTIONS = ["🍽️", "🏠", "🚗", "🏥", "🎉", "🛒", "⚡", "📚", "👕", "🎮", "💻", "🎵", "🏃", "✈️", "🎯"];
const COLOR_OPTIONS = [
  "#F59E0B", "#EF4444", "#10B981", "#3B82F6", "#8B5CF6", 
  "#F97316", "#06B6D4", "#84CC16", "#EC4899", "#6366F1"
];

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ 
    id: null, 
    name: '', 
    icon: '🏷️', 
    color: '#10B981', 
    type: 'custom' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      // جلب جميع الفئات بدون فرز من جهة الخادم
      const data = await Category.list();
      
      // فرز البيانات من جهة العميل
      const sortedData = data.sort((a, b) => {
        // الفئات الافتراضية أولاً
        if (a.type === 'default' && b.type !== 'default') return -1;
        if (a.type !== 'default' && b.type === 'default') return 1;
        // ثم الفرز حسب الاسم أبجدياً
        return a.name.localeCompare(b.name, 'ar');
      });

      setCategories(sortedData);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("فشل تحميل الفئات.");
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("اسم الفئة لا يمكن أن يكون فارغاً.");
      return;
    }

    // التحقق من التكرار مع التطبيع
    const normalizedNewName = normalizeArabic(formData.name.trim());
    const isDuplicate = categories.some(
      (cat) => normalizeArabic(cat.name) === normalizedNewName && cat.id !== formData.id
    );

    if (isDuplicate) {
      toast.error("هذه الفئة موجودة بالفعل.");
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryData = {
        name: formData.name.trim(),
        name_normalized: normalizedNewName,
        icon: formData.icon,
        color: formData.color,
        type: formData.type,
        is_active: true
      };

      if (formData.id) {
        await Category.update(formData.id, categoryData);
      } else {
        await Category.create(categoryData);
      }

      setFormData({ id: null, name: '', icon: '🏷️', color: '#10B981', type: 'custom' });
      loadCategories();
      toast.success(formData.id ? "تم تعديل الفئة بنجاح!" : "تمت إضافة الفئة بنجاح!");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("حدث خطأ أثناء حفظ الفئة.");
    }
    setIsSubmitting(false);
  };

  const handleEdit = (category) => {
    setFormData({
      id: category.id,
      name: category.name,
      icon: category.icon || '🏷️',
      color: category.color || '#10B981',
      type: category.type || 'custom'
    });
  };

  const handleDelete = async (id, categoryType) => {
    if (categoryType === 'default') {
      toast.error("لا يمكن حذف الفئات الافتراضية");
      return;
    }

    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟ سيؤثر ذلك على جميع البنود المرتبطة بها.")) {
      return;
    }

    try {
      await Category.delete(id);
      loadCategories();
      toast.success("تم حذف الفئة بنجاح!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("حدث خطأ أثناء حذف الفئة.");
    }
  };

  // إضافة فلترة لإزالة التكرار في العرض
  const getUniqueCategories = () => {
    const seen = new Set();
    const unique = [];
    // Iterate through categories, preferring 'default' types for duplicates if present
    for (const category of categories) {
      const normalizedName = normalizeArabic(category.name);
      if (!seen.has(normalizedName)) {
        seen.add(normalizedName);
        unique.push(category);
      } else {
        // If a duplicate is found and the existing one in 'unique' is 'custom'
        // while the current 'category' is 'default', replace it.
        const existingIndex = unique.findIndex(c => normalizeArabic(c.name) === normalizedName);
        if (existingIndex !== -1 && unique[existingIndex].type === 'custom' && category.type === 'default') {
          unique[existingIndex] = category; // Replace custom with default
        }
      }
    }
    return unique.sort((a, b) => {
        if (a.type === 'default' && b.type !== 'default') return -1;
        if (a.type !== 'default' && b.type === 'default') return 1;
        return a.name.localeCompare(b.name, 'ar');
    });
  };
  
  const uniqueCategories = getUniqueCategories();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
          <Tags className="w-8 h-8" />
          إدارة فئات المصاريف
        </h1>
        <p className="text-emerald-600 mt-1">أضف وعدّل الفئات التي تناسب نمط حياتك المالي</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100 sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <PlusCircle className="w-5 h-5" />
                {formData.id ? 'تعديل فئة' : 'إضافة فئة جديدة'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">اسم الفئة</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => handleChange('name', e.target.value)} 
                    placeholder="مثال: تعليم الأطفال"
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="icon">الرمز التعبيري</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {EMOJI_OPTIONS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                          formData.icon === emoji
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => handleChange('icon', emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="color">اللون</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {COLOR_OPTIONS.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color 
                            ? 'border-gray-800 scale-110' 
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleChange('color', color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-3 p-3 border border-dashed border-emerald-200 rounded-lg">
                    <span className="text-2xl">{formData.icon}</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: formData.color }}
                      />
                      <span className="text-emerald-800 font-medium">{formData.name || 'اسم الفئة'}</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <PlusCircle className="w-4 h-4 ml-2" />
                  {isSubmitting ? 'جاري الحفظ...' : (formData.id ? 'حفظ التعديل' : 'إضافة الفئة')}
                </Button>

                {formData.id && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => setFormData({ id: null, name: '', icon: '🏷️', color: '#10B981', type: 'custom' })}
                  >
                    إلغاء التعديل
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800">
                قائمة الفئات ({uniqueCategories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uniqueCategories.length === 0 ? (
                <div className="text-center py-12 text-emerald-600">
                  <Tags className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد فئات مُسجلة</h3>
                  <p className="text-sm">ابدأ بإضافة أول فئة لك لتنظيم مصاريفك</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الفئة</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uniqueCategories.map(category => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{category.icon || '🏷️'}</span>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color || '#10B981' }}
                                />
                                <span className="font-medium">{category.name}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={category.type === 'default' ? "default" : "outline"}>
                              {category.type === 'default' ? 'افتراضية' : 'مخصصة'}
                            </Badge>
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(category.id, category.type)}
                              disabled={category.type === 'default'}
                            >
                              <Trash2 className={`w-4 h-4 ${category.type === 'default' ? 'text-gray-400' : 'text-red-500'}`} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
