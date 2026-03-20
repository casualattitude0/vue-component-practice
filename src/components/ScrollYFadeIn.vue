<template>
  <div
    ref="elRef"
    class="scroll-y-fade"
    :class="[
      from === 'bottom' ? 'scroll-y-fade--from-bottom' : 'scroll-y-fade--from-top',
      { 'scroll-y-fade--visible': isVisible },
    ]"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>

<script>
import { computed } from "vue";
import { useScrollFadeIn } from "../composables/useScrollFadeIn";

export default {
  name: "ScrollYFadeIn",
  props: {
    from: {
      type: String,
      default: "top",
      validator: (v) => ["top", "bottom"].includes(v),
    },
    distance: { type: String, default: "1.05rem" },
    delayMs: { type: Number, default: 0 },
    options: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const { elRef, isVisible } = useScrollFadeIn(props.options);
    const rootStyle = computed(() => ({
      "--scroll-y-distance": props.distance,
      "--scroll-y-delay": `${props.delayMs}ms`,
    }));
    return { elRef, isVisible, rootStyle };
  },
};
</script>

<style scoped>
.scroll-y-fade {
  width: 100%;
  min-width: 0;
  opacity: 0;
  transform: translateY(var(--scroll-y-initial));
  transition:
    opacity 0.58s ease-out var(--scroll-y-delay, 0ms),
    transform 0.62s cubic-bezier(0.22, 1, 0.36, 1) var(--scroll-y-delay, 0ms);
}

.scroll-y-fade--from-top {
  --scroll-y-initial: calc(-1 * var(--scroll-y-distance, 1.05rem));
}

.scroll-y-fade--from-bottom {
  --scroll-y-initial: var(--scroll-y-distance, 1.05rem);
}

.scroll-y-fade--visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-y-fade {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
