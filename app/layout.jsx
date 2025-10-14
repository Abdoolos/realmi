'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// نظام مصادقة بسيط مؤقت
import { createPageUrl } from "@/utils";
import { Home, Plus, List, BarChart3, Wallet, Gem, FileText, CalendarPlus, Smartphone, QrCode, Users, PieChart, Target, Tags, Sparkles, ClipboardList, Settings, ChevronDown, Menu, X, Shield, HelpCircle, Mail, FileText as TermsIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import PropTypes from 'prop-types';

import UserDataInitializer from '@/components/user/UserDataInitializer';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import ErrorBoundary from '@/components/utils/errorBoundary';
import { getEnvironmentInfo } from '@/components/utils/envUtils';
import AuthProvider from '@/../../components/AuthProvider';

// Import styles
import '../src/index.css';

// المجموعات الجديدة المنظمة
const mainNavItems = [
  { title: "الرئيسية", url: createPageUrl("Dashboard"), icon: Home, emoji: "🏠" },
];

// ✅ إضافة: قائمة جديدة للعائلة
const familyMenuItems = [
  { title: "لوحة تحكم العائلة", url: createPageUrl("FamilyDashboard"), icon: PieChart, emoji: "📊" },
  { title: "إدارة العائلة", url: createPageUrl("MyFamily"), icon: Users, emoji: "👨‍👩‍👧‍👦" }
];

const expenseMenuItems = [
  { title: "إضافة مصروف", url: createPageUrl("AddExpense"), icon: Plus, emoji: "➕" },
  { title: "قائمة المصاريف", url: createPageUrl("ExpensesList"), icon: List, emoji: "📋" }
];

const reportsMenuItems = [
  { title: "التقرير الشهري", url: createPageUrl("MonthlyReport"), icon: FileText, emoji: "📄" },
  { title: "الإحصائيات", url: createPageUrl("Analytics"), icon: BarChart3, emoji: "📈" },
  { title: "تقرير العائلة", url: createPageUrl("FamilyReport"), icon: PieChart, emoji: "📊" }
];

const managementMenuItems = [
  { title: "إدارة الفئات", url: createPageUrl("ManageCategories"), icon: Tags, emoji: "🏷️" },
  { title: "إدارة الميزانيات", url: createPageUrl("ManageBudgets"), icon: Target, emoji: "🎯" },
  { title: "إدارة المناسبات", url: createPageUrl("ManageEvents"), icon: CalendarPlus, emoji: "📅" },
  { title: "الدخل العائلي", url: createPageUrl("FamilyIncome"), icon: Wallet, emoji: "💰" }
];

const accountMenuItems = [
  { title: "إدارة الحساب", url: createPageUrl("Account"), icon: Settings, emoji: "⚙️" },
  { title: "عنّا", url: createPageUrl("About"), icon: Heart, emoji: "💝" },
  { title: "الأسعار", url: createPageUrl("Pricing"), icon: Gem, emoji: "💎" },
];

const secondaryNavItems = [
  { title: "الخطة", url: createPageUrl("FinancialPlanner"), icon: ClipboardList, emoji: "📊" },
  { title: "المساعد الذكي", url: createPageUrl("FinancialChatbot"), icon: Sparkles, emoji: "🤖" }
];

function NavLink({ item, pathname }) {
  const isActive = pathname === item.url;
  return (
    <Link href={item.url}>
      <motion.div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
          isActive ?
            "bg-emerald-100 text-emerald-800" :
            "text-emerald-700 hover:bg-emerald-50"}`
        }
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}>
        <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-emerald-500'}`} />
        <span className="font-medium text-sm">{item.title}</span>
      </motion.div>
    </Link>
  );
}

NavLink.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired
  }).isRequired,
  pathname: PropTypes.string.isRequired
};

