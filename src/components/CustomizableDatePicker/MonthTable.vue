<template>
  <div class="month-table-container">
    <div class="month-title">{{ headerTitle }}</div>
    <slot name="week-header">
      <week-header :currentCalendar="currentCalendar" v-bind="$scopedSlots" />
    </slot>
    <div class="month-days-container">
      <template v-for="emptyDay in emptyDays">
        <div :key="`empty-${emptyDay}`" class="main-day-wrapper empty" />
      </template>
      <template v-for="day in daysInMonth">
        <div
          class="main-day-wrapper"
          :key="day.dayInMonth"
          @click="dayClick(day)"
          @mouseenter="dayHover(day)"
        >
          <slot name="day-container" :day="day">
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

<script lang="ts">
import Vue, { PropType } from "vue";

// components
import WeekHeader from "./WeekHeader.vue";

// types
import { Calendar, Day, InputValue, RangeValue } from "./types";

export default Vue.extend({
  name: "MonthTable",
  props: {
    value: {
      type: [Date, Object] as PropType<InputValue>,
      required: false,
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
    range: {
      type: Boolean,
      default: false,
    },
    selectedFirstRange: {
      type: Date as PropType<Date>,
      default: null,
    },
    currentHoveredDay: {
      type: Object as PropType<Day | null>,
      default: null,
    },
    min: {
      type: Date as PropType<Date>,
      required: false,
      default: null,
    },
    max: {
      type: Date as PropType<Date>,
      required: false,
      default: null,
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
    daysInMonth(): Day[] {
      const list: Day[] = [];
      for (
        let i = 1;
        i <= this.calendar.daysInMonth(this.month, this.year);
        i++
      ) {
        const { start, end, isSelected } = this.isDaySelected(i);
        list.push({
          dayInMonth: i,
          year: this.year,
          month: this.month,
          isSelected,
          startRange: start,
          endRange: end,
          isBetween: this.isDayBetween(i),
          disabled: this.isDisable(i),
          dayInWeek: this.calendar.getDayInWeek(
            this.calendar.getDate(this.year, this.month, i)
          ),
          today: this.calendar.isSame(
            new Date(),
            this.calendar.getDate(this.year, this.month, i)
          ),
        });
      }
      return list;
    },
    emptyDays(): number {
      return (
        (this.calendar.firstDayInMonth(this.month, this.year) -
          this.calendar.startDayWeek +
          7) %
        7
      );
    },
    hoveredDayDate(): Date | null {
      if (this.currentHoveredDay) {
        return this.calendar.getDate(
          this.currentHoveredDay.year,
          this.currentHoveredDay.month,
          this.currentHoveredDay.dayInMonth
        );
      } else {
        return null;
      }
    },
  },
  components: { WeekHeader },
  methods: {
    dayHover(day: Day) {
      if (day.disabled) return;
      this.$emit("day-hover", day);
    },
    dayClick(day: Day) {
      if (day.disabled) return;
      if (this.range) {
        if (this.selectedFirstRange) {
          const secondSelected = this.calendar.getDate(
            this.year,
            this.month,
            day.dayInMonth
          );
          if (this.calendar.isAfter(secondSelected, this.selectedFirstRange)) {
            this.$emit("input", {
              start: this.selectedFirstRange,
              end: secondSelected,
            });
          } else {
            this.$emit("input", {
              start: secondSelected,
              end: this.selectedFirstRange,
            });
          }
        } else {
          this.$emit(
            "drag",
            this.calendar.getDate(this.year, this.month, day.dayInMonth)
          );
        }
      } else {
        this.$emit(
          "input",
          this.calendar.getDate(this.year, this.month, day.dayInMonth)
        );
      }
      this.$emit("day-click", {
        ...day,
        year: this.year,
        month: this.month,
      });
    },
    isDisable(day: number): boolean {
      let beforeMin = false;
      let afterMax = false;
      if (this.min) {
        beforeMin = this.calendar.isAfter(
          (this.min as unknown) as Date,
          this.calendar.getDate(this.year, this.month, day)
        );
      }
      if (this.max) {
        afterMax = this.calendar.isAfter(
          this.calendar.getDate(this.year, this.month, day),
          (this.max as unknown) as Date
        );
      }
      return beforeMin || afterMax;
    },
    isDaySelected(
      day: number
    ): {
      isSelected: boolean;
      start: boolean;
      end: boolean;
    } {
      const currentDate = this.calendar.getDate(this.year, this.month, day);
      if (this.range) {
        const value = this.value as RangeValue;
        if (this.selectedFirstRange) {
          const isSelected = this.calendar.isSame(
            this.selectedFirstRange,
            currentDate
          );
          let start = false;
          let isSame = false;
          if (this.hoveredDayDate) {
            start = this.calendar.isAfter(
              this.hoveredDayDate,
              this.selectedFirstRange
            );
            isSame = this.calendar.isSame(this.hoveredDayDate, currentDate);
          }
          return {
            isSelected,
            start: !isSame && isSelected && start,
            end: !isSame && isSelected && !start,
          };
        }
        const start = value.start
          ? this.calendar.isSame(value.start, currentDate)
          : false;
        const end = value.end
          ? this.calendar.isSame(value.end, currentDate)
          : false;
        return {
          isSelected: start || end,
          start,
          end,
        };
      } else {
        return {
          isSelected: this.calendar.isSame(this.value as Date, currentDate),
          start: false,
          end: false,
        };
      }
    },
    isDayBetween(day: number): boolean {
      if (this.range) {
        if (this.selectedFirstRange && this.hoveredDayDate) {
          return this.calendar.isBetween(
            this.calendar.getDate(this.year, this.month, day),
            this.selectedFirstRange,
            this.hoveredDayDate
          );
        } else if (
          (this.value as RangeValue).start &&
          (this.value as RangeValue).end
        ) {
          return this.calendar.isBetween(
            this.calendar.getDate(this.year, this.month, day),
            (this.value as RangeValue).start as Date,
            (this.value as RangeValue).end as Date
          );
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.month-table-container {
  flex-shrink: 0;
}
.month-title {
  width: 100%;
  // text
  text-align: center;
}

.month-days-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.main-day-wrapper {
  flex-basis: 14.285714286%;
  flex-grow: 0;
  flex-shrink: 0;

  &.empty {
    visibility: hidden;
  }
}
.main-day-container {
  cursor: pointer;
  // text
  text-align: center;
  user-select: none;

  &:hover:not(.disable) {
    background: rgba($color: #8f8f8f, $alpha: 0.5);
  }

  &.selected {
    background: rgba($color: #8f8f8f, $alpha: 0.5);
  }

  &.between {
    background: rgba($color: #dbdbdb, $alpha: 0.5);
  }

  &.disable {
    color: gray;
    cursor: unset;
  }
}
</style>
