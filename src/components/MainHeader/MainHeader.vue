<script lang="ts" setup>
const emit = defineEmits(["next", "prev"]);
</script>

<template>
  <div dir="ltr" class="main-header-container">
    <button class="arrow-button next" @click="emit('next')">
      <slot name="header-next-button">
        <svg width="12" height="12" viewBox="0 0 8 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.41016 1.41L2.83016 6L7.41016 10.59L6.00016 12L0.00015614 6L6.00016 -6.16331e-08L7.41016 1.41Z" />
        </svg>
      </slot>
    </button>
    <button class="arrow-button prev" @click="emit('prev')">
      <slot name="header-prev-button">
        <svg width="12" height="12" viewBox="0 0 8 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.589844 10.59L5.16984 6L0.589843 1.41L1.99984 -6.16331e-08L7.99984 6L1.99984 12L0.589844 10.59Z" />
        </svg>
      </slot>
    </button>
  </div>
</template>

<style lang="scss" src="./MainHeader.scss" scoped></style>
