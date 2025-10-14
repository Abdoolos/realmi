// Agent SDK for AI Assistant functionality
// This is a mock implementation that provides the interface used by the AI components

class AgentSDK {
  constructor() {
    this.conversations = new Map();
    this.subscribers = new Map();
    this.messageId = 0;
  }

  // Create a new conversation
  async createConversation(config) {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const conversation = {
      id: conversationId,
      agent_name: config.agent_name || "FinancialAssistant",
      metadata: config.metadata || {},
      messages: [],
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      status: 'active'
    };

    this.conversations.set(conversationId, conversation);
    
    // Store in localStorage for persistence
    this.saveConversationsToStorage();
    
    return conversation;
  }

  // List conversations for a specific agent
  async listConversations(filter = {}) {
    const conversations = Array.from(this.conversations.values());
    
    if (filter.agent_name) {
      return conversations.filter(conv => conv.agent_name === filter.agent_name);
    }
    
    return conversations;
  }

  // Add a message to a conversation
  async addMessage(conversation, message) {
    if (!conversation || !conversation.id) {
      throw new Error('Invalid conversation');
    }

    const messageWithId = {
      ...message,
      id: ++this.messageId,
      timestamp: new Date().toISOString()
    };

    const conv = this.conversations.get(conversation.id);
    if (conv) {
      conv.messages.push(messageWithId);
      conv.updated_date = new Date().toISOString();
      
      // Save to storage
      this.saveConversationsToStorage();
      
      // Notify subscribers
      this.notifySubscribers(conversation.id, conv);
      
      // If it's a user message, generate AI response
      if (message.role === 'user') {
        // Check if it's a FAQ question - respond immediately
        this.checkAndRespond(conversation, message.content);
      }
    }

    return messageWithId;
  }

