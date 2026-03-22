<template>
  <div class="home-page" :class="`home-page--${mode}`">

    <!-- ── STACKED ALBUMS ───────────────────────────────── -->
    <div ref="stackRef" class="album-stack">
      <div
        v-for="(sec, i) in SECTIONS"
        :key="sec.id"
        :ref="el => { albumRefs[i] = el }"
        class="album-band"
        :style="bandStyle(i, sec)"
        role="button"
        :tabindex="mode === 'stacked' ? 0 : -1"
        :aria-label="`Open ${sec.label}`"
        @mouseenter="onBandEnter(i)"
        @mouseleave="onBandLeave"
        @click="openSection(i)"
        @keydown.enter.prevent="openSection(i)"
        @keydown.space.prevent="openSection(i)"
      >
        <div class="album-band__inner">
          <span class="album-band__num" :style="{ color: sec.numColor }">
            {{ padIdx(i + 1) }}
          </span>
          <span class="album-band__rule" :style="{ background: sec.ruleColor }" aria-hidden="true" />
          <span class="album-band__label" :style="{ color: sec.color }">
            {{ sec.label }}
          </span>
          <span class="album-band__arrow" :style="{ color: sec.arrowColor }" aria-hidden="true">↗</span>
        </div>
        <div class="album-band__edge" aria-hidden="true" />
      </div>
    </div>

    <!-- ── FULLPAGE MODE ─────────────────────────────────── -->
    <div
      class="album-fp"
      :class="{ 'album-fp--open': mode === 'fullpage' }"
      @wheel.prevent="onWheel"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >

      <!-- Compact tab header -->
      <nav
        ref="fpTabsRef"
        class="fp-tabs"
        :class="{ 'fp-tabs--pending': !fpHeaderReady }"
        aria-label="Section navigation"
      >
        <button
          v-for="(sec, i) in SECTIONS"
          :key="sec.id"
          class="fp-tab"
          :class="{ 'fp-tab--active': activeIdx === i }"
          :style="{ background: sec.bg, color: sec.color }"
          @click="goToSection(i)"
        >
          <span class="fp-tab__num" :style="{ color: sec.numColor }">{{ padIdx(i + 1) }}</span>
          <span class="fp-tab__label">{{ sec.label }}</span>
        </button>
        <button
          class="fp-close"
          aria-label="Back to overview"
          @click="closeFullpage"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </nav>

      <!-- Snap pages -->
      <div
        ref="fpBodyRef"
        class="fp-body"
        :class="{ 'fp-body--pending': !fpHeaderReady }"
      >
        <div ref="fpPagesRef" class="fp-pages">
          <div
            v-for="sec in SECTIONS"
            :key="sec.id"
            class="fp-page"
            :style="fpPageH ? { height: fpPageH + 'px' } : {}"
          >
            <component
              :is="sec.component"
              :disable-scroll-anim="true"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomeHero from '../components/home/HomeHero.vue'
import HomeAbout from '../components/home/HomeAbout.vue'
import HomeProjects from '../components/home/HomeProjects.vue'
import HomeExperience from '../components/home/HomeExperience.vue'
import HomeSkills from '../components/home/HomeSkills.vue'
import HomeContact from '../components/home/HomeContact.vue'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = [
  {
    id: 'hero',
    label: 'Hello',
    component: HomeHero,
    bg: '#ffffff',
    color: '#000000',
    numColor: 'rgba(0,0,0,0.25)',
    arrowColor: 'rgba(0,0,0,0.3)',
    ruleColor: 'rgba(0,0,0,0.08)',
  },
  {
    id: 'about',
    label: 'About',
    component: HomeAbout,
    bg: '#f8f7f4',
    color: '#111111',
    numColor: 'rgba(0,0,0,0.25)',
    arrowColor: 'rgba(0,0,0,0.3)',
    ruleColor: 'rgba(0,0,0,0.08)',
  },
  {
    id: 'projects',
    label: 'Projects',
    component: HomeProjects,
    bg: '#f1ede6',
    color: '#111111',
    numColor: 'rgba(0,0,0,0.25)',
    arrowColor: 'rgba(0,0,0,0.3)',
    ruleColor: 'rgba(0,0,0,0.08)',
  },
  {
    id: 'experience',
    label: 'Experience',
    component: HomeExperience,
    bg: '#e8e4dc',
    color: '#111111',
    numColor: 'rgba(0,0,0,0.25)',
    arrowColor: 'rgba(0,0,0,0.3)',
    ruleColor: 'rgba(0,0,0,0.08)',
  },
  {
    id: 'skills',
    label: 'Skills',
    component: HomeSkills,
    bg: '#e4e7ed',
    color: '#111111',
    numColor: 'rgba(0,0,0,0.25)',
    arrowColor: 'rgba(0,0,0,0.3)',
    ruleColor: 'rgba(0,0,0,0.08)',
  },
  {
    id: 'contact',
    label: 'Contact',
    component: HomeContact,
    bg: '#111111',
    color: '#ffffff',
    numColor: 'rgba(255,255,255,0.3)',
    arrowColor: 'rgba(255,255,255,0.4)',
    ruleColor: 'rgba(255,255,255,0.1)',
  },
]

