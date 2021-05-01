<template>
  <div class="month-days-container">
    <template v-for="emptyDay in emptyDays">
      <div :key="`empty-${emptyDay}`" class="day-container empty" />
    </template>
    <template v-for="day in daysInMonth">
      <div :key="day" class="day-container">
        {{ day }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

// types
import { Calendar } from "./types";

export default Vue.extend({
  props: {
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
    daysInMonth(): number {
      return this.calendar.daysInMonth(this.month, this.year);
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
  // text
  text-align: center;

  &.empty {
    visibility: hidden;
  }
}
</style>
