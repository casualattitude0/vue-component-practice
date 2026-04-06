<template>
  <section
    id="home-about"
    class="ha"
    :class="{ 'ha--embedded': disableScrollAnim }"
    :style="{ height: sectionHeight }"
    aria-labelledby="ha-title"
  >
    <div
      ref="stickyRef"
      class="ha__sticky"
      :style="[
        { height: stickyHeight },
        !disableScrollAnim
          ? { position: 'sticky', top: 'var(--fp-header-offset, 58px)' }
          : {}
      ]"
    >
      <div class="ha__head">
        <h2
          id="ha-title"
          class="ha__title"
        >
          {{ $t('home.about.title') }}
        </h2>
      </div>
      <div
        ref="tlWrapRef"
        class="ha__tl-wrap"
      >
        <div
          ref="tlInnerRef"
          class="ha__tl-inner"
        >
          <svg
            class="ha__curve-svg"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="ha-curve-grad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stop-color="#ccc"
                />
                <stop
                  offset="50%"
                  stop-color="#666"
                />
                <stop
                  offset="100%"
                  stop-color="#ccc"
                />
              </linearGradient>
            </defs>
            <path
              ref="curvePathRef"
              class="ha__curve-path"
              fill="none"
              stroke="url(#ha-curve-grad)"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
              d="M 50 0 C 68 120 32 240 50 360 C 68 480 32 600 50 720 C 68 840 32 960 50 1000"
            />
          </svg>
          <div
            ref="iconRef"
            class="ha__icon"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="17"
              />
              <polyline points="7 12 12 17 17 12" />
            </svg>
          </div>
          <div
            v-for="(card, i) in cards"
            :key="i"
            :ref="el => setCardRef(el, i)"
            class="ha__node"
            :class="[
              i % 2 === 0 ? 'ha__node--left' : 'ha__node--right',
              'ha__node--wire',
              { 'ha__node--lit': cardLit[i] },
            ]"
            :style="nodeStyle(i)"
          >
            <div class="ha__node__connector" />
            <div class="ha__node__dot" />
            <div class="ha__node__panel">
              <div class="ha__node__visual" />
              <div class="ha__node__text">
                <h3 class="ha__node__title">{{ card.title }}</h3>
                <p class="ha__node__body">{{ card.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARD_TOPS = [10, 30, 50, 70, 90];
const CARD_PROGRESS = [0.1, 0.3, 0.5, 0.7, 0.9];
const CARD_REVEAL_START = [0.0, 0.2, 0.4, 0.6, 0.8];
const CARD_REVEAL_END = [0, 0.3, 0.5, 0.7, 0.9];
function smoothstep01(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function revealAmount(p, i) {
  const s = CARD_REVEAL_START[i];
  const e = CARD_REVEAL_END[i];
  if (p >= e) return 1;
  if (p <= s) return 0;
  return (p - s) / (e - s);
}

export default {
  name: "HomeAbout",
  props: {
    disableScrollAnim: {
      type: Boolean,
      default: false,
    },
    scrollerHeight: {
      type: Number,
      default: 0,
    },
    headerOffset: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const stickyRef = ref(null);
    const tlWrapRef = ref(null);
    const tlInnerRef = ref(null);
    const iconRef = ref(null);
    const curvePathRef = ref(null);
    const cardRefs = ref([]);
    const cardLinePos = ref([]);
    const cardLit = ref([]);
    const pathLen = ref(0);
    let stTrigger = null;

    const stickyHeight = computed(() => {
      const base =
        props.scrollerHeight > 0 ? `${props.scrollerHeight}px` : "100vh";
      if (props.headerOffset > 0 && !props.disableScrollAnim) {
        return `calc(${base} - var(--fp-header-offset, 58px))`;
      }
      return base;
    });

    const sectionHeight = computed(() => {
      if (props.disableScrollAnim) return undefined;
      if (props.scrollerHeight > 0) {
        return `${props.scrollerHeight * 5}px`;
      }
      return "500vh";
    });

    function setCardRef(el, i) {
      if (el) cardRefs.value[i] = el;
    }

    function updateCurveGeometry() {
      const path = curvePathRef.value;
      if (!path || typeof path.getTotalLength !== "function") return;
      const len = path.getTotalLength();
      pathLen.value = len;
      cardLinePos.value = CARD_TOPS.map((pct) => {
        const pt = path.getPointAtLength((pct / 100) * len);
        return { leftPct: pt.x, topPct: (pt.y / 1000) * 100 };
      });
    }

    function setIconOnCurve(p) {
      const path = curvePathRef.value;
      const icon = iconRef.value;
      if (!path || !icon || typeof path.getTotalLength !== "function") return;
      const len = path.getTotalLength();
      if (!len) return;
      const pt = path.getPointAtLength(p * len);
      icon.style.left = `${pt.x}%`;
      icon.style.top = `${(pt.y / 1000) * 100}%`;
    }

    function applyScrollState(self) {
      const p = self.progress;
      const icon = iconRef.value;

      if (tlInnerRef.value && tlWrapRef.value) {
        const overflow = Math.max(
          0,
          tlInnerRef.value.offsetHeight - tlWrapRef.value.offsetHeight
        );
        gsap.set(tlInnerRef.value, { y: (0.5 - p) * overflow });
      }

      setIconOnCurve(p);
      if (icon) {
        icon.style.transform = `translate(-50%, -50%) rotate(${
          self.direction === -1 ? 180 : 0
        }deg)`;
      }

      let nearestIdx = 0;
      let minDist = 1;
      CARD_PROGRESS.forEach((cp, i) => {
        const d = Math.abs(p - cp);
        if (d < minDist) {
          minDist = d;
          nearestIdx = i;
        }
      });

      const nextLit = [];
      cardRefs.value.forEach((el, i) => {
        if (!el) return;
        const raw = revealAmount(p, i);
        nextLit[i] = raw >= 0.88;
        const t = smoothstep01(raw);
        const entranceScale = 0.82 + 0.18 * t;
        const done = raw >= 1;
        const scale = done ? (nearestIdx === i ? 1.15 : 1) : entranceScale;
        gsap.set(el, {
          opacity: t,
          scale,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "50% 50%",
          force3D: true,
        });
      });
      cardLit.value = nextLit;
    }

    onMounted(() => {
      const sticky = stickyRef.value;
      const icon = iconRef.value;
      if (!sticky || !icon) return;

      if (props.disableScrollAnim) {
        nextTick(() => {
          updateCurveGeometry();
          setIconOnCurve(0.5);
          if (icon) icon.style.transform = "translate(-50%, -50%)";
          cardRefs.value.forEach((el) => {
            if (!el) return;
            gsap.set(el, {
              opacity: 1,
              scale: 1,
              xPercent: -50,
              yPercent: -50,
              transformOrigin: "50% 50%",
            });
          });
          cardLit.value = cardRefs.value.map(() => true);
        });
        return;
      }

      // Detect nearest scrollable ancestor (e.g. fp-page in fullpage mode)
      let scroller = window;
      let node = sticky.parentElement;
      while (node && node !== document.documentElement) {
        const oy = window.getComputedStyle(node).overflowY;
        if (oy === "auto" || oy === "scroll") {
          scroller = node;
          break;
        }
        node = node.parentElement;
      }

      nextTick(() => {
        updateCurveGeometry();
        cardRefs.value.forEach((el) => {
          if (!el) return;
          gsap.set(el, {
            opacity: 0,
            scale: 0.82,
            xPercent: -50,
            yPercent: -50,
            transformOrigin: "50% 50%",
          });
        });
      });

      stTrigger = ScrollTrigger.create({
        trigger: sticky.parentElement,
        scroller,
        pin: false,
        invalidateOnRefresh: true,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          applyScrollState(self);
        },
      });
      requestAnimationFrame(() => {
        updateCurveGeometry();
        ScrollTrigger.refresh();
        if (stTrigger) applyScrollState(stTrigger);
      });
    });

    onUnmounted(() => {
      stTrigger?.kill();
      stTrigger = null;
    });

    function nodeStyle(i) {
      const pos = cardLinePos.value[i];
      const nt = pos ? `${pos.topPct}%` : `${CARD_TOPS[i]}%`;
      const nx = pos ? `${pos.leftPct}%` : "50%";
      return { "--nt": nt, "--nx": nx };
    }

    return {
      stickyRef,
      tlWrapRef,
      tlInnerRef,
      iconRef,
      curvePathRef,
      cardLinePos,
      CARD_TOPS,
      setCardRef,
      nodeStyle,
      stickyHeight,
      sectionHeight,
      cardLit,
    };
  },
  computed: {
    cards() {
      return this.$tm("home.about.cards");
    },
  },
};
</script>

<style scoped>
.ha {
  position: relative;
  background: transparent;
  box-sizing: border-box;
}

.ha__sticky {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.ha__head {
  flex: 0 0 auto;
  padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem) 0.5rem;
  text-align: center;
}

.ha__title {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #000;
}

.ha__tl-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-inline-start: max(
    clamp(0.5rem, 3vw, 2rem),
    env(safe-area-inset-left)
  );
  padding-inline-end: max(clamp(0.5rem, 3vw, 2rem), env(safe-area-inset-right));
  box-sizing: border-box;
  overflow: hidden;
  mask-image: linear-gradient(
    to bottom,
    black 0%,
    black 5%,
    black 95%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    black 0%,
    black 5%,
    black 95%,
    transparent
  );
}

.ha__tl-inner {
  position: relative;
  width: 100%;
  max-width: min(1280px, 100%);
  height: 250%;
  min-height: min(150vh, 1000px);
  overflow: visible;
  container-type: inline-size;
  container-name: ha-tl;
}

.ha--embedded .ha__tl-inner {
  height: 200%;
  min-height: min(120vh, 800px);
}

.ha__curve-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.ha__icon {
  position: absolute;
  left: 50%;
  top: 0%;
  width: clamp(28px, 5vw, 36px);
  height: clamp(28px, 5vw, 36px);
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  will-change: transform, left, top;
}

.ha__icon svg {
  width: clamp(16px, 3.5vw, 20px);
  height: clamp(16px, 3.5vw, 20px);
  color: #000;
}

.ha__node {
  position: absolute;
  left: var(--nx, 50%);
  top: var(--nt, 50%);
  z-index: 1;
  opacity: 0;
  will-change: transform, opacity;
  --node-gap: clamp(1.25rem, 5cqi, 2.75rem);
}

.ha__node__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: currentColor;
  box-shadow: 0 0 0 3px #fff;
}