const N = SECTIONS.length
const HOVER_OFFSET = 28
const TAB_H = 52
const FP_TABS_PAD_RIGHT = 56
const FP_CLOSE_WIDTH = 48

export default {
  name: 'HomePage',
  components: { HomeHero, HomeAbout, HomeProjects, HomeExperience, HomeSkills, HomeContact },
  provide() {
    return {
      homeLenisScrollTo: () => {},
    }
  },
  data() {
    return {
      SECTIONS,
      mode: 'stacked',
      activeIdx: 0,
      albumRefs: Array(N).fill(null),
      isAnimating: false,
      fpPageH: 0,
      touchStartY: 0,
      stripH: 0,
      fpHeaderReady: false,
    }
  },
  created() {
    if (typeof window !== 'undefined') {
      this.stripH = window.innerHeight / N
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
    this.updateStripH()
    window.addEventListener('resize', this.updateStripH)
  },
  beforeUnmount() {
    document.body.style.overflow = ''
    window.removeEventListener('resize', this.updateStripH)
    ScrollTrigger.getAll().forEach(t => t.kill())
  },
  methods: {
    padIdx(n) {
      return String(n).padStart(2, '0')
    },

    updateStripH() {
      if (typeof window === 'undefined') return
      this.stripH = window.innerHeight / N
    },

    bandStyle(i, sec) {
      const sh = this.stripH || (typeof window !== 'undefined' ? window.innerHeight / N : 0)
      return {
        '--band-bg': sec.bg,
        '--band-color': sec.color,
        background: sec.bg,
        top: `${i * sh}px`,
        height: `${sh}px`,
        left: '0',
        width: '100%',
      }
    },

    onBandEnter(i) {
      if (this.mode !== 'stacked' || this.isAnimating) return
      this.albumRefs.forEach((el, j) => {
        if (!el) return
        gsap.to(el, {
          y: j > i ? HOVER_OFFSET : j === i ? 5 : 0,
          duration: 0.3,
          ease: 'power2.out',
        })
      })
    },

    onBandLeave() {
      if (this.isAnimating) return
      this.albumRefs.forEach(el => {
        if (!el) return
        gsap.to(el, { y: 0, duration: 0.35, ease: 'power2.inOut' })
      })
    },

    openSection(i) {
      if (this.isAnimating || this.mode !== 'stacked') return
      this.isAnimating = true
      this.fpHeaderReady = false
      this.activeIdx = i
      this.albumRefs.forEach(el => el && gsap.killTweensOf(el))

      const tabW = (window.innerWidth - FP_TABS_PAD_RIGHT - FP_CLOSE_WIDTH) / N

      const tl = gsap.timeline({
        onComplete: () => {
          this.mode = 'fullpage'
          this.$nextTick(() => {
            const bodyH = this.$refs.fpBodyRef?.clientHeight ?? window.innerHeight
            this.fpPageH = bodyH
            const pages = this.$refs.fpPagesRef
            if (pages) gsap.set(pages, { y: -i * bodyH })
            const stack = this.$refs.stackRef
            if (stack) gsap.set(stack, { visibility: 'hidden' })
            this.fpHeaderReady = true
            this.isAnimating = false
          })
        },
      })

      this.albumRefs.forEach((el, j) => {
        if (!el) return
        tl.to(
          el,
          {
            top: 0,
            left: j * tabW,
            width: tabW,
            height: TAB_H,
            duration: 0.78,
            ease: 'power3.inOut',
          },
          j * 0.055,
        )
      })
    },

    closeFullpage() {
      if (this.isAnimating) return
      this.isAnimating = true
      this.fpHeaderReady = false
      this.mode = 'stacked'
      this.$nextTick(() => {
        const sh = this.stripH || window.innerHeight / N
        this.albumRefs.forEach((el, j) => {
          if (!el) return
          gsap.set(el, {
            y: 0,
            top: j * sh,
            left: 0,
            width: '100%',
            height: sh,
          })
        })
        if (this.$refs.stackRef) gsap.set(this.$refs.stackRef, { visibility: 'visible' })
        this.fpPageH = 0
        this.isAnimating = false
      })
    },

    goToSection(i) {
      if (i === this.activeIdx || this.isAnimating) return
      this.isAnimating = true
      this.activeIdx = i
      const pages = this.$refs.fpPagesRef
      if (!pages) { this.isAnimating = false; return }
      const bodyH = this.fpPageH || this.$refs.fpBodyRef?.clientHeight || window.innerHeight
      gsap.to(pages, {
        y: -i * bodyH,
        duration: 0.65,
        ease: 'power2.inOut',
        onComplete: () => { this.isAnimating = false },
      })
    },

    onWheel(e) {
      if (this.mode !== 'fullpage' || this.isAnimating) return
      if (e.deltaY > 20) this.goToSection(Math.min(this.activeIdx + 1, N - 1))
      else if (e.deltaY < -20) this.goToSection(Math.max(this.activeIdx - 1, 0))
    },

    onTouchStart(e) {
      this.touchStartY = e.touches[0].clientY
    },

    onTouchEnd(e) {
      const dy = this.touchStartY - e.changedTouches[0].clientY
      if (dy > 50) this.goToSection(Math.min(this.activeIdx + 1, N - 1))
      else if (dy < -50) this.goToSection(Math.max(this.activeIdx - 1, 0))
    },
  },
}
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
}

