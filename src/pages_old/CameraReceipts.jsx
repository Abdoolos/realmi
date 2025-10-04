import { useState, useEffect } from "react";
import { Expense, Category } from "@/api/entities";
import { UploadFile, ExtractDataFromUploadedFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Upload, Loader2, CheckCircle, XCircle, Eye, Save, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CameraReceipts() {
  const [categories, setCategories] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await Category.list("name");
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const processReceipts = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    const processedReceipts = [];

    try {
      for (const file of selectedFiles) {
        // Upload file first
        const { file_url } = await UploadFile({ file });
        
        // Define schema for AI extraction
        const json_schema = {
          type: "object",
          properties: {
            amount: { type: "number", description: "المبلغ الإجمالي للفاتورة" },
            category: { type: "string", description: "فئة المصروف المناسبة بناءً على محتوى الفاتورة" },
            date: { type: "string", format: "date", description: "تاريخ الفاتورة" },
            notes: { type: "string", description: "وصف موجز لمحتويات الفاتورة أو اسم المتجر" },
            merchant_name: { type: "string", description: "اسم المتجر أو التاجر" }
          },
          required: ["amount"]
        };

        try {
          const result = await ExtractDataFromUploadedFile({ file_url, json_schema });
          
          const receipt = {
            id: Date.now() + Math.random(),
            file_name: file.name,
            file_url: file_url,
            status: result.status === 'success' ? 'processed' : 'failed',
            extracted_data: result.status === 'success' ? result.output : null,
            error: result.status === 'error' ? result.details : null,
            // Default values with extracted data
            amount: result.output?.amount || "",
            category: result.output?.category || "",
            date: result.output?.date || new Date().toISOString().split('T')[0],
            notes: result.output?.notes || result.output?.merchant_name || "",
            merchant_name: result.output?.merchant_name || ""
          };
          
          processedReceipts.push(receipt);
        } catch (error) {
          console.error("Error processing receipt:", error);
          processedReceipts.push({
            id: Date.now() + Math.random(),
            file_name: file.name,
            file_url: file_url,
            status: 'failed',
            error: error.message,
            amount: "",
            category: "",
            date: new Date().toISOString().split('T')[0],
            notes: "",
            merchant_name: ""
          });
        }
      }
    } catch (error) {
      console.error("Error in batch processing:", error);
    }

    setReceipts(processedReceipts);
    setSelectedFiles([]);
    setIsProcessing(false);
  };

  const updateReceiptData = (receiptId, field, value) => {
    setReceipts(prev => prev.map(receipt => 
      receipt.id === receiptId 
        ? { ...receipt, [field]: value }
        : receipt
    ));
  };

  const saveReceiptAsExpense = async (receipt) => {
    if (!receipt.amount || !receipt.category) {
      alert("يرجى التأكد من إدخال المبلغ والفئة");
      return;
    }

    try {
      await Expense.create({
        amount: parseFloat(receipt.amount),
        category: receipt.category,
        date: receipt.date,
        notes: receipt.notes || receipt.merchant_name,
        invoice_url: receipt.file_url
      });

      // Mark as saved
      setReceipts(prev => prev.map(r => 
        r.id === receipt.id 
          ? { ...r, status: 'saved' }
          : r
      ));
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("حدث خطأ أثناء حفظ المصروف");
    }
  };

  const removeReceipt = (receiptId) => {
    setReceipts(prev => prev.filter(r => r.id !== receiptId));
  };

  const saveAllReceipts = async () => {
    const validReceipts = receipts.filter(r => 
      r.status === 'processed' && r.amount && r.category
    );

    for (const receipt of validReceipts) {
      await saveReceiptAsExpense(receipt);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
          <Camera className="w-8 h-8" />
          فواتير الكاميرا
        </h1>
        <p className="text-emerald-600 mt-1">ارفع صور فواتيرك وسيتم استخراج البيانات تلقائياً</p>
      </motion.div>

      {/* Upload Section */}
      <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            رفع الفواتير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receipt-files">اختر صور الفواتير</Label>
            <Input
              id="receipt-files"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="border-emerald-200"
            />
            {selectedFiles.length > 0 && (
              <p className="text-sm text-emerald-600">
                تم اختيار {selectedFiles.length} ملف
              </p>
            )}
          </div>

          <Button
            onClick={processReceipts}
            disabled={selectedFiles.length === 0 || isProcessing}
            className="bg-emerald-600 hover:bg-emerald-700 w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري معالجة الفواتير...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 ml-2" />
                معالجة الفواتير ({selectedFiles.length})
              </>
            )}
          </Button>

          {isProcessing && (
            <Alert>
              <AlertDescription>
                جاري تحليل الفواتير باستخدام الذكاء الاصطناعي. قد يستغرق هذا بضع ثوانٍ لكل فاتورة.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {receipts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-emerald-800">
                  نتائج المعالجة ({receipts.length})
                </CardTitle>
                <Button
                  onClick={saveAllReceipts}
                  disabled={receipts.filter(r => r.status === 'processed' && r.amount && r.category).length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الكل
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {receipts.map((receipt) => (
                    <motion.div
                      key={receipt.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-emerald-200 rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Camera className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-emerald-800">{receipt.file_name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {receipt.status === 'processed' && (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 ml-1" />
                                  تم التحليل
                                </Badge>
                              )}
                              {receipt.status === 'failed' && (
                                <Badge className="bg-red-100 text-red-800">
                                  <XCircle className="w-3 h-3 ml-1" />
                                  فشل في التحليل
                                </Badge>
                              )}
                              {receipt.status === 'saved' && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  <CheckCircle className="w-3 h-3 ml-1" />
                                  تم الحفظ
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.open(receipt.file_url, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeReceipt(receipt.id)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      {receipt.status === 'failed' && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            فشل في تحليل الفاتورة: {receipt.error}
                          </AlertDescription>
                        </Alert>
                      )}

                      {receipt.status === 'processed' && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>المبلغ (ر.س)</Label>
                            <Input
                              type="number"
                              value={receipt.amount}
                              onChange={(e) => updateReceiptData(receipt.id, 'amount', e.target.value)}
                              className="border-emerald-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>الفئة</Label>
                            <Select
                              value={receipt.category}
                              onValueChange={(value) => updateReceiptData(receipt.id, 'category', value)}
                            >
                              <SelectTrigger className="border-emerald-200">
                                <SelectValue placeholder="اختر الفئة" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.name}>
                                    <div className="flex items-center gap-2">
                                      <span>{category.emoji || '🏷️'}</span>
                                      <span>{category.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>التاريخ</Label>
                            <Input
                              type="date"
                              value={receipt.date}
                              onChange={(e) => updateReceiptData(receipt.id, 'date', e.target.value)}
                              className="border-emerald-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>ملاحظات</Label>
                            <Input
                              value={receipt.notes}
                              onChange={(e) => updateReceiptData(receipt.id, 'notes', e.target.value)}
                              placeholder="وصف المصروف..."
                              className="border-emerald-200"
                            />
                          </div>
                        </div>
                      )}

                      {receipt.status === 'processed' && (
                        <div className="flex justify-end">
                          <Button
                            onClick={() => saveReceiptAsExpense(receipt)}
                            disabled={!receipt.amount || !receipt.category}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Save className="w-4 h-4 ml-2" />
                            حفظ كمصروف
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {receipts.length === 0 && !isProcessing && (
        <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
          <CardContent className="text-center py-12">
            <Camera className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">
              لا توجد فواتير محملة
            </h3>
            <p className="text-emerald-600">
              ابدأ برفع صور فواتيرك لمعالجتها تلقائياً
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
