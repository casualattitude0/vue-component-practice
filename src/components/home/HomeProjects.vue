<template>
  <section
    id="home-projects"
    ref="root"
    class="home-proj"
    aria-labelledby="home-proj-title"
  >
    <div
      ref="panel"
      class="home-proj__notebook"
    >
      <div
        class="home-proj__binding"
        :style="bindingBackgroundStyle"
        aria-hidden="true"
      />
      <div class="home-proj__paper">
        <header class="home-proj__header">
          <h2
            id="home-proj-title"
            class="home-proj__title"
          >
            {{ $t('home.projects.title') }}
          </h2>
        </header>

        <div
          ref="surfaceEl"
          class="home-proj__surface"
          :style="surfaceStyle"
          :aria-label="$t('home.projects.surfaceAria')"
        >
          <div
            v-for="item in items"
            :key="item.id"
            class="home-proj__float"
            :class="floatClass(item)"
            :data-pid="item.projectId"
            :style="floatStyle(item)"
            role="group"
            :aria-label="ariaForFloat(item)"
            tabindex="0"
            @pointerdown="onFloatPointerDown($event, item)"
          >
            <div
              v-if="item.type === 'visual'"
              class="home-proj__visual"
              aria-hidden="true"
            />
            <div
              v-else
              class="home-proj__caption-inner"
            >
              <p class="home-proj__caption-text">
                {{ captionFor(item) }}
              </p>
              <div
                v-if="!reducedMotion"
                class="home-proj__scratch-mount"
                :ref="(el) => setScratchMount(item.projectId, el)"
                aria-hidden="true"
                @pointerdown.stop
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScratchCard, SCRATCH_TYPE } from "scratchcard-js";
import bookHeaderUrl from "@/assets/test/bookheader.png";
import { HOME_PROJECT_NOTEBOOK_ITEMS } from "@/data/home/projects";
import { prefersReducedMotion } from "../../utils/lenisGsap";

gsap.registerPlugin(ScrollTrigger);

