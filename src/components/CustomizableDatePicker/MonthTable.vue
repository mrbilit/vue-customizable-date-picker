<template>
  <div class="month-days-container">
    <template v-for="emptyDay in emptyDays">
      <div :key="`empty-${emptyDay}`" class="day-container empty" />
    </template>
    <template v-for="day in daysInMonth">
      <div
        :key="day.dayInMonth"
        class="day-container"
        :class="{ selected: day.isSelected }"
        @click="dayClick(day)"
      >
        {{ day.dayInMonth }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

// types
import { Calendar } from "./types";

type Day = {
  dayInMonth: number;
  isSelected: boolean;
};

export default Vue.extend({
  props: {
    value: {
      type: Date as PropType<Date>,
      required: true,
    },
    currentCalendar: {
      type: Number,
      default: 0,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  inject: { inCalendars: "calendars" },
  computed: {
    calendar(): Calendar {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((this as any).inCalendars as Calendar[])[this.currentCalendar];
    },
    daysInMonth(): Day[] {
      const list: Day[] = [];
      for (
        let i = 1;
        i < this.calendar.daysInMonth(this.month, this.year);
        i++
      ) {
        list.push({
          dayInMonth: i,
          isSelected: this.isDaySelected(i),
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
  methods: {
    dayClick(day: Day) {
      this.$emit(
        "input",
        this.calendar.getDate(this.year, this.month, day.dayInMonth)
      );
      this.$emit("day-click", {
        ...day,
        year: this.year,
        month: this.month,
      });
    },
    isDaySelected(day: number): boolean {
      return (
        this.calendar.getYear(this.value) === this.year &&
        this.calendar.getMonth(this.value) === this.month &&
        this.calendar.getDayInMonth(this.value) === day
      );
    },
  },
});
</script>

<style lang="scss" scoped>
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

  &:hover {
    background: rgba($color: #8f8f8f, $alpha: 0.5);
  }

  &.selected {
    background: rgba($color: #8f8f8f, $alpha: 0.5);
  }

  &.empty {
    visibility: hidden;
  }
}
</style>
