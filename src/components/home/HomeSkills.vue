<template>
  <section
    id="home-skills"
    ref="root"
    class="home-skills"
    aria-labelledby="home-skills-title"
  >
    <h2
      id="home-skills-title"
      class="home-skills__title"
    >
      {{ $t('home.skills.title') }}
    </h2>
    <div class="home-skills__rows">
      <div
        ref="row1"
        class="home-skills__row"
      >
        <MarqueeText
          :text="$t('home.skills.row1')"
          :duration="38"
          direction="left"
          gradient-edges
          :pause-on-hover="true"
          class="home-skills__marquee"
        />
      </div>
      <div
        ref="row2"
        class="home-skills__row"
      >
        <MarqueeText
          :text="$t('home.skills.row2')"
          :duration="44"
          direction="right"
          gradient-edges
          :pause-on-hover="true"
          class="home-skills__marquee"
        />
      </div>
      <div
        ref="row3"
        class="home-skills__row"
      >
        <MarqueeText
          :text="$t('home.skills.row3')"
          :duration="50"
          direction="left"
          gradient-edges
          :pause-on-hover="true"
          class="home-skills__marquee"
        />
      </div>
    </div>
  </section>
</template>

<script>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MarqueeText from '../MarqueeText.vue'
import { prefersReducedMotion } from '../../utils/lenisGsap'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'HomeSkills',
  components: { MarqueeText },
  data() {
    return {
      triggers: [],
    }
  },
  mounted() {
    if (prefersReducedMotion()) return
    const root = this.$refs.root
    const r1 = this.$refs.row1
    const r2 = this.$refs.row2
    const r3 = this.$refs.row3
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress
        const amp = 140
        gsap.set(r1, { x: p * amp - amp * 0.5 })
        gsap.set(r2, { x: -(p * amp) + amp * 0.5 })
        gsap.set(r3, { x: p * amp * 0.55 - amp * 0.25 })
      },
    })
    this.triggers.push(st)
  },
  beforeUnmount() {
    this.triggers.forEach((t) => t.kill())
    this.triggers = []
  },
}
</script>

<style scoped>
.home-skills {
  position: relative;
  padding: 4rem 0 4.5rem;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 50%, #f8fafc 100%);
  overflow: hidden;
}

.home-skills__title {
  margin: 0 auto 2rem;
  max-width: 72rem;
  padding: 0 max(1rem, env(safe-area-inset-left)) 0
    max(1rem, env(safe-area-inset-right));
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #1a2530;
}

.home-skills__rows {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.home-skills__row {
  will-change: transform;
}

.home-skills__marquee {
  font-size: clamp(1.1rem, 2.5vw, 1.65rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #2c3e50;
}
</style>
