<template>
  <div>
    <div class="month-title">{{ headerTitle }}</div>
    <week-header :currentCalendar="currentCalendar" />
    <div class="month-days-container">
      <template v-for="emptyDay in emptyDays">
        <div :key="`empty-${emptyDay}`" class="day-container empty" />
      </template>
      <template v-for="day in daysInMonth">
        <div
          :key="day.dayInMonth"
          class="day-container"
          :class="{
            selected: day.isSelected,
            between: day.isBetween,
            disable: day.disabled,
          }"
          @click="dayClick(day)"
          @mouseenter="dayHover(day)"
        >
          <slot name="day" :day="day">
            {{ day.dayInMonth }}
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

// components
import WeekHeader from "./WeekHeader.vue";
// import MonthTable from "./MonthTable.vue";

// types
import { Calendar, Day, InputValue, RangeValue } from "./types";

export default Vue.extend({
  props: {
    value: {
      type: [Date, Object] as PropType<InputValue>,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    currentCalendar: {
      type: Number,
      default: 0,
    },
    range: {
      type: Boolean,
      default: false,
    },
    selectedFirstRange: {
      type: Date as PropType<Date>,
      default: null,
    },
    currentHoveredDay: {
      type: Object as PropType<Day | null>,
      default: null,
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
  inject: { inCalendars: "calendars" },
  computed: {
    calendar(): Calendar {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((this as any).inCalendars as Calendar[])[this.currentCalendar];
    },
    headerTitle(): string {
      return `${this.calendar.months[this.month]} ${this.year}`;
    },
    daysInMonth(): Day[] {
      const list: Day[] = [];
      for (
        let i = 1;
        i <= this.calendar.daysInMonth(this.month, this.year);
        i++
      ) {
        list.push({
          dayInMonth: i,
          year: this.year,
          month: this.month,
          isSelected: this.isDaySelected(i),
          isBetween: this.isDayBetween(i),
          disabled: this.isDisable(i),
        });
      }
      return list;
    },
    emptyDays(): number {
      return (
        (this.calendar.firstDayInMonth(this.month, this.year) -
          this.calendar.startDayWeek +
          7) %
        7
      );
    },
  },
  components: { WeekHeader },
  methods: {
    dayHover(day: Day) {
      if (day.disabled) return;
      this.$emit("day-hover", day);
    },
    dayClick(day: Day) {
      if (day.disabled) return;
      if (this.range) {
        if (this.selectedFirstRange) {
          const secondSelected = this.calendar.getDate(
            this.year,
            this.month,
            day.dayInMonth
          );
          if (this.calendar.isAfter(secondSelected, this.selectedFirstRange)) {
            this.$emit("input", {
              start: this.selectedFirstRange,
              end: secondSelected,
            });
          } else {
            this.$emit("input", {
              start: secondSelected,
              end: this.selectedFirstRange,
            });
          }
        } else {
          this.$emit(
            "drag",
            this.calendar.getDate(this.year, this.month, day.dayInMonth)
          );
        }
      } else {
        this.$emit(
          "input",
          this.calendar.getDate(this.year, this.month, day.dayInMonth)
        );
      }
      this.$emit("day-click", {
        ...day,
        year: this.year,
        month: this.month,
      });
    },
    isDisable(day: number): boolean {
      let beforeMin = false;
      let afterMax = false;
      if (this.min) {
        beforeMin = this.calendar.isAfter(
          (this.min as unknown) as Date,
          this.calendar.getDate(this.year, this.month, day)
        );
      }
      if (this.max) {
        afterMax = this.calendar.isAfter(
          this.calendar.getDate(this.year, this.month, day),
          (this.max as unknown) as Date
        );
      }
      return beforeMin || afterMax;
    },
    isDaySelected(day: number): boolean {
      if (this.range) {
        const value = this.value as RangeValue;
        if (this.selectedFirstRange) {
          return (
            this.calendar.getYear(this.selectedFirstRange) === this.year &&
            this.calendar.getMonth(this.selectedFirstRange) === this.month &&
            this.calendar.getDayInMonth(this.selectedFirstRange) === day
          );
        }
        return (
          (this.calendar.getYear(value.start) === this.year &&
            this.calendar.getMonth(value.start) === this.month &&
            this.calendar.getDayInMonth(value.start) === day) ||
          (this.calendar.getYear(value.end) === this.year &&
            this.calendar.getMonth(value.end) === this.month &&
            this.calendar.getDayInMonth(value.end) === day)
        );
      } else {
        return (
          this.calendar.getYear(this.value as Date) === this.year &&
          this.calendar.getMonth(this.value as Date) === this.month &&
          this.calendar.getDayInMonth(this.value as Date) === day
        );
      }
    },
    isDayBetween(day: number): boolean {
      if (this.range) {
        if (this.selectedFirstRange && this.currentHoveredDay) {
          return this.calendar.isBetween(
            this.calendar.getDate(this.year, this.month, day),
            this.selectedFirstRange,
            this.calendar.getDate(
              this.currentHoveredDay.year,
              this.currentHoveredDay.month,
              this.currentHoveredDay.dayInMonth
            )
          );
        } else if (
          (this.value as RangeValue).start &&
          (this.value as RangeValue).end
        ) {
          return this.calendar.isBetween(
            this.calendar.getDate(this.year, this.month, day),
            (this.value as RangeValue).start,
            (this.value as RangeValue).end
          );
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.month-title {
  width: 100%;
  // text
  text-align: center;
}

.month-days-container {
  display: flex;
  flex-wrap: wrap;
}

.day-container {
  flex-basis: 14.285714286%;
  flex-grow: 0;
  flex-shrink: 0;
  cursor: pointer;
  // text
  text-align: center;
  user-select: none;

  &:hover:not(.disable) {
    background: rgba($color: #8f8f8f, $alpha: 0.5);
  }

  &.selected {
    background: rgba($color: #8f8f8f, $alpha: 0.5);
  }

  &.between {
    background: rgba($color: #dbdbdb, $alpha: 0.5);
  }

  &.empty {
    visibility: hidden;
  }

  &.disable {
    color: gray;
    cursor: unset;
  }
}
</style>
