/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { Component, PropType } from "vue";
import { VNode } from "vue/types/umd";

// styles
import "../../assets/styles.scss";

// components
import MainHeader from "./MainHeader.vue";
import MonthTable from "./MonthTable.vue";

// types
import { Calendar, Day, InputValue, RangeValue } from "./types";

export default function datePickerFactory(calendars: Calendar[]): Component {
  return Vue.extend({
    name: "CustomizableFactory",
    props: {
      value: {
        type: [Date, Object] as PropType<InputValue>,
        required: false,
      },
      monthCount: {
        type: Number,
        default: 1,
      },
      currentCalendar: {
        type: Number,
        default: 0,
      },
      range: {
        type: Boolean,
        default: false,
      },
      onlyPick: {
        type: String as PropType<"start" | "end">,
        default: null,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
      min: {
        type: Date as PropType<Date>,
        required: false,
        default: null,
      },
      max: {
        type: Date as PropType<Date>,
        required: false,
        default: null,
      },
      startMonthFromNow: {
        type: Boolean,
        default: false,
      },
      trackStart: {
        type: Boolean,
        default: false,
      },
      unequalRange: {
        type: Boolean,
        default: false,
      },
    },
    data: function () {
      const calendar: Calendar = calendars[this.currentCalendar];
      let month = calendar.currentMonth;
      let year = calendar.currentYear;
      const value = this.range ? (this.value as RangeValue)?.start : this.value;
      if (value && !this.startMonthFromNow) {
        month = calendar.getMonth(value as Date);
        year = calendar.getYear(value as Date);
      } else if (this.min) {
        month = calendar.getMonth(this.min);
        year = calendar.getYear(this.min);
      }
      return {
        month,
        year,
        selectedFirstRange: null as Date | null,
        currentHoveredDay: null as Day | null,
      };
    },
    watch: {
      currentCalendar() {
        this.month = calendars[this.currentCalendar].currentMonth;
        this.year = calendars[this.currentCalendar].currentYear;
      },
      "value.start"(val) {
        if (this.range && this.trackStart && !(this.value as RangeValue).end) {
          this.selectedFirstRange = val;
        }
      },
    },
    computed: {
      dataTables(): VNode[] {
        const tables: VNode[] = [];
        for (let i = 0; i < this.monthCount; i++) {
          const month =
            this.month + i < 12 ? this.month + i : (this.month + i) % 12;
          const year = this.month + i > 11 ? this.year + 1 : this.year;
          tables.push(
            this.$createElement(MonthTable, {
              props: {
                year: year,
                month: month,
                currentCalendar: this.currentCalendar,
                value: this.value,
                range: this.range,
                selectedFirstRange: this.selectedFirstRange,
                currentHoveredDay: this.currentHoveredDay,
                min: this.min,
                max: this.max,
                calendar: this.calendar,
                onlyPickDay: this.range && !!this.onlyPick,
                unequalRange: this.unequalRange,
              },
              key: `${year}-${i}`,
              on: this.readOnly
                ? {}
                : {
                    "day-click": this.onDayClick,
                    input: this.onInput,
                    drag: this.onDrag,
                    "day-hover": this.onDayHover,
                  },
              scopedSlots: this.$scopedSlots,
            })
          );
        }
        return tables;
      },
      calendar(): Calendar {
        return calendars[this.currentCalendar];
      },
    },
    methods: {
      next() {
        if (this.month + 1 <= 11) {
          this.month++;
        } else {
          this.month = 0;
          this.year++;
        }
        this.$emit("page-change", {
          year: this.year,
          month: this.month,
        });
      },
      prev() {
        if (this.month - 1 >= 0) {
          this.month--;
        } else {
          this.month = 11;
          this.year--;
        }
        this.$emit("page-change", {
          year: this.year,
          month: this.month,
        });
      },
      onDrag(value: Date) {
        this.$emit("input", {
          start: this.trackStart ? value : null,
          end: null,
        });
        this.$emit("drag");
        this.selectedFirstRange = value;
      },
      onInput(val: InputValue) {
        this.selectedFirstRange = null;
        this.$emit("input", val);
      },
      onDayHover(day: Day) {
        this.currentHoveredDay = day;
        this.$emit(
          "day-hover",
          this.calendar.getDate(day.year, day.month, day.dayInMonth)
        );
      },
      onDayClick(day: Day) {
        this.$emit("day-click", day);
        this.handleOnlyPick(day);
      },
      handleOnlyPick(day: Day) {
        if (!this.onlyPick || !this.range) return;
        const value = (this.value || {}) as RangeValue;
        const newDate = this.calendar.getDate(
          day.year,
          day.month,
          day.dayInMonth
        );
        if (this.onlyPick === "start") {
          if (value.end && this.calendar.isAfter(newDate, value.end)) {
            value.end = newDate;
          }
          value.start = newDate;
        } else if (this.onlyPick === "end") {
          if (value.start && this.calendar.isAfter(value.start, newDate)) {
            value.start = newDate;
          }
          value.end = newDate;
        }
        this.$emit("input", value);
      },
    },
    render(createElement) {
      return createElement(
        "div",
        { class: "customizable-date-picker-container" },
        [
          createElement(MainHeader, {
            on: { next: (this as any).next, prev: (this as any).prev },
            scopedSlots: this.$scopedSlots,
          }),
          createElement(
            "div",
            {
              class: "month-list",
            },
            (this as any).dataTables
          ),
        ]
      );
    },
  });
}
