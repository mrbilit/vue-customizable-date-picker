<template>
  <div>
    <div class="month-title">{{ headerTitle }}</div>
    <week-header :currentCalendar="currentCalendar" />
    <month-table
      :value="value"
      :month="month"
      :year="year"
      :currentCalendar="currentCalendar"
      @day-click="(day) => $emit('day-click', day)"
      @input="(value) => $emit('input', value)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

// components
import WeekHeader from "./WeekHeader.vue";
import MonthTable from "./MonthTable.vue";

// types
import { Calendar } from "./types";

export default Vue.extend({
  props: {
    value: {
      type: Date as PropType<Date>,
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