function DropdownNavMenu({ title, items, icon: Icon, pathname }) {
  const hasActiveItem = items.some((item) => item.url === pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
            hasActiveItem ?
              "bg-emerald-100 text-emerald-800" :
              "text-emerald-700 hover:bg-emerald-50"}`
          }>
          <Icon className={`w-4 h-4 ${hasActiveItem ? 'text-emerald-600' : 'text-emerald-500'}`} />
          <span className="font-medium text-sm">{title}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {items.map((item) =>
          <DropdownMenuItem key={item.title} asChild>
            <Link href={item.url} className="flex items-center gap-3 px-3 py-2 w-full">
              <item.icon className="w-4 h-4 text-emerald-500" />
              <span>{item.title}</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

DropdownNavMenu.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired
  })).isRequired,
  icon: PropTypes.elementType.isRequired,
  pathname: PropTypes.string.isRequired
};

function MobileNavLink({ item, pathname, onClose }) {
  const isActive = pathname === item.url;
  return (
    <Link href={item.url} onClick={onClose}>
      <div className={`flex items-center gap-4 px-6 py-4 transition-colors duration-200 ${
        isActive ?
          "bg-emerald-100 text-emerald-800 border-r-4 border-emerald-600" :
          "text-emerald-700 hover:bg-emerald-50"}`
      }>
        <span className="text-xl">{item.emoji}</span>
        <span className="font-medium text-lg">{item.title}</span>
      </div>
    </Link>
  );
}

MobileNavLink.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired
  }).isRequired,
  pathname: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

function MobileNavSection({ title, items, pathname, onClose, emoji, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasActiveItem = items.some((item) => item.url === pathname);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full flex items-center justify-between gap-4 px-6 py-4 text-lg font-medium transition-colors duration-200 ${
            hasActiveItem ?
              "bg-emerald-100 text-emerald-800" :
              "text-emerald-700 hover:bg-emerald-50"}`
          }>
          <div className="flex items-center gap-4">
            <span className="text-xl">{emoji}</span>
            <span>{title}</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-emerald-25/30">
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Link key={item.title} href={item.url} onClick={onClose}>
              <div className={`flex items-center gap-4 px-12 py-3 transition-colors duration-200 ${
                isActive ?
                  "bg-emerald-100 text-emerald-800 border-r-4 border-emerald-600" :
                  "text-emerald-600 hover:bg-emerald-50"}`
              }>
                <span className="text-base">{item.emoji}</span>
                <span className="font-medium">{item.title}</span>
              </div>
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

MobileNavSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired
  })).isRequired,
  pathname: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  emoji: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool
};

