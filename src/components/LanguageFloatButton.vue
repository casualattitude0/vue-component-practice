<script setup>
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale'

const { locale, supportedLocales, setLocale } = useLocale()

const pulse = ref(false)

const current = computed(() => {
  return (
    supportedLocales.find((l) => l.code === locale.value) ?? supportedLocales[0]
  )
})

const target = computed(() => {
  const other = supportedLocales.find((l) => l.code !== locale.value)
  return other ?? supportedLocales[0]
})

function onClick() {
  setLocale(target.value.code)
  pulse.value = false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(() => {
      pulse.value = true
      window.setTimeout(() => {
        pulse.value = false
      }, 280)
    })
    return
  }
  requestAnimationFrame(() => {
    pulse.value = true
  })
}

function onPulseEnd(event) {
  if (event.animationName === 'lang-float-pulse') {
    pulse.value = false
  }
}
</script>

<template>
  <button
    type="button"
    class="lang-float"
    :class="{ 'lang-float--pulse': pulse }"
    :aria-label="$t('langSwitcher.aria', { lang: target.name })"
    @click="onClick"
    @animationend="onPulseEnd"
  >
    <span class="lang-float__label">{{ current.abbr }}</span>
  </button>
</template>

<style scoped>
.lang-float {
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 1px solid rgba(44, 62, 80, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  color: #2c3e50;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.02em;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    background-color 0.2s ease;
}

.lang-float__label {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.lang-float:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: rgba(44, 62, 80, 0.35);
}

.lang-float:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.lang-float:active {
  transform: translateY(0) scale(0.94);
  transition-duration: 0.08s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.14);
}

@keyframes lang-float-pulse {
  0% {
    box-shadow:
      0 2px 10px rgba(0, 0, 0, 0.08),
      0 0 0 0 rgba(66, 184, 131, 0.45);
  }
  55% {
    box-shadow:
      0 3px 14px rgba(0, 0, 0, 0.08),
      0 0 0 10px rgba(66, 184, 131, 0);
  }
  100% {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  }
}

.lang-float--pulse {
  animation: lang-float-pulse 0.55s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .lang-float {
    transition: border-color 0.15s ease;
  }

  .lang-float:hover {
    transform: none;
  }

  .lang-float:active {
    transform: none;
    transition-duration: 0s;
  }

  .lang-float--pulse {
    animation: none;
    border-color: rgba(66, 184, 131, 0.65);
    transition: border-color 0.25s ease;
  }
}
</style>
