<template>
  <main class="page wall-calendar-page">
    <PageSiteNav />
    <div class="wall-calendar-page__content">
      <div
        ref="bindingEl"
        class="wall-calendar-page__binding"
        :style="bindingBackgroundStyle"
        aria-hidden="true"
      />
      <div
        class="wall-calendar-page__paper"
        :style="paperStyle"
      >
        <div
          ref="stackEl"
          class="wall-calendar-page__stack"
        >
          <div
            class="wall-calendar-page__next"
            :class="{ 'wall-calendar-page__next--visible': nextOpacity > 0.02 }"
            :style="nextLayerStyle"
          >
            <template v-if="nextPage">
              <header class="wall-calendar-page__header wall-calendar-page__header--next">
                <h2 class="wall-calendar-page__title wall-calendar-page__title--next">
                  {{ nextPage.title }}
                </h2>
                <p class="wall-calendar-page__lead">{{ nextPage.lead }}</p>
              </header>
              <div class="wall-calendar-page__grid">
                <CustomCard
                  class="wall-calendar-page__card"
                  hover-effect="scale-down"
                  :hover-scale="0.96"
                  :hover-transition-ms="280"
                  :media-position="nextPageMediaPosition"
                  media-image-object-fit="cover"
                >
                  <template #image>
                    <img
                      :src="nextPage.img"
                      alt=""
                    />
                  </template>
                  <h2 class="wall-calendar-page__card-title">{{ nextPage.cardTitle }}</h2>
                  <p class="wall-calendar-page__card-text">{{ nextPage.cardHint }}</p>
                </CustomCard>
              </div>
            </template>
          </div>

          <div
            class="wall-calendar-page__layer-current"
            :style="currentLayerStyle"
          >
            <div
              class="wall-calendar-page__perspective"
              :style="perspectiveContainerStyle"
            >
              <div
                ref="flipLayer"
                class="wall-calendar-page__flip"
                :style="flipLayerStyle"
              >
                <div class="wall-calendar-page__curl-fill">
                  <WallCalendarCurlChain
                    :segment-count="curlSegmentCount"
                    :page-angle-deg="curlPageAngleDeg"
                  >
                    <div
                      class="wall-calendar-page__current-block"
                      :class="{
                        'wall-calendar-page__current-block--prev-crossfade':
                          isPrevFlipContext && prevFlipSurfacePage,
                      }"
                      :style="currentBlockStyle"
                    >
                      <template v-if="isPrevFlipContext && prevFlipSurfacePage">
                        <div class="wall-calendar-page__prev-surfaces">
                          <div
                            class="wall-calendar-page__current-surface wall-calendar-page__current-surface--prev-incoming"
                            :style="{
                              ...surfaceBendStyle,
                              opacity: prevIncomingOpacity,
                            }"
                          >
                            <header class="wall-calendar-page__header">
                              <h1 class="wall-calendar-page__title">
                                {{ prevFlipSurfacePage.title }}
                              </h1>
                              <p class="wall-calendar-page__lead">{{ prevFlipSurfacePage.lead }}</p>
                            </header>
                            <div class="wall-calendar-page__grid">
                              <CustomCard
                                class="wall-calendar-page__card"
                                hover-effect="scale-down"
                                :hover-scale="0.96"
                                :hover-transition-ms="280"
                                :media-position="prevFlipMediaPosition"
                                media-image-object-fit="cover"
                              >
                                <template #image>
                                  <img
                                    :src="prevFlipSurfacePage.img"
                                    alt=""
                                  />
                                </template>
                                <h2 class="wall-calendar-page__card-title">
                                  {{ prevFlipSurfacePage.cardTitle }}
                                </h2>
                                <p class="wall-calendar-page__card-text">
                                  {{ prevFlipSurfacePage.cardHint }}
                                </p>
                              </CustomCard>
                            </div>
                          </div>
                          <div
                            class="wall-calendar-page__current-surface wall-calendar-page__current-surface--prev-outgoing"
                            :style="{
                              ...surfaceBendStyle,
                              opacity: previousPageOpacity,
                            }"
                          >
                            <header class="wall-calendar-page__header">
                              <h1 class="wall-calendar-page__title">{{ currentPage.title }}</h1>
                              <p class="wall-calendar-page__lead">{{ currentPage.lead }}</p>
                            </header>
                            <div class="wall-calendar-page__grid">
                              <CustomCard
                                class="wall-calendar-page__card"
                                hover-effect="scale-down"
                                :hover-scale="0.96"
                                :hover-transition-ms="280"
                                :media-position="currentPageMediaPosition"
                                media-image-object-fit="cover"
                              >
                                <template #image>
                                  <img
                                    :src="currentPage.img"
                                    alt=""
                                  />
                                </template>
                                <h2 class="wall-calendar-page__card-title">{{ currentPage.cardTitle }}</h2>
                                <p class="wall-calendar-page__card-text">{{ currentPage.cardHint }}</p>
                              </CustomCard>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          class="wall-calendar-page__current-surface"
                          :style="surfaceBendStyle"
                        >
                          <header class="wall-calendar-page__header">
                            <h1 class="wall-calendar-page__title">{{ currentPage.title }}</h1>
                            <p class="wall-calendar-page__lead">{{ currentPage.lead }}</p>
                          </header>
                          <div class="wall-calendar-page__grid">
                            <CustomCard
                              class="wall-calendar-page__card"
                              hover-effect="scale-down"
                              :hover-scale="0.96"
                              :hover-transition-ms="280"
                              :media-position="currentPageMediaPosition"
                              media-image-object-fit="cover"
                            >
                              <template #image>
                                <img
                                  :src="currentPage.img"
                                  alt=""
                                />
                              </template>
                              <h2 class="wall-calendar-page__card-title">{{ currentPage.cardTitle }}</h2>
                              <p class="wall-calendar-page__card-text">{{ currentPage.cardHint }}</p>
                            </CustomCard>
                          </div>
                        </div>
                      </template>
                    </div>
                  </WallCalendarCurlChain>
                </div>
                <div
                  class="wall-calendar-page__flip-shade"
                  aria-hidden="true"
                  :style="flipShadeStyle"
                />
                <div
                  class="wall-calendar-page__fold-shadow"
                  aria-hidden="true"
                  :style="dynamicFoldShadowStyle"
                />
                <button
                  v-show="showForwardFold && !disableInteraction"
                  type="button"
                  class="wall-calendar-page__fold-handle"
                  :class="{ 'wall-calendar-page__fold-handle--dragging': isDraggingForward }"
                  :style="foldHandleDiagonalStyle"
                  :aria-label="$t('wallCalendarPage.foldAria')"
                  @pointerdown="onFoldPointerDown($event, 'forward')"
                  @pointermove="onFoldPointerMove"
                  @pointerup="onFoldPointerUp"
                  @pointercancel="onFoldPointerUp"
                  @lostpointercapture="onFoldPointerUp"
                >
                  <span
                    class="wall-calendar-page__fold-corner wall-calendar-page__fold-corner--br"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>

          <button
            v-show="showPrevFlipButton && !disableInteraction"
            type="button"
            class="wall-calendar-page__prev-flip-btn"
            :class="{
              'wall-calendar-page__prev-flip-btn--dragging': isDraggingPrevFlip,
              'wall-calendar-page__prev-flip-btn--on-diagonal': dragHandle === 'prevflip',
            }"
            :style="prevFlipButtonStyle"
            :aria-label="$t('wallCalendarPage.foldBackAria')"
            @pointerdown="onFoldPointerDown($event, 'prevflip')"
            @pointermove="onFoldPointerMove"
            @pointerup="onFoldPointerUp"
            @pointercancel="onFoldPointerUp"
            @lostpointercapture="onFoldPointerUp"
            tabindex="0"
            @keydown.enter.prevent="triggerBackFlip"
            @keydown.space.prevent="triggerBackFlip"
          >
            <span
              class="wall-calendar-page__prev-flip-corner"
              aria-hidden="true"
            />
            <span class="wall-calendar-page__prev-flip-face">
              <svg
                class="wall-calendar-page__prev-flip-chevron"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                />
              </svg>
              <span class="wall-calendar-page__prev-flip-label">{{
                $t("wallCalendarPage.prevFlipLabel")
              }}</span>
            </span>
          </button>

          <button
            v-show="showBackFold && !disableInteraction"
            type="button"
            class="wall-calendar-page__fold-handle wall-calendar-page__fold-handle--back-stack"
            :class="{ 'wall-calendar-page__fold-handle--dragging': isDraggingBack }"
            :style="foldHandleDiagonalStyle"
            :aria-label="$t('wallCalendarPage.foldBackAria')"
            @pointerdown="onFoldPointerDown($event, 'back')"
            @pointermove="onFoldPointerMove"
            @pointerup="onFoldPointerUp"
            @pointercancel="onFoldPointerUp"
            @lostpointercapture="onFoldPointerUp"
          >
            <span
              class="wall-calendar-page__fold-corner wall-calendar-page__fold-corner--tl"
              aria-hidden="true"
            />
          </button>

          <div v-if="!disableInteraction" class="wall-calendar-page__indicators-wrap">
            <p class="wall-calendar-page__page-counter">
              {{ currentPageIndex + 1 }}/{{ pages.length }}
            </p>
            <div class="wall-calendar-page__indicators">
              <button
                v-for="(p, i) in pages"
                :key="i"
                type="button"
                class="wall-calendar-page__indicator-dot"
                :class="{ 'wall-calendar-page__indicator-dot--active': i === currentPageIndex }"
                :disabled="isSnapping"
                @click="goToPage(i)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import bookHeaderUrl from "@/assets/test/bookheader.png";
