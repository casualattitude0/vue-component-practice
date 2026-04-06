<template>
  <section
    id="home-projects"
    ref="root"
    class="home-proj fade-in-section"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="home-proj-title"
  >
    <div
      v-if="caseStudy.show"
      class="home-proj__case"
    >
      <h3
        v-if="caseStudy.titleHighlight || caseStudy.titleBefore || caseStudy.titleAfter"
        class="home-proj__case-title"
      >
        <span class="home-proj__case-title-pre">{{ caseStudy.titleBefore }}</span>
        <span
          class="home-proj__case-brand-wrap"
          :class="{ 'home-proj__case-brand-wrap--active': caseFloatOpen && !reducedMotion }"
          @mouseenter="onCaseBrandEnter"
          @mouseleave="onCaseBrandLeave"
        >
          <span class="home-proj__case-brand">{{ caseStudy.titleHighlight }}</span>
          <span
            v-if="caseStudy.hoverPreviewImage && !reducedMotion"
            class="home-proj__case-hover-bridge"
            aria-hidden="true"
          />
          <span
            v-if="caseStudy.hoverPreviewImage && !reducedMotion"
            class="home-proj__case-float"
            :class="{ 'home-proj__case-float--open': caseFloatOpen }"
          >
            <a
              v-if="caseStudy.hoverSiteUrl"
              class="home-proj__case-float-link"
              :href="caseStudy.hoverSiteUrl"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="caseStudy.previewLinkLabel || 'Open official site'"
            >
              <img
                class="home-proj__case-float-img"
                :src="caseStudy.hoverPreviewImage"
                alt=""
                width="360"
                height="191"
                loading="lazy"
                decoding="async"
              >
            </a>
            <img
              v-else
              class="home-proj__case-float-img"
              :src="caseStudy.hoverPreviewImage"
              alt=""
              width="360"
              height="191"
              loading="lazy"
              decoding="async"
            >
          </span>
        </span>
        <span class="home-proj__case-title-post">{{ caseStudy.titleAfter }}</span>
      </h3>
      <p class="home-proj__case-summary">
        {{ caseStudy.summary }}
      </p>
      <a
        v-if="showCaseStudyLink"
        class="home-proj__case-link"
        :href="caseStudy.linkHref"
        rel="noopener noreferrer"
        target="_blank"
      >
        {{ caseStudy.linkLabel }}
      </a>
    </div>
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
            :data-item-id="item.id"
            :style="floatStyle(item)"
            :title="titleFor(item)"
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
import bookHeaderUrl from "@/assets/images/bookheader.png";
import { HOME_PROJECT_NOTEBOOK_ITEMS } from "@/data/home/projects";
import { prefersReducedMotion } from "../../utils/lenisGsap";
import { triggerParticleBurst } from "../../composables/useClickParticles.js";

gsap.registerPlugin(ScrollTrigger);

