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
  props: {
    disableScrollAnim: {
      type: Boolean,
      default: false,
    },
  },
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
    if (prefersReducedMotion() || this.disableScrollAnim) return
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
  border-radius: 4px;
  background:
    repeating-linear-gradient(
      45deg,
      #e8e8e8,
      #e8e8e8 8px,
      #f0f0f0 8px,
      #f0f0f0 16px
    );
  border: 2px dashed #999;
  box-shadow: none;
}

.home-exp__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.35rem, 2.8vw, 1.85rem);
  font-weight: 800;
  color: #000;
}

.home-exp__role {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #333;
}

.home-exp__list {
  margin: 0;
  padding-left: 1.15rem;
  line-height: 1.55;
  color: #444;
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
