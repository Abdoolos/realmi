
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { Family } from '@/api/entities';
import { MonthlyIncome } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, Users, Plus, Edit, Trash2, DollarSign, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, startOfMonth } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

// Helper for Hijri formatting
const formatHijriMonth = (gregorianMonth) => {
  const date = new Date(gregorianMonth + '-01');
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Riyadh'
  }).format(date);
};

export default function FamilyIncome() {
  const [currentUser, setCurrentUser] = useState(null);
  const [family, setFamily] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [monthlyIncomes, setMonthlyIncomes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  
  // Form states - تصحيح اسم الحقل
  const [memberIncome, setMemberIncome] = useState({
    user_id: '',
    main_amount: '',
    target_savings: '',
    // is_shared: false // This will be forced to true for family income
  });

  const loadFamilyData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get current user
      const user = await User.me();
      setCurrentUser(user);

      if (!user.family_id) {
        setIsLoading(false);
        return;
      }

      // Load family info
      const familyInfo = await Family.get(user.family_id);
      setFamily(familyInfo);

      // Load family members
      const members = await User.filter({ family_id: user.family_id });
      setFamilyMembers(members);

      // ✅ إصلاح: جلب جميع الدخل المشترك ثم تصفيته حسب الشهر لضمان الموثوقية
      const allSharedIncomes = await MonthlyIncome.filter({ 
        family_id: user.family_id,
        is_shared: true 
      });
      
      const monthStart = selectedMonth + '-01';
      const incomesForMonth = allSharedIncomes.filter(inc => inc.month === monthStart);
      
      setMonthlyIncomes(incomesForMonth);

    } catch (error) {
      console.error("Error loading family data:", error);
    }
    setIsLoading(false);
  }, [selectedMonth]); // The dependency is correct, no need to add user since it's fetched inside.

  useEffect(() => {
    loadFamilyData();
  }, [loadFamilyData]);

  const handleAddIncome = async () => {
    if (!memberIncome.user_id || !memberIncome.main_amount) return;
    
    try {
      const monthStart = selectedMonth + '-01';
      // تصحيح اسم الحقل في البيانات المرسلة
      const incomeData = {
        user_id: memberIncome.user_id,
        family_id: currentUser.family_id,
        month: monthStart,
        main_amount: parseFloat(memberIncome.main_amount),
        side_amount: 0, // إضافة قيمة افتراضية
        target_savings: memberIncome.target_savings ? parseFloat(memberIncome.target_savings) : null,
        // ✅ تحديث: التأكد من أن الدخل المضاف هو دخل مشترك
        is_shared: true
      };

      if (editingIncome) {
        await MonthlyIncome.update(editingIncome.id, incomeData);
        toast.success("تم تحديث الدخل بنجاح!");
      } else {
        await MonthlyIncome.create(incomeData);
        toast.success("تم إضافة الدخل المشترك بنجاح!");
      }

      setShowAddDialog(false);
      setEditingIncome(null);
      // إعادة تعيين النموذج
      setMemberIncome({ user_id: '', main_amount: '', target_savings: '' }); // Removed is_shared from state reset
      loadFamilyData();
    } catch (error) {
      console.error("Error saving income:", error);
      toast.error("حدث خطأ في حفظ البيانات");
    }
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    // تصحيح قراءة البيانات من الكائن
    setMemberIncome({
      user_id: income.user_id,
      main_amount: income.main_amount?.toString() || '',
      target_savings: income.target_savings?.toString() || '',
      // is_shared: income.is_shared // This will always be true now
    });
    setShowAddDialog(true);
  };

  const handleDeleteIncome = async (incomeId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الدخل؟")) return;
    
    try {
      await MonthlyIncome.delete(incomeId);
      toast.success("تم حذف الدخل بنجاح!");
      loadFamilyData();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("حدث خطأ في حذف الدخل");
    }
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const value = format(date, 'yyyy-MM');
    const label = `${formatHijriMonth(value)} (${value})`;
    return { value, label };
  });

  // Calculate totals - تصحيح الحسابات
  const totalFamilyIncome = monthlyIncomes.reduce((sum, income) => sum + (income.main_amount || 0) + (income.side_amount || 0), 0);
  const totalTargetSavings = monthlyIncomes.reduce((sum, income) => sum + (income.target_savings || 0), 0);
  const sharedIncome = monthlyIncomes.reduce((sum, income) => sum + (income.main_amount || 0) + (income.side_amount || 0), 0); // is_shared is implicit now

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!currentUser?.family_id) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <Wallet className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
        <h2 className="text-xl font-bold text-emerald-800">انضم لعائلة أولاً</h2>
        <p className="text-emerald-600 mt-2 mb-6">
          هذه الصفحة مخصصة لإدارة الدخل العائلي. يجب أن تكون عضواً في عائلة للوصول إليها.
        </p>
        <Link to={createPageUrl("MyFamily")}>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Users className="w-4 h-4 ml-2" />
            إدارة العائلة
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <Link to={createPageUrl("MyFamily")}>
            <Button variant="outline" className="border-emerald-200 hover:bg-emerald-50">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للعائلة
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
              <Wallet className="w-8 h-8" />
              {/* ✅ تحديث: توضيح العنوان */}
              الدخل العائلي المشترك
            </h1>
            <p className="text-emerald-600 mt-1">
              عائلة "{family?.family_name}" • {formatHijriMonth(selectedMonth)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-64 border-emerald-200">
              <SelectValue placeholder="اختر الشهر" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 ml-2" />
            {/* ✅ تحديث: توضيح الزر */}
            إضافة دخل مشترك
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rtl-shadow bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-600 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                إجمالي دخل العائلة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700">
                {totalFamilyIncome.toLocaleString('ar-SA')} ر.س
              </div>
              <p className="text-sm text-emerald-600">{monthlyIncomes.length} مصدر دخل</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rtl-shadow bg-gradient-to-br from-amber-50 to-white border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-600 text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                الدخل المشترك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">
                {sharedIncome.toLocaleString('ar-SA')} ر.س
              </div>
              <p className="text-sm text-amber-600">
                {((sharedIncome / (totalFamilyIncome || 1)) * 100).toFixed(1)}% من الإجمالي
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rtl-shadow bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-600 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                هدف الادخار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">
                {totalTargetSavings.toLocaleString('ar-SA')} ر.س
              </div>
              <p className="text-sm text-blue-600">
                {((totalTargetSavings / (totalFamilyIncome || 1)) * 100).toFixed(1)}% معدل الادخار المستهدف
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rtl-shadow bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-600 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                متوسط الدخل للفرد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                {familyMembers.length > 0 ? (totalFamilyIncome / familyMembers.length).toLocaleString('ar-SA') : '0'} ر.س
              </div>
              <p className="text-sm text-purple-600">{familyMembers.length} أعضاء</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Income Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800">تفاصيل الدخل الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyIncomes.length === 0 ? (
              <div className="text-center py-8 text-emerald-600">
                <Wallet className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
                <p className="text-lg font-medium">لم يتم تحديد دخل شهري لهذا الشهر</p>
                <p className="text-sm mt-2">اضغط على "إضافة دخل" لبدء تسجيل دخل العائلة</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العضو</TableHead>
                    <TableHead>المبلغ الأساسي</TableHead>
                    <TableHead>هدف الادخار</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyIncomes.map((income) => {
                    const member = familyMembers.find(m => m.id === income.user_id);
                    return (
                      <TableRow key={income.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-emerald-600">
                                {member?.full_name?.charAt(0) || '؟'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{member?.full_name || 'مستخدم غير معروف'}</div>
                              <div className="text-sm text-gray-500">{member?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-emerald-700">
                            {/* تصحيح عرض المبلغ */}
                            {(income.main_amount || 0).toLocaleString('ar-SA')} ر.س
                          </div>
                        </TableCell>
                        <TableCell>
                          {income.target_savings ? (
                            <div className="text-blue-600">
                              {income.target_savings.toLocaleString('ar-SA')} ر.س
                            </div>
                          ) : (
                            <span className="text-gray-400">لم يحدد</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={'default'}>
                            مشترك
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditIncome(income)}
                              className="border-emerald-200 hover:bg-emerald-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteIncome(income.id)}
                              className="border-red-200 hover:bg-red-50 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Income Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(isOpen) => { if (!isOpen) setEditingIncome(null); setShowAddDialog(isOpen); }}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {/* ✅ تحديث: توضيح العنوان */}
              {editingIncome ? 'تعديل الدخل المشترك' : 'إضافة دخل مشترك جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="member">العضو</Label>
              <Select 
                value={memberIncome.user_id} 
                onValueChange={(value) => setMemberIncome({...memberIncome, user_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر عضو العائلة" />
                </SelectTrigger>
                <SelectContent>
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.full_name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="main_amount">المبلغ الأساسي (ريال سعودي)</Label>
              <Input
                id="main_amount"
                type="number"
                placeholder="مثال: 8000"
                value={memberIncome.main_amount}
                onChange={(e) => setMemberIncome({...memberIncome, main_amount: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="target_savings">هدف الادخار (اختياري)</Label>
              <Input
                id="target_savings"
                type="number"
                placeholder="مثال: 1000"
                value={memberIncome.target_savings}
                onChange={(e) => setMemberIncome({...memberIncome, target_savings: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                إلغاء
              </Button>
              <Button 
                onClick={handleAddIncome}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!memberIncome.user_id || !memberIncome.main_amount}
              >
                {editingIncome ? 'حفظ التعديل' : 'إضافة الدخل'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
