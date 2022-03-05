<template>
  <div dir="ltr" class="main-header-container">
    <div class="arrow-button next" @click="$emit('next')">
      <slot name="header-next-button">
        <svg
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.41016 1.41L2.83016 6L7.41016 10.59L6.00016 12L0.00015614 6L6.00016 -6.16331e-08L7.41016 1.41Z"
            fill="#188EF2"
          />
        </svg>
      </slot>
    </div>
    <div class="arrow-button prev" @click="$emit('prev')">
      <slot name="header-prev-button">
        <svg
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.589844 10.59L5.16984 6L0.589843 1.41L1.99984 -6.16331e-08L7.99984 6L1.99984 12L0.589844 10.59Z"
            fill="#188EF2"
          />
        </svg>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "DatePickerMainHeader",
});
</script>

<style lang="scss" scoped>
.main-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.arrow-button {
  cursor: pointer;
}
</style>
