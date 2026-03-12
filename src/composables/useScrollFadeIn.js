import { ref, onMounted, onUnmounted } from 'vue'

const defaultOptions = {
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1,
}

export function useScrollFadeIn(options = {}) {
  const elRef = ref(null)
  const isVisible = ref(false)
  const opts = { ...defaultOptions, ...options }

  let observer = null
  onMounted(() => {
    const el = elRef.value
    if (!el) return
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) isVisible.value = true
        })
      },
      { rootMargin: opts.rootMargin, threshold: opts.threshold }
    )
    observer.observe(el)
  })
  onUnmounted(() => observer?.disconnect())

  return { elRef, isVisible }
}
