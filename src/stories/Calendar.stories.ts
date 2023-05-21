import type { Meta, StoryObj } from "@storybook/vue3";

import DatePicker from "@components/DatePicker";
import { gregorianCalendar, jalaliCalendar } from "@services/Calendar";
import { ref } from "vue";

const meta: Meta<typeof DatePicker> = {
  title: "DatePicker",
  component: DatePicker,
  argTypes: {
    currentCalendar: {
      options: [0, 1],
      control: { type: "select", labels: { 0: "Jalali Calendar", 1: "Gregorian Calendar" } },
    },
    range: { control: "boolean" },
    monthCount: { control: "select", options: [1, 2] },
    color: { control: "color" },
    darkMode: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Primary: Story = {
  render: args => ({
    components: { DatePicker },
    setup() {
      const value = ref({ start: null, end: null });
      return { args, value };
    },
    template: '<DatePicker v-bind="$props" v-on="$props" v-model="value" />',
  }),
  args: {
    calendars: [jalaliCalendar, gregorianCalendar],
    currentCalendar: 0,
    range: true,
    monthCount: 2,
    color: "#000000",
    darkMode: false,
  },
};
