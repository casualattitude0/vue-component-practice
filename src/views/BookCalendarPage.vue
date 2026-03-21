<template>
  <main class="page book-calendar-page">
    <PageSiteNav />
    <div class="book-calendar-page__content">
      <div
        ref="bindingEl"
        class="book-calendar-page__binding"
        :style="bindingBackgroundStyle"
        aria-hidden="true"
      />
      <div
        class="book-calendar-page__paper"
        :style="paperStyle"
      >
        <div class="book-calendar-page__stack">
          <div class="book-calendar-page__book-wrap">
            <div
              ref="bookRoot"
              class="book-calendar-page__book"
            >
              <div
                v-for="(p, i) in pages"
                :key="i"
                class="book-calendar-page__page"
                :style="{ backgroundColor: p.bg }"
              >
                <div class="book-calendar-page__current-block">
                  <div class="book-calendar-page__current-surface">
                    <header class="book-calendar-page__header">
                      <h1 class="book-calendar-page__title">{{ p.title }}</h1>
                      <p class="book-calendar-page__lead">{{ p.lead }}</p>
                    </header>
                    <div class="book-calendar-page__grid">
                      <CustomCard
                        class="book-calendar-page__card"
                        hover-effect="scale-down"
                        :hover-scale="0.96"
                        :hover-transition-ms="280"
                        :media-position="mediaPositionForIndex()"
                        media-image-object-fit="cover"
                      >
                        <template #image>
                          <img
                            :src="p.img"
                            alt=""
                          />
                        </template>
                        <h2 class="book-calendar-page__card-title">{{ p.cardTitle }}</h2>
                        <p class="book-calendar-page__card-text">{{ p.cardHint }}</p>
                      </CustomCard>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="book-calendar-page__corner-hints"
              aria-hidden="true"
            >
              <span
                v-if="canFlipPrev"
                class="book-calendar-page__fold-corner book-calendar-page__fold-corner--tl"
              />
              <span
                v-if="canFlipPrev"
                class="book-calendar-page__fold-corner book-calendar-page__fold-corner--bl"
              />
              <span
                v-if="canFlipNext"
                class="book-calendar-page__fold-corner book-calendar-page__fold-corner--tr"
              />
              <span
                v-if="canFlipNext"
                class="book-calendar-page__fold-corner book-calendar-page__fold-corner--br"
              />
            </div>
          </div>

          <div class="book-calendar-page__controls">
            <button
              type="button"
              class="book-calendar-page__nav-btn"
              :disabled="!canFlipPrev || isFlipBusy"
              :aria-label="$t('bookCalendarPage.prevAria')"
              @click="onPrev"
            >
              <svg
                class="book-calendar-page__nav-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                />
              </svg>
            </button>

            <div class="book-calendar-page__indicators-wrap">
              <p class="book-calendar-page__page-counter">
                {{ currentPageIndex + 1 }}/{{ pages.length }}
              </p>
              <div class="book-calendar-page__indicators">
                <button
                  v-for="(p, i) in pages"
                  :key="i"
                  type="button"
                  class="book-calendar-page__indicator-dot"
                  :class="{ 'book-calendar-page__indicator-dot--active': i === currentPageIndex }"
                  :disabled="isFlipBusy"
                  @click="goToPage(i)"
                />
              </div>
            </div>

            <button
              type="button"
              class="book-calendar-page__nav-btn"
              :disabled="!canFlipNext || isFlipBusy"
              :aria-label="$t('bookCalendarPage.nextAria')"
              @click="onNext"
            >
              <svg
                class="book-calendar-page__nav-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { PageFlip } from "page-flip";
import bookHeaderUrl from "@/assets/test/bookheader.png";
import CustomCard from "@/components/CustomCard.vue";
import PageSiteNav from "@/components/PageSiteNav.vue";

