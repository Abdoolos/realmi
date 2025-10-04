
import React, { useState, useEffect, useCallback } from "react";
import { Expense } from "@/api/entities";
import { User as UserEntity } from "@/api/entities"; // Import User entity, renamed to UserEntity to avoid conflict with lucide-react User icon
import { Subcategory } from "@/api/entities";
import { Category } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { List, Calendar, Filter, Trash2, Paperclip, Users, User } from "lucide-react";

// Helper for Hijri formatting
const formatHijriDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = {
    calendar: 'islamic-umalqura',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Riyadh'
  };
  return new Intl.DateTimeFormat('ar-SA', { ...defaultOptions, ...options }).format(date);
};

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTimeFilter, setActiveTimeFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Add state for current user

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const user = await UserEntity.me(); // Use UserEntity for fetching user
            setCurrentUser(user);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setIsLoading(false); // Clear loading state even if user fetch fails
        }
    };
    fetchUser();
  }, []);

  const loadExpenses = useCallback(async () => {
    if (!currentUser) {
        setIsLoading(false); // Ensure loading is off if no user
        return; // Guard against running without a user
    }
    setIsLoading(true);
    try {
      // جلب البيانات من جميع الجداول
      // Fetch data specific to the current user
      const [expensesData, subcategoriesData, categoriesData] = await Promise.all([
        Expense.filter({ user_id: currentUser.id }, "-date"), // Filter by current user's ID
        Subcategory.list(),
        Category.list()
      ]);

      // إنشاء خرائط للوصول السريع للبيانات
      const subcategoriesMap = new Map(subcategoriesData.map(sub => [sub.id, sub]));
      const categoriesMap = new Map(categoriesData.map(cat => [cat.id, cat]));

      // دمج البيانات مع المصاريف
      const hydratedExpenses = expensesData.map(expense => {
        const subcategory = subcategoriesMap.get(expense.subcategory_id);
        const category = subcategory ? categoriesMap.get(subcategory.category_id) : null;
        
        return {
          ...expense,
          subcategoryName: subcategory ? subcategory.name : 'غير محدد',
          categoryName: category ? category.name : 'غير محدد',
          categoryColor: category ? category.color : '#6B7280',
          categoryIcon: category ? category.icon : '🏷️'
        };
      });

      setExpenses(hydratedExpenses);
      
      // فلترة الفئات لإزالة التكرار
      const uniqueCategories = categoriesData.filter((category, index, self) =>
        index === self.findIndex(c => c.name === category.name)
      );
      setCategories(uniqueCategories);

    } catch (error) {
      console.error("Error loading expenses:", error);
    }
    setIsLoading(false);
  }, [currentUser]); // Load expenses when user is available

  const filterExpenses = useCallback(() => {
    let filtered = [...expenses];

    // تصفية حسب الفئة
    if (activeFilter !== "all") {
      filtered = filtered.filter(expense => expense.categoryName === activeFilter);
    }

    // تصفية حسب الوقت
    const now = new Date();
    if (activeTimeFilter === "today") {
      const today = format(now, 'yyyy-MM-dd');
      filtered = filtered.filter(expense => expense.date.startsWith(today));
    } else if (activeTimeFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(expense => new Date(expense.date) >= weekAgo);
    } else if (activeTimeFilter === "month") {
      const currentMonth = format(now, 'yyyy-MM');
      filtered = filtered.filter(expense => expense.date.startsWith(currentMonth));
    }

    setFilteredExpenses(filtered);
  }, [expenses, activeFilter, activeTimeFilter]);


  useEffect(() => {
    if (currentUser) {
        loadExpenses();
    }
  }, [currentUser, loadExpenses]); // Load expenses when user is available

  useEffect(() => {
    // filterExpenses is now synchronous, so this is fine
    filterExpenses();
  }, [expenses, activeFilter, activeTimeFilter, filterExpenses]);

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
      try {
        await Expense.delete(id);
        loadExpenses(); // إعادة تحميل المصاريف
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("حدث خطأ أثناء حذف المصروف.");
      }
    }
  };

  const groupExpensesByDate = (expenses) => {
    const grouped = {};
    expenses.forEach(expense => {
      const date = expense.date.split('T')[0]; // أخذ التاريخ فقط
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(expense);
    });
    return grouped;
  };

  const groupedExpenses = groupExpensesByDate(filteredExpenses);
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
            <List className="w-8 h-8" />
            قائمة المصاريف
          </h1>
          <p className="text-emerald-600 mt-1">جميع مصاريفك مرتبة حسب التاريخ</p>
        </div>
        <div className="text-left">
          <div className="text-2xl font-bold text-emerald-800">
            {totalAmount.toLocaleString('ar-SA')} ر.س
          </div>
          <p className="text-sm text-emerald-600">إجمالي المصاريف المعروضة</p>
        </div>
      </motion.div>

      {/* فلاتر */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-emerald-800 flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              تصفية المصاريف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-emerald-700 mb-2">حسب الفترة الزمنية:</p>
              <Tabs value={activeTimeFilter} onValueChange={setActiveTimeFilter}>
                <TabsList className="grid w-full grid-cols-4 bg-emerald-50">
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="today">اليوم</TabsTrigger>
                  <TabsTrigger value="week">هذا الأسبوع</TabsTrigger>
                  <TabsTrigger value="month">هذا الشهر</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div>
              <p className="text-sm font-medium text-emerald-700 mb-2">حسب الفئة:</p>
              <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                <TabsList className={`grid w-full bg-emerald-50 ${categories.length > 6 ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6' : `grid-cols-${Math.min(categories.length + 1, 6)}`}`}>
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  {categories.map(category => (
                    <TabsTrigger key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* قائمة المصاريف */}
      <AnimatePresence>
        {Object.keys(groupedExpenses).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">لا توجد مصاريف</h3>
            <p className="text-emerald-600">لم يتم العثور على مصاريف تطابق المرشحات المحددة</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedExpenses)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .map(([date, dayExpenses], index) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-emerald-800 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          {formatHijriDate(date)}
                        </CardTitle>
                        <div className="text-lg font-bold text-emerald-700">
                          {dayExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString('ar-SA')} ر.س
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dayExpenses.map((expense) => (
                          <motion.div
                            key={expense.id}
                            whileHover={{ scale: 1.01 }}
                            className="flex items-center justify-between p-4 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 transition-all duration-200 border border-emerald-100"
                          >
                            {/* أزرار الإجراءات */}
                            <div className="flex items-center gap-2">
                                {expense.receipt_url && (
                                    <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer" title="عرض الفاتورة">
                                        <Paperclip className="w-4 h-4 text-emerald-600 hover:text-emerald-800" />
                                    </a>
                                )}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDelete(expense.id)}
                                    className="h-8 w-8 hover:bg-red-100"
                                    title="حذف المصروف"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                            
                            {/* معلومات المصروف */}
                            <div className="flex-1 text-right mr-4">
                              <div className="flex items-center justify-end gap-3 mb-2">
                                {/* أيقونة للتمييز بين المصروف الشخصي والعائلي */}
                                {expense.family_id ? (
                                    <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                                        <Users className="w-3 h-3 ml-1" />
                                        عائلي
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                                        <User className="w-3 h-3 ml-1" />
                                        شخصي
                                    </Badge>
                                )}
                                <Badge 
                                  className="border"
                                  style={{ 
                                    backgroundColor: expense.categoryColor + '20', 
                                    color: expense.categoryColor,
                                    borderColor: expense.categoryColor + '40'
                                  }}
                                >
                                  {expense.categoryIcon} {expense.subcategoryName}
                                </Badge>
                              </div>
                              {expense.note && (
                                <p className="text-emerald-700 text-sm text-right">{expense.note}</p>
                              )}
                            </div>

                            {/* المبلغ */}
                            <div className="text-xl font-bold text-emerald-800">
                              {expense.amount.toLocaleString('ar-SA')} ر.س
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
