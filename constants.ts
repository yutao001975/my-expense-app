import React from 'react';
import { Category } from './types';
import { 
  ShoppingCartIcon, 
  BanknotesIcon, 
  HomeIcon, 
  TruckIcon, 
  HeartIcon, 
  WrenchScrewdriverIcon, 
  SparklesIcon,
  BuildingOffice2Icon,
  CurrencyYenIcon,
  BriefcaseIcon,
  ReceiptRefundIcon,
} from '@heroicons/react/24/outline';


// A palette of distinct colors for company sites
const SITE_COLORS = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#6366f1', // indigo-500
];

export const COMPANY_SITES: Category[] = [
  '3', '5', '7', '8', '9', '10', '11', '12', '13'
].map((site, index) => ({
  id: `site-${site}`,
  name: `${site}号场区`,
  icon: BuildingOffice2Icon,
  color: SITE_COLORS[index % SITE_COLORS.length] // Assign a unique color from the palette
}));

export const PERSONAL_CATEGORIES: Category[] = [
  { id: 'food', name: '餐饮', icon: BanknotesIcon, color: '#10b981' }, // Emerald
  { id: 'shopping', name: '购物', icon: ShoppingCartIcon, color: '#3b82f6' }, // Blue
  { id: 'housing', name: '住房', icon: HomeIcon, color: '#f97316' }, // Orange
  { id: 'transport', name: '交通', icon: TruckIcon, color: '#6366f1' }, // Indigo
  { id: 'entertainment', name: '娱乐', icon: SparklesIcon, color: '#ec4899' }, // Pink
  { id: 'health', name: '健康', icon: HeartIcon, color: '#ef4444' }, // Red
  { id: 'other', name: '其他', icon: WrenchScrewdriverIcon, color: '#6b7280' }, // Gray
];

export const INCOME_CATEGORIES: Category[] = [
    { id: 'salary', name: '工资', icon: CurrencyYenIcon, color: '#22c55e' }, // green-500
    { id: 'side-hustle', name: '副业', icon: BriefcaseIcon, color: '#f59e0b' }, // amber-500
    { id: 'reimbursement-received', name: '报销到账', icon: ReceiptRefundIcon, color: '#3b82f6' }, // blue-500
];