const SCRATCH_OVERLAY_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
  <defs>
    <linearGradient id='ink' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#1f1f1f'/>
      <stop offset='55%' stop-color='#050505'/>
      <stop offset='100%' stop-color='#151515'/>
    </linearGradient>
    <filter id='roughen' x='-14%' y='-14%' width='128%' height='128%'>
      <feTurbulence
        type='fractalNoise'
        baseFrequency='0.018 0.16'
        numOctaves='2'
        seed='7'
        result='noise'
      />
      <feDisplacementMap
        in='SourceGraphic'
        in2='noise'
        scale='12'
        xChannelSelector='R'
        yChannelSelector='G'
      />
    </filter>
    <filter id='grain' x='-20%' y='-20%' width='140%' height='140%'>
      <feTurbulence
        type='fractalNoise'
        baseFrequency='0.82'
        numOctaves='2'
        seed='5'
        result='noise'
      />
      <feColorMatrix
        in='noise'
        type='matrix'
        values='1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.42 0'
      />
    </filter>
    <mask id='brush-mask' maskUnits='userSpaceOnUse' x='0' y='0' width='512' height='512'>
      <rect width='512' height='512' fill='black' />
      <g filter='url(#roughen)' fill='white'>
        <path d='M-18 20L422 14L460 18L488 28L474 42L502 56L480 70L508 84L482 96L430 104L8 104L2 90L10 72L-4 54L2 36Z' />
        <path d='M18 94L442 88L482 92L516 104L494 118L526 132L498 148L522 162L494 176L448 184L30 184L24 170L34 152L18 136L28 114Z' />
        <path d='M-26 182L436 176L476 182L520 196L492 212L532 226L496 244L522 260L490 276L438 286L-4 284L4 266L14 244L-12 222L-2 198Z' />
        <path d='M10 280L450 274L488 280L526 294L502 308L534 322L500 338L526 354L496 370L448 380L18 378L12 362L24 340L8 322L16 298Z' />
        <path d='M-10 380L438 374L478 380L510 392L492 406L516 420L490 436L506 452L484 468L438 478L6 476L0 460L12 440L-6 418L0 396Z' />
      </g>
    </mask>
  </defs>
  <rect width='512' height='512' fill='url(#ink)' mask='url(#brush-mask)' />
  <g
    mask='url(#brush-mask)'
    opacity='0.1'
    stroke='#2a2a2a'
    stroke-width='16'
    stroke-linecap='round'
  >
    <path d='M16 78c114-12 228-4 342-2 54 1 102-8 152-2' />
    <path d='M24 156c100-8 202 4 304 6 64 1 124-8 182-4' />
    <path d='M10 244c124-10 250 8 376 4 44-2 86-6 126-2' />
    <path d='M18 336c120-6 242 8 364 8 40 0 80-4 122-2' />
    <path d='M12 428c130-10 262 6 394 8 34 1 68-2 104-2' />
  </g>
  <g mask='url(#brush-mask)' opacity='0.1' filter='url(#grain)'>
    <rect width='512' height='512' fill='#fff' />
  </g>
</svg>
`)}`;

const SCRATCH_REVEAL_PERCENT = 55;

/** Line stroke width for scratchcard-js `LINE` mode (`clearZoneRadius`). */
const SCRATCH_PEN_MIN_PX = 14;
const SCRATCH_PEN_SIZE_FACTOR = 0.4;

/** Tailwind-aligned md — two-column notebook vs single column */
const MD_MIN_PX = 768;

