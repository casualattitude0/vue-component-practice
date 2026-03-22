<template>
  <section
    id="home-projects"
    ref="root"
    class="home-proj"
    aria-labelledby="home-proj-title"
  >
    <div
      ref="panel"
      class="home-proj__panel"
    >
      <div class="home-proj__copy">
        <h2
          id="home-proj-title"
          class="home-proj__title"
        >
          {{ $t('home.projects.title') }}
        </h2>
        <h3 class="home-proj__name">
          {{ $t('home.projects.name') }}
        </h3>
        <ul class="home-proj__list">
          <li
            v-for="(b, i) in bullets"
            :key="i"
          >
            {{ b }}
          </li>
        </ul>
      </div>
      <div
        class="home-proj__visual"
        aria-hidden="true"
      />
    </div>
  </section>
</template>

<script>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../../utils/lenisGsap'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'HomeProjects',
  data() {
    return {
      enterTween: null,
    }
  },
  computed: {
    bullets() {
      return this.$tm('home.projects.bullets')
    },
  },
  mounted() {
    const panel = this.$refs.panel
    const root = this.$refs.root
    if (prefersReducedMotion()) return
    this.enterTween = gsap.fromTo(
      panel,
      { x: 96, opacity: 0.2, rotateY: -10 },
      {
        x: 0,
        opacity: 1,
        rotateY: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 88%',
          end: 'top 32%',
          scrub: 0.65,
        },
      },
    )
  },
  beforeUnmount() {
    if (this.enterTween) {
      this.enterTween.kill()
      this.enterTween = null
    }
  },
}
</script>

<style scoped>
.home-proj {
  position: relative;
  padding: 3rem max(1rem, env(safe-area-inset-left)) 4rem
    max(1rem, env(safe-area-inset-right));
  background: #f5f5f5;
  perspective: 900px;
}

.home-proj__panel {
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
  will-change: transform, opacity;
  transform-style: preserve-3d;
}

.home-proj__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.35rem, 2.8vw, 1.85rem);
  font-weight: 800;
  color: #000;
}

.home-proj__name {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
}

.home-proj__list {
  margin: 0;
  padding-left: 1.15rem;
  line-height: 1.55;
  color: #444;
  font-size: 0.95rem;
}

.home-proj__visual {
  min-height: 200px;
  border-radius: 4px;
  background:
    repeating-linear-gradient(
      -45deg,
      #e8e8e8,
      #e8e8e8 8px,
      #f0f0f0 8px,
      #f0f0f0 16px
    );
  border: 2px dashed #999;
  box-shadow: none;
}

@media (max-width: 768px) {
  .home-proj__panel {
    grid-template-columns: 1fr;
  }

  .home-proj__visual {
    min-height: 140px;
    order: -1;
  }
}
</style>
