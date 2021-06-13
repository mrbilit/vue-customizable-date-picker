<template>
  <div class="page-container">
    <div>{{ value }}</div>
    <customizable-date-picker
      v-model="value"
      :currentCalendar="currentCalendar"
      :month-count="2"
      range
      @day-click="onDayClick"
    >
      <!-- <template #day="{ day }">
        <div>{{ day.disabled }}</div>
      </template> -->
    </customizable-date-picker>
    <button
      @click="
        currentCalendar === 1 ? (currentCalendar = 0) : (currentCalendar = 1)
      "
    >
      switch
    </button>
    <date-picker />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// factory component
import factory from "./components/CustomizableDatePicker";
// customized picker
import DatePicker from "./components/DatePicker.vue";
// calendars
import { gregorianCalendar, jalaliCalendar } from "./calendars";

const CustomizableDatePicker = factory([jalaliCalendar, gregorianCalendar]);

export default Vue.extend({
  components: { CustomizableDatePicker, DatePicker },
  data: function () {
    return {
      value: {
        start: null,
        end: null,
      },
      currentCalendar: 0,
    };
  },
  methods: {
    onDayClick(day: any) {
      console.log(day);
    },
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
