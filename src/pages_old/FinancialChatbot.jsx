import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot, Send, MessageCircle, Sparkles, HelpCircle, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllFAQs, getFAQCategories, searchFAQs } from '../agents/knowledgeBase';

export default function FinancialChatbot() {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const scrollAreaRef = useRef(null);
  const searchInputRef = useRef(null);

  const allFAQs = getAllFAQs();
  const categories = getFAQCategories();

  // الأسئلة المفلترة حسب البحث والفئة
  const filteredFAQs = React.useMemo(() => {
    let faqs = allFAQs;

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      faqs = searchFAQs(searchQuery);
    }

    // فلترة حسب الفئة
    if (selectedCategory !== 'الكل') {
      faqs = faqs.filter(faq => faq.category === selectedCategory);
    }

    return faqs;
  }, [searchQuery, selectedCategory, allFAQs]);

  // تمرير تلقائي للأسفل عند إضافة رسائل جديدة
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleQuestionClick = (faq) => {
    // إضافة السؤال كرسالة من المستخدم
    const userMessage = {
      role: 'user',
      content: faq.question,
      timestamp: new Date()
    };

    // إضافة الجواب كرسالة من البوت
    const botMessage = {
      role: 'assistant',
      content: faq.answer,
      timestamp: new Date(),
      category: faq.category,
      categoryIcon: faq.categoryIcon
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-800">مساعد ريال مايند</h1>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
        <p className="text-emerald-600 max-w-2xl mx-auto">
          اختر سؤالك من القائمة أو ابحث عن إجابة لسؤالك
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* قائمة الأسئلة */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-4"
        >
          {/* البحث */}
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-800 text-sm flex items-center gap-2">
                <Search className="w-4 h-4" />
                بحث في الأسئلة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن سؤالك..."
                  className="border-emerald-200 focus:border-emerald-500 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* الفئات */}
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-800 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                الفئات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => setSelectedCategory('الكل')}
                className={`w-full text-right p-2 rounded-lg transition-colors text-sm ${
                  selectedCategory === 'الكل'
                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>الكل</span>
                  <Badge variant="outline" className="text-xs">
                    {allFAQs.length}
                  </Badge>
                </div>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-right p-2 rounded-lg transition-colors text-sm ${
                    selectedCategory === cat.name
                      ? 'bg-emerald-100 text-emerald-700 font-semibold'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {cat.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* قائمة الأسئلة */}
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-emerald-800 text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  الأسئلة الشائعة
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {filteredFAQs.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2 pr-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">لم يتم العثور على أسئلة</p>
                    </div>
                  ) : (
                    filteredFAQs.map((faq) => (
                      <motion.button
                        key={faq.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuestionClick(faq)}
                        className="w-full text-right p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 text-sm text-emerald-700"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg flex-shrink-0">{faq.categoryIcon}</span>
                          <span className="flex-1 line-clamp-2">{faq.question}</span>
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* نافذة المحادثة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="rtl-shadow bg-white/95 backdrop-blur-sm border-emerald-100 h-[700px] flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-800 text-base">مساعد ريال مايند</CardTitle>
                    <p className="text-xs text-emerald-600">جاهز للإجابة على أسئلتك</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                    {messages.length / 2} محادثة
                  </Badge>
                  {messages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearChat}
                      className="text-xs"
                    >
                      مسح المحادثة
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <Separator />
            
            {/* منطقة الرسائل */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800 mb-2">
                      مرحباً بك في مساعد ريال مايند! 👋
                    </h3>
                    <p className="text-emerald-600 mb-6">
                      اختر أي سؤال من القائمة على اليمين للحصول على الإجابة
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>{allFAQs.length} سؤال متاح</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{categories.length} فئة</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white'
                              : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-1">
                            {message.role === 'assistant' && (
                              <Bot className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-1" />
                            )}
                            {message.categoryIcon && (
                              <span className="text-lg flex-shrink-0">{message.categoryIcon}</span>
                            )}
                            <div className="flex-1">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.content}
                              </p>
                              {message.category && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs bg-white/50">
                                    {message.category}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs opacity-70 text-left mt-1">
                            {message.timestamp.toLocaleTimeString('ar-SA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </ScrollArea>
            
            <Separator />
            
            {/* منطقة الإرشادات */}
            <div className="p-4 flex-shrink-0 bg-emerald-50/50">
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-700">
                <HelpCircle className="w-4 h-4" />
                <span>اضغط على أي سؤال من القائمة للحصول على الإجابة الفورية</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
