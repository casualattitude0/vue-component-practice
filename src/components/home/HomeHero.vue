<template>
  <section
    id="home-hero"
    ref="root"
    class="home-hero"
    aria-labelledby="home-hero-title"
  >
    <div
      class="home-hero__parallax"
      aria-hidden="true"
    >
      <div
        ref="blobA"
        class="home-hero__blob home-hero__blob--a"
      />
      <div
        ref="blobB"
        class="home-hero__blob home-hero__blob--b"
      />
      <div
        ref="blobC"
        class="home-hero__blob home-hero__blob--c"
      />
    </div>
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
    if (prefersReducedMotion()) return;
    const root = this.$refs.root;
    const inner = this.$refs.inner;
    const a = this.$refs.blobA;
    const b = this.$refs.blobB;
    const c = this.$refs.blobC;
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
        gsap.set(a, { y: p * -48, x: p * 24 });
        gsap.set(b, { y: p * -28, scale: 1 + p * 0.08 });
        gsap.set(c, { y: p * -64, x: p * -18 });
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
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5.5rem 1.5rem 3rem;
  box-sizing: border-box;
  overflow: clip;
  background: radial-gradient(
    120% 80% at 50% 0%,
    #f0f4ff 0%,
    #fafbfc 45%,
    #f5f6f8 100%
  );
}

.home-hero__parallax {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.home-hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(0.5px);
  opacity: 0.55;
  will-change: transform;
}

.home-hero__blob--a {
  width: min(42vw, 320px);
  height: min(42vw, 320px);
  left: 8%;
  top: 18%;
  background: radial-gradient(circle at 30% 30%, #a8c0ff, #3f2b96 70%);
  mix-blend-mode: multiply;
}

.home-hero__blob--b {
  width: min(55vw, 420px);
  height: min(55vw, 420px);
  right: -8%;
  bottom: 8%;
  background: radial-gradient(circle at 60% 40%, #fbc2eb, #a18cd1 65%);
  mix-blend-mode: multiply;
  opacity: 0.45;
}

.home-hero__blob--c {
  width: min(28vw, 200px);
  height: min(28vw, 200px);
  left: 42%;
  top: 52%;
  background: radial-gradient(circle at 50% 50%, #89f7fe, #66a6ff 70%);
  mix-blend-mode: soft-light;
  opacity: 0.4;
}

.home-hero__inner {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 40rem;
  will-change: transform, opacity;
}

.home-hero__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5c6b7a;
}

.home-hero__title {
  margin: 0 0 0.5rem;
  font-size: clamp(2rem, 6vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #1a2530;
}

.home-hero__subtitle {
  margin: 0 0 2rem;
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  color: #4a5a68;
}

.home-hero__scroll {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(44, 62, 80, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.65);
  color: #2c3e50;
  font: inherit;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.home-hero__scroll:hover {
  border-color: rgba(44, 62, 80, 0.35);
  box-shadow: 0 8px 24px rgba(44, 62, 80, 0.12);
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
