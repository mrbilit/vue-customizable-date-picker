<template>
  <div class="week-days-container">
    <template v-for="(day, index) in weekDays">
      <div :key="`week-day-${index}`" class="week-day-container">
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
  },
  inject: { inCalendars: "calendars" },
  computed: {
    calendar(): Calendar {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((this as any).inCalendars as Calendar[])[this.currentCalendar];
    },
    weekDays(): string[] {
      return this.calendar.weekdaysMin;
    },
  },
});
</script>

<style lang="scss" scoped>
.week-days-container {
  display: flex;
  flex-wrap: nowrap;
}

.week-day-container {
  flex-basis: 14.285714286%;
  flex-grow: 0;
  flex-shrink: 0;
  // text
  text-align: center;
}
</style>
