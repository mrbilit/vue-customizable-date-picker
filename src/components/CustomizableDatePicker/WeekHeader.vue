<template>
  <div class="week-days-container">
    <template v-for="(day, index) in weekDays">
      <slot name="week-day" :day="day">
        <div :key="`week-day-${index}`" class="week-day-container">
          {{ day }}
        </div>
      </slot>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

// types
import { Calendar } from "./types";

export default Vue.extend({
  props: {
    calendar: {
      type: Object as PropType<Calendar>,
      required: true,
    },
  },
  computed: {
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