const SCRATCH_OVERLAY_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3a3a3a"/><stop offset="100%" stop-color="#141414"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>'
)}`;

const SCRATCH_REVEAL_PERCENT = 50;

/** Line stroke width for scratchcard-js `LINE` mode (`clearZoneRadius`). */
const SCRATCH_PEN_MIN_PX = 14;
const SCRATCH_PEN_SIZE_FACTOR = 0.4;

export default {
  name: "HomeProjects",
  data() {
    return {
      items: HOME_PROJECT_NOTEBOOK_ITEMS.map((row) => ({ ...row })),
      reducedMotion: false,
      scratchMounts: {},
      scratchInitTimer: null,
      surfaceW: 0,
      enterTween: null,
      draggingId: null,
      dragPointerId: null,
      dragEl: null,
      dragStart: { x: 0, y: 0, itemX: 0, itemY: 0 },
      resizeObserver: null,
    };
  },
  computed: {
    bindingBackgroundStyle() {
      return { backgroundImage: `url(${bookHeaderUrl})` };
    },
    // Scale factor: design canvas is 660px wide; clamp so items never get too tiny
    surfaceScale() {
      if (!this.surfaceW) return 1;
      return Math.min(1, Math.max(0.32, this.surfaceW / 660));
    },
    surfaceStyle() {
      const s = this.surfaceScale;
      return { minHeight: `max(${Math.round(520 * s)}px, 32vh)` };
    },
  },
  created() {
    if (typeof window !== "undefined") {
      this.reducedMotion = prefersReducedMotion();
    }
  },
  mounted() {
    const panel = this.$refs.panel;
    const root = this.$refs.root;
    if (!prefersReducedMotion()) {
      this.enterTween = gsap.fromTo(
        panel,
        { x: 96, opacity: 0.2, rotateY: -10 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            end: "top 32%",
            scrub: 0.65,
          },
        }
      );
    }
    this.$nextTick(() => {
      this.observeSurface();
      this.scheduleScratchInit();
    });
    window.addEventListener("pointermove", this.onWindowPointerMove);
    window.addEventListener("pointerup", this.onWindowPointerUp);
    window.addEventListener("pointercancel", this.onWindowPointerUp);
  },
  beforeUnmount() {
    if (this.enterTween) {
      this.enterTween.kill();
      this.enterTween = null;
    }
    window.removeEventListener("pointermove", this.onWindowPointerMove);
    window.removeEventListener("pointerup", this.onWindowPointerUp);
    window.removeEventListener("pointercancel", this.onWindowPointerUp);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    clearTimeout(this.scratchInitTimer);
    this.scratchInitTimer = null;
    this.destroyScratchCards();
  },
  methods: {
    floatClass(item) {
      return {
        "home-proj__float--visual": item.type === "visual",
        "home-proj__float--caption": item.type === "caption",
        "home-proj__float--dragging": this.draggingId === item.id,
      };
    },
    captionFor(item) {
      if (item.type !== "caption") return "";
      return this.$t(`home.projects.captions.${item.projectId}`);
    },
    ariaForFloat(item) {
      if (item.type === "caption") return this.captionFor(item);
      return this.$t("home.projects.visualAria");
    },
    setScratchMount(projectId, el) {
      if (!projectId) return;
      if (el) {
        this.scratchMounts[projectId] = el;
      } else {
        delete this.scratchMounts[projectId];
      }
    },
    scheduleScratchInit() {
      if (this.reducedMotion) return;
      clearTimeout(this.scratchInitTimer);
      this.scratchInitTimer = setTimeout(() => {
        this.scratchInitTimer = null;
        this.initScratchCards();
      }, 90);
    },
    destroyScratchCards() {
      for (const id of ["gingerbread", "visual", "flow"]) {
        const el = this.scratchMounts[id];
        if (el) el.innerHTML = "";
      }
    },
    initScratchCards() {
      if (this.reducedMotion) return;
      this.destroyScratchCards();
      const ids = ["gingerbread", "visual", "flow"];
      for (const pid of ids) {
        const el = this.scratchMounts[pid];
        if (!el) continue;
        const w = Math.max(0, Math.floor(el.offsetWidth));
        const h = Math.max(0, Math.floor(el.offsetHeight));
        if (w < 12 || h < 12) continue;
        const radius = Math.max(
          SCRATCH_PEN_MIN_PX,
          Math.round(Math.min(w, h) * SCRATCH_PEN_SIZE_FACTOR)
        );
        const sc = new ScratchCard(el, {
          scratchType: SCRATCH_TYPE.LINE,
          containerWidth: w,
          containerHeight: h,
          imageForwardSrc: SCRATCH_OVERLAY_SRC,
          htmlBackground: '<div class="home-proj__sc-placeholder"></div>',
          imageBackgroundSrc: "",
          clearZoneRadius: radius,
          percentToFinish: SCRATCH_REVEAL_PERCENT,
          callback: () => {},
          enabledPercentUpdate: true,
        });
        const autoCompleteScratch = () => {
          requestAnimationFrame(() => {
            if (sc.callbackDone) return;
            if (sc.getPercent() < SCRATCH_REVEAL_PERCENT) return;
            sc.percent = SCRATCH_REVEAL_PERCENT + 1;
            sc.finish();
          });
        };
        sc.init()
          .then(() => {
            sc.canvas.addEventListener("scratch.move", autoCompleteScratch);
          })
          .catch(() => {});
      }
    },
    observeSurface() {
      const el = this.$refs.surfaceEl;
      if (!el || typeof ResizeObserver === "undefined") return;
      this.resizeObserver = new ResizeObserver(() => this.syncSurfaceSize());
      this.resizeObserver.observe(el);
      this.syncSurfaceSize();
    },
    syncSurfaceSize() {
      const el = this.$refs.surfaceEl;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      this.surfaceW = w;
      // Clamp in design-space coords so positions survive scale changes
      const scale = Math.min(1, Math.max(0.32, w / 660));
      for (const item of this.items) {
        const designW = w / scale;
        const designH = h / scale;
        const maxX = Math.max(0, designW - item.w);
        const maxY = Math.max(0, designH - item.h);
        item.x = Math.max(0, Math.min(maxX, item.x));
        item.y = Math.max(0, Math.min(maxY, item.y));
      }
      this.$nextTick(() => this.scheduleScratchInit());
    },
    floatStyle(item) {
      const s = this.surfaceScale;
      return {
        transform: `translate(${item.x * s}px, ${item.y * s}px)`,
        width: `${item.w * s}px`,
        height: `${item.h * s}px`,
      };
    },
    onFloatPointerDown(e, item) {
      if (e.button !== 0) return;
      e.preventDefault();
      const el = e.currentTarget;
      if (el.setPointerCapture) el.setPointerCapture(e.pointerId);
      this.dragEl = el;
      this.draggingId = item.id;
      this.dragPointerId = e.pointerId;
      this.dragStart = {
        x: e.clientX,
        y: e.clientY,
        itemX: item.x,
        itemY: item.y,
      };
    },
    onWindowPointerMove(e) {
      if (!this.draggingId || e.pointerId !== this.dragPointerId) return;
      const item = this.items.find((x) => x.id === this.draggingId);
      if (!item) return;
      const surface = this.$refs.surfaceEl;
      if (!surface) return;
      // Convert screen-px delta to design-space coords by dividing by scale
      const s = this.surfaceScale;
      const dx = (e.clientX - this.dragStart.x) / s;
      const dy = (e.clientY - this.dragStart.y) / s;
      const nx = this.dragStart.itemX + dx;
      const ny = this.dragStart.itemY + dy;
      const designW = surface.clientWidth / s;
      const designH = surface.clientHeight / s;
      const maxX = Math.max(0, designW - item.w);
      const maxY = Math.max(0, designH - item.h);
      item.x = Math.max(0, Math.min(maxX, nx));
      item.y = Math.max(0, Math.min(maxY, ny));
    },
    onWindowPointerUp(e) {
      if (!this.draggingId || e.pointerId !== this.dragPointerId) return;
      const el = this.dragEl;
      if (el && el.releasePointerCapture) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch (_) {
          /* ignore */
        }
      }
      this.dragEl = null;
      this.draggingId = null;
      this.dragPointerId = null;
    },
  },
};
</script>

<style scoped>
.home-proj {
  position: relative;
  padding: 3rem max(1rem, env(safe-area-inset-left)) 4rem
    max(1rem, env(safe-area-inset-right));
  background: #f5f5f5;
  perspective: 900px;
}

.home-proj__notebook {
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  will-change: transform, opacity;
  transform-style: preserve-3d;
}

.home-proj__binding {
  width: 100%;
  height: clamp(2rem, 5vw, 3.75rem);
  margin: 0;
  padding: 0;
  background-repeat: repeat-x;
  background-position: left bottom;
  background-size: auto 100%;
  flex-shrink: 0;
}

.home-proj__paper {
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
}

.home-proj__header {
  max-width: 42rem;
  margin: 0 auto 1rem;
  text-align: center;
}

.home-proj__title {
  margin: 0;
  font-size: clamp(1.35rem, 2.8vw, 1.85rem);
  font-weight: 800;
  color: #1a1a1a;
}

.home-proj__surface {
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  max-width: min(72rem, 100%);
  margin: 0 auto;
  border-radius: 0.75rem;
  background-image: linear-gradient(rgba(44, 62, 80, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(44, 62, 80, 0.04) 1px, transparent 1px);
  background-size: 100% 1.5rem, 1.5rem 100%;
  background-position: 0 0, 0 0;
  box-shadow: inset 0 0 0 1px rgba(44, 62, 80, 0.1),
    0 8px 28px rgba(44, 62, 80, 0.08);
  overflow: hidden;
  touch-action: none;
}

.home-proj__float {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0.4rem;
  box-shadow: 0 6px 20px rgba(44, 62, 80, 0.16);
  cursor: grab;
  touch-action: none;
  user-select: none;
  outline: none;
}

.home-proj__float--visual {
  z-index: 1;
  transition: box-shadow 0.32s cubic-bezier(0.34, 1.2, 0.64, 1),
    filter 0.28s ease;
}

.home-proj__float--caption {
  z-index: 2;
  box-shadow: 0 4px 14px rgba(44, 62, 80, 0.1);
  background: rgba(255, 252, 246, 0.55);
  border: 1px solid rgba(44, 62, 80, 0.1);
  transition: box-shadow 0.28s ease, filter 0.28s ease;
}

.home-proj__float:focus-visible {
  box-shadow: 0 6px 20px rgba(44, 62, 80, 0.16),
    0 0 0 3px rgba(44, 62, 80, 0.35);
}

.home-proj__float--visual:not(.home-proj__float--dragging):hover,
.home-proj__float--visual:not(.home-proj__float--dragging):focus-within {
  z-index: 4;
  box-shadow: 0 14px 36px rgba(44, 62, 80, 0.22),
    0 0 0 1px rgba(255, 255, 255, 0.35) inset;
  filter: brightness(1.04);
}

.home-proj__float--caption:not(.home-proj__float--dragging):hover,
.home-proj__float--caption:not(.home-proj__float--dragging):focus-within {
  z-index: 5;
  box-shadow: 0 8px 22px rgba(44, 62, 80, 0.14);
  filter: brightness(1.02);
}

.home-proj__float--dragging {
  z-index: 12;
  cursor: grabbing;
}

.home-proj__float--visual.home-proj__float--dragging {
  box-shadow: 0 22px 48px rgba(44, 62, 80, 0.32),
    0 0 0 2px rgba(255, 255, 255, 0.45) inset;
  filter: brightness(1.08) saturate(1.08);
}

.home-proj__float--caption.home-proj__float--dragging {
  box-shadow: 0 14px 32px rgba(44, 62, 80, 0.2);
  filter: brightness(1.03);
}

.home-proj__visual {
  width: 100%;
  height: 100%;
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
  box-shadow: none;
}

.home-proj__caption-inner {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0.5rem 0.55rem;
  overflow: hidden;
  border-radius: 0.35rem;
}

.home-proj__caption-text {
  position: relative;
  z-index: 0;
  margin: 0;
  font-family: "Segoe Print", "Bradley Hand", "Apple Chancery", cursive;
  font-size: clamp(0.58rem, 1.6vw, 0.84rem);
  line-height: 1.35;
  letter-spacing: 0.02em;
  color: rgba(44, 62, 80, 0.82);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
}

.home-proj__scratch-mount {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
}

.home-proj__scratch-mount :deep(.sc__canvas) {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}
</style>
