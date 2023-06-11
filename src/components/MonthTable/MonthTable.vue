<script lang="ts" setup>
import { computed } from "vue";
import { BaseDayInfo, Day, IsCheck, RangeValue, SelectDayInfo } from "@interfaces/Calendar";
import WeekHeader from "@components/WeekHeader";
import { IMonthTableProps } from "./MonthTable.interface";

const props = defineProps<IMonthTableProps>();
const emit = defineEmits(["day-click", "day-hover", "drag", "input"]);

const headerTitle = computed(() => `${props.calendar.months[props.month]} ${props.year}`);
const daysInMonth = computed(() => props.calendar.daysInMonth(props.month, props.year));

const days = computed<BaseDayInfo[]>(() =>
  new Array(daysInMonth.value).fill(0).map((d, i) => ({
    dayInMonth: i + 1,
    month: props.month,
    year: props.year,
    dayInWeek: props.calendar.getDayInWeek(props.calendar.getDate(props.year, props.month, i + 1)),
    today: props.calendar.isSame(new Date(), props.calendar.getDate(props.year, props.month, i + 1)),
  }))
);
const daysDisabled = computed<IsCheck>(() => days.value.map(d => isDisable(d.dayInMonth)));
const daysBetween = computed<IsCheck>(() => days.value.map(d => isDayBetween(d.dayInMonth)));
const daysSelected = computed<SelectDayInfo[]>(() => {
  return days.value.map(d => {
    const { start, end, isSelected } = isDaySelected(d.dayInMonth);
    return {
      isSelected,
      startRange: start,
      endRange: end,
    };
  });
});
const daysInMonthList = computed<Day[]>(() => {
  return days.value.map((d, i) => {
    return {
      ...d,
      isSelected: daysSelected.value[i].isSelected,
      startRange: daysSelected.value[i].startRange,
      endRange: daysSelected.value[i].endRange,
      isBetween: daysBetween.value[i],
      disabled: daysDisabled.value[i],
    };
  });
});
const emptyDays = computed<number>(
  () => (props.calendar.firstDayInMonth(props.month, props.year) - props.calendar.startDayWeek + 7) % 7
);
const hoveredDayDate = computed<Date | null>(() => {
  if (props.currentHoveredDay) {
    return props.calendar.getDate(
      props.currentHoveredDay.year,
      props.currentHoveredDay.month,
      props.currentHoveredDay.dayInMonth
    );
  } else {
    return null;
  }
});
const startMonthDate = computed<Date>(() => props.calendar.getDate(props.year, props.month, 1));

const isDisable = (day: number): boolean => {
  let beforeMin = false;
  let afterMax = false;
  if (props.min) {
    beforeMin = props.calendar.isAfter(
      props.min as unknown as Date,
      props.calendar.getDate(props.year, props.month, day)
    );
  }
  if (props.max) {
    afterMax = props.calendar.isAfter(
      props.calendar.getDate(props.year, props.month, day),
      props.max as unknown as Date
    );
  }
  return beforeMin || afterMax;
};
const isDayBetween = (day: number): boolean => {
  if (props.range) {
    if (props.selectedFirstRange && hoveredDayDate.value) {
      if (props.calendar.isAfter(hoveredDayDate.value, props.selectedFirstRange)) {
        return props.calendar.isBetween(
          props.calendar.getDate(props.year, props.month, day),
          props.selectedFirstRange,
          hoveredDayDate.value
        );
      } else {
        return false;
      }
    } else if ((props.value as RangeValue).start && (props.value as RangeValue).end) {
      return props.calendar.isBetween(
        props.calendar.getDate(props.year, props.month, day),
        (props.value as RangeValue).start as Date,
        (props.value as RangeValue).end as Date
      );
    } else {
      return false;
    }
  } else {
    return false;
  }
};
const isDaySelected = (
  day: number
): {
  isSelected: boolean;
  start: boolean;
  end: boolean;
} => {
  const currentDate = props.calendar.getDate(props.year, props.month, day);
  if (props.range) {
    const value = props.value as RangeValue;
    if (props.selectedFirstRange) {
      const isSelected = props.calendar.isSame(props.selectedFirstRange, currentDate);
      let isHovered = false;
      let isHoveredAfter = false;
      if (hoveredDayDate.value) {
        isHovered = props.calendar.isSame(hoveredDayDate.value, currentDate);
        isHoveredAfter = props.calendar.isAfter(hoveredDayDate.value, props.selectedFirstRange);
      }
      return {
        isSelected: isSelected,
        start: isHoveredAfter && isSelected,
        end: isHoveredAfter && isHovered,
      };
    }
    const start = value.start ? props.calendar.isSame(value.start, currentDate) : false;
    const end = value.end ? props.calendar.isSame(value.end, currentDate) : false;
    return {
      isSelected: start || end,
      start,
      end,
    };
  } else {
    return {
      isSelected: props.calendar.isSame(props.value as Date, currentDate),
      start: false,
      end: false,
    };
  }
};
const dayHover = (day: Day) => {
  if (day.disabled) return;
  emit("day-hover", day);
};
const dayClick = (day: Day) => {
  if (day.disabled) return;
  emit("day-click", {
    ...day,
    year: props.year,
    month: props.month,
  });
  if (props.onlyPickDay) return;
  if (props.range) {
    if (props.selectedFirstRange) {
      const secondSelected = props.calendar.getDate(props.year, props.month, day.dayInMonth);
      if (
        props.calendar.isAfter(secondSelected, props.selectedFirstRange) ||
        (!props.unequalRange && props.calendar.isSame(secondSelected, props.selectedFirstRange))
      ) {
        emit("input", {
          start: props.selectedFirstRange,
          end: secondSelected,
        });
      } else {
        emit("drag", secondSelected);
      }
    } else {
      emit("drag", props.calendar.getDate(props.year, props.month, day.dayInMonth));
    }
  } else {
    emit("input", props.calendar.getDate(props.year, props.month, day.dayInMonth));
  }
};
</script>

<template>
  <div class="month-table-container" :class="{ single: props.monthCount === 1 }">
    <slot name="month-title" :startMonthDate="startMonthDate">
      <div class="month-title">{{ headerTitle }}</div>
    </slot>
    <slot name="week-header">
      <WeekHeader :calendar="calendar" />
    </slot>
    <div class="month-days-container">
      <template v-for="emptyDay in emptyDays" :key="`empty-${emptyDay}`">
        <div class="main-day-wrapper empty"></div>
      </template>
      <template v-for="day in daysInMonthList" :key="day.dayInMonth">
        <div class="main-day-wrapper" @click="dayClick(day)" @mouseenter="dayHover(day)">
          <slot name="day-container" :day="day" :daysInMonth="daysInMonth">
            <div
              class="main-day-container"
              :class="{
                selected: day.isSelected,
                between: day.isBetween,
                disable: day.disabled,
              }"
            >
              <slot name="day" :day="day">
                {{ day.dayInMonth }}
              </slot>
            </div>
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" src="./MonthTable.scss" scoped></style>