import CustomCard from "@/components/CustomCard.vue";
import WallCalendarCurlChain from "@/components/WallCalendarCurlChain.vue";
import PageSiteNav from "@/components/PageSiteNav.vue";

const PAGES = [
  {
    title: "January",
    lead: "New year, new beginnings. Set your intentions.",
    cardTitle: "Resolution",
    cardHint: "Write down your goals for the year ahead.",
    img: "https://picsum.photos/seed/jan/720/420",
    bg: "#f2e3cf",
  },
  {
    title: "February",
    lead: "Love is in the air. Cherish the warmth around you.",
    cardTitle: "Connection",
    cardHint: "Reach out to someone you've been meaning to.",
    img: "https://picsum.photos/seed/feb/720/420",
    bg: "#f2e3cf",
  },
  {
    title: "March",
    lead: "Spring is arriving. Watch for the first signs of green.",
    cardTitle: "Growth",
    cardHint: "Plant something — a seed, a habit, an idea.",
    img: "https://picsum.photos/seed/mar/720/420",
    bg: "#f2e3cf",
  },
  {
    title: "April",
    lead: "Flowers bloom after every rain. Keep going.",
    cardTitle: "Renewal",
    cardHint: "Clear out the old to make space for the new.",
    img: "https://picsum.photos/seed/apr/720/420",
    bg: "#f2e3cf",
  },
  {
    title: "May",
    lead: "Long days and open windows. Energy is everywhere.",
    cardTitle: "Momentum",
    cardHint: "Build on the progress you've already made.",
    img: "https://picsum.photos/seed/may/720/420",
    bg: "#f2e3cf",
  },
  {
    title: "June",
    lead: "Midsummer light. Slow down and be present.",
    cardTitle: "Stillness",
    cardHint: "Find a quiet spot and just breathe today.",
    img: "https://picsum.photos/seed/jun/720/420",
    bg: "#f2e3cf",
  },
];

