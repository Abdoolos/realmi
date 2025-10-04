import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import AddExpense from "./AddExpense";

import ExpensesList from "./ExpensesList";

import Analytics from "./Analytics";

import Subscription from "./Subscription";

import MonthlyReport from "./MonthlyReport";

import ManageEvents from "./ManageEvents";

import ManageBudgets from "./ManageBudgets";

import ManageCategories from "./ManageCategories";

import CameraReceipts from "./CameraReceipts";

import AIAssistant from "./AIAssistant";

import FinancialPlanner from "./FinancialPlanner";

import MyFamily from "./MyFamily";

import FamilyReport from "./FamilyReport";

import FamilyMonthlyReport from "./FamilyMonthlyReport";

import FamilyDashboard from "./FamilyDashboard";

import PrivacyPolicy from "./PrivacyPolicy";

import TermsOfService from "./TermsOfService";

import Support from "./Support";

import Contact from "./Contact";

import FAQ from "./FAQ";

import FamilyIncome from "./FamilyIncome";

import SetupAccount from "./SetupAccount";

import StripeEventMonitor from "./StripeEventMonitor";

import CheckoutSuccess from "./CheckoutSuccess";

import Pricing from "./Pricing";

import CheckoutCancel from "./CheckoutCancel";

import Account from "./Account";

import About from "./About";

import FinancialChatbot from "./FinancialChatbot";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    AddExpense: AddExpense,
    
    ExpensesList: ExpensesList,
    
    Analytics: Analytics,
    
    Subscription: Subscription,
    
    MonthlyReport: MonthlyReport,
    
    ManageEvents: ManageEvents,
    
    ManageBudgets: ManageBudgets,
    
    ManageCategories: ManageCategories,
    
    CameraReceipts: CameraReceipts,
    
    AIAssistant: AIAssistant,
    
    FinancialPlanner: FinancialPlanner,
    
    MyFamily: MyFamily,
    
    FamilyReport: FamilyReport,
    
    FamilyMonthlyReport: FamilyMonthlyReport,
    
    FamilyDashboard: FamilyDashboard,
    
    PrivacyPolicy: PrivacyPolicy,
    
    TermsOfService: TermsOfService,
    
    Support: Support,
    
    Contact: Contact,
    
    FAQ: FAQ,
    
    FamilyIncome: FamilyIncome,
    
    SetupAccount: SetupAccount,
    
    StripeEventMonitor: StripeEventMonitor,
    
    CheckoutSuccess: CheckoutSuccess,
    
    Pricing: Pricing,
    
    CheckoutCancel: CheckoutCancel,
    
    Account: Account,
    
    About: About,
    
    FinancialChatbot: FinancialChatbot,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/AddExpense" element={<AddExpense />} />
                
                <Route path="/ExpensesList" element={<ExpensesList />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Subscription" element={<Subscription />} />
                
                <Route path="/MonthlyReport" element={<MonthlyReport />} />
                
                <Route path="/ManageEvents" element={<ManageEvents />} />
                
                <Route path="/ManageBudgets" element={<ManageBudgets />} />
                
                <Route path="/ManageCategories" element={<ManageCategories />} />
                
                <Route path="/CameraReceipts" element={<CameraReceipts />} />
                
                <Route path="/AIAssistant" element={<AIAssistant />} />
                
                <Route path="/FinancialPlanner" element={<FinancialPlanner />} />
                
                <Route path="/MyFamily" element={<MyFamily />} />
                
                <Route path="/FamilyReport" element={<FamilyReport />} />
                
                <Route path="/FamilyMonthlyReport" element={<FamilyMonthlyReport />} />
                
                <Route path="/FamilyDashboard" element={<FamilyDashboard />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/FAQ" element={<FAQ />} />
                
                <Route path="/FamilyIncome" element={<FamilyIncome />} />
                
                <Route path="/SetupAccount" element={<SetupAccount />} />
                
                <Route path="/StripeEventMonitor" element={<StripeEventMonitor />} />
                
                <Route path="/CheckoutSuccess" element={<CheckoutSuccess />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/CheckoutCancel" element={<CheckoutCancel />} />
                
                <Route path="/Account" element={<Account />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/FinancialChatbot" element={<FinancialChatbot />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}