function LayoutContent({ children }) {
  const pathname = usePathname();
  const [qrUrl, setQrUrl] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [envInfo, setEnvInfo] = useState(null);

  useEffect(() => {
    // الحصول على معلومات البيئة
    const env = getEnvironmentInfo();
    setEnvInfo(env);
    
    // Only set QR URL if running in a client-side environment (browser)
    if (env.isClient) {
      setQrUrl(window.location.href);
    }
  }, [pathname]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // التحقق من تحميل معلومات البيئة
  if (!envInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
            <Toaster richColors position="top-center" />
            <UserDataInitializer />
            <SubscriptionBanner />
            
            {/* إضافة معلومات البيئة في بيئة التطوير */}
            {envInfo?.environment === 'development' && envInfo?.isPreview && (
              <div className="bg-yellow-100 border-yellow-200 text-yellow-800 text-center py-1 text-xs">
                🚧 بيئة المعاينة (Preview) - بعض الميزات قد لا تعمل كما هو متوقع في الإنتاج
              </div>
            )}

            <style>{`
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
                .page-break-avoid {
                  break-inside: avoid;
                }
                .report-print-container {
                  padding-top: 1rem;
                  padding-bottom: 1rem;
                }
              }
            `}</style>
            
            <div className="flex flex-col min-h-screen">
              <header className="sticky top-0 z-50 w-full border-b border-emerald-200/80 bg-white/80 backdrop-blur-sm print:hidden">
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="container mx-auto flex items-center justify-between h-20 px-4 md:px-6">

                  {/* Right Side: Logo for Desktop, Menu for Mobile */}
                  <div className="flex items-center gap-4">
                    <Link href={createPageUrl("Dashboard")} className="hidden lg:flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md shrink-0">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="font-bold text-emerald-800 text-xl">ريال مايند</h2>
                    </Link>

                    {/* Mobile Hamburger Menu */}
                    <div className="lg:hidden">
                      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-emerald-100">
                            <Menu className="w-8 h-8 text-emerald-700" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent
                          side="right"
                          className="w-[70vw] p-0 bg-white border-l-emerald-200 flex flex-col">

                          {/* Header */}
                          <div className="flex items-center justify-between p-6 border-b border-emerald-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Wallet className="w-6 h-6 text-white" />
                              </div>
                              <h2 className="font-bold text-emerald-800 text-lg">ريال مايند</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                              <X className="w-6 h-6 text-emerald-600" />
                            </Button>
                          </div>

                          {/* Primary Action Button */}
                          <div className="p-4 border-b border-emerald-100">
                            <Link href={createPageUrl("AddExpense")} onClick={closeMobileMenu}>
                              <Button className="w-full bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white shadow-lg text-lg py-6 rounded-xl">
                                <Plus className="w-6 h-6 ml-3" />
                                إضافة مصروف جديد
                              </Button>
                            </Link>
                          </div>

                          {/* Navigation Menu */}
                          <div className="flex-1 overflow-y-auto">
                            <nav className="pb-6">
                              {/* Main Items */}
                              {mainNavItems.map((item) =>
                                <MobileNavLink
                                  key={item.title}
                                  item={item}
                                  pathname={pathname}
                                  onClose={closeMobileMenu} />
                              )}
                              
                              {/* Family Section */}
                              <MobileNavSection
                                title="العائلة"
                                emoji="👨‍👩‍👧‍👦"
                                items={familyMenuItems}
                                pathname={pathname}
                                onClose={closeMobileMenu} />

                              {/* Expense Section */}
                              <MobileNavSection
                                title="المصاريف"
                                emoji="💸"
                                items={expenseMenuItems}
                                pathname={pathname}
                                onClose={closeMobileMenu} />

                              {/* Reports Section */}
                              <MobileNavSection
                                title="التقارير"
                                emoji="📊"
                                items={reportsMenuItems}
                                pathname={pathname}
                                onClose={closeMobileMenu} />

                              {/* Management Section */}
                              <MobileNavSection
                                title="إدارة"
                                emoji="⚙️"
                                items={managementMenuItems}
                                pathname={pathname}
                                onClose={closeMobileMenu} />

                              {/* Secondary Items */}
                              {secondaryNavItems.map((item) =>
                                <MobileNavLink
                                  key={item.title}
                                  item={item}
                                  pathname={pathname}
                                  onClose={closeMobileMenu} />
                              )}

                              {/* Account Items */}
                              <MobileNavSection
                                title="حسابي"
                                emoji="👤"
                                items={accountMenuItems}
                                pathname={pathname}
                                onClose={closeMobileMenu}
                              />
                            </nav>
                          </div>

                          {/* Footer */}
                          <div className="p-4 border-t border-emerald-100 bg-emerald-25/30">
                            <div className="flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200">
                                <span className="text-base font-bold text-emerald-600">م</span>
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>

                  {/* Center: Desktop Nav, Mobile Title */}
                  <div className="flex-1 flex justify-center">
                    <nav className="hidden lg:flex items-center gap-1">
                      {/* الرئيسية */}
                      {mainNavItems.map((item) =>
                        <NavLink key={item.title} item={item} pathname={pathname} />
                      )}

                      {/* قائمة العائلة المنسدلة */}
                      <DropdownNavMenu
                        title="العائلة"
                        items={familyMenuItems}
                        icon={Users}
                        pathname={pathname} />

                      {/* المصاريف - قائمة منسدلة */}
                      <DropdownNavMenu
                        title="المصاريف"
                        items={expenseMenuItems}
                        icon={Plus}
                        pathname={pathname} />

                      {/* التقارير - قائمة منسدلة */}
                      <DropdownNavMenu
                        title="التقارير"
                        items={reportsMenuItems}
                        icon={BarChart3}
                        pathname={pathname} />

                      {/* إدارة - قائمة منسدلة */}
                      <DropdownNavMenu
                        title="إدارة"
                        items={managementMenuItems}
                        icon={Settings}
                        pathname={pathname} />

                      {/* العناصر الثانوية */}
                      {secondaryNavItems.map((item) =>
                        <NavLink key={item.title} item={item} pathname={pathname} />
                      )}
                    </nav>

                    {/* Mobile Logo */}
                    <Link href={createPageUrl("Dashboard")} className="lg:hidden flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md shrink-0">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="font-bold text-emerald-800 text-base">ريال مايند</h2>
                    </Link>
                  </div>

                  {/* Left Side: Actions */}
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-emerald-700 hover:bg-emerald-100">
                          <Smartphone className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 font-semibold text-emerald-800">
                          <QrCode className="w-4 h-4" />
                          <span>افتح على جوالك</span>
                        </div>
                        {qrUrl ?
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}&qzone=1`}
                            alt="QR Code"
                            width={160}
                            height={160} /> :
                          <div className="w-40 h-40 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                            جاري تحميل الرمز...
                          </div>
                        }
                        <p className="text-xs text-center text-emerald-600 max-w-[160px]">
                          امسح الرمز بكاميرا جوالك للمتابعة من حيث توقفت.
                        </p>
                      </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 shrink-0">
                          <span className="text-base font-bold text-emerald-600">م</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {accountMenuItems.map((item) => (
                          <DropdownMenuItem key={item.title} asChild>
                            <Link href={item.url} className="flex items-center gap-3 px-3 py-2 w-full">
                              <item.icon className="w-4 h-4 text-emerald-500" />
                              <span>{item.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              </header>

              <main className="flex-1 overflow-auto">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="container mx-auto p-4 md:p-8 report-print-container">
                  {children}
                </motion.div>
              </main>

              {/* Footer */}
              <footer className="bg-white border-t border-emerald-200 mt-16 print:hidden">
                <div className="container mx-auto px-4 md:px-6 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="text-center md:text-right">
                      <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-emerald-800 text-xl">ريال مايند</h3>
                      </div>
                      <p className="text-emerald-600 text-sm leading-relaxed">
                        تطبيق ذكي لإدارة المصاريف العائلية<br />
                        بتقنيات الذكاء الاصطناعي
                      </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center">
                      <h4 className="font-semibold text-emerald-800 mb-4">روابط سريعة</h4>
                      <div className="space-y-2">
                        <Link href={createPageUrl("Dashboard")} className="block text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                          الصفحة الرئيسية
                        </Link>
                        <Link href={createPageUrl("AddExpense")} className="block text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                          إضافة مصروف
                        </Link>
                        <Link href={createPageUrl("MonthlyReport")} className="block text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                          التقرير الشهري
                        </Link>
                        <Link href={createPageUrl("Analytics")} className="block text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                          الإحصائيات
                        </Link>
                      </div>
                    </div>

                    {/* About Us Links */}
                    <div className="text-center">
                      <h4 className="font-semibold text-emerald-800 mb-4">معلومات عنّا</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 justify-center">
                          <Heart className="w-4 h-4 text-emerald-500" />
                          <Link href={createPageUrl("About")} className="text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                            قصة ريال مايند
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          <Link href={createPageUrl("PrivacyPolicy")} className="text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                            سياسة الخصوصية
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <TermsIcon className="w-4 h-4 text-emerald-500" />
                          <Link href={createPageUrl("TermsOfService")} className="text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                            شروط الاستخدام
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Support Links */}
                    <div className="text-center md:text-left">
                      <h4 className="font-semibold text-emerald-800 mb-4">الدعم والمساعدة</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                          <HelpCircle className="w-4 h-4 text-emerald-500" />
                          <Link href={createPageUrl("Support")} className="text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                            الدعم الفني
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                          <Mail className="w-4 h-4 text-emerald-500" />
                          <Link href={createPageUrl("Contact")} className="text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                            تواصل معنا
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                          <Mail className="w-4 h-4 text-emerald-500" />
                          <a href="mailto:support@rialmind.com" className="text-emerald-600 hover:text-emerald-800 transition-colors text-sm">
                            support@riyalmind.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Copyright */}
                  <div className="border-t border-emerald-100 mt-8 pt-6 text-center">
                    <p className="text-emerald-600 text-sm">
                      © 2025 ريال مايند - جميع الحقوق محفوظة
                    </p>
                    <p className="text-emerald-500 text-xs mt-1">
                      تم التطوير بتقنيات حديثة لخدمة العائلات السعودية
                    </p>
                  </div>
                </div>
              </footer>
            </div>
    </div>
  );
}

LayoutContent.propTypes = {
  children: PropTypes.node.isRequired
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired
};