.album-band__inner {
  display: flex;
  align-items: center;
  padding: 0 2rem 0 2.5rem;
  gap: 1.25rem;
  height: 100%;
}

.album-band__num {
  font-size: 0.65rem;
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
  font-size: clamp(1rem, 2.8vw, 1.6rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1;
  transition: letter-spacing 0.25s ease;
}

.album-band:hover .album-band__label {
  letter-spacing: 0.01em;
}

.album-band__arrow {
  font-size: 1rem;
  flex-shrink: 0;
  transform: translate(0, 0);
  transition: transform 0.22s ease, opacity 0.22s ease;
  opacity: 0.4;
}

.album-band:hover .album-band__arrow {
  transform: translate(4px, -4px);
  opacity: 1;
}

.album-band__edge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.07);
  pointer-events: none;
}

.album-band:last-child .album-band__edge {
  background: rgba(255, 255, 255, 0.06);
}

/* ── Fullpage view (always painted; album-stack covers it) ─ */
.album-fp {
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

/* Tab header */
.fp-tabs {
  flex: 0 0 auto;
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding-right: 56px; /* leave room for the fixed language switcher button */
}

.fp-tabs--pending,
.fp-body--pending {
  visibility: hidden;
  pointer-events: none;
}

.fp-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 0.75rem;
  border: none;
  border-right: 1px solid rgba(0, 0, 0, 0.07);
  cursor: pointer;
  font: inherit;
  gap: 0.2rem;
  height: 52px;
  box-sizing: border-box;
  min-height: unset;
  position: relative;
  transition: filter 0.18s ease;
}

.fp-tab:last-of-type {
  border-right: none;
}

.fp-tab:hover {
  filter: brightness(0.94);
}

.fp-tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: currentColor;
}

.fp-tab__num {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1;
}

.fp-tab__label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
}

.fp-close {
  flex: 0 0 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  background: #f5f5f5;
  color: #555;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.fp-close:hover {
  background: #ebebeb;
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
  overflow-y: auto;
  overscroll-behavior: contain;
  box-sizing: border-box;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 600px) {
  .album-band__inner {
    padding: 0 1.25rem;
    gap: 0.85rem;
  }

  .fp-tab {
    padding: 0.5rem 0.6rem;
  }

  .fp-tab__label {
    font-size: 0.6rem;
  }
}
</style>
