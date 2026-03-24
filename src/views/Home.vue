<template>
  <div
    class="home-page"
    :class="`home-page--${mode}`"
  >
    <div
      class="parallax-bg"
      :style="parallaxBgStyle"
    />

    <LanguageFloatButton
      v-if="mode === 'stacked'"
      ref="langFloatBtn"
      :pop-out="langButtonPopOut"
    />

    <!-- ── STACKED ALBUMS ───────────────────────────────── -->
    <div
      ref="stackRef"
      class="album-stack"
    >
      <div
        v-for="(sec, i) in SECTIONS"
        :key="sec.id"
        :ref="el => { albumRefs[i] = el }"
        class="album-band"
        :style="bandStyle(i, sec)"
        role="button"
        :tabindex="mode === 'stacked' ? 0 : -1"
        :aria-label="`Open ${$t(sec.labelKey)}`"
        @mouseenter="onBandEnter(i)"
        @mouseleave="onBandLeave"
        @click="openSection(i)"
        @keydown.enter.prevent="openSection(i)"
        @keydown.space.prevent="openSection(i)"
      >
        <div class="album-band__inner">
          <span
            class="album-band__num"
            :style="{ color: sec.numColor }"
          >
            {{ padIdx(i + 1) }}
          </span>
          <span
            class="album-band__rule"
            :style="{ background: sec.ruleColor }"
            aria-hidden="true"
          />
          <span
            class="album-band__label"
            :style="{ color: sec.color }"
          >
            {{ $t(sec.labelKey) }}
          </span>
          <span
            class="album-band__arrow"
            :style="{ color: sec.arrowColor }"
            aria-hidden="true"
          >↗</span>
        </div>
        <span
          class="album-band__tab"
          :style="tabVars(sec)"
          aria-hidden="true"
        >{{ tabText(i, sec) }}</span>
        <div
          class="album-band__edge"
          aria-hidden="true"
        />
      </div>
    </div>

    <!-- ── FULLPAGE MODE ─────────────────────────────────── -->
    <div
      class="album-fp"
      :class="{ 'album-fp--open': mode === 'fullpage' }"
      @wheel="onWheel"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >

      <!-- Compact tab header (layout matches album-strip end state: N equal columns, TAB_H) -->
      <nav
        ref="fpTabsRef"
        class="fp-tabs"
        :class="{ 'fp-tabs--pending': !fpHeaderReady }"
        aria-label="Section navigation"
      >
        <button
          class="fp-close"
          aria-label="Back to overview"
          @click="closeFullpage"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line
              x1="19"
              y1="12"
              x2="5"
              y2="12"
            />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div class="fp-tabs__bands">
          <button
            v-for="(sec, i) in SECTIONS"
            :key="sec.id"
            class="fp-tab"
            :class="{ 'fp-tab--active': activeIdx === i }"
            :style="{ background: sec.bg, color: sec.color }"
            @click="goToSection(i)"
          >
            <span class="fp-tab__inner">
              <span
                class="fp-tab__num"
                :style="{ color: sec.numColor }"
              >{{ padIdx(i + 1) }}</span>
              <span
                class="fp-tab__rule"
                :style="{ background: sec.ruleColor }"
                aria-hidden="true"
              />
              <span
                class="fp-tab__label"
                :style="{ color: sec.color }"
              >{{ $t(sec.labelKey) }}</span>
              <span
                class="fp-tab__arrow"
                :style="{ color: sec.arrowColor }"
                aria-hidden="true"
              >↗</span>
            </span>
            <span
              class="album-band__tab"
              :style="tabVars(sec)"
              aria-hidden="true"
            >{{ tabText(i, sec) }}</span>
          </button>
        </div>
      </nav>

      <!-- Snap pages -->
      <div
        ref="fpBodyRef"
        class="fp-body"
        :class="{ 'fp-body--pending': !fpHeaderReady }"
      >
        <div
          ref="fpPagesRef"
          class="fp-pages"
        >
          <div
            v-for="sec in SECTIONS"
            :key="sec.id"
            class="fp-page"
            :style="fpPageH ? { height: fpPageH + 'px' } : {}"
            @scroll.passive="onFpPageScroll"
          >
            <component
              :is="sec.component"
              :disable-scroll-anim="sec.id !== 'about'"
              :scroller-height="sec.id === 'about' ? fpPageH : undefined"
              :header-offset="sec.id === 'about' ? tabHeaderHeight : 0"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeHero from "../components/home/HomeHero.vue";
