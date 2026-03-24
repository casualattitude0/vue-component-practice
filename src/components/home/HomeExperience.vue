<template>
  <section
    id="home-experience"
    ref="root"
    class="home-exp fade-in-section"
    :class="{ 'is-visible': isVisible }"
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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../utils/lenisGsap";

gsap.registerPlugin(ScrollTrigger);

export default {
  name: "HomeExperience",
  props: {
    disableScrollAnim: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      enterTween: null,
      isVisible: false,
      observer: null,
    };
  },
  computed: {
    bullets() {
      return this.$tm("home.experience.bullets");
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
    if (this.$refs.root) {
      this.observer.observe(this.$refs.root);
    }

    const panel = this.$refs.panel;
    const root = this.$refs.root;
    if (prefersReducedMotion() || this.disableScrollAnim) return;
    this.enterTween = gsap.fromTo(
      panel,
      { x: -96, opacity: 0.2, rotateY: 10 },
      {
        x: 0,
        opacity: 1,
        rotateY: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "top 32%",
          scrub: 0.65,
        },
      }
    );
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.enterTween) {
      this.enterTween.kill();
      this.enterTween = null;
    }
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

.home-exp {
  position: relative;
  padding: clamp(1.5rem, 4vw, 3rem) max(0.85rem, env(safe-area-inset-left))
    clamp(1.5rem, 4vw, 3rem) max(0.85rem, env(safe-area-inset-right));
  background: transparent;
  perspective: 900px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-exp__panel {
  max-width: min(72rem, 100%);
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  column-gap: clamp(0.875rem, 1.75vw, 1.25rem);
  row-gap: clamp(1rem, 2vw, 1.35rem);
  align-items: start;
  align-content: start;
  transform-style: preserve-3d;
  flex: 1;
  min-height: 0;
}

.home-exp__copy {
  min-width: 0;
}

.home-exp__visual {
  width: 100%;
  min-height: clamp(140px, 28vw, 200px);
  align-self: start;
  border-radius: 4px;
  background: repeating-linear-gradient(
    45deg,
    #e8e8e8,
    #e8e8e8 8px,
    #f0f0f0 8px,
    #f0f0f0 16px
  );
  border: 2px dashed #999;
  box-shadow: none;
  transition: transform 0.3s ease;
}

.home-exp__visual:hover {
  transform: rotate(5deg);
}

.home-exp__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.2rem, 2.8vw, 1.85rem);
  font-weight: 800;
  color: #000;
}

.home-exp__role {
  margin: 0 0 0.75rem;
  font-size: clamp(0.95rem, 1.6vw, 1.05rem);
  font-weight: 600;
  color: #333;
}

.home-exp__list {
  margin: 0;
  padding-left: 1.15rem;
  line-height: 1.55;
  color: #444;
  font-size: clamp(0.875rem, 1.5vw, 0.95rem);
  overflow-wrap: anywhere;
}

@media (max-width: 1024px) {
  .home-exp__panel {
    column-gap: 1rem;
    row-gap: 1.2rem;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  }
}

@media (max-width: 767.98px) {
  .home-exp {
    perspective: none;
  }

  .home-exp__panel {
    grid-template-columns: 1fr;
    row-gap: 1rem;
    column-gap: 0;
  }

  .home-exp__visual {
    min-height: clamp(120px, 32vw, 160px);
    max-height: 220px;
  }
}

@media (max-width: 480px) {
  .home-exp {
    padding: 1.15rem max(0.65rem, env(safe-area-inset-left)) 1.15rem
      max(0.65rem, env(safe-area-inset-right));
  }

  .home-exp__panel {
    row-gap: 0.85rem;
  }

  .home-exp__title {
    font-size: clamp(1.1rem, 5.2vw, 1.35rem);
  }

  .home-exp__role {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }

  .home-exp__list {
    padding-left: 1rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .home-exp__visual {
    min-height: 112px;
    max-height: none;
  }
}
</style>
