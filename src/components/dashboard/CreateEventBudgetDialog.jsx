import React, { useState, useEffect } from 'react';
import { Budget } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function CreateEventBudgetDialog({ event, onOpenChange, onBudgetCreated }) {
  const [income, setIncome] = useState('');
  const [target, setTarget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestBudget, setLatestBudget] = useState(null);

  useEffect(() => {
    // Reset state when dialog is closed (event is null)
    if (!event) {
      setIncome('');
      setTarget('');
      setLatestBudget(null);
      return;
    }

    const fetchLatestBudget = async () => {
      try {
        const budgets = await Budget.list('-month', 1);
        if (budgets.length > 0 && budgets[0]) {
          setLatestBudget(budgets[0]);
          // Ensure monthly_income is a valid number before setting it
          if (typeof budgets[0].monthly_income === 'number') {
            setIncome(String(budgets[0].monthly_income));
          }
        }
      } catch (error) {
        console.error("Failed to fetch latest budget:", error);
      }
    };
    
    fetchLatestBudget();
    
  }, [event]);

  const handleSubmit = async () => {
    if (!income || !event) return;
    setIsSubmitting(true);
    
    const budgetMonth = format(new Date(event.date_gregorian), 'yyyy-MM-01');

    try {
      await Budget.create({
        monthly_income: parseFloat(income),
        target_amount: target ? parseFloat(target) : 0,
        month: budgetMonth,
        event_id: event.id
      });
      onBudgetCreated();
    } catch (error) {
      console.error("Failed to create budget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOpen = !!event;
  const eventDate = event?.date_gregorian ? new Date(event.date_gregorian) : new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>إنشاء ميزانية لـ "{event?.name}"</DialogTitle>
          <DialogDescription>
            خطط لمصاريف هذه المناسبة بشكل مسبق.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Alert variant="default" className="bg-emerald-50 border-emerald-200">
            <AlertDescription>
              سيتم إنشاء ميزانية لشهر {format(eventDate, 'MMMM yyyy', { locale: ar })}.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="income">الدخل المتوقع لهذا الشهر (ر.س)</Label>
            <Input id="income" type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="مثال: 8000" />
            {latestBudget && (
              <p className="text-xs text-gray-500 mt-1">
                آخر دخل شهري سجلته كان: {latestBudget.monthly_income.toLocaleString('ar-SA')} ر.س
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">المبلغ المستهدف للادخار (ر.س) (اختياري)</Label>
            <Input id="target" type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="مثال: 1000" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !income}>
            {isSubmitting ? "جاري الإنشاء..." : "إنشاء الميزانية"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}