import HomeAbout from "../components/home/HomeAbout.vue";
import HomeProjects from "../components/home/HomeProjects.vue";
import HomeExperience from "../components/home/HomeExperience.vue";
import HomeContact from "../components/home/HomeContact.vue";
import LanguageFloatButton from "../components/site/LanguageFloatButton.vue";
import { triggerParticleBurst } from "../composables/useClickParticles.js";
import homeParallaxBgUrl from "../assets/test/background-image.jpg";
gsap.registerPlugin(ScrollTrigger);

function getFpPagesTranslateY(pages) {
  if (!pages || typeof window === "undefined") return 0;
  const py = gsap.getProperty(pages, "y");
  if (py !== undefined && py !== null && py !== "") {
    const n = parseFloat(String(py));
    if (Number.isFinite(n)) return n;
  }
  const t = window.getComputedStyle(pages).transform;
  if (!t || t === "none") return 0;
  if (t.startsWith("matrix3d(")) {
    const vals = t
      .slice(9, -1)
      .split(",")
      .map((s) => parseFloat(s.trim()));
    if (vals.length === 16) return vals[13];
  }
  if (t.startsWith("matrix(")) {
    const vals = t
      .slice(7, -1)
      .split(",")
      .map((s) => parseFloat(s.trim()));
    if (vals.length === 6) return vals[5];
  }
  return 0;
}

const SECTIONS = [
  {
    id: "hero",
    labelKey: "home.sections.hero",
    component: HomeHero,
    bg: "rgba(255, 255, 255, 0.85)",
    color: "#000000",
    numColor: "rgba(0,0,0,0.25)",
    arrowColor: "rgba(0,0,0,0.3)",
    ruleColor: "rgba(0,0,0,0.08)",
  },
  {
    id: "about",
    labelKey: "home.sections.about",
    component: HomeAbout,
    bg: "rgba(248, 247, 244, 0.85)",
    color: "#111111",
    numColor: "rgba(0,0,0,0.25)",
    arrowColor: "rgba(0,0,0,0.3)",
    ruleColor: "rgba(0,0,0,0.08)",
  },
  {
    id: "projects",
    labelKey: "home.sections.projects",
    component: HomeProjects,
    bg: "rgba(241, 237, 230, 0.85)",
    color: "#111111",
    numColor: "rgba(0,0,0,0.25)",
    arrowColor: "rgba(0,0,0,0.3)",
    ruleColor: "rgba(0,0,0,0.08)",
  },
  {
    id: "experience",
    labelKey: "home.sections.experience",
    component: HomeExperience,
    bg: "rgba(232, 228, 220, 0.85)",
    color: "#111111",
    numColor: "rgba(0,0,0,0.25)",
    arrowColor: "rgba(0,0,0,0.3)",
    ruleColor: "rgba(0,0,0,0.08)",
  },
  {
    id: "contact",
    labelKey: "home.sections.contact",
    component: HomeContact,
    bg: "rgba(228, 231, 237, 0.85)",
    color: "#111111",
    numColor: "rgba(0,0,0,0.25)",
    arrowColor: "rgba(0,0,0,0.3)",
    ruleColor: "rgba(0,0,0,0.08)",
  },
];

/** Vertical slots in stacked mode (keeps band height/position when Contact was removed). */
const STACK_SLOTS = 6;
const N = SECTIONS.length;
const HOVER_STRETCH = 52;
const TAB_H = 58;
const HOME_FP_SECTION_SCROLL_KEY = "home-fp-section-scroll";
const PARALLAX_SECTION_Y = 0.045;
/** Scroll down → background shifts up (negative Y in background-position) */
const PARALLAX_SCROLL_Y = 0.38;

