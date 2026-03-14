<template>
  <div
    ref="elRef"
    class="scroll-fade-in"
    :class="{ 'scroll-fade-in--visible': isVisible }"
  >
    <slot />
  </div>
</template>

<script>
import { useScrollFadeIn } from "../composables/useScrollFadeIn";

export default {
  name: "ScrollFadeIn",
  props: {
    options: { type: Object, default: () => ({}) },
  },
  setup(props) {
    return useScrollFadeIn(props.options);
  },
};
</script>

<style scoped>
.scroll-fade-in {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.5s ease-out;
}
.scroll-fade-in--visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
