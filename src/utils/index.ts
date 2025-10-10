


export function createPageUrl(pageName: string) {
    // Handle special cases for Next.js routing
    const pageMap: Record<string, string> = {
        // الصفحات الموجودة حالياً
        'SetupAccount': '/setup-account',
        'AddExpense': '/add-expense', 
        'FinancialChatbot': '/financial-chatbot',
        'Dashboard': '/dashboard',
        'CameraReceipts': '/camera-receipts',
        
        // صفحات العائلة
        'FamilyDashboard': '/family-dashboard',
        'MyFamily': '/my-family',
        'FamilyIncome': '/family-income',
        'FamilyReport': '/family-report',
        
        // صفحات المصاريف
        'ExpensesList': '/expenses-list',
        
        // صفحات التقارير
        'MonthlyReport': '/monthly-report',
        'Analytics': '/analytics',
        
        // صفحات الإدارة
        'ManageCategories': '/manage-categories',
        'ManageBudgets': '/manage-budgets',
        'ManageEvents': '/manage-events',
        
        // صفحات الحساب والمعلومات
        'Account': '/account',
        'About': '/about',
        'Pricing': '/pricing',
        'Contact': '/contact',
        'Support': '/support',
        'PrivacyPolicy': '/privacy-policy',
        'TermsOfService': '/terms-of-service',
        
        // صفحات أخرى
        'FinancialPlanner': '/financial-planner',
    };
    
    return pageMap[pageName] || ('/' + pageName.toLowerCase().replace(/ /g, '-'));
}
