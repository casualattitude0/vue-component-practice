<template>
  <component
    :is="tag"
    class="marquee"
    :class="{
      'marquee--pause-hover': pauseOnHover,
      'marquee--pause-focus': pauseOnFocus,
      'marquee--gradient': gradientEdges,
    }"
    :style="rootStyle"
    :aria-hidden="ariaLabel ? undefined : ariaHidden ? 'true' : undefined"
    :aria-label="ariaLabel || undefined"
    :role="ariaLabel ? 'region' : undefined"
  >
    <div class="marquee__viewport">
      <div
        class="marquee__track"
        :class="{ 'marquee__track--rtl': direction === 'right' }"
      >
        <div
          class="marquee__segment"
          aria-hidden="true"
        >
          <template v-if="hasDefaultSlot">
            <slot />
          </template>
          <template v-else>
            <span
              v-for="i in repeat"
              :key="`s1-${i}`"
              class="marquee__item"
            >{{ text }}{{ separator }}</span>
          </template>
        </div>
        <div
          class="marquee__segment"
          aria-hidden="true"
        >
          <template v-if="hasDefaultSlot">
            <slot />
          </template>
          <template v-else>
            <span
              v-for="i in repeat"
              :key="`s2-${i}`"
              class="marquee__item"
            >{{ text }}{{ separator }}</span>
          </template>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import { computed, useSlots } from "vue";

export default {
  name: "MarqueeText",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    text: {
      type: String,
      default: "",
    },
    separator: {
      type: String,
      default: " — ",
    },
    repeat: {
      type: Number,
      default: 6,
      validator: (v) => Number.isInteger(v) && v >= 1,
    },
    duration: {
      type: Number,
      default: 40,
      validator: (v) => v > 0,
    },
    direction: {
      type: String,
      default: "left",
      validator: (v) => ["left", "right"].includes(v),
    },
    gap: {
      type: String,
      default: "3rem",
    },
    pauseOnHover: {
      type: Boolean,
      default: false,
    },
    pauseOnFocus: {
      type: Boolean,
      default: false,
    },
    gradientEdges: {
      type: Boolean,
      default: false,
    },
    fadeWidth: {
      type: String,
      default: "4rem",
    },
    fontSize: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    fontFamily: {
      type: String,
      default: "",
    },
    fontWeight: {
      type: String,
      default: "",
    },
    lineHeight: {
      type: String,
      default: "",
    },
    letterSpacing: {
      type: String,
      default: "",
    },
    ariaLabel: {
      type: String,
      default: "",
    },
    ariaHidden: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const slots = useSlots();
    const hasDefaultSlot = computed(() => !!slots.default);

    const rootStyle = computed(() => {
      const style = {
        "--marquee-duration": `${props.duration}s`,
        "--marquee-gap": props.gap,
        "--marquee-fade": props.fadeWidth,
      };
      if (props.fontSize) style.fontSize = props.fontSize;
      if (props.color) style.color = props.color;
      if (props.fontFamily) style.fontFamily = props.fontFamily;
      if (props.fontWeight) style.fontWeight = props.fontWeight;
      if (props.lineHeight) style.lineHeight = props.lineHeight;
      if (props.letterSpacing) style.letterSpacing = props.letterSpacing;
      return style;
    });

    return { hasDefaultSlot, rootStyle };
  },
};
</script>

<style scoped>
.marquee {
  width: 100%;
  min-width: 0;
}

.marquee__viewport {
  overflow: hidden;
  width: 100%;
}

.marquee--gradient .marquee__viewport {
  mask-image: linear-gradient(
    to right,
    transparent,
    black var(--marquee-fade),
    black calc(100% - var(--marquee-fade)),
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black var(--marquee-fade),
    black calc(100% - var(--marquee-fade)),
    transparent
  );
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
  will-change: transform;
}

.marquee__track--rtl {
  animation-direction: reverse;
}

.marquee__segment {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--marquee-gap, 3rem);
  white-space: nowrap;
}

.marquee__item {
  display: inline-block;
  white-space: nowrap;
}

.marquee--pause-hover:hover .marquee__track,
.marquee--pause-focus:focus-within .marquee__track {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none;
    transform: translateX(0);
  }

  .marquee__viewport {
    overflow: visible;
  }

  .marquee--gradient .marquee__viewport {
    mask-image: none;
    -webkit-mask-image: none;
  }
}
</style>
