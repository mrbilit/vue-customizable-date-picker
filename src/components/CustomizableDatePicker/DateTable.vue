<template>
  <div>
    <div class="month-title">{{ headerTitle }}</div>
    <week-header :currentCalendar="currentCalendar" />
    <month-table
      :month="month"
      :year="year"
      :currentCalendar="currentCalendar"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

// components
import WeekHeader from "./WeekHeader.vue";
import MonthTable from "./MonthTable.vue";

// types
import { Calendar } from "./types";

export default Vue.extend({
  inject: { inCalendars: "calendars" },
  computed: {
    calendar(): Calendar {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((this as any).inCalendars as Calendar[])[this.currentCalendar];
    },
    headerTitle(): string {
      return `${this.calendar.months[this.month]} ${this.year}`;
    },
  },
  props: {
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
  },
  components: { WeekHeader, MonthTable },
});
</script>

<style lang="scss" scoped>
.month-title {
  width: 100%;
  // text
  text-align: center;
}
</style>
