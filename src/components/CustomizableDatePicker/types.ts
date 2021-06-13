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
  isAfter: (firstDate: Date, secondDate: Date) => boolean;
  isBetween: (date: Date, firstDate: Date, secondDate: Date) => boolean;
}

export type RangeValue = {
  start: Date;
  end: Date;
};

export type InputValue = Date | RangeValue;

export type Day = {
  dayInMonth: number;
  month: number;
  year: number;
  isSelected: boolean;
  isBetween: boolean;
  disabled: boolean;
  startRange: boolean;
  endRange: boolean;
};
