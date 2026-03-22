<template>
  <section
    id="home-hero"
    ref="root"
    class="home-hero"
    aria-labelledby="home-hero-title"
  >
    <div
      ref="inner"
      class="home-hero__inner"
    >
      <p class="home-hero__eyebrow">
        {{ $t('home.hero.eyebrow') }}
      </p>
      <h1
        id="home-hero-title"
        class="home-hero__title"
      >
        {{ $t('home.hero.name') }}
      </h1>
      <p class="home-hero__subtitle">
        {{ $t('home.hero.subtitle') }}
      </p>
      <button
        type="button"
        class="home-hero__scroll"
        :aria-label="$t('home.hero.scrollHint')"
        @click="onScrollClick"
      >
        <span class="home-hero__scroll-text">{{ $t('home.hero.scrollHint') }}</span>
        <span
          class="home-hero__scroll-icon"
          aria-hidden="true"
        >↓</span>
      </button>
    </div>
  </section>
</template>

<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../utils/lenisGsap";

gsap.registerPlugin(ScrollTrigger);

export default {
  name: "HomeHero",
  props: {
    disableScrollAnim: {
      type: Boolean,
      default: false,
    },
  },
  inject: {
    homeLenisScrollTo: {
      from: "homeLenisScrollTo",
      default: () => () => {},
    },
  },
  data() {
    return {
      triggers: [],
    };
  },
  mounted() {
    if (prefersReducedMotion() || this.disableScrollAnim) return;
    const root = this.$refs.root;
    const inner = this.$refs.inner;
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(inner, {
          y: p * 72,
          opacity: Math.max(0, 1 - p * 1.15),
        });
      },
    });
    this.triggers.push(st);
  },
  beforeUnmount() {
    this.triggers.forEach((t) => t.kill());
    this.triggers = [];
  },
  methods: {
    onScrollClick() {
      this.homeLenisScrollTo("home-about");
    },
  },
};
</script>

<style scoped>
.home-hero {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5.5rem 1.5rem 3rem;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
}

.home-hero__inner {
  position: relative;
  text-align: center;
  max-width: 40rem;
  will-change: transform, opacity;
}

.home-hero__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #666;
}

.home-hero__title {
  margin: 0 0 0.5rem;
  font-size: clamp(2rem, 6vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #000;
}

.home-hero__subtitle {
  margin: 0 0 2rem;
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  color: #444;
}

.home-hero__scroll {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border: 1px solid #999;
  border-radius: 999px;
  background: #fff;
  color: #000;
  font: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.home-hero__scroll:hover {
  border-color: #000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.home-hero__scroll-text {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-hero__scroll-icon {
  font-size: 1.1rem;
  line-height: 1;
  animation: home-hero-bob 1.6s ease-in-out infinite;
}

@keyframes home-hero-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero__scroll-icon {
    animation: none;
  }
}
</style>
