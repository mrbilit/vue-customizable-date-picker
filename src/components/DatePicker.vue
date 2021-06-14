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
            'start-week': day.dayInWeek === 0,
            'end-week': day.dayInWeek === 6,
            today: day.today,
          }"
        >
          <div class="day-container">
            <span class="holiday" v-if="day.dayInWeek === 6" />
            {{ day.dayInMonth }}
            <div class="price">
              {{ getPrice(day) }}
            </div>
          </div>
        </div>
      </template>
    </customizable-date-picker>
    <div class="actions">
      <button class="change-cal-button" @click="changeCalendar">
        {{ currentCalendar ? "تبدیل به شمسی" : "تبدیل به میلادی" }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { gregorianCalendar, jalaliCalendar } from "../calendars";
import dayjs from "dayjs";

import factory from "./CustomizableDatePicker";
import { Calendar, Day } from "./CustomizableDatePicker/types";

const calendars = [jalaliCalendar, gregorianCalendar];
const CustomizableDatePicker = factory(calendars);

export default Vue.extend({
  components: { CustomizableDatePicker },
  data: () => ({
    currentCalendar: 0,
    localValue: {
      start: null,
      end: null,
    },
  }),
  computed: {
    prices(): { date: Date; price: number }[] {
      return new Array(10).fill(0).map((v, i) => ({
        date: dayjs().set("day", i).toDate(),
        price: i * 99,
      }));
    },
    calendar(): Calendar {
      return calendars[this.currentCalendar];
    },
  },
  methods: {
    changeCalendar() {
      this.currentCalendar = this.currentCalendar ? 0 : 1;
    },
    getPrice(day: Day) {
      const date = this.calendar.getDate(day.year, day.month, day.dayInMonth);
      const price = this.prices.find((p) => this.calendar.isSame(p.date, date));
      return price ? price.price : "";
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

html[dir="rtl"] {
  .day-wrapper {
    &.start-range {
      &::before {
        left: -10px;
        right: unset;
      }
      &.end-week {
        &::before {
          width: 10px;
          left: 0px;
        }
      }
    }
    &.end-range {
      &::before {
        right: -10px;
        left: unset;
      }
      &.start-week {
        &::before {
          width: 10px;
          right: 0px;
        }
      }
    }
  }
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
      box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
      border: none;
      .price {
        color: white;
      }
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
    &.end-week {
      &::before {
        width: 10px;
        right: 0px;
      }
    }
  }
  &.end-range {
    position: relative;
    &::before {
      position: absolute;
      content: " ";
      height: 100%;
      width: 20px;
      left: -10px;
      background: #d0edfa;
    }
    &.start-week {
      &::before {
        width: 10px;
        left: 0px;
      }
    }
  }

  &.today {
    .day-container {
      border: 1px solid $primary;
    }
  }
  .day-container {
    position: relative;
    display: flex;
    flex-direction: column;
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
    .price {
      height: 10px;
      // text
      font-style: normal;
      font-weight: 300;
      font-size: 10px;
      color: #9095a7;
    }
    .holiday {
      position: absolute;
      left: 3px;
      top: 3px;
      width: 4px;
      height: 4px;
      background: #fd6727;
      border-radius: 100%;
    }
  }
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 16px;
}

.change-cal-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
</style>
