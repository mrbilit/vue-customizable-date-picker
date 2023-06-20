<script setup lang="ts">
import { ref } from "vue";
import { InputValue } from "@/interfaces/Calendar";
import { gregorianCalendar, jalaliCalendar } from "@/services/Calendar";
import DatePicker from "@/components/DatePicker";

const value = ref<InputValue>({
  start: null,
  end: null,
});
const currentCalendar = ref(0);

const mmd = (day: any) => {
  console.log(day);
};
</script>

<template>
  <DatePicker
    :calendars="[jalaliCalendar, gregorianCalendar]"
    v-model="value"
    :currentCalendar="currentCalendar"
    :monthCount="2"
    range
    @day-click="mmd"
  />
</template>

<style scoped></style>