function loadSectionScrollTops(len) {
  if (typeof sessionStorage === "undefined") {
    return Array.from({ length: len }, () => 0);
  }
  try {
    const raw = sessionStorage.getItem(HOME_FP_SECTION_SCROLL_KEY);
    if (!raw) return Array.from({ length: len }, () => 0);
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length !== len) {
      return Array.from({ length: len }, () => 0);
    }
    return arr.map((v) =>
      typeof v === "number" && Number.isFinite(v) ? v : 0
    );
  } catch {
    return Array.from({ length: len }, () => 0);
  }
}

export default {
  name: "HomePage",
  components: {
    HomeHero,
    HomeAbout,
    HomeProjects,
    HomeExperience,
    HomeContact,
    LanguageFloatButton,
  },
  provide() {
    return {
      homeLenisScrollTo: () => {},
    };
  },
  computed: {
    parallaxBgStyle() {
      const base = {
        backgroundImage: `url(${homeParallaxBgUrl})`,
      };
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return {
          ...base,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
        };
      }
      const tile = this.parallaxBgUseRepeat;
      return {
        ...base,
        backgroundSize: tile ? "100% auto" : "cover",
        backgroundRepeat: tile ? "repeat-y" : "no-repeat",
        backgroundPosition: `center ${this.parallaxBgY}px`,
      };
    },
  },
  data() {
    return {
      SECTIONS,
      mode: "stacked",
      activeIdx: 0,
      albumRefs: Array(SECTIONS.length).fill(null),
      isAnimating: false,
      fpPageH: 0,
      touchStartY: 0,
      stripH: 0,
      fpHeaderReady: false,
      sectionScrollTops: loadSectionScrollTops(N),
      tabHeaderHeight: TAB_H,
      langButtonPopOut: false,
      parallaxBgY: 0,
      parallaxBgNaturalW: 0,
      parallaxBgNaturalH: 0,
      parallaxBgUseRepeat: false,
    };
  },
  created() {
    if (typeof window !== "undefined") {
      this.stripH = window.innerHeight / STACK_SLOTS;
    }
  },
  mounted() {
    document.body.style.overflow = "hidden";
    this.updateStripH();
    window.addEventListener("resize", this.updateStripH);
    if (typeof Image !== "undefined") {
      const img = new Image();
      img.onload = () => {
        this.parallaxBgNaturalW = img.naturalWidth;
        this.parallaxBgNaturalH = img.naturalHeight;
        this.updateParallaxOffset();
      };
      img.src = homeParallaxBgUrl;
    }
    this.$nextTick(() => this.updateParallaxOffset());
  },
  beforeUnmount() {
    if (this._fpScrollPersistTimer) {
      clearTimeout(this._fpScrollPersistTimer);
      this._fpScrollPersistTimer = null;
    }
    const pages = this.$refs.fpPagesRef;
    if (pages) this.captureSectionScrollFromPages(pages);
    document.body.style.overflow = "";
    window.removeEventListener("resize", this.updateStripH);
    ScrollTrigger.getAll().forEach((t) => t.kill());
  },
  methods: {
    padIdx(n) {
      return String(n).padStart(2, "0");
    },

    updateStripH() {
      if (typeof window === "undefined") return;
      this.stripH = window.innerHeight / STACK_SLOTS;
      if (this.mode === "fullpage" && this.$refs.fpBodyRef) {
        this.fpPageH = this.$refs.fpBodyRef.clientHeight || window.innerHeight;
        const pages = this.$refs.fpPagesRef;
        if (pages && !this.isAnimating) {
          gsap.set(pages, { y: -this.activeIdx * this.fpPageH });
        }
      }
      this.updateParallaxOffset();
    },

    updateParallaxOffset() {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this.parallaxBgY = 0;
        this.parallaxBgUseRepeat = false;
        return;
      }
      if (this.mode !== "fullpage") {
        this.parallaxBgY = 0;
        this.parallaxBgUseRepeat = false;
        return;
      }
      const pages = this.$refs.fpPagesRef;
      const pageH =
        this.fpPageH ||
        this.$refs.fpBodyRef?.clientHeight ||
        window.innerHeight;
      const numY = pages ? getFpPagesTranslateY(pages) : 0;
      const fromTransform = -numY * PARALLAX_SECTION_Y;
      const fromIndex = this.activeIdx * pageH * PARALLAX_SECTION_Y;
      const sectionPart =
        pages && Math.abs(numY) > 0.5 ? fromTransform : fromIndex;
      const page = pages?.children?.[this.activeIdx];
      const scrollLift = page ? page.scrollTop * PARALLAX_SCROLL_Y : 0;
      const raw = -(sectionPart + scrollLift);
      let lim = Math.min(180, window.innerHeight * 0.32);
      if (pages) {
        let peak = 0;
        for (let i = 0; i < pages.children.length; i++) {
          const p = pages.children[i];
          const innerMax = Math.max(0, p.scrollHeight - p.clientHeight);
          const sectionPeak = i * pageH * PARALLAX_SECTION_Y;
          const scrollPeak = innerMax * PARALLAX_SCROLL_Y;
          peak = Math.max(peak, sectionPeak + scrollPeak);
        }
        lim = Math.max(lim, peak * 1.05, Math.abs(raw));
      } else {
        lim = Math.max(lim, Math.abs(raw));
      }
      this.parallaxBgY = Math.max(-lim, Math.min(lim, raw));

      const nw = this.parallaxBgNaturalW;
      const nh = this.parallaxBgNaturalH;
      if (nw > 0 && nh > 0) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const scale = Math.max(vw / nw, vh / nh);
        const scaledH = nh * scale;
        const slack = (scaledH - vh) / 2;
        this.parallaxBgUseRepeat = slack < lim * 1.05;
      } else {
        this.parallaxBgUseRepeat = false;
      }
    },

    persistSectionScrollTops() {
      if (typeof sessionStorage === "undefined") return;
      try {
        sessionStorage.setItem(
          HOME_FP_SECTION_SCROLL_KEY,
          JSON.stringify(this.sectionScrollTops)
        );
      } catch (_) {
        /* ignore quota / private mode */
      }
    },

    captureSectionScrollFromPages(pages) {
      if (!pages) return;
      Array.from(pages.children).forEach((p, j) => {
        if (j < this.sectionScrollTops.length) {
          this.sectionScrollTops[j] = p.scrollTop;
        }
      });
      this.persistSectionScrollTops();
    },

    applySectionScrollTops(pages) {
      if (!pages) return;
      Array.from(pages.children).forEach((p, j) => {
        const saved = this.sectionScrollTops[j] ?? 0;
        const max = Math.max(0, p.scrollHeight - p.clientHeight);
        p.scrollTop = Math.min(Math.max(0, saved), max);
      });
    },

    persistSectionScrollTopsFromDom() {
      const pages = this.$refs.fpPagesRef;
      if (!pages || typeof sessionStorage === "undefined") return;
      const tops = Array.from(pages.children, (p) => p.scrollTop);
      try {
        sessionStorage.setItem(
          HOME_FP_SECTION_SCROLL_KEY,
          JSON.stringify(tops)
        );
      } catch (_) {
        /* ignore */
      }
    },

    onFpPageScroll() {
      this.updateParallaxOffset();
      if (this._fpScrollPersistTimer) clearTimeout(this._fpScrollPersistTimer);
      this._fpScrollPersistTimer = setTimeout(() => {
        this._fpScrollPersistTimer = null;
        this.persistSectionScrollTopsFromDom();
      }, 200);
    },

    bandStyle(i, sec) {
      const sh =
        this.stripH ||
        (typeof window !== "undefined" ? window.innerHeight / STACK_SLOTS : 0);
      return {
        "--band-bg": sec.bg,
        "--band-color": sec.color,
        background: sec.bg,
        top: `${i * sh}px`,
        height: `${sh}px`,
        left: "0",
        width: "100%",
        zIndex: STACK_SLOTS - i,
      };
    },

    tabText(i, sec) {
      return `CODE_${this.padIdx(i + 1)} // ${String(
        this.$t(sec.labelKey)
      ).toUpperCase()}`;
    },

    tabVars(sec) {
      return {
        "--tab-bg": sec.bg,
        "--tab-fg": sec.color,
        "--tab-edge": "rgba(0,0,0,0.1)",
      };
    },

    onBandEnter(i) {
      if (this.mode !== "stacked" || this.isAnimating) return;
      const sh =
        this.stripH ||
        (typeof window !== "undefined" ? window.innerHeight / STACK_SLOTS : 0);
      const tween = { duration: 0.32, ease: "power2.out", overwrite: "auto" };
      this.albumRefs.forEach((el, j) => {
        if (!el) return;
        if (j === i) {
          gsap.to(el, { height: sh + HOVER_STRETCH, ...tween });
        } else {
          gsap.to(el, { height: sh, top: j * sh, ...tween });
        }
      });
    },

    onBandLeave() {
      if (this.isAnimating) return;
      const sh =
        this.stripH ||
        (typeof window !== "undefined" ? window.innerHeight / STACK_SLOTS : 0);
      this.albumRefs.forEach((el, j) => {
        if (!el) return;
        gsap.to(el, {
          height: sh,
          top: j * sh,
          duration: 0.36,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });
    },

    openSection(i) {
      if (this.isAnimating || this.mode !== "stacked") return;
      this.isAnimating = true;
      this.fpHeaderReady = false;
      this.activeIdx = i;
      this.albumRefs.forEach((el) => el && gsap.killTweensOf(el));

      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.$nextTick(() => {
        const el = this.$refs.langFloatBtn?.$el;
        if (el && !reducedMotion) {
          const r = el.getBoundingClientRect();
          triggerParticleBurst(r.left + r.width / 2, r.top + r.height / 2);
        }
        this.langButtonPopOut = true;
      });

      const tabW = window.innerWidth / N;

      const tl = gsap.timeline({
        onComplete: () => {
          this.mode = "fullpage";
          this.$nextTick(() => {
            const bodyH =
              this.$refs.fpBodyRef?.clientHeight ?? window.innerHeight;
            this.fpPageH = bodyH;
            const pages = this.$refs.fpPagesRef;
            if (pages) {
              gsap.set(pages, { y: -i * bodyH });
              this.applySectionScrollTops(pages);
            }
            this.fpHeaderReady = true;
            this.$nextTick(() => {
              requestAnimationFrame(() => {
                const stack = this.$refs.stackRef;
                if (stack) gsap.set(stack, { visibility: "hidden" });
                this.isAnimating = false;
                this.updateParallaxOffset();
                ScrollTrigger.refresh();
              });
            });
          });
        },
      });

      this.albumRefs.forEach((el, j) => {
        if (!el) return;
        tl.to(
          el,
          {
            top: 0,
            left: j * tabW,
            width: tabW,
            height: TAB_H,
            duration: 0.78,
            ease: "power3.inOut",
          },
          j * 0.055
        );
      });
    },

    closeFullpage() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.fpHeaderReady = false;
      this.langButtonPopOut = false;
      const pages = this.$refs.fpPagesRef;
      if (pages) this.captureSectionScrollFromPages(pages);
      this.mode = "stacked";
      this.$nextTick(() => {
        const sh = this.stripH || window.innerHeight / STACK_SLOTS;
        this.albumRefs.forEach((el, j) => {
          if (!el) return;
          gsap.set(el, {
            y: 0,
            top: j * sh,
            left: 0,
            width: "100%",
            height: sh,
          });
        });
        if (this.$refs.stackRef)
          gsap.set(this.$refs.stackRef, { visibility: "visible" });
        this.fpPageH = 0;
        this.isAnimating = false;
        this.updateParallaxOffset();
      });
    },

    goToSection(i) {
      if (i === this.activeIdx || this.isAnimating) return;
      this.isAnimating = true;

      const pages = this.$refs.fpPagesRef;
      if (!pages) {
        this.isAnimating = false;
        return;
      }

      const currentPage = pages.children[this.activeIdx];
      if (currentPage) {
        this.sectionScrollTops[this.activeIdx] = currentPage.scrollTop;
        this.persistSectionScrollTops();
      }

      this.activeIdx = i;

      const bodyH =
        this.fpPageH ||
        this.$refs.fpBodyRef?.clientHeight ||
        window.innerHeight;
      gsap.to(pages, {
        y: -i * bodyH,
        duration: 0.65,
        ease: "power2.inOut",
        onUpdate: () => this.updateParallaxOffset(),
        onComplete: () => {
          const targetPage = pages.children[this.activeIdx];
          if (targetPage) {
            const saved = this.sectionScrollTops[this.activeIdx] ?? 0;
            const max = Math.max(
              0,
              targetPage.scrollHeight - targetPage.clientHeight
            );
            targetPage.scrollTop = Math.min(Math.max(0, saved), max);
          }
          this.isAnimating = false;
          this.updateParallaxOffset();
        },
      });
    },

    onWheel(e) {
      if (this.mode !== "fullpage" || this.isAnimating) return;

      const pages = this.$refs.fpPagesRef;
      const currentPage = pages?.children[this.activeIdx];
      if (currentPage) {
        const { scrollTop, scrollHeight, clientHeight } = currentPage;
        const canScrollDown =
          e.deltaY > 0 && scrollTop + clientHeight < scrollHeight - 2;
        const canScrollUp = e.deltaY < 0 && scrollTop > 2;
        if (canScrollDown || canScrollUp) return;
      }

      const t = 12;
      if (e.deltaY > t)
        this.goToSection(Math.min(this.activeIdx + 1, SECTIONS.length - 1));
      else if (e.deltaY < -t) this.goToSection(Math.max(this.activeIdx - 1, 0));
    },

    onTouchStart(e) {
      this.touchStartY = e.touches[0].clientY;
    },

    onTouchEnd(e) {
      const dy = this.touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) return;

      const pages = this.$refs.fpPagesRef;
      const currentPage = pages?.children[this.activeIdx];
      if (currentPage) {
        const { scrollTop, scrollHeight, clientHeight } = currentPage;
        if (dy > 0 && scrollTop + clientHeight < scrollHeight - 2) return;
        if (dy < 0 && scrollTop > 2) return;
      }

      if (dy > 0)
        this.goToSection(Math.min(this.activeIdx + 1, SECTIONS.length - 1));
      else this.goToSection(Math.max(this.activeIdx - 1, 0));
    },
  },
};
</script>

