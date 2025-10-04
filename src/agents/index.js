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
      
      // If it's a user message, simulate an AI response
      if (message.role === 'user') {
        setTimeout(() => {
          this.generateAIResponse(conversation, message.content);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
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

  // Generate AI response (mock implementation)
  async generateAIResponse(conversation, userMessage) {
    const conv = this.conversations.get(conversation.id);
    if (!conv) return;

    // Simple response generation based on keywords
    let response = this.generateResponseBasedOnMessage(userMessage);

    const aiMessage = {
      id: ++this.messageId,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    };

    conv.messages.push(aiMessage);
    conv.updated_date = new Date().toISOString();
    
    this.saveConversationsToStorage();
    this.notifySubscribers(conversation.id, conv);
  }

  // Generate response based on user message content
  generateResponseBasedOnMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for expense-related keywords
    if (lowerMessage.includes('صرفت') || lowerMessage.includes('اشتريت') || lowerMessage.includes('دفعت')) {
      return `✅ تم تسجيل المصروف بنجاح!\n\nشكراً لك على تسجيل هذا المصروف. تم إضافته إلى حسابك.\n\n💡 **نصيحة**: يمكنك أيضاً تصنيف مصاريفك لتتبع أفضل، مثل "طعام"، "مواصلات"، "فواتير".`;
    }
    
    // Check for income-related keywords
    if (lowerMessage.includes('راتب') || lowerMessage.includes('دخل')) {
      return `💰 ممتاز! تسجيل الدخل مهم جداً للتخطيط المالي.\n\n✨ **اقتراح**: يمكنك الآن وضع ميزانيات شهرية لمختلف فئات المصاريف.\n\n📊 هل تريد مني مساعدتك في وضع ميزانية شهرية؟`;
    }
    
    // Check for budget-related keywords
    if (lowerMessage.includes('ميزانية') || lowerMessage.includes('حدد') || lowerMessage.includes('خطة')) {
      return `🎯 إعداد الميزانية خطوة ذكية!\n\n**نصائح لميزانية ناجحة:**\n• حدد 50% للضروريات (سكن، طعام، مواصلات)\n• 30% للترفيه والمصاريف الشخصية\n• 20% للادخار والاستثمار\n\n💡 أخبرني بدخلك الشهري وسأساعدك في توزيع مناسب!`;
    }
    
    // Check for report-related keywords
    if (lowerMessage.includes('كم صرفت') || lowerMessage.includes('تقرير') || lowerMessage.includes('ملخص')) {
      return `📊 **ملخص مصاريفك:**\n\n🍔 الطعام: 450 ريال\n🚗 المواصلات: 200 ريال\n🏠 الفواتير: 350 ريال\n🛒 متنوعة: 180 ريال\n\n💰 **إجمالي الشهر**: 1,180 ريال\n\n📈 **مقارنة بالشهر الماضي**: انخفاض 5%\n\n✨ أداء ممتاز! تسير وفق الميزانية المحددة.`;
    }
    
    // Check for help or greeting
    if (lowerMessage.includes('مساعدة') || lowerMessage.includes('أهلا') || lowerMessage.includes('مرحبا') || lowerMessage.includes('help')) {
      return `🌟 أهلاً وسهلاً! أنا المساعد المالي الذكي.\n\n**يمكنني مساعدتك في:**\n\n💰 تسجيل المصاريف والدخل\n📊 عرض التقارير والإحصائيات\n🎯 وضع وإدارة الميزانيات\n📈 تحليل عادات الإنفاق\n💡 تقديم نصائح مالية\n\n**أمثلة على ما يمكنك قوله:**\n• "صرفت 50 ريال على طعام"\n• "كم صرفت هذا الشهر؟"\n• "ضع ميزانية للمواصلات 300 ريال"\n• "راتبي 8000 ريال شهرياً"\n\nما الذي تريد مساعدة فيه اليوم؟`;
    }
    
    // Default response
    return `شكراً لك على رسالتك! 😊\n\nأفهم أنك تريد المساعدة في الأمور المالية. يمكنني مساعدتك في:\n\n💰 **تسجيل المصاريف**: قل "صرفت [المبلغ] على [الفئة]"\n📊 **عرض التقارير**: قل "كم صرفت هذا الشهر؟"\n🎯 **إدارة الميزانية**: قل "ضع ميزانية لـ [الفئة]"\n\n**مثال**: "اشتريت طعام بـ 85 ريال اليوم"\n\nكيف يمكنني مساعدتك تحديداً؟`;
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
