import { Calendar } from "./components/CustomizableDatePicker/types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import jalaliday from "jalaliday";

dayjs.extend(isBetween);
dayjs.extend(jalaliday);

export const gregorianCalendar: Calendar = {
  isAfter(first: Date, second: Date): boolean {
    return dayjs(first).isAfter(second, "day");
  },
  isBetween(date: Date, first: Date, second: Date): boolean {
    return dayjs(date).isBetween(first, second, "day");
  },
  daysInMonth(month: number, year: number): number {
    return dayjs().year(year).month(month).daysInMonth();
  },
  firstDayInMonth(month: number, year: number): number {
    return dayjs().year(year).month(month).date(1).day();
  },
  getDate(year: number, month: number, day: number): Date {
    return dayjs().year(year).month(month).date(day).toDate();
  },
  getYear(date: Date): number {
    return dayjs(date).year();
  },
  getMonth(date: Date): number {
    return dayjs(date).month();
  },
  getDayInMonth(date: Date): number {
    return dayjs(date).date();
  },
  startDayWeek: 0,
  weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
    "_"
  ),
  weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
  months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
    "_"
  ),
  currentYear: dayjs().year(),
  currentMonth: dayjs().month(),
  currentDay: dayjs().date(),
};
export const jalaliCalendar: Calendar = {
  isAfter(first: Date, second: Date): boolean {
    return dayjs(first).calendar("jalali").isAfter(second, "day");
  },
  isBetween(date: Date, first: Date, second: Date): boolean {
    return dayjs(date).calendar("jalali").isBetween(first, second, "day");
  },
  daysInMonth(month: number, year: number): number {
    return dayjs().calendar("jalali").year(year).month(month).daysInMonth();
  },
  firstDayInMonth(month: number, year: number): number {
    return dayjs().calendar("jalali").year(year).month(month).date(1).day();
  },
  getDate(year: number, month: number, day: number): Date {
    return dayjs()
      .calendar("jalali")
      .year(year)
      .month(month)
      .date(day)
      .toDate();
  },
  getYear(date: Date): number {
    return dayjs(date).calendar("jalali").year();
  },
  getMonth(date: Date): number {
    return dayjs(date).calendar("jalali").month();
  },
  getDayInMonth(date: Date): number {
    return dayjs(date).calendar("jalali").date();
  },
  startDayWeek: 6,
  weekdaysMin: "ش_ی_د_س_چ_پ_ج".split("_"),
  weekdays: "شنبه_یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه".split("_"),
  months: "فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند".split(
    "_"
  ),
  currentYear: dayjs().calendar("jalali").year(),
  currentMonth: dayjs().calendar("jalali").month(),
  currentDay: dayjs().calendar("jalali").date(),
};