<style scoped>
/* ── Base ────────────────────────────────────────────── */
.home-page {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #f5f5f5;
}

.parallax-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  will-change: background-position;
}

@media (prefers-reduced-motion: reduce) {
  .parallax-bg {
    will-change: auto;
  }
}

/* ── Stacked view ────────────────────────────────────── */
.album-stack {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: auto;
}

.album-band {
  position: absolute;
  left: 0;
  box-sizing: border-box;
  cursor: pointer;
  will-change: transform, top, left, width, height;
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  outline: none;
  overflow: visible;
}

.album-band__inner {
  display: flex;
  align-items: center;
  padding: 0 2rem 0 2.5rem;
  gap: 1.25rem;
  height: 100%;
}

.album-band__num {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  line-height: 1;
  transition: color 0.2s ease;
}

.album-band__rule {
  flex: 1;
  height: 1px;
  display: block;
  min-width: 2rem;
}

.album-band__label {
  font-size: clamp(0.85rem, 2.2vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1;
  transition: letter-spacing 0.25s ease;
}

.album-band:hover .album-band__label {
  letter-spacing: 0.01em;
}

.album-band__arrow {
  font-size: 0.9rem;
  flex-shrink: 0;
  transform: translate(0, 0);
  transition: transform 0.22s ease, opacity 0.22s ease;
  opacity: 0.4;
}

.album-band:hover .album-band__arrow {
  transform: translate(4px, -4px);
  opacity: 1;
}

.album-band__tab {
  position: absolute;
  right: clamp(0.75rem, 3vw, 1.75rem);
  bottom: -18px;
  z-index: 3;
  max-width: min(72vw, 20rem);
  padding: 0.38rem 0.72rem 0.5rem;
  background: var(--tab-bg);
  color: var(--tab-fg);
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.52rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1.25;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 0 0 6px 6px;
  border: 1px solid var(--tab-edge);
  border-top: none;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  cursor: inherit;
  pointer-events: auto;
}

.album-band__edge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.07);
  pointer-events: none;
  z-index: 1;
}

