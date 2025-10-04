
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Download, TrendingUp, TrendingDown, FileText } from "lucide-react";
import { format } from "date-fns";

// Helper for Hijri formatting
const formatHijriMonth = (gregorianMonth) => {
  // Input gregorianMonth is 'yyyy-MM'. We need a full date to format.
  // Use 'yyyy-MM-01' to create a Date object.
  // This ensures the formatter has a full date reference.
  const date = new Date(gregorianMonth + '-01');
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Riyadh' // Specify timezone for consistent Hijri calendar calculations
  }).format(date);
};

export default function MonthReportHeader({ 
  selectedMonth, 
  onMonthChange, 
  totalIncome, 
  totalExpenses, 
  onDownloadReport,
  onDownloadPDF
}) {
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  // Generate last 12 months options with Hijri display
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i); // This date object is Gregorian

    const gregorianValue = format(date, 'yyyy-MM'); // Keep Gregorian value for internal logic
    const hijriLabel = formatHijriMonth(gregorianValue); // Get Hijri label using the helper

    return {
      value: gregorianValue, // This value is used by the Select component to set the selected month
      label: `${hijriLabel} (${gregorianValue})` // Display both Hijri and Gregorian for clarity
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            التقرير الشهري
          </h1>
          <p className="text-emerald-600 mt-1">
            شهر: {formatHijriMonth(selectedMonth)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className="w-64 border-emerald-200"> {/* Increased width to accommodate longer labels */}
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
            variant="outline"
            onClick={onDownloadReport}
            className="border-emerald-200 hover:bg-emerald-50"
          >
            <Download className="w-4 h-4 ml-2" />
            تحميل Excel
          </Button>
          <Button
            variant="outline"
            onClick={onDownloadPDF}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <FileText className="w-4 h-4 ml-2" />
            تحميل PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-600">
              الدخل الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {/* Ensure Saudi Riyal symbol and locale for numbers */}
              {totalIncome.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>

        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-red-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600">
              إجمالي المصاريف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {/* Ensure Saudi Riyal symbol and locale for numbers */}
              {totalExpenses.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>

        <Card className={`rtl-shadow bg-white/90 backdrop-blur-sm ${
          savings >= 0 ? 'border-amber-100' : 'border-red-200'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${
              savings >= 0 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {savings >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              المدخرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              savings >= 0 ? 'text-amber-700' : 'text-red-700'
            }`}>
              {/* Ensure Saudi Riyal symbol and locale for numbers */}
              {Math.abs(savings).toLocaleString('ar-SA')} ر.س
              {savings < 0 && <span className="text-lg mr-2">-</span>}
            </div>
          </CardContent>
        </Card>

        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">
              معدل الادخار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              parseFloat(savingsRate) >= 0 ? 'text-blue-700' : 'text-red-700'
            }`}>
              {savingsRate}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
