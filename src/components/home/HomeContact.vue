<template>
  <div class="home-contact-wrapper">
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
            :pause-on-hover="true"
            class="home-skills__marquee"
          />
        </div>
      </div>
    </section>

    <footer
      class="home-contact"
      role="contentinfo"
    >
      <h2 class="home-contact__title">
        {{ $t('home.contact.title') }}
      </h2>
      <p class="home-contact__tagline">
        {{ $t('home.contact.tagline') }}
      </p>
      <div class="home-contact__links">
        <a
          class="home-contact__link"
          :href="`mailto:${$t('home.contact.email')}`"
        >
          {{ $t('home.contact.emailLabel') }}
        </a>
        <span
          class="home-contact__sep"
          aria-hidden="true"
        >·</span>
        <a
          class="home-contact__link"
          href="https://www.behance.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('home.contact.behance') }}
        </a>
        <span
          class="home-contact__sep"
          aria-hidden="true"
        >·</span>
        <a
          class="home-contact__link"
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('home.contact.linkedin') }}
        </a>
      </div>
      <p class="home-contact__rights">
        {{ $t('home.contact.rights', { year: year }) }}
      </p>
    </footer>
  </div>
</template>

<script>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MarqueeText from './MarqueeText.vue'
import { prefersReducedMotion } from '../../utils/lenisGsap'

gsap.registerPlugin(ScrollTrigger)

export default {
  name: 'HomeContact',
  components: { MarqueeText },
  props: {
    disableScrollAnim: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      triggers: [],
    }
  },
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
  mounted() {
    if (prefersReducedMotion() || this.disableScrollAnim) return
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
.home-contact-wrapper {
  display: flex;
  flex-direction: column;
}

.home-skills {
  position: relative;
  padding: 4rem 0 4.5rem;
  background: #f0f0f0;
  overflow: hidden;
}

.home-skills__title {
  margin: 0 auto 2rem;
  max-width: 72rem;
  padding: 0 max(1rem, env(safe-area-inset-left)) 0
    max(1rem, env(safe-area-inset-right));
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #000;
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
  color: #222;
}

.home-contact {
  padding: 1rem max(1rem, env(safe-area-inset-left)) 1.1rem
    max(1rem, env(safe-area-inset-right));
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
}

.home-contact__title {
  margin: 0 0 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #666;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.home-contact__tagline {
  margin: 0 0 0.65rem;
  line-height: 1.45;
  color: #555;
  font-size: 0.8125rem;
}

.home-contact__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.35rem 0.5rem;
  margin-bottom: 0.55rem;
}

.home-contact__sep {
  color: #999;
  font-weight: 400;
  user-select: none;
}

.home-contact__link {
  color: #333;
  font-weight: 500;
  font-size: 0.8125rem;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.home-contact__link:hover {
  color: #000;
  border-bottom-color: #666;
}

.home-contact__rights {
  margin: 0;
  font-size: 0.6875rem;
  color: #888;
}
</style>
