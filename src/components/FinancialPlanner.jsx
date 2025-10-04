
import { useState, useEffect, useCallback } from 'react';
import { FinancialPlan } from '@/api/entities';
import { Category } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { DollarSign, Goal, PlusCircle, Trash2, Save, Loader2, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const FinancialPlanner = () => {
    const [plan, setPlan] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const currentMonth = format(new Date(), 'yyyy-MM');

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const user = await User.me();

            const [planData, categoriesData] = await Promise.all([
                FinancialPlan.filter({ month: currentMonth, created_by: user.email }),
                Category.list()
            ]);

            // ✅ إصلاح التكرار: فلترة الفئات المكررة وتنظيفها
            const uniqueCategories = categoriesData
                .filter(c => c.is_active !== false)
                .filter((category, index, self) => 
                    index === self.findIndex(c => c.name === category.name)
                )
                .sort((a, b) => {
                    // ترتيب الفئات حسب الأولوية
                    if (a.type === 'default' && b.type !== 'default') return -1;
                    if (a.type !== 'default' && b.type === 'default') return 1;
                    return (a.sort_order || 0) - (b.sort_order || 0);
                });

            setCategories(uniqueCategories);

            if (planData.length > 0) {
                setPlan(planData[0]);
            } else {
                // إنشاء خطة جديدة مع الفئات المنظفة
                const initialExpenses = {};
                uniqueCategories.forEach(cat => {
                    initialExpenses[cat.name] = '';
                });

                setPlan({
                    plan_name: `خطة ${format(new Date(), 'MMMM yyyy', { locale: ar })}`,
                    month: currentMonth,
                    income: '',
                    expenses: initialExpenses,
                    goals: []
                });
            }
        } catch (error) {
            toast.error("فشل تحميل بيانات الخطة المالية.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [currentMonth]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handlePlanChange = (field, value) => {
        setPlan(p => ({ ...p, [field]: value }));
    };

    const handleExpenseChange = (categoryName, value) => {
        setPlan(p => ({
            ...p,
            expenses: {
                ...p.expenses,
                [categoryName]: value
            }
        }));
    };
    
    const handleGoalChange = (index, field, value) => {
        const newGoals = [...plan.goals];
        newGoals[index][field] = value;
        setPlan(p => ({ ...p, goals: newGoals }));
    };

    const addGoal = () => {
        setPlan(p => ({
            ...p,
            goals: [...(p.goals || []), { name: '', amount: '', timeline: '' }]
        }));
    };

    const removeGoal = (index) => {
        setPlan(p => ({ ...p, goals: p.goals.filter((_, i) => i !== index) }));
    };

    const savePlan = async () => {
        setIsSaving(true);
        try {
            const planData = {
                ...plan,
                income: parseFloat(plan.income) || 0,
                expenses: Object.entries(plan.expenses).reduce((acc, [key, value]) => ({
                    ...acc,
                    [key]: parseFloat(value) || 0
                }), {}),
                goals: plan.goals.map(g => ({
                    ...g,
                    amount: parseFloat(g.amount) || 0,
                    timeline: parseInt(g.timeline, 10) || 0,
                })),
            };

            if (plan.id) {
                await FinancialPlan.update(plan.id, planData);
            } else {
                await FinancialPlan.create(planData);
            }
            toast.success("تم حفظ الخطة بنجاح!");
            loadData(); // Reload to get the ID for new plans
        } catch (error) {
            toast.error("فشل حفظ الخطة.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };
    
    const totalExpenses = Object.values(plan?.expenses || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const totalGoals = (plan?.goals || []).reduce((sum, goal) => sum + (parseFloat(goal.amount) || 0), 0);
    const totalIncome = parseFloat(plan?.income) || 0;
    const remaining = totalIncome - totalExpenses - totalGoals;
    
    const chartData = Object.entries(plan?.expenses || {})
        .map(([name, value]) => ({ name, value: parseFloat(value) || 0 }))
        .filter(item => item.value > 0);

    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
          </div>
        );
    }
    
    if (!plan) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
                        <ClipboardList className="w-8 h-8" />
                        الخطة المالية لشهر {format(new Date(), 'MMMM yyyy', { locale: ar })}
                    </h1>
                    <p className="text-emerald-600 mt-1">
                        نظّم دخلك، مصاريفك، وأهدافك لتحقيق الاستقرار المالي.
                    </p>
                </div>
                <Button onClick={savePlan} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 min-w-[120px]">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 ml-2" /> حفظ الخطة</>}
                </Button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Income */}
                <Card className="rtl-shadow bg-green-50 border-green-200">
                    <CardHeader><CardTitle className="text-green-800">إجمالي الدخل</CardTitle></CardHeader>
                    <CardContent className="text-3xl font-bold text-green-700">{totalIncome.toLocaleString()} ر.س</CardContent>
                </Card>
                {/* Total Expenses */}
                <Card className="rtl-shadow bg-red-50 border-red-200">
                    <CardHeader><CardTitle className="text-red-800">إجمالي المصاريف</CardTitle></CardHeader>
                    <CardContent className="text-3xl font-bold text-red-700">{totalExpenses.toLocaleString()} ر.س</CardContent>
                </Card>
                {/* Savings Goals */}
                <Card className="rtl-shadow bg-blue-50 border-blue-200">
                    <CardHeader><CardTitle className="text-blue-800">إجمالي الأهداف</CardTitle></CardHeader>
                    <CardContent className="text-3xl font-bold text-blue-700">{totalGoals.toLocaleString()} ر.س</CardContent>
                </Card>
                 {/* Remaining */}
                <Card className={`rtl-shadow ${remaining >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
                    <CardHeader><CardTitle className={remaining >= 0 ? 'text-emerald-800' : 'text-orange-800'}>المتبقي</CardTitle></CardHeader>
                    <CardContent className={`text-3xl font-bold ${remaining >= 0 ? 'text-emerald-700' : 'text-orange-700'}`}>{remaining.toLocaleString()} ر.س</CardContent>
                </Card>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Income & Expenses */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rtl-shadow">
                        <CardHeader>
                            <CardTitle className="text-emerald-800 flex items-center gap-2"><DollarSign/>الدخل والمصاريف</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="income" className="text-lg font-semibold text-gray-700">الدخل الشهري المتوقع (ر.س)</Label>
                                <Input id="income" type="number" value={plan.income} onChange={(e) => handlePlanChange('income', e.target.value)} className="text-xl p-4 text-right mt-2"/>
                            </div>
                            <div className="space-y-4 pt-4">
                                <h3 className="text-lg font-semibold text-gray-700">ميزانية المصاريف الشهرية</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categories.map(cat => (
                                    <div key={`category-${cat.id}-${cat.name}`}>
                                        <Label htmlFor={`expense-${cat.id}`}>{cat.icon} {cat.name}</Label>
                                        <Input 
                                            id={`expense-${cat.id}`} 
                                            type="number" 
                                            placeholder="0" 
                                            value={plan.expenses[cat.name] || ''} 
                                            onChange={(e) => handleExpenseChange(cat.name, e.target.value)}
                                            className="text-right"
                                        />
                                    </div>
                                ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rtl-shadow">
                        <CardHeader>
                            <CardTitle className="text-emerald-800 flex items-center gap-2"><Goal/>الأهداف المالية</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {plan.goals.map((goal, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-3 bg-gray-50 rounded-lg">
                                    <div className="md:col-span-2">
                                        <Label>الهدف</Label>
                                        <Input placeholder="مثال: شراء سيارة" value={goal.name} onChange={(e) => handleGoalChange(index, 'name', e.target.value)}/>
                                    </div>
                                    <div>
                                        <Label>المبلغ (ر.س)</Label>
                                        <Input type="number" placeholder="5000" value={goal.amount} onChange={(e) => handleGoalChange(index, 'amount', e.target.value)} className="text-right" />
                                    </div>
                                    <div>
                                      <Button variant="ghost" size="icon" onClick={() => removeGoal(index)} className="text-red-500 hover:bg-red-100">
                                          <Trash2 className="w-5 h-5"/>
                                      </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addGoal}><PlusCircle className="w-4 h-4 ml-2"/>إضافة هدف جديد</Button>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Right Column: Chart */}
                <div className="lg:col-span-1">
                    <Card className="rtl-shadow sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-emerald-800">توزيع المصاريف</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <RechartsTooltip formatter={(value) => `${value.toLocaleString()} ر.س`} />
                                </PieChart>
                            </ResponsiveContainer>
                            <Legend payload={chartData.map((item, index) => ({ value: item.name, type: "square", color: COLORS[index % COLORS.length]}))} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FinancialPlanner;