/* ── Fullpage view (always painted; album-stack covers it) ─ */
.album-fp {
  --fp-header-offset: calc(58px + env(safe-area-inset-top, 0px));
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.album-fp--open {
  pointer-events: auto;
}

/* Tab header — N equal columns, min-height TAB_H (matches openSection album end state) */
.fp-tabs {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: stretch;
  min-height: 58px;
  border-bottom: none;
  overflow: visible;
  background: transparent;
  pointer-events: none;
}

.fp-tabs--pending {
  opacity: 0;
  pointer-events: none;
}

.fp-body--pending {
  visibility: hidden;
  pointer-events: none;
}

.fp-tabs__bands {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  min-height: 58px;
  pointer-events: auto;
}

.fp-tab {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  font: inherit;
  min-height: 58px;
  height: 58px;
  max-height: 58px;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
  align-self: stretch;
  transition: filter 0.2s ease, transform 0.2s ease;
}

.fp-tab__inner {
  display: flex;
  align-items: center;
  padding: 0 2rem 0 2.5rem;
  gap: 1.25rem;
  height: 100%;
  box-sizing: border-box;
  min-width: 0;
}

.fp-tab:first-child .fp-tab__inner {
  padding-left: calc(48px + max(0.65rem, env(safe-area-inset-left)));
}

.fp-tab:hover:not(.fp-tab--active) {
  z-index: 1;
  filter: brightness(0.97);
  transform: translateY(6px);
}

.fp-tab--active {
  z-index: 2;
  transform: translateY(6px);
}

.fp-tab--active::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: currentColor;
  z-index: 3;
}

