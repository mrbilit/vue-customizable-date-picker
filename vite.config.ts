import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/build.ts"),
      name: "VueCustomizableDatePicker",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `v-customizable-date-picker.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that should not be bundled
      // into your library
      external: ["vue"],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "build.css")
            return "v-customizable-date-picker.css";
          return assetInfo.name;
        },
        globals: {
          vue: "Vue",
        },
        dir: "dist",
      },
    },
  },
});
