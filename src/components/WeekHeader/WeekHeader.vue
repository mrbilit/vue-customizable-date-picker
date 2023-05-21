<script lang="ts" setup>
import { computed } from "vue";
import { IWeekHeaderProps } from "./WeekHeader.interface";
const props = defineProps<IWeekHeaderProps>();

const weekDays = computed(() => props.calendar.weekdaysMin);
</script>

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

<style lang="scss" src="./WeekHeader.scss" scoped></style>
