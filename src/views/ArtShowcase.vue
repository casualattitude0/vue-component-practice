<template>
  <main class="art-showcase-page">
    <PageSiteNav />
    <div class="art-showcase">
      <header class="art-showcase__header">
        <h1 class="art-showcase__title">{{ $t('artShowcase.title') }}</h1>
        <p class="art-showcase__lead">{{ $t('artShowcase.lead') }}</p>
        <p class="art-showcase__body">{{ $t('artShowcase.body') }}</p>
      </header>

      <div
        class="art-showcase__grid"
        role="region"
        :aria-label="$t('artShowcase.regionLabel')"
      >
        <ScrollEdgeFadeIn
          class="art-showcase__grid-edge"
          from="left"
          :options="edgeInOptions"
        >
          <div class="art-showcase__col">
            <p class="art-showcase__col-label art-showcase__col-label--a">
              <span class="art-showcase__col-letter">A</span>
              {{ $t('artShowcase.captionA') }}
            </p>
            <div
              class="art-showcase__stack"
              aria-label="Style A"
            >
              <div
                v-for="(item, i) in rowA"
                :key="item.key"
                class="art-showcase__leaf art-showcase__leaf--a"
                :class="`art-showcase__leaf--a-${i + 1}`"
                :style="{ zIndex: i + 1 }"
              >
                <ScrollYFadeIn
                  class="art-showcase__y-in"
                  :from="verticalFrom(i, rowA.length)"
                  :distance="verticalDistance(i, rowA.length)"
                  :delay-ms="verticalDelay(i)"
                  :options="yInOptions"
                >
                  <CustomCard
                    class="art-showcase__card art-showcase__card--fill"
                    media-position="top"
                    hover-effect="scale-up"
                    :hover-scale="1.14"
                    :hover-transition-ms="260"
                  >
                    <template #image>
                      <img
                        :src="item.src"
                        :alt="$t(item.altKey)"
                        class="art-showcase__img"
                      />
                    </template>
                  </CustomCard>
                </ScrollYFadeIn>
              </div>
            </div>
          </div>
        </ScrollEdgeFadeIn>

        <div
          class="art-showcase__col-sep"
          aria-hidden="true"
        >
          <span class="art-showcase__col-sep-line" />
          <span class="art-showcase__col-sep-mark">|</span>
          <span class="art-showcase__col-sep-line" />
        </div>

        <ScrollEdgeFadeIn
          class="art-showcase__grid-edge"
          from="right"
          :options="edgeInOptions"
        >
          <div class="art-showcase__col">
            <p class="art-showcase__col-label art-showcase__col-label--b">
              <span class="art-showcase__col-letter">B</span>
              {{ $t('artShowcase.captionB') }}
            </p>
            <div
              class="art-showcase__stack"
              aria-label="Style B"
            >
              <div
                v-for="(item, i) in rowB"
                :key="item.key"
                class="art-showcase__leaf art-showcase__leaf--b"
                :class="`art-showcase__leaf--b-${i + 1}`"
                :style="{ zIndex: i + 1 }"
              >
                <ScrollYFadeIn
                  class="art-showcase__y-in"
                  :from="verticalFrom(i, rowB.length)"
                  :distance="verticalDistance(i, rowB.length)"
                  :delay-ms="verticalDelay(i)"
                  :options="yInOptions"
                >
                  <CustomCard
                    class="art-showcase__card art-showcase__card--fill"
                    media-position="top"
                    hover-effect="scale-up"
                    :hover-scale="1.14"
                    :hover-transition-ms="260"
                  >
                    <template #image>
                      <img
                        :src="item.src"
                        :alt="$t(item.altKey)"
                        class="art-showcase__img"
                      />
                    </template>
                  </CustomCard>
                </ScrollYFadeIn>
              </div>
            </div>
          </div>
        </ScrollEdgeFadeIn>
      </div>
    </div>
  </main>
</template>

<script>
import CustomCard from "@/components/CustomCard.vue";
import PageSiteNav from "@/components/PageSiteNav.vue";
import ScrollEdgeFadeIn from "@/components/ScrollEdgeFadeIn.vue";
import ScrollYFadeIn from "@/components/ScrollYFadeIn.vue";
import styleA1 from "@/assets/styles/style-a1.png";
import styleA2 from "@/assets/styles/style-a2.png";
import styleA3 from "@/assets/styles/style-a3.png";
import styleB1 from "@/assets/styles/style-b1.png";
import styleB2 from "@/assets/styles/style-b2.png";
import styleB3 from "@/assets/styles/style-b3.png";