.fp-tab__num {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  line-height: 1;
}

.fp-tab__rule {
  flex: 1;
  height: 1px;
  display: block;
  min-width: 2rem;
}

.fp-tab__label {
  font-size: clamp(0.55rem, 1.5vw, 1rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.fp-tab__arrow {
  font-size: 0.9rem;
  flex-shrink: 0;
  line-height: 1;
  opacity: 0.4;
}

.fp-close {
  position: absolute;
  left: max(0px, env(safe-area-inset-left));
  top: 0;
  z-index: 3;
  flex: 0 0 48px;
  width: 48px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0 0 8px 8px;
  background: transparent;
  color: #555;
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.2s ease, color 0.2s ease;
}

.fp-close:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #000;
}

/* Pages */
.fp-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.fp-pages {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
}

.fp-page {
  width: 100%;
  padding-top: var(--fp-header-offset);
  overflow-y: auto;
  overscroll-behavior: contain;
  box-sizing: border-box;
  -ms-overflow-style: none;
  scrollbar-width: none;
  background: transparent;
}

.fp-page::-webkit-scrollbar {
  display: none;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 600px) {
  .album-band__inner {
    padding: 0 1.25rem;
    gap: 0.85rem;
  }

  .fp-close {
    flex-basis: 40px;
    width: 40px;
    height: 58px;
  }

  .fp-tab:first-child .fp-tab__inner {
    padding-left: calc(40px + max(0.45rem, env(safe-area-inset-left)));
  }

  .fp-tab__inner {
    padding: 0 1.25rem;
    gap: 0.85rem;
  }
}

@media (max-width: 1024px) {
  .fp-tab .album-band__tab {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fp-tab {
    transition: filter 0.18s ease;
  }
}
</style>