export default {
  name: "HomeProjects",
  props: {
    disableScrollAnim: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: HOME_PROJECT_NOTEBOOK_ITEMS.map((row) => ({ ...row })),
      reducedMotion: false,
      scratchMounts: {},
      scratchInitTimer: null,
      surfaceW: 0,
      surfaceH: 0,
      enterTween: null,
      draggingId: null,
      dragPointerId: null,
      dragEl: null,
      dragStart: { x: 0, y: 0, itemX: 0, itemY: 0 },
      resizeObserver: null,
      isMdUp: false,
      surfaceContentMinPx: 0,
      isVisible: false,
      observer: null,
      scratchSurfaceReady: false,
      scratchSurfaceObserver: null,
      scratchRevealed: {},
      caseFloatOpen: false,
      caseFloatLeaveTimer: null,
    };
  },
  computed: {
    bindingBackgroundStyle() {
      return { backgroundImage: `url(${bookHeaderUrl})` };
    },
    // Design ref 660px wide; SM uses a higher floor so visuals stay legible
    surfaceScale() {
      if (!this.surfaceW) return 1;
      const w = this.surfaceW;
      if (this.isMdUp) {
        return Math.min(1, Math.max(0.42, w / 660));
      }
      return Math.min(1, Math.max(0.52, w / 360));
    },
    surfaceStyle() {
      const s = this.surfaceScale;
      const floorPx = Math.max(8, Math.round(160 * s));
      const contentPx =
        this.surfaceContentMinPx > 0
          ? this.surfaceContentMinPx
          : Math.round(520 * s);
      return { minHeight: `${Math.max(floorPx, contentPx)}px` };
    },
    caseStudy() {
      const cs = this.$tm("home.projects.caseStudy");
      if (!cs || typeof cs !== "object") {
        return {
          show: false,
          titleBefore: "",
          titleHighlight: "",
          titleAfter: "",
          hoverPreviewImage: "",
          hoverSiteUrl: "",
          previewLinkLabel: "",
          summary: "",
          linkHref: "",
          linkLabel: "",
        };
      }
      const titleBefore = cs.titleBefore ?? "";
      const titleHighlight = cs.titleHighlight ?? "";
      const titleAfter = cs.titleAfter ?? "";
      const legacyTitle = cs.title ?? "";
      const summary = cs.summary || "";
      const show = Boolean(
        summary || titleHighlight || titleBefore || titleAfter || legacyTitle
      );
      return {
        show,
        titleBefore,
        titleHighlight: titleHighlight || legacyTitle,
        titleAfter,
        hoverPreviewImage: cs.hoverPreviewImage || "",
        hoverSiteUrl: cs.hoverSiteUrl || "",
        previewLinkLabel: cs.previewLinkLabel || "",
        summary,
        linkHref: cs.linkHref || "",
        linkLabel: cs.linkLabel || "",
      };
    },
    showCaseStudyLink() {
      return (
        typeof this.caseStudy.linkHref === "string" &&
        this.caseStudy.linkHref.trim().length > 0
      );
    },
  },
  created() {
    if (typeof window !== "undefined") {
      this.reducedMotion = prefersReducedMotion();
    }
    this._surfaceSnap = { w: -1, h: -1 };
    this._resizeRaf = null;
    this._baseCaptionHeights = {};
    for (const row of HOME_PROJECT_NOTEBOOK_ITEMS) {
      if (row.type === "caption") this._baseCaptionHeights[row.id] = row.h;
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
          }
        }
      },
      { rootMargin: "0px 0px -20px 0px" }
    );
    if (this.$refs.root) {
      this.observer.observe(this.$refs.root);
    }

    const panel = this.$refs.panel;
    const root = this.$refs.root;
    if (!prefersReducedMotion() && !this.disableScrollAnim) {
      let scroller = window;
      let node = root?.parentElement;
      while (node && node !== document.documentElement) {
        const oy = window.getComputedStyle(node).overflowY;
        if (oy === "auto" || oy === "scroll") {
          scroller = node;
          break;
        }
        node = node.parentElement;
      }
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
            scroller,
            start: "top 88%",
            end: "top 32%",
            scrub: 0.65,
          },
        }
      );
    }
    this._mqMd = window.matchMedia(`(min-width: ${MD_MIN_PX}px)`);
    this.isMdUp = this._mqMd.matches;
    this._onMqMd = () => {
      this.isMdUp = this._mqMd.matches;
      this.$nextTick(() => this.syncSurfaceSize());
    };
    this._mqMd.addEventListener("change", this._onMqMd);
    this.$nextTick(() => {
      this.observeSurface();
      this.setupScratchSurfaceObserver();
    });
    window.addEventListener("pointermove", this.onWindowPointerMove);
    window.addEventListener("pointerup", this.onWindowPointerUp);
    window.addEventListener("pointercancel", this.onWindowPointerUp);
  },
  beforeUnmount() {
    if (this.caseFloatLeaveTimer) {
      clearTimeout(this.caseFloatLeaveTimer);
      this.caseFloatLeaveTimer = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.enterTween) {
      this.enterTween.kill();
      this.enterTween = null;
    }
    if (this._mqMd && this._onMqMd) {
      this._mqMd.removeEventListener("change", this._onMqMd);
    }
    window.removeEventListener("pointermove", this.onWindowPointerMove);
    window.removeEventListener("pointerup", this.onWindowPointerUp);
    window.removeEventListener("pointercancel", this.onWindowPointerUp);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this._resizeRaf) {
      cancelAnimationFrame(this._resizeRaf);
      this._resizeRaf = null;
    }
    clearTimeout(this.scratchInitTimer);
    this.scratchInitTimer = null;
    this.destroyScratchCards();
    if (this.scratchSurfaceObserver) {
      this.scratchSurfaceObserver.disconnect();
      this.scratchSurfaceObserver = null;
    }
  },
  methods: {
    onCaseBrandEnter() {
      if (this.caseFloatLeaveTimer) {
        clearTimeout(this.caseFloatLeaveTimer);
        this.caseFloatLeaveTimer = null;
      }
      if (!this.reducedMotion && this.caseStudy.hoverPreviewImage) {
        this.caseFloatOpen = true;
      }
    },
    onCaseBrandLeave() {
      this.caseFloatLeaveTimer = setTimeout(() => {
        this.caseFloatOpen = false;
        this.caseFloatLeaveTimer = null;
      }, 280);
    },
    setupScratchSurfaceObserver() {
      if (this.reducedMotion) {
        this.scratchSurfaceReady = true;
        return;
      }
      const el = this.$refs.surfaceEl;
      if (!el || typeof IntersectionObserver === "undefined") {
        this.scratchSurfaceReady = true;
        this.scheduleScratchInit();
        return;
      }
      this.scratchSurfaceObserver = new IntersectionObserver(
        (entries) => {
          const hit = entries.some(
            (e) => e.isIntersecting && e.intersectionRatio >= 0.12
          );
          if (!hit) return;
          this.scratchSurfaceReady = true;
          if (this.scratchSurfaceObserver) {
            this.scratchSurfaceObserver.disconnect();
            this.scratchSurfaceObserver = null;
          }
          this.scheduleScratchInit();
        },
        { threshold: [0, 0.12, 0.25, 0.5] }
      );
      this.scratchSurfaceObserver.observe(el);
    },
    floatClass(item) {
      return {
        "home-proj__float--visual": item.type === "visual",
        "home-proj__float--caption": item.type === "caption",
        "home-proj__float--dragging": this.draggingId === item.id,
        "home-proj__float--scratch-done":
          item.type === "caption" && this.scratchRevealed[item.projectId],
      };
    },
    titleFor(item) {
      if (item.type === "caption") return this.captionFor(item);
      const key = `home.projects.titles.${item.projectId}`;
      return this.$te(key) ? this.$t(key) : this.ariaForFloat(item);
    },
    onScratchComplete(projectId, mountEl) {
      if (mountEl && typeof mountEl.getBoundingClientRect === "function") {
        const r = mountEl.getBoundingClientRect();
        triggerParticleBurst(r.left + r.width / 2, r.top + r.height / 2);
      }
      this.scratchRevealed = { ...this.scratchRevealed, [projectId]: true };
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
      if (!this.scratchSurfaceReady) return;
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
          callback: () => {
            this.onScratchComplete(pid, el);
          },
          enabledPercentUpdate: true,
        });
        sc.init().catch(() => {});
      }
    },
    observeSurface() {
      const el = this.$refs.surfaceEl;
      if (!el || typeof ResizeObserver === "undefined") return;
      this.resizeObserver = new ResizeObserver(() => {
        if (this._resizeRaf) cancelAnimationFrame(this._resizeRaf);
        this._resizeRaf = requestAnimationFrame(() => {
          this._resizeRaf = null;
          this.syncSurfaceSize();
        });
      });
      this.resizeObserver.observe(el);
      this.syncSurfaceSize();
    },
    syncSurfaceSize() {
      const el = this.$refs.surfaceEl;
      if (!el) return;
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      const snap = this._surfaceSnap;
      if (snap && snap.w === w && snap.h === h) return;
      if (snap) {
        snap.w = w;
        snap.h = h;
      }
      this.surfaceW = w;
      this.surfaceH = h;
      const scale = this.isMdUp
        ? Math.min(1, Math.max(0.42, w / 660))
        : Math.min(1, Math.max(0.52, w / 360));
      const designW = w / scale;
      let designH = Math.max(h / scale, 520);
      const M = 16;
      const G = 20;

      const byId = (id) => this.items.find((x) => x.id === id);
      const gbV = byId("hp-gb-v");
      const vsV = byId("hp-vs-v");
      const flV = byId("hp-fl-v");
      const gbC = byId("hp-gb-c");
      const vsC = byId("hp-vs-c");
      const flC = byId("hp-fl-c");

      const centerIn = (colLeft, colW, itemW) =>
        colLeft + Math.max(0, (colW - itemW) / 2);

      if (gbV && vsV && flV && this.isMdUp) {
        const inner = designW - 2 * M;
        const colGap = G;
        const colW = Math.max(120, (inner - colGap) / 2);
        const colRight = M + colW + colGap;

        gbV.x = centerIn(M, colW, gbV.w);
        gbV.y = M;

        if (gbC) {
          gbC.x = centerIn(M, colW, gbC.w);
          gbC.y = gbV.y + gbV.h + G;
        }

        vsV.x = centerIn(colRight, colW, vsV.w);
        vsV.y = M;

        if (vsC) {
          vsC.x = centerIn(colRight, colW, vsC.w);
          vsC.y = vsV.y + vsV.h + G;
        }

        const leftStackBottom = gbC ? gbC.y + gbC.h : gbV.y + gbV.h;
        const rightStackBottom = vsC ? vsC.y + vsC.h : vsV.y + vsV.h;
        const rowGap = G * 2;
        const flY = Math.max(leftStackBottom, rightStackBottom) + rowGap;

        flV.x = centerIn(M, colW, flV.w);
        flV.y = flY;

        if (flC) {
          flC.x = centerIn(M, colW, flC.w);
          flC.y = flV.y + flV.h + G;
        }
      } else if (gbV && vsV && flV) {
        const inner = designW - 2 * M;
        let y = M;

        gbV.x = centerIn(M, inner, gbV.w);
        gbV.y = y;
        y = gbV.y + gbV.h + G;

        if (gbC) {
          gbC.x = centerIn(M, inner, gbC.w);
          gbC.y = y;
          y = gbC.y + gbC.h + G;
        }

        vsV.x = centerIn(M, inner, vsV.w);
        vsV.y = y;
        y = vsV.y + vsV.h + G;

        if (vsC) {
          vsC.x = centerIn(M, inner, vsC.w);
          vsC.y = y;
          y = vsC.y + vsC.h + G;
        }

        flV.x = centerIn(M, inner, flV.w);
        flV.y = y;
        y = flV.y + flV.h + G;

        if (flC) {
          flC.x = centerIn(M, inner, flC.w);
          flC.y = y;
        }
      }

      let maxBottom = 0;
      for (const item of this.items) {
        maxBottom = Math.max(maxBottom, item.y + item.h);
      }
      designH = Math.max(designH, maxBottom + M);

      for (const item of this.items) {
        const maxX = Math.max(0, designW - item.w);
        const maxY = Math.max(0, designH - item.h);
        item.x = Math.max(0, Math.min(maxX, item.x));
        item.y = Math.max(0, Math.min(maxY, item.y));
      }

      let maxBottomAfter = 0;
      for (const item of this.items) {
        maxBottomAfter = Math.max(maxBottomAfter, item.y + item.h);
      }
      this.surfaceContentMinPx = Math.ceil((maxBottomAfter + M) * scale);
      this.$nextTick(() => {
        const relayout = this._syncCaptionHeightsFromDom(scale);
        if (relayout) {
          if (snap) {
            snap.w = -1;
            snap.h = -1;
          }
          this.$nextTick(() => this.syncSurfaceSize());
          return;
        }
        this.scheduleScratchInit();
      });
    },
    _syncCaptionHeightsFromDom(scale) {
      const surface = this.$refs.surfaceEl;
      if (!surface) return false;
      let changed = false;
      for (const item of this.items) {
        if (item.type !== "caption") continue;
        const base = this._baseCaptionHeights[item.id] ?? item.h;
        const el = surface.querySelector(`[data-item-id="${item.id}"]`);
        if (!el) continue;
        const hPx = el.offsetHeight;
        const hDesign = Math.max(base, Math.ceil(hPx / scale));
        if (hDesign !== item.h) {
          item.h = hDesign;
          changed = true;
        }
      }
      return changed;
    },
    floatStyle(item) {
      const s = this.surfaceScale;
      const base = {
        transform: `translate(${item.x * s}px, ${item.y * s}px)`,
        width: `${item.w * s}px`,
      };
      if (item.type === "caption") {
        return {
          ...base,
          minHeight: `${item.h * s}px`,
          height: "auto",
        };
      }
      return {
        ...base,
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
.fade-in-section {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  will-change: opacity, transform;
}

.fade-in-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-section {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

.home-proj {
  position: relative;
  padding: 3rem max(1rem, env(safe-area-inset-left)) 4rem
    max(1rem, env(safe-area-inset-right));
  background: transparent;
  perspective: 900px;
  min-height: 100dvh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-proj__case {
  position: relative;
  z-index: 1;
  max-width: 42rem;
  width: 100%;
  margin: 0 auto 1.25rem;
  padding: 1rem 1.15rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: visible;
}

.home-proj__case-title {
  margin: 0 0 0.45rem;
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-weight: 800;
  color: #111;
  line-height: 1.35;
}

.home-proj__case-brand-wrap {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.home-proj__case-brand {
  display: inline-block;
  color: #b45309;
  font-weight: 900;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  text-decoration-color: rgba(180, 83, 9, 0.55);
  transition: transform 0.28s cubic-bezier(0.34, 1.3, 0.64, 1),
    color 0.22s ease, text-decoration-color 0.22s ease,
    text-underline-offset 0.22s ease;
  transform-origin: center bottom;
}

.home-proj__case-brand-wrap:hover .home-proj__case-brand {
  transform: translateY(-2px) scale(1.03);
  color: #9a3412;
  text-decoration-thickness: 2.5px;
  text-underline-offset: 5px;
  text-decoration-color: rgba(154, 52, 18, 0.9);
}

.home-proj__case-brand-wrap--active .home-proj__case-brand {
  animation: home-proj-case-brand-pulse 2.2s ease-in-out infinite;
}

@keyframes home-proj-case-brand-pulse {
  0%,
  100% {
    text-decoration-color: rgba(180, 83, 9, 0.55);
    filter: brightness(1);
  }
  50% {
    text-decoration-color: rgba(234, 88, 12, 0.95);
    filter: brightness(1.07);
  }
}

/* Invisible hit target between label and preview so pointer does not leave the wrap */
.home-proj__case-hover-bridge {
  position: absolute;
  left: 50%;
  top: calc(100% - 2px);
  z-index: 12;
  width: min(360px, 92vw);
  height: 220px;
  transform: translateX(-50%);
  pointer-events: auto;
}

.home-proj__case-float {
  position: absolute;
  left: 50%;
  top: calc(100% + 6px);
  z-index: 20;
  width: min(360px, 92vw);
  transform: translateX(-50%);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.18);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.22s ease, visibility 0.22s ease;
  background: #1a1a1a;
}

.home-proj__case-float--open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.home-proj__case-float-link {
  display: block;
  line-height: 0;
  outline: none;
}

.home-proj__case-float-link:focus-visible {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85);
}

.home-proj__case-float-img {
  display: block;
  width: 100%;
  height: auto;
}

@media (prefers-reduced-motion: reduce) {
  .home-proj__case-float,
  .home-proj__case-hover-bridge {
    display: none;
  }

  .home-proj__case-brand {
    transition: none;
  }

  .home-proj__case-brand-wrap:hover .home-proj__case-brand {
    transform: none;
  }

  .home-proj__case-brand-wrap--active .home-proj__case-brand {
    animation: none;
  }
}

.home-proj__case-summary {
  margin: 0 0 0.65rem;
  font-size: clamp(0.82rem, 1.5vw, 0.92rem);
  line-height: 1.5;
  color: #444;
}

.home-proj__case-link {
  font-size: 0.82rem;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.home-proj__case-link:hover {
  border-bottom-color: #000;
}

.home-proj__notebook {
  max-width: 72rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transform-style: preserve-3d;
  flex: 1;
  min-height: 0;
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
  background-color: rgba(242, 227, 207, 0.78);
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
  flex: 0 0 auto;
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
  touch-action: pan-y;
}

.home-proj__float {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0.4rem;
  box-shadow: none;
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
  box-shadow: none;
  background: transparent;
  border: none;
  transition: filter 0.28s ease, opacity 0.28s ease;
}

.home-proj__float:focus-visible {
  box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.3);
}

.home-proj__float--visual:not(.home-proj__float--dragging):hover,
.home-proj__float--visual:not(.home-proj__float--dragging):focus-within {
  z-index: 4;
  box-shadow: none;
  filter: none;
}

.home-proj__float--caption:not(.home-proj__float--dragging):hover,
.home-proj__float--caption:not(.home-proj__float--dragging):focus-within {
  z-index: 5;
  box-shadow: none;
  filter: none;
}

.home-proj__float--dragging {
  z-index: 12;
  cursor: grabbing;
}

.home-proj__float--visual.home-proj__float--dragging {
  box-shadow: none;
  filter: none;
}

.home-proj__float--caption.home-proj__float--dragging {
  box-shadow: none;
  filter: none;
}

.home-proj__float--scratch-done {
  animation: home-proj-scratch-flash 0.55s ease-out;
}

@keyframes home-proj-scratch-flash {
  0% {
    filter: brightness(1);
  }
  35% {
    filter: brightness(1.12);
  }
  100% {
    filter: brightness(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-proj__float--scratch-done {
    animation: none;
  }
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
  box-sizing: border-box;
  padding: 0;
  overflow: visible;
  border-radius: 0;
}

.home-proj__caption-text {
  position: relative;
  z-index: 0;
  margin: 0;
  padding: 0.5rem 0.55rem;
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
  border-radius: 0;
}
</style>
