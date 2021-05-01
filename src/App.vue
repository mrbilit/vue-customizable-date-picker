<template>
  <div class="page-container">
    <customizable-date-picker
      :currentCalendar="currentCalendar"
      :month-count="1"
    />
    <button
      @click="
        currentCalendar === 1 ? (currentCalendar = 0) : (currentCalendar = 1)
      "
    >
      switch
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

import factory from "./components/CustomizableDatePicker";
import { Calendar } from "./components/CustomizableDatePicker/types";
const gregorianCalendar: Calendar = {
  daysInMonth(month: number, year: number): number {
    return dayjs().year(year).month(month).daysInMonth();
  },
  firstDayInMonth(month: number, year: number): number {
    return dayjs().year(year).month(month).date(1).day();
  },
  startDayWeek: 0,
  weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
    "_"
  ),
  weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
  months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
    "_"
  ),
  currentYear: dayjs().year(),
  currentMonth: dayjs().month(),
  currentDay: dayjs().date(),
};
const jalaliCalendar: Calendar = {
  daysInMonth(month: number, year: number): number {
    return dayjs().calendar("jalali").year(year).month(month).daysInMonth();
  },
  firstDayInMonth(month: number, year: number): number {
    return dayjs().calendar("jalali").year(year).month(month).date(1).day();
  },
  startDayWeek: 6,
  weekdaysMin: "ش_ی_د_س_چ_پ_ج".split("_"),
  weekdays: "شنبه_یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه".split("_"),
  months: "فروردین_اردیبهشت_خرداد_تیر_مرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند".split(
    "_"
  ),
  currentYear: dayjs().calendar("jalali").year(),
  currentMonth: dayjs().calendar("jalali").month(),
  currentDay: dayjs().calendar("jalali").date(),
};
const CustomizableDatePicker = factory([jalaliCalendar, gregorianCalendar]);

export default Vue.extend({
  components: { CustomizableDatePicker },
  data: function () {
    return {
      currentCalendar: 0,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
