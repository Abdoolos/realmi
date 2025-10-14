س'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPageUrl } from "@/utils";
import { isPageDisabled } from "@/config/routes";
import { 
  Home, Plus, List, BarChart3, Wallet, Gem, FileText, CalendarPlus, 
  Smartphone, QrCode, Users, PieChart, Target, Tags, Sparkles, 
  ClipboardList, Settings, ChevronDown, Menu, X, Shield, 
  HelpCircle, Mail, FileText as TermsIcon, Heart, Lock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PropTypes from 'prop-types';

// المجموعات المحسنة مع حالة العناصر
const mainNavItems = [
  { title: "الرئيسية", url: createPageUrl("Dashboard"), icon: Home, emoji: "🏠", status: "ready" },
];

const familyMenuItems = [
  { title: "لوحة تحكم العائلة", url: createPageUrl("FamilyDashboard"), icon: PieChart, emoji: "📊", status: "ready" },
  { title: "إدارة العائلة", url: createPageUrl("MyFamily"), icon: Users, emoji: "👨‍👩‍👧‍👦", status: "ready" }
];

const expenseMenuItems = [
  { title: "إضافة مصروف", url: createPageUrl("AddExpense"), icon: Plus, emoji: "➕", status: "ready" },
  { title: "قائمة المصاريف", url: createPageUrl("ExpensesList"), icon: List, emoji: "📋", status: "ready" }
];

const reportsMenuItems = [
  { title: "التقرير الشهري", url: createPageUrl("MonthlyReport"), icon: FileText, emoji: "📄", status: "ready" },
  { title: "الإحصائيات", url: createPageUrl("Analytics"), icon: BarChart3, emoji: "📈", status: "ready" },
  { title: "تقرير العائلة", url: createPageUrl("FamilyReport"), icon: PieChart, emoji: "📊", status: "basic" }
];

const managementMenuItems = [
  { title: "إدارة الفئات", url: createPageUrl("ManageCategories"), icon: Tags, emoji: "🏷️", status: "ready" },
  { title: "إدارة الميزانيات", url: createPageUrl("ManageBudgets"), icon: Target, emoji: "🎯", status: "basic" },
  { title: "إدارة المناسبات", url: createPageUrl("ManageEvents"), icon: CalendarPlus, emoji: "📅", status: "basic" },
  { title: "الدخل العائلي", url: createPageUrl("FamilyIncome"), icon: Wallet, emoji: "💰", status: "basic" }
];

const accountMenuItems = [
  { title: "إدارة الحساب", url: createPageUrl("Account"), icon: Settings, emoji: "⚙️", status: "basic" },
  { title: "عنّا", url: createPageUrl("About"), icon: Heart, emoji: "💝", status: "ready" },
  { title: "الأسعار", url: createPageUrl("Pricing"), icon: Gem, emoji: "💎", status: "ready" },
];

const secondaryNavItems = [
  { title: "الخطة", url: createPageUrl("FinancialPlanner"), icon: ClipboardList, emoji: "📊", status: "basic" },
  { 
    title: "المساعد الذكي", 
    url: createPageUrl("FinancialChatbot"), 
    icon: Sparkles, 
    emoji: "🤖", 
    status: "ready"
  }
];

// مكون محسن للروابط مع دعم الحالات المختلفة
function EnhancedNavLink({ item, pathname, onClick }) {
  const isActive = pathname === item.url && item.status !== 'disabled';
  const isDisabled = item.status === 'disabled';
  const isBasic = item.status === 'basic';

  const linkContent = (
    <motion.div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 relative ${
        isDisabled 
          ? "text-gray-400 cursor-not-allowed opacity-60" 
          : isActive
            ? "bg-emerald-100 text-emerald-800"
            : "text-emerald-700 hover:bg-emerald-50"
      } ${isBasic ? "border border-amber-200 bg-amber-50/30" : ""}`}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}>
      
      <item.icon className={`w-4 h-4 ${
        isDisabled 
          ? 'text-gray-400' 
          : isActive 
            ? 'text-emerald-600' 
            : 'text-emerald-500'
      }`} />
      
      <span className="font-medium text-sm">{item.title}</span>
      
      {isDisabled && <Lock className="w-3 h-3 text-gray-400 ml-1" />}
      {isBasic && <span className="text-xs bg-amber-200 text-amber-800 px-1 rounded ml-1">تجريبي</span>}
    </motion.div>
  );

  if (isDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{linkContent}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{item.tooltip || "هذه الميزة غير متاحة حالياً"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link href={item.url} onClick={onClick}>
      {linkContent}
    </Link>
  );
}

EnhancedNavLink.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    status: PropTypes.string,
    tooltip: PropTypes.string
  }).isRequired,
  pathname: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

// مكون محسن للقوائم المنسدلة
function EnhancedDropdownMenu({ title, items, icon: Icon, pathname }) {
  const hasActiveItem = items.some((item) => item.url === pathname && item.status !== 'disabled');
  const readyItems = items.filter(item => item.status === 'ready');
  const basicItems = items.filter(item => item.status === 'basic');
  const disabledItems = items.filter(item => item.status === 'disabled');

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
      <DropdownMenuContent align="end" className="w-56">
        
        {/* العناصر الجاهزة */}
        {readyItems.map((item) => (
          <DropdownMenuItem key={item.title} asChild>
            <Link href={item.url} className="flex items-center gap-3 px-3 py-2 w-full">
              <item.icon className="w-4 h-4 text-emerald-500" />
              <span>{item.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        
        {/* فاصل إذا كان هناك عناصر تجريبية */}
        {basicItems.length > 0 && readyItems.length > 0 && <DropdownMenuSeparator />}
        
        {/* العناصر التجريبية */}
        {basicItems.map((item) => (
          <DropdownMenuItem key={item.title} asChild>
            <Link href={item.url} className="flex items-center gap-3 px-3 py-2 w-full">
              <item.icon className="w-4 h-4 text-amber-500" />
              <span className="flex items-center gap-2">
                {item.title}
                <span className="text-xs bg-amber-200 text-amber-800 px-1 rounded">تجريبي</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
        
        {/* فاصل إذا كان هناك عناصر معطلة */}
        {disabledItems.length > 0 && (readyItems.length > 0 || basicItems.length > 0) && <DropdownMenuSeparator />}
        
        {/* العناصر المعطلة */}
        {disabledItems.map((item) => (
          <DropdownMenuItem key={item.title} disabled className="flex items-center gap-3 px-3 py-2 w-full opacity-50">
            <item.icon className="w-4 h-4 text-gray-400" />
            <span className="flex items-center gap-2">
              {item.title}
              <Lock className="w-3 h-3 text-gray-400" />
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

EnhancedDropdownMenu.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    status: PropTypes.string
  })).isRequired,
  icon: PropTypes.elementType.isRequired,
  pathname: PropTypes.string.isRequired
};

// مكون محسن للهاتف المحمول
function EnhancedMobileNavLink({ item, pathname, onClose }) {
  const isActive = pathname === item.url && item.status !== 'disabled';
  const isDisabled = item.status === 'disabled';
  const isBasic = item.status === 'basic';

  const content = (
    <div className={`flex items-center gap-4 px-6 py-4 transition-colors duration-200 ${
      isDisabled 
        ? "text-gray-400 cursor-not-allowed opacity-60"
        : isActive
          ? "bg-emerald-100 text-emerald-800 border-r-4 border-emerald-600"
          : "text-emerald-700 hover:bg-emerald-50"
    } ${isBasic ? "border-l-2 border-amber-300" : ""}`}>
      <span className="text-xl">{item.emoji}</span>
      <div className="flex-1">
        <span className="font-medium text-lg">{item.title}</span>
        {isBasic && <div className="text-xs text-amber-600 mt-1">نسخة تجريبية</div>}
        {isDisabled && <div className="text-xs text-gray-500 mt-1">قريباً</div>}
      </div>
      {isDisabled && <Lock className="w-4 h-4 text-gray-400" />}
    </div>
  );

  if (isDisabled) {
    return content;
  }

  return (
    <Link href={item.url} onClick={onClose}>
      {content}
    </Link>
  );
}

EnhancedMobileNavLink.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
    status: PropTypes.string
  }).isRequired,
  pathname: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export {
  mainNavItems,
  familyMenuItems,
  expenseMenuItems,
  reportsMenuItems,
  managementMenuItems,
  accountMenuItems,
  secondaryNavItems,
  EnhancedNavLink,
  EnhancedDropdownMenu,
  EnhancedMobileNavLink
};