export default {
  name: "WallCalendarPage",
  components: { CustomCard, WallCalendarCurlChain, PageSiteNav },
  props: {
    disableInteraction: {
      type: Boolean,
      default: false,
    },
    externalProgress: {
      type: Number,
      default: null,
    },
    flipPauseRatio: {
      type: Number,
      default: 0.3,
    },
  },
  data() {
    return {
      pages: PAGES,
      currentPageIndex: 0,
      flipRange: 0,
      bindingHeight: 0,
      dragOffset: 0,
      dragHandle: null,
      isDragging: false,
      dragStartPointerY: 0,
      dragStartOffset: 0,
      resizeObserver: null,
      flipRangeTimer: null,
      snapRaf: null,
      isFlippingBack: false,
      curlSegmentCount: 14,
      flipWidth: 0,
      flipHeight: 0,
      foldHandlePx: 84,
      dragStartPointerX: 0,
      prevFlipMoved: false,
    };
  },
  computed: {
    currentPage() {
      return this.pages[this.currentPageIndex] || this.pages[0];
    },
    nextPage() {
      const showPrev = this.isFlippingBack || this.dragHandle === "prevflip";
      if (showPrev) {
        return this.pages[this.currentPageIndex - 1] || null;
      }
      return this.pages[this.currentPageIndex + 1] || null;
    },
    hasNextPage() {
      return this.currentPageIndex < this.pages.length - 1;
    },
    hasPrevPage() {
      return this.currentPageIndex > 0;
    },
    /** 單數頁 (1-based): 圖右文左 → media right；偶數頁: 圖左文右 → media left */
    currentPageMediaPosition() {
      return this.currentPageIndex % 2 === 0 ? "right" : "left";
    },
    nextPageMediaPosition() {
      const showPrev = this.isFlippingBack || this.dragHandle === "prevflip";
      const idx = showPrev
        ? this.currentPageIndex - 1
        : this.currentPageIndex + 1;
      if (idx < 0 || idx >= this.pages.length) return "right";
      return idx % 2 === 0 ? "right" : "left";
    },
    isPrevFlipContext() {
      return this.isFlippingBack || this.dragHandle === "prevflip";
    },
    curlPageAngleDeg() {
      return this.isPrevFlipContext ? 0 : this.pageAngleDeg;
    },
    prevFlipSurfacePage() {
      if (!this.isPrevFlipContext || !this.hasPrevPage) return null;
      return this.pages[this.currentPageIndex - 1] || null;
    },
    prevFlipMediaPosition() {
      const idx = this.currentPageIndex - 1;
      if (idx < 0) return "right";
      return idx % 2 === 0 ? "right" : "left";
    },
    prevIncomingOpacity() {
      return 1 - this.previousPageOpacity;
    },
    currentBlockStyle() {
      if (this.isPrevFlipContext && this.prevFlipSurfacePage) {
        return { opacity: 1 };
      }
      return { opacity: this.previousPageOpacity };
    },
    isSnapping() {
      return this.snapRaf != null;
    },
    bindingBackgroundStyle() {
      return { backgroundImage: `url(${bookHeaderUrl})` };
    },
    paperStyle() {
      return { backgroundColor: this.currentPage.bg };
    },
    maxDrag() {
      return Math.max(1, this.flipRange + this.bindingHeight);
    },
    pageAngleDeg() {
      return Math.min(179, this.foldProgress * 179);
    },
    foldProgress() {
      return Math.min(
        1,
        Math.max(0, this.dragOffset / Math.max(1e-6, this.maxDrag))
      );
    },
    nextOpacity() {
      const a = this.pageAngleDeg;
      if (a < 60) return 0;
      if (a >= 120) return 1;
      return (a - 60) / 60;
    },
    previousPageOpacity() {
      const a = this.pageAngleDeg;
      if (a < 60) return 1;
      if (a >= 120) return 0;
      return 1 - (a - 60) / 60;
    },
    showBackFold() {
      return (
        this.pageAngleDeg >= 88 &&
        !this.isFlippingBack &&
        this.dragHandle !== "prevflip"
      );
    },
    showForwardFold() {
      return (
        this.pageAngleDeg < 88 &&
        this.hasNextPage &&
        !this.isFlippingBack &&
        this.dragHandle !== "prevflip"
      );
    },
    showPrevFlipButton() {
      return (
        this.hasPrevPage &&
        !this.isSnapping &&
        ((!this.isFlippingBack && this.dragOffset < 1) ||
          this.dragHandle === "prevflip")
      );
    },
    isDraggingForward() {
      return this.isDragging && this.dragHandle === "forward";
    },
    isDraggingBack() {
      return this.isDragging && this.dragHandle === "back";
    },
    isDraggingPrevFlip() {
      return this.isDragging && this.dragHandle === "prevflip";
    },
    prevFlipButtonStyle() {
      if (this.dragHandle === "prevflip") {
        const hw = this.foldHandlePx;
        const w = Math.max(0, this.flipWidth);
        const h = Math.max(0, this.flipHeight);
        const t = this.foldProgress;
        const left = t * Math.max(0, w - hw);
        const bottom = (1 - t) * Math.max(0, h - hw);
        return {
          left: `${left}px`,
          bottom: `${bottom}px`,
          right: "auto",
          top: "auto",
        };
      }
      return { top: "0", left: "0", right: "auto", bottom: "auto" };
    },
    nextLayerStyle() {
      if (this.isPrevFlipContext) {
        return { opacity: 0, zIndex: 0, pointerEvents: "none" };
      }
      const over90 = this.pageAngleDeg >= 90;
      return { opacity: this.nextOpacity, zIndex: over90 ? 2 : 0 };
    },
    currentLayerStyle() {
      return { zIndex: this.pageAngleDeg >= 90 ? 0 : 1 };
    },
    perspectiveContainerStyle() {
      if (this.isPrevFlipContext) {
        return { perspective: "2000px", perspectiveOrigin: "50% 50%" };
      }
      const t = this.foldProgress;
      const ox = (50 + (1 - t) * 50).toFixed(1);
      const oy = ((1 - t) * 100).toFixed(1);
      return { perspective: "2000px", perspectiveOrigin: `${ox}% ${oy}%` };
    },
    flipLayerStyle() {
      const t = this.foldProgress;
      const y = 10 + t * 36;
      const blur = 22 + t * 52;
      const alpha = (0.09 + t * 0.16).toFixed(3);
      if (this.isPrevFlipContext) {
        return {
          backgroundColor: this.currentPage.bg,
          boxShadow: `0 12px 32px rgba(44,62,80,0.1), 0 ${y}px ${blur}px rgba(0,0,0,${alpha})`,
          transform: "none",
          transformOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          willChange: "transform",
        };
      }
      const tilt = Math.sin(t * Math.PI) * 11;
      const tiltSign = -1;
      const ox = ((1 - t) * 100).toFixed(1);
      const oy = ((1 - t) * 100).toFixed(1);
      return {
        backgroundColor: this.currentPage.bg,
        boxShadow: `0 12px 32px rgba(44,62,80,0.1), 0 ${y}px ${blur}px rgba(0,0,0,${alpha})`,
        transform: `rotateZ(${(tiltSign * tilt).toFixed(2)}deg)`,
        transformOrigin: `${ox}% ${oy}%`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      };
    },
    foldHandleDiagonalStyle() {
      const hw = this.foldHandlePx;
      const w = Math.max(0, this.flipWidth);
      const h = Math.max(0, this.flipHeight);
      const t = this.foldProgress;
      const left = (1 - t) * Math.max(0, w - hw);
      const bottom = t * Math.max(0, h - hw);
      return {
        left: `${left}px`,
        bottom: `${bottom}px`,
        right: "auto",
        top: "auto",
      };
    },
    flipShadeStyle() {
      const p = this.foldProgress;
      return { opacity: String(0.08 + p * 0.42) };
    },
    dynamicFoldShadowStyle() {
      if (this.isPrevFlipContext || this.foldProgress === 0) {
        return { opacity: 0 };
      }
      const hw = this.foldHandlePx;
      const w = Math.max(0, this.flipWidth);
      const h = Math.max(0, this.flipHeight);
      const t = this.foldProgress;
      
      const left = (1 - t) * Math.max(0, w - hw);
      const bottom = t * Math.max(0, h - hw);
      
      // Calculate intersections of the fold line with the page edges
      // The fold line has a slope of -1 passing through (left, h - bottom)
      const intersectX = left - bottom;
      const intersectY = h - w + left - bottom;
      
      return {
        opacity: 0.15 + t * 0.25,
        clipPath: `polygon(${intersectX}px ${h}px, ${w}px ${intersectY}px, ${w}px ${h}px, ${intersectX}px ${h}px)`
      };
    },
    surfaceBendStyle() {
      if (this.isPrevFlipContext) {
        return {
          transform: "translateZ(0)",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
        };
      }
      const t = this.foldProgress;
      const a = this.pageAngleDeg;
      const bow = -a * 0.2;
      const sy = (1 - Math.min(0.08, t * 0.08)).toFixed(4);
      const skew = (Math.sin(t * Math.PI) * 3).toFixed(2);
      return {
        transform: `perspective(900px) translateZ(0) rotateX(${bow.toFixed(
          2
        )}deg) skewY(${skew}deg) scaleY(${sy})`,
        transformOrigin: "top center",
        transformStyle: "preserve-3d",
      };
    },
  },
  watch: {
    maxDrag() {
      if (this.externalProgress !== null) {
        this.updateFromExternalProgress(this.externalProgress);
      }
    },
    externalProgress(val) {
      this.updateFromExternalProgress(val);
    },
  },
  mounted() {
    this.$nextTick(() => this.observeFlip());
  },
  beforeUnmount() {
    if (this.snapRaf != null) {
      cancelAnimationFrame(this.snapRaf);
      this.snapRaf = null;
    }
    if (this.flipRangeTimer != null) {
      clearTimeout(this.flipRangeTimer);
      this.flipRangeTimer = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  },
  methods: {
    updateFromExternalProgress(val) {
      if (val === null) return;
      const totalTransitions = this.pages.length - 1;
      if (totalTransitions <= 0) return;

      let totalProgress = val * totalTransitions;
      totalProgress = Math.max(0, Math.min(totalTransitions, totalProgress));

      let pageIndex = Math.floor(totalProgress);
      let progressWithinPage = totalProgress - pageIndex;

      // Apply pause ratio: keep progress at 0 for the first `flipPauseRatio` fraction
      if (this.flipPauseRatio > 0 && this.flipPauseRatio < 1) {
        if (progressWithinPage < this.flipPauseRatio) {
          progressWithinPage = 0;
        } else {
          progressWithinPage =
            (progressWithinPage - this.flipPauseRatio) /
            (1 - this.flipPauseRatio);
        }
      }

      if (pageIndex >= totalTransitions) {
        pageIndex = totalTransitions;
        progressWithinPage = 0;
      }

      this.currentPageIndex = pageIndex;
      this.dragOffset = progressWithinPage * this.maxDrag;
      this.dragHandle = "forward";
    },
    observeFlip() {
      const stack = this.$refs.stackEl;
      const binding = this.$refs.bindingEl;
      if (typeof ResizeObserver === "undefined") {
        this.scheduleFlipRangeUpdate();
        return;
      }
      this.resizeObserver = new ResizeObserver(() =>
        this.scheduleFlipRangeUpdate()
      );
      if (stack) this.resizeObserver.observe(stack);
      if (binding) this.resizeObserver.observe(binding);
      this.scheduleFlipRangeUpdate();
    },
    scheduleFlipRangeUpdate() {
      if (this.flipRangeTimer != null) clearTimeout(this.flipRangeTimer);
      this.flipRangeTimer = setTimeout(() => {
        this.flipRangeTimer = null;
        this.applyFlipRange();
      }, 0);
    },
    applyFlipRange() {
      const stack = this.$refs.stackEl;
      const binding = this.$refs.bindingEl;
      const flip = this.$refs.flipLayer;
      if (stack) {
        const h = stack.offsetHeight;
        if (Math.abs(h - this.flipRange) > 0.5) this.flipRange = h;
      }
      if (binding) {
        const bh = binding.offsetHeight;
        if (Math.abs(bh - this.bindingHeight) > 0.5) this.bindingHeight = bh;
      }
      if (flip) {
        const fw = flip.offsetWidth;
        const fh = flip.offsetHeight;
        if (fw > 0) this.flipWidth = fw;
        if (fh > 0) this.flipHeight = fh;
      }
      if (this.dragOffset > this.maxDrag) this.dragOffset = this.maxDrag;
    },
    onFoldPointerDown(e, mode) {
      if (e.button !== 0) return;
      if (this.isSnapping) return;
      e.preventDefault();
      if (mode === "prevflip") {
        if (!this.hasPrevPage) return;
        this.dragHandle = "prevflip";
        this.isDragging = true;
        this.prevFlipMoved = false;
        this.dragStartPointerX = e.clientX;
        this.dragStartPointerY = e.clientY;
        this.dragStartOffset = 0;
        this.dragOffset = 0;
        if (e.currentTarget.setPointerCapture) {
          e.currentTarget.setPointerCapture(e.pointerId);
        }
        return;
      }
      this.dragHandle = mode;
      this.isDragging = true;
      this.dragStartPointerX = e.clientX;
      this.dragStartPointerY = e.clientY;
      this.dragStartOffset = this.dragOffset;
      if (e.currentTarget.setPointerCapture) {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    },
    onFoldPointerMove(e) {
      if (!this.isDragging || !this.dragHandle) return;
      if (this.dragHandle === "forward") {
        const dy = this.dragStartPointerY - e.clientY;
        this.dragOffset = Math.max(
          0,
          Math.min(this.maxDrag, this.dragStartOffset + dy)
        );
      } else if (this.dragHandle === "prevflip") {
        const dx = e.clientX - this.dragStartPointerX;
        const dy = e.clientY - this.dragStartPointerY;
        if (Math.hypot(dx, dy) > 4) this.prevFlipMoved = true;
        const aw = Math.max(0, this.flipWidth - this.foldHandlePx);
        const ah = Math.max(0, this.flipHeight - this.foldHandlePx);
        const denom = aw * aw + ah * ah;
        if (denom < 1e-6) return;
        let proj = (dx * aw + dy * ah) / denom;
        proj = Math.max(0, Math.min(1, proj));
        this.dragOffset = Math.max(
          0,
          Math.min(this.maxDrag, this.dragStartOffset + proj * this.maxDrag)
        );
      } else {
        const dy = e.clientY - this.dragStartPointerY;
        this.dragOffset = Math.max(
          0,
          Math.min(this.maxDrag, this.dragStartOffset - dy)
        );
      }
    },
    onFoldPointerUp(e) {
      if (!this.isDragging) return;
      const direction = this.dragHandle;
      this.isDragging = false;
      const el = e.currentTarget;
      if (el && el.releasePointerCapture) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch (_) {
          /* ignore */
        }
      }
      const half = this.maxDrag * 0.5;
      if (direction === "forward") {
        if (this.dragOffset >= half) {
          this.snapTo(this.maxDrag, () => {
            if (this.currentPageIndex < this.pages.length - 1) {
              this.currentPageIndex++;
            }
            this.dragOffset = 0;
            this.dragHandle = null;
          });
        } else {
          this.snapTo(0, () => {
            this.dragHandle = null;
          });
        }
      } else if (direction === "prevflip") {
        if (!this.prevFlipMoved && this.dragOffset < half) {
          this.snapTo(this.maxDrag, () => {
            this.currentPageIndex--;
            this.isFlippingBack = false;
            this.dragOffset = 0;
            this.dragHandle = null;
          });
        } else if (this.dragOffset >= half) {
          this.snapTo(this.maxDrag, () => {
            this.currentPageIndex--;
            this.isFlippingBack = false;
            this.dragOffset = 0;
            this.dragHandle = null;
          });
        } else {
          this.snapTo(0, () => {
            this.isFlippingBack = false;
            this.dragHandle = null;
          });
        }
      } else {
        if (this.dragOffset <= half) {
          this.snapTo(0, () => {
            this.dragHandle = null;
          });
        } else {
          this.snapTo(this.maxDrag, () => {
            this.dragHandle = null;
          });
        }
      }
    },
    snapTo(target, callback) {
      if (this.snapRaf != null) {
        cancelAnimationFrame(this.snapRaf);
        this.snapRaf = null;
      }
      const start = this.dragOffset;
      const diff = target - start;
      if (Math.abs(diff) < 1) {
        this.dragOffset = target;
        if (callback) callback();
        return;
      }
      const ratio = Math.abs(diff) / Math.max(1, this.maxDrag);
      const duration = Math.min(380, Math.max(120, ratio * 380));
      const t0 = performance.now();
      const animate = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        this.dragOffset = start + diff * eased;
        if (t < 1) {
          this.snapRaf = requestAnimationFrame(animate);
        } else {
          this.snapRaf = null;
          this.dragOffset = target;
          if (callback) callback();
        }
      };
      this.snapRaf = requestAnimationFrame(animate);
    },
    goToPage(i) {
      if (this.isSnapping || i === this.currentPageIndex) return;
      if (i > this.currentPageIndex) {
        this.snapTo(this.maxDrag, () => {
          this.currentPageIndex = i;
          this.dragOffset = 0;
          this.dragHandle = null;
        });
      } else if (i === this.currentPageIndex - 1) {
        this.triggerBackFlip();
      } else {
        this.currentPageIndex = i;
        this.dragOffset = 0;
        this.dragHandle = null;
        this.isFlippingBack = false;
      }
    },
    triggerBackFlip() {
      if (
        !this.hasPrevPage ||
        this.isSnapping ||
        this.isFlippingBack ||
        this.dragHandle === "prevflip"
      ) {
        return;
      }
      this.isFlippingBack = true;
      this.dragOffset = 0;
      this.snapTo(this.maxDrag, () => {
        this.currentPageIndex--;
        this.isFlippingBack = false;
        this.dragOffset = 0;
        this.dragHandle = null;
      });
    },
  },
};
</script>

