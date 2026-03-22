<template>
  <section
    id="home-experience"
    ref="root"
    class="home-exp"
    aria-labelledby="home-exp-title"
  >
    <div
      ref="panel"
      class="home-exp__panel"
    >
      <div
        class="home-exp__visual"
        aria-hidden="true"
      />
      <div class="home-exp__copy">
        <h2
          id="home-exp-title"
          class="home-exp__title"
        >
          {{ $t('home.experience.title') }}
        </h2>
        <h3 class="home-exp__role">
          {{ $t('home.experience.role') }}
        </h3>
        <ul class="home-exp__list">
          <li
            v-for="(b, i) in bullets"
            :key="i"
          >
            {{ b }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../../utils/lenisGsap'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'HomeExperience',
  data() {
    return {
      enterTween: null,
    }
  },
  computed: {
    bullets() {
      return this.$tm('home.experience.bullets')
    },
  },
  mounted() {
    const panel = this.$refs.panel
    const root = this.$refs.root
    if (prefersReducedMotion()) return
    this.enterTween = gsap.fromTo(
      panel,
      { x: -96, opacity: 0.2, rotateY: 10 },
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
.home-exp {
  position: relative;
  padding: 3rem max(1rem, env(safe-area-inset-left)) 3rem
    max(1rem, env(safe-area-inset-right));
  background: #fff;
  perspective: 900px;
}

.home-exp__panel {
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 2rem;
  align-items: center;
  will-change: transform, opacity;
  transform-style: preserve-3d;
}

.home-exp__visual {
  min-height: 200px;
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(168, 192, 255, 0.35) 0%, rgba(63, 43, 150, 0.2) 100%),
    radial-gradient(circle at 70% 30%, rgba(251, 194, 235, 0.5), transparent 55%);
  border: 1px solid rgba(44, 62, 80, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.home-exp__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.35rem, 2.8vw, 1.85rem);
  font-weight: 800;
  color: #1a2530;
}

.home-exp__role {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #3d4f5f;
}

.home-exp__list {
  margin: 0;
  padding-left: 1.15rem;
  line-height: 1.55;
  color: #4a5a68;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .home-exp__panel {
    grid-template-columns: 1fr;
  }

  .home-exp__visual {
    min-height: 140px;
  }
}
</style>
