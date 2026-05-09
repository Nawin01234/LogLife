import type { Expense, SummaryResponse, Schedule } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = {
  // Create expense
  async createExpense(
    description: string,
    amount: number,
    category: string,
    date: string
  ): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
        amount,
        category,
        date: new Date(date).toISOString(),
      }),
    });

    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  },

  // Get all expenses
  async getAllExpenses(): Promise<Expense[]> {
    const response = await fetch(`${API_BASE_URL}/expenses?period=all`);
    if (!response.ok) throw new Error('Failed to fetch all expenses');
    return response.json();
  },

  // Get expenses
  async getExpenses(
    period: 'day' | 'month' | 'year' = 'day',
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<Expense[]> {
    const response = await fetch(
      `${API_BASE_URL}/expenses?period=${period}&date=${date}`
    );
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  },

  // Get summary
  async getSummary(
    period: 'day' | 'month' | 'year' = 'day',
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<SummaryResponse> {
    const response = await fetch(
      `${API_BASE_URL}/expenses/summary?period=${period}&date=${date}`
    );
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
  },

  // Delete expense
  async deleteExpense(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete expense');
  },

  // Schedules
  async getSchedules(): Promise<Schedule[]> {
    const response = await fetch(`${API_BASE_URL}/schedules`);
    if (!response.ok) throw new Error('Failed to fetch schedules');
    return response.json();
  },

  async createSchedule(data: Omit<Schedule, 'id'>): Promise<Schedule> {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.status === 409) throw new Error('Schedule overlaps with another activity');
    if (!response.ok) throw new Error('Failed to create schedule');
    return response.json();
  },

  async updateSchedule(id: number, data: Omit<Schedule, 'id'>): Promise<Schedule> {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.status === 409) throw new Error('Schedule overlaps with another activity');
    if (!response.ok) throw new Error('Failed to update schedule');
    return response.json();
  },

  async deleteSchedule(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete schedule');
  },
};
