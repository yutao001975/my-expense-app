import React, { useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseType, View, Category, Income, Transaction } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { COMPANY_SITES, PERSONAL_CATEGORIES, INCOME_CATEGORIES } from './constants';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Statistics from './components/Statistics';
import Modal from './components/common/Modal';
import IncomeList from './components/IncomeList';

function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [income, setIncome] = useLocalStorage<Income[]>('income', []);
  const [activeView, setActiveView] = useState<View>('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddExpense = useCallback((expenseData: Omit<Expense, 'id' | 'type' | 'reimbursed'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4(),
      type: activeView === 'company' ? ExpenseType.COMPANY : ExpenseType.PERSONAL,
      reimbursed: false,
    };
    setExpenses(prevExpenses => [...prevExpenses, newExpense].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [activeView, setExpenses]);
  
  const handleAddIncome = useCallback((incomeData: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...incomeData,
      id: uuidv4(),
    };
    setIncome(prevIncome => [...prevIncome, newIncome].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [setIncome]);

  const handleDeleteExpense = useCallback((id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  }, [setExpenses]);

  const handleDeleteIncome = useCallback((id: string) => {
    setIncome(prevIncome => prevIncome.filter(inc => inc.id !== id));
  }, [setIncome]);

  const handleToggleReimbursed = useCallback((id: string) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense.id === id ? { ...expense, reimbursed: !expense.reimbursed } : expense
      )
    );
  }, [setExpenses]);

  const filteredExpenses = useMemo(() => {
    if (activeView === 'income') return [];
    const targetType = activeView === 'company' ? ExpenseType.COMPANY : ExpenseType.PERSONAL;
    return expenses.filter(expense => expense.type === targetType);
  }, [expenses, activeView]);

  const currentTransactions = useMemo(() => {
     return activeView === 'income' ? income : filteredExpenses;
  }, [income, filteredExpenses, activeView]);

  const categories: Category[] = useMemo(() => {
    if (activeView === 'company') return COMPANY_SITES;
    if (activeView === 'personal') return PERSONAL_CATEGORIES;
    return INCOME_CATEGORIES;
  }, [activeView]);
  
  const handleAddTransaction = (data: { amount: number; description: string; date: string; category: string; }) => {
    if (activeView === 'income') {
      handleAddIncome(data);
    } else {
      handleAddExpense(data);
    }
  };
  
  const modalTitle = useMemo(() => {
    if (activeView === 'personal') return '添加个人消费记录';
    if (activeView === 'company') return '添加公司采购记录';
    if (activeView === 'income') return '添加收入记录';
    return '添加记录';
  }, [activeView]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />

      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-slate-200/80">
          <div className="flex flex-wrap justify-between items-center mb-6 border-b border-slate-200 pb-4 gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView('personal')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeView === 'personal' ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300/70'}`}
              >
                个人消费
              </button>
              <button
                onClick={() => setActiveView('company')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeView === 'company' ? 'bg-violet-500 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300/70'}`}
              >
                公司采购
              </button>
              <button
                onClick={() => setActiveView('income')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeView === 'income' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300/70'}`}
              >
                收入记录
              </button>
            </div>
             <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              添加记录
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
               {activeView === 'income' ? (
                <>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">收入明细</h2>
                  <IncomeList income={income} onDelete={handleDeleteIncome} categories={categories} />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">账单明细</h2>
                  <ExpenseList expenses={filteredExpenses} onDelete={handleDeleteExpense} onToggleReimbursed={handleToggleReimbursed} categories={categories} />
                </>
              )}
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-800 mb-4">月度统计</h2>
              <Statistics 
                transactions={currentTransactions}
                categories={categories}
                viewType={activeView === 'income' ? 'income' : 'expense'}
              />
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <ExpenseForm 
          onAdd={handleAddTransaction} 
          onClose={() => setIsModalOpen(false)}
          categories={categories}
          viewType={activeView}
        />
      </Modal>
    </div>
  );
}

export default App;