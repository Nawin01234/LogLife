export type ExpenseCategory = 'food' | 'supplies' | 'other';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export type ViewPeriod = 'day' | 'month' | 'year';

export type Language = 'th' | 'en';

export interface SummaryResponse {
  period: string;
  total: number;
  count: number;
  by_category: Record<string, number>;
  expenses: Expense[];
}

export interface Schedule {
  id: number;
  day_of_week: number;
  title: string;
  note: string;
  start_hour: number;
  end_hour: number;
}
