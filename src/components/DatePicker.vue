<template>
  <div class="date-picker-wrapper">
    <customizable-date-picker
      v-model="localValue"
      class="my-date-picker"
      :currentCalendar="currentCalendar"
      :month-count="2"
      range
    >
      <template #day-container="{ day }">
        <div
          class="day-wrapper"
          :class="{
            selected: day.isSelected,
            between: day.isBetween,
            disable: day.disabled,
            'start-range': day.startRange,
            'end-range': day.endRange,
          }"
        >
          <div class="day-container">
            {{ day.dayInMonth }}
          </div>
        </div>
      </template>
    </customizable-date-picker>
    <div class="actions">
      <button class="change-cal-button" @click="changeCalendar">
        {{ currentCalendar ? "تبدیل به خورشیدی" : "تبدیل به میلادی" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { gregorianCalendar, jalaliCalendar } from "../calendars";

import factory from "./CustomizableDatePicker";

const CustomizableDatePicker = factory([jalaliCalendar, gregorianCalendar]);

export default Vue.extend({
  components: { CustomizableDatePicker },
  data: () => ({
    currentCalendar: 0,
    localValue: {
      start: null,
      end: null,
    },
  }),
  methods: {
    changeCalendar() {
      this.currentCalendar = this.currentCalendar ? 0 : 1;
    },
  },
});
</script>

<style lang="scss" scoped>
$gap: 3.5px;
$cell-size: 40px;
$primary: #188ef2;
.date-picker-wrapper {
  background: #ffffff;
  box-shadow: 0px 4px 8px rgba(67, 70, 79, 0.2);
  border-radius: 5px;
}

.day-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 $gap;
  margin: $gap 0;
  box-sizing: border-box;
  &.selected,
  &:hover {
    .day-container {
      background: $primary;
      color: white;
    }
  }
  &.between {
    background: #d0edfa;
  }
  &.start-range {
    position: relative;
    &::before {
      content: " ";
      position: absolute;
      height: 100%;
      width: 20px;
      right: -10px;
      background: #d0edfa;
    }
  }
  &.end-range {
    position: relative;
    &::before {
      content: " ";
      height: 100%;
      width: 20px;
      left: -10px;
      background: #d0edfa;
    }
  }
  .day-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.5px solid #dcdcdc;
    height: $cell-size;
    width: $cell-size;
    box-sizing: border-box;
    border-radius: 10px;
    z-index: 1;
    // text
    color: $primary;
    font-weight: 500;
    font-size: 20px;
  }
}

.date-picker-wrapper::v-deep {
  .arrow-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid #d0edfa;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .main-header-container {
    height: 60px;
    padding: 16px;
    box-sizing: border-box;
  }

  .week-day-container {
    flex-basis: $cell-size;
    margin: $gap $gap 10px $gap;
    // text
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 20px;
    color: #9095a7;
  }

  .month-title {
    padding: 16px 0;
    // text
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 28px;
    color: #9095a7;
  }

  .month-table-container {
    width: 330px;
    padding: 0 16px;
    &:not(:last-of-type) {
      margin-right: 10px;
    }
  }
}
.actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 16px;
}

.change-cal-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  font-weight: bold;
  font-size: 14px;
  height: 48px;
  width: 128px;
  text-align: center;
  cursor: pointer;
  border: 0;
  outline: none;
  color: $primary;
  border: 1px solid $primary;
  background: white;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    border: 0;
    opacity: 0.8;
  }
}
</style>
