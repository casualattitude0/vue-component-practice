<template>
  <section
    id="home-about"
    class="ha"
    aria-labelledby="ha-title"
  >
    <div
      ref="stickyRef"
      class="ha__sticky"
    >
      <div class="ha__head">
        <h2
          id="ha-title"
          class="ha__title"
        >
          {{ $t('home.about.title') }}
        </h2>
      </div>
      <div class="ha__tl-wrap">
        <div
          ref="tlInnerRef"
          class="ha__tl-inner"
        >
          <div class="ha__line" />
          <div
            ref="iconRef"
            class="ha__icon"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="17"
              />
              <polyline points="7 12 12 17 17 12" />
            </svg>
          </div>
          <div
            v-for="(card, i) in cards"
            :key="i"
            :ref="el => setCardRef(el, i)"
            class="ha__node"
            :class="[i % 2 === 0 ? 'ha__node--left' : 'ha__node--right', COLORS[i]]"
            :style="{ '--nt': CARD_TOPS[i] + '%' }"
          >
            <div class="ha__node__connector" />
            <div class="ha__node__dot" />
            <div class="ha__node__panel">
              <h3 class="ha__node__title">{{ card.title }}</h3>
              <p class="ha__node__body">{{ card.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CARD_TOPS = [20, 50, 80]
const CARD_PROGRESS = [0.2, 0.5, 0.8]
const COLORS = ['ha__node--blue', 'ha__node--purple', 'ha__node--green']

export default {
  name: 'HomeAbout',
  setup() {
    const stickyRef = ref(null)
    const tlInnerRef = ref(null)
    const iconRef = ref(null)
    const cardRefs = ref([])
    let stTrigger = null
    let lastNearestIdx = -1

    function setCardRef(el, i) {
      if (el) cardRefs.value[i] = el
    }

    onMounted(() => {
      const sticky = stickyRef.value
      const icon = iconRef.value
      if (!sticky || !icon) return

      stTrigger = ScrollTrigger.create({
        trigger: sticky,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        start: 'top top',
        end: '+=300%',
        scrub: true,
        onUpdate(self) {
          const p = self.progress
          icon.style.top = `${p * 100}%`
          icon.style.transform = `translate(-50%, -50%) rotate(${self.direction === -1 ? 180 : 0}deg)`

          let nearestIdx = 0
          let minDist = 1
          CARD_PROGRESS.forEach((cp, i) => {
            const d = Math.abs(p - cp)
            if (d < minDist) { minDist = d; nearestIdx = i }
          })

          if (nearestIdx !== lastNearestIdx) {
            lastNearestIdx = nearestIdx
            cardRefs.value.forEach((el, i) => {
              if (el) gsap.to(el, { scale: i === nearestIdx ? 1.15 : 1, duration: 0.25, ease: 'power2.out' })
            })
          }
        },
      })
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    onUnmounted(() => {
      stTrigger?.kill()
      stTrigger = null
    })

    return { stickyRef, tlInnerRef, iconRef, CARD_TOPS, COLORS, setCardRef }
  },
  computed: {
    cards() {
      return this.$tm('home.about.cards')
    },
  },
}
</script>

<style scoped>
.ha {
  position: relative;
  background: #fff;
}

.ha__sticky {
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.ha__head {
  flex: 0 0 auto;
  padding: 2.5rem 2rem 0.5rem;
  text-align: center;
}

.ha__title {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #1a2530;
}

.ha__tl-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ha__tl-inner {
  position: relative;
  width: min(480px, 90vw);
  height: 75%;
  overflow: visible;
}

.ha__line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  transform: translateX(-50%);
  background: linear-gradient(to bottom, #dde3ec, #4a5568, #dde3ec);
  border-radius: 2px;
}

.ha__icon {
  position: absolute;
  left: 50%;
  top: 0%;
  width: 36px;
  height: 36px;
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
  will-change: transform, top;
}

.ha__icon svg {
  width: 20px;
  height: 20px;
  color: #333;
}

.ha__node {
  position: absolute;
  left: 50%;
  top: var(--nt, 50%);
  transform: translate(-50%, -50%);
  z-index: 1;
}

.ha__node__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: currentColor;
  box-shadow: 0 0 0 3px #fff;
}

.ha__node__connector {
  position: absolute;
  left: 50%;
  top: 50%;
  width: max(40px, 12vw);
  height: 0;
  border-top: 2px dashed currentColor;
  pointer-events: none;
}

.ha__node--left .ha__node__connector {
  transform: translate(-100%, -50%);
}

.ha__node--right .ha__node__connector {
  transform: translate(0, -50%);
}

.ha__node__panel {
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 12px 16px;
  min-width: 150px;
  max-width: 200px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.ha__node--left .ha__node__panel {
  transform: translate(calc(-100% - max(32px, 12vw)), -50%);
}

.ha__node--right .ha__node__panel {
  transform: translate(max(32px, 12vw), -50%);
}

.ha__node__title {
  margin: 0 0 4px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #243241;
}

.ha__node__body {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: #556575;
}

.ha__node--blue { color: #3080c0; }
.ha__node--purple { color: #7040b0; }
.ha__node--green { color: #2a8a60; }

@media (max-width: 600px) {
  .ha__node__connector {
    width: 28px;
  }

  .ha__node__panel {
    min-width: 110px;
    max-width: 140px;
    padding: 8px 10px;
  }

  .ha__node--left .ha__node__panel {
    transform: translate(calc(-100% - 20px), -50%);
  }

  .ha__node--right .ha__node__panel {
    transform: translate(20px, -50%);
  }
}
</style>
