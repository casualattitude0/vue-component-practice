<template>
  <section
    id="home-about"
    class="ha"
    :class="{ 'ha--embedded': disableScrollAnim }"
    :style="[headerSectionStyle, { height: sectionHeight }]"
    aria-labelledby="ha-title"
  >
    <div
      ref="stickyRef"
      class="ha__sticky"
      :style="[
        { height: stickyHeight },
        !disableScrollAnim ? { position: 'sticky', top: headerOffset + 'px' } : {}
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
      <div class="ha__tl-wrap">
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
            :class="[i % 2 === 0 ? 'ha__node--left' : 'ha__node--right', 'ha__node--wire']"
            :style="nodeStyle(i)"
          >
            <div class="ha__node__connector" />
            <div class="ha__node__dot" />
            <div class="ha__node__panel">
              <h3 class="ha__node__title">{{ card.title }}</h3>
              <p class="ha__node__body">{{ card.body }}</p>
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

const CARD_TOPS = [4, 24, 44, 64, 84];
const CARD_PROGRESS = [0.06, 0.22, 0.38, 0.54, 0.7];
const CARD_REVEAL_START = [0, 0.12, 0.24, 0.36, 0.48];
const CARD_REVEAL_END = [0.1, 0.22, 0.34, 0.46, 0.58];
function smoothstep01(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function revealAmount(p, i) {
  const s = CARD_REVEAL_START[i];
  const e = CARD_REVEAL_END[i];
  if (p <= s) return 0;
  if (p >= e) return 1;
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
    const tlInnerRef = ref(null);
    const iconRef = ref(null);
    const curvePathRef = ref(null);
    const cardRefs = ref([]);
    const cardLinePos = ref([]);
    const pathLen = ref(0);
    let stTrigger = null;

    const stickyHeight = computed(() => {
      const base = props.scrollerHeight > 0 ? `${props.scrollerHeight}px` : "100vh";
      if (props.headerOffset > 0 && !props.disableScrollAnim) {
        return `calc(${base} - ${props.headerOffset}px)`;
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

    const headerSectionStyle = computed(() =>
      props.headerOffset > 0 && !props.disableScrollAnim
        ? { paddingTop: `${props.headerOffset}px` }
        : undefined
    );

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
      if (!path || !icon || !pathLen.value) return;
      const pt = path.getPointAtLength(p * pathLen.value);
      icon.style.left = `${pt.x}%`;
      icon.style.top = `${(pt.y / 1000) * 100}%`;
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
          const p = self.progress;
          setIconOnCurve(p);
          icon.style.transform = `translate(-50%, -50%) rotate(${
            self.direction === -1 ? 180 : 0
          }deg)`;

          let nearestIdx = 0;
          let minDist = 1;
          CARD_PROGRESS.forEach((cp, i) => {
            const d = Math.abs(p - cp);
            if (d < minDist) {
              minDist = d;
              nearestIdx = i;
            }
          });

          cardRefs.value.forEach((el, i) => {
            if (!el) return;
            const raw = revealAmount(p, i);
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
        },
      });
      requestAnimationFrame(() => {
        updateCurveGeometry();
        setIconOnCurve(0);
        ScrollTrigger.refresh();
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
      tlInnerRef,
      iconRef,
      curvePathRef,
      cardLinePos,
      CARD_TOPS,
      setCardRef,
      nodeStyle,
      stickyHeight,
      sectionHeight,
      headerSectionStyle,
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
  background: #fff;
  box-sizing: border-box;
}

.ha__sticky {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.ha__head {
  flex: 0 0 auto;
  padding: 2.5rem 2rem 0.5rem;
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
}

.ha__tl-inner {
  position: relative;
  width: min(480px, 90vw);
  height: 88%;
  overflow: visible;
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
  width: 36px;
  height: 36px;
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  background: #fff;
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
  width: 20px;
  height: 20px;
  color: #000;
}

.ha__node {
  position: absolute;
  left: var(--nx, 50%);
  top: var(--nt, 50%);
  z-index: 1;
  opacity: 0;
  will-change: transform, opacity;
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

.ha__node--wire {
  color: #333;
}

.ha__node__connector {
  position: absolute;
  left: 50%;
  top: 50%;
  width: max(40px, 12vw);
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
  padding: 12px 16px;
  min-width: 150px;
  max-width: 200px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: none;
}

.ha__node--left .ha__node__panel {
  transform: translate(calc(-100% - max(32px, 12vw)), -50%);
}

.ha__node--right .ha__node__panel {
  transform: translate(max(32px, 12vw), -50%);
}

.ha__node__title {
  margin: 0 0 4px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #000;
}

.ha__node__body {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: #555;
}

@media (max-width: 600px) {
  .ha__node__connector {
    width: 28px;
  }

  .ha__node__panel {
    min-width: 110px;
    max-width: 140px;
    padding: 8px 10px;
  }

  .ha__node--left .ha__node__panel {
    transform: translate(calc(-100% - 20px), -50%);
  }

  .ha__node--right .ha__node__panel {
    transform: translate(20px, -50%);
  }
}
</style>