<style scoped>
.wall-calendar-page__content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
  margin-top: 0;
}

.wall-calendar-page__binding {
  width: 100%;
  height: 3.75rem;
  margin: 0;
  padding: 0;
  background-repeat: repeat-x;
  background-position: left bottom;
  background-size: auto 100%;
  flex-shrink: 0;
}

.wall-calendar-page__paper {
  flex: 1 1 auto;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 1.5rem max(1rem, env(safe-area-inset-left))
    max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-right));
  background-color: var(--token-71c304aa-4c46-4675-8971-a89fbbb7900f, #f2e3cf);
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
  overflow: hidden;
  transition: background-color 0.4s ease;
}

.wall-calendar-page__stack {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: min(70vh, 520px);
  isolation: isolate;
}

.wall-calendar-page__next {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  padding: 0 0 2.5rem;
  pointer-events: none;
}

.wall-calendar-page__next--visible {
  pointer-events: auto;
}

.wall-calendar-page__layer-current {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  isolation: isolate;
}

.wall-calendar-page__perspective {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
}

.wall-calendar-page__flip {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  box-sizing: border-box;
  width: 100%;
  min-height: 0;
}

.wall-calendar-page__curl-fill {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.wall-calendar-page__flip-shade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 48%;
  z-index: 2;
  pointer-events: none;
  border-radius: 0 0 0.75rem 0.75rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.34) 0%,
    rgba(0, 0, 0, 0.12) 42%,
    rgba(0, 0, 0, 0.03) 72%,
    transparent 100%
  );
}

