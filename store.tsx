
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, Business, DailySale, MonthlyExpense } from './types';
import { generateId } from './utils';

// Environment variable detection for Production
const SUPABASE_URL = (process.env as any).SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (process.env as any).SUPABASE_ANON_KEY || '';

let supabase: any = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
        console.warn("Supabase initialization failed.");
    }
}

interface AppContextType {
  users: User[];
  businesses: Business[];
  sales: DailySale[];
  expenses: MonthlyExpense[];
  currentUser: User | null;
  loading: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addUser: (u: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, u: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addBusiness: (name: string) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  addSale: (s: Omit<DailySale, 'id' | 'profitAmount'>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  addExpense: (e: Omit<MonthlyExpense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [sales, setSales] = useState<DailySale[]>([]);
  const [expenses, setExpenses] = useState<MonthlyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zar_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!supabase) {
          // DEMO MODE
          const savedUsers = localStorage.getItem('zar_users');
          setUsers(savedUsers ? JSON.parse(savedUsers) : [{ id: '1', name: 'Admin Root', email: 'admin@zar.co.za', role: 'admin', password: 'password123' }]);
          setBusinesses(JSON.parse(localStorage.getItem('zar_businesses') || '[]'));
          setSales(JSON.parse(localStorage.getItem('zar_sales') || '[]'));
          setExpenses(JSON.parse(localStorage.getItem('zar_expenses') || '[]'));
        } else {
          // PRODUCTION MODE
          const [uRes, bRes, sRes, eRes] = await Promise.all([
            supabase.from('users').select('*'),
            supabase.from('businesses').select('*'),
            supabase.from('sales').select('*'),
            supabase.from('expenses').select('*')
          ]);
          
          if (uRes.data) setUsers(uRes.data);
          if (bRes.data) setBusinesses(bRes.data);
          if (sRes.data) setSales(sRes.data);
          if (eRes.data) setExpenses(eRes.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
        if (!supabase) {
            localStorage.setItem('zar_users', JSON.stringify(users));
            localStorage.setItem('zar_businesses', JSON.stringify(businesses));
            localStorage.setItem('zar_sales', JSON.stringify(sales));
            localStorage.setItem('zar_expenses', JSON.stringify(expenses));
        }
        if (currentUser) {
            localStorage.setItem('zar_current_user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('zar_current_user');
        }
    }
  }, [users, businesses, sales, expenses, currentUser, loading]);

  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addUser = async (u: Omit<User, 'id'>) => {
    const newUser = { ...u, id: generateId() };
    if (supabase) await supabase.from('users').insert([newUser]);
    setUsers(prev => [...prev, newUser]);
  };
  
  const updateUser = async (id: string, u: Partial<User>) => {
    if (supabase) await supabase.from('users').update(u).eq('id', id);
    setUsers(prev => prev.map(item => item.id === id ? { ...item, ...u } : item));
    if (currentUser?.id === id) setCurrentUser(prev => prev ? { ...prev, ...u } : null);
  };

  const deleteUser = async (id: string) => {
    if (id === '1') return;
    if (supabase) await supabase.from('users').delete().eq('id', id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addBusiness = async (name: string) => {
    const newBiz = { id: generateId(), name };
    if (supabase) await supabase.from('businesses').insert([newBiz]);
    setBusinesses(prev => [...prev, newBiz]);
  };

  const deleteBusiness = async (id: string) => {
    if (supabase) await supabase.from('businesses').delete().eq('id', id);
    setBusinesses(prev => prev.filter(b => b.id !== id));
  };

  const addSale = async (s: Omit<DailySale, 'id' | 'profitAmount'>) => {
    const profitAmount = s.salesAmount * (s.profitPercent / 100);
    const newSale = { ...s, id: generateId(), profitAmount };
    if (supabase) await supabase.from('sales').insert([newSale]);
    setSales(prev => [...prev, newSale]);
  };

  const deleteSale = async (id: string) => {
    if (supabase) await supabase.from('sales').delete().eq('id', id);
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const addExpense = async (e: Omit<MonthlyExpense, 'id'>) => {
    const newExp = { ...e, id: generateId() };
    if (supabase) await supabase.from('expenses').insert([newExp]);
    setExpenses(prev => [...prev, newExp]);
  };

  const deleteExpense = async (id: string) => {
    if (supabase) await supabase.from('expenses').delete().eq('id', id);
    setExpenses(prev => prev.filter(ex => ex.id !== id));
  };

  return (
    <AppContext.Provider value={{
      users, businesses, sales, expenses, currentUser, loading, login, logout,
      addUser, updateUser, deleteUser, addBusiness, deleteBusiness, addSale, deleteSale, addExpense, deleteExpense
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
