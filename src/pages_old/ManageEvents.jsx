
import React, { useState, useEffect } from "react";
import { Event } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, CalendarPlus, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";
import { motion } from "framer-motion";

const TAG_OPTIONS = [
  { value: "Ramadan", label: "رمضان", color: "bg-green-100 text-green-800" },
  { value: "EidFitr", label: "عيد الفطر", color: "bg-sky-100 text-sky-800" },
  { value: "EidAdha", label: "عيد الأضحى", color: "bg-blue-100 text-blue-800" },
  { value: "BackToSchool", label: "العودة للمدارس", color: "bg-amber-100 text-amber-800" },
  { value: "Other", label: "أخرى", color: "bg-slate-100 text-slate-800" }
];

// Helper for Hijri formatting
const formatHijriDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const defaultOptions = {
    calendar: 'islamic-umalqura',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Riyadh'
  };
  return new Intl.DateTimeFormat('ar-SA', { ...defaultOptions, ...options }).format(date);
};

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date_gregorian: "",
    tag: "",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await Event.list("-date_gregorian");
    setEvents(data);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date_gregorian || !formData.tag) return;

    setIsSubmitting(true);
    try {
      await Event.create(formData);
      setFormData({ name: "", date_gregorian: "", tag: "", note: "" });
      loadEvents();
    } catch (error) {
      console.error("Error creating event:", error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await Event.delete(id);
      loadEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const getTagInfo = (tag) => {
    return TAG_OPTIONS.find(option => option.value === tag) || TAG_OPTIONS[TAG_OPTIONS.length - 1];
  };

  const getDaysUntilEvent = (eventDate) => {
    const today = new Date();
    return differenceInDays(new Date(eventDate), today);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
          <CalendarPlus className="w-8 h-8" />
          إدارة المناسبات
        </h1>
        <p className="text-emerald-600 mt-1">أضف مناسباتك السنوية لتخطيط ميزانيتك بشكل أفضل</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1"
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100 sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <PlusCircle className="w-5 h-5" />
                إضافة مناسبة جديدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">اسم المناسبة</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => handleChange('name', e.target.value)} 
                    placeholder="مثال: رمضان 1446"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="date">التاريخ الميلادي</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={formData.date_gregorian} 
                    onChange={e => handleChange('date_gregorian', e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="tag">نوع المناسبة</Label>
                  <Select value={formData.tag} onValueChange={value => handleChange('tag', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المناسبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {TAG_OPTIONS.map(tag => (
                        <SelectItem key={tag.value} value={tag.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${tag.color.split(' ')[0]}`} />
                            {tag.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="note">ملاحظات (اختيارية)</Label>
                  <Textarea 
                    id="note" 
                    value={formData.note} 
                    onChange={e => handleChange('note', e.target.value)}
                    placeholder="ملاحظات إضافية حول المناسبة..."
                    rows={3}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !formData.name || !formData.date_gregorian || !formData.tag} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? "جاري الإضافة..." : "إضافة المناسبة"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2"
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-800">
                قائمة المناسبات ({events.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-12 text-emerald-600">
                  <CalendarPlus className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد مناسبات مُسجلة</h3>
                  <p className="text-sm">ابدأ بإضافة أول مناسبة لك لتخطيط ميزانيتك بشكل أفضل</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المناسبة</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>المتبقي</TableHead>
                        <TableHead>إجراء</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map(event => {
                        const tagInfo = getTagInfo(event.tag);
                        const daysUntil = getDaysUntilEvent(event.date_gregorian);
                        const isPast = daysUntil < 0;
                        
                        return (
                          <TableRow key={event.id} className={isPast ? "opacity-50" : ""}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{event.name}</div>
                                {event.note && (
                                  <div className="text-xs text-gray-500 mt-1">{event.note}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatHijriDate(event.date_gregorian)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${tagInfo.color} border`}>
                                {tagInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className={`text-sm ${
                                  isPast ? 'text-red-500' : 
                                  daysUntil <= 30 ? 'text-amber-600 font-medium' : 
                                  'text-gray-600'
                                }`}>
                                  {isPast ? `مضى ${Math.abs(daysUntil)} يوم` : `${daysUntil} يوم`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDelete(event.id)}
                                className="hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