const SM_MIN_PX = 640;
const PAGE_FLIP_MS_DEFAULT = 100;
const PAGE_FLIP_MS_MOBILE = 250;

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
  name: "BookCalendarPage",
  components: { CustomCard, PageSiteNav },
  data() {
    return {
      pages: PAGES,
      currentPageIndex: 0,
      pageFlip: null,
      flipState: "read",
      bookFlipResizeCleanup: null,
    };
  },
  computed: {
    currentPage() {
      return this.pages[this.currentPageIndex] || this.pages[0];
    },
    bindingBackgroundStyle() {
      return { backgroundImage: `url(${bookHeaderUrl})` };
    },
    paperStyle() {
      return { backgroundColor: this.currentPage.bg };
    },
    isFlipBusy() {
      return this.flipState === "flipping" || this.flipState === "user_fold";
    },
    canFlipNext() {
      return this.currentPageIndex < this.pages.length - 1;
    },
    canFlipPrev() {
      return this.currentPageIndex > 0;
    },
  },
  mounted() {
    this.$nextTick(() => this.initPageFlip());
  },
  beforeUnmount() {
    if (typeof this.bookFlipResizeCleanup === "function") {
      this.bookFlipResizeCleanup();
      this.bookFlipResizeCleanup = null;
    }
    if (this.pageFlip) {
      this.pageFlip.destroy();
      this.pageFlip = null;
    }
  },
  methods: {
    mediaPositionForIndex() {
      return "right";
    },
    bookFlipParentWidth() {
      const root = this.$refs.bookRoot;
      if (!root) return 800;
      const parent = root.parentElement;
      const w = parent ? parent.clientWidth : root.clientWidth;
      if (w > 0) return w;
      return typeof window !== "undefined" ? window.innerWidth : 800;
    },
    syncBookFlipViewportSize() {
      const root = this.$refs.bookRoot;
      if (!root || !this.pageFlip) return;
      const cw = this.bookFlipParentWidth();
      root.style.minWidth = `${Math.min(800, Math.max(280, cw))}px`;
      this.pageFlip.update();
    },
    applyBookFlipFlipDuration() {
      if (!this.pageFlip || typeof window === "undefined") return;
      const narrow = window.innerWidth < SM_MIN_PX;
      this.pageFlip.getSettings().flippingTime = narrow
        ? PAGE_FLIP_MS_MOBILE
        : PAGE_FLIP_MS_DEFAULT;
    },
    initPageFlip() {
      const root = this.$refs.bookRoot;
      if (!root) return;
      const items = root.querySelectorAll(".book-calendar-page__page");
      if (!items.length) return;

      const narrow =
        typeof window !== "undefined" && window.innerWidth < SM_MIN_PX;

      this.pageFlip = new PageFlip(root, {
        width: 550,
        height: 266,
        size: "stretch",
        minWidth: 800,
        maxWidth: 1200,
        minHeight: narrow ? 240 : 280,
        maxHeight: 900,
        drawShadow: true,
        maxShadowOpacity: 0.34,
        flippingTime: narrow ? PAGE_FLIP_MS_MOBILE : PAGE_FLIP_MS_DEFAULT,
        usePortrait: true,
        autoSize: true,
        showCover: false,
        mobileScrollSupport: true,
        clickEventForward: true,
        useMouseEvents: !narrow,
        disableFlipByClick: true,
        showPageCorners: false,
        swipeDistance: narrow ? 18 : 30,
        startPage: 0,
      });

      this.pageFlip.on("init", (e) => {
        if (e.data && typeof e.data.page === "number") {
          this.currentPageIndex = e.data.page;
        }
      });
      this.pageFlip.on("flip", (e) => {
        if (typeof e.data === "number") this.currentPageIndex = e.data;
      });
      this.pageFlip.on("changeState", (e) => {
        this.flipState = e.data || "read";
      });

      this.pageFlip.loadFromHTML(items);

      this.$nextTick(() => {
        this.applyBookFlipFlipDuration();
        this.syncBookFlipViewportSize();
        if (typeof this.bookFlipResizeCleanup === "function") {
          this.bookFlipResizeCleanup();
        }
        let t = null;
        const onResize = () => {
          if (t) window.clearTimeout(t);
          t = window.setTimeout(() => {
            t = null;
            this.applyBookFlipFlipDuration();
            this.syncBookFlipViewportSize();
          }, 120);
        };
        window.addEventListener("resize", onResize, { passive: true });
        this.bookFlipResizeCleanup = () => {
          window.removeEventListener("resize", onResize);
          if (t) window.clearTimeout(t);
        };
      });
    },
    onNext() {
      if (!this.pageFlip || this.isFlipBusy) return;
      this.pageFlip.getSettings().disableFlipByClick = false;
      this.pageFlip.flipNext("bottom");
      this.pageFlip.getSettings().disableFlipByClick = true;
    },
    onPrev() {
      if (!this.pageFlip || this.isFlipBusy) return;
      this.pageFlip.getSettings().disableFlipByClick = false;
      this.pageFlip.flipPrev("bottom");
      this.pageFlip.getSettings().disableFlipByClick = true;
    },
    goToPage(i) {
      if (!this.pageFlip || this.isFlipBusy || i === this.currentPageIndex)
        return;
      this.pageFlip.getSettings().disableFlipByClick = false;
      this.pageFlip.flip(i, "bottom");
      this.pageFlip.getSettings().disableFlipByClick = true;
    },
  },
};
</script>

<style scoped>
.book-calendar-page__content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
  margin-top: 0;
}

.book-calendar-page__binding {
  width: 100%;
  height: 3.75rem;
  margin: 0;
  padding: 0;
  background-repeat: repeat-x;
  background-position: left bottom;
  background-size: auto 100%;
  flex-shrink: 0;
}

.book-calendar-page__paper {
  flex: 1 1 auto;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 1.5rem max(1rem, env(safe-area-inset-left))
    max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-right));
  background-color: #f2e3cf;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
  overflow: hidden;
  transition: background-color 0.4s ease;
}