  // Subscribe to conversation updates
  subscribeToConversation(conversationId, callback) {
    if (!this.subscribers.has(conversationId)) {
      this.subscribers.set(conversationId, new Set());
    }
    
    this.subscribers.get(conversationId).add(callback);
    
    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(conversationId);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(conversationId);
        }
      }
    };
  }

  // Notify all subscribers of a conversation
  notifySubscribers(conversationId, conversationData) {
    const subscribers = this.subscribers.get(conversationId);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(conversationData);
        } catch (error) {
          console.error('Error in conversation subscriber:', error);
        }
      });
    }
  }

  // Check message type and respond immediately
  async checkAndRespond(conversation, userMessage) {
    // Respond immediately without any delay
    await this.generateAIResponse(conversation, userMessage);
  }

  // Generate AI response (mock implementation)
  async generateAIResponse(conversation, userMessage) {
    const conv = this.conversations.get(conversation.id);
    if (!conv) return;

    // Simple response generation based on keywords
    let response = await this.generateResponseBasedOnMessage(userMessage);

    const aiMessage = {
      id: ++this.messageId,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    };

    conv.messages.push(aiMessage);
    conv.updated_date = new Date().toISOString();
    
    // Force immediate update
    this.saveConversationsToStorage();
    
    // Notify subscribers immediately with a fresh copy
    this.notifySubscribers(conversation.id, { ...conv, messages: [...conv.messages] });
    
    // Force another notification to ensure UI updates
    setTimeout(() => {
      this.notifySubscribers(conversation.id, { ...conv, messages: [...conv.messages] });
    }, 10);
  }

  // Generate response based on user message content using enhanced knowledge base
  async generateResponseBasedOnMessage(message) {
    // Import knowledge base dynamically
    const { 
      analyzeIntent, 
      getPageInfo, 
      MENU_INFO, 
      API_ROUTES, 
      APP_INFO, 
      FINANCIAL_TIPS,
      getAllFAQs,
      getFAQsByCategory,
      getFAQCategories,
      searchFAQs
    } = await import('./knowledgeBase.js');
    
    const lowerMessage = message.toLowerCase();
    const intent = analyzeIntent(message);
    
    // Handle FAQ requests first
    if (lowerMessage.includes('أسئلة') || lowerMessage.includes('سؤال') || lowerMessage.includes('استفسار') || lowerMessage.includes('faq')) {
      const categories = getFAQCategories();
      return `❓ **الأسئلة الشائعة - FAQ**\n\n**الفئات المتوفرة:**\n\n${categories.map(cat => 
        `${cat.icon} **${cat.name}** (${cat.count} أسئلة)`
      ).join('\n')}\n\n💡 **للبحث عن سؤال محدد:**\n• قل "ابحث عن [كلمة البحث]"\n• أو اسأل سؤالك مباشرة\n\n**أمثلة:**\n• "هل التطبيق مجاني؟"\n• "كيف أستخدم التطبيق؟"\n• "هل بياناتي آمنة؟"`;
    }
    
    // First: Try exact match with FAQ questions
    const allFAQs = getAllFAQs();
    const exactMatch = allFAQs.find(faq => 
      faq.question.trim() === message.trim() ||
      faq.question.toLowerCase().trim() === lowerMessage.trim()
    );
    
    if (exactMatch) {
      let response = `${exactMatch.categoryIcon} **${exactMatch.question}**\n\n${exactMatch.answer}`;
      
      // Find similar questions in the same category
      const similarInCategory = allFAQs.filter(faq => 
        faq.category === exactMatch.category && faq.id !== exactMatch.id
      ).slice(0, 2);
      
      if (similarInCategory.length > 0) {
        response += `\n\n**أسئلة أخرى في نفس الفئة:**\n${similarInCategory.map(faq => 
          `• ${faq.question}`
        ).join('\n')}`;
      }
      
      return response;
    }
    
    // Second: Search in FAQs if the message looks like a question
    if (lowerMessage.includes('هل') || lowerMessage.includes('كيف') || lowerMessage.includes('ماذا') || 
        lowerMessage.includes('وش') || lowerMessage.includes('ايش') || lowerMessage.includes('؟')) {
      const searchResults = searchFAQs(message);
      if (searchResults.length > 0) {
        const topResult = searchResults[0];
        let response = `${topResult.categoryIcon} **${topResult.question}**\n\n${topResult.answer}`;
        
        if (searchResults.length > 1) {
          response += `\n\n**أسئلة مشابهة:**\n${searchResults.slice(1, 3).map(faq => 
            `• ${faq.question}`
          ).join('\n')}`;
        }
        
        return response;
      }
    }
    
    // Handle category-specific FAQ requests
    const categories = getFAQCategories();
    for (const cat of categories) {
      if (lowerMessage.includes(cat.name.toLowerCase())) {
        const categoryFAQs = getFAQsByCategory(cat.name);
        return `${cat.icon} **${cat.name}** (${cat.count} أسئلة)\n\n${categoryFAQs.map(faq => 
          `**س${faq.id}: ${faq.question}**\n${faq.answer}\n`
        ).join('\n---\n\n')}`;
      }
    }
    
    // Handle navigation requests
    if (intent.intent === 'navigate' && intent.target) {
      const pageInfo = getPageInfo(intent.target);
      if (pageInfo) {
        return `🧭 **${pageInfo.title}**\n\n📝 ${pageInfo.description}\n\n**الميزات المتاحة:**\n${pageInfo.features.map(f => `• ${f}`).join('\n')}\n\n💡 **كيفية الاستخدام:**\n${pageInfo.howToUse}\n\n🔗 [انتقل إلى ${pageInfo.title}](${intent.target})`;
      }
    }
    
    // Handle expense addition
    if (intent.intent === 'add_expense') {
      if (intent.amount && intent.category) {
        // Try to add expense via API
        try {
          await this.addExpenseToAPI(intent.amount, intent.category, message);
          return `✅ **تم تسجيل المصروف بنجاح!**\n\n💰 المبلغ: ${intent.amount} ريال\n🏷️ الفئة: ${intent.category}\n\n📊 تم إضافة المصروف إلى حسابك وسيظهر في التقارير.\n\n💡 **نصيحة**: يمكنك عرض جميع مصاريفك من [قائمة المصاريف](/expenses-list)`;
        } catch (error) {
          return `✅ **تم فهم طلبك لإضافة مصروف**\n\n💰 المبلغ: ${intent.amount} ريال\n🏷️ الفئة: ${intent.category}\n\n📝 لإكمال إضافة المصروف، توجه إلى [صفحة إضافة مصروف](/add-expense)\n\n💡 أو يمكنك قول "انتقل إلى إضافة مصروف" وسأوجهك هناك.`;
        }
      } else {
        return `💰 **أريد مساعدتك في تسجيل المصروف!**\n\n🤔 يبدو أنك تريد إضافة مصروف، لكن أحتاج معلومات أكثر:\n\n**المطلوب:**\n• المبلغ (مثل: 50 ريال)\n• الفئة (مثل: طعام، مواصلات)\n\n**أمثلة:**\n• "صرفت 75 ريال على طعام"\n• "اشتريت بنزين بـ 100 ريال"\n• "دفعت 25 ريال تاكسي"\n\n🔗 أو يمكنك الذهاب مباشرة إلى [صفحة إضافة مصروف](/add-expense)`;
      }
    }
    
    // Handle data queries
    if (intent.intent === 'query_data') {
      try {
        const reportData = await this.getReportData(intent.type);
        return this.formatReportResponse(reportData, intent.type);
      } catch (error) {
        return `📊 **تقرير مصاريفك**\n\n🔍 يمكنني مساعدتك في عرض:\n\n📅 **التقرير الشهري**: كامل بالرسوم البيانية\n📈 **الإحصائيات**: تحليل عادات الإنفاق\n👨‍👩‍👧‍👦 **تقرير العائلة**: إذا كنت في عائلة\n\n🔗 **روابط سريعة:**\n• [التقرير الشهري](/monthly-report)\n• [الإحصائيات](/analytics)\n• [تقرير العائلة](/family-report)\n\nأو قل "انتقل إلى التقرير الشهري" وسأوجهك هناك.`;
      }
    }
    
    // Handle general app information requests
    if (lowerMessage.includes('مساعدة') || lowerMessage.includes('أهلا') || lowerMessage.includes('مرحبا') || lowerMessage.includes('help')) {
      return `🌟 **أهلاً وسهلاً في ${APP_INFO.name}!**\n\n🤖 أنا المساعد الذكي لمساعدتك في إدارة أموالك.\n\n**يمكنني مساعدتك في:**\n\n💰 **إضافة المصاريف**: "صرفت 50 ريال طعام"\n📊 **عرض التقارير**: "كم صرفت هذا الشهر؟"\n🎯 **إدارة الميزانيات**: "ضع ميزانية للطعام 500 ريال"\n🧭 **التنقل**: "انتقل إلى قائمة المصاريف"\n💡 **النصائح المالية**: "أعطني نصائح للادخار"\n\n**القوائم المتاحة:**\n${Object.values(MENU_INFO).slice(0, 5).map(info => `• ${info.title}`).join('\n')}\n\n💬 **جرب قول:** "اعرض القوائم المتاحة" لرؤية جميع الوظائف`;
    }
    
    // Handle menu listing
    if (lowerMessage.includes('قوائم') || lowerMessage.includes('وظائف') || lowerMessage.includes('ميزات')) {
      return `📋 **القوائم والوظائف المتاحة في ${APP_INFO.name}:**\n\n${Object.entries(MENU_INFO).map(([route, info]) => 
        `🔹 **${info.title}**\n   ${info.description}\n   💬 ${info.quickPhrase || 'قل "انتقل إلى ' + info.title + '"'}\n`
      ).join('\n')}\n\n💡 **لاستخدام أي وظيفة:** اذكر اسمها أو قل "انتقل إلى [اسم الوظيفة]"`;
    }
    
    // Handle financial tips requests
    if (lowerMessage.includes('نصائح') || lowerMessage.includes('نصيحة')) {
      const randomTip = FINANCIAL_TIPS[Math.floor(Math.random() * FINANCIAL_TIPS.length)];
      const randomTipText = randomTip.tips[Math.floor(Math.random() * randomTip.tips.length)];
      return `💡 **نصيحة مالية ذكية - ${randomTip.category}:**\n\n"${randomTipText}"\n\n📚 **المزيد من النصائح حول ${randomTip.category}:**\n${randomTip.tips.filter(tip => tip !== randomTipText).slice(0, 2).map(tip => `• ${tip}`).join('\n')}\n\n🎯 **هل تريد نصائح في موضوع معين؟** قل "نصائح للادخار" أو "نصائح للميزانية"`;
    }
    
    // Default response with developer credit
    return `🤖 **شكراً لتواصلك معي!**\n\nأنا المساعد المالي الذكي لـ ${APP_INFO.name}.\n\n**يمكنني مساعدتك في:**\n\n💰 **المصاريف**: "صرفت 50 ريال على طعام"\n📊 **التقارير**: "اعرض ملخص هذا الشهر"\n🧭 **التنقل**: "انتقل إلى قائمة المصاريف"\n💡 **النصائح**: "أعطني نصائح مالية"\n\n**أمثلة أخرى:**\n• "كم صرفت على الطعام؟"\n• "ضع ميزانية 800 ريال للمواصلات"\n• "اعرض القوائم المتاحة"\n\n💬 **ما الذي تريد مساعدة فيه؟**`;
  }
  
  // Add expense to API
  async addExpenseToAPI(amount, category, description) {
    const expenseData = {
      amount: amount,
      category: category,
      description: description,
      date: new Date().toISOString(),
      currency: 'SAR'
    };
    
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add expense');
    }
    
    return await response.json();
  }
  
  // Get report data
  async getReportData(type = 'general') {
    const response = await fetch('/api/reports');
    if (!response.ok) {
      throw new Error('Failed to get report data');
    }
    return await response.json();
  }
  
  // Format report response
  formatReportResponse(data, type) {
    if (!data) {
      return `📊 **تقرير مصاريفك**\n\nلا توجد بيانات متاحة حالياً.\n\n🔗 [ابدأ بإضافة مصروف](/add-expense)`;
    }
    
    return `📊 **ملخص مصاريفك:**\n\n💰 **الإجمالي**: ${data.total || 0} ريال\n📈 **هذا الشهر**: ${data.monthly || 0} ريال\n\n🔗 **لمزيد من التفاصيل:**\n• [التقرير الشهري الكامل](/monthly-report)\n• [الإحصائيات التفصيلية](/analytics)`;
  }

  // Save conversations to localStorage for persistence
  saveConversationsToStorage() {
    try {
      const conversationsArray = Array.from(this.conversations.entries());
      localStorage.setItem('ai_conversations', JSON.stringify(conversationsArray));
    } catch (error) {
      console.error('Error saving conversations to storage:', error);
    }
  }

  // Load conversations from localStorage
  loadConversationsFromStorage() {
    try {
      // Check if localStorage is available (client-side only)
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('ai_conversations');
        if (stored) {
          const conversationsArray = JSON.parse(stored);
          this.conversations = new Map(conversationsArray);
          
          // Set messageId to highest existing message id + 1
          let maxMessageId = 0;
          for (const [, conversation] of this.conversations) {
            if (conversation.messages) {
              for (const message of conversation.messages) {
                if (message.id && message.id > maxMessageId) {
                  maxMessageId = message.id;
                }
              }
            }
          }
          this.messageId = maxMessageId;
        }
      }
    } catch (error) {
      console.error('Error loading conversations from storage:', error);
    }
  }

  // Initialize the SDK
  initialize() {
    this.loadConversationsFromStorage();
  }
}

// Create and initialize the singleton instance
const agentSDK = new AgentSDK();
agentSDK.initialize();

export { agentSDK };
export default agentSDK;