.wall-calendar-page__fold-shadow {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(315deg, transparent 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.25) 100%);
  border-radius: 0 0 0.75rem 0.75rem;
  transition: opacity 0.1s;
}

.wall-calendar-page__current-block {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  padding-top: 4rem;
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
}

.wall-calendar-page__current-block--prev-crossfade {
  position: relative;
}

.wall-calendar-page__prev-surfaces {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  align-content: start;
}

.wall-calendar-page__prev-surfaces > .wall-calendar-page__current-surface {
  grid-area: 1 / 1;
  min-width: 0;
}

.wall-calendar-page__current-surface--prev-incoming {
  z-index: 0;
}

.wall-calendar-page__current-surface--prev-outgoing {
  z-index: 1;
}

.wall-calendar-page__current-surface {
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform-style: preserve-3d;
}

.wall-calendar-page__fold-handle {
  position: absolute;
  z-index: 4;
  width: 5.25rem;
  height: 5.25rem;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  cursor: grab;
  touch-action: none;
  border-radius: 0;
}

.wall-calendar-page__flip > .wall-calendar-page__fold-handle {
  background-color: inherit;
  transform: translateZ(12px);
  transform-style: preserve-3d;
}

.wall-calendar-page__fold-handle:focus-visible {
  outline: 2px solid rgba(44, 62, 80, 0.45);
  outline-offset: 2px;
}