.book-calendar-page__stack {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  isolation: isolate;
}

.book-calendar-page__book-wrap {
  position: relative;
  flex: 0 0 auto;
  align-self: stretch;
  width: 100%;
  max-width: min(50rem, 100%);
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .book-calendar-page__book-wrap {
    max-width: min(75rem, 100%);
  }
}

.book-calendar-page__book {
  position: relative;
  width: 100%;
  min-height: 0;
}

.book-calendar-page__book :deep(.stf__wrapper) {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.book-calendar-page__book :deep(.stf__outerShadow),
.book-calendar-page__book :deep(.stf__innerShadow),
.book-calendar-page__book :deep(.stf__hardShadow),
.book-calendar-page__book :deep(.stf__hardInnerShadow) {
  filter: blur(1px);
  mix-blend-mode: multiply;
}

.book-calendar-page__corner-hints {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
}

@media (max-width: 639px) {
  .book-calendar-page__corner-hints {
    display: none;
  }
}

.book-calendar-page__fold-corner {
  position: absolute;
  width: 5.25rem;
  height: 5.25rem;
  pointer-events: none;
}

.book-calendar-page__fold-corner--br {
  right: 0;
  bottom: 0;
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

.book-calendar-page__fold-corner--tr {
  right: 0;
  top: 0;
  clip-path: polygon(100% 0, 100% 100%, 0 0);
  background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.07) 0%,
      rgba(0, 0, 0, 0.02) 38%,
      transparent 40%
    ),
    linear-gradient(135deg, #d8c9b4 0%, #efe4d4 52%, #f8f0e4 100%);
  box-shadow: inset 1px -1px 0 rgba(255, 255, 255, 0.45);
}

.book-calendar-page__fold-corner--tl {
  left: 0;
  top: 0;
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

.book-calendar-page__fold-corner--bl {
  left: 0;
  bottom: 0;
  clip-path: polygon(0 0, 0 100%, 100% 100%);
  background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.07) 0%,
      rgba(0, 0, 0, 0.02) 38%,
      transparent 40%
    ),
    linear-gradient(45deg, #f8f0e4 0%, #efe4d4 48%, #d8c9b4 100%);
  box-shadow: inset -1px 1px 0 rgba(255, 255, 255, 0.45);
}

.book-calendar-page__page {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 0 2.5rem;
}

.book-calendar-page__current-block {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.book-calendar-page__current-surface {
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.book-calendar-page__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 0 0;
}

@media (max-width: 639px) {
  .book-calendar-page__stack {
    gap: 1rem;
  }

  .book-calendar-page__controls {
    order: -1;
    width: 100%;
    flex-shrink: 0;
    padding: 0 0 0.25rem;
  }
}

.book-calendar-page__nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(44, 62, 80, 0.08);
  color: rgba(44, 62, 80, 0.92);
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.book-calendar-page__nav-btn:hover:not(:disabled) {
  background: rgba(44, 62, 80, 0.14);
}

.book-calendar-page__nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.book-calendar-page__nav-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.book-calendar-page__indicators-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
}

.book-calendar-page__page-counter {
  margin: 0;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  color: rgba(44, 62, 80, 0.65);
}

.book-calendar-page__indicators {
  display: flex;
  gap: 0.5rem;
  pointer-events: auto;
}

.book-calendar-page__indicator-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: rgba(44, 62, 80, 0.22);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.book-calendar-page__indicator-dot--active {
  background: rgba(44, 62, 80, 0.7);
  transform: scale(1.35);
}

.book-calendar-page__indicator-dot:disabled {
  pointer-events: none;
}

.book-calendar-page__header {
  max-width: 42rem;
  margin: 0 auto 1.5rem;
  text-align: center;
}

.book-calendar-page__title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.book-calendar-page__lead {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(44, 62, 80, 0.85);
}

.book-calendar-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  max-width: 960px;
  margin: 0 auto;
  align-items: start;
}

.book-calendar-page__card {
  width: 100%;
  max-width: min(52rem, 100%);
  margin: 0 auto;
}

.book-calendar-page__card.custom-card--media-left :deep(.custom-card__media),
.book-calendar-page__card.custom-card--media-right :deep(.custom-card__media) {
  flex: 0 0 clamp(14rem, 44%, 26rem);
  min-height: 17rem;
  align-self: stretch;
}

@media (min-width: 1024px) {
  .book-calendar-page__grid {
    max-width: min(72rem, 100%);
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .book-calendar-page__card.custom-card--media-left :deep(.custom-card__media),
  .book-calendar-page__card.custom-card--media-right
    :deep(.custom-card__media) {
    flex: 0 0 clamp(18rem, 56%, 38rem);
    min-height: 24rem;
  }
}

.book-calendar-page__card-title {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.book-calendar-page__card-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: rgba(44, 62, 80, 0.88);
}
</style>
