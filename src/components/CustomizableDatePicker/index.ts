/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { Component, PropType } from "vue";
import { VNode } from "vue/types/umd";

// styles
import "../../assets/styles.scss";

// components
import MainHeader from "./MainHeader.vue";
import MonthTable from "./MonthTable.vue";

// types
import { Calendar, Day, InputValue } from "./types";

export default function datePickerFactory(calendars: Calendar[]): Component {
  return Vue.extend({
    props: {
      value: {
        type: [Date, Object] as PropType<InputValue>,
        required: true,
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
      readOnly: {
        type: Boolean,
        default: false,
      },
      min: {
        type: Date,
        required: false,
        default: null,
      },
      max: {
        type: Date,
        required: false,
        default: null,
      },
    },
    data: function () {
      return {
        month: calendars[this.currentCalendar].currentMonth,
        year: calendars[this.currentCalendar].currentYear,
        selectedFirstRange: null as Date | null,
        currentHoveredDay: null as Day | null,
      };
    },
    watch: {
      currentCalendar() {
        this.month = calendars[this.currentCalendar].currentMonth;
        this.year = calendars[this.currentCalendar].currentYear;
      },
    },
    provide: { calendars },
    computed: {
      dataTables(): VNode[] {
        const tables: VNode[] = [];
        for (let i = 0; i < this.monthCount; i++) {
          const month = this.month + i < 12 ? this.month + i : 0;
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
              },
              on: this.readOnly
                ? {}
                : {
                    "day-click": this.$listeners["day-click"] || (() => null),
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
    },
    methods: {
      next() {
        if (this.month + 1 <= 11) {
          this.month++;
        } else {
          this.month = 0;
          this.year++;
        }
      },
      prev() {
        if (this.month - 1 >= 0) {
          this.month--;
        } else {
          this.month = 11;
          this.year--;
        }
      },
      onDrag(value: Date) {
        this.$emit("input", {
          start: null,
          end: null,
        });
        this.selectedFirstRange = value;
      },
      onInput(value: InputValue) {
        this.selectedFirstRange = null;
        this.$emit("input", value);
      },
      onDayHover(day: Day) {
        this.currentHoveredDay = day;
        this.$emit("day-hover", day);
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
          ...(this as any).dataTables,
        ]
      );
    },
  });
}
