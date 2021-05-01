<template>
  <div>
    <div class="month-title">{{ headerTitle }}</div>
    <week-header />
    <month-table :month="month" :year="year" />
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
  data: () => ({
    calendar: {} as Calendar,
  }),
  inject: { inCalendar: "calendar" },
  created() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.calendar = (this as any).inCalendar;
  },
  computed: {
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
