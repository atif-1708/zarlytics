
export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
}

export interface Business {
  id: string;
  name: string;
}

export interface DailySale {
  id: string;
  businessId: string;
  date: string; // YYYY-MM-DD
  salesAmount: number;
  profitPercent: number;
  profitAmount: number; // Calculated
}

export interface MonthlyExpense {
  id: string;
  businessId: string;
  month: string; // YYYY-MM
  expenseAmount: number;
}

export interface FilterState {
  businessId: string;
  dateRange: { start: string; end: string } | null;
  selectedMonth: string; // YYYY-MM
  selectedYear: string; // YYYY
  lifetime: boolean;
}

export interface DashboardStats {
  totalSales: number;
  totalProfit: number;
  totalExpenses: number;
  netProfit: number;
}
