<script lang="ts" setup>
import CustomizableDatePicker from "@components/CustomizableDatePicker";
</script>

<template>
  <CustomizableDatePicker class="date-picker blue">
    <template #day-container="{ day, daysInMonth }">
      <div
        class="day-wrapper"
        :class="{
          selected: day.isSelected,
          between: day.isBetween,
          disable: day.disabled,
          'start-range': day.startRange,
          'end-range': day.endRange,
          'start-week': day.dayInWeek === 0,
          'end-week': day.dayInWeek === 6,
          'start-month': day.dayInMonth === 1,
          'end-month': day.dayInMonth === daysInMonth,
          today: day.today,
        }"
      >
        <div class="day-container">
          <span class="holiday" v-if="day.dayInWeek === 6"></span>
          <div class="day">
            {{ day.dayInMonth }}
          </div>
          <div class="price">
            {{ 100 }}
          </div>
        </div>
      </div>
    </template>
  </CustomizableDatePicker>
</template>

<style lang="scss" src="./DatePicker.scss" scoped></style>
