
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { agentSDK } from '@/agents';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Send, Plus, AlertTriangle, RefreshCw, MessageSquare, Loader2, Archive, Search, Calendar, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import { getEnvironmentInfo, getProductionConfig } from '@/components/utils/envUtils';
import { safeApiCall } from '@/components/utils/apiUtils';

export default function AIAssistant() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeConversations, setActiveConversations] = useState([]);
  const [archivedConversations, setArchivedConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // حالات السجل المغلق
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [archiveSearchTerm, setArchiveSearchTerm] = useState('');
  const [isLoadingArchive, setIsLoadingArchive] = useState(false);
  
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const textareaRef = useRef(null);
  
  const config = getProductionConfig();
  const env = getEnvironmentInfo();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]); // Scroll to bottom when messages change or assistant is thinking

  const subscribeToConversation = useCallback((conversationId) => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    try {
      unsubscribeRef.current = agentSDK.subscribeToConversation(conversationId, (data) => {
        if (data && data.messages) {
          setMessages([...data.messages]);
        }
      });
    } catch (error) {
      if (config.enableDebugLogs) {
        console.error("Error subscribing to conversation:", error);
      }
    }
  }, [config.enableDebugLogs]);

  const loadConversations = useCallback(async () => {
    try {
      const conversationsList = await safeApiCall(async () => {
        return await agentSDK.listConversations({
          agent_name: "FinancialAssistant",
        });
      }, []);
      
      if (!conversationsList || conversationsList.length === 0) {
        setActiveConversations([]);
        setArchivedConversations([]);
        return;
      }

      // تصنيف المحادثات: النشطة (آخر 5) والمؤرشفة (الباقي)
      const sortedConversations = conversationsList
        .filter(conv => conv.metadata?.name)
        .sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date));

      const activeLimit = 5;
      const active = sortedConversations.slice(0, activeLimit);
      const archived = sortedConversations.slice(activeLimit);

      setActiveConversations(active);
      setArchivedConversations(archived);
      
      // إذا كانت هناك محادثات نشطة، اختر الأحدث
      if (active.length > 0) {
        const latestConversation = active[0];
        setCurrentConversation(latestConversation);
        setMessages(latestConversation.messages || []);
        subscribeToConversation(latestConversation.id);
      }
      
    } catch (error) {
      if (config.enableDebugLogs) {
        console.error("Error loading conversations:", error);
      }
    }
  }, [config.enableDebugLogs, subscribeToConversation]);

  const initializeAssistant = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await safeApiCall(async () => {
        return await User.me();
      });

      if (!user) {
        setError("يجب تسجيل الدخول أولاً للوصول إلى المساعد الذكي.");
        return;
      }

      setCurrentUser(user);
      await loadConversations();
      
    } catch (error) {
      console.error("Error initializing AI assistant:", error);
      
      if (error.response?.status === 401) {
        setError("يجب تسجيل الدخول أولاً للوصول إلى المساعد الذكي.");
      } else if (error.response?.status === 429) {
        setError("الخدمة مشغولة حالياً. يرجى المحاولة مرة أخرى بعد قليل.");
      } else {
        setError("حدث خطأ في الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadConversations]);

  useEffect(() => {
    initializeAssistant();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [initializeAssistant]);

  const createNewConversation = async () => {
    if (isCreatingConversation || !currentUser) return;
    
    setIsCreatingConversation(true);
    setError(null);
    
    const newConversation = await safeApiCall(async () => {
      return await agentSDK.createConversation({
        agent_name: "FinancialAssistant",
        metadata: {
          name: `محادثة مالية - ${new Date().toLocaleString('ar-SA')}`,
          description: "مساعدة في إدارة المصاريف والتخطيط المالي",
        }
      });
    });

    if (newConversation) {
      setCurrentConversation(newConversation);
      setMessages([]);
      setActiveConversations(prev => [newConversation, ...prev.slice(0, 4)]); // احتفظ بـ 5 محادثات نشطة فقط
      subscribeToConversation(newConversation.id);
    } else {
      setError("فشل في إنشاء محادثة جديدة. يرجى المحاولة مرة أخرى.");
    }
    
    setIsCreatingConversation(false);
  };

  const handlePromptClick = (prompt) => {
    setInputMessage(prompt);
    // Directly call send message after setting the prompt
    // Use a timeout to allow the state to update before sending
    setTimeout(() => {
        // We need to pass the conversation and message directly
        // because the state update might not be immediate
        if (currentConversation) {
            sendMessage(prompt);
        }
    }, 100);
  };

  const sendMessage = async (messageToSend = null) => {
    const messageContent = messageToSend || inputMessage;
    if (!messageContent.trim() || isSending || !currentConversation) return;

    const message = messageContent.trim();
    setInputMessage('');
    setIsSending(true);
    setError(null);

    const success = await safeApiCall(async () => {
      await agentSDK.addMessage(currentConversation, {
        role: 'user',
        content: message,
      });
      return true;
    }, false);

    if (!success) {
      setError("فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.");
      setInputMessage(message);
    }
    
    setIsSending(false);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    initializeAssistant();
  };

  const loadArchivedConversations = async () => {
    setIsLoadingArchive(true);
    try {
      // في التطبيق الحقيقي، هذه البيانات محفوظة بالفعل من loadConversations
      // يمكننا فقط فلترتها حسب مصطلح البحث
      setIsLoadingArchive(false);
    } catch (error) {
      console.error("Error loading archived conversations:", error);
      setIsLoadingArchive(false);
    }
  };

  const selectArchivedConversation = async (conversation) => {
    setCurrentConversation(conversation);
    setMessages(conversation.messages || []);
    subscribeToConversation(conversation.id);
    setShowArchiveDialog(false);
  };

  const getFilteredArchivedConversations = () => {
    if (!archiveSearchTerm.trim()) {
      return archivedConversations;
    }

    const searchTerm = archiveSearchTerm.toLowerCase();
    return archivedConversations.filter(conv => 
      conv.metadata?.name?.toLowerCase().includes(searchTerm) ||
      conv.metadata?.description?.toLowerCase().includes(searchTerm) ||
      new Date(conv.created_date).toLocaleDateString('ar-SA').includes(searchTerm)
    );
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-emerald-700 font-medium">جاري تحضير المساعد الذكي...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
            <h3 className="text-lg font-semibold text-red-700">مشكلة في الاتصال</h3>
            <p className="text-red-600">{error}</p>
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-800">المساعد المالي الذكي</h1>
          </div>
          <p className="text-emerald-600">احصل على مساعدة ذكية في إدارة مصاريفك وتخطيط ميزانيتك</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                  <Button onClick={handleRetry} variant="outline" size="sm" className="ml-auto">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    إعادة المحاولة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* قائمة المحادثات النشطة */}
          <Card className="lg:col-span-1 rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-emerald-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  المحادثات النشطة
                </CardTitle>
                <div className="flex gap-1">
                  {/* زر السجل المغلق */}
                  <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        title="السجل المغلق"
                      >
                        <Archive className="w-4 h-4 text-emerald-600" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[80vh]" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Archive className="w-5 h-5 text-emerald-600" />
                          السجل المغلق
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* بحث في السجل */}
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="البحث في السجل..."
                            value={archiveSearchTerm}
                            onChange={(e) => setArchiveSearchTerm(e.target.value)}
                            className="pr-10"
                          />
                        </div>

                        {/* قائمة المحادثات المؤرشفة */}
                        <div className="max-h-96 overflow-y-auto space-y-2">
                          {isLoadingArchive ? (
                            <div className="text-center py-4">
                              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                              <p className="text-sm text-emerald-600">جاري تحميل السجل...</p>
                            </div>
                          ) : getFilteredArchivedConversations().length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <Archive className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">
                                {archiveSearchTerm ? 'لا توجد نتائج للبحث' : 'السجل فارغ'}
                              </p>
                            </div>
                          ) : (
                            getFilteredArchivedConversations().map((conv) => (
                              <div
                                key={conv.id}
                                onClick={() => selectArchivedConversation(conv)}
                                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                              >
                                <div className="font-medium text-sm text-gray-800 truncate">
                                  {conv.metadata?.name || 'محادثة غير مسماة'}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(conv.created_date).toLocaleDateString('ar-SA')}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* زر محادثة جديدة */}
                  <Button
                    onClick={createNewConversation}
                    disabled={isCreatingConversation}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 p-1"
                  >
                    {isCreatingConversation ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeConversations.length === 0 ? (
                <div className="text-center py-8 text-emerald-600">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">لا توجد محادثات نشطة</p>
                  <p className="text-xs opacity-75">ابدأ محادثة جديدة</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeConversations.map((conv) => (
                    <Button
                      key={conv.id}
                      onClick={() => {
                        setCurrentConversation(conv);
                        setMessages(conv.messages || []);
                        subscribeToConversation(conv.id);
                      }}
                      variant={currentConversation?.id === conv.id ? "default" : "ghost"}
                      className="w-full justify-start text-right h-auto p-3"
                    >
                      <div className="flex flex-col items-start w-full gap-1">
                        <div className="truncate text-sm font-medium">
                          {conv.metadata?.name?.replace('محادثة مالية - ', '') || 'محادثة غير مسماة'}
                        </div>
                        <div className="flex items-center gap-1 text-xs opacity-70">
                          <Clock className="w-3 h-3" />
                          {new Date(conv.updated_date || conv.created_date).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
              
              {/* عرض عدد المحادثات المؤرشفة */}
              {archivedConversations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-emerald-100">
                  <p className="text-xs text-emerald-600 text-center">
                    {archivedConversations.length} محادثة في السجل المغلق
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* منطقة المحادثة */}
          <Card className="lg:col-span-3 rtl-shadow bg-white/90 backdrop-blur-sm border-emerald-100 flex flex-col min-h-[600px]">
            {!currentConversation ? (
              <CardContent className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">مرحباً بك!</h3>
                  <p className="text-emerald-600 mb-6">ابدأ محادثة جديدة أو اختر أحد الاقتراحات السريعة:</p>
                  <Button
                    onClick={createNewConversation}
                    disabled={isCreatingConversation}
                    className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white shadow-lg text-lg py-3 px-6 rounded-xl"
                  >
                    {isCreatingConversation ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-5 h-5 mr-2" />
                    )}
                    بدء محادثة جديدة
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                {/* منطقة الرسائل */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <AnimatePresence>
                    {messages.length === 0 && !isSending ? (
                      <div className="text-center py-8 text-emerald-600">
                        <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                            <h3 className="text-lg font-semibold text-emerald-800">كيف يمكنني مساعدتك اليوم؟</h3>
                            <p className="text-sm text-emerald-600">يمكنك أن تطلب مني إضافة مصروف، عرض تقرير، أو أي شيء آخر!</p>
                        </motion.div>
                        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                            {[
                                { prompt: 'أضف مصروف جديد', icon: Plus },
                                { prompt: 'كم صرفت هذا الشهر؟', icon: Search },
                                { prompt: 'اعرض لي تقرير الطعام', icon: Calendar },
                                { prompt: 'ما هي ميزانية السكن؟', icon: MessageSquare }
                            ].map((item, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * index }}
                                    onClick={() => handlePromptClick(item.prompt)}
                                    className="p-3 bg-emerald-50 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.prompt}
                                </motion.button>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => (
                          <MessageBubble key={index} message={message} />
                        ))}
                        {isSending && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <MessageBubble message={{ role: 'assistant', content: ' يفكر...' }} isThinking={true} />
                            </motion.div>
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* منطقة الإدخال */}
                <div className="p-4 border-t border-emerald-100 bg-white">
                  <div className="flex items-end gap-2">
                    <Textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      className="flex-1 resize-none overflow-y-hidden border-emerald-200 focus:border-emerald-500 bg-white"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={isSending}
                    />
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!inputMessage.trim() || isSending}
                      className="self-end bg-emerald-600 hover:bg-emerald-700 shrink-0"
                      size="icon"
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
