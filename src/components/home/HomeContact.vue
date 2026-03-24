<template>
  <div
    ref="rootWrapper"
    class="home-contact-wrapper fade-in-section"
    :class="{ 'is-visible': isVisible }"
  >
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
            :duration="58"
            direction="left"
            :pause-on-hover="true"
            class="home-skills__marquee"
          >
            <template
              v-for="i in 6"
              :key="i"
            >
              <span
                v-for="(skill, j) in $tm('home.skills.row1')"
                :key="`${i}-${j}`"
                class="marquee__item skill-item"
              >
                <SkillMarqueeIcon
                  v-bind="skill.icon"
                  :label="skill.label"
                />
              </span>
            </template>
          </MarqueeText>
        </div>
        <div
          ref="row2"
          class="home-skills__row"
        >
          <MarqueeText
            :duration="66"
            direction="right"
            :pause-on-hover="true"
            class="home-skills__marquee"
          >
            <template
              v-for="i in 6"
              :key="i"
            >
              <span
                v-for="(skill, j) in $tm('home.skills.row2')"
                :key="`${i}-${j}`"
                class="marquee__item skill-item"
              >
                <SkillMarqueeIcon
                  v-bind="skill.icon"
                  :label="skill.label"
                />
              </span>
            </template>
          </MarqueeText>
        </div>
        <div
          ref="row3"
          class="home-skills__row"
        >
          <MarqueeText
            :duration="75"
            direction="left"
            :pause-on-hover="true"
            class="home-skills__marquee"
          >
            <template
              v-for="i in 6"
              :key="i"
            >
              <span
                v-for="(skill, j) in $tm('home.skills.row3')"
                :key="`${i}-${j}`"
                class="marquee__item skill-item"
              >
                <SkillMarqueeIcon
                  v-bind="skill.icon"
                  :label="skill.label"
                />
              </span>
            </template>
          </MarqueeText>
        </div>
        <div
          ref="row4"
          class="home-skills__row"
        >
          <MarqueeText
            :duration="69"
            direction="right"
            :pause-on-hover="true"
            class="home-skills__marquee"
          >
            <template
              v-for="i in 6"
              :key="i"
            >
              <span
                v-for="(skill, j) in $tm('home.skills.row4')"
                :key="`${i}-${j}`"
                class="marquee__item skill-item"
              >
                <SkillMarqueeIcon
                  v-bind="skill.icon"
                  :label="skill.label"
                />
              </span>
            </template>
          </MarqueeText>
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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MarqueeText from "./MarqueeText.vue";
import SkillMarqueeIcon from "./SkillMarqueeIcon.vue";
import { prefersReducedMotion } from "../../utils/lenisGsap";

gsap.registerPlugin(ScrollTrigger);

export default {
  name: "HomeContact",
  components: { MarqueeText, SkillMarqueeIcon },
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
  computed: {
    year() {
      return new Date().getFullYear();
    },
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
    if (this.$refs.rootWrapper) {
      this.observer.observe(this.$refs.rootWrapper);
    }

    if (prefersReducedMotion() || this.disableScrollAnim) return;
    const root = this.$refs.root;
    const r1 = this.$refs.row1;
    const r2 = this.$refs.row2;
    const r3 = this.$refs.row3;
    const r4 = this.$refs.row4;
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        const amp = 140;
        gsap.set(r1, { x: p * amp - amp * 0.5 });
        gsap.set(r2, { x: -(p * amp) + amp * 0.5 });
        gsap.set(r3, { x: p * amp * 0.55 - amp * 0.25 });
        gsap.set(r4, { x: -(p * amp * 0.6) + amp * 0.3 });
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

@media (prefers-reduced-motion: reduce) {
  .fade-in-section {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

.home-contact-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: transparent;
}

.home-skills {
  position: relative;
  padding: 4rem 0 4.5rem;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.skill-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.home-contact {
  padding: 1rem max(1rem, env(safe-area-inset-left)) 2.5rem
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
