import { Calendar } from "./components/CustomizableDatePicker/types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import jalaliday from "jalaliday";

dayjs.extend(isBetween);
dayjs.extend(jalaliday);

export const gregorianCalendar: Calendar = {
  isSame(first: Date, second: Date): boolean {
    return dayjs(first).isSame(second, "day");
  },
  isAfter(first: Date, second: Date): boolean {
    return dayjs(first).isAfter(second, "day");
  },
  isBetween(date: Date, first: Date, second: Date): boolean {
    return dayjs(date).isBetween(first, second, "day");
  },
  daysInMonth(month: number, year: number): number {
    return dayjs().year(year).date(1).month(month).daysInMonth();
  },
  firstDayInMonth(month: number, year: number): number {
    return dayjs().year(year).date(1).month(month).day();
  },
  getDate(year: number, month: number, day: number): Date {
    return dayjs().year(year).date(day).month(month).toDate();
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
  getDayInWeek(date: Date): number {
    return dayjs(date).day();
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
  isSame(first: Date, second: Date): boolean {
    return dayjs(first).isSame(second, "day");
  },
  isAfter(first: Date, second: Date): boolean {
    return dayjs(first).isAfter(second, "day");
  },
  isBetween(date: Date, first: Date, second: Date): boolean {
    return dayjs(date).isBetween(first, second, "day");
  },
  daysInMonth(month: number, year: number): number {
    return dayjs()
      .calendar("jalali")
      .year(year)
      .date(1)
      .month(month)
      .daysInMonth();
  },
  firstDayInMonth(month: number, year: number): number {
    return dayjs().calendar("jalali").year(year).date(1).month(month).day();
  },
  getDate(year: number, month: number, day: number): Date {
    return (dayjs as any)(`${year}-${month + 1}-${day}`, {
      jalali: true,
    }).toDate();
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
  getDayInWeek(date: Date): number {
    return (dayjs(date).calendar("jalali").day() + 1) % 7;
  },
  startDayWeek: 6,
  weekdaysMin: "??_??_??_??_??_??_??".split("_"),
  weekdays: "????????_???????????????_????????????_???????????????_????????????????_?????????????????_????????".split("_"),
  months: "??????????????_????????????????_??????????_??????_??????????_????????????_??????_????????_??????_????_????????_??????????".split(
    "_"
  ),
  currentYear: dayjs().calendar("jalali").year(),
  currentMonth: dayjs().calendar("jalali").month(),
  currentDay: dayjs().calendar("jalali").date(),
};
