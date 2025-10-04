import {
  User,
  Expense,
  Category,
  Budget,
  Event,
  Family,
  UserSubscription,
  FamilySubscription,
  Subcategory
} from './localClient';

// Export all entities from local client
export { User };
export { Expense };
export { Category };
export { Budget };
export { Event };
export { Family };
export { UserSubscription };
export { FamilySubscription };
export { Subcategory };

// Mock classes for entities not implemented in local client
export class CategoryBudget {
  static async list() { return []; }
  static async create() { return {}; }
  static async filter() { return []; }
  static async update() { return {}; }
  static async delete() { return true; }
}

export class Tip {
  static async list() { return []; }
  static async create() { return {}; }
  static async filter() { return []; }
  static async bulkCreate() { return []; }
  static async delete() { return true; }
}

export class FinancialPlan {
  static async list() { return []; }
  static async create() { return {}; }
}

export class FamilyMember {
  static async list() { return []; }
  static async filter() { return []; }
}

export class Invitation {
  static async list() { return []; }
  static async create() { return {}; }
}

export class Notification {
  static async list() { return []; }
  static async create() { return {}; }
}

export class MonthlyIncome {
  static async list() { return []; }
  static async create() { return {}; }
  static async filter() { return []; }
  static async update() { return {}; }
}

export class StripeEventLog {
  static async list() { return []; }
  static async filter() { return []; }
}

export class DiscountCode {
  static async list() { return []; }
  static async validate() { return { valid: false, message: 'Local mode - Discounts not available' }; }
}