.wall-calendar-page__fold-handle--back-stack {
  z-index: 10;
}

.wall-calendar-page__fold-handle--dragging {
  cursor: grabbing;
}

.wall-calendar-page__fold-corner {
  position: absolute;
  width: 5.25rem;
  height: 5.25rem;
  pointer-events: none;
  transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
}

.wall-calendar-page__fold-corner--br {
  right: 0;
  bottom: 0;
  transform-origin: 100% 100%;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  background: linear-gradient(
      225deg,
      rgba(0, 0, 0, 0.07) 0%,
      rgba(0, 0, 0, 0.02) 38%,
      transparent 40%
    ),
    linear-gradient(225deg, #d8c9b4 0%, #efe4d4 52%, #f8f0e4 100%);
  box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.45);
}

.wall-calendar-page__fold-corner--tl {
  left: 0;
  top: 0;
  transform-origin: 0 0;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  background: linear-gradient(
      315deg,
      rgba(0, 0, 0, 0.07) 0%,
      rgba(0, 0, 0, 0.02) 38%,
      transparent 40%
    ),
    linear-gradient(315deg, #f8f0e4 0%, #efe4d4 48%, #d8c9b4 100%);
  box-shadow: inset -1px -1px 0 rgba(255, 255, 255, 0.45);
}

.wall-calendar-page__fold-handle:hover:not(
    .wall-calendar-page__fold-handle--dragging
  )
  .wall-calendar-page__fold-corner--br,
.wall-calendar-page__fold-handle:focus-visible:not(
    .wall-calendar-page__fold-handle--dragging
  )
  .wall-calendar-page__fold-corner--br {
  transform: scale(1.05);
  filter: brightness(1.06);
  box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.55),
    0 2px 10px rgba(44, 62, 80, 0.14);
}

