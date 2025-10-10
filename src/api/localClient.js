// Local client system to replace Base44 SDK
// This provides local storage-based data management without authentication

class LocalStorageDB {
  constructor() {
    this.storagePrefix = 'local_app_';
    this.isClient = typeof window !== 'undefined';
    if (this.isClient) {
      this.init();
    }
  }

  init() {
    if (!this.isClient) return;
    
    // Initialize default data if not exists
    if (!this.getItem('user')) {
      this.setItem('user', {
        id: 'local_user_1',
        full_name: 'مستخدم',
        email: 'guest@app.local',
        phone: '',
        preferred_currency: 'SAR',
        family_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    if (!this.getItem('expenses')) {
      this.setItem('expenses', []);
    }

    if (!this.getItem('categories')) {
      this.setItem('categories', [
        { id: 1, name: 'طعام', color: '#10b981', icon: '🍔' },
        { id: 2, name: 'مواصلات', color: '#3b82f6', icon: '🚗' },
        { id: 3, name: 'فواتير', color: '#f59e0b', icon: '🏠' },
        { id: 4, name: 'ترفيه', color: '#8b5cf6', icon: '🎮' },
        { id: 5, name: 'صحة', color: '#ef4444', icon: '🏥' },
        { id: 6, name: 'تسوق', color: '#06b6d4', icon: '🛒' },
        { id: 7, name: 'تعليم', color: '#84cc16', icon: '📚' },
        { id: 8, name: 'أخرى', color: '#6b7280', icon: '📦' }
      ]);
    }

    if (!this.getItem('budgets')) {
      this.setItem('budgets', []);
    }

    if (!this.getItem('events')) {
      this.setItem('events', []);
    }
  }

  getItem(key) {
    if (!this.isClient) return null;
    
    try {
      const item = localStorage.getItem(this.storagePrefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  setItem(key, value) {
    if (!this.isClient) return false;
    
    try {
      localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      return false;
    }
  }

  removeItem(key) {
    if (!this.isClient) return false;
    
    try {
      localStorage.removeItem(this.storagePrefix + key);
      return true;
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
      return false;
    }
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

// Create database instance
const db = new LocalStorageDB();

// Entity classes
class User {
  static async me() {
    return db.getItem('user');
  }

  static async update(userData) {
    const currentUser = db.getItem('user');
    const updatedUser = {
      ...currentUser,
      ...userData,
      updated_at: new Date().toISOString()
    };
    db.setItem('user', updatedUser);
    return updatedUser;
  }

  // إضافة دالة updateMyUserData للتوافق مع SetupAccount
  static async updateMyUserData(userData) {
    return this.update(userData);
  }
}

class Expense {
  static async list(orderBy = '-date') {
    const expenses = db.getItem('expenses') || [];
    
    // Apply sorting
    if (orderBy === '-date') {
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (orderBy === 'date') {
      expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    return expenses;
  }

  static async create(expenseData) {
    const expenses = db.getItem('expenses') || [];
    const newExpense = {
      id: db.generateId(),
      user_id: 'local_user_1',
      ...expenseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    expenses.push(newExpense);
    db.setItem('expenses', expenses);
    return newExpense;
  }

  static async update(id, expenseData) {
    const expenses = db.getItem('expenses') || [];
    const index = expenses.findIndex(exp => exp.id === id);
    
    if (index !== -1) {
      expenses[index] = {
        ...expenses[index],
        ...expenseData,
        updated_at: new Date().toISOString()
      };
      db.setItem('expenses', expenses);
      return expenses[index];
    }
    
    throw new Error('Expense not found');
  }

  static async delete(id) {
    const expenses = db.getItem('expenses') || [];
    const filteredExpenses = expenses.filter(exp => exp.id !== id);
    db.setItem('expenses', filteredExpenses);
    return true;
  }

  static async filter(criteria) {
    const expenses = await this.list();
    return expenses.filter(expense => {
      for (const [key, value] of Object.entries(criteria)) {
        if (expense[key] !== value) return false;
      }
      return true;
    });
  }
}

class Category {
  static async list() {
    return db.getItem('categories') || [];
  }

  static async create(categoryData) {
    const categories = db.getItem('categories') || [];
    const newCategory = {
      id: db.generateId(),
      ...categoryData,
      created_at: new Date().toISOString()
    };
    
    categories.push(newCategory);
    db.setItem('categories', categories);
    return newCategory;
  }

  static async update(id, categoryData) {
    const categories = db.getItem('categories') || [];
    const index = categories.findIndex(cat => cat.id === id);
    
    if (index !== -1) {
      categories[index] = {
        ...categories[index],
        ...categoryData,
        updated_at: new Date().toISOString()
      };
      db.setItem('categories', categories);
      return categories[index];
    }
    
    throw new Error('Category not found');
  }

  static async delete(id) {
    const categories = db.getItem('categories') || [];
    const filteredCategories = categories.filter(cat => cat.id !== id);
    db.setItem('categories', filteredCategories);
    return true;
  }
}

class Budget {
  static async list() {
    return db.getItem('budgets') || [];
  }

  static async create(budgetData) {
    const budgets = db.getItem('budgets') || [];
    const newBudget = {
      id: db.generateId(),
      user_id: 'local_user_1',
      ...budgetData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    budgets.push(newBudget);
    db.setItem('budgets', newBudget);
    return newBudget;
  }

  static async filter(criteria) {
    const budgets = await this.list();
    return budgets.filter(budget => {
      for (const [key, value] of Object.entries(criteria)) {
        if (budget[key] !== value) return false;
      }
      return true;
    });
  }
}

class Event {
  static async list() {
    return db.getItem('events') || [];
  }

  static async create(eventData) {
    const events = db.getItem('events') || [];
    const newEvent = {
      id: db.generateId(),
      user_id: 'local_user_1',
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    events.push(newEvent);
    db.setItem('events', events);
    return newEvent;
  }

  static async delete(id) {
    const events = db.getItem('events') || [];
    const filteredEvents = events.filter(event => event.id !== id);
    db.setItem('events', filteredEvents);
    return true;
  }
}

// Mock classes for family and subscription features
class Family {
  static async create(familyData) {
    // Mock family creation
    return {
      id: db.generateId(),
      ...familyData,
      created_at: new Date().toISOString()
    };
  }

  static async findByInviteCode() {
    // Mock family lookup
    return null;
  }
}

class UserSubscription {
  static async filter() {
    // Mock subscription - return empty for free tier
    return [];
  }
}

class FamilySubscription {
  static async filter() {
    // Mock family subscription
    return [];
  }
}

class Subcategory {
  static async list() {
    return db.getItem('subcategories') || [];
  }

  static async create(subcategoryData) {
    const subcategories = db.getItem('subcategories') || [];
    const newSubcategory = {
      id: db.generateId(),
      ...subcategoryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    subcategories.push(newSubcategory);
    db.setItem('subcategories', subcategories);
    return newSubcategory;
  }

  static async filter(criteria) {
    const subcategories = await this.list();
    return subcategories.filter(subcategory => {
      for (const [key, value] of Object.entries(criteria)) {
        if (subcategory[key] !== value) return false;
      }
      return true;
    });
  }

  static async delete(id) {
    const subcategories = db.getItem('subcategories') || [];
    const filteredSubcategories = subcategories.filter(sub => sub.id !== id);
    db.setItem('subcategories', filteredSubcategories);
    return true;
  }
}

// Mock functions for features that require external services
const functions = {
  stripeWebhook: () => Promise.resolve({ message: 'Local mode - Stripe not available' }),
  stripeUtils: () => Promise.resolve({ message: 'Local mode - Stripe not available' }),
  stripeHandlers: () => Promise.resolve({ message: 'Local mode - Stripe not available' }),
  getStripeEventStatus: () => Promise.resolve({ status: 'unavailable', message: 'Local mode - Stripe not available' }),
  validateDiscountCode: () => Promise.resolve({ valid: false, message: 'Local mode - Discounts not available' }),
  createStripeCheckout: () => Promise.resolve({ url: null, message: 'Local mode - Checkout not available' }),
  createBillingPortalSession: () => Promise.resolve({ url: null, message: 'Local mode - Billing not available' }),
  getFamilyData: () => Promise.resolve({ family: null, members: [] }),
  getCurrencyRates: () => Promise.resolve({ 
    SAR: 1, 
    USD: 0.27, 
    EUR: 0.25,
    updated_at: new Date().toISOString()
  })
};

// Export using ES Modules
export const localClient = {
  functions,
  // Mock auth methods
  auth: {
    requiresAuth: false,
    isAuthenticated: () => true,
    getUser: () => User.me()
  }
};

export {
  User,
  Expense,
  Category,
  Budget,
  Event,
  Family,
  UserSubscription,
  FamilySubscription,
  Subcategory
};