.ha__node--lit .ha__node__dot {
  animation: ha-dot-pulse 1.4s ease-in-out infinite;
}

@keyframes ha-dot-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 3px #fff, 0 0 0 0 rgba(51, 51, 51, 0.35);
  }
  50% {
    box-shadow: 0 0 0 3px #fff, 0 0 0 8px rgba(51, 51, 51, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ha__node--lit .ha__node__dot {
    animation: none;
  }
}

.ha__node--wire {
  color: #333;
}

.ha__node__connector {
  position: absolute;
  left: 50%;
  top: 50%;
  width: clamp(28px, 8cqi, 64px);
  height: 0;
  border-top: 2px dashed currentColor;
  pointer-events: none;
}

.ha__node--left .ha__node__connector {
  transform: translate(-100%, -50%);
}

.ha__node--right .ha__node__connector {
  transform: translate(0, -50%);
}

.ha__node__panel {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  max-width: min(560px, calc(40cqi - 2rem));
  width: max-content;
  border-radius: 6px;
  transition: box-shadow 0.28s ease, filter 0.2s ease;
}

.ha__node:hover .ha__node__panel,
.ha__node:focus-within .ha__node__panel {
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12);
  filter: brightness(1.02);
}

.ha__node__visual {
  width: 100%;
  height: clamp(100px, 15vh, 160px);
  box-sizing: border-box;
  border-radius: 4px;
  background: repeating-linear-gradient(
    45deg,
    #e8e8e8,
    #e8e8e8 8px,
    #f0f0f0 8px,
    #f0f0f0 16px
  );
  border: 2px dashed #999;
}

