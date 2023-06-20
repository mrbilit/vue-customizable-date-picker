import type { App } from "vue";
import { CustomizableDatePicker } from "./components";
export type {
  BaseDayInfo,
  Calendar,
  Day,
  InputValue,
  IsCheck,
  Page,
  RangeValue,
  SelectDayInfo,
} from "./interfaces/Calendar";

export default {
  install: (app: App) => {
    app.component("VCustomizableDatePicker", CustomizableDatePicker);
  },
};

export { CustomizableDatePicker };
