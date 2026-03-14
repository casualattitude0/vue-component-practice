<template>
  <main class="roadmap-page">
    <section
      ref="sectionRef"
      class="roadmap-section"
    >
      <div class="roadmap-sticky">
        <div
          class="roadmap-road-wrap"
          ref="roadWrapRef"
        >
          <div class="roadmap-road-inner">
            <svg
              class="roadmap-svg"
              viewBox="0 0 400 1000"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <path
                  id="road-center"
                  ref="roadPathRef"
                  d="M 200 0 C 200 0 320 200 300 350 C 280 500 120 500 180 650 C 240 800 80 1000 200 1000"
                  fill="none"
                />
                <filter
                  id="road-shadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="4"
                    dy="2"
                    stdDeviation="3"
                    flood-color="#333"
                    flood-opacity="0.3"
                  />
                </filter>
              </defs>
              <g filter="url(#road-shadow)">
                <path
                  class="road-fill"
                  d="M 200 0 C 200 0 320 200 300 350 C 280 500 120 500 180 650 C 240 800 80 1000 200 1000"
                  fill="none"
                  stroke="#4a4a4a"
                  stroke-width="48"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  class="road-dash"
                  d="M 200 0 C 200 0 320 200 300 350 C 280 500 120 500 180 650 C 240 800 80 1000 200 1000"
                  fill="none"
                  stroke="#e8e8e8"
                  stroke-width="4"
                  stroke-dasharray="12 16"
                  stroke-linecap="round"
                />
              </g>
            </svg>
            <div
              ref="cardRef"
              class="roadmap-card"
              aria-hidden="true"
            >
              <svg
                class="roadmap-card-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect
                  x="2"
                  y="4"
                  width="20"
                  height="14"
                  rx="2"
                />
                <path d="M2 10h20" />
              </svg>
            </div>
            <div
              v-for="(m, i) in milestones"
              :key="m.year"
              :ref="el => setGoalRef(el, i)"
              class="roadmap-goal"
              :class="[`roadmap-goal--${m.side}`, `roadmap-goal--${m.color}`]"
              :style="goalStyle(i)"
            >
              <div class="roadmap-goal__connector" />
              <div class="roadmap-goal__dot" />
              <div class="roadmap-goal__panel">
                <div
                  class="roadmap-goal__icon"
                  v-html="m.iconSvg"
                />
                <span class="roadmap-goal__year">{{ m.year }}</span>
                <p class="roadmap-goal__text">{{ $t(`roadmap.goals.${m.year}`) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PATH_VIEWBOX = { w: 400, h: 1000 };

const milestones = [
  { year: 2024, color: "magenta", side: "right", pathT: 0.12 },
  { year: 2025, color: "red", side: "left", pathT: 0.35 },
  { year: 2026, color: "orange", side: "right", pathT: 0.58 },
  { year: 2027, color: "blue", side: "left", pathT: 0.82 },
];

const iconSvg = {
  2024: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L2 12l4 3 4-8 12 4-4 9-4-3z"/><path d="M6 15l-4 4"/></svg>',
  2025: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><circle cx="17" cy="17" r="4"/><path d="M10 14l7-7"/></svg>',
  2026: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  2027: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><path d="M12 8l-4 8h8l-4-8z"/></svg>',
};

const milestonesWithIcons = milestones.map((m) => ({
  ...m,
  iconSvg: iconSvg[m.year],
}));

export default {
  name: "RoadmapPage",
  setup() {
    const sectionRef = ref(null);
    const roadWrapRef = ref(null);
    const roadPathRef = ref(null);
    const cardRef = ref(null);
    const goalRefs = ref([]);
    const triggers = ref([]);

    function setGoalRef(el, i) {
      if (el) goalRefs.value[i] = el;
    }

    const goalPositions = ref([]);

    function goalStyle(i) {
      const pos = goalPositions.value[i];
      if (!pos) return {};
      return {
        "--goal-x": `${pos.x}%`,
        "--goal-y": `${pos.y}%`,
      };
    }

    onMounted(() => {
      const section = sectionRef.value;
      const pathEl = roadPathRef.value;
      const card = cardRef.value;
      if (!section || !pathEl || !card) return;

      const totalLen = pathEl.getTotalLength();
      goalPositions.value = milestonesWithIcons.map((m) => {
        const pt = pathEl.getPointAtLength(m.pathT * totalLen);
        return {
          x: (pt.x / PATH_VIEWBOX.w) * 100,
          y: (pt.y / PATH_VIEWBOX.h) * 100,
        };
      });

      let lastNearestIdx = -1;
      const stProgress = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const pt = pathEl.getPointAtLength(progress * totalLen);
          const xPct = (pt.x / PATH_VIEWBOX.w) * 100;
          const yPct = (pt.y / PATH_VIEWBOX.h) * 100;
          card.style.left = `${xPct}%`;
          card.style.top = `${yPct}%`;
          card.style.transform = "translate(-50%, -50%)";

          let nearestIdx = 0;
          let minDist = 1;
          milestonesWithIcons.forEach((m, i) => {
            const d = Math.abs(progress - m.pathT);
            if (d < minDist) {
              minDist = d;
              nearestIdx = i;
            }
          });
          if (nearestIdx !== lastNearestIdx) {
            lastNearestIdx = nearestIdx;
            goalRefs.value.forEach((el, i) => {
              if (el) gsap.to(el, { scale: i === nearestIdx ? 1.2 : 1, duration: 0.2, ease: "power2.out" });
            });
          }
        },
      });
      triggers.value.push(stProgress);
    });

    onUnmounted(() => {
      triggers.value.forEach((t) => t.kill());
      triggers.value = [];
    });

    return {
      sectionRef,
      roadWrapRef,
      roadPathRef,
      cardRef,
      goalPositions,
      milestones: milestonesWithIcons,
      setGoalRef,
      goalStyle,
    };
  },
};
</script>

