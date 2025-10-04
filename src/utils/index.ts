


export function createPageUrl(pageName: string) {
    // Handle special cases for Next.js routing
    const pageMap: Record<string, string> = {
        'SetupAccount': '/setup-account',
        'AddExpense': '/add-expense', 
        'FinancialChatbot': '/financial-chatbot',
        'Dashboard': '/dashboard',
        'CameraReceipts': '/camera-receipts', // If this page exists
    };
    
    return pageMap[pageName] || ('/' + pageName.toLowerCase().replace(/ /g, '-'));
}
