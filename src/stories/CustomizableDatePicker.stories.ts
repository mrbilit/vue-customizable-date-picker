import type { Meta, StoryObj } from "@storybook/vue3";

import CustomizableDatePicker from "@components/CustomizableDatePicker";
import { gregorianCalendar, jalaliCalendar } from "@services/Calendar";
import { ref } from "vue";

const meta: Meta<typeof CustomizableDatePicker> = {
  title: "CustomizableDatePicker",
  component: CustomizableDatePicker,
  argTypes: {
    currentCalendar: {
      options: [0, 1],
      control: { type: "select", labels: { 0: "Jalali Calendar", 1: "Gregorian Calendar" } },
    },
    range: { control: "boolean" },
    monthCount: { control: "select", options: [1, 2] },
    darkMode: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof CustomizableDatePicker>;

export const Primary: Story = {
  render: args => ({
    components: { CustomizableDatePicker },
    setup() {
      const value = ref({ start: null, end: null });
      return { args, value };
    },
    template: '<CustomizableDatePicker v-bind="$props" v-on="$props" v-model="value" />',
  }),
  args: {
    calendars: [jalaliCalendar, gregorianCalendar],
    currentCalendar: 0,
    range: true,
    monthCount: 2,
    darkMode: false,
  },
};
