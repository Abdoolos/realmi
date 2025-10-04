
import React, { useState, useEffect } from 'react';
import { Event } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, PlusCircle, Clock, Star, AlertTriangle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion } from 'framer-motion';

const TAG_COLORS = {
  "Ramadan": "bg-green-100 text-green-800 border-green-200",
  "EidFitr": "bg-sky-100 text-sky-800 border-sky-200",
  "EidAdha": "bg-blue-100 text-blue-800 border-blue-200",
  "BackToSchool": "bg-amber-100 text-amber-800 border-amber-200",
  "Other": "bg-slate-100 text-slate-800 border-slate-200"
};

const TAG_LABELS = {
  "Ramadan": "رمضان",
  "EidFitr": "عيد الفطر",
  "EidAdha": "عيد الأضحى",
  "BackToSchool": "العودة للمدارس",
  "Other": "أخرى"
};

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

// Helper function to delay between API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function UpcomingEvents({ onSelectEvent }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        await delay(1500); // Add delay to prevent rate limiting
        const allEvents = await Event.list("-date_gregorian");
        const today = new Date();
        
        const upcoming = allEvents.filter(event => {
          const eventDate = new Date(event.date_gregorian);
          const daysUntil = differenceInDays(eventDate, today);
          return daysUntil >= 0 && daysUntil <= 60;
        });

        setEvents(upcoming.sort((a,b) => new Date(a.date_gregorian) - new Date(b.date_gregorian)));
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("لا يمكن تحميل المناسبات في الوقت الحالي");
        setEvents([]); // Clear events on error
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const getDaysUntilEvent = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
    const eventD = new Date(eventDate);
    eventD.setHours(0, 0, 0, 0); // Normalize event date
    return differenceInDays(eventD, today);
  };

  return (
    <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
      <CardHeader>
        <CardTitle className="text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            مناسبات قادمة
          </div>
          <span className="text-sm font-normal text-emerald-600">
            خلال 60 يوماً ({events.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
            <p className="text-emerald-600 text-sm">جاري تحميل المناسبات...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-amber-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-emerald-600">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
            <p className="font-medium mb-1">لا توجد مناسبات قادمة</p>
            <p className="text-sm">يمكنك إضافتها من صفحة إدارة المناسبات</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => {
              const daysUntil = getDaysUntilEvent(event.date_gregorian);
              const isUrgent = daysUntil <= 14;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    isUrgent 
                      ? 'bg-amber-50/80 border-amber-200' 
                      : 'bg-emerald-50/50 border-emerald-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-emerald-800">{event.name}</h4>
                        {isUrgent && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2 text-sm text-emerald-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatHijriDate(event.date_gregorian)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                          TAG_COLORS[event.tag] || TAG_COLORS['Other']
                        }`}>
                          {TAG_LABELS[event.tag] || event.tag}
                        </span>
                        
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isUrgent
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          {daysUntil === 0 ? 'اليوم!' : 
                           daysUntil === 1 ? 'غداً' : 
                           `بعد ${daysUntil} يوم`}
                        </span>
                      </div>
                      
                      {event.note && (
                        <p className="text-xs text-emerald-600 mt-2 pr-2 border-r-2 border-emerald-200">
                          {event.note}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-emerald-300 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 shrink-0" 
                      onClick={() => onSelectEvent(event)}
                    >
                      <PlusCircle className="w-4 h-4 ml-2" />
                      ميزانية
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