<style scoped>
.roadmap-page {
  min-height: 100vh;
}

.roadmap-section {
  height: 500vh;
}

.roadmap-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
}

.roadmap-road-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.roadmap-road-inner {
  position: relative;
  height: 100%;
  width: auto;
  aspect-ratio: 400 / 1000;
  flex-shrink: 0;
  overflow: visible;
}

.roadmap-svg {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  inset: 0;
}

.road-fill {
  stroke: #4a4a4a;
}

.road-dash {
  stroke: #e8e8e8;
}

.roadmap-card {
  position: absolute;
  left: 50%;
  top: 2%;
  width: 44px;
  height: 44px;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
}

.roadmap-card-icon {
  width: 24px;
  height: 24px;
  color: #333;
}

.roadmap-goal {
  position: absolute;
  left: var(--goal-x, 50%);
  top: var(--goal-y, 50%);
  transform: translate(-50%, -50%);
  z-index: 1;
}

.roadmap-goal__dot {
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

.roadmap-goal__connector {
  position: absolute;
  left: 50%;
  top: 50%;
  width: max(40px, 14vw);
  height: 0;
  border-top: 2px dashed currentColor;
  transform-origin: center;
  pointer-events: none;
}

.roadmap-goal--left .roadmap-goal__connector {
  transform: translate(-100%, -50%);
}

.roadmap-goal--right .roadmap-goal__connector {
  transform: translate(0, -50%);
}

.roadmap-goal__panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  min-width: 160px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.roadmap-goal--left .roadmap-goal__panel {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(calc(-100% - max(32px, 14vw)), -50%);
}

.roadmap-goal--right .roadmap-goal__panel {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(max(32px, 14vw), -50%);
}

.roadmap-goal__icon {
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
}

.roadmap-goal__icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.roadmap-goal--magenta {
  color: #a03060;
}
.roadmap-goal--red {
  color: #c04040;
}
.roadmap-goal--orange {
  color: #d08020;
}
.roadmap-goal--blue {
  color: #3080c0;
}

.roadmap-goal__year {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.roadmap-goal__text {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.3;
  color: #555;
  text-align: center;
}
</style>
