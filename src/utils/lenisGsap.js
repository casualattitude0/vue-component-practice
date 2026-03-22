import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function createLenisScroll() {
  if (prefersReducedMotion()) {
    return { destroy: () => {}, lenis: null }
  }
  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  const tickerFn = (time) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)
  const destroy = () => {
    lenis.destroy()
    gsap.ticker.remove(tickerFn)
  }
  return { destroy, lenis }
}
