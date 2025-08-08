import React from 'react';

export enum ExpenseType {
  PERSONAL = 'PERSONAL',
  COMPANY = 'COMPANY',
}

export interface Income {
  id: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export interface Expense {
  id: string;
  type: ExpenseType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description: string;
  reimbursed?: boolean;
}

export type Transaction = Expense | Income;

export interface Category {
  id: string;
  name: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
}

export type View = 'personal' | 'company' | 'income';