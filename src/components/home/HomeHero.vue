<template>
  <section
    id="home-hero"
    ref="root"
    class="home-hero fade-in-section"
    :class="{ 'is-visible': isVisible }"
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
    </div>
    <div
      class="home-hero__scroll"
      aria-hidden="true"
    >
      <span class="home-hero__scroll-text">{{ $t('home.hero.scrollHint') }}</span>
      <span class="home-hero__scroll-icon">↓</span>
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
  data() {
    return {
      triggers: [],
      isVisible: false,
      observer: null,
    };
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
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.triggers.forEach((t) => t.kill());
    this.triggers = [];
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
  margin: 0;
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  color: #444;
}

.home-hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: #000;
  font: inherit;
  cursor: default;
  pointer-events: none;
  user-select: none;
}

.home-hero__scroll-text {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #444;
}

.home-hero__scroll-icon {
  font-size: 1.25rem;
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
  .fade-in-section {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
</style>
