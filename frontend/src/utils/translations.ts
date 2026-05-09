import type { Language } from '../types';

const translations = {
  th: {
    appTitle: 'LogLife',
    addExpense: 'บันทึกค่าใช้จ่าย',
    history: 'ประวัติค่าใช้จ่าย',
    description: 'รายละเอียด',
    amount: 'จำนวน',
    category: 'หมวดหมู่',
    date: 'วันที่',
    day: 'วัน',
    month: 'เดือน',
    year: 'ปี',
    food: 'อาหาร',
    supplies: 'ของใช้',
    other: 'อื่นๆ',
    total: 'รวม',
    entries: 'จำนวนรายการ',
    delete: 'ลบ',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    thb: '฿',
    byCategory: 'จำแนกตามหมวดหมู่',
    expenseList: 'รายการค่าใช้จ่าย',
    noExpenses: 'ไม่มีรายการค่าใช้จ่าย',
    language: 'ภาษา',
    back: 'กลับ',
    schedule: 'ตารางเวลา',
    title: 'กิจกรรม',
    note: 'โน้ต',
    startTime: 'เวลาเริ่ม',
    endTime: 'เวลาจบ',
    edit: 'แก้ไข',
    addActivity: 'เพิ่มกิจกรรม',
    editActivity: 'แก้ไขกิจกรรม',
    overlapError: 'เวลานี้มีการใช้งานอยู่แล้ว',
    monday: 'วันจันทร์',
    tuesday: 'วันอังคาร',
    wednesday: 'วันพุธ',
    thursday: 'วันพฤหัสบดี',
    friday: 'วันศุกร์',
    saturday: 'วันเสาร์',
    sunday: 'วันอาทิตย์',
  },
  en: {
    appTitle: 'LogLife',
    addExpense: 'Add Expense',
    history: 'History',
    description: 'Description',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    day: 'Day',
    month: 'Month',
    year: 'Year',
    food: 'Food',
    supplies: 'Supplies',
    other: 'Other',
    total: 'Total',
    entries: 'Entries',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    thb: '฿',
    byCategory: 'By Category',
    expenseList: 'Expense List',
    noExpenses: 'No expenses found',
    language: 'Language',
    back: 'Back',
    schedule: 'Schedule',
    title: 'Activity',
    note: 'Note',
    startTime: 'Start Time',
    endTime: 'End Time',
    edit: 'Edit',
    addActivity: 'Add Activity',
    editActivity: 'Edit Activity',
    overlapError: 'This time is already occupied',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  },
};

export const t = (key: keyof typeof translations.th, lang: Language): string => {
  return translations[lang][key] || key;
};

export const getDateDisplay = (dateStr: string, lang: Language): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(
    lang === 'th' ? 'th-TH' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ).format(date);
};

export const getMonthDisplay = (dateStr: string, lang: Language): string => {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat(
    lang === 'th' ? 'th-TH' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
    }
  ).format(date);
};

export const getYearDisplay = (yearStr: string, lang: Language): string => {
  const date = new Date(parseInt(yearStr), 0);
  return new Intl.DateTimeFormat(
    lang === 'th' ? 'th-TH' : 'en-US',
    {
      year: 'numeric',
    }
  ).format(date);
};
