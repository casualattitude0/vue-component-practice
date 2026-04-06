<template>
  <main class="page notebook-page">
    <PageSiteNav />
    <div class="notebook-page__content">
      <div
        class="notebook-page__binding"
        :style="bindingBackgroundStyle"
        aria-hidden="true"
      />
      <div class="notebook-page__paper">
        <header class="notebook-page__header">
          <h1 class="notebook-page__title">{{ $t('notebookPage.title') }}</h1>
          <p class="notebook-page__lead">{{ $t('notebookPage.lead') }}</p>
        </header>

        <div class="notebook-page__body">
          <p
            v-for="(para, i) in paragraphs"
            :key="i"
            class="notebook-page__para"
          >
            {{ para }}
          </p>
        </div>

        <div
          ref="surfaceEl"
          class="notebook-page__surface"
          :aria-label="$t('notebookPage.surfaceAria')"
        >
          <div
            class="notebook-page__surface-note"
            aria-hidden="true"
          >
            <p
              v-for="(line, i) in surfaceLines"
              :key="i"
              class="notebook-page__surface-line"
            >
              {{ line }}
            </p>
          </div>

          <div
            v-for="item in items"
            :key="item.id"
            class="notebook-page__float"
            :class="floatClass(item)"
            :style="floatStyle(item)"
            @pointerdown="onFloatPointerDown($event, item)"
          >
            <img
              v-if="item.type === 'image'"
              class="notebook-page__float-img"
              :src="item.src"
              alt=""
              draggable="false"
              @load="onFloatImgLoad($event, item)"
            />
            <p
              v-else
              class="notebook-page__float-text"
            >
              {{ $t(item.i18nKey) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import bookHeaderUrl from '@/assets/images/bookheader.png'
import PageSiteNav from '@/components/PageSiteNav.vue'

/** Scrapbook layout: left street, top-right rain, bottom-center swing; captions beside each. */
const NOTEBOOK_ITEMS = [
  {
    id: 'nb-street',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=520&q=80',
    x: 20,
    y: 92,
    w: 228,
    h: 156,
  },
  {
    id: 'nb-rain',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=520&q=80',
    x: 568,
    y: 22,
    w: 196,
    h: 132,
  },
  {
    id: 'nb-swing',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=520&q=80',
    x: 276,
    y: 296,
    w: 236,
    h: 158,
  },
  {
    id: 'cap-street',
    type: 'text',
    i18nKey: 'notebookPage.captionStreet',
    x: 258,
    y: 124,
    w: 176,
    h: 64,
  },
  {
    id: 'cap-rain',
    type: 'text',
    i18nKey: 'notebookPage.captionRain',
    x: 312,
    y: 48,
    w: 220,
    h: 56,
  },
  {
    id: 'cap-swing',
    type: 'text',
    i18nKey: 'notebookPage.captionSwing',
    x: 524,
    y: 340,
    w: 168,
    h: 64,
  },
]

export default {
  name: 'NotebookPage',
  components: { PageSiteNav },
  data() {
    return {
      items: NOTEBOOK_ITEMS.map((row) => ({ ...row })),
      draggingId: null,
      dragPointerId: null,
      dragEl: null,
      dragStart: { x: 0, y: 0, itemX: 0, itemY: 0 },
      resizeObserver: null,
    }
  },
  computed: {
    bindingBackgroundStyle() {
      return { backgroundImage: `url(${bookHeaderUrl})` }
    },
    paragraphs() {
      const raw = this.$tm('notebookPage.paragraphs')
      return Array.isArray(raw) ? raw : []
    },
    surfaceLines() {
      const raw = this.$tm('notebookPage.surfaceLines')
      return Array.isArray(raw) ? raw : []
    },
  },
  mounted() {
    this.$nextTick(() => this.observeSurface())
    window.addEventListener('pointermove', this.onWindowPointerMove)
    window.addEventListener('pointerup', this.onWindowPointerUp)
    window.addEventListener('pointercancel', this.onWindowPointerUp)
  },
  beforeUnmount() {
    window.removeEventListener('pointermove', this.onWindowPointerMove)
    window.removeEventListener('pointerup', this.onWindowPointerUp)
    window.removeEventListener('pointercancel', this.onWindowPointerUp)
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  },
  methods: {
    floatClass(item) {
      return {
        'notebook-page__float--dragging': this.draggingId === item.id,
        'notebook-page__float--text': item.type === 'text',
        'notebook-page__float--image': item.type === 'image',
      }
    },
    observeSurface() {
      const el = this.$refs.surfaceEl
      if (!el || typeof ResizeObserver === 'undefined') return
      this.resizeObserver = new ResizeObserver(() => this.syncSurfaceSize())
      this.resizeObserver.observe(el)
      this.syncSurfaceSize()
    },
    syncSurfaceSize() {
      const el = this.$refs.surfaceEl
      if (!el) return
      const w = el.clientWidth
      const h = el.clientHeight
      for (const item of this.items) {
        const ih = item.type === 'text'
          ? item.h
          : item.h || Math.round(item.w * 0.72)
        const maxX = Math.max(0, w - item.w)
        const maxY = Math.max(0, h - ih)
        item.x = Math.max(0, Math.min(maxX, item.x))
        item.y = Math.max(0, Math.min(maxY, item.y))
      }
    },
    floatStyle(item) {
      return {
        transform: `translate(${item.x}px, ${item.y}px)`,
        width: `${item.w}px`,
      }
    },
    onFloatImgLoad(e, item) {
      if (item.type !== 'image') return
      const img = e.target
      if (!img.naturalWidth) return
      const ratio = img.naturalHeight / img.naturalWidth
      item.h = Math.max(1, Math.round(item.w * ratio))
    },
    onFloatPointerDown(e, item) {
      if (e.button !== 0) return
      e.preventDefault()
      const el = e.currentTarget
      if (el.setPointerCapture) el.setPointerCapture(e.pointerId)
      this.dragEl = el
      this.draggingId = item.id
      this.dragPointerId = e.pointerId
      this.dragStart = {
        x: e.clientX,
        y: e.clientY,
        itemX: item.x,
        itemY: item.y,
      }
    },
    onWindowPointerMove(e) {
      if (!this.draggingId || e.pointerId !== this.dragPointerId) return
      const item = this.items.find((x) => x.id === this.draggingId)
      if (!item) return
      const surface = this.$refs.surfaceEl
      if (!surface) return
      const dx = e.clientX - this.dragStart.x
      const dy = e.clientY - this.dragStart.y
      const nx = this.dragStart.itemX + dx
      const ny = this.dragStart.itemY + dy
      const ih =
        item.type === 'text'
          ? item.h
          : item.h || Math.round(item.w * 0.72)
      const maxX = Math.max(0, surface.clientWidth - item.w)
      const maxY = Math.max(0, surface.clientHeight - ih)
      item.x = Math.max(0, Math.min(maxX, nx))
      item.y = Math.max(0, Math.min(maxY, ny))
    },
    onWindowPointerUp(e) {
      if (!this.draggingId || e.pointerId !== this.dragPointerId) return
      const el = this.dragEl
      if (el && el.releasePointerCapture) {
        try {
          el.releasePointerCapture(e.pointerId)
        } catch (_) {
          /* ignore */
        }
      }
      this.dragEl = null
      this.draggingId = null
      this.dragPointerId = null
    },
  },
}
</script>

<style scoped>
.notebook-page__content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
  margin-top: 0;
}

.notebook-page__binding {
  width: 100%;
  height: 3.75rem;
  margin: 0;
  padding: 0;
  background-repeat: repeat-x;
  background-position: left bottom;
  background-size: auto 100%;
  flex-shrink: 0;
}

.notebook-page__paper {
  flex: 1 1 auto;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 1.5rem max(1rem, env(safe-area-inset-left))
    max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-right));
  background-color: #f2e3cf;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
}

