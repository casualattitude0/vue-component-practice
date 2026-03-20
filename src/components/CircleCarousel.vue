<template>
  <div
    class="circle-carousel"
    role="region"
    :aria-label="ariaLabel"
    aria-roledescription="carousel"
    :style="carouselCssVars"
  >
    <div
      ref="viewportRef"
      class="circle-carousel__viewport"
    >
      <button
        type="button"
        class="circle-carousel__arrow circle-carousel__arrow--prev"
        :aria-label="prevLabel"
        :disabled="!len || animating"
        @click="goPrev"
      >
        <span class="circle-carousel__chev" aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        class="circle-carousel__arrow circle-carousel__arrow--next"
        :aria-label="nextLabel"
        :disabled="!len || animating"
        @click="goNext"
      >
        <span class="circle-carousel__chev" aria-hidden="true">›</span>
      </button>

      <div
        ref="trackRef"
        class="circle-carousel__track"
        :class="{ 'circle-carousel__track--instant': instantMove }"
        :style="trackStyle"
        @transitionend="onTrackTransitionEnd"
      >
        <div
          v-for="(cell, i) in cells"
          :key="cell.key"
          class="circle-carousel__cell"
          :style="cellStyle"
        >
          <div
            class="circle-carousel__circle-slot"
            :style="circleSlotStyle(i)"
          >
            <div
              class="circle-carousel__circle"
              :class="{
                'circle-carousel__circle--focus': i === slideIndex,
                'circle-carousel__circle--side': i !== slideIndex,
                'circle-carousel__circle--focus-scrolling':
                  i === slideIndex && slideScrolling,
                'circle-carousel__circle--pop-settle':
                  i === slideIndex && focusPop && focusPopMode === 'settle',
                'circle-carousel__circle--pop-intro':
                  i === slideIndex && focusPop && focusPopMode === 'intro',
              }"
              :style="circleInnerStyle(i)"
            >
              <div
                v-if="cell.item.src"
                class="circle-carousel__media"
              >
                <img
                  class="circle-carousel__img"
                  :src="cell.item.src"
                  :alt="cell.item.alt || ''"
                  draggable="false"
                />
                <span
                  v-if="cell.item.label"
                  class="circle-carousel__label"
                >{{ cell.item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CircleCarousel",
  props: {
    items: {
      type: Array,
      required: true,
    },
    ariaLabel: {
      type: String,
      default: "Carousel",
    },
    prevLabel: {
      type: String,
      default: "Previous slide",
    },
    nextLabel: {
      type: String,
      default: "Next slide",
    },
    focusSize: {
      type: Number,
      default: 318,
    },
    sideSize: {
      type: Number,
      default: 192,
    },
    gap: {
      type: Number,
      default: 24,
    },
    arrowSize: {
      type: Number,
      default: 48,
    },
    durationMs: {
      type: Number,
      default: 480,
    },
    scrollFocusScale: {
      type: Number,
      default: 0.88,
    },
    settlePeakScale: {
      type: Number,
      default: 1.06,
    },
  },
  data() {
    return {
      slideIndex: 0,
      instantMove: false,
      animating: false,
      viewportWidth: 0,
      focusPop: false,
      focusPopMode: "intro",
      slideScrolling: false,
      resizeObserver: null,
      slideTimer: null,
      slideFinishConsumed: false,
    };
  },
  computed: {
    len() {
      return this.items.length;
    },
    cells() {
      if (!this.len) return [];
      const out = [];
      for (let copy = 0; copy < 3; copy += 1) {
        for (let j = 0; j < this.len; j += 1) {
          const idx = copy * this.len + j;
          out.push({
            key: `${copy}-${j}`,
            itemIndex: j,
            item: this.normalizeItem(this.items[j]),
            idx,
          });
        }
      }
      return out;
    },
    displayFocusSize() {
      const target = this.focusSize;
      const vw = this.viewportWidth;
      if (!vw || vw <= 0) return target;
      const pad = 16;
      const maxAllowed = Math.floor((vw - pad) / this.settlePeakScale);
      return Math.max(64, Math.min(target, maxAllowed));
    },
    displaySideSize() {
      const ratio = this.sideSize / this.focusSize;
      return Math.max(
        48,
        Math.round(this.displayFocusSize * ratio)
      );
    },
    cellWidth() {
      const focusSpan = this.displayFocusSize * this.settlePeakScale;
      return Math.max(focusSpan, this.displaySideSize) + this.gap;
    },
    cellStyle() {
      const w = this.cellWidth;
      return {
        flex: `0 0 ${w}px`,
        width: `${w}px`,
        minWidth: `${w}px`,
      };
    },
    trackTranslateX() {
      if (!this.viewportWidth || !this.cells.length) return 0;
      const center = this.viewportWidth / 2;
      const slideCenter = (this.slideIndex + 0.5) * this.cellWidth;
      return center - slideCenter;
    },
    trackStyle() {
      return {
        transform: `translate3d(${this.trackTranslateX}px, 0, 0)`,
        transitionProperty: "transform",
        transitionDuration: this.instantMove ? "0ms" : `${this.durationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      };
    },
    carouselCssVars() {
      return {
        "--cc-sfs": String(this.scrollFocusScale),
        "--cc-sps": String(this.settlePeakScale),
      };
    },
  },
  watch: {
    items: {
      immediate: true,
      handler(list) {
        if (!list || list.length === 0) return;
        const logical = Math.floor(list.length / 2);
        this.slideIndex = list.length + logical;
        this.instantMove = true;
        this.$nextTick(() => {
          this.instantMove = false;
          this.measureViewport();
          this.triggerFocusPop("intro");
        });
      },
    },
  },
  mounted() {
    this.measureViewport();
    this.resizeObserver = new ResizeObserver(() => {
      this.measureViewport();
    });
    if (this.$refs.viewportRef) {
      this.resizeObserver.observe(this.$refs.viewportRef);
    }
    this.$nextTick(() => {
      this.triggerFocusPop("intro");
    });
  },
  beforeUnmount() {
    this.clearSlideTimer();
    const vp = this.$refs.viewportRef;
    if (this.resizeObserver && vp) {
      this.resizeObserver.unobserve(vp);
      this.resizeObserver.disconnect();
    }
    this.resizeObserver = null;
  },
  methods: {
    measureViewport() {
      const el = this.$refs.viewportRef;
      this.viewportWidth = el ? el.offsetWidth : 0;
    },
    normalizeItem(raw) {
      if (raw == null) return { src: "", alt: "", label: "" };
      if (typeof raw === "string") return { src: raw, alt: "", label: "" };
      return {
        src: raw.src || raw.img || "",
        alt: raw.alt || raw.name || "",
        label: raw.label || raw.name || "",
      };
    },
    circleSlotStyle(i) {
      const focused = i === this.slideIndex;
      const s = focused
        ? this.displayFocusSize * this.settlePeakScale
        : this.displaySideSize;
      return {
        width: `${s}px`,
        height: `${s}px`,
        flexShrink: 0,
      };
    },
    circleInnerStyle(i) {
      const focused = i === this.slideIndex;
      const s = focused ? this.displayFocusSize : this.displaySideSize;
      return {
        width: `${s}px`,
        height: `${s}px`,
      };
    },
    clearSlideTimer() {
      if (this.slideTimer != null) {
        clearTimeout(this.slideTimer);
        this.slideTimer = null;
      }
    },
    scheduleSlideComplete() {
      this.clearSlideTimer();
      this.slideTimer = setTimeout(() => {
        this.slideTimer = null;
        this.finishSlideMove();
      }, this.durationMs + 80);
    },
    goPrev() {
      if (!this.len || this.animating) return;
      this.animating = true;
      this.focusPop = false;
      this.slideScrolling = true;
      this.slideFinishConsumed = false;
      this.slideIndex -= 1;
      this.scheduleSlideComplete();
    },
    goNext() {
      if (!this.len || this.animating) return;
      this.animating = true;
      this.focusPop = false;
      this.slideScrolling = true;
      this.slideFinishConsumed = false;
      this.slideIndex += 1;
      this.scheduleSlideComplete();
    },
    onTrackTransitionEnd(ev) {
      if (ev.target !== this.$refs.trackRef) return;
      if (ev.propertyName !== "transform") return;
      if (this.instantMove) return;
      this.clearSlideTimer();
      this.finishSlideMove();
    },
    finishSlideMove() {
      if (!this.animating || this.slideFinishConsumed) return;
      this.slideFinishConsumed = true;

      const n = this.len;
      if (n <= 0) {
        this.animating = false;
        this.slideScrolling = false;
        return;
      }

      let jumped = false;
      if (this.slideIndex >= 2 * n) {
        this.instantMove = true;
        this.slideIndex -= n;
        jumped = true;
      } else if (this.slideIndex < n) {
        this.instantMove = true;
        this.slideIndex += n;
        jumped = true;
      }

      if (jumped) {
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              this.instantMove = false;
              this.animating = false;
              this.slideScrolling = false;
              this.triggerFocusPop("settle");
            });
          });
        });
      } else {
        this.animating = false;
        this.slideScrolling = false;
        this.triggerFocusPop("settle");
      }
    },
    triggerFocusPop(mode) {
      if (mode) this.focusPopMode = mode;
      this.focusPop = false;
      this.$nextTick(() => {
        this.focusPop = true;
      });
    },
  },
};
</script>

<style scoped>
.circle-carousel {
  width: 100%;
  max-width: 100%;
  padding: 1rem 0;
  box-sizing: border-box;
}

.circle-carousel__viewport {
  position: relative;
  width: 100%;
  overflow: hidden;
  min-height: calc(
    v-bind(displayFocusSize) * v-bind(settlePeakScale) * 1px + 2rem
  );
}

.circle-carousel__track {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  will-change: transform;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}

.circle-carousel__track--instant {
  transition: none !important;
}

.circle-carousel__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: visible;
}

.circle-carousel__circle-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.circle-carousel__circle {
  border-radius: 50%;
  overflow: hidden;
  background: rgba(44, 62, 80, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  transition: box-shadow 0.35s ease, opacity 0.35s ease;
}

.circle-carousel__circle--side {
  opacity: 0.72;
}

.circle-carousel__circle--focus {
  opacity: 1;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.14);
}

.circle-carousel__circle--focus.circle-carousel__circle--focus-scrolling {
  transform: scale(var(--cc-sfs));
  transition: none;
}

.circle-carousel__circle--focus.circle-carousel__circle--pop-settle {
  animation: circle-carousel-focus-settle 0.55s cubic-bezier(0.34, 1.2, 0.64, 1)
    forwards;
}

.circle-carousel__circle--focus.circle-carousel__circle--pop-intro {
  animation: circle-carousel-focus-intro 0.5s ease-out forwards;
}

.circle-carousel__media {
  position: relative;
  width: 100%;
  height: 100%;
}

.circle-carousel__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  user-select: none;
}

.circle-carousel__label {
  position: absolute;
  top: auto;
  bottom: 10%;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 0.5em 0.65em 0.35em;
  text-align: center;
  font-size: clamp(1rem, 4.2vmin, 1.65rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: #000;
  background: none;
  text-shadow:
    0 0 6px rgba(255, 255, 255, 1),
    0 0 14px rgba(255, 255, 255, 0.9),
    0 1px 2px rgba(255, 255, 255, 0.95);
  pointer-events: none;
  user-select: none;
}

.circle-carousel__arrow {
  position: absolute;
  top: 50%;
  z-index: 2;
  width: calc(v-bind(arrowSize) * 1px);
  height: calc(v-bind(arrowSize) * 1px);
  margin-top: calc(v-bind(arrowSize) * -0.5px);
  border: none;
  border-radius: 50%;
  background: rgba(44, 62, 80, 0.08);
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
}

.circle-carousel__arrow:disabled {
  opacity: 0.45;
  cursor: default;
}

.circle-carousel__arrow:not(:disabled):hover {
  background: rgba(44, 62, 80, 0.14);
}

.circle-carousel__arrow:not(:disabled):active {
  transform: scale(0.96);
}

.circle-carousel__arrow--prev {
  left: calc(
    50% - (v-bind(displayFocusSize) * 0.5px) - (v-bind(arrowSize) * 1px) - 0.5rem
  );
}

.circle-carousel__arrow--next {
  right: calc(
    50% - (v-bind(displayFocusSize) * 0.5px) - (v-bind(arrowSize) * 1px) - 0.5rem
  );
}

.circle-carousel__chev {
  font-size: calc(v-bind(arrowSize) * 0.65px);
  line-height: 1;
  font-weight: 600;
  margin-top: -0.1em;
}

@keyframes circle-carousel-focus-settle {
  0% {
    transform: scale(var(--cc-sfs));
  }
  55% {
    transform: scale(var(--cc-sps));
  }
  100% {
    transform: scale(1);
  }
}

@keyframes circle-carousel-focus-intro {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(var(--cc-sps));
  }
  100% {
    transform: scale(1);
  }
}
</style>
