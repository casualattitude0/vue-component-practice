<template>
  <div
    ref="elRef"
    class="scroll-edge-fade"
    :class="[
      `scroll-edge-fade--${from}`,
      { 'scroll-edge-fade--visible': isVisible },
    ]"
  >
    <slot />
  </div>
</template>

<script>
import { useScrollFadeIn } from "../composables/useScrollFadeIn";

export default {
  name: "ScrollEdgeFadeIn",
  props: {
    from: {
      type: String,
      default: "left",
      validator: (v) => ["left", "right"].includes(v),
    },
    options: { type: Object, default: () => ({}) },
  },
  setup(props) {
    return useScrollFadeIn(props.options);
  },
};
</script>

<style scoped>
.scroll-edge-fade {
  width: 100%;
  min-width: 0;
  opacity: 0;
  transform: translateX(var(--scroll-edge-shift));
  transition:
    opacity 0.7s ease-out,
    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.scroll-edge-fade--left {
  --scroll-edge-shift: -2.75rem;
}

.scroll-edge-fade--right {
  --scroll-edge-shift: 2.75rem;
}

.scroll-edge-fade--visible {
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-edge-fade {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
