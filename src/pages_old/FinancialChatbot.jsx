import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot, User as UserIcon, Send, MessageCircle, Sparkles, Plus, BarChart3, Wallet, ArrowRight, Mic, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentSDK } from '../agents';
import { User } from '../api/entities';
import MessageBubble from '../components/ai/MessageBubble';
import { toast } from 'sonner';
import { getAllFAQs } from '../agents/knowledgeBase';

// الأسئلة الشائعة السريعة (أول 7 أسئلة)
const QUICK_FAQS = getAllFAQs().slice(0, 7);

export default function FinancialChatbot() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);

  // تهيئة المحادثة
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);

        // إنشاء محادثة جديدة مع المساعد المالي
        const newConversation = await agentSDK.createConversation({
          agent_name: "FinancialAssistant",
          metadata: {
            name: "محادثة المساعد المالي",
            description: "محادثة لإدارة المصاريف والدخل"
          }
        });

        setConversation(newConversation);

        // بدء بدون رسائل (نافذة فارغة)
        setMessages([]);

      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("حدث خطأ في تهيئة المحادثة");
      }
      setIsInitializing(false);
    };

    initializeChat();
  }, []);

  // الاشتراك في تحديثات المحادثة
  useEffect(() => {
    if (!conversation?.id) return;

    const unsubscribe = agentSDK.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [conversation?.id]);

  // تمرير تلقائي للأسفل عند إضافة رسائل جديدة
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversation || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      await agentSDK.addMessage(conversation, {
        role: 'user',
        content: userMessage
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("حدث خطأ في إرسال الرسالة");
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSampleMessage = (sampleText) => {
    setInputMessage(sampleText);
    inputRef.current?.focus();
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Bot className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <p className="text-emerald-600">جاري تهيئة المساعد المالي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          <h1 className="text-3xl font-bold text-emerald-800">المساعد المالي الذكي</h1>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
        <p className="text-emerald-600 max-w-2xl mx-auto">
          تحدث معي بطريقة طبيعية لإدارة مصاريفك ودخلك. اكتب "صرفت 50 ريال على طعام" أو "كم صرفت هذا الشهر؟"
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* أمثلة سريعة */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-4"
        >
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-800 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                أسئلة سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {QUICK_FAQS.map((faq) => (
                <motion.button
                  key={faq.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSampleMessage(faq.question)}
                  className="w-full text-right p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 text-sm text-emerald-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{faq.categoryIcon}</span>
                    <span className="flex-1 line-clamp-2">{faq.question}</span>
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>

          {/* إحصائيات سريعة */}
          <Card className="rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-800 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                اختصارات مفيدة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => handleSampleMessage("اعرض ملخص مصاريف هذا الشهر")}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-blue-700"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">ملخص شهري</span>
              </button>
              <button
                onClick={() => handleSampleMessage("أضف راتبي الشهري")}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-green-700"
              >
                <Wallet className="w-4 h-4" />
                <span className="text-sm">إضافة دخل</span>
              </button>
              <button
                onClick={() => handleSampleMessage("أضف مصروف جديد")}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-purple-700"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">إضافة مصروف</span>
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/* نافذة المحادثة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <Card className="rtl-shadow bg-white/95 backdrop-blur-sm border-emerald-100 h-[600px] flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-800 text-base">المساعد المالي</CardTitle>
                    <p className="text-xs text-emerald-600">متصل - جاهز لمساعدتك</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  نشط
                </Badge>
              </div>
            </CardHeader>
            
            <Separator />
            
            {/* منطقة الرسائل */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <MessageBubble message={message} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-emerald-50 rounded-2xl px-4 py-3 border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-emerald-600" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
            
            <Separator />
            
            {/* منطقة الإدخال */}
            <div className="p-4 flex-shrink-0">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك هنا... مثل: صرفت 50 ريال على طعام"
                    className="border-emerald-200 focus:border-emerald-500 min-h-[44px] text-base"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1 px-1">
                    اضغط Enter للإرسال، أو Shift+Enter لسطر جديد
                  </p>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 min-h-[44px] px-6"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
