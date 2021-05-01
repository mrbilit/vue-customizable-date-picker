/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { Component } from "vue";
import { VNode } from "vue/types/umd";

// styles
import "../../assets/styles.scss";

// components
import MainHeader from "./MainHeader.vue";
import DateTable from "./DateTable.vue";

// types
import { Calendar } from "./types";

export default function datePickerFactory(calendar: Calendar): Component {
  return Vue.extend({
    props: {
      monthCount: {
        type: Number,
        default: 1,
      },
    },
    data: function () {
      return {
        month: calendar.currentMonth,
        year: calendar.currentYear,
      };
    },
    provide: {
      calendar,
    },
    computed: {
      dataTables(): VNode[] {
        const tables: VNode[] = [];
        for (let i = 0; i < this.monthCount; i++) {
          const month = this.month + i < 12 ? this.month + i : 0;
          const year = this.month + i > 11 ? this.year + 1 : this.year;
          tables.push(
            this.$createElement(DateTable, {
              props: {
                year: year,
                month: month,
              },
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
    },
    render(createElement) {
      return createElement(
        "div",
        { class: "customizable-date-picker-container" },
        [
          createElement(MainHeader, {
            on: { next: (this as any).next, prev: (this as any).prev },
          }),
          ...(this as any).dataTables,
        ]
      );
    },
  });
}
