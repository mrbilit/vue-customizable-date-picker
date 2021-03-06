<template>
  <div class="month-table-container">
    <slot name="month-title" :startMonthDate="startMonthDate">
      <div class="month-title">{{ headerTitle }}</div>
    </slot>
    <slot name="week-header">
      <week-header :calendar="calendar" v-bind="$scopedSlots" />
    </slot>
    <div class="month-days-container">
      <template v-for="emptyDay in emptyDays">
        <div :key="`empty-${emptyDay}`" class="main-day-wrapper empty" />
      </template>
      <template v-for="day in daysInMonthList">
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
type IsCheck = { [key: number]: boolean };
type BaseDayInfo = Pick<
  Day,
  "dayInMonth" | "month" | "year" | "dayInWeek" | "today"
>;
type SelectDayInfo = Pick<Day, "isSelected" | "startRange" | "endRange">;

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
    calendar: {
      type: Object as PropType<Calendar>,
      required: true,
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
    onlyPickDay: {
      type: Boolean,
      default: false,
    },
    unequalRange: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    headerTitle(): string {
      return `${this.calendar.months[this.month]} ${this.year}`;
    },
    daysInMonth(): number {
      return this.calendar.daysInMonth(this.month, this.year);
    },
    days(): BaseDayInfo[] {
      return new Array(this.daysInMonth).fill(0).map((d, i) => ({
        dayInMonth: i + 1,
        month: this.month,
        year: this.year,
        dayInWeek: this.calendar.getDayInWeek(
          this.calendar.getDate(this.year, this.month, i + 1)
        ),
        today: this.calendar.isSame(
          new Date(),
          this.calendar.getDate(this.year, this.month, i + 1)
        ),
      }));
    },
    daysDisabled(): IsCheck {
      return this.days.map((d) => this.isDisable(d.dayInMonth));
    },
    daysBetween(): IsCheck {
      return this.days.map((d) => this.isDayBetween(d.dayInMonth));
    },
    daysSelected(): SelectDayInfo[] {
      return this.days.map((d) => {
        const { start, end, isSelected } = this.isDaySelected(d.dayInMonth);
        return {
          isSelected,
          startRange: start,
          endRange: end,
        };
      });
    },
    daysInMonthList(): Day[] {
      return this.days.map((d, i) => {
        return {
          ...d,
          isSelected: this.daysSelected[i].isSelected,
          startRange: this.daysSelected[i].startRange,
          endRange: this.daysSelected[i].endRange,
          isBetween: this.daysBetween[i],
          disabled: this.daysDisabled[i],
        };
      });
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
    startMonthDate(): Date {
      return this.calendar.getDate(this.year, this.month, 1);
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
      this.$emit("day-click", {
        ...day,
        year: this.year,
        month: this.month,
      });
      if (this.onlyPickDay) return;
      if (this.range) {
        if (this.selectedFirstRange) {
          const secondSelected = this.calendar.getDate(
            this.year,
            this.month,
            day.dayInMonth
          );
          if (
            this.calendar.isAfter(secondSelected, this.selectedFirstRange) ||
            (!this.unequalRange &&
              this.calendar.isSame(secondSelected, this.selectedFirstRange))
          ) {
            this.$emit("input", {
              start: this.selectedFirstRange,
              end: secondSelected,
            });
          } else {
            this.$emit("drag", secondSelected);
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
          let isHovered = false;
          let isHoveredAfter = false;
          if (this.hoveredDayDate) {
            isHovered = this.calendar.isSame(this.hoveredDayDate, currentDate);
            isHoveredAfter = this.calendar.isAfter(
              this.hoveredDayDate,
              this.selectedFirstRange
            );
          }
          return {
            isSelected: isSelected,
            start: isHoveredAfter && isSelected,
            end: isHoveredAfter && isHovered,
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
          if (
            this.calendar.isAfter(this.hoveredDayDate, this.selectedFirstRange)
          ) {
            return this.calendar.isBetween(
              this.calendar.getDate(this.year, this.month, day),
              this.selectedFirstRange,
              this.hoveredDayDate
            );
          } else {
            return false;
          }
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
