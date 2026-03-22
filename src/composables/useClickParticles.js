const LINE_COUNT = 4
const LENGTH = 30
const START_OFFSET = 10
const CURVE_AMOUNT = 10
const ANGLE_SPREAD = 180
const BASE_ANGLE = -90
const DURATION_MS = 600
const REVEAL_PHASE = 0.35
const THROTTLE_MS = 120
const STROKE_WIDTH = 3
const COLOR = 'rgba(255, 221, 100, 0.85)'
const SEGMENTS = 60

function sampleCubic(p0, p1, p2, p3, t) {
  const u = 1 - t
  const u2 = u * u
  const u3 = u2 * u
  const t2 = t * t
  const t3 = t2 * t
  return {
    x: u3 * p0.x + 3 * u2 * t * p1.x + 3 * u * t2 * p2.x + t3 * p3.x,
    y: u3 * p0.y + 3 * u2 * t * p1.y + 3 * u * t2 * p2.y + t3 * p3.y,
  }
}

function buildCurvePoints(cx, cy, angle) {
  const rad = (angle * Math.PI) / 180
  const dirX = Math.cos(rad)
  const dirY = Math.sin(rad)
  const perpX = -dirY
  const perpY = dirX
  const p0 = {
    x: cx + START_OFFSET * dirX,
    y: cy + START_OFFSET * dirY,
  }
  const p3 = {
    x: cx + LENGTH * dirX,
    y: cy + LENGTH * dirY,
  }
  const p1 = {
    x: p0.x + (p3.x - p0.x) * 0.33 + perpX * CURVE_AMOUNT,
    y: p0.y + (p3.y - p0.y) * 0.33 + perpY * CURVE_AMOUNT,
  }
  const p2 = {
    x: p0.x + (p3.x - p0.x) * 0.66 - perpX * CURVE_AMOUNT,
    y: p0.y + (p3.y - p0.y) * 0.66 - perpY * CURVE_AMOUNT,
  }
  const points = []
  let totalLen = 0
  let prev = p0
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS
    const pt = sampleCubic(p0, p1, p2, p3, t)
    totalLen += Math.hypot(pt.x - prev.x, pt.y - prev.y)
    points.push({ ...pt, dist: totalLen })
    prev = pt
  }
  return { points, totalLen }
}

let burstHandler = null

export function triggerParticleBurst(x, y) {
  burstHandler?.(x, y)
}

export function useClickParticles() {
  let canvas
  let ctx
  let bursts = []
  let rafId
  let lastClick = 0

  function createBurst(x, y) {
    const lines = []
    const startAngle = BASE_ANGLE - ANGLE_SPREAD / 2
    for (let i = 0; i < LINE_COUNT; i++) {
      const angle = startAngle + (ANGLE_SPREAD / (LINE_COUNT - 1)) * i + (Math.random() - 0.5) * 8
      lines.push(buildCurvePoints(x, y, angle))
    }
    bursts.push({ x, y, lines, createdAt: performance.now() })
  }

  function tick() {
    if (!ctx || !canvas) return
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)
    const now = performance.now()

    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i]
      const age = now - b.createdAt
      if (age >= DURATION_MS) {
        bursts.splice(i, 1)
        continue
      }
      const progress = age / DURATION_MS
      const isReveal = progress < REVEAL_PHASE

      ctx.strokeStyle = COLOR
      ctx.lineWidth = STROKE_WIDTH
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (const { points, totalLen } of b.lines) {
        let started = false
        ctx.beginPath()
        if (isReveal) {
          const revealDist = (progress / REVEAL_PHASE) * totalLen
          for (let j = 0; j < points.length; j++) {
            if (points[j].dist > revealDist) continue
            const pt = points[j]
            if (!started) {
              ctx.moveTo(pt.x, pt.y)
              started = true
            } else {
              ctx.lineTo(pt.x, pt.y)
            }
          }
        } else {
          const disappearProgress = (progress - REVEAL_PHASE) / (1 - REVEAL_PHASE)
          const cutoffDist = disappearProgress * disappearProgress * totalLen
          for (let j = 0; j < points.length; j++) {
            if (points[j].dist < cutoffDist) continue
            const pt = points[j]
            if (!started) {
              ctx.moveTo(pt.x, pt.y)
              started = true
            } else {
              ctx.lineTo(pt.x, pt.y)
            }
          }
        }
        ctx.stroke()
      }
    }
    rafId = requestAnimationFrame(tick)
  }

  function onClick(e) {
    const now = Date.now()
    if (now - lastClick < THROTTLE_MS) return
    lastClick = now
    createBurst(e.clientX, e.clientY)
  }

  function burstAt(x, y) {
    createBurst(x, y)
  }

  function start() {
    canvas = document.createElement('canvas')
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    ctx = canvas.getContext('2d')
    burstHandler = burstAt

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    })
    document.addEventListener('click', onClick)
    rafId = requestAnimationFrame(tick)
  }

  function stop() {
    document.removeEventListener('click', onClick)
    burstHandler = null
    if (rafId) cancelAnimationFrame(rafId)
    if (canvas?.parentNode) canvas.parentNode.removeChild(canvas)
    bursts = []
  }

  return { start, stop }
}