.wall-calendar-page__fold-handle:hover:not(
    .wall-calendar-page__fold-handle--dragging
  )
  .wall-calendar-page__fold-corner--tl,
.wall-calendar-page__fold-handle:focus-visible:not(
    .wall-calendar-page__fold-handle--dragging
  )
  .wall-calendar-page__fold-corner--tl {
  transform: scale(1.05);
  filter: brightness(1.06);
  box-shadow: inset -1px -1px 0 rgba(255, 255, 255, 0.55),
    0 2px 10px rgba(44, 62, 80, 0.14);
}

.wall-calendar-page__prev-flip-btn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 4rem;
  height: 4rem;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  cursor: grab;
  touch-action: none;
  border-radius: 0 0 0.35rem 0;
}

.wall-calendar-page__prev-flip-btn:focus-visible {
  outline: 2px solid rgba(44, 62, 80, 0.45);
  outline-offset: 2px;
}

.wall-calendar-page__prev-flip-btn--on-diagonal {
  width: 5.25rem;
  height: 5.25rem;
}

.wall-calendar-page__prev-flip-btn--dragging {
  cursor: grabbing;
}

.wall-calendar-page__prev-flip-corner {
  position: absolute;
  top: 0;
  left: 0;
  width: 4rem;
  height: 4rem;
  pointer-events: none;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  background: linear-gradient(
      315deg,
      rgba(0, 0, 0, 0.09) 0%,
      rgba(0, 0, 0, 0.03) 36%,
      transparent 42%
    ),
    linear-gradient(315deg, #f0e2d0 0%, #e8dcc8 45%, #cbb89e 100%);
  box-shadow: inset -1px -1px 0 rgba(255, 255, 255, 0.55),
    0 1px 2px rgba(44, 62, 80, 0.12);
  opacity: 0.88;
  transition: opacity 0.2s, width 0.15s, height 0.15s;
}

.wall-calendar-page__prev-flip-face {
  position: absolute;
  top: 0.35rem;
  left: 0.35rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.05rem;
  max-width: 3rem;
  pointer-events: none;
  color: rgba(44, 62, 80, 0.92);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
}

.wall-calendar-page__prev-flip-chevron {
  width: 1.35rem;
  height: 1.35rem;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.4));
}

