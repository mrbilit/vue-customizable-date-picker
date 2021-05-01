export interface Calendar {
  daysInMonth: (month: number, year: number) => number;
  firstDayInMonth: (month: number, year: number) => number;
  startDayWeek: number;
  weekdays: string[];
  weekdaysMin: string[];
  months: string[];
  currentYear: number;
  currentMonth: number;
  currentDay: number;
}
