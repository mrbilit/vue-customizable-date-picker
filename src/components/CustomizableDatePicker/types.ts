export interface Calendar {
  daysInMonth: (month: number, year: number) => number;
  firstDayInMonth: (month: number, year: number) => number;
  getDate: (year: number, month: number, day: number) => Date;
  getYear: (date: Date) => number;
  getMonth: (date: Date) => number;
  getDayInMonth: (date: Date) => number;
  startDayWeek: number;
  weekdays: string[];
  weekdaysMin: string[];
  months: string[];
  currentYear: number;
  currentMonth: number;
  currentDay: number;
}