.notebook-page__header {
  max-width: 42rem;
  margin: 0 auto 1rem;
  text-align: center;
}

.notebook-page__title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.notebook-page__lead {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(44, 62, 80, 0.85);
}

.notebook-page__body {
  width: 100%;
  max-width: min(52rem, 100%);
  margin: 0 auto 1.25rem;
}

.notebook-page__para {
  margin: 0 0 0.85rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(44, 62, 80, 0.92);
}

.notebook-page__para:last-child {
  margin-bottom: 0;
}

.notebook-page__surface {
  position: relative;
  flex: 1 1 auto;
  min-height: min(72vh, 620px);
  width: 100%;
  max-width: min(72rem, 100%);
  margin: 0 auto;
  border-radius: 0.75rem;
  background-image: linear-gradient(
      rgba(44, 62, 80, 0.04) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(44, 62, 80, 0.04) 1px, transparent 1px);
  background-size: 100% 1.5rem, 1.5rem 100%;
  background-position: 0 0, 0 0;
  box-shadow: inset 0 0 0 1px rgba(44, 62, 80, 0.1),
    0 8px 28px rgba(44, 62, 80, 0.08);
  overflow: hidden;
  touch-action: none;
}

.notebook-page__surface-note {
  position: absolute;
  inset: 0;
  z-index: 0;
  padding: 0.4rem 1.1rem 1rem;
  pointer-events: none;
}