.wall-calendar-page__prev-flip-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.15;
  max-width: 3.25rem;
}

.wall-calendar-page__prev-flip-btn--on-diagonal
  .wall-calendar-page__prev-flip-corner {
  width: 5.25rem;
  height: 5.25rem;
}

.wall-calendar-page__prev-flip-btn:hover .wall-calendar-page__prev-flip-corner,
.wall-calendar-page__prev-flip-btn:focus-visible
  .wall-calendar-page__prev-flip-corner {
  opacity: 1;
}

.wall-calendar-page__prev-flip-btn:hover .wall-calendar-page__prev-flip-face,
.wall-calendar-page__prev-flip-btn:focus-visible
  .wall-calendar-page__prev-flip-face {
  color: #1a252f;
}

.wall-calendar-page__indicators-wrap {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
}

.wall-calendar-page__page-counter {
  margin: 0;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  color: rgba(44, 62, 80, 0.65);
}

.wall-calendar-page__indicators {
  display: flex;
  gap: 0.5rem;
}

.wall-calendar-page__indicator-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: rgba(44, 62, 80, 0.22);
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.2s, transform 0.2s;
}

.wall-calendar-page__indicator-dot--active {
  background: rgba(44, 62, 80, 0.7);
  transform: scale(1.35);
}

.wall-calendar-page__indicator-dot:disabled {
  pointer-events: none;
}

.wall-calendar-page__header {
  max-width: 42rem;
  margin: 0 auto 1.5rem;
  padding: 0 1.5rem;
  text-align: center;
}

.wall-calendar-page__header--next {
  margin-top: 0;
}

.wall-calendar-page__title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.wall-calendar-page__title--next {
  font-size: 1.35rem;
}

.wall-calendar-page__lead {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(44, 62, 80, 0.85);
}

.wall-calendar-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
  align-items: start;
}

.wall-calendar-page__card {
  width: 100%;
  max-width: min(52rem, 100%);
  margin: 0 auto;
}

.wall-calendar-page__card.custom-card--media-left :deep(.custom-card__media),
.wall-calendar-page__card.custom-card--media-right :deep(.custom-card__media) {
  flex: 0 0 clamp(14rem, 44%, 26rem);
  min-height: 17rem;
  align-self: stretch;
}

@media (min-width: 1024px) {
  .wall-calendar-page__grid {
    max-width: min(72rem, 100%);
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .wall-calendar-page__card.custom-card--media-left :deep(.custom-card__media),
  .wall-calendar-page__card.custom-card--media-right
    :deep(.custom-card__media) {
    flex: 0 0 clamp(18rem, 56%, 38rem);
    min-height: 24rem;
  }
}

.wall-calendar-page__card-title {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.wall-calendar-page__card-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: rgba(44, 62, 80, 0.88);
}
</style>