export default {
  name: "ArtShowcasePage",
  components: { CustomCard, PageSiteNav, ScrollEdgeFadeIn, ScrollYFadeIn },
  data() {
    return {
      edgeInOptions: {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
      yInOptions: {
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.08,
      },
      rowA: [
        { key: "a1", src: styleA1, altKey: "artShowcase.altA1" },
        { key: "a2", src: styleA2, altKey: "artShowcase.altA2" },
        { key: "a3", src: styleA3, altKey: "artShowcase.altA3" },
      ],
      rowB: [
        { key: "b1", src: styleB1, altKey: "artShowcase.altB1" },
        { key: "b2", src: styleB2, altKey: "artShowcase.altB2" },
        { key: "b3", src: styleB3, altKey: "artShowcase.altB3" },
      ],
    };
  },
  methods: {
    verticalFrom(i, len) {
      return i === len - 1 ? "bottom" : "top";
    },
    verticalDistance(i, len) {
      if (i > 0 && i < len - 1) return "0.62rem";
      return "1.1rem";
    },
    verticalDelay(i) {
      return i * 52;
    },
  },
};
</script>

<style scoped>
.art-showcase-page {
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(165deg, #f8f6f2 0%, #eef2f6 42%, #e8ecef 100%);
  color: #1e2a32;
}

.art-showcase {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 1.25rem clamp(1rem, 4vw, 2.5rem) 3.5rem;
  box-sizing: border-box;
}

.art-showcase__header {
  text-align: center;
  margin-bottom: 2.5rem;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.art-showcase__title {
  margin: 0 0 0.65rem;
  font-size: clamp(1.65rem, 4vw, 2.15rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.art-showcase__lead {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: rgba(30, 42, 50, 0.88);
  line-height: 1.45;
}

.art-showcase__body {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(30, 42, 50, 0.72);
}

.art-showcase__grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0 clamp(0.75rem, 3vw, 2rem);
  align-items: start;
  width: 100%;
  max-width: none;
  margin: 0;
}

.art-showcase__grid-edge {
  min-width: 0;
}

.art-showcase__col {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.art-showcase__col-label {
  margin: 0 0 1rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(30, 42, 50, 0.55);
  line-height: 1.4;
  max-width: 14rem;
}

.art-showcase__col-label--a .art-showcase__col-letter {
  color: #2a4d6e;
}
.art-showcase__col-label--b .art-showcase__col-letter {
  color: #6b3d5c;
}

.art-showcase__col-letter {
  display: inline-block;
  margin-right: 0.35rem;
  font-size: 1rem;
  letter-spacing: 0;
}

.art-showcase__col-sep {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding-top: 2.5rem;
  opacity: 0.35;
  user-select: none;
}

.art-showcase__col-sep-line {
  width: 1px;
  flex: 1;
  min-height: 1.5rem;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(30, 42, 50, 0.25) 20%,
    rgba(30, 42, 50, 0.25) 80%,
    transparent
  );
}

.art-showcase__col-sep-mark {
  font-size: 0.65rem;
  font-weight: 300;
  color: rgba(30, 42, 50, 0.4);
  line-height: 1;
}

.art-showcase__stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: min(28rem, 100%);
  overflow: visible;
  padding-bottom: 0.5rem;
}

.art-showcase__leaf {
  position: relative;
  width: 100%;
  margin-top: var(--art-leaf-overlap, -2.75rem);
  transition: margin-top 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), z-index 0s linear 0.2s;
  filter: drop-shadow(0 14px 22px rgba(30, 42, 50, 0.14));
}

.art-showcase__col:hover .art-showcase__leaf {
  transform: none;
}

.art-showcase__col:hover .art-showcase__leaf:not(:first-child) {
  --art-leaf-overlap: 0.85rem;
}

.art-showcase .art-showcase__y-in {
  display: block;
  width: 100%;
  transition:
    opacity 1.2s ease-out var(--scroll-y-delay, 0ms),
    transform 1.28s cubic-bezier(0.22, 1, 0.36, 1) var(--scroll-y-delay, 0ms);
}

.art-showcase .art-showcase__grid-edge {
  transition:
    opacity 1.05s ease-out,
    transform 1.12s cubic-bezier(0.22, 1, 0.36, 1);
}

.art-showcase__leaf:first-child {
  margin-top: 0;
}

.art-showcase__leaf:hover {
  z-index: 80 !important;
  transition-delay: 0s;
}

.art-showcase__card {
  width: 100%;
}

.art-showcase__card--fill {
  padding: 0;
  overflow: hidden;
  border-radius: 16px;
  background: #1a1f24;
  border: none;
  box-shadow: 0 8px 28px rgba(30, 42, 50, 0.18);
}

:deep(.custom-card.art-showcase__card--fill) {
  gap: 0;
}

.art-showcase__card--fill :deep(.custom-card__body) {
  display: none;
}

.art-showcase__card--fill :deep(.custom-card__media) {
  width: 100%;
  border-radius: 0;
}

.art-showcase__img {
  max-width: 100%;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Column A: light "(" tilt along vertical stack */
.art-showcase__leaf--a-1 {
  transform: rotate(-5deg) translateX(-8px);
}
.art-showcase__leaf--a-2 {
  transform: translateX(4px);
}
.art-showcase__leaf--a-3 {
  transform: rotate(5deg) translateX(-8px);
}

/* Column B: mirror */
.art-showcase__leaf--b-1 {
  transform: rotate(5deg) translateX(8px);
}
.art-showcase__leaf--b-2 {
  transform: translateX(-4px);
}
.art-showcase__leaf--b-3 {
  transform: rotate(-5deg) translateX(8px);
}

@media (max-width: 700px) {
  .art-showcase__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem 0;
  }

  .art-showcase__col-sep {
    flex-direction: row;
    padding-top: 0;
    width: 100%;
    max-width: 16rem;
    margin: 0 auto;
  }

  .art-showcase__col-sep-line {
    width: auto;
    height: 1px;
    min-height: 0;
    flex: 1;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(30, 42, 50, 0.2) 15%,
      rgba(30, 42, 50, 0.2) 85%,
      transparent
    );
  }

  .art-showcase__stack {
    max-width: min(28rem, 88vw);
  }
}

@media (prefers-reduced-motion: reduce) {
  .art-showcase__leaf {
    transition: z-index 0s linear 0.2s;
  }

  .art-showcase .art-showcase__y-in,
  .art-showcase .art-showcase__grid-edge {
    transition: none;
  }
}
</style>
