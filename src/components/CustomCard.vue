<template>
  <article
    ref="cardRoot"
    class="custom-card"
    :class="rootClassList"
    :style="rootStyle"
  >
    <template v-if="isLoaded">
      <div
        v-if="$slots.image"
        class="custom-card__media"
        :class="{ 'custom-card__media--object': hasMediaImageTuning }"
        :style="mediaWrapperStyle"
      >
        <slot name="image" />
      </div>
      <div
        class="custom-card__body"
        :style="bodyStyle"
      >
        <slot />
      </div>
    </template>
  </article>
</template>

<script>
const MEDIA_POSITIONS = ["top", "bottom", "left", "right"];
const ALIGN = ["start", "center", "end", "stretch"];
const HOVER_EFFECTS = ["none", "scale-down", "rotation", "scale-up"];

export default {
  name: "CustomCard",
  props: {
    mediaPosition: {
      type: String,
      default: "top",
      validator: (v) => MEDIA_POSITIONS.includes(v),
    },
    mediaAlign: {
      type: String,
      default: "center",
      validator: (v) => ALIGN.includes(v),
    },
    textAlign: {
      type: String,
      default: "start",
      validator: (v) => ["start", "center", "end"].includes(v),
    },
    hoverEffect: {
      type: String,
      default: "none",
      validator: (v) => HOVER_EFFECTS.includes(v),
    },
    hoverScale: {
      type: Number,
      default: 0.96,
    },
    hoverRotateDeg: {
      type: Number,
      default: -4,
    },
    hoverTransitionMs: {
      type: Number,
      default: 240,
    },
    mediaImageObjectPosition: {
      type: String,
      default: "",
    },
    mediaImageObjectFit: {
      type: String,
      default: "",
      validator: (v) =>
        !v ||
        ["contain", "cover", "fill", "none", "scale-down"].includes(v),
    },
    lazyLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoaded: !this.lazyLoad,
      observer: null,
    };
  },
  mounted() {
    if (this.lazyLoad) {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.isLoaded = true;
            if (this.observer) {
              this.observer.disconnect();
              this.observer = null;
            }
          }
        },
        { rootMargin: "200px" }
      );
      if (this.$refs.cardRoot) {
        this.observer.observe(this.$refs.cardRoot);
      }
    }
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },
  computed: {
    rootClassList() {
      return [
        `custom-card--media-${this.mediaPosition}`,
        this.hoverEffect !== "none" && `custom-card--hover-${this.hoverEffect}`,
        !this.isLoaded && "custom-card--lazy-loading",
      ].filter(Boolean);
    },
    rootStyle() {
      return {
        "--cc-hover-ms": `${this.hoverTransitionMs}ms`,
        "--cc-hover-scale": String(this.hoverScale),
        "--cc-hover-rotate": `${this.hoverRotateDeg}deg`,
      };
    },
    hasMediaImageTuning() {
      return Boolean(
        this.mediaImageObjectPosition || this.mediaImageObjectFit
      );
    },
    flexAlignValue() {
      const map = {
        start: "flex-start",
        center: "center",
        end: "flex-end",
        stretch: "stretch",
      };
      return map[this.mediaAlign] || "center";
    },
    mediaWrapperStyle() {
      const style = { alignSelf: this.flexAlignValue };
      if (this.mediaImageObjectPosition) {
        style["--cc-img-object-position"] = this.mediaImageObjectPosition;
      }
      if (this.mediaImageObjectFit) {
        style["--cc-img-object-fit"] = this.mediaImageObjectFit;
      }
      return style;
    },
    bodyStyle() {
      return { textAlign: this.textAlign };
    },
  },
};
</script>

<style scoped>
.custom-card {
  display: flex;
  gap: 1rem;
  box-sizing: border-box;
  transform-origin: center center;
  transition: transform var(--cc-hover-ms, 240ms) ease;
}

.custom-card--lazy-loading {
  min-height: 200px;
}

.custom-card--media-top {
  flex-direction: column;
}
.custom-card--media-bottom {
  flex-direction: column-reverse;
}
.custom-card--media-left {
  flex-direction: row;
  align-items: stretch;
}
.custom-card--media-right {
  flex-direction: row-reverse;
  align-items: stretch;
}

.custom-card__media {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  min-width: 0;
  min-height: 0;
}

.custom-card--media-top .custom-card__media,
.custom-card--media-bottom .custom-card__media {
  width: 100%;
}

.custom-card--media-left .custom-card__media,
.custom-card--media-right .custom-card__media {
  flex: 0 0 auto;
}

.custom-card__body {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.custom-card__media :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
}
.custom-card__media--object :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: var(--cc-img-object-fit, cover);
  object-position: var(--cc-img-object-position, 50% 50%);
}

.custom-card--hover-scale-down:hover {
  transform: scale(var(--cc-hover-scale, 0.96));
}

.custom-card--hover-rotation:hover {
  transform: rotate(var(--cc-hover-rotate, -4deg));
}

.custom-card--hover-scale-up:hover {
  transform: scale(var(--cc-hover-scale, 1.08));
}

@media (prefers-reduced-motion: reduce) {
  .custom-card {
    transition: none;
  }
  .custom-card--hover-scale-down:hover,
  .custom-card--hover-rotation:hover,
  .custom-card--hover-scale-up:hover {
    transform: none;
  }
}
</style>