.ha__node__text {
  display: flex;
  flex-direction: column;
}

.ha__node--left .ha__node__panel {
  transform: translate(calc(-100% - clamp(1.25rem, 5cqi, 2.75rem)), -50%);
}

.ha__node--right .ha__node__panel {
  transform: translate(clamp(1.25rem, 5cqi, 2.75rem), -50%);
}

.ha__node__title {
  margin: 0 0 4px;
  font-size: clamp(0.82rem, 2.2cqi, 0.95rem);
  font-weight: 700;
  color: #000;
}

.ha__node__body {
  margin: 0;
  font-size: clamp(0.75rem, 2cqi, 0.875rem);
  line-height: 1.45;
  color: #555;
}

@supports not (width: 1cqi) {
  .ha__tl-inner {
    container-type: normal;
  }

  .ha__node__connector {
    width: clamp(28px, 8vw, 64px);
  }

  .ha__node__panel {
    max-width: min(560px, calc(40vw - 2rem));
  }

  .ha__node--left .ha__node__panel {
    transform: translate(calc(-100% - clamp(1.25rem, 5vw, 2.75rem)), -50%);
  }

  .ha__node--right .ha__node__panel {
    transform: translate(clamp(1.25rem, 5vw, 2.75rem), -50%);
  }

  .ha__node__title {
    font-size: clamp(0.82rem, 2.2vw, 0.95rem);
  }

  .ha__node__body {
    font-size: clamp(0.75rem, 2vw, 0.875rem);
  }
}

@media (max-width: 900px) {
  .ha__tl-inner {
    min-height: min(120vh, 800px);
  }

  .ha__node__dot {
    width: clamp(10px, 2.5cqi, 14px);
    height: clamp(10px, 2.5cqi, 14px);
  }
}

@media (max-width: 600px) {
  .ha__tl-inner {
    min-height: min(100vh, 700px);
  }

  .ha__node__connector {
    width: clamp(22px, 10vw, 36px);
  }

  .ha__node__panel {
    max-width: min(calc(40cqi - 1rem), calc(55vw - 1.25rem));
  }

  .ha__node--left .ha__node__panel {
    transform: translate(calc(-100% - clamp(0.85rem, 4vw, 1.25rem)), -50%);
  }

  .ha__node--right .ha__node__panel {
    transform: translate(clamp(0.85rem, 4vw, 1.25rem), -50%);
  }
}

@supports not (width: 1cqi) {
  @media (max-width: 900px) {
    .ha__node__dot {
      width: clamp(10px, 2.5vw, 14px);
      height: clamp(10px, 2.5vw, 14px);
    }
  }

  @media (max-width: 600px) {
    .ha__node__panel {
      max-width: min(calc(40vw - 1rem), calc(55vw - 1.25rem));
    }
  }
}
</style>