.notebook-page__surface-line {
  margin: 0;
  max-width: 22rem;
  font-family: "Segoe Print", "Bradley Hand", "Apple Chancery", "Snell Roundhand", cursive;
  font-size: 1.02rem;
  line-height: 1.5rem;
  letter-spacing: 0.03em;
  color: rgba(44, 62, 80, 0.78);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
}

.notebook-page__surface-line:nth-child(1) {
  transform: rotate(-0.7deg);
}

.notebook-page__surface-line:nth-child(2) {
  margin-top: 0.15rem;
  margin-left: 0.35rem;
  transform: rotate(0.5deg);
}

.notebook-page__surface-line:nth-child(3) {
  margin-top: 0.2rem;
  margin-left: -0.15rem;
  transform: rotate(-0.35deg);
}

.notebook-page__float {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  border-radius: 0.4rem;
  box-shadow: 0 6px 20px rgba(44, 62, 80, 0.16);
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.notebook-page__float--image {
  z-index: 1;
  transition: box-shadow 0.32s cubic-bezier(0.34, 1.2, 0.64, 1),
    filter 0.28s ease;
}

.notebook-page__float--image:not(.notebook-page__float--dragging):hover {
  box-shadow:
    0 14px 36px rgba(44, 62, 80, 0.22),
    0 0 0 1px rgba(255, 255, 255, 0.35) inset;
  filter: brightness(1.04);
}

.notebook-page__float--text {
  z-index: 2;
  box-shadow: 0 4px 14px rgba(44, 62, 80, 0.1);
  background: rgba(255, 252, 246, 0.55);
  border: 1px solid rgba(44, 62, 80, 0.1);
  transition: box-shadow 0.28s ease, filter 0.28s ease;
}

.notebook-page__float--text:not(.notebook-page__float--dragging):hover {
  box-shadow: 0 8px 22px rgba(44, 62, 80, 0.14);
  filter: brightness(1.02);
}

.notebook-page__float--text.notebook-page__float--dragging {
  box-shadow: 0 14px 32px rgba(44, 62, 80, 0.2);
  filter: brightness(1.03);
}

.notebook-page__float--dragging {
  z-index: 12;
  cursor: grabbing;
}

.notebook-page__float--image.notebook-page__float--dragging {
  box-shadow:
    0 22px 48px rgba(44, 62, 80, 0.32),
    0 0 0 2px rgba(255, 255, 255, 0.45) inset;
  filter: brightness(1.08) saturate(1.08);
}

.notebook-page__float-img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.4rem;
  pointer-events: none;
  transform-origin: center center;
  transition: transform 0.35s cubic-bezier(0.34, 1.45, 0.64, 1);
}

.notebook-page__float--image:not(.notebook-page__float--dragging):hover .notebook-page__float-img {
  transform: scale(1.03) rotate(1.25deg);
}

.notebook-page__float--image.notebook-page__float--dragging .notebook-page__float-img {
  transform: scale(1.045) rotate(2.25deg);
  transition: transform 0.12s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .notebook-page__float--image,
  .notebook-page__float-img,
  .notebook-page__float-text {
    transition: none;
  }

  .notebook-page__float--image:not(.notebook-page__float--dragging):hover {
    filter: none;
  }

  .notebook-page__float--image:not(.notebook-page__float--dragging):hover .notebook-page__float-img {
    transform: none;
  }

  .notebook-page__float--image.notebook-page__float--dragging .notebook-page__float-img {
    transform: none;
  }

  .notebook-page__float--text:not(.notebook-page__float--dragging):hover .notebook-page__float-text,
  .notebook-page__float--text.notebook-page__float--dragging .notebook-page__float-text {
    transform: none;
  }

  .notebook-page__float--text:not(.notebook-page__float--dragging):hover {
    filter: none;
    box-shadow: 0 4px 14px rgba(44, 62, 80, 0.1);
  }

  .notebook-page__float--text.notebook-page__float--dragging {
    filter: none;
    box-shadow: 0 4px 14px rgba(44, 62, 80, 0.1);
  }
}

.notebook-page__float-text {
  margin: 0;
  padding: 0.5rem 0.55rem;
  box-sizing: border-box;
  font-family: "Segoe Print", "Bradley Hand", "Apple Chancery", cursive;
  font-size: 0.84rem;
  line-height: 1.35;
  letter-spacing: 0.02em;
  color: rgba(44, 62, 80, 0.82);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
  transform-origin: center center;
  transition: transform 0.32s cubic-bezier(0.34, 1.35, 0.64, 1);
}

.notebook-page__float--text:not(.notebook-page__float--dragging):hover .notebook-page__float-text {
  transform: rotate(-0.9deg);
}

.notebook-page__float--text.notebook-page__float--dragging .notebook-page__float-text {
  transform: rotate(-1.6deg);
  transition: transform 0.12s ease-out;
}
</